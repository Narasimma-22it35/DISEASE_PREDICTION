import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiArrowLeft, HiArrowRight, HiCheck, HiHeart, HiBeaker, HiDatabase, 
  HiUser, HiHome, HiEmojiHappy, HiTrendingUp, HiExclamationCircle, HiStar 
} from 'react-icons/hi';
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
    symptomDetails: {},
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

  const bmi = useMemo(() => {
    const w = parseFloat(formData.personalInfo.weight);
    const h = parseFloat(formData.personalInfo.height);
    if (w && h) return (w / ((h / 100) ** 2)).toFixed(1);
    return null;
  }, [formData.personalInfo.weight, formData.personalInfo.height]);

  const getBMICategory = (val) => {
    if (val < 18.5) return { label: 'A bit light', color: 'text-amber-500' };
    if (val < 25) return { label: 'Perfect Weight', color: 'text-emerald-500' };
    if (val < 30) return { label: 'A bit heavy', color: 'text-orange-500' };
    return { label: 'Heavier than normal', color: 'text-rose-500' };
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!formData.personalInfo.name || !formData.personalInfo.age) {
          throw new Error("Please tell us your Name and Age!");
      }
      const res = await axios.post('/api/analyze', { ...formData, lifestyle: { ...formData.lifestyle, bmi: bmi || 0 }});
      toast.success('Analyzing your health now!');
      navigate('/analyzing', { state: { predictionId: res.data.predictionId } });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: 'About You', icon: <HiUser />, color: 'bg-indigo-600' },
    { title: 'How You Feel', icon: <HiEmojiHappy />, color: 'bg-blue-600' },
    { title: 'Health Signs', icon: <HiHeart />, color: 'bg-rose-600' },
    { title: 'Blood Tests', icon: <HiBeaker />, color: 'bg-emerald-600' },
    { title: 'Finish', icon: <HiCheck />, color: 'bg-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Simplified Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 -z-0"></div>
            <motion.div 
               className="absolute top-5 left-0 h-1 bg-indigo-600 -z-0"
               animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${step > i + 1 ? 'bg-indigo-600' : step === i + 1 ? s.color : 'bg-white'} ${step >= i + 1 ? 'text-white shadow-xl rotate-0' : 'text-slate-300 border-2 border-slate-100 rotate-12'}`}>
                  {step > i + 1 ? <HiCheck className="w-6 h-6" /> : React.cloneElement(s.icon, { className: 'w-6 h-6' })}
                </div>
                <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${step === i + 1 ? 'text-slate-900' : 'text-slate-400 opacity-50'}`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[40px] overflow-hidden">
          <div className="p-8 md:p-16">
            <AnimatePresence mode="wait">
              {/* Step 1: About You */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10">
                  {extractedData && (
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-6 text-indigo-900 shadow-sm flex items-start space-x-4 mb-4">
                      <div className="text-3xl mt-1">🤖</div>
                      <div>
                        <h4 className="font-black text-lg mb-1 tracking-tight">AI Extracted Your Details!</h4>
                        <p className="font-bold text-sm text-indigo-700/80 leading-relaxed">
                           We found your blood values, but <span className="text-indigo-900 underline decoration-indigo-300 decoration-2">reports don't show how you're feeling physically!</span> Please verify these details and tell us about any pain, fever, or actual symptoms on the next screens.
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">About You</h2>
                    <p className="text-slate-500 text-lg font-medium">Please tell us who you are so we can help better.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-sm font-black text-indigo-900 uppercase tracking-widest">What is your name?</label>
                       <input 
                         type="text"
                         value={formData.personalInfo.name}
                         onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, name: e.target.value}})}
                         className="w-full h-20 px-8 bg-slate-100/50 border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none text-xl font-bold transition-all placeholder:text-slate-300"
                         placeholder="Type your name here"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-sm font-black text-indigo-900 uppercase tracking-widest">How many years old?</label>
                       <input 
                         type="number"
                         value={formData.personalInfo.age}
                         onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, age: e.target.value}})}
                         className="w-full h-20 px-8 bg-slate-100/50 border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none text-xl font-bold transition-all placeholder:text-slate-300"
                         placeholder="Age"
                       />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-indigo-900 uppercase tracking-widest">Man or Woman?</label>
                      <div className="flex space-x-3 h-20">
                        {['Male', 'Female'].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormData({...formData, personalInfo: {...formData.personalInfo, gender: g}})}
                            className={`flex-1 rounded-3xl text-lg font-black transition-all ${formData.personalInfo.gender === g ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100/50 text-slate-400'}`}
                          >
                            {g === 'Male' ? 'Man' : 'Woman'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {bmi && (
                    <div className="p-8 bg-indigo-50 rounded-[30px] border-2 border-indigo-100/50 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="bg-white p-4 rounded-2xl shadow-lg text-3xl">⚖️</div>
                        <div>
                          <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Your Weight Score</p>
                          <p className={`text-3xl font-black ${getBMICategory(bmi).color}`}>{getBMICategory(bmi).label}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: How You Feel */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">How do you feel?</h2>
                    <p className="text-slate-500 text-lg font-medium">Click on the sickness you are feeling right now.</p>
                  </div>
                  <SymptomSelector 
                    selected={formData.symptoms}
                    onChange={(selected) => setFormData({...formData, symptoms: selected})}
                  />
                  {formData.symptoms.length > 0 && (
                    <div className="space-y-6 pt-10 border-t border-slate-100">
                      <p className="text-sm font-black text-blue-900 uppercase tracking-widest">Is it a big problem?</p>
                      {formData.symptoms.map(s => (
                        <div key={s} className="grid grid-cols-1 md:grid-cols-2 p-6 bg-slate-50 rounded-[30px] border-2 border-slate-100 gap-6 items-center">
                          <span className="text-xl font-bold text-slate-800 flex items-center">
                            <HiExclamationCircle className="mr-3 text-amber-500 w-6 h-6" /> {s}
                          </span>
                          <div className="flex space-x-2">
                             {['mild', 'moderate', 'severe'].map(sev => (
                               <button
                                 key={sev}
                                 onClick={() => setFormData({...formData, symptomDetails: {...formData.symptomDetails, [s]: { ...formData.symptomDetails[s], severity: sev }}})}
                                 className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${formData.symptomDetails[s]?.severity === sev ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400'}`}
                               >
                                 {sev === 'mild' ? 'A little' : sev === 'moderate' ? 'A lot' : 'Very Bad'}
                               </button>
                             ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Health Signs */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Your Body Signs</h2>
                    <p className="text-slate-500 text-lg font-medium">Check your heart and body pressure.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {[
                       { key: 'systolicBP', label: 'Blood Pressure (Top)', icon: '💓', color: 'bg-rose-100/50' },
                       { key: 'diastolicBP', label: 'Blood Pressure (Down)', icon: '📉', color: 'bg-indigo-100/50' },
                       { key: 'pulseRate', label: 'Heart Beat Speed', icon: '❤️', color: 'bg-emerald-100/50' },
                       { key: 'temperature', label: 'Body Heat (Temp)', icon: '🤒', color: 'bg-amber-100/50' },
                       { key: 'spo2', label: 'Oxygen Level', icon: '🌬️', color: 'bg-blue-100/50' },
                     ].map(v => (
                       <div key={v.key} className="space-y-4">
                         <div className="flex items-center space-x-3">
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${v.color}`}>{v.icon}</span>
                            <label className="text-sm font-black text-slate-700 uppercase tracking-widest">{v.label}</label>
                         </div>
                         <input 
                            type="number"
                            value={formData.vitalSigns[v.key]}
                            onChange={(e) => setFormData({...formData, vitalSigns: {...formData.vitalSigns, [v.key]: e.target.value}})}
                            className="w-full h-20 px-8 bg-slate-100/50 border-2 border-transparent focus:border-rose-500 rounded-3xl outline-none text-2xl font-black transition-all"
                            placeholder="0"
                         />
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Blood Tests */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Blood Tests</h2>
                      <p className="text-slate-500 text-lg font-medium">Do you have a report from the lab?</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, labValues: {...formData.labValues, hasLabResults: !formData.labValues.hasLabResults}})}
                      className={`h-16 px-10 rounded-3xl font-black transition-all border-2 ${formData.labValues.hasLabResults ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
                    >
                      {formData.labValues.hasLabResults ? 'YES, I HAVE IT' : 'NO REPORT'}
                    </button>
                  </div>

                  {formData.labValues.hasLabResults && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                       {[
                         { key: 'blood_glucose_fasting', label: 'Blood Sugar (Morning)', icon: '🍯' },
                         { key: 'hba1c', label: 'Avg Sugar (3 Months)', icon: '📅' },
                         { key: 'total_cholesterol', label: 'Fat (Cholesterol)', icon: '🥩' },
                         { key: 'hemoglobin', label: 'Blood Count (Hb)', icon: '💉' },
                       ].map(l => (
                         <div key={l.key} className="space-y-4">
                            <label className="text-xs font-black text-emerald-900 uppercase tracking-widest flex items-center">
                               <span className="mr-2">{l.icon}</span> {l.label}
                            </label>
                            <input 
                              type="number"
                              step="any"
                              value={formData.labValues[l.key] || ''}
                              onChange={(e) => setFormData({...formData, labValues: {...formData.labValues, [l.key]: e.target.value}})}
                              className="w-full h-20 px-8 bg-slate-100/50 border-2 border-transparent focus:border-emerald-600 rounded-3xl outline-none text-2xl font-black transition-all"
                              placeholder="Type number here"
                            />
                         </div>
                       ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Finish */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12">
                   <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-[30px] flex items-center justify-center text-4xl mx-auto shadow-xl rotate-12">🏁</div>
                   <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Ready to Check?</h2>
                    <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed text-center">We will now analyze all your details and give you your health report.</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-8 bg-slate-50 rounded-[40px] border-2 border-slate-100">
                         <div className="text-3xl mb-3">🍏</div>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Food Plan</p>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[40px] border-2 border-slate-100">
                         <div className="text-3xl mb-3">🏃</div>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Exercise</p>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[40px] border-2 border-slate-100">
                         <div className="text-3xl mb-3">✅</div>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Advice</p>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button onClick={handleBack} className="flex items-center space-x-3 text-slate-400 hover:text-indigo-600 font-black transition-all text-lg group">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
                    <HiArrowLeft className="w-6 h-6" />
                  </div>
                  <span>Go Back</span>
                </button>
              ) : <div />}

              {step < 5 ? (
                <button onClick={handleNext} className="bg-indigo-600 text-white h-20 px-12 rounded-[30px] font-black text-xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition transform hover:-translate-y-1 active:scale-95 flex items-center space-x-4">
                  <span>Continue</span>
                  <HiArrowRight className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit} disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-20 px-16 rounded-[30px] font-black text-2xl shadow-2xl shadow-indigo-100 hover:scale-105 transition active:scale-95 flex items-center space-x-4"
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Show My Results</span>
                      <HiStar className="w-6 h-6 text-yellow-300" />
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

export default SymptomForm;
