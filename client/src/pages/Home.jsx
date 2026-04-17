import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUpload, HiPencilAlt, HiCheckCircle, HiArrowRight, HiShieldCheck, HiStar, HiExclamation } from 'react-icons/hi';

const Home = () => {
  const features = [
    { title: 'Check for Sickness', icon: '🔍', desc: 'Find out why you are feeling unwell in seconds.' },
    { title: 'Health Percentage', icon: '📈', desc: 'See your risk level in clear green, yellow, or red colors.' },
    { title: 'Easy Food Plan', icon: '🥗', desc: 'Simple list of what to eat and what to avoid.' },
    { title: 'Health Exercises', icon: '🏃', desc: 'Easy videos to help you stay active at home.' },
    { title: 'Do & Do Not', icon: '🚫', desc: 'Clear rules for your daily health.' },
    { title: 'Doctor Report', icon: '📄', desc: 'A simple page you can show to any doctor.' },
  ];

  const floatingIcons = [
    { icon: '💊', delay: 0, x: -100, y: -50 },
    { icon: '🩺', delay: 0.5, x: -150, y: 100 },
    { icon: '🍎', delay: 1.5, x: 180, y: 150 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden premium-gradient min-h-[95vh] flex items-center pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: item.x, y: item.y }}
              animate={{ 
                opacity: 0.5, 
                y: [item.y, item.y - 40, item.y],
                transition: { duration: 5, repeat: Infinity, delay: item.delay } 
              }}
              className="absolute left-1/2 top-1/2 text-7xl md:text-9xl"
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-200 text-sm font-bold mb-8 border border-white/20"
            >
              <HiStar className="text-yellow-400" />
              <span>Smart Health Help for Everyone</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tight"
            >
              Your Friendly <br />
              <span className="text-blue-300">AI Doctor</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
            >
              Tell us how you feel or upload a report. Our AI will help you understand your health in simple words.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8"
            >
              <Link to="/predict" className="flex items-center justify-center bg-white text-indigo-700 w-full sm:w-72 h-20 rounded-3xl font-black text-xl shadow-2xl hover:bg-blue-50 transition transform hover:-translate-y-2 group">
                <HiUpload className="mr-3 w-8 h-8 group-hover:scale-110 transition" />
                Upload Report
              </Link>
              <Link to="/predict" className="flex items-center justify-center bg-indigo-500/30 backdrop-blur-lg border-2 border-white/30 text-white w-full sm:w-72 h-20 rounded-3xl font-black text-xl hover:bg-white/20 transition transform hover:-translate-y-2 group">
                <HiPencilAlt className="mr-3 w-8 h-8 group-hover:scale-110 transition" />
                Tell Symptoms
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        <div className="glass-card rounded-[40px] px-8 py-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-3">
            <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto group hover:rotate-12 transition">
              <HiCheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-800">Fast Help</h4>
            <p className="text-slate-500 font-medium">Results in seconds</p>
          </div>
          <div className="space-y-3">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mx-auto group hover:rotate-12 transition">
              <HiShieldCheck className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-800">Secure</h4>
            <p className="text-slate-500 font-medium">Your data is private</p>
          </div>
          <div className="space-y-3">
            <div className="bg-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center text-rose-600 mx-auto group hover:rotate-12 transition">
              <HiStar className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-800">Easy to use</h4>
            <p className="text-slate-500 font-medium">Simple language</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">How we help you</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Everything you need to feel better, explained simply.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 group transition-all"
            >
              <div className="text-6xl mb-8 group-hover:scale-125 transition-transform duration-500">{f.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Safety Header */}
      <section className="py-20 bg-indigo-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="glass-card rounded-[40px] p-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-8 md:space-y-0">
             <div className="max-w-xl">
               <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Always see a Doctor!</h2>
               <p className="text-xl text-slate-500 leading-relaxed font-medium">
                 This app gives you information, but only a real doctor can give you a final diagnosis.
               </p>
             </div>
             <HiExclamation className="w-24 h-24 text-rose-500 animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
        © 2026 HealthGuard AI • Stay Safe, Stay Healthy
      </footer>
    </div>
  );
};

export default Home;
