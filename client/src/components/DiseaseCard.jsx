import React from 'react';
import { motion } from 'framer-motion';

const EMOJI_MAP = {
  'Diabetes': '🩸',
  'Heart Disease': '❤️',
  'Hypertension': '🩺',
  'Liver Disease': '🍷',
  'Kidney Disease': '💧',
  'Unknown': '❓'
};

const DiseaseCard = ({ disease, riskPercentage, severity, reason, onClick }) => {
  const getColor = () => {
    if (riskPercentage <= 30) return 'text-green-600 bg-green-50 px-2 rounded';
    if (riskPercentage <= 60) return 'text-yellow-600 bg-yellow-50 px-2 rounded';
    if (riskPercentage <= 80) return 'text-orange-600 bg-orange-50 px-2 rounded';
    return 'text-red-600 bg-red-50 px-2 rounded';
  };

  const getBarColor = () => {
    if (riskPercentage <= 30) return 'bg-green-500';
    if (riskPercentage <= 60) return 'bg-yellow-500';
    if (riskPercentage <= 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSeverityColor = () => {
    switch(severity?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="min-w-[280px] p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 transition-all text-left flex flex-col group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition">
          {EMOJI_MAP[disease] || EMOJI_MAP['Unknown']}
        </div>
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${getSeverityColor()}`}>
           {severity || 'NORMAL'}
        </span>
      </div>

      <h3 className="text-xl font-black text-gray-900 mb-1">{disease}</h3>
      <div className="flex items-center space-x-2 mb-4">
        <span className={`font-black text-lg ${getColor()}`}>{riskPercentage}%</span>
        <span className="text-xs font-bold text-gray-400">Risk Level</span>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${riskPercentage}%` }}
          className={`h-full ${getBarColor()}`}
        />
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed italic">
        "{reason || 'No significant findings for this condition.'}"
      </p>
    </motion.button>
  );
};

export default DiseaseCard;
