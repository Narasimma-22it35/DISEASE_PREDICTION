import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiCheck, HiInformationCircle, HiHeart, HiBeaker, HiScale, HiClock, HiSave } from 'react-icons/hi';
import toast from 'react-hot-toast';
import SymptomSelector from '../components/SymptomSelector';

const SymptomForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const extractedData = location.state?.extractedData;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      age: '',
      gender: 'Male',
      weight: '',
      height: '',
    },
    symptoms: [],
    symptomDetails: {}, // { "Fatigue": { severity: "mild", duration: "2 days" } }
    otherSymptoms: '',
    vitalSigns: {
      systolicBP: '',
      diastolicBP: '',
      pulseRate: '',
      temperature: '',
      spo2: '',
    },
    labValues: {
      hasLabResults: false,
      blood_glucose_fasting: '',
      blood_glucose_pp: '',
      hba1c: '',
      total_cholesterol: '',
      hdl: '',
      ldl: '',
      triglycerides: '',
      hemoglobin: '',
      creatinine: '',
      sgot: '',
      sgpt: '',
      tsh: '',
    },
    lifestyle: {
      smoking: 'Never',
      alcohol: 'Never',
      exercise: 'Moderate',
      diet: 'Vegetarian',
      sleepHours: 7,
      stressLevel: 'Medium',
    },
    familyHistory: {
      diabetes: false,
      heartDisease: false,
      hypertension: false,
      cancer: false,
      kidneyDisease: false,
      thyroid: false,
      stroke: false,
      obesity: false,
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill if extractedData exists
  useEffect(() => {
    if (extractedData) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          name: extractedData.patient_name || '',
          age: extractedData.age || '',
          gender: extractedData.gender || 'Male',
        },
        labValues: {
          ...prev.labValues,
          hasLabResults: true,
          ...extractedData.extracted_values
        }
      }));
    }
  }, [extractedData]);

  // BMI Calculation
  const bmi = useMemo(() => {
    const w = parseFloat(formData.personalInfo.weight);
    const h = parseFloat(formData.personalInfo.height);
    if (w && h) {
      return (w / ((h / 100) ** 2)).toFixed(1);
    }
    return null;
  }, [formData.personalInfo.weight, formData.personalInfo.height]);

  const getBMICategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-yellow-600' };
    if (val < 25) return { label: 'Normal', color: 'text-green-600' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Final validation
      if (!formData.personalInfo.name || !formData.personalInfo.age) {
          throw new Error("Name and Age are required");
      }

      const submissionData = {
          ...formData,
          lifestyle: {
              ...formData.lifestyle,
              bmi: bmi || 0
          }
      };

      const res = await axios.post('/api/analyze', submissionData);
      toast.success('Analysis started!');
      navigate('/analyzing', { state: { predictionId: res.data.predictionId } });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: 'Personal Info', icon: <HiUser className="w-5 h-5" /> },
    { title: 'Symptoms', icon: <HiInformationCircle className="w-5 h-5" /> },
    { title: 'Vital Signs', icon: <HiHeart className="w-5 h-5" /> },
    { title: 'Lab Values', icon: <HiBeaker className="w-5 h-5" /> },
    { title: 'Lifestyle', icon: <HiScale className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col items-center flex-1 ${i + 1 === step ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-colors ${i + 1 <= step ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200'}`}>
                  {i + 1 < step ? <HiCheck className="w-6 h-6" /> : s.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter hidden md:block">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 5) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="text-sm font-bold text-gray-700 mb-2 block">Full Name *</label>
                       <input 
                         type="text"
                         value={formData.personalInfo.name}
                         onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, name: e.target.value}})}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                         placeholder="Enter your name"
                       />
                    </div>
                    <div>
                       <label className="text-sm font-bold text-gray-700 mb-2 block">Age *</label>
                       <input 
                         type="number"
                         value={formData.personalInfo.age}
                         onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, age: e.target.value}})}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                         placeholder="Years"
                       />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Gender *</label>
                      <div className="flex space-x-2">
                        {['Male', 'Female', 'Other'].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormData({...formData, personalInfo: {...formData.personalInfo, gender: g}})}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${formData.personalInfo.gender === g ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                       <label className="text-sm font-bold text-gray-700 mb-2 block">Weight (kg)</label>
                       <input 
                         type="number"
                         value={formData.personalInfo.weight}
                         onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, weight: e.target.value}})}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                         placeholder="kg"
                       />
                    </div>
                    <div>
                       <label className="text-sm font-bold text-gray-700 mb-2 block">Height (cm)</label>
                       <input 
                         type="number"
                         value={formData.personalInfo.height}
                         onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, height: e.target.value}})}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                         placeholder="cm"
                       />
                    </div>
                  </div>

                  {bmi && (
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Your Calculated BMI</p>
                        <p className={`text-2xl font-black ${getBMICategory(bmi).color}`}>{bmi} - {getBMICategory(bmi).label}</p>
                      </div>
                      <div className="text-4xl text-blue-100">⚖️</div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Symptoms */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Symptoms Tracker</h2>
                  
                  <SymptomSelector 
                    selected={formData.symptoms}
                    onChange={(selected) => setFormData({...formData, symptoms: selected})}
                  />

                  {formData.symptoms.length > 0 && (
                    <div className="space-y-4 mt-8 pt-8 border-t border-gray-50">
                      <p className="text-sm font-bold text-gray-500">Provide severity for selected symptoms:</p>
                      {formData.symptoms.map(s => (
                        <div key={s} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                          <span className="font-bold text-gray-700">{s}</span>
                          <div className="flex space-x-2">
                             {['mild', 'moderate', 'severe'].map(sev => (
                               <button
                                 key={sev}
                                 onClick={() => setFormData({
                                   ...formData, 
                                   symptomDetails: {
                                     ...formData.symptomDetails,
                                     [s]: { ...formData.symptomDetails[s], severity: sev }
                                   }
                                 })}
                                 className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border-2 transition ${formData.symptomDetails[s]?.severity === sev ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                               >
                                 {sev}
                               </button>
                             ))}
                          </div>
                          <input 
                            type="text"
                            placeholder="Duration (e.g. 2 days)"
                            className="text-xs px-3 py-1 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.symptomDetails[s]?.duration || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              symptomDetails: {
                                ...formData.symptomDetails,
                                [s]: { ...formData.symptomDetails[s], duration: e.target.value }
                              }
                            })}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Vital Signs */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Vital Signs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                       { key: 'systolicBP', label: 'Systolic BP', hint: 'Normal (90-120)' },
                       { key: 'diastolicBP', label: 'Diastolic BP', hint: 'Normal (60-80)' },
                       { key: 'pulseRate', label: 'Pulse Rate', hint: 'Normal (60-100)' },
                       { key: 'temperature', label: 'Temperature °F', hint: 'Normal (97-99)' },
                       { key: 'spo2', label: 'SpO2 %', hint: 'Normal (95-100)' },
                     ].map(v => (
                       <div key={v.key}>
                         <label className="text-sm font-bold text-gray-700 mb-2 block">{v.label}</label>
                         <div className="relative">
                            <input 
                              type="number"
                              value={formData.vitalSigns[v.key]}
                              onChange={(e) => setFormData({...formData, vitalSigns: {...formData.vitalSigns, [v.key]: e.target.value}})}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                              placeholder={v.hint}
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center space-x-1">
                               {/* Status Logic Placeholder */}
                               <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                         </div>
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Lab Values */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Lab Test Results</h2>
                    <button 
                      onClick={() => setFormData({...formData, labValues: {...formData.labValues, hasLabResults: !formData.labValues.hasLabResults}})}
                      className={`relative w-12 h-6 flex items-center rounded-full transition-colors ${formData.labValues.hasLabResults ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${formData.labValues.hasLabResults ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                  {formData.labValues.hasLabResults ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                       {[
                         { key: 'blood_glucose_fasting', label: 'Fasting Glucose', unit: 'mg/dL' },
                         { key: 'blood_glucose_pp', label: 'PP Glucose', unit: 'mg/dL' },
                         { key: 'hba1c', label: 'HbA1c', unit: '%' },
                         { key: 'total_cholesterol', label: 'Total Cholesterol', unit: 'mg/dL' },
                         { key: 'hdl', label: 'HDL Cholesterol', unit: 'mg/dL' },
                         { key: 'ldl', label: 'LDL Cholesterol', unit: 'mg/dL' },
                         { key: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL' },
                         { key: 'hemoglobin', label: 'Hemoglobin', unit: 'g/dL' },
                         { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL' },
                         { key: 'sgot', label: 'SGOT (AST)', unit: 'U/L' },
                         { key: 'sgpt', label: 'SGPT (ALT)', unit: 'U/L' },
                         { key: 'tsh', label: 'TSH', unit: 'mIU/L' },
                       ].map(l => (
                         <div key={l.key} className="flex flex-col">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                               <span>{l.label}</span>
                               <span className="text-gray-300">{l.unit}</span>
                            </label>
                            <input 
                              type="number"
                              step="any"
                              value={formData.labValues[l.key] || ''}
                              onChange={(e) => setFormData({...formData, labValues: {...formData.labValues, [l.key]: e.target.value}})}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold"
                            />
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                       <p className="text-gray-400 font-bold italic">No lab results to provide at this stage.</p>
                       <p className="text-gray-300 text-xs mt-2 uppercase tracking-wide">Toggle the switch above if you have a report</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Lifestyle */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Lifestyle & History</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Smoking */}
                     <div>
                        <label className="text-sm font-bold text-gray-700 mb-3 block">Smoking Habit</label>
                        <div className="flex space-x-2">
                           {['Never', 'Former', 'Current'].map(s => (
                             <button
                               key={s}
                               onClick={() => setFormData({...formData, lifestyle: {...formData.lifestyle, smoking: s}})}
                               className={`flex-1 py-3 rounded-xl text-xs font-bold transition ${formData.lifestyle.smoking === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                             >
                               {s}
                             </button>
                           ))}
                        </div>
                     </div>
                     {/* Alcohol */}
                     <div>
                        <label className="text-sm font-bold text-gray-700 mb-3 block">Alcohol Consumption</label>
                        <div className="flex space-x-2">
                           {['Never', 'Occasional', 'Regular'].map(a => (
                             <button
                               key={a}
                               onClick={() => setFormData({...formData, lifestyle: {...formData.lifestyle, alcohol: a}})}
                               className={`flex-1 py-3 rounded-xl text-xs font-bold transition ${formData.lifestyle.alcohol === a ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                             >
                               {a}
                             </button>
                           ))}
                        </div>
                     </div>
                     {/* Exercise */}
                     <div>
                        <label className="text-sm font-bold text-gray-700 mb-3 block">Exercise Level</label>
                        <select 
                          value={formData.lifestyle.exercise}
                          onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, exercise: e.target.value}})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-gray-700 appearance-none"
                        >
                          {['Sedentary', 'Light', 'Moderate', 'Active'].map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                     </div>
                     {/* Sleep */}
                     <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block flex justify-between">
                           <span>Sleep Hours</span>
                           <span className="text-blue-600 font-black">{formData.lifestyle.sleepHours}h</span>
                        </label>
                        <input 
                          type="range"
                          min="4" max="12"
                          value={formData.lifestyle.sleepHours}
                          onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, sleepHours: e.target.value}})}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                     </div>
                  </div>

                  {/* Family History */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                     <label className="text-sm font-bold text-gray-700">Family Medical History</label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.keys(formData.familyHistory).map(fh => (
                          <button
                            key={fh}
                            onClick={() => setFormData({...formData, familyHistory: {...formData.familyHistory, [fh]: !formData.familyHistory[fh]}})}
                            className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase text-center transition border-2 ${formData.familyHistory[fh] ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                          >
                            {fh}
                          </button>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-gray-400 hover:text-blue-600 font-bold transition"
                >
                  <HiArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              ) : <div></div>}

              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform hover:-translate-y-1 active:scale-95 flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <HiArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:scale-105 transition active:scale-95 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <HiSave className="w-6 h-6" />
                      <span>Start Analysis</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Import for Step Icons not explicitly mentioned in prompt but needed for consistency
import { HiUser } from 'react-icons/hi';

export default SymptomForm;
