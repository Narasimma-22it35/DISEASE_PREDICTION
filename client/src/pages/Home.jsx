import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HiUpload, HiPencilAlt, HiCheckCircle, HiChartBar, HiClipboardList, HiVideoCamera, HiExclamation } from 'react-icons/hi';

/* ─── animation helpers ─── */
const fadeUp   = (delay = 0, y = 30) => ({
  initial:    { opacity: 0, y },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeLeft = (delay = 0) => ({
  initial:    { opacity: 0, x: -40 },
  whileInView:{ opacity: 1, x: 0 },
  viewport:   { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Particle component ─── */
const Particle = ({ x, y, size, delay, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
    animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

const PARTICLES = [
  { x: 8,  y: 20, size: 6,  delay: 0,   color: 'rgba(96,165,250,0.6)' },
  { x: 90, y: 15, size: 8,  delay: 1.2, color: 'rgba(167,139,250,0.5)' },
  { x: 5,  y: 70, size: 5,  delay: 2,   color: 'rgba(52,211,153,0.5)'  },
  { x: 93, y: 65, size: 10, delay: 0.7, color: 'rgba(251,146,60,0.4)'  },
  { x: 50, y: 85, size: 6,  delay: 1.5, color: 'rgba(96,165,250,0.4)'  },
  { x: 75, y: 40, size: 4,  delay: 2.5, color: 'rgba(244,114,182,0.5)' },
  { x: 20, y: 45, size: 7,  delay: 0.3, color: 'rgba(129,140,248,0.4)' },
  { x: 60, y: 10, size: 5,  delay: 1.8, color: 'rgba(52,211,153,0.4)'  },
];

const Home = () => {
  /* Parallax scroll for hero */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpac = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const features = [
    { title: 'Smart Disease Detection',  icon: '🔬', desc: 'AI-driven analysis of symptoms and reports using trained ML models.',       color: 'from-blue-500/10 to-indigo-500/10',   border: 'border-blue-500/20',   glow: '#3b82f6' },
    { title: 'Risk Percentage Analysis', icon: '📊', desc: 'Understand your health risks with precise probability metrics.',              color: 'from-emerald-500/10 to-teal-500/10',  border: 'border-emerald-500/20', glow: '#10b981' },
    { title: 'Personalized Food Guide',  icon: '🥗', desc: 'Custom nutrition plans based on your diagnosis and health profile.',          color: 'from-orange-500/10 to-amber-500/10',  border: 'border-orange-500/20', glow: '#f97316' },
    { title: 'Exercise Video Tutorials', icon: '🏋️', desc: 'Curated YouTube workout tutorials tailored to your specific condition.',     color: 'from-red-500/10 to-rose-500/10',      border: 'border-red-500/20',    glow: '#ef4444' },
    { title: "Voice Health Assistant",   icon: '🎙️', desc: 'Hear your diagnosis read aloud in English or Tamil — fully accessible.',     color: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/20', glow: '#8b5cf6' },
    { title: 'Downloadable PDF Report',  icon: '📄', desc: 'Professional medical summaries you can share directly with your doctor.',     color: 'from-pink-500/10 to-fuchsia-500/10',  border: 'border-pink-500/20',   glow: '#ec4899' },
  ];

  const steps = [
    { step: '01', title: 'Upload or Enter', desc: 'Upload your medical report (PDF/CSV/Image) or fill in symptoms manually.', icon: '📋' },
    { step: '02', title: 'AI Analysis',     desc: 'Our Gemini + ML engine reads your health data and predicts diseases.',       icon: '🤖' },
    { step: '03', title: 'Get Your Plan',   desc: 'Receive a 360° personalized health plan with voice guidance & doctor finder.', icon: '🎯' },
  ];

  const stats = [
    { label: 'Diseases Detected', val: '5+',     icon: '🔬' },
    { label: 'AI Accuracy',       val: '95%',    icon: '🎯' },
    { label: 'Health Plan',       val: '360°',   icon: '🌀' },
    { label: 'Response Time',     val: 'Instant',icon: '⚡' },
  ];

  return (
    <div className="bg-[#070818] text-white">

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0e2b] via-[#0a1040] to-[#070818]" />
        <div className="absolute inset-0 dot-grid opacity-30" />

        {/* Glowing orbs */}
        <motion.div style={{ y: heroY }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-drift"
        />
        <motion.div style={{ y: heroY }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/12 rounded-full blur-[100px] pointer-events-none animate-drift"
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="absolute top-20 right-40 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none animate-drift" style={{ animationDelay: '3s' }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

        {/* Spinning ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/3 rounded-full animate-spin-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-blue-500/5 rounded-full animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '18s' }} />

        {/* Content */}
        <motion.div style={{ opacity: heroOpac }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-32">
          <div className="text-center">

            {/* Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-xs font-black uppercase tracking-[0.2em]">Powered by Gemini AI + Machine Learning</span>
            </motion.div>

            {/* Title */}
            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight">
              AI-Powered <br />
              <span className="gradient-text leading-normal">Disease Prediction</span>
            </motion.h1>

            <motion.p {...fadeUp(0.25)} className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Upload your medical report or enter symptoms — our AI analyzes everything and gives you a complete personalized health plan in seconds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/predict"
                className="group btn-ripple inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 hover:-translate-y-1 animate-glow"
              >
                <HiUpload className="w-6 h-6 group-hover:scale-110 transition" />
                <span>Upload Report</span>
              </Link>
              <Link to="/predict"
                className="inline-flex items-center justify-center space-x-3 glass border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all duration-200 hover:-translate-y-1"
              >
                <HiPencilAlt className="w-6 h-6" />
                <span>Enter Manually</span>
              </Link>
            </motion.div>

            {/* Scroll hint */}
            <motion.div {...fadeUp(0.7)} className="mt-20">
              <motion.div
                animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-10 border-2 border-white/20 rounded-full mx-auto flex justify-center pt-2"
              >
                <div className="w-1.5 h-2.5 bg-white/40 rounded-full" />
              </motion.div>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mt-3">Scroll to explore</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════ STATS BAR ══════════════════════ */}
      <div className="relative z-10 -mt-1">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            {...fadeUp(0)}
            className="glass border border-white/10 rounded-3xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 shadow-2xl"
          >
            {stats.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="text-center group cursor-default"
              >
                <div className="text-3xl mb-2 group-hover:animate-float inline-block">{s.icon}</div>
                <div className="text-3xl font-black text-white mb-1 gradient-text">{s.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">What You Get</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">Comprehensive Diagnostics</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Everything you need to understand and manage your health — all in one AI-powered platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative p-7 rounded-3xl bg-gradient-to-br ${f.color} border ${f.border} overflow-hidden group cursor-default transition-all duration-300`}
              style={{ '--glow': f.glow }}
            >
              {/* Corner glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${f.glow}, transparent)` }} />

              <div className="relative z-10">
                <motion.div
                  className="text-4xl mb-4 inline-block"
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {f.icon}
                </motion.div>
                <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>

              {/* Bottom shimmer on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px from-transparent via-white/20 to-transparent bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0e24] to-[#070818]" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">How It Works</h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div {...fadeUp(i * 0.15)}
                  whileHover={{ y: -8 }}
                  className="flex-1 max-w-xs text-center group"
                >
                  {/* Step circle */}
                  <div className="relative inline-flex">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                      className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] flex items-center justify-center text-3xl shadow-2xl shadow-blue-500/30 mb-6 mx-auto"
                    >
                      {step.icon}
                    </motion.div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white text-gray-900 text-xs font-black rounded-full flex items-center justify-center shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>

                {i < steps.length - 1 && (
                  <motion.div
                    {...fadeLeft(i * 0.15 + 0.1)}
                    className="hidden lg:flex items-center text-blue-600/40 text-3xl flex-shrink-0"
                  >
                    <motion.span
                      animate={{ x: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >→</motion.span>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA BANNER ══════════════════════ */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <motion.div {...fadeUp(0)}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 text-center shadow-2xl shadow-blue-500/20"
        >
          {/* Orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[60px]" />
          <div className="absolute inset-0 dot-grid opacity-20" />

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-5xl mb-6 inline-block"
            >🏥</motion.div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to check your health?</h2>
            <p className="text-blue-200 mb-8 max-w-lg mx-auto font-medium">Get your AI-powered diagnosis in under 60 seconds. Free to use.</p>
            <Link to="/register"
              className="inline-flex items-center space-x-2 bg-white text-blue-700 px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition hover:-translate-y-1 shadow-xl active:scale-95"
            >
              <span>🚀</span><span>Get Started Free</span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════ DISCLAIMER ══════════════════════ */}
      <section className="py-10 max-w-4xl mx-auto px-4 pb-20">
        <motion.div {...fadeUp(0)}
          className="flex items-start space-x-4 bg-red-500/10 border border-red-500/20 p-6 rounded-2xl"
        >
          <HiExclamation className="text-red-400 w-7 h-7 flex-shrink-0 mt-0.5" />
          <p className="text-red-300/80 text-sm leading-relaxed font-medium">
            <span className="font-black text-red-300 uppercase mr-1">Disclaimer:</span>
            This tool is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult your physician or qualified health provider.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
