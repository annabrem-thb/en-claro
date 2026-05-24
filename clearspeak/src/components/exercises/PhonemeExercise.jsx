// PhonemeExercise.jsx — a11y-aware with Shared Logic for Voice, Bionic Reading & Auto-Spelling
import React, { useState, useEffect, useCallback } from 'react';
// Importing shared components and hooks to prevent code duplication
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * PhonemeExercise Component
 * Refactored to use centralized utilities.
 * Focuses on pronunciation and letter-to-sound recognition.
 */
function PhonemeExercise({
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

  const targetWord = data.word || '';
  const hintText = data.hints?.[language] || data.hints?.en || '';

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

  /**
   * Custom Voice Logic for Pronunciation
   * Unlike other exercises that look for numbers, this one checks the word itself.
   */
  const handleVoiceInput = (heardText) => {
    const cleanTarget = targetWord
      .toLowerCase()
      .trim()
      .replace(/[.,!?]/g, '');
    const cleanHeard = heardText
      .toLowerCase()
      .trim()
      .replace(/[.,!?]/g, '');

    // Check if the user pronounced the word correctly
    if (cleanHeard === cleanTarget || cleanHeard.includes(cleanTarget)) {
      onSuccess();
    } else {
      onError();
    }
  };

  // --- Read Word (Spelled Out) & Hint Aloud ---
  const readWordAndHint = () => {
    window.speechSynthesis.cancel();
    clearAudioTimeouts();

    let delayAcc = 0;
    const chars = Array.from(targetWord);

    // 1. Spell the word
    chars.forEach((char, i) => {
      const stepDuration = extendedTime ? 900 : 600;
      setSafeTimeout(() => {
        setActiveHighlight(`char-${i}`);
        speak(char);
      }, delayAcc);
      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === `char-${i}` ? null : prev));
      }, delayAcc + stepDuration - 100);
      delayAcc += stepDuration;
    });

    delayAcc += 800; // silent pause

    // 2. Read the hint
    if (hintText) {
      const hintDuration = hintText.length * (extendedTime ? 90 : 65) + 1000;
      setSafeTimeout(() => {
        setActiveHighlight('hint');
        speak(hintText);
      }, delayAcc);
      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === 'hint' ? null : prev));
      }, delayAcc + hintDuration - 200);
    }
  };

  // Styling and Sizing logic
  const animClass = noFlash ? '' : 'animate-in zoom-in duration-500';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const controlBtnSize = bigTargets
    ? 'w-24 h-24 text-4xl'
    : 'w-20 h-20 text-3xl';
  const wordSize = bigTargets ? 'text-6xl sm:text-7xl' : 'text-5xl sm:text-6xl';

  return (
    <div className={`${animClass} flex w-full max-w-md flex-col items-center`}>
      {/* 1. Header (Hidden in Zen Mode) */}
      {!zenMode && (
        <h3 className="mb-8 text-center text-xs md:text-sm font-black tracking-widest text-slate-400 uppercase">
          {t.categories?.Phonem || 'Phonemes'}
        </h3>
      )}

      {/* 2. The Target Word */}
      <div
        className={`font-black ${wordSize} mb-2 text-center tracking-tight break-words leading-tight w-full px-2 flex justify-center flex-wrap`}
      >
        {Array.from(targetWord).map((char, i) => {
          const isBionicBold = bionicReading && i < Math.ceil(targetWord.length / 2);
          return (
            <span
              key={i}
              className={`transition-all duration-200 inline-block ${
                activeHighlight === `char-${i}` ? 'text-yellow-500 scale-110 drop-shadow-md z-10' : 'text-slate-800'
              } ${isBionicBold ? 'font-black' : bionicReading ? 'opacity-80 font-medium' : 'font-black'}`}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* 3. Phonetic Transcription */}
      {data.phonetic && (
        <div className="mb-8 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 font-mono text-xl font-bold tracking-widest text-slate-400">
          {data.phonetic}
        </div>
      )}

      {/* 4. Hint Text (Hidden in Zen Mode to force focus on the word) */}
      {!zenMode && hintText && (
        <div className={`mb-12 px-4 text-center leading-relaxed font-medium transition-all duration-300 ${
          activeHighlight === 'hint' ? 'text-yellow-600 scale-105 drop-shadow-sm' : 'text-slate-500'
        }`}>
          💡 <BionicText text={hintText} enabled={bionicReading} />
        </div>
      )}

      {/* 5. Voice & Audio Controls */}
      <div className="mb-8 flex gap-8">
        <TTSController
          onReadAloud={readWordAndHint}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          t={t}
          controlBtnSize={controlBtnSize}
        />

        <button
          onClick={() => startListening(null, null, handleVoiceInput)}
          className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-xl transition-all active:scale-95 ${
            isListening
              ? pulseClass + ' text-white'
              : `${themeStyles.button} text-white hover:brightness-110`
          }`}
          aria-label={isListening ? t.listening : t.tapAndPronounce}
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>

      {/* 6. Transcript Feedback */}
      {transcript && (
        <p className="mb-4 text-center text-xs font-black tracking-widest text-slate-400 uppercase">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      {/* 7. Manual Check Override (Fallback) */}
      <div className="mt-4 flex shrink-0 justify-center">
        <button
          onClick={onSuccess}
          className="rounded-full border-2 border-slate-200 bg-transparent px-6 py-3 text-xs md:text-sm font-black tracking-widest text-slate-400 uppercase transition-colors hover:bg-slate-50 hover:text-slate-600"
          aria-label={t.skipPronunciation}
        >
          {t.done || 'Done'}
        </button>
      </div>
    </div>
  );
}

export default PhonemeExercise;
