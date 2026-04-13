const express = require('express');
const axios = require('axios');
const Patient = require('../models/Patient');
const Prediction = require('../models/Prediction');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/analyze
 * @desc    Analyze patient data for diseases
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  const { personalInfo, symptoms, vitalSigns, labValues, lifestyle, familyHistory } = req.body;

  // 1. Basic Validation
  if (!personalInfo || !personalInfo.name || !personalInfo.age || !personalInfo.gender) {
    return res.status(400).json({ message: 'Personal info (name, age, gender) is required' });
  }

  // Normalize enums for MongoDB Patient schema constraints
  if (personalInfo.gender) personalInfo.gender = personalInfo.gender.toLowerCase();
  
  if (lifestyle) {
    if (lifestyle.smoking) lifestyle.smoking = lifestyle.smoking.toLowerCase();
    if (lifestyle.alcohol) lifestyle.alcohol = lifestyle.alcohol.toLowerCase();
    if (lifestyle.exercise) lifestyle.exercise = lifestyle.exercise.toLowerCase();
    if (lifestyle.diet) lifestyle.diet = lifestyle.diet.toLowerCase();
    if (lifestyle.stressLevel) lifestyle.stressLevel = lifestyle.stressLevel.toLowerCase();
  }

  // Normalize family history from object of booleans to array of strings
  let formattedFamilyHistory = familyHistory;
  if (familyHistory && !Array.isArray(familyHistory) && typeof familyHistory === 'object') {
    formattedFamilyHistory = Object.keys(familyHistory).filter(key => familyHistory[key]);
  }

  // Normalize symptoms from arrays/objects to Mongoose Subdocument Schema
  let formattedSymptoms = [];
  if (Array.isArray(symptoms)) {
    if (symptoms.length > 0 && typeof symptoms[0] === 'string') {
      const details = req.body.symptomDetails || {};
      formattedSymptoms = symptoms.map(s => ({
        name: s,
        severity: details[s] && details[s].severity ? details[s].severity.toLowerCase() : undefined,
        duration: details[s] && details[s].duration ? details[s].duration : undefined
      }));
    } else {
      formattedSymptoms = symptoms;
    }
  }

  try {
    // 2. Save/Update Patient in MongoDB
    let patient = await Patient.findOne({ userId: req.user.id });
    
    if (patient) {
      patient.personalInfo = personalInfo;
      patient.symptoms = formattedSymptoms;
      patient.vitalSigns = vitalSigns;
      patient.labValues = labValues;
      patient.lifestyle = lifestyle;
      patient.familyHistory = formattedFamilyHistory;
      await patient.save();
    } else {
      patient = new Patient({
        userId: req.user.id,
        personalInfo,
        symptoms: formattedSymptoms,
        vitalSigns,
        labValues,
        lifestyle,
        familyHistory: formattedFamilyHistory
      });
      await patient.save();
    }

    // 3. Call Python /detect-diseases
    const pythonResponse = await axios.post(`${process.env.PYTHON_API}/detect-diseases`, req.body);
    const diagnosis = pythonResponse.data;

    // 4. Save Prediction to MongoDB
    const prediction = new Prediction({
      patientId: patient._id,
      userId: req.user.id,
      primaryDisease: diagnosis.primary_disease,
      otherDiseases: diagnosis.other_diseases,
      overallHealthScore: diagnosis.overall_health_score,
      urgentAttentionNeeded: diagnosis.urgent_attention_needed,
      urgentReason: diagnosis.urgent_reason,
      recommendedTests: diagnosis.recommended_tests,
      specialistReferral: diagnosis.specialist_referral,
      inputMethod: req.body.inputMethod || 'manual'
    });

    await prediction.save();

    // 5. Emit socket event if io is available
    const io = req.app.get('io');
    if (io) {
      io.emit('new_prediction', { 
        userId: req.user.id, 
        predictionId: prediction._id,
        disease: diagnosis.primary_disease.name 
      });
    }

    // 6. Return Result
    res.status(201).json({
      patientId: patient._id,
      predictionId: prediction._id,
      ...diagnosis
    });

  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ 
      message: 'Analysis failed', 
      error: error.response ? error.response.data : error.message 
    });
  }
});

module.exports = router;
