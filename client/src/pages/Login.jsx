import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: '🤖', title: 'AI Diagnosis', desc: 'Powered by Gemini + ML models' },
  { icon: '🎙️', title: 'Voice Reports', desc: 'Tamil & English health summaries' },
  { icon: '📊', title: 'Risk Analytics', desc: 'Visual charts & trend tracking' },
  { icon: '🏥', title: 'Find Doctors', desc: 'Locate specialists near you' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070818] flex">

      {/* ── LEFT PANEL (decorative, hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Background orbs */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1240] via-[#0a1660] to-[#060818]" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-32 right-10 w-56 h-56 bg-indigo-600/20 rounded-full blur-[60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />

        {/* Grid dots */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #4f6ef7 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg">🏥</div>
            <div>
              <span className="text-white font-black text-lg">HealthGuard</span>
              <span className="ml-1 text-blue-400 font-black text-lg">AI</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Your AI-Powered <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Health Guardian
              </span>
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed mb-10 max-w-sm">
              Upload your medical reports and get instant disease predictions, personalized health plans, and voice guidance in English & Tamil.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition"
                >
                  <span className="text-2xl block mb-2">{f.icon}</span>
                  <p className="text-white font-black text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs font-medium mt-0.5">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-600 text-xs font-bold">
            © 2026 HealthGuard AI • All medical data is encrypted & private
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 relative">
        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-[#0d0e2b] to-[#070818]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl">🏥</div>
            <span className="text-white font-black text-xl">HealthGuard AI</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-black text-white mb-1">Sign In</h1>
            <p className="text-gray-500 font-medium mb-8">Access your health dashboard &amp; reports</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">✉️</span>
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 pl-11 pr-12 py-3.5 rounded-2xl focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition text-sm font-medium"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition text-base"
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 accent-blue-500" />
                  <span className="text-xs font-bold text-gray-500">Remember me</span>
                </label>
                <a href="#" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition">Forgot password?</a>
              </div>

              {/* Submit */}
              <motion.button
                type="submit" disabled={isLoading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><span>Sign In to Dashboard</span><span>→</span></>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center space-x-4 my-7">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-gray-600 font-bold">New here?</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Register link */}
            <Link to="/register"
              className="block w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-sm rounded-2xl text-center transition"
            >
              Create Free Account
            </Link>

            <p className="text-center text-gray-600 text-[11px] font-bold mt-6">
              🔒 Your data is encrypted and never shared
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
