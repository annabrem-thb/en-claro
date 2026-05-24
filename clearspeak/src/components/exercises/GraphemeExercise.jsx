// GraphemeExercise.jsx — a11y-aware with Shared Logic for Voice & Bionic Reading
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Importing shared components and hooks to prevent code duplication
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { getSmartSpellingHint } from '../../utils/spellingHints';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * GraphemeExercise Component
 * Refactored to inherit logic from shared utilities.
 * Focuses on choosing the correct spelling between two or more options.
 */
function GraphemeExercise({
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

  // Shuffle options predictably based on the task ID
  const shuffledOptions = useMemo(() => {
    if (!data.options) return [];
    const seed = data.id || 0;
    return [...data.options].sort(
      (a, b) =>
        (a.text?.charCodeAt(0) || 0) +
        seed -
        ((b.text?.charCodeAt(0) || 0) + seed),
    );
  }, [data]);

  // The main instruction/question text
  const fallbackQuestion = {
    pl: "Wybierz poprawną pisownię:",
    de: "Wähle die richtige Schreibweise:",
    en: "Choose the correct spelling:"
  };
  const questionText =
    data.questions?.[language] ||
    data.questions?.en ||
    t.chooseCorrectSpelling ||
    (fallbackQuestion[language] || fallbackQuestion.en);

  // Handle voice commands for option selection (1, 2, 3...)
  const handleVoiceMatch = (num) => {
    clearAudioTimeouts();
    window.speechSynthesis.cancel();
    const selectedIndex = num - 1;
    if (selectedIndex >= 0 && selectedIndex < shuffledOptions.length) {
      shuffledOptions[selectedIndex].isCorrect ? onSuccess() : onError();
    } else {
      onError();
    }
  };

  // --- Read Question & Options Aloud Logic ---
  const readQuestionAndOptions = () => {
    window.speechSynthesis.cancel();
    clearAudioTimeouts();

    // pulling localized prefix from a simple map or dictionary
    const getOptionPrefix = (idx) => {
      const prefixes = {
        pl: `Opcja ${idx}: `,
        en: `Option ${idx}: `,
        de: `Option ${idx}: `
      };
      return t.optionPrefix ? t.optionPrefix(idx) : (prefixes[language] || prefixes['en']);
    };

    const sanitizedQuestion = questionText.replace(/_+/g, '');
    speak(sanitizedQuestion, extendedTime);

    const charCount = (questionText || '').length;
    let delayAcc = charCount * (extendedTime ? 90 : 65) + 1500;

    const allOptionTexts = shuffledOptions.map((o) => o.text);
    shuffledOptions.forEach((opt, index) => {
      // Use the shared utility to get a pedagogical hint (e.g., "with double S")
      const hint = getSmartSpellingHint(opt.text, allOptionTexts, language, t);
      const prefix = getOptionPrefix(index + 1);

      const hintCharCount = hint.length + prefix.length;
      const stepDuration = hintCharCount * (extendedTime ? 90 : 65) + 800; // 800ms pause

      setSafeTimeout(() => {
        setActiveHighlight(index);
        speak(`${prefix} ${hint}`);
      }, delayAcc);

      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === index ? null : prev));
      }, delayAcc + stepDuration - 200);

      delayAcc += stepDuration;
    });
  };

  // Dynamic styling based on accessibility props
  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const btnPadding = bigTargets ? 'py-10 px-6' : 'py-8 px-4';
  const controlBtnSize = bigTargets
    ? 'w-20 h-20 text-4xl'
    : 'w-16 h-16 text-3xl';

  return (
    <div className={`${animClass} flex w-full flex-col items-center`}>
      {/* 1. Voice & Audio Controls */}
      <div className="mb-8 flex gap-6">
        <TTSController
          onReadAloud={readQuestionAndOptions}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          t={t}
          controlBtnSize={controlBtnSize}
        />

        <button
          onClick={() => startListening(handleVoiceMatch)}
          className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
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

      {/* 2. Audio Transcript feedback */}
      {transcript && (
        <p className="mb-4 text-center text-xs font-black tracking-widest text-slate-400 uppercase">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      {/* 3. Question Text (Partially hidden in Zen Mode) */}
      {!zenMode && (
        <h3 className="mb-10 max-w-xs px-6 text-center text-[11px] leading-relaxed font-black tracking-[0.15em] text-slate-500 uppercase">
          <BionicText text={questionText} enabled={bionicReading} />
        </h3>
      )}

      {/* 4. Spelling Options Grid */}
      <div className="flex w-full max-w-sm flex-wrap justify-center gap-4 px-2">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              window.speechSynthesis.cancel();
              opt.isCorrect ? onSuccess() : onError();
            }}
            disabled={isListening}
            className={`relative min-w-32 flex-1 ${btnPadding} flex flex-col items-center justify-center gap-3 rounded-4xl border-b-8 shadow-lg transition-all active:translate-y-2 active:border-b-0 ${
              isListening 
                ? 'opacity-50 grayscale text-white' 
                : activeHighlight === i
                  ? 'scale-105 ring-4 ring-yellow-400 bg-yellow-50 shadow-xl z-10 border-yellow-400 text-slate-900'
                  : `${themeStyles.button} hover:brightness-105 text-white`
            }`}
          >
            {/* Display the option number clearly for voice-assisted users */}
            <span
              className="absolute top-4 left-5 text-sm font-black text-white/50"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            {opt.icon && (
              <span className="text-4xl" aria-hidden="true">
                {opt.icon}
              </span>
            )}
            <span className="w-full text-center text-xl font-bold wrap-break-word">
              <BionicText text={opt.text} enabled={bionicReading} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GraphemeExercise;
