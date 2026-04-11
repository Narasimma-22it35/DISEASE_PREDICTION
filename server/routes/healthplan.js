const express = require('express');
const axios = require('axios');
const HealthPlan = require('../models/HealthPlan');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @desc    Fetch YouTube video for a given query
 */
async function getYouTubeVideo(query) {
  if (!process.env.YOUTUBE_API_KEY) return null;
  
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
    return null;
  } catch (error) {
    console.error(`YouTube API error for query "${query}":`, error.message);
    return null;
  }
}

/**
 * @route   POST /api/healthplan/generate
 * @desc    Generate health plan and enrich with YouTube tutorials
 * @access  Private
 */
router.post('/generate', protect, async (req, res) => {
  const { predictionId, disease, riskLevel, severity, patientData } = req.body;

  if (!predictionId || !disease) {
    return res.status(400).json({ message: 'Prediction ID and disease are required' });
  }

  try {
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
      delete planData.exercise_plan; // Clean up the original
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
    const plan = await HealthPlan.findOne({ 
      predictionId: req.params.predictionId,
      userId: req.user.id 
    });

    if (!plan) {
      return res.status(404).json({ message: 'Health plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Fetch plan error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
