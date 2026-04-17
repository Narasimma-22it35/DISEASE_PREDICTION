import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiLocationMarker, HiPhone, HiArrowRight } from 'react-icons/hi';

const NearbyDoctors = ({ isOpen, onClose, disease }) => {
  const [locationState, setLocationState] = useState('idle'); // idle | loading | success | error
  const [coords, setCoords] = useState(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (isOpen) {
      detectLocation();
    }
  }, [isOpen]);

  const detectLocation = () => {
    setLocationState('loading');
    if (!navigator.geolocation) {
      setLocationState('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || '';
          const state = data.address?.state || '';
          setLocationName(`${city}${city && state ? ', ' : ''}${state}`);
        } catch {
          setLocationName('your area');
        }

        setLocationState('success');
      },
      () => setLocationState('error'),
      { timeout: 8000 }
    );
  };

  const buildMapsUrl = (type) => {
    const specialistMap = {
      'Diabetes': 'endocrinologist+diabetologist',
      'Heart Disease': 'cardiologist+heart+specialist',
      'Hypertension': 'cardiologist+hypertension+specialist',
      'Hyperlipidemia': 'cardiologist+lipid+clinic',
      'Liver Disease': 'gastroenterologist+hepatologist',
      'Kidney Disease': 'nephrologist',
      'Thyroid': 'endocrinologist+thyroid+specialist',
    };
    const specialist = specialistMap[disease] || 'general+physician+doctor';

    if (coords) {
      const query = type === 'hospital' ? `hospitals+near+me` : `${specialist}+near+me`;
      return `https://www.google.com/maps/search/${query}/@${coords.lat},${coords.lng},14z`;
    }
    const query = type === 'hospital' ? 'hospitals near me' : `${specialist.replace(/\+/g, ' ')} near me`;
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  };

  const getEmergencyContacts = () => {
    const loc = locationName.toLowerCase();
    if (loc.includes('india') || loc.includes('chennai') || loc.includes('tamil')) {
      return [
        { label: '🚑 Ambulance', number: '108', color: 'bg-rose-50 border-rose-100 text-rose-700' },
        { label: '🏥 Health Help', number: '104', color: 'bg-blue-50 border-blue-100 text-blue-700' },
        { label: '🆘 Emergency', number: '112', color: 'bg-rose-50 border-rose-100 text-rose-700' },
      ];
    }
    return [
      { label: '🚑 Ambulance', number: '911 / 999 / 108', color: 'bg-rose-50 border-rose-100 text-rose-700' },
      { label: '🏥 Any Emergency', number: '112', color: 'bg-blue-50 border-blue-100 text-blue-700' },
    ];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="bg-white rounded-[50px] w-full max-w-xl shadow-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl">⚕️</div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-3">
                 <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-xl">🏥</div>
                 <h2 className="text-4xl font-black tracking-tight leading-none">Find Help Near You</h2>
                 <p className="text-indigo-100 font-bold text-lg">Doctors for <span className="text-white underline">{disease || 'your health'}</span></p>
              </div>
              <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition">
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Location Status */}
            <div className="mt-10 bg-white/10 backdrop-blur-md rounded-3xl p-5 flex items-center justify-between border border-white/10">
               <div className="flex items-center space-x-4">
                  <span className="text-3xl">📍</span>
                  <div className="text-left">
                     <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Checking your place</p>
                     <p className="font-black text-white">{locationState === 'success' ? locationName : locationState === 'loading' ? 'Searching GPS...' : 'Location needed'}</p>
                  </div>
               </div>
               {locationState !== 'success' && (
                 <button onClick={detectLocation} className="px-4 py-2 bg-white text-indigo-700 rounded-xl font-black text-xs uppercase">Try Again</button>
               )}
            </div>
          </div>

          <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Find Expert */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Experts who can help</h3>
              <div className="grid grid-cols-1 gap-4">
                <a href={buildMapsUrl('doctor')} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-indigo-50 hover:bg-indigo-100 rounded-[30px] border-2 border-indigo-100 transition-all group">
                   <div className="flex items-center space-x-6">
                      <span className="text-4xl group-hover:scale-125 transition-transform duration-500">👨‍⚕️</span>
                      <div className="text-left">
                         <p className="text-xl font-black text-slate-900">Dr. Specialists</p>
                         <p className="text-sm text-slate-500 font-medium">Find doctors for {disease || 'health'}</p>
                      </div>
                   </div>
                   <HiArrowRight className="w-8 h-8 text-indigo-400 group-hover:translate-x-2 transition-all" />
                </a>

                <a href={buildMapsUrl('hospital')} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-emerald-50 hover:bg-emerald-100 rounded-[30px] border-2 border-emerald-100 transition-all group">
                   <div className="flex items-center space-x-6">
                      <span className="text-4xl group-hover:scale-125 transition-transform duration-500">🏥</span>
                      <div className="text-left">
                         <p className="text-xl font-black text-slate-900">Big Hospitals</p>
                         <p className="text-sm text-slate-500 font-medium">Place for emergency help</p>
                      </div>
                   </div>
                   <HiArrowRight className="w-8 h-8 text-emerald-400 group-hover:translate-x-2 transition-all" />
                </a>
              </div>
            </div>

            {/* Quick Call */}
            <div className="space-y-4">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Quick Call (Emergency)</h3>
               <div className="space-y-3">
                  {getEmergencyContacts().map((contact, i) => (
                    <a key={i} href={`tel:${contact.number}`} className={`flex items-center justify-between p-5 rounded-2xl border-2 hover:scale-[1.02] transition-all ${contact.color}`}>
                       <span className="text-lg font-black">{contact.label}</span>
                       <div className="flex items-center space-x-2">
                          <HiPhone className="w-5 h-5" />
                          <span className="text-2xl font-black">{contact.number}</span>
                       </div>
                    </a>
                  ))}
               </div>
            </div>
            
            {/* Advice */}
            <div className="p-8 bg-amber-50 rounded-[30px] border-2 border-amber-100 flex items-start space-x-4">
               <span className="text-3xl">💡</span>
               <p className="text-amber-800 font-bold leading-relaxed">
                 <span className="font-black">Helpful Tip:</span> Show your downloaded report to the doctor. It helps them understand you faster!
               </p>
            </div>
          </div>

          <div className="p-10 bg-slate-50 border-t border-slate-100">
             <button onClick={onClose} className="w-full h-16 bg-white text-slate-400 hover:text-indigo-600 font-black text-lg uppercase tracking-widest rounded-3xl border-2 border-slate-100 transition-all">
               Close This
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NearbyDoctors;
