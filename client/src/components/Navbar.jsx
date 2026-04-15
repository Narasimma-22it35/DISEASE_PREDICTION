import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
    setProfileOpen(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navLinks = user ? [
    { to: '/dashboard', label: 'Dashboard',      icon: '📊' },
    { to: '/predict',   label: 'New Prediction', icon: '➕' },
  ] : [];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#0a0b1e]/95 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/5'
        : 'bg-[#0a0b1e]/80 backdrop-blur-md border-b border-white/5'
    }`}>

      {/* Animated top glow stripe */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-lg"
            >
              🏥
            </motion.div>
            <div className="leading-none">
              <span className="block text-base font-black text-white tracking-tight group-hover:text-blue-300 transition">
                HealthGuard
              </span>
              <span className="block text-[10px] font-bold text-blue-400 uppercase tracking-[0.15em]">
                AI Platform
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/8'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}

            {user ? (
              <div className="relative ml-2" ref={profileRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 bg-white/8 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-2xl transition group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-white/80 group-hover:text-white max-w-[90px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <motion.span
                    animate={{ rotate: profileOpen ? 180 : 0 }}
                    className="text-white/40 text-xs"
                  >▾</motion.span>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-[#111827]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-black">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => { navigate('/dashboard'); setProfileOpen(false); }}
                          className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 rounded-xl flex items-center space-x-3 transition"
                        >
                          <span>📊</span><span className="font-semibold">Dashboard</span>
                        </button>
                        <button
                          onClick={() => { navigate('/predict'); setProfileOpen(false); }}
                          className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 rounded-xl flex items-center space-x-3 transition"
                        >
                          <span>🔬</span><span className="font-semibold">New Analysis</span>
                        </button>
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl flex items-center space-x-3 transition font-semibold"
                          >
                            <span>🚪</span><span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-3">
                <Link to="/login"
                  className="text-gray-400 hover:text-white text-sm font-bold transition px-3 py-2 rounded-xl hover:bg-white/8"
                >
                  Login
                </Link>
                <Link to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-xl font-black text-sm shadow-lg shadow-blue-500/25 transition active:scale-95"
                >
                  Get Started →
                </Link>
              </div>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isOpen ? 'x' : 'menu'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                className="text-xl"
              >
                {isOpen ? '✕' : '☰'}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#0d0e24]/98 border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-3 bg-white/5 rounded-2xl mb-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  {navLinks.map(({ to, label, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/8 rounded-xl transition font-semibold text-sm"
                    >
                      <span>{icon}</span><span>{label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition font-semibold text-sm mt-2"
                  >
                    <span>🚪</span><span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/8 rounded-xl transition font-semibold text-sm"
                  >Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-xl font-black text-sm"
                  >Get Started →</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
