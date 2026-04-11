import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiClock, HiFire, HiTrendingUp, HiChevronDown, HiChevronUp, HiCalendar } from 'react-icons/hi';

const ExerciseVideos = ({ exercises = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {exercises.map((item, i) => (
        <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-blue-50/50 transition-all">
          {/* YouTube Thumbnail with Play Button */}
          <div className="relative aspect-video w-full overflow-hidden">
             <img 
               src={item.video?.thumbnail || `https://img.youtube.com/vi/${item.video?.videoId}/maxresdefault.jpg`} 
               alt={item.name}
               className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
             />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300 flex items-center justify-center">
                <a 
                  href={item.video?.url || `https://www.youtube.com/watch?v=${item.video?.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-125 transition duration-300"
                >
                  <HiPlay className="w-8 h-8 ml-1" />
                </a>
             </div>
             <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl inline-flex items-center space-x-2 shadow-sm border border-white/50">
                   <span className="text-xl">{item.emoji || '🏃'}</span>
                   <span className="text-xs font-black text-gray-900 truncate">{item.name}</span>
                </div>
             </div>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <p className="text-sm text-gray-500 leading-relaxed italic mb-6">"{item.benefit}"</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
               <div className="bg-blue-50 p-3 rounded-2xl flex items-center space-x-3">
                  <HiClock className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="block text-[8px] font-black uppercase text-blue-400">Duration</span>
                    <span className="text-xs font-black text-blue-800">{item.duration}</span>
                  </div>
               </div>
               <div className="bg-orange-50 p-3 rounded-2xl flex items-center space-x-3">
                  <HiFire className="text-orange-500 w-5 h-5" />
                  <div>
                    <span className="block text-[8px] font-black uppercase text-orange-400">Burn Est.</span>
                    <span className="text-xs font-black text-orange-800">~150 kcal</span>
                  </div>
               </div>
               <div className="bg-indigo-50 p-3 rounded-2xl flex items-center space-x-3">
                  <HiTrendingUp className="text-indigo-500 w-5 h-5" />
                  <div>
                    <span className="block text-[8px] font-black uppercase text-indigo-400">Intensity</span>
                    <span className="text-xs font-black text-indigo-800 uppercase">{item.intensity}</span>
                  </div>
               </div>
               <div className="bg-green-50 p-3 rounded-2xl flex items-center space-x-3">
                  <HiCalendar className="text-green-500 w-5 h-5" />
                  <div>
                    <span className="block text-[8px] font-black uppercase text-green-400">Best Time</span>
                    <span className="text-xs font-black text-green-800">{item.best_time || 'Anytime'}</span>
                  </div>
               </div>
            </div>

            {/* Steps Accordion */}
            <div className="mt-auto">
               <button 
                 onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                 className="w-full flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition"
               >
                 <span>View Full Steps</span>
                 {expandedIndex === i ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
               </button>
               <AnimatePresence>
                 {expandedIndex === i && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden"
                   >
                     <div className="pt-4 space-y-3">
                        {item.steps?.map((step, sIdx) => (
                           <div key={sIdx} className="flex items-start space-x-3">
                              <span className="w-5 h-5 bg-gray-100 text-gray-400 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{sIdx + 1}</span>
                              <p className="text-xs text-gray-600 leading-relaxed font-medium">{step}</p>
                           </div>
                        ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
               <span className="text-[10px] font-bold text-gray-400 italic">Source: {item.video?.channel || 'YouTube Health'}</span>
               <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] uppercase font-black rounded-full border border-gray-100">
                 {item.frequency}
               </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseVideos;
