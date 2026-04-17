import React from 'react';
import { HiCheckCircle, HiExclamationCircle, HiShieldCheck } from 'react-icons/hi';

const getIcon = (slug) => {
  if (!slug || typeof slug !== 'string') return '✅';
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
  return mapping[slug.toLowerCase()] || '✅';
};

const DosAndDonts = ({ dos = [], donts = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* DOS Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-6">
           <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
             <HiCheckCircle className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-black text-gray-900">Recommended Actions (DO's)</h3>
        </div>
        {dos.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-4">
            <div className="flex items-start justify-between">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    {getIcon(item.icon)}
                  </div>
                  <h4 className="font-bold text-gray-900 leading-tight">{item.action}</h4>
               </div>
               <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] uppercase font-black rounded-full">
                 {item.frequency}
               </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed italic">{item.description}</p>
            <div className="pt-4 border-t border-gray-50 flex items-start space-x-2">
               <HiShieldCheck className="text-green-300 w-5 h-5 flex-shrink-0" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-gray-400">Scientific Reason</span>
                  <p className="text-xs text-gray-600 font-medium">{item.scientific_reason}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* DON'Ts Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-6">
           <div className="w-10 h-10 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
             <HiExclamationCircle className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-black text-gray-900">Avoidance Guide (DON'Ts)</h3>
        </div>
        {donts.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-4">
            <div className="flex items-start justify-between">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    {getIcon(item.icon)}
                  </div>
                  <h4 className="font-bold text-gray-900 leading-tight">{item.action}</h4>
               </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed italic">{item.reason}</p>
            <div className="pt-4 border-t border-gray-50 flex items-start space-x-2">
               <HiExclamationCircle className="text-red-300 w-5 h-5 flex-shrink-0" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-gray-400">Risk Factor</span>
                  <p className="text-xs text-red-600 font-bold">{item.risk_if_ignored}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DosAndDonts;
