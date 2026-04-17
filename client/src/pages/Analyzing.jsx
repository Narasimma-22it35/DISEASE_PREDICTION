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
    { text: "Reading your health data...", duration: 1500 },
    { text: "Analyzing symptoms with AI...", duration: 2000 },
    { text: "Running disease detection...", duration: 2500 },
    { text: "Calculating risk percentages...", duration: 1500 },
    { text: "Generating personalized health plan...", duration: 2500 },
    { text: "Fetching exercise videos...", duration: 2000 },
    { text: "Your report is ready! ✅", duration: 1500 }
  ], []);

  const [isApiFinished, setIsApiFinished] = useState(false);

  useEffect(() => {
    if (predictionId) {
      axios.post('/api/healthplan/generate', { predictionId })
        .then(() => setIsApiFinished(true))
        .catch(err => {
          // Don't crash the page — just proceed to result, errors shown there
          console.error('Health plan generation error:', err?.response?.data || err.message);
          setIsApiFinished(true);
        });
    } else {
      // No predictionId means user navigated here directly — bounce back
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
      // Final navigation waits for both animation and API
      if (isApiFinished) {
        const finalTimer = setTimeout(() => {
          if (predictionId) {
            navigate(`/result/${predictionId}`);
          } else {
            navigate('/predict'); // No prediction — send back to form
          }
        }, 1000);
        return () => clearTimeout(finalTimer);
      }
    }
  }, [currentStep, navigate, predictionId, steps, isApiFinished]);

  return (
    <div className="min-h-screen bg-[#0a0b1e] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Pulse Heartbeat Icon */}
      <div className="relative mb-16">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"
        />
        <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-12">
          <span className="text-6xl transform -rotate-12" role="img" aria-label="pulse">❤️</span>
        </div>
      </div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">AI Diagnostics</h1>
          <p className="text-blue-300 font-medium">Processing clinical datasets through our neural engine...</p>
        </div>

        {/* Steps List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${completedSteps.includes(i)
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : i === currentStep ? 'border-blue-400 animate-pulse bg-blue-400/20' : 'border-white/10'
                  }`}>
                  {completedSteps.includes(i) && <HiCheckCircle className="w-5 h-5 transition-transform" />}
                </div>
                <span className={`text-sm font-bold transition-all duration-500 ${completedSteps.includes(i) ? 'text-gray-400' : i === currentStep ? 'text-white scale-105' : 'text-gray-600'
                  }`}>
                  {s.text}
                </span>
              </div>
              {i === currentStep && (
                <div className="h-1 w-8 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-blue-400 tracking-widest px-2">
            <span>Engine Load</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center px-4">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">HealthGuard AI Neural Core v1.5 Flash</p>
      </div>
    </div>
  );
};

export default Analyzing;
