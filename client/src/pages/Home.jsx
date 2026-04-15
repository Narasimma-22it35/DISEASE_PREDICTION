import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUpload, HiPencilAlt, HiCheckCircle, HiChartBar, HiClipboardList, HiVideoCamera, HiExclamation } from 'react-icons/hi';

const Home = () => {
  const features = [
    { title: 'Smart Disease Detection', icon: '🔬', desc: 'AI-driven analysis of symptoms and reports.' },
    { title: 'Risk Percentage Analysis', icon: '📊', desc: 'Understand your health risks with precise metrics.' },
    { title: 'Personalized Food Guide', icon: '🥗', desc: 'Custom nutrition plans based on your profile.' },
    { title: 'Exercise Videos', icon: '🏋️', desc: 'Tutorials tailored to your health needs.' },
    { title: "Do's and Don'ts", icon: '⚕️', desc: 'Clear guidelines for daily health management.' },
    { title: 'Downloadable PDF Report', icon: '📄', desc: 'Professional summaries for your doctor.' },
  ];

  const floatingIcons = [
    { icon: '💊', delay: 0, x: -100, y: -50 },
    { icon: '🧪', delay: 1, x: 120, y: -80 },
    { icon: '🩺', delay: 0.5, x: -150, y: 100 },
    { icon: '🍎', delay: 1.5, x: 180, y: 150 },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 min-h-[90vh] flex items-center pt-16">
        {/* Floating Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: item.x, y: item.y }}
              animate={{ 
                opacity: 0.2, 
                y: [item.y, item.y - 20, item.y],
                transition: { duration: 4, repeat: Infinity, delay: item.delay } 
              }}
              className="absolute left-1/2 top-1/2 text-5xl md:text-7xl"
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
            >
              AI-Powered <br />
              <span className="text-blue-300">Disease Prediction</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10"
            >
              Upload your medical report or enter your symptoms — our AI analyzes everything and gives you a complete personalized health plan.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link to="/predict" className="group flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-blue-50 transition transform hover:-translate-y-1">
                <HiUpload className="mr-2 w-6 h-6" />
                Upload Report
              </Link>
              <Link to="/predict" className="group flex items-center justify-center bg-transparent border-2 border-white/50 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition transform hover:-translate-y-1">
                <HiPencilAlt className="mr-2 w-6 h-6" />
                Enter Manually
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative z-20 -mt-10 mx-auto max-w-5xl rounded-2xl p-6 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Diseases Detected', val: '5+', icon: <HiCheckCircle className="text-blue-500" /> },
          { label: 'Accuracy', val: '95%', icon: <HiChartBar className="text-green-500" /> },
          { label: 'Health Plan', val: '360°', icon: <HiClipboardList className="text-purple-500" /> },
          { label: 'Response', val: 'Instant', icon: <HiVideoCamera className="text-red-500" /> },
        ].map((stat, i) => (
          <div key={i} className="text-center lg:border-r last:border-0 border-gray-100">
            <div className="flex items-center justify-center mb-1 text-2xl font-black text-gray-900">
              {stat.val}
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Comprehensive Diagnostics</h2>
          <p className="text-gray-500">Everything you need to take control of your health in one place.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-blue-100 transition duration-300 border border-transparent hover:border-blue-100 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-16">How It Works</h2>
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-12 lg:space-y-0 lg:space-x-12">
            {[
              { step: '1', title: 'Enter Details', desc: 'Fill form or upload report' },
              { step: '2', title: 'AI Analysis', desc: 'Engine analyzes health markers' },
              { step: '3', title: 'Get Results', desc: 'View your 360° health plan' },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200 mb-4 ring-8 ring-blue-50">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
                </div>
                {i < 2 && (
                   <div className="hidden lg:block text-4xl text-gray-300 transform -rotate-90 lg:rotate-0">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 max-w-4xl mx-auto px-4">
        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl flex items-start space-x-4">
          <HiExclamation className="text-red-500 w-8 h-8 flex-shrink-0" />
          <p className="text-red-700 text-sm leading-relaxed font-medium">
            <span className="font-black uppercase mr-1">Disclaimer:</span>
            This tool is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
