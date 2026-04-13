import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NearbyDoctors Modal
 * Uses the browser Geolocation API to find nearby hospitals & doctors.
 * Opens Google Maps search results for the patient's actual location.
 * No API key required.
 */
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

        // Reverse geocode using a free API (no key needed)
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

  // Build Google Maps search query based on disease and location
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
      const query = type === 'hospital'
        ? `hospitals+near+me`
        : `${specialist}+near+me`;
      return `https://www.google.com/maps/search/${query}/@${coords.lat},${coords.lng},14z`;
    }
    // Fallback — search without coords
    const query = type === 'hospital' ? 'hospitals near me' : `${specialist.replace(/\+/g, ' ')} near me`;
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  };

  // Emergency numbers by country/region (detected from location name)
  const getEmergencyContacts = () => {
    const loc = locationName.toLowerCase();
    if (loc.includes('india') || loc.includes('tamil') || loc.includes('delhi') || loc.includes('mumbai') || loc.includes('bengaluru') || loc.includes('chennai') || loc.includes('hyderabad')) {
      return [
        { label: '🚑 Ambulance', number: '108', color: 'bg-red-50 border-red-200 text-red-700' },
        { label: '🏥 AIIMS Helpline', number: '011-26588500', color: 'bg-orange-50 border-orange-200 text-orange-700' },
        { label: '🆘 Emergency', number: '112', color: 'bg-red-50 border-red-200 text-red-700' },
        { label: '❤️ Heart Attack Helpline', number: '1800-180-1104', color: 'bg-pink-50 border-pink-200 text-pink-700' },
        { label: '💊 Poison Control', number: '1800-11-6117', color: 'bg-purple-50 border-purple-200 text-purple-700' },
      ];
    }
    if (loc.includes('usa') || loc.includes('united states') || loc.includes('california') || loc.includes('new york')) {
      return [
        { label: '🚑 Emergency', number: '911', color: 'bg-red-50 border-red-200 text-red-700' },
        { label: '🏥 Poison Control', number: '1-800-222-1222', color: 'bg-purple-50 border-purple-200 text-purple-700' },
        { label: '❤️ Heart Attack', number: '911', color: 'bg-pink-50 border-pink-200 text-pink-700' },
      ];
    }
    if (loc.includes('uk') || loc.includes('england') || loc.includes('london')) {
      return [
        { label: '🚑 Ambulance', number: '999', color: 'bg-red-50 border-red-200 text-red-700' },
        { label: '🏥 NHS Helpline', number: '111', color: 'bg-blue-50 border-blue-200 text-blue-700' },
      ];
    }
    // Global default
    return [
      { label: '🚑 Ambulance', number: '108 / 911 / 999', color: 'bg-red-50 border-red-200 text-red-700' },
      { label: '🆘 General Emergency', number: '112', color: 'bg-orange-50 border-orange-200 text-orange-700' },
      { label: '🏥 Local Hospital', number: 'Search Below ↓', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    ];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[120px] opacity-5 leading-none">🏥</div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-3xl mb-3 block">🏥</span>
                <h2 className="text-2xl font-black tracking-tight">Find Help Near You</h2>
                <p className="text-blue-200 text-sm font-medium mt-1">
                  Doctors & hospitals for <span className="text-white font-black">{disease || 'your condition'}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center text-white font-black text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Location Status */}
            <div className="mt-5 bg-white/10 rounded-2xl px-4 py-3 flex items-center space-x-3">
              {locationState === 'loading' && (
                <>
                  <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin flex-shrink-0"></div>
                  <span className="text-sm text-blue-100 font-medium">Detecting your location...</span>
                </>
              )}
              {locationState === 'success' && (
                <>
                  <span className="text-green-300 text-lg flex-shrink-0">📍</span>
                  <span className="text-sm text-white font-bold">
                    Location detected: <span className="text-green-300">{locationName || 'Your area'}</span>
                  </span>
                </>
              )}
              {locationState === 'error' && (
                <>
                  <span className="flex-shrink-0">⚠️</span>
                  <div className="flex-1">
                    <span className="text-sm text-yellow-200 font-medium">Location access denied. </span>
                    <button onClick={detectLocation} className="text-sm text-white underline font-bold">Try again</button>
                  </div>
                </>
              )}
              {locationState === 'idle' && (
                <>
                  <span className="flex-shrink-0">📡</span>
                  <span className="text-sm text-blue-100">Initializing GPS...</span>
                </>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Google Maps Buttons */}
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Find Nearby</h3>
              <div className="grid grid-cols-1 gap-3">
                <a
                  href={buildMapsUrl('doctor')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl px-5 py-4 transition group"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition">🩺</div>
                  <div>
                    <p className="font-black text-gray-900">Specialist Doctors</p>
                    <p className="text-xs text-gray-500 font-medium">Find {disease ? `${disease} specialists` : 'doctors'} near you</p>
                  </div>
                  <span className="ml-auto text-blue-500 font-black">→</span>
                </a>

                <a
                  href={buildMapsUrl('hospital')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 bg-green-50 hover:bg-green-100 border border-green-100 rounded-2xl px-5 py-4 transition group"
                >
                  <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition">🏥</div>
                  <div>
                    <p className="font-black text-gray-900">Nearby Hospitals</p>
                    <p className="text-xs text-gray-500 font-medium">Emergency & outpatient facilities</p>
                  </div>
                  <span className="ml-auto text-green-500 font-black">→</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/pharmacy+near+me${coords ? `/@${coords.lat},${coords.lng},15z` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-2xl px-5 py-4 transition group"
                >
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition">💊</div>
                  <div>
                    <p className="font-black text-gray-900">Nearby Pharmacies</p>
                    <p className="text-xs text-gray-500 font-medium">Get your medications quickly</p>
                  </div>
                  <span className="ml-auto text-purple-500 font-black">→</span>
                </a>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Emergency Contacts</h3>
              <div className="space-y-2">
                {getEmergencyContacts().map((contact, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${contact.color}`}>
                    <span className="text-sm font-bold">{contact.label}</span>
                    <a
                      href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`}
                      className="font-black text-lg tracking-wider hover:underline"
                    >
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
              <p className="text-amber-800 text-xs font-bold leading-relaxed">
                💡 <span className="font-black">Tip:</span> Carry your HealthGuard AI PDF report to your doctor's appointment. It contains your full diagnostic profile and risk analysis.
              </p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs uppercase tracking-widest rounded-2xl transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NearbyDoctors;
