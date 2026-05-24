// ClockExercise.jsx — a11y-aware with Voice Option Selection, Zen Mode & Bionic Reading
import React, { useMemo } from 'react';
// Importing shared components to avoid code duplication
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';

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
  // Centralized voice logic using custom hook
  const { isListening, transcript, startListening } = useExerciseVoice(
    language,
    t,
  );

  // Shuffle options predictably based on seed to maintain consistency during re-renders
  const shuffledOptions = useMemo(() => {
    if (!data.options) return [];
    const hash = (s) =>
      Array.from(s).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
    const seed = hash(data.timeAnalog || 'clock');
    return [...data.options].sort(
      (a, b) => hash((a.text || '') + seed) - hash((b.text || '') + seed),
    );
  }, [data]);

  // Handle voice commands for option selection (1-4)
  const handleVoiceMatch = (num) => {
    const selectedIndex = num - 1;
    if (selectedIndex >= 0 && selectedIndex < shuffledOptions.length) {
      shuffledOptions[selectedIndex].isCorrect ? onSuccess() : onError();
    } else {
      onError();
    }
  };

  // --- Read Time & Options Aloud Logic ---
  const readTimeAndOptions = () => {
    const silentPause = ' ... , , , ... ';
    // Pull localized prefix from i18n dictionary or fallback
    const getOptionPrefix = (idx) => {
      return t.optionPrefix ? t.optionPrefix(idx) : `Option ${idx}: `;
    };

    let spokenText = `${data.timeAnalog}${silentPause}`;
    shuffledOptions.forEach((opt, index) => {
      spokenText += `${getOptionPrefix(index + 1)} ${opt.text}. `;
    });

    speak(spokenText, extendedTime);
  };

  // Dynamic styling based on accessibility props
  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const bounceClass = noFlash ? '' : 'animate-bounce duration-[3s]';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-4 ring-red-100';
  const btnPadding = bigTargets
    ? 'py-6 px-1 sm:px-2 text-xl sm:text-3xl flex-1'
    : 'py-4 sm:py-6 px-1 sm:px-2 text-base sm:text-2xl flex-1';
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
        <button
          onClick={readTimeAndOptions}
          className={`${controlBtnSize} flex items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 shadow-sm transition-all hover:text-slate-600 active:scale-90`}
          aria-label={t.readAloud || 'Read time and options aloud'}
        >
          🔊
        </button>

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
      <div className="flex w-full max-w-4xl shrink-0 flex-row justify-center gap-2 px-2 sm:gap-4">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => (opt.isCorrect ? onSuccess() : onError())}
            disabled={isListening}
            className={`relative ${btnPadding} overflow-hidden rounded-2xl border-2 font-black text-ellipsis whitespace-nowrap shadow-sm transition-all active:scale-95 sm:rounded-3xl ${isListening ? 'opacity-50 grayscale' : `${themeStyles.border} ${themeStyles.accent} bg-white hover:${themeStyles.bg}`}`}
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
