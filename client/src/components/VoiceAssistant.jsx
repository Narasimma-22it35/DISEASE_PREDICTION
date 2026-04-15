import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = {
  en: { label: 'English', flag: '🇬🇧', lang: 'en-IN', code: 'en' },
  ta: { label: 'தமிழ்',  flag: '🇮🇳', lang: 'ta-IN', code: 'ta' },
};

const VoiceAssistant = ({ prediction, healthPlan }) => {
  const [isPlaying, setIsPlaying]        = useState(false);
  const [isPaused,  setIsPaused]         = useState(false);
  const [currentLine, setCurrentLine]    = useState('');
  const [isSupported, setIsSupported]    = useState(true);
  const [language, setLanguage]          = useState('en');
  const [tamilVoice, setTamilVoice]      = useState(null);   // found Tamil voice or null
  const [voicesLoaded, setVoicesLoaded]  = useState(false);
  const lineIndexRef = useRef(0);

  /* ── Load voices and detect Tamil ── */
  useEffect(() => {
    if (!window.speechSynthesis) { setIsSupported(false); return; }

    const detectTamil = () => {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;
      const ta = all.find(v =>
        v.lang === 'ta-IN' ||
        v.lang === 'ta'    ||
        v.lang.startsWith('ta') ||
        v.name.toLowerCase().includes('tamil')
      );
      setTamilVoice(ta || null);
      setVoicesLoaded(true);
    };

    detectTamil();
    window.speechSynthesis.onvoiceschanged = detectTamil;

    return () => { window.speechSynthesis.cancel(); };
  }, []);

  /* ─────────── SCRIPTS ─────────── */
  const buildEnglishScript = () => {
    const name      = prediction?.patientId?.personalInfo?.name || prediction?.patientId?.name || 'Dear Patient';
    const disease   = healthPlan?.disease   || 'an unknown condition';
    const riskLevel = healthPlan?.riskLevel || 'moderate';
    const severity  = healthPlan?.severity  || 'moderate';
    const dos   = healthPlan?.plan?.dos   || [];
    const donts = healthPlan?.plan?.donts || [];
    const tips  = healthPlan?.plan?.overcome_tips || [];

    const lines = [
      `Hello, ${name}. This is your HealthGuard AI health report.`,
      `Please listen carefully to your personalized medical advice.`,
      `Your primary diagnosis is: ${disease}.`,
      `Your risk level is classified as ${riskLevel}, with ${severity} severity.`,
    ];
    if (tips.length) {
      lines.push('Here are your top recovery tips.');
      tips.slice(0, 2).forEach((t, i) => {
        const txt = typeof t === 'string' ? t : t.tip || t.title || t.description || '';
        if (txt) lines.push(`Tip ${i + 1}: ${txt}`);
      });
    }
    if (dos.length) {
      lines.push('Now, here are the important things you SHOULD do every day.');
      dos.slice(0, 4).forEach((d, i) => {
        const txt = typeof d === 'string' ? d : d.action || d.text || d.do || '';
        if (txt) lines.push(`Do number ${i + 1}: ${txt}`);
      });
    }
    if (donts.length) {
      lines.push('And now, here are the things you should AVOID.');
      donts.slice(0, 4).forEach((d, i) => {
        const txt = typeof d === 'string' ? d : d.action || d.text || d.dont || '';
        if (txt) lines.push(`Avoid number ${i + 1}: ${txt}`);
      });
    }
    lines.push('Remember, taking care of your health today will help you live a better life tomorrow.');
    lines.push(`Please share this report with your doctor. Thank you, ${name}. Stay healthy!`);
    return lines;
  };

  const buildTamilScript = () => {
    const name      = prediction?.patientId?.personalInfo?.name || prediction?.patientId?.name || 'அன்பான நோயாளி';
    const disease   = healthPlan?.disease   || 'தெரியாத நோய்';
    const riskLevel = healthPlan?.riskLevel === 'High'   ? 'அதிக ஆபத்து'
                    : healthPlan?.riskLevel === 'Medium' ? 'நடுத்தர ஆபத்து'
                    :                                      'குறைந்த ஆபத்து';
    const severity  = healthPlan?.severity  === 'Critical' ? 'மிகவும் தீவிரமான'
                    : healthPlan?.severity  === 'High'     ? 'தீவிரமான'
                    :                                        'மிதமான';
    const dos   = healthPlan?.plan?.dos   || [];
    const donts = healthPlan?.plan?.donts || [];
    const tips  = healthPlan?.plan?.overcome_tips || [];

    const lines = [
      `வணக்கம், ${name}. இது உங்கள் HealthGuard AI உடல்நல அறிக்கை.`,
      `உங்கள் தனிப்பட்ட மருத்துவ ஆலோசனையை கவனமாக கேளுங்கள்.`,
      `உங்கள் முதன்மை நோய்: ${disease}.`,
      `உங்கள் ஆபத்து நிலை ${riskLevel}, தீவிரம் ${severity}.`,
    ];
    if (tips.length) {
      lines.push('இதோ உங்கள் மீட்கு குறிப்புகள்.');
      tips.slice(0, 2).forEach((t, i) => {
        const txt = typeof t === 'string' ? t : t.title || t.description || '';
        if (txt) lines.push(`குறிப்பு ${i + 1}: ${txt}`);
      });
    }
    if (dos.length) {
      lines.push('இனி, நீங்கள் தினமும் செய்ய வேண்டியவை கேளுங்கள்.');
      dos.slice(0, 4).forEach((d, i) => {
        const txt = typeof d === 'string' ? d : d.action || d.text || '';
        if (txt) lines.push(`செய்யுங்கள் ${i + 1}: ${txt}`);
      });
    }
    if (donts.length) {
      lines.push('இனி, நீங்கள் தவிர்க்க வேண்டியவை கேளுங்கள்.');
      donts.slice(0, 4).forEach((d, i) => {
        const txt = typeof d === 'string' ? d : d.action || d.text || '';
        if (txt) lines.push(`தவிர்க்க ${i + 1}: ${txt}`);
      });
    }
    lines.push('நினைவில் வையுங்கள், இன்று ஆரோக்கியத்தை கவனிப்பது நாளைய வாழ்க்கையை மேம்படுத்தும்.');
    lines.push(`இந்த அறிக்கையை உங்கள் மருத்துவரிடம் காட்டுங்கள். நன்றி, ${name}. ஆரோக்கியமாக இருங்கள்!`);
    return lines;
  };

  /* ─────────── VOICE PICKER ─────────── */
  const pickVoice = (langCode) => {
    const all = window.speechSynthesis.getVoices();
    if (langCode === 'ta') {
      /* Return the detected Tamil voice; if none, return null (lang will still be set) */
      return tamilVoice || null;
    }
    return (
      all.find(v => v.name.includes('Google UK English Female')) ||
      all.find(v => v.name.includes('Samantha'))               ||
      all.find(v => v.name.includes('Microsoft Zira'))         ||
      all.find(v => v.lang === 'en-IN')                        ||
      all.find(v => v.lang.startsWith('en'))                   ||
      all[0]
    );
  };

  /* ─────────── SPEAK ENGINE ─────────── */
  const speakLine = (lines, index, langCode) => {
    if (index >= lines.length) {
      setIsPlaying(false);
      setCurrentLine('');
      lineIndexRef.current = 0;
      return;
    }

    const line = lines[index];
    setCurrentLine(line);
    lineIndexRef.current = index;

    const utt   = new SpeechSynthesisUtterance(line);
    const voice = pickVoice(langCode);

    /* Always set the lang – even without a dedicated voice,
       modern browsers (Chrome ≥ 90) will attempt to synthesise
       with the correct regional accent if the OS has the language pack. */
    utt.lang   = LANGUAGES[langCode].lang;
    if (voice) utt.voice = voice;
    utt.rate   = langCode === 'ta' ? 0.82 : 0.85;
    utt.pitch  = 1.0;
    utt.volume = 1;

    utt.onend  = () => speakLine(lines, index + 1, langCode);
    utt.onerror = (e) => {
      // Skip on error and continue
      speakLine(lines, index + 1, langCode);
    };

    window.speechSynthesis.speak(utt);
  };

  /* ─────────── CONTROLS ─────────── */
  const handlePlay = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    const lines = language === 'ta' ? buildTamilScript() : buildEnglishScript();
    setIsPlaying(true);
    setIsPaused(false);
    lineIndexRef.current = 0;

    const startSpeaking = () => speakLine(lines, 0, language);
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = startSpeaking;
    } else {
      startSpeaking();
    }
  };

  const handlePause  = () => { window.speechSynthesis.pause();  setIsPaused(true);  };
  const handleResume = () => { window.speechSynthesis.resume(); setIsPaused(false); };
  const handleStop   = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false); setIsPaused(false); setCurrentLine('');
  };

  const handleLanguageSwitch = (code) => {
    if (isPlaying) handleStop();
    setLanguage(code);
  };

  if (!isSupported) return null;

  const isTamil      = language === 'ta';
  const gradientClass = isTamil
    ? 'from-orange-600 via-rose-700 to-pink-800'
    : 'from-indigo-700 via-blue-800 to-purple-900';
  const accentColor   = isTamil ? '#fb923c' : '#60a5fa';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${gradientClass} rounded-[32px] p-[1px] shadow-2xl mb-8`}
    >
      <div className="bg-black/25 backdrop-blur-xl rounded-[31px] p-6 border border-white/10">

        {/* ── TOP ROW ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Icon + Title */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <motion.div
                animate={isPlaying && !isPaused ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shadow-inner"
              >
                🎙️
              </motion.div>
              {isPlaying && !isPaused && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black/30 animate-ping" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-black text-lg tracking-tight leading-tight">
                {isTamil ? 'குரல் உடல்நல உதவியாளர்' : 'Voice Health Assistant'}
              </h3>
              <p className="text-white/50 text-xs font-medium mt-0.5 truncate">
                {isPlaying && !isPaused
                  ? (isTamil ? '🔊 அறிக்கை படிக்கப்படுகிறது...' : '🔊 Reading your health report...')
                  : isPaused
                  ? (isTamil ? '⏸ இடைநிறுத்தப்பட்டது' : '⏸ Paused — click Resume')
                  : (isTamil ? 'உங்கள் நோயறிதலை கேளுங்கள்' : 'Listen to your full diagnosis aloud')}
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-white/10 rounded-2xl p-1 gap-1 flex-shrink-0">
            {Object.entries(LANGUAGES).map(([code, info]) => (
              <button
                key={code}
                onClick={() => handleLanguageSwitch(code)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                  language === code
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{info.flag}</span>
                <span>{info.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tamil voice warning (only shown when Tamil is selected & no Tamil voice found) ── */}
        <AnimatePresence>
          {isTamil && voicesLoaded && !tamilVoice && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="bg-amber-500/20 border border-amber-400/30 rounded-2xl px-4 py-3 overflow-hidden"
            >
              <div className="flex items-start space-x-3">
                <span className="text-amber-300 text-lg flex-shrink-0">⚠️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-amber-200 text-xs font-black mb-1">Tamil Voice Not Found on This Device</p>
                  <p className="text-amber-300/70 text-[11px] font-medium leading-relaxed">
                    Tamil subtitles are shown. To hear Tamil audio, install the Tamil language pack:
                  </p>
                  <div className="mt-2 text-[11px] text-amber-200/80 space-y-1 font-medium">
                    <p>• <strong>Windows:</strong> Settings → Time &amp; Language → Speech → Add voices → Tamil (India)</p>
                    <p>• <strong>Chrome:</strong> chrome://settings/languages → Add Tamil → restart browser</p>
                    <p>• <strong>Android:</strong> Settings → General Management → Language → Text-to-Speech → Tamil</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Controls ── */}
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          {!isPlaying ? (
            <motion.button
              whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
              onClick={handlePlay}
              className="flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-100 transition shadow-xl shadow-black/20"
            >
              <span className="text-base">▶</span>
              <span>{isTamil ? 'அறிக்கை இயக்கு' : 'Play Report'}</span>
            </motion.button>
          ) : (
            <>
              {!isPaused ? (
                <motion.button whileTap={{ scale: 0.95 }} onClick={handlePause}
                  className="flex items-center space-x-2 bg-white/20 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-white/30 transition"
                >
                  <span>⏸</span><span>{isTamil ? 'இடைநிறுத்து' : 'Pause'}</span>
                </motion.button>
              ) : (
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleResume}
                  className="flex items-center space-x-2 bg-green-400 text-gray-900 px-5 py-3 rounded-2xl font-black text-sm hover:bg-green-300 transition"
                >
                  <span>▶</span><span>{isTamil ? 'தொடர்' : 'Resume'}</span>
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleStop}
                className="flex items-center space-x-2 bg-red-500/80 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-red-500 transition"
              >
                <span>⏹</span><span>{isTamil ? 'நிறுத்து' : 'Stop'}</span>
              </motion.button>
            </>
          )}

          {/* Animated waveform bars */}
          <div className="ml-auto flex items-end space-x-1 h-8 opacity-60">
            {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.3].map((h, i) => (
              <motion.div
                key={i}
                animate={isPlaying && !isPaused
                  ? { scaleY: [h, 1, h * 0.5, 1, h] }
                  : { scaleY: h * 0.3 }
                }
                transition={{ repeat: Infinity, duration: 0.9 + i * 0.07, ease: 'easeInOut' }}
                className="w-1.5 rounded-full origin-bottom"
                style={{ height: '100%', backgroundColor: accentColor }}
              />
            ))}
          </div>
        </div>

        {/* ── Live Subtitle / Caption ── */}
        <AnimatePresence mode="wait">
          {isPlaying && currentLine && (
            <motion.div
              key={currentLine}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-5 bg-white/10 backdrop-blur rounded-2xl px-5 py-4 border border-white/10 relative overflow-hidden"
            >
              {/* Shimmer stripe */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none"
              />

              {/* Waveform dots */}
              <div className="flex items-center space-x-1.5 mb-2">
                {[...Array(6)].map((_, i) => (
                  <motion.div key={i}
                    animate={isPaused ? { scaleY: 0.5 } : { scaleY: [1, 2.5, 0.8, 2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.1 }}
                    className="w-1 h-3 rounded-full origin-bottom"
                    style={{ backgroundColor: accentColor }}
                  />
                ))}
                <span className="ml-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                  {isTamil ? 'இப்போது பேசுகிறது' : 'Now Speaking'}
                </span>
              </div>
              <p className="text-white font-medium text-sm leading-relaxed relative z-10">
                "{currentLine}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer Tip ── */}
        <p className="mt-4 text-white/30 text-[10px] font-bold uppercase tracking-widest text-center">
          {isTamil
            ? '🔇 சாதன ஒலியை அதிகமாக வைக்கவும் • Chrome, Edge மற்றும் Safari இல் செயல்படுகிறது'
            : '🔇 Turn up your device volume • Works in Chrome, Edge & Safari'}
        </p>
      </div>
    </motion.div>
  );
};

export default VoiceAssistant;
