const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other'], 
      required: true 
    },
    weight: Number, // in kg
    height: Number, // in cm
    bmi: Number
  },
  symptoms: [{
    name: String,
    severity: { 
      type: String, 
      enum: ['mild', 'moderate', 'severe'] 
    },
    duration: String
  }],
  vitalSigns: {
    bloodPressureSystolic: Number,
    bloodPressureDiastolic: Number,
    pulseRate: Number,
    temperature: Number,
    spo2: Number
  },
  labValues: {
    bloodGlucoseFasting: Number,
    bloodGlucosePP: Number,
    hba1c: Number,
    totalCholesterol: Number,
    hdl: Number,
    ldl: Number,
    triglycerides: Number,
    hemoglobin: Number,
    wbc: Number,
    creatinine: Number,
    urea: Number,
    sgot: Number,
    sgpt: Number,
    bilirubin: Number,
    tsh: Number
  },
  lifestyle: {
    smoking: { 
      type: String, 
      enum: ['never', 'former', 'current'] 
    },
    alcohol: { 
      type: String, 
      enum: ['never', 'occasional', 'regular'] 
    },
    exercise: { 
      type: String, 
      enum: ['sedentary', 'light', 'moderate', 'active'] 
    },
    diet: { 
      type: String, 
      enum: ['vegetarian', 'non-veg', 'vegan'] 
    },
    sleepHours: Number,
    stressLevel: { 
      type: String, 
      enum: ['low', 'medium', 'high'] 
    }
  },
  familyHistory: [String],
  reportFileUrl: {
    type: String,
    default: null
  },
  reportExtractedData: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', patientSchema);
