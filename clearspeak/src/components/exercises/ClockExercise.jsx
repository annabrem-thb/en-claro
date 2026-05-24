import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

// Helper to enforce correct TTS pronunciation of hours and minutes
const formatTimeForTTS = (text, lang) => {
  if (!text) return '';
  return text.replace(/\b0?(\d+):(\d+)\b/g, (match, h, m) => {
    const min = parseInt(m, 10);
    if (lang === 'pl') {
      return min === 0 ? `godzina ${h}` : `godzina ${h} i ${min} minut`;
    }
    if (lang === 'de') {
      return min === 0 ? `${h} Uhr` : `${h} Uhr ${min}`;
    }
    return min === 0 ? `${h}` : `${h} ${min}`;
  }).replace(/\s*Uhr\s*Uhr/gi, ' Uhr');
};

/**
 * ClockExercise Component
 * Refactored to use shared hooks and components for cleaner structure.
 * Supports: Bionic Reading, Zen Mode, Voice Selection, and Full i18n.
 */
function ClockExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  language,
  t,
  speak,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  zenMode = false,
}) {
  // Voice recognition logic
  const { isListening, transcript, startListening } = useExerciseVoice(
    language,
    t,
  );

  const [activeHighlight, setActiveHighlight] = useState(null);
  const { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  const clearAudioTimeouts = useCallback(() => {
    clearAllTimeouts();
    setActiveHighlight(null);
  }, [clearAllTimeouts]);

  useEffect(() => {
    return () => {
      clearAudioTimeouts();
      window.speechSynthesis.cancel();
    };
  }, [clearAudioTimeouts]);

  // Shuffle options predictably using a seed to maintain consistency across re-renders
  const shuffledOptions = useMemo(() => {
    if (!data.options) return [];
    const hash = (s) =>
      Array.from(s).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
    const seed = hash(data.timeAnalog || 'clock');
    return [...data.options].sort(
      (a, b) => hash((a.text || '') + seed) - hash((b.text || '') + seed),
    );
  }, [data]);

  // Delayed feedback loop on incorrect answer
  const handleMistake = useCallback(() => {
    onError();
    setSafeTimeout(() => {
      window.speechSynthesis.cancel();
      clearAudioTimeouts();

      const correctIndex = shuffledOptions.findIndex((o) => o.isCorrect);
      if (correctIndex !== -1) {
        const correctOpt = shuffledOptions[correctIndex];
        setActiveHighlight(correctIndex);
        
        const spokenTime = formatTimeForTTS(correctOpt.text, language);
        speak(`${data.timeAnalog}. ${spokenTime}`, extendedTime);
        
        setSafeTimeout(() => {
          setActiveHighlight(null);
        }, extendedTime ? 4000 : 3000);
      }
    }, extendedTime ? 3500 : 2500);
  }, [onError, setSafeTimeout, clearAudioTimeouts, shuffledOptions, data, speak, extendedTime]);

  // Map recognized voice input numbers to corresponding options
  const handleVoiceMatch = (num) => {
    clearAudioTimeouts();
    window.speechSynthesis.cancel();
    const selectedIndex = num - 1;
    if (selectedIndex >= 0 && selectedIndex < shuffledOptions.length) {
      shuffledOptions[selectedIndex].isCorrect ? onSuccess() : handleMistake();
    } else {
      handleMistake();
    }
  };

  const readTimeAndOptions = () => {
    window.speechSynthesis.cancel();
    clearAudioTimeouts();

    // Pull localized prefix from i18n dictionary or fallback
    const getOptionPrefix = (idx) => {
      const prefixes = {
        pl: `Opcja ${idx}: `,
        en: `Option ${idx}: `,
        de: `Option ${idx}: `
      };
      return t.optionPrefix ? t.optionPrefix(idx) : (prefixes[language] || prefixes['en']);
    };

    speak(data.timeAnalog, extendedTime);

    const charCount = (data.timeAnalog || '').length;
    let delayAcc = charCount * (extendedTime ? 90 : 65) + 1500;

    shuffledOptions.forEach((opt, index) => {
      const prefix = getOptionPrefix(index + 1);
      
      // Remove colon from the prefix to prevent TTS from prematurely stopping
      const spokenPrefix = prefix.replace(':', '.');
      const spokenTime = formatTimeForTTS(opt.text, language);
      const fullSpokenText = `${spokenPrefix} ${spokenTime}`;

      // Calculate step duration based on spoken string length with extra buffer for numbers
      const stepDuration = fullSpokenText.length * (extendedTime ? 100 : 75) + 1500;

      setSafeTimeout(() => {
        setActiveHighlight(index);
        speak(fullSpokenText);
      }, delayAcc);

      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === index ? null : prev));
      }, delayAcc + stepDuration - 200);

      delayAcc += stepDuration;
    });
  };

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const bounceClass = noFlash ? '' : 'animate-bounce duration-[3s]';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-4 ring-red-100';
  const btnPadding = bigTargets
    ? 'py-6 px-2 text-lg sm:text-2xl'
    : 'py-4 sm:py-5 px-2 text-base sm:text-xl';
  const clockSize = bigTargets ? 'w-64 h-64' : 'w-56 h-56';
  const hourLen = bigTargets ? 'h-16' : 'h-14';
  const minLen = bigTargets ? 'h-24' : 'h-20';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl'
    : 'w-12 h-12 text-xl';

  return (
    <div className={`${animClass} flex w-full flex-col items-center`}>
      {/* 1. Voice Controls Section */}
      <div className="mb-4 flex shrink-0 gap-4">
        <TTSController
          onReadAloud={readTimeAndOptions}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          t={t}
          controlBtnSize={controlBtnSize}
        />

        <button
          onClick={() => startListening(handleVoiceMatch)}
          className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-md transition-all active:scale-95 ${
            isListening
              ? pulseClass + ' text-white'
              : `${themeStyles.button} text-white hover:brightness-110`
          }`}
          aria-label={isListening ? t.listening : t.speakOptionNumber}
          aria-pressed={isListening}
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>

      {/* 2. Feedback Transcript */}
      {transcript && (
        <p className="mb-2 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      {/* 3. Visual Indicators (Partially hidden in Zen Mode) */}
      <div className="mb-4 flex shrink-0 flex-col items-center">
        <div className={`mb-1 text-4xl ${bounceClass}`} aria-hidden="true">
          {data.isNight ? '🌙' : '☀️'}
        </div>
        {!zenMode && (
          <p className="text-xs font-medium tracking-wide text-slate-400 italic">
            <BionicText text={data.timeAnalog} enabled={bionicReading} />
          </p>
        )}
      </div>

      {/* 4. The Analog Clock Face */}
      <style>{`
        @keyframes clock-tick {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        className={`relative ${clockSize} mb-6 flex shrink-0 items-center justify-center rounded-full border-8 shadow-xl transition-colors duration-1000 ${
          data.isNight
            ? 'border-slate-700 bg-slate-800 shadow-blue-900/20'
            : 'border-slate-100 bg-white shadow-slate-200/50'
        }`}
      >
        {/* Hour hand */}
        <div
          className={`absolute w-2 ${hourLen} rounded-full transition-all duration-700 ${data.isNight ? 'bg-blue-200' : 'bg-slate-800'}`}
          style={{
            transform: `rotate(${data.hourRotation}deg)`,
            transformOrigin: 'bottom center',
            bottom: '50%',
          }}
        />
        {/* Minute hand */}
        <div
          className={`absolute w-1.5 ${minLen} rounded-full transition-all duration-700 ${data.isNight ? 'bg-slate-400' : 'bg-slate-400'}`}
          style={{
            transform: `rotate(${data.minuteRotation}deg)`,
            transformOrigin: 'bottom center',
            bottom: '50%',
          }}
        />
        {/* Second hand (ticking animation) - disabled in noFlash mode for accessibility */}
        {!noFlash && (
          <div
            className={`absolute w-0.5 ${minLen} rounded-full bg-red-500 z-0`}
            style={{
              transformOrigin: 'bottom center',
              bottom: '50%',
              animation: 'clock-tick 60s steps(60) infinite',
            }}
          />
        )}
        {/* Center pin */}
        <div
          className={`z-10 h-4 w-4 rounded-full shadow-md ${data.isNight ? 'bg-blue-300' : 'bg-slate-800'}`}
        />
        {/* Decorative tick marks */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className={`absolute h-4 w-1.5 rounded-full ${data.isNight ? 'bg-slate-600' : 'bg-slate-200'}`}
            style={{ transform: `rotate(${deg}deg) translateY(-96px)` }}
          />
        ))}
      </div>

      {/* 5. Digital Time Options */}
      <div className="grid w-full max-w-md grid-cols-2 shrink-0 gap-3 px-2 sm:max-w-lg sm:gap-4">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              window.speechSynthesis.cancel();
              opt.isCorrect ? onSuccess() : handleMistake();
            }}
            disabled={isListening}
            className={`relative ${btnPadding} flex min-h-[4rem] items-center justify-center overflow-hidden rounded-2xl border-2 font-black text-center leading-tight shadow-sm transition-all active:scale-95 sm:rounded-3xl ${
              isListening 
                ? 'opacity-50 grayscale' 
                : activeHighlight === i
                  ? 'scale-105 ring-4 ring-yellow-400 bg-yellow-50 shadow-xl z-10 border-yellow-400 text-slate-900'
                  : `${themeStyles.border} ${themeStyles.accent} bg-white hover:${themeStyles.bg}`
            }`}
          >
            <span
              className="absolute top-2 left-3 text-xs font-black text-slate-300"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <BionicText text={opt.text} enabled={bionicReading} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ClockExercise;
