import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiDownload, HiRefresh, HiExclamation, HiLightningBolt, HiArrowRight, HiShieldCheck, 
  HiOutlineSparkles, HiPlus, HiHeart, HiBeaker, HiDatabase 
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generatePDFReport } from '../components/PDFReport';
import toast from 'react-hot-toast';

// Components
import RiskMeter from '../components/RiskMeter';
import OvercomeTips from '../components/HealthPlan/OvercomeTips';
import FoodGuide from '../components/HealthPlan/FoodGuide';
import DosAndDonts from '../components/HealthPlan/DosAndDonts';
import ExerciseVideos from '../components/HealthPlan/ExerciseVideos';
import VoiceAssistant from '../components/VoiceAssistant';
import NearbyDoctors from '../components/NearbyDoctors';

const FloatingIcon = ({ children, delay, x, y }) => (
  <motion.div
    initial={{ opacity: 0, x, y }}
    animate={{ 
      opacity: [0.05, 0.15, 0.05],
      y: [y, y - 100, y],
      x: [x, x + 50, x],
    }}
    transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay }}
    className="absolute text-7xl text-indigo-200/30 select-none pointer-events-none z-0"
  >
    {children}
  </motion.div>
);

const Result = () => {
  const { predictionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('Advice');
  const [showConsult, setShowConsult] = useState(false);

  useEffect(() => {
    const fetchHealthPlan = async () => {
      try {
        const res = await axios.get(`/api/healthplan/${predictionId}`);
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load health plan');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchHealthPlan();
  }, [predictionId, navigate]);

  const predictionsData = useMemo(() => {
    if (!data?.prediction) return { primary: {}, secondary: [] };
    const p = data.prediction;
    
    // Support both the model structure and the formatted API response
    const results = p.results || [];
    if (results.length > 0) {
      return {
        primary: results[0],
        secondary: results.slice(1)
      };
    }

    // Fallback directly to primaryDisease if results is missing
    if (p.primaryDisease) {
      return {
        primary: {
          disease: p.primaryDisease.name,
          probability: p.primaryDisease.riskPercentage,
          severity: p.primaryDisease.severity
        },
        secondary: p.otherDiseases?.map(d => ({
          disease: d.name,
          probability: d.riskPercentage,
          severity: d.severity
        })) || []
      };
    }

    return { primary: {}, secondary: [] };
  }, [data]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-6">
       <div className="relative">
          <div className="w-32 h-32 border-8 border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl">❤️</div>
       </div>
       <p className="mt-10 text-white font-black uppercase tracking-[0.5em] text-sm animate-pulse">Finalizing Results...</p>
    </div>
  );

  const { prediction, healthPlan } = data;
  const { primary: primaryPrediction, secondary: secondaryPredictions } = predictionsData;

  const getStatusTheme = (percentage) => {
    const p = parseFloat(percentage) || 0;
    if (p < 30) return { label: 'PERFECT', color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' };
    if (p < 70) return { label: 'BE CAREFUL', color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', icon: '⚠️' };
    return { label: 'NEED DOCTOR', color: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50', icon: '🛑' };
  };

  const theme = getStatusTheme(primaryPrediction.probability || 0);

  const tabs = [
    { id: 'Advice', icon: '💡', title: 'What to do' },
    { id: 'Food', icon: '🥗', title: 'What to eat' },
    { id: 'DosDonts', icon: '✅', title: 'Do & Do Not' },
    { id: 'Exercise', icon: '🏃', title: 'Activity' },
    { id: 'Details', icon: '📊', title: 'Full Report' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-32 overflow-hidden relative">
       {/* Floating Medicine Background Icons */}
       <FloatingIcon delay={0} x={-400} y={100}><HiHeart /></FloatingIcon>
       <FloatingIcon delay={1.2} x={500} y={400}><HiPlus /></FloatingIcon>
       <FloatingIcon delay={2.5} x={-600} y={600}><HiBeaker /></FloatingIcon>
       <FloatingIcon delay={3.8} x={450} y={800}><HiDatabase /></FloatingIcon>

       <NearbyDoctors isOpen={showConsult} onClose={() => setShowConsult(false)} disease={healthPlan?.disease} />

       {/* Top Status Banner - Pulsing Animation */}
       <motion.div 
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         className={`py-6 px-4 text-center text-white font-black text-xl shadow-2xl sticky top-0 z-50 transition-colors duration-500 ${theme.color}`}
       >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center space-x-4"
          >
             <span className="text-4xl drop-shadow-md">{theme.icon}</span>
             <span className="uppercase tracking-[0.2em] drop-shadow-sm">Health Status: {theme.label}</span>
          </motion.div>
       </motion.div>

       {/* Big Header */}
       <div className="bg-white border-b border-slate-100 py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-6 py-2 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest">
                   <HiOutlineSparkles className="animate-pulse" />
                   <span>Analysis Complete</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                  Your <br />
                  <span className="text-indigo-600">Health Report</span>
                </h1>
                <p className="text-2xl text-slate-400 font-bold max-w-2xl mx-auto">
                    Hello, <span className="text-slate-900 uppercase underline decoration-indigo-200 decoration-8 underline-offset-4">
                      {prediction?.patientId?.personalInfo?.name || prediction?.patientId?.name || 'Friend'}
                    </span>!
                </p>
                <div className="flex justify-center space-x-3 text-[10px] font-black uppercase text-slate-400">
                    <span className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-full shadow-sm">{prediction?.patientId?.personalInfo?.age || '??'} Years</span>
                    <span className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-full shadow-sm">{prediction?.patientId?.personalInfo?.gender || 'Unknown'}</span>
                </div>
             </motion.div>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             
             {/* Left Column: Big Result & Voice */}
             <div className="lg:col-span-8 space-y-10">
                
                {/* Voice Assistant - RESTORED & PROMINENT */}
                <motion.section 
                   initial={{ opacity: 0, x: -50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                >
                   <VoiceAssistant prediction={prediction} healthPlan={healthPlan} />
                </motion.section>

                <motion.section 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 }}
                   className="glass-card rounded-[60px] p-12 md:p-20 relative overflow-hidden border-2 border-white/50 shadow-blue-900/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]"
                >
                   <div className="absolute top-0 right-0 p-16 -mr-20 -mt-20 opacity-5 pointer-events-none">
                      <HiOutlineSparkles className="w-96 h-96 text-indigo-600" />
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                      <div className="text-center md:text-left space-y-10">
                         <div className={`inline-flex items-center px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-sm ${theme.bg} ${theme.text} border-2 border-white`}>
                            Primary Check: {primaryPrediction.disease || 'General'}
                         </div>
                         <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                            Based on our AI, your sickness risk is <span className={theme.text}>
                              {primaryPrediction.probability ? `${primaryPrediction.probability}%` : 'Calculating...'}
                            </span>
                         </h2>
                         <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                            It looks like you might have <span className="font-black text-slate-900 underline decoration-indigo-200 decoration-4 underline-offset-4">{primaryPrediction.disease || 'a condition'}</span>. 
                            Listen to our AI Doctor or read the guide below.
                          </p>
                      </div>
                      
                      <div className="w-full max-w-sm mx-auto">
                         <RiskMeter percentage={primaryPrediction.probability} level={healthPlan.riskLevel} size="lg" />
                      </div>
                   </div>
                </motion.section>

                {/* Secondary Results */}
                <section>
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8 ml-8">Additional Analysis Results</h3>
                   <div className="flex overflow-x-auto pb-8 space-x-8 scrollbar-hide px-4">
                      {secondaryPredictions.length > 0 ? secondaryPredictions.map((dp, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ y: -10 }}
                          className="min-w-[320px] bg-white p-10 rounded-[50px] shadow-2xl shadow-slate-200/50 border border-slate-100 group transition-all"
                        >
                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:rotate-12 transition">🩺</div>
                           <h4 className="text-2xl font-black text-slate-900 mb-2">{dp.disease}</h4>
                           <div className="h-2 w-20 bg-slate-100 rounded-full mb-4">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${dp.probability}%` }} />
                           </div>
                           <p className="text-xs font-black text-indigo-500 uppercase tracking-widest leading-none">{dp.probability}% Probable</p>
                        </motion.div>
                      )) : (
                        <p className="text-slate-400 font-bold ml-4">No other risks detected.</p>
                      )}
                   </div>
                </section>
             </div>

             {/* Right Column: Doctor Info */}
             <div className="lg:col-span-4 space-y-10">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.7 }}
                   className="premium-gradient p-12 rounded-[60px] text-white shadow-3xl shadow-blue-900/20 space-y-10 sticky top-40 border-4 border-white/10"
                >
                   <div className="bg-white/10 w-20 h-20 rounded-[30px] flex items-center justify-center text-4xl backdrop-blur-md shadow-xl border border-white/20">🏥</div>
                   <div className="space-y-4">
                      <h3 className="text-4xl font-black leading-none tracking-tight">You should see a Doctor!</h3>
                      <p className="text-blue-100 font-medium text-lg leading-relaxed">
                        We recommend talking to a <span className="text-white font-black underline decoration-blue-300 decoration-4 underline-offset-4">{healthPlan.disease} Specialist</span> as soon as you can.
                      </p>
                   </div>
                   <button 
                     onClick={() => setShowConsult(true)} 
                     className="w-full h-20 bg-white text-indigo-700 rounded-[30px] font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center space-x-3 group"
                   >
                      <span>Find Doctor Near Me</span>
                      <HiArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                   </button>
                </motion.div>
                
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.9 }}
                   className="bg-rose-50 border-4 border-white p-10 rounded-[60px] shadow-xl space-y-8"
                >
                   <div className="flex items-center space-x-4 text-rose-600 font-black">
                      <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-2xl">🚨</div>
                      <h4 className="text-2xl uppercase tracking-tighter">Emergency Signs</h4>
                   </div>
                   <div className="space-y-4">
                      {(healthPlan?.plan?.warning_signs || []).slice(0, 3).map((sign, i) => (
                         <div key={i} className="p-6 bg-white rounded-3xl font-black text-rose-800 text-sm shadow-sm flex items-start space-x-3 border-l-8 border-rose-400">
                            <span className="text-xl">⚠️</span>
                            <span>{typeof sign === 'string' ? sign : sign.sign || sign.text}</span>
                         </div>
                      ))}
                   </div>
                   <p className="text-xs text-rose-400 font-black uppercase text-center tracking-[0.2em]">Contact 108 if symptoms worsen</p>
                </motion.div>
             </div>
          </div>

          {/* Tab Selection */}
          <div className="mt-32 flex flex-wrap justify-center gap-4 py-8">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center space-x-4 px-10 py-6 rounded-[30px] text-xs font-black transition-all transform hover:scale-105 active:scale-95 ${
                   activeTab === tab.id 
                     ? 'bg-indigo-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)]' 
                     : 'bg-white text-slate-400 border-2 border-slate-100 hover:border-indigo-100'
                 }`}
               >
                 <span className="text-2xl">{tab.icon}</span>
                 <span className="uppercase tracking-[0.3em]">{tab.title}</span>
               </button>
             ))}
          </div>

          {/* Advice Content Area */}
          <motion.div 
            layout
            className="mt-12 bg-white rounded-[70px] p-10 md:p-24 shadow-[0_50px_100px_rgba(0,0,0,0.03)] border-2 border-slate-50"
          >
             <AnimatePresence mode="wait">
                <motion.div 
                   key={activeTab} 
                   initial={{ opacity: 0, x: 20 }} 
                   animate={{ opacity: 1, x: 0 }} 
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                >
                   {activeTab === 'Advice' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                         <div className="space-y-8">
                            <h2 className="text-6xl font-black text-slate-900 tracking-tight leading-none">How to <br />get better</h2>
                            <p className="text-2xl text-slate-400 leading-relaxed font-bold underline decoration-indigo-100 decoration-8 underline-offset-8">Follow these steps every day.</p>
                            <div className="p-10 bg-indigo-50/50 rounded-[40px] border-2 border-indigo-100/50 flex items-start space-x-6">
                               <span className="text-5xl">💉</span>
                               <p className="text-lg text-indigo-900 font-bold leading-relaxed">
                                 Our AI suggests early intervention. Start with these tips to manage your health effectively at home.
                               </p>
                            </div>
                         </div>
                         <OvercomeTips tips={healthPlan.plan.overcome_tips} />
                      </div>
                   )}
                   {activeTab === 'Food' && (
                      <div className="space-y-16">
                         <div className="text-center space-y-4">
                            <h2 className="text-6xl font-black text-slate-900 tracking-tight">Your Health Menu 🥗</h2>
                            <p className="text-xl text-slate-400 font-bold">Eat these to fuel your recovery.</p>
                         </div>
                         <FoodGuide 
                            foods={healthPlan.plan.recommended_foods} 
                            fruits={healthPlan.plan.recommended_fruits}
                            vegetables={healthPlan.plan.recommended_vegetables}
                            avoid={healthPlan.plan.foods_to_avoid}
                         />
                      </div>
                   )}
                   {activeTab === 'DosDonts' && (
                      <div className="space-y-16">
                         <div className="text-center space-y-4">
                            <h2 className="text-6xl font-black text-slate-900 tracking-tight">Health Rules ✅</h2>
                            <p className="text-xl text-slate-400 font-bold">Simple habits define your future health.</p>
                         </div>
                         <DosAndDonts dos={healthPlan.plan.dos} donts={healthPlan.plan.donts} />
                      </div>
                   )}
                   {activeTab === 'Exercise' && (
                      <div className="space-y-16">
                         <div className="text-center space-y-4">
                            <h2 className="text-6xl font-black text-slate-900 tracking-tight">Move Your Body! 🏃</h2>
                            <p className="text-xl text-slate-400 font-bold">Guided videos chosen specifically for your condition.</p>
                         </div>
                         <ExerciseVideos exercises={healthPlan.exercisesWithVideos} />
                      </div>
                   )}
                   {activeTab === 'Details' && (
                      <div className="space-y-12">
                         <h2 className="text-6xl font-black text-slate-900 tracking-tight">Scientific Report 📊</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div whileHover={{ scale: 1.05 }} className="p-12 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm">
                               <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">Category</p>
                               <p className="text-4xl font-black text-slate-900">{healthPlan.disease}</p>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} className="p-12 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm">
                               <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">Risk Level</p>
                               <p className="text-4xl font-black text-amber-600">{healthPlan.riskLevel}</p>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} className="p-12 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm">
                               <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">Urgency</p>
                               <p className="text-4xl font-black text-rose-600">{healthPlan.severity}</p>
                            </motion.div>
                         </div>
                         <div className="p-12 bg-white rounded-[50px] border-4 border-slate-50 shadow-inner mt-10">
                            <p className="text-slate-500 font-medium italic leading-[2]">
                              This report is generated using advanced AI (Ensemble Learning & LLM Analysis). While highly accurate, always share this report with your actual doctor for confirmation.
                            </p>
                         </div>
                      </div>
                   )}
                </motion.div>
             </AnimatePresence>
          </motion.div>

          {/* Final Action Buttons */}
          <div className="mt-32 flex flex-col sm:flex-row items-center justify-center gap-10">
             <motion.button 
               whileHover={{ scale: 1.05, y: -5 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => generatePDFReport(prediction, healthPlan)}
               className="h-24 px-16 bg-slate-900 text-white rounded-[40px] font-black text-2xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:bg-black transition-all flex items-center space-x-4 border-4 border-white group"
             >
                <HiDownload className="w-8 h-8 group-hover:animate-bounce" />
                <span>Save Your Report</span>
             </motion.button>
             <motion.button 
               whileHover={{ scale: 1.05, y: -5, backgroundColor: '#f8fafc' }}
               whileTap={{ scale: 0.95 }}
               onClick={() => navigate('/predict')}
               className="h-24 px-16 bg-white text-slate-900 border-4 border-slate-100 rounded-[40px] font-black text-2xl shadow-xl transition-all"
             >
                Try Another Scan
             </motion.button>
          </div>
       </div>
    </div>
  );
};

export default Result;
