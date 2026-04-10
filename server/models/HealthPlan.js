const mongoose = require('mongoose');

const healthPlanSchema = new mongoose.Schema({
  predictionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  disease: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true
  },
  plan: {
    overcome_tips: [Object],
    pros_of_early_detection: [Object],
    cons_of_ignoring: [Object],
    recommended_foods: [Object],
    recommended_fruits: [Object],
    recommended_vegetables: [Object],
    foods_to_avoid: [Object],
    dos: [Object],
    donts: [Object],
    exercise_plan: [Object],
    lifestyle_changes: [Object],
    warning_signs: [Object],
    monthly_checkups: [Object]
  },
  exercisesWithVideos: [{
    name: String,
    duration: String,
    frequency: String,
    intensity: String,
    benefit: String,
    emoji: String,
    best_time: String,
    video: {
      videoId: String,
      title: String,
      thumbnail: String,
      channel: String,
      url: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthPlan', healthPlanSchema);
