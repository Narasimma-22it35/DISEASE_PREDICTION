import React, { useState, useMemo } from 'react';
import { HiSearch, HiX, HiChevronDown, HiChevronUp, HiPlus } from 'react-icons/hi';
import { AnimatePresence } from 'framer-motion';

const SYMPTOMS_DATA = {
  "General": ["Fatigue", "Weakness", "Fever", "Weight Loss", "Weight Gain", "Night Sweats", "Loss of Appetite"],
  "Cardiovascular": ["Chest Pain", "Palpitations", "Shortness of Breath", "Swollen Legs", "Irregular Heartbeat"],
  "Digestive": ["Nausea", "Vomiting", "Abdominal Pain", "Jaundice", "Dark Urine", "Bloating"],
  "Urinary": ["Frequent Urination", "Burning Urination", "Blood in Urine", "Reduced Urine Output"],
  "Neurological": ["Headache", "Dizziness", "Blurred Vision", "Numbness", "Memory Issues"],
  "Respiratory": ["Cough", "Wheezing", "Difficulty Breathing", "Chest Tightness"],
  "Endocrine": ["Excessive Thirst", "Excessive Hunger", "Cold Intolerance", "Heat Intolerance", "Excessive Sweating"],
  "Musculoskeletal": ["Joint Pain", "Muscle Weakness", "Back Pain", "Muscle Cramps"]
};

const SymptomSelector = ({ selected = [], onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(["General"]);

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
      const matching = SYMPTOMS_DATA[cat].filter(s => 
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matching.length > 0) filtered[cat] = matching;
    });
    return filtered;
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search and Selected Count */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div className="flex items-center space-x-2 whitespace-nowrap bg-blue-50 border border-blue-100 px-4 py-3 rounded-2xl">
          <span className="text-blue-600 font-black text-lg">{selected.length}</span>
          <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Symptoms Selected</span>
        </div>
      </div>

      {/* Selected Tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[50px]">
          {selected.map(s => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm font-bold shadow-md shadow-blue-100 hover:bg-red-500 transition-colors group"
            >
              <span>{s}</span>
              <HiX className="w-4 h-4 group-hover:scale-110" />
            </button>
          ))}
        </div>
      )}

      {/* Categories Accordion */}
      <div className="space-y-3">
        {Object.keys(filteredData).map(cat => (
          <div key={cat} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center justify-between px-6 py-4 bg-gray-50/50 hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg font-black text-gray-800 tracking-tight">{cat}</span>
                <span className="text-[10px] font-black text-gray-400 bg-gray-200 px-2 py-0.5 rounded-md">
                   {filteredData[cat].length}
                </span>
              </div>
              {expandedCategories.includes(cat) ? <HiChevronUp className="w-5 h-5 text-gray-400" /> : <HiChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            <AnimatePresence>
              {expandedCategories.includes(cat) && (
                <div className="p-6">
                   <div className="flex flex-wrap gap-2">
                     {filteredData[cat].map(s => {
                       const isSelected = selected.includes(s);
                       return (
                         <button
                           key={s}
                           onClick={() => toggleSymptom(s)}
                           className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                             isSelected 
                               ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                               : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50'
                           }`}
                         >
                           {isSelected ? <HiX className="w-4 h-4" /> : <HiPlus className="w-4 h-4" />}
                           <span>{s}</span>
                         </button>
                       );
                     })}
                   </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {Object.keys(filteredData).length === 0 && (
        <div className="text-center py-12">
           <p className="text-gray-400 font-medium">No symptoms found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

// Simple AnimatePresence internal helper if motion is used 
// (though for brevity I used conditional rendering, but I'll add motion for real premium feel)

export default SymptomSelector;
