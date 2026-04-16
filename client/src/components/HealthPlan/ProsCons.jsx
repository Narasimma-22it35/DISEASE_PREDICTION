import React from 'react';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

const ProsCons = ({ pros = [], cons = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Pros Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-6">
           <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
             <HiCheckCircle className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-black text-gray-900">Benefits of Early Detection</h3>
        </div>
        {pros.map((item, i) => (
          <div key={i} className="bg-green-50/50 p-6 rounded-3xl border border-green-100 space-y-2 group hover:bg-green-50 transition">
            <div className="flex items-center justify-between">
               <h4 className="font-bold text-green-900">{item.point}</h4>
               <span className="px-3 py-1 bg-green-600 text-white text-[10px] uppercase font-black rounded-full shadow-sm">
                 {item.impact}
               </span>
            </div>
            <p className="text-sm text-green-700 leading-relaxed italic">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Cons Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-6">
           <div className="w-10 h-10 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
             <HiExclamationCircle className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-black text-gray-900">Risks of Ignoring</h3>
        </div>
        {cons.map((item, i) => (
          <div key={i} className="bg-red-50/50 p-6 rounded-3xl border border-red-100 space-y-2 group hover:bg-red-50 transition">
            <div className="flex items-center justify-between">
               <h4 className="font-bold text-red-900">{item.point}</h4>
               <span className="px-3 py-1 bg-red-600 text-white text-[10px] uppercase font-black rounded-full shadow-sm">
                 {item.impact}
               </span>
            </div>
            <p className="text-sm text-red-700 leading-relaxed italic">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProsCons;
