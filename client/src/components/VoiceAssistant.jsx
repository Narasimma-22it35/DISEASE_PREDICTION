import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * VoiceAssistant - Uses the Web Speech API (built into all modern browsers)
 * to read out the patient's diagnosis report in a warm, clear voice.
 * No external APIs or keys required.
 */
const VoiceAssistant = ({ prediction, healthPlan }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLine, setCurrentLine] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef(null);
  const linesRef = useRef([]);
  const lineIndexRef = useRef(0);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
    }
    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const buildScript = () => {
    const patientName = prediction?.patientId?.personalInfo?.name || 
                        prediction?.patientId?.name || 'Dear Patient';
    const disease = healthPlan?.disease || 'an unknown condition';
    const riskLevel = healthPlan?.riskLevel || 'moderate';
    const severity = healthPlan?.severity || 'moderate';
    const dos = healthPlan?.plan?.dos || [];
    const donts = healthPlan?.plan?.donts || [];
    const overcomeTips = healthPlan?.plan?.overcome_tips || [];

    const lines = [];

    // 1. Welcome
    lines.push(`Hello, ${patientName}. This is your HealthGuard AI health report.`);
    lines.push(`Please listen carefully to your personalized medical advice.`);

    // 2. Diagnosis
    lines.push(`Your primary diagnosis is: ${disease}.`);
    lines.push(`Your risk level is classified as ${riskLevel}, with ${severity} severity.`);

    // 3. Overcome tips (top 2)
    if (overcomeTips.length > 0) {
      lines.push(`Here are your top recovery tips.`);
      overcomeTips.slice(0, 2).forEach((tip, i) => {
        const text = typeof tip === 'string' ? tip : tip.tip || tip.title || '';
        if (text) lines.push(`Tip ${i + 1}: ${text}`);
      });
    }

    // 4. Do's
    if (dos.length > 0) {
      lines.push(`Now, here are the important things you SHOULD do every day.`);
      dos.slice(0, 4).forEach((item, i) => {
        const text = typeof item === 'string' ? item : item.action || item.text || item.do || '';
        if (text) lines.push(`Do number ${i + 1}: ${text}`);
      });
    }

    // 5. Don'ts
    if (donts.length > 0) {
      lines.push(`And now, here are the things you should AVOID.`);
      donts.slice(0, 4).forEach((item, i) => {
        const text = typeof item === 'string' ? item : item.action || item.text || item.dont || '';
        if (text) lines.push(`Avoid number ${i + 1}: ${text}`);
      });
    }

    // 6. Closing
    lines.push(`Remember, taking care of your health today will help you live a better life tomorrow.`);
    lines.push(`Please share this report with your doctor. Thank you, ${patientName}. Stay healthy!`);

    return lines;
  };

  const speakLine = (lines, index) => {
    if (index >= lines.length) {
      setIsPlaying(false);
      setCurrentLine('');
      lineIndexRef.current = 0;
      return;
    }

    const line = lines[index];
    setCurrentLine(line);
    lineIndexRef.current = index;

    const utterance = new SpeechSynthesisUtterance(line);

    // Pick a warm, clear voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Female') ||
      v.name.includes('Samantha') ||
      v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Zira') ||
      v.lang === 'en-IN' ||
      v.lang === 'en-GB'
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.85;   // Slightly slower for clarity
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onend = () => {
      speakLine(lines, index + 1);
    };

    utterance.onerror = () => {
      speakLine(lines, index + 1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    const lines = buildScript();
    linesRef.current = lines;
    lineIndexRef.current = 0;
    setIsPlaying(true);
    setIsPaused(false);

    // Chrome needs voices to load on first call
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speakLine(lines, 0);
      };
    } else {
      speakLine(lines, 0);
    }
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentLine('');
    lineIndexRef.current = 0;
  };

  if (!isSupported) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-[32px] p-6 shadow-2xl border border-white/10 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl ${isPlaying && !isPaused ? 'animate-pulse' : ''}`}>
              🎙️
            </div>
            {isPlaying && !isPaused && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-900 animate-pulse"></span>
            )}
          </div>
          <div>
            <h3 className="text-white font-black text-lg tracking-tight">Voice Health Assistant</h3>
            <p className="text-blue-300 text-xs font-medium">
              {isPlaying && !isPaused
                ? '🔊 Reading your health report...'
                : isPaused
                ? '⏸ Paused — click Resume to continue'
                : 'Listen to your diagnosis in your language'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="flex items-center space-x-2 bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-50 transition shadow-lg active:scale-95"
            >
              <span>▶</span>
              <span>Play Report</span>
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={handlePause}
                  className="flex items-center space-x-2 bg-white/20 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-white/30 transition active:scale-95"
                >
                  <span>⏸</span>
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="flex items-center space-x-2 bg-green-500 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-green-600 transition active:scale-95"
                >
                  <span>▶</span>
                  <span>Resume</span>
                </button>
              )}
              <button
                onClick={handleStop}
                className="flex items-center space-x-2 bg-red-500/80 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-red-600 transition active:scale-95"
              >
                <span>⏹</span>
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Live Subtitle */}
      <AnimatePresence mode="wait">
        {isPlaying && currentLine && (
          <motion.div
            key={currentLine}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-5 bg-white/10 backdrop-blur rounded-2xl px-5 py-4 border border-white/10"
          >
            {/* Sound Wave Animation */}
            <div className="flex items-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: isPaused ? 1 : [1, 2.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 h-3 bg-blue-400 rounded-full origin-bottom"
                />
              ))}
              <span className="ml-2 text-blue-300 text-[10px] font-black uppercase tracking-widest">Now Speaking</span>
            </div>
            <p className="text-white font-medium text-sm leading-relaxed">
              "{currentLine}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-blue-400/60 text-[10px] font-bold uppercase tracking-widest text-center">
        🔇 Make sure your device volume is turned up • Works in Chrome, Edge & Safari
      </p>
    </div>
  );
};

export default VoiceAssistant;
