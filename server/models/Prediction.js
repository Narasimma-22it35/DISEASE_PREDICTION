const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  primaryDisease: {
    name: String,
    riskPercentage: Number,
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    },
    confidence: Number,
    mlUsed: {
      type: Boolean,
      default: false
    },
    mlModelKey: String,
    matchingSymptoms: [String]
  },
  otherDiseases: [{
    name: String,
    riskPercentage: Number,
    severity: String,
    reason: String
  }],
  overallHealthScore: {
    type: Number,
    min: 0,
    max: 100
  },
  urgentAttentionNeeded: {
    type: Boolean,
    default: false
  },
  urgentReason: {
    type: String,
    default: null
  },
  recommendedTests: [String],
  specialistReferral: String,
  topFactors: [{
    feature: String,
    importance: Number
  }],
  inputMethod: {
    type: String,
    enum: ['manual', 'report_upload']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
