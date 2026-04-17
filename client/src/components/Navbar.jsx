import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiUserCircle, HiLogout, HiViewGrid, HiPlusCircle, HiHeart } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-all">
                🏥
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent tracking-tighter">
                HealthGuard AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-black uppercase tracking-widest">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-all group">
                   <HiViewGrid className="w-5 h-5 group-hover:scale-110 transition" />
                   <span>My History</span>
                </Link>
                <Link to="/predict" className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-all group">
                   <HiPlusCircle className="w-5 h-5 group-hover:scale-110 transition" />
                   <span>Start Scan</span>
                </Link>
                
                {/* User Dropdown */}
                <div className="relative pl-6 border-l border-slate-100">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-3 focus:outline-none group"
                  >
                    <div className="text-right hidden lg:block">
                       <p className="text-[10px] text-slate-400 leading-none mb-1">Welcome back,</p>
                       <p className="text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border-2 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {profileOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-white rounded-[30px] shadow-2xl border border-slate-100 py-3 animate-in fade-in slide-in-from-top-3 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-50 mb-2">
                        <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <button className="w-full text-left px-6 py-3 text-slate-600 hover:bg-slate-50 flex items-center space-x-3 transition">
                        <HiUserCircle className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-black uppercase tracking-widest">My Profile</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-6 py-3 text-rose-500 hover:bg-rose-50 flex items-center space-x-3 transition"
                      >
                        <HiLogout className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-slate-500 hover:text-indigo-600 transition font-black">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform hover:-translate-y-1 active:scale-95">
                  Join Now ✨
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition"
            >
              {isOpen ? <HiX className="w-8 h-8" /> : <HiMenu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 shadow-inner"
          >
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 px-6 py-5 text-slate-700 hover:bg-indigo-50 rounded-[25px] transition font-black uppercase text-xs tracking-widest leading-none">
                  <HiViewGrid className="w-6 h-6 text-indigo-500" />
                  <span>My History</span>
                </Link>
                <Link to="/predict" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 px-6 py-5 text-slate-700 hover:bg-indigo-50 rounded-[25px] transition font-black uppercase text-xs tracking-widest leading-none">
                  <HiPlusCircle className="w-6 h-6 text-indigo-500" />
                  <span>Start Scan</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 px-6 py-5 text-rose-500 hover:bg-rose-50 rounded-[25px] transition font-black uppercase text-xs tracking-widest leading-none"
                >
                  <HiLogout className="w-6 h-6" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-6 py-5 text-slate-700 hover:bg-indigo-50 rounded-[25px] transition font-black uppercase text-xs tracking-widest text-center leading-none">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-6 py-5 bg-indigo-600 text-white text-center rounded-[25px] font-black uppercase text-xs tracking-widest leading-none">Join Now ✨</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
