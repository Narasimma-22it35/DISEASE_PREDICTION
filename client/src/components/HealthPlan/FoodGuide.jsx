import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiFire, HiClock, HiCheckCircle } from 'react-icons/hi';

const FoodGuide = ({ foods = [], fruits = [], vegetables = [], avoid = [] }) => {
  const [activeTab, setActiveTab] = useState('Foods');

  const tabs = [
    { name: 'Foods', data: foods, icon: '🍞' },
    { name: 'Fruits', data: fruits, icon: '🍎' },
    { name: 'Veggies', data: vegetables, icon: '🥦' },
    { name: 'Avoid', data: avoid, icon: '🚫', isDanger: true }
  ];

  const currentData = tabs.find(t => t.name === activeTab).data;

  return (
    <div className="space-y-8">
      {/* Sub tabs */}
      <div className="flex flex-wrap p-1 bg-gray-100 rounded-2xl w-fit">
        {tabs.map(t => (
          <button
            key={t.name}
            onClick={() => setActiveTab(t.name)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === t.name 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      {/* Grid of Food Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {currentData.map((item, i) => (
            <motion.div
              key={`${activeTab}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 rounded-3xl border-2 transition-all hover:shadow-xl ${
                activeTab === 'Avoid' 
                  ? 'bg-red-50 border-red-100' 
                  : 'bg-white border-gray-50 hover:border-blue-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{item.emoji || (activeTab === 'Avoid' ? '❌' : '⚡')}</div>
                <div className="flex flex-col items-end space-y-1">
                   <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                     activeTab === 'Avoid' ? 'bg-red-600 text-white' : 'bg-green-100 text-green-700'
                   }`}>
                     {activeTab === 'Avoid' ? 'High Risk' : 'Recommended'}
                   </span>
                </div>
              </div>

              <h4 className={`text-xl font-black mb-2 ${activeTab === 'Avoid' ? 'text-red-900' : 'text-gray-900'}`}>{item.name}</h4>
              <p className={`text-sm leading-relaxed mb-6 italic ${activeTab === 'Avoid' ? 'text-red-700' : 'text-gray-500'}`}>
                {item.benefit || item.reason}
              </p>

              <div className="space-y-3 pt-6 border-t border-gray-100/50">
                {activeTab !== 'Avoid' ? (
                  <>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
                       <span className="flex items-center space-x-1"><HiFire className="text-orange-400" /> <span>Portion Size</span></span>
                       <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{item.how_much}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
                       <span className="flex items-center space-x-1"><HiClock className="text-blue-400" /> <span>Best Time</span></span>
                       <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{item.when_to_eat}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-[10px] font-black uppercase text-red-400 tracking-widest">Healthy Alternative</span>
                    <div className="flex items-center space-x-2 text-sm font-bold text-green-700 bg-green-50 px-3 py-2 rounded-xl ring-1 ring-green-100">
                       <HiCheckCircle className="w-5 h-5" />
                       <span>{item.alternative}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FoodGuide;
