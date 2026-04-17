import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi';
import axios from 'axios';

const Analyzing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const predictionId = location.state?.predictionId;

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = useMemo(() => [
    { text: "Reading your details...", duration: 1500 },
    { text: "AI Doctor is thinking...", duration: 2000 },
    { text: "Checking for illness...", duration: 2500 },
    { text: "Making your health plan...", duration: 2500 },
    { text: "Finding your exercises...", duration: 2000 },
    { text: "Almost ready! ✅", duration: 1500 }
  ], []);

  const [isApiFinished, setIsApiFinished] = useState(false);

  useEffect(() => {
    if (predictionId) {
      axios.post('/api/healthplan/generate', { predictionId })
        .then(() => setIsApiFinished(true))
        .catch(err => {
          console.error('Health plan generation error:', err?.response?.data || err.message);
          setIsApiFinished(true);
        });
    } else {
      setIsApiFinished(true);
    }
  }, [predictionId]);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep].duration);

      return () => clearTimeout(timer);
    } else {
      if (isApiFinished) {
        const finalTimer = setTimeout(() => {
          if (predictionId) {
            navigate(`/result/${predictionId}`);
          } else {
            navigate('/predict');
          }
        }, 1000);
        return () => clearTimeout(finalTimer);
      }
    }
  }, [currentStep, navigate, predictionId, steps, isApiFinished]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Heartbeat Animation */}
      <div className="relative mb-20 scale-125">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-rose-500/20 rounded-full blur-3xl"
        />
        <div className="relative w-40 h-40 bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 rounded-[40px] shadow-2xl flex items-center justify-center rotate-12">
          <span className="text-7xl -rotate-12">❤️</span>
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Checking Your Health</h1>
          <p className="text-indigo-300 font-bold text-lg">Stay still! Our AI is working for you...</p>
        </div>

        {/* Steps List */}
        <div className="bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 p-10 space-y-6 shadow-2xl">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  completedSteps.includes(i) ? 'bg-emerald-500 text-white' : i === currentStep ? 'bg-indigo-500 animate-pulse text-white' : 'bg-white/5'
                }`}>
                  {completedSteps.includes(i) ? <HiCheckCircle className="w-6 h-6" /> : <div className="w-2 h-2 rounded-full bg-white opacity-20" />}
                </div>
                <span className={`text-lg font-black transition-all duration-300 ${
                  completedSteps.includes(i) ? 'text-slate-500 line-through' : i === currentStep ? 'text-white' : 'text-slate-600'
                }`}>
                  {s.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-4 px-2">
           <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">AI Loading</span>
              <span className="text-2xl font-black text-white">{Math.round((currentStep / steps.length) * 100)}%</span>
           </div>
           <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
             <motion.div
               animate={{ width: `${(currentStep / steps.length) * 100}%` }}
               transition={{ duration: 0.5 }}
               className="h-full bg-gradient-to-r from-indigo-600 to-rose-500 rounded-full"
             />
           </div>
        </div>
      </div>

      <footer className="absolute bottom-10 py-4 px-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">HealthGuard AI • Universal Core v2.0</p>
      </footer>
    </div>
  );
};

export default Analyzing;
