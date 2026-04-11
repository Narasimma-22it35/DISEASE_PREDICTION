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

  try {
    // 2. Save/Update Patient in MongoDB
    let patient = await Patient.findOne({ userId: req.user.id });
    
    if (patient) {
      patient.personalInfo = personalInfo;
      patient.symptoms = symptoms;
      patient.vitalSigns = vitalSigns;
      patient.labValues = labValues;
      patient.lifestyle = lifestyle;
      patient.familyHistory = familyHistory;
      await patient.save();
    } else {
      patient = new Patient({
        userId: req.user.id,
        personalInfo,
        symptoms,
        vitalSigns,
        labValues,
        lifestyle,
        familyHistory
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
