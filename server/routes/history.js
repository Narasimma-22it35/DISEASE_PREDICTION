const express = require('express');
const Prediction = require('../models/Prediction');
const HealthPlan = require('../models/HealthPlan');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/history
 * @desc    Get paginated prediction history for current user
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = { userId: req.user.id };
  
  // Optional filters
  if (req.query.disease) {
      filters['primaryDisease.name'] = { $regex: req.query.disease, $options: 'i' };
  }
  if (req.query.riskLevel) {
      filters['primaryDisease.severity'] = req.query.riskLevel;
  }

  try {
    const totalCount = await Prediction.countDocuments(filters);
    const predictions = await Prediction.find(filters)
      .populate('patientId', 'personalInfo')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      predictions,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/history/:predictionId
 * @desc    Get detailed record for a single prediction including health plan
 * @access  Private
 */
router.get('/:predictionId', protect, async (req, res) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.predictionId,
      userId: req.user.id
    }).populate('patientId');

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction record not found' });
    }

    // Attempt to find associated health plan
    const healthPlan = await HealthPlan.findOne({
      predictionId: prediction._id,
      userId: req.user.id
    });

    res.json({
      prediction,
      healthPlan: healthPlan || null
    });
  } catch (error) {
    console.error('Single record fetch error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/history/:predictionId
 * @desc    Delete a prediction record and its associated health plan
 * @access  Private
 */
router.post('/delete/:predictionId', protect, async (req, res) => {
    // Note: Using POST for delete here as requested usually in some environments, or I'll use router.delete
    // The prompt says DELETE /api/history/:predictionId, so I'll use router.delete.
});

// Since the prompt explicitly says DELETE /api/history/:predictionId I'll use .delete
router.delete('/:predictionId', protect, async (req, res) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.predictionId,
      userId: req.user.id
    });

    if (!prediction) {
      return res.status(404).json({ message: 'Record not found or unauthorized' });
    }

    // Delete associated health plan
    await HealthPlan.deleteMany({ predictionId: prediction._id });
    
    // Delete the prediction
    await Prediction.findByIdAndDelete(prediction._id);

    res.json({ success: true, message: 'Health record deleted successfully' });
  } catch (error) {
    console.error('Record deletion error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
