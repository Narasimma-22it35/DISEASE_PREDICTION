import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RiskMeter = ({ percentage, level, size = 'md' }) => {
  const [displayPercent, setDisplayPercent] = useState(0);

  // Animated number logic - handles decimals and prevents overflow bugs
  useEffect(() => {
    let start = 0;
    // Normalize percentage (ensure it's 0-100 and a number)
    const normalized = Math.min(100, Math.max(0, parseFloat(percentage) || 0));
    const end = Math.round(normalized);
    
    if (end === 0) {
      setDisplayPercent(0);
      return;
    }

    let timer = setInterval(() => {
      start += 1;
      setDisplayPercent(start);
      if (start >= end) clearInterval(timer);
    }, 15);

    return () => clearInterval(timer);
  }, [percentage]);

  const getColor = () => {
    const val = parseFloat(percentage) || 0;
    if (val <= 30) return 'from-emerald-400 to-emerald-600';
    if (val <= 60) return 'from-amber-400 to-amber-600';
    if (val <= 80) return 'from-orange-400 to-orange-600';
    return 'from-rose-400 to-rose-600';
  };

  const getBadgeColor = () => {
    switch (level?.toUpperCase()) {
      case 'LOW': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'CRITICAL': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizes = {
    sm: { height: 'h-2', text: 'text-lg', label: 'text-xs' },
    md: { height: 'h-4', text: 'text-4xl', label: 'text-sm' },
    lg: { height: 'h-6', text: 'text-6xl', label: 'text-base' }
  };

  const currentSize = sizes[size];
  const colorClasses = getColor();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[40px] border border-slate-100 shadow-2xl w-full relative overflow-hidden group">
      {/* Background Glow Pulse */}
      <div className={`absolute -inset-20 opacity-20 blur-[80px] bg-gradient-to-br ${colorClasses} group-hover:opacity-30 transition-opacity duration-1000`} />
      
      <div className="relative flex flex-col items-center z-10">
        {/* Animated Percentage */}
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className={`${currentSize.text} font-black mb-1 flex items-baseline`}
        >
          <span className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent">
            {displayPercent}
          </span>
          <span className="text-2xl ml-1 text-slate-400">%</span>
        </motion.span>

        {/* Level Badge */}
        <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getBadgeColor()} mb-8 shadow-sm`}>
          {level || 'UNKNOWN'} RISK
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className={`w-full ${currentSize.height} bg-slate-100 rounded-full overflow-hidden relative shadow-inner border border-slate-200/50 p-1`}>
        {/* Animated Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, parseFloat(percentage) || 0)}%` }}
          transition={{ duration: 2, ease: "circOut" }}
          className={`h-full bg-gradient-to-r ${colorClasses} rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)]`}
        />
      </div>
      
      {/* Legend Labels */}
      <div className="flex justify-between w-full mt-4 px-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safe</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warning</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danger</span>
      </div>
    </div>
  );
};

export default RiskMeter;
