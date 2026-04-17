import React from 'react';
import { HiLightningBolt, HiClock, HiExclamation } from 'react-icons/hi';

const getIcon = (slug) => {
  if (!slug || typeof slug !== 'string') return '💡';
  const mapping = {
    biotech: '🧪',
    medication: '💊',
    accessibility: '♿',
    no_meals: '🍽️',
    block: '🚫',
    warning: '🚨',
    fitness: '🏃',
    restaurant: '🥗',
    blood: '🩸',
    heart: '❤️',
    sleep: '😴',
    water: '💧',
    doctor: '🩺',
    hospital: '🏥'
  };
  return mapping[slug.toLowerCase()] || '💡';
};

const OvercomeTips = ({ tips = [] }) => {
  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 ring-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-50 ring-yellow-100';
      case 'low': return 'text-green-600 bg-green-50 ring-green-100';
      default: return 'text-blue-600 bg-blue-50 ring-blue-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tips.map((tip, i) => (
        <div 
          key={i} 
          className="bg-white p-6 rounded-3xl border-l-[6px] border-l-blue-600 border border-gray-100 shadow-sm hover:shadow-lg transition flex flex-col h-full"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
               {getIcon(tip.icon)}
            </div>
            <div className="flex flex-col items-end space-y-2">
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ${getPriorityColor(tip.priority)}`}>
                 {tip.priority} Priority
               </span>
               <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold">
                 <HiClock className="w-3 h-3" />
                 <span className="uppercase">{tip.timeframe}</span>
               </div>
            </div>
          </div>

          <h3 className="text-lg font-black text-gray-900 mb-2">{tip.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow italic">
            {tip.description}
          </p>
          
          <div className="pt-4 border-t border-gray-50 flex items-center space-x-2 text-xs font-bold text-gray-400">
             <HiExclamation className="text-blue-200" />
             <span>Clinical Recommendation</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OvercomeTips;
