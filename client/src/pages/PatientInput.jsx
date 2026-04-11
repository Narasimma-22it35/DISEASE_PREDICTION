import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUpload, HiPencilAlt, HiShieldCheck } from 'react-icons/hi';

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
    <div className="min-h-[90vh] bg-gray-50 flex items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Start Your Assessment</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Choose how you want to provide your health details. AI extracts data automatically from reports, or you can fill it step-by-step.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Upload */}
          <motion.button
            whileHover={{ scale: 1.02, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelection('upload')}
            className="bg-white p-10 rounded-3xl border-2 border-transparent hover:border-blue-500 shadow-xl shadow-blue-50 transition-all text-left flex flex-col items-center md:items-start group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition duration-300">
              <HiUpload className="w-8 h-8 text-blue-600 group-hover:text-white transition duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Medical Report</h2>
            <p className="text-gray-500 mb-6 text-center md:text-left">Upload your PDF or Image report. Our AI will automatically extract symptoms and lab values for you.</p>
            <div className="flex items-center space-x-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 text-xs font-bold text-gray-500 rounded-full">PDF</span>
              <span className="px-3 py-1 bg-gray-100 text-xs font-bold text-gray-500 rounded-full">JPG</span>
              <span className="px-3 py-1 bg-gray-100 text-xs font-bold text-gray-500 rounded-full">PNG</span>
            </div>
            <div className="mt-auto w-full py-3 bg-blue-600 text-white text-center rounded-xl font-bold shadow-lg shadow-blue-100 group-hover:bg-blue-700 transition">
              Upload Report
            </div>
          </motion.button>

          {/* Card 2: Manual */}
          <motion.button
            whileHover={{ scale: 1.02, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelection('manual')}
            className="bg-white p-10 rounded-3xl border-2 border-transparent hover:border-indigo-500 shadow-xl shadow-indigo-50 transition-all text-left flex flex-col items-center md:items-start group"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition duration-300">
              <HiPencilAlt className="w-8 h-8 text-indigo-600 group-hover:text-white transition duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Details Manually</h2>
            <p className="text-gray-500 mb-6 text-center md:text-left">Manually enter your symptoms, vitals, and lab values through our guided step-by-step form.</p>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm mb-6">
              <HiShieldCheck className="w-5 h-5" />
              <span>Personalized Assistant</span>
            </div>
            <div className="mt-auto w-full py-3 bg-indigo-600 text-white text-center rounded-xl font-bold shadow-lg shadow-indigo-100 group-hover:bg-indigo-700 transition">
              Start Now
            </div>
          </motion.button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure & Confidential Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default PatientInput;
