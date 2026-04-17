import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUpload, HiPencilAlt, HiShieldCheck, HiArrowRight } from 'react-icons/hi';

const PatientInput = () => {
  const navigate = useNavigate();

  const handleSelection = (method) => {
    if (method === 'upload') {
      navigate('/predict/upload');
    } else {
      navigate('/predict/form', { state: { method: 'manual' } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center py-20 px-4">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest mb-6">
             <HiShieldCheck />
             <span>Secure & Private Analysis</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">How do you want to start?</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Choose the easiest way for you to tell us about your health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Card 1: Upload */}
          <motion.button
            whileHover={{ y: -10 }}
            onClick={() => handleSelection('upload')}
            className="group glass-card p-12 rounded-[50px] text-left flex flex-col items-center md:items-start transition-all border-2 border-transparent hover:border-indigo-200"
          >
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg rotate-3 group-hover:rotate-0">
              <HiUpload className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Upload your report 📄</h2>
            <p className="text-lg text-slate-500 mb-10 font-medium leading-relaxed">
              If you have a paper from the doctor, upload it here. Our AI will read everything for you automatically.
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {['PDF', 'Images', 'Fast'].map(t => (
                <span key={t} className="px-5 py-2 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-full">{t}</span>
              ))}
            </div>
            <div className="mt-auto w-full h-20 bg-indigo-600 text-white flex items-center justify-center rounded-[30px] font-black text-xl shadow-2xl shadow-indigo-100 group-hover:bg-indigo-700 transition">
              <span>Read My Report</span>
              <HiArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-all" />
            </div>
          </motion.button>

          {/* Card 2: Manual */}
          <motion.button
            whileHover={{ y: -10 }}
            onClick={() => handleSelection('manual')}
            className="group glass-card p-12 rounded-[50px] text-left flex flex-col items-center md:items-start transition-all border-2 border-transparent hover:border-rose-200"
          >
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 shadow-lg -rotate-3 group-hover:rotate-0">
              <HiPencilAlt className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Talk to our AI 💬</h2>
            <p className="text-lg text-slate-500 mb-10 font-medium leading-relaxed">
               No report? No problem! Tell us how you feel step-by-step. Our AI will guide you through simple questions.
            </p>
            <div className="flex flex-wrap gap-2 mb-10 text-rose-600 font-black text-xs uppercase tracking-widest">
              <span>★ 100% Guided Experience</span>
            </div>
            <div className="mt-auto w-full h-20 bg-rose-500 text-white flex items-center justify-center rounded-[30px] font-black text-xl shadow-2xl shadow-rose-100 group-hover:bg-rose-600 transition">
              <span>Tell Symptoms</span>
              <HiArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-all" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PatientInput;
