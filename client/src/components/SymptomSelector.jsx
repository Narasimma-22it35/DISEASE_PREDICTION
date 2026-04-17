import React, { useState, useMemo } from 'react';
import { HiSearch, HiX, HiChevronDown, HiChevronUp, HiPlus, HiCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const SYMPTOMS_DATA = {
  "Whole Body": { 
    icon: "🌡️", 
    color: "bg-amber-100/50 text-amber-600",
    list: ["Fatigue", "Weakness", "Fever", "Weight Loss", "Weight Gain", "Night Sweats", "Loss of Appetite"] 
  },
  "Heart & Chest": { 
    icon: "💓", 
    color: "bg-rose-100/50 text-rose-600",
    list: ["Chest Pain", "Palpitations", "Shortness of Breath", "Swollen Legs", "Irregular Heartbeat"] 
  },
  "Stomach": { 
    icon: "🤢", 
    color: "bg-emerald-100/50 text-emerald-600",
    list: ["Nausea", "Vomiting", "Abdominal Pain", "Jaundice", "Dark Urine", "Bloating"] 
  },
  "Bathroom": { 
    icon: "🧻", 
    color: "bg-blue-100/50 text-blue-600",
    list: ["Frequent Urination", "Burning Urination", "Blood in Urine", "Reduced Urine Output"] 
  },
  "Head & Brain": { 
    icon: "🧠", 
    color: "bg-purple-100/50 text-purple-600",
    list: ["Headache", "Dizziness", "Blurred Vision", "Numbness", "Memory Issues"] 
  },
  "Breathing": { 
    icon: "🌬️", 
    color: "bg-sky-100/50 text-sky-600",
    list: ["Cough", "Wheezing", "Difficulty Breathing", "Chest Tightness"] 
  },
  "Muscles & Joints": { 
    icon: "🦴", 
    color: "bg-orange-100/50 text-orange-600",
    list: ["Joint Pain", "Muscle Weakness", "Back Pain", "Muscle Cramps"] 
  }
};

const SymptomSelector = ({ selected = [], onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(["Whole Body"]);

  const toggleCategory = (cat) => {
    if (expandedCategories.includes(cat)) {
      setExpandedCategories(expandedCategories.filter(c => c !== cat));
    } else {
      setExpandedCategories([...expandedCategories, cat]);
    }
  };

  const toggleSymptom = (symptom) => {
    if (selected.includes(symptom)) {
      onChange(selected.filter(s => s !== symptom));
    } else {
      onChange([...selected, symptom]);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return SYMPTOMS_DATA;
    const filtered = {};
    Object.keys(SYMPTOMS_DATA).forEach(cat => {
      const matching = SYMPTOMS_DATA[cat].list.filter(s => 
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matching.length > 0) filtered[cat] = { ...SYMPTOMS_DATA[cat], list: matching };
    });
    return filtered;
  }, [searchTerm]);

  return (
    <div className="space-y-10">
      {/* Search Header */}
      <div className="space-y-6">
        <label className="text-sm font-black text-indigo-900 uppercase tracking-widest leading-none">Find your symptoms</label>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-grow">
            <HiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Start typing (e.g. Headache)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-20 pl-16 pr-8 bg-white border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none text-xl font-bold transition-all shadow-xl shadow-slate-100"
            />
          </div>
          <div className="flex items-center space-x-4 bg-indigo-600 px-8 py-5 rounded-3xl shadow-xl shadow-indigo-100">
             <span className="text-white font-black text-2xl leading-none">{selected.length}</span>
             <span className="text-indigo-100 text-xs font-black uppercase tracking-widest leading-none">Selected</span>
          </div>
        </div>
      </div>

      {/* Selected Tags Display */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-wrap gap-3 p-8 bg-indigo-50/50 rounded-[35px] border-2 border-indigo-100/50"
          >
            {selected.map(s => (
              <motion.button
                layout
                key={s}
                onClick={() => toggleSymptom(s)}
                className="flex items-center space-x-2 px-5 py-3 bg-white text-indigo-700 rounded-2xl text-sm font-black shadow-lg hover:bg-rose-50 hover:text-rose-600 transition-all group"
              >
                <span>{s}</span>
                <HiX className="w-5 h-5 group-hover:rotate-90 transition-all" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Modern Accordion */}
      <div className="grid grid-cols-1 gap-6">
        {Object.keys(filteredData).map(cat => {
          const config = filteredData[cat];
          const isExpanded = expandedCategories.includes(cat);
          
          return (
            <div key={cat} className={`rounded-[40px] border-2 transition-all duration-500 overflow-hidden ${isExpanded ? 'bg-white border-indigo-100 shadow-2xl' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-8 py-8 md:px-10"
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-black text-slate-900 tracking-tight block">{cat}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {config.list.length} Options available
                    </span>
                  </div>
                </div>
                {isExpanded ? <HiChevronUp className="w-8 h-8 text-slate-300" /> : <HiChevronDown className="w-8 h-8 text-slate-300" />}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-10 pb-10 flex flex-wrap gap-4">
                      {config.list.map(s => {
                        const isSelected = selected.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => toggleSymptom(s)}
                            className={`flex items-center space-x-3 h-16 px-8 rounded-2xl text-lg font-black transition-all border-2 ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' 
                                : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                            }`}
                          >
                            {isSelected ? <HiCheck className="w-6 h-6" /> : <HiPlus className="w-6 h-6" />}
                            <span>{s}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      {Object.keys(filteredData).length === 0 && (
        <div className="text-center py-20 glass-card rounded-[40px] border-2 border-dashed">
           <div className="text-6xl mb-6">🔍</div>
           <p className="text-2xl font-black text-slate-400">We couldn't find "{searchTerm}"</p>
           <p className="text-slate-400 mt-2">Try searching differently or scroll through the sections.</p>
        </div>
      )}
    </div>
  );
};

export default SymptomSelector;
