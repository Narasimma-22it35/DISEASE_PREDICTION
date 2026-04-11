import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RiskMeter = ({ percentage, level, size = 'md' }) => {
  const [displayPercent, setDisplayPercent] = useState(0);

  // Animated number logic
  useEffect(() => {
    let start = 0;
    const end = Math.round(percentage);
    if (start === end) return;

    let timer = setInterval(() => {
      start += 1;
      setDisplayPercent(start);
      if (start === end) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, [percentage]);

  const getColor = () => {
    if (percentage <= 30) return 'from-green-400 to-green-600';
    if (percentage <= 60) return 'from-yellow-400 to-yellow-600';
    if (percentage <= 80) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getBadgeColor = () => {
    switch (level?.toUpperCase()) {
      case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sizes = {
    sm: { height: 'h-2', text: 'text-lg', label: 'text-xs' },
    md: { height: 'h-4', text: 'text-4xl', label: 'text-sm' },
    lg: { height: 'h-6', text: 'text-6xl', label: 'text-base' }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm w-full">
      <div className="relative flex flex-col items-center">
        {/* Animated Percentage */}
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`${currentSize.text} font-black mb-2 flex items-baseline`}
        >
          <span className="bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {displayPercent}
          </span>
          <span className="text-xl ml-1 text-gray-400">%</span>
        </motion.span>

        {/* Level Badge */}
        <span className={`px-4 py-1 rounded-full text-xs font-bold border-2 ${getBadgeColor()} mb-6`}>
          {level || 'UNKNOWN'} RISK
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className={`w-full ${currentSize.height} bg-gray-100 rounded-full overflow-hidden relative shadow-inner`}>
        {/* Animated Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getColor()} rounded-full shadow-lg`}
        />
      </div>
      
      {/* Legend Labels */}
      <div className="flex justify-between w-full mt-3 px-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Safe</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Warning</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Danger</span>
      </div>
    </div>
  );
};

export default RiskMeter;
