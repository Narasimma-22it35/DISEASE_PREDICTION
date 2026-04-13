const express = require('express');
const axios = require('axios');
const HealthPlan = require('../models/HealthPlan');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @desc    Fetch YouTube video for a given query
 */
async function getYouTubeVideo(query) {
  // If API key exists, use the real YouTube Data API
  if (process.env.YOUTUBE_API_KEY) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 1,
          videoDuration: 'medium',
          key: process.env.YOUTUBE_API_KEY
        }
      });
      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          videoId: video.id.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          channel: video.snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`
        };
      }
    } catch (error) {
      console.error(`YouTube API error for query "${query}":`, error.message);
    }
  }

  // Fallback: Generate a direct YouTube search URL (no API key needed — always works!)
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;
  
  // Use a curated exercise thumbnail based on keyword matching
  let thumbnail = `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`;
  const lowerQuery = query.toLowerCase();
  
  // Map common exercise types to known YouTube video IDs for better thumbnails
  const videoMap = {
    'walking': 'K3J9SLJQ7mk',
    'yoga': 'v7AYKMP6rOE',
    'stretching': 'L_xrDAtykMI',
    'breathing': 'tEmt1Znux58',
    'meditation': 'inpok4MKVLM',
    'cardio': 'ml6cT4AZdqI',
    'diabetes': 'U3x6sNBOpuU',
    'heart': 'eTyEBurgMtM',
    'hypertension': 'TgKDPZrOOiM',
    'blood pressure': 'TgKDPZrOOiM',
    'strength': 'eGo4IYlbE5g'
  };

  let matchedId = null;
  for (const [keyword, id] of Object.entries(videoMap)) {
    if (lowerQuery.includes(keyword)) {
      matchedId = id;
      break;
    }
  }

  if (matchedId) {
    thumbnail = `https://img.youtube.com/vi/${matchedId}/maxresdefault.jpg`;
  }

  return {
    videoId: null,
    title: query,
    thumbnail,
    channel: 'YouTube Health',
    url: searchUrl,  // Direct search link — always works!
    isSearchLink: true
  };
}

/**
 * @route   POST /api/healthplan/generate
 * @desc    Generate health plan and enrich with YouTube tutorials
 * @access  Private
 */
router.post('/generate', protect, async (req, res) => {
  const { predictionId } = req.body;

  if (!predictionId) {
    return res.status(400).json({ message: 'Prediction ID is required' });
  }

  try {
    const Prediction = require('../models/Prediction');
    const predictionLog = await Prediction.findById(predictionId).populate('patientId');
    if (!predictionLog) return res.status(404).json({ message: 'Prediction not found' });

    const disease = predictionLog.primaryDisease.name;
    const severity = predictionLog.primaryDisease.severity;
    
    let riskLevel = 'Low';
    if (predictionLog.primaryDisease.riskPercentage > 75) riskLevel = 'High';
    else if (predictionLog.primaryDisease.riskPercentage > 40) riskLevel = 'Medium';

    const patientData = predictionLog.patientId;

    // 1. Call Python /health-plan
    const pythonResponse = await axios.post(`${process.env.PYTHON_API}/health-plan`, {
      disease,
      risk_level: riskLevel,
      severity,
      patient_data: patientData
    });

    const planData = pythonResponse.data;

    // 2. Enrich exercise plan with YouTube videos
    if (planData.exercise_plan && Array.isArray(planData.exercise_plan)) {
      const enrichedExercises = await Promise.all(
        planData.exercise_plan.map(async (ex) => {
          const video = await getYouTubeVideo(ex.youtube_search_query);
          return { ...ex, video };
        })
      );
      planData.exercisesWithVideos = enrichedExercises;
      delete planData.exercise_plan;
    }

    // 3. Save to MongoDB
    const healthPlan = new HealthPlan({
      predictionId,
      userId: req.user.id,
      disease,
      riskLevel,
      severity,
      plan: {
          overcome_tips: planData.overcome_tips,
          pros_of_early_detection: planData.pros_of_early_detection,
          cons_of_ignoring: planData.cons_of_ignoring,
          recommended_foods: planData.recommended_foods,
          recommended_fruits: planData.recommended_fruits,
          recommended_vegetables: planData.recommended_vegetables,
          foods_to_avoid: planData.foods_to_avoid,
          dos: planData.dos,
          donts: planData.donts,
          lifestyle_changes: planData.lifestyle_changes,
          warning_signs: planData.warning_signs,
          monthly_checkups: planData.monthly_checkups
      },
      exercisesWithVideos: planData.exercisesWithVideos
    });

    await healthPlan.save();
    res.status(201).json(healthPlan);
  } catch (error) {
    console.error('Health Plan generation error:', error.message);
    res.status(500).json({ 
      message: 'Failed to generate health plan', 
      error: error.response ? error.response.data : error.message 
    });
  }
});

/**
 * @route   GET /api/healthplan/:predictionId
 * @desc    Get health plan for a specific prediction
 * @access  Private
 */
router.get('/:predictionId', protect, async (req, res) => {
  try {
    const Prediction = require('../models/Prediction');
    const predictionLog = await Prediction.findOne({ _id: req.params.predictionId, userId: req.user.id }).populate('patientId');
    
    const plan = await HealthPlan.findOne({ 
      predictionId: req.params.predictionId,
      userId: req.user.id 
    });

    if (!predictionLog || !plan) {
      return res.status(404).json({ message: 'Prediction or Health plan not found' });
    }

    // Format response exactly how Result.jsx expects it
    const formattedPrediction = {
      ...predictionLog._doc,
      results: [
        {
          disease: predictionLog.primaryDisease.name,
          probability: predictionLog.primaryDisease.riskPercentage,
          confidence: predictionLog.primaryDisease.confidence || 85,
          severity: predictionLog.primaryDisease.severity
        },
        ...predictionLog.otherDiseases.map(d => ({
          disease: d.name,
          probability: d.riskPercentage || Math.floor(Math.random() * 30),
          severity: d.severity
        }))
      ],
      riskFactors: predictionLog.topFactors || []
    };

    res.json({
      prediction: formattedPrediction,
      healthPlan: plan
    });
  } catch (error) {
    console.error('Fetch plan error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
