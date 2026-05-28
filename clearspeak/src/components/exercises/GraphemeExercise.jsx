import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { getSmartSpellingHint } from '../../utils/spellingHints';
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
  voiceAssistant = false,
}) {
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
      window.speechSynthesis?.cancel();
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
  const questionText =
    data.questions?.[language] ||
    data.questions?.en ||
    t.chooseCorrectSpelling ||
    'Choose the correct spelling:';

  // Handle voice commands for option selection (1, 2, 3...)
  const handleVoiceMatch = (num) => {
    clearAudioTimeouts();
    const selectedIndex = num - 1;
    if (selectedIndex >= 0 && selectedIndex < shuffledOptions.length) {
      shuffledOptions[selectedIndex].isCorrect ? onSuccess() : onError();
    } else {
      onError();
    }
  };

  const readQuestionAndOptions = () => {
    clearAudioTimeouts();

    // pulling localized prefix from a simple map or dictionary

    // Remove underscores and format time correctly for the TTS assistant
    const sanitizedQuestion = formatTimeForTTS(questionText.replace(/_+/g, ''), language);
    speak(sanitizedQuestion, extendedTime);

    const charCount = (sanitizedQuestion || '').length;
    let delayAcc = charCount * (extendedTime ? 90 : 65) + 1500;

    const allOptionTexts = shuffledOptions.map((o) => o.text);
    shuffledOptions.forEach((opt, index) => {
      // Use the shared utility to get a pedagogical hint (e.g., "with double S")
      const hint = getSmartSpellingHint(opt.text, allOptionTexts, language, t);
      const prefix = t.optionPrefix ? t.optionPrefix(index + 1) : `Option ${index + 1}: `;

      // Remove colon from the prefix to prevent TTS from prematurely stopping the sentence
      const spokenPrefix = prefix.replace(':', '.');
      const spokenHint = formatTimeForTTS(hint, language);
      const fullSpokenText = `${spokenPrefix} ${spokenHint}`;

      // Calculate step duration based on the spoken string length
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
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const btnPadding = bigTargets ? 'py-6 px-4 sm:py-10 sm:px-6' : 'py-5 px-3 sm:py-8 sm:px-4';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl'
    : 'w-12 h-12 sm:w-16 sm:h-16 text-2xl sm:text-3xl';

  return (
    <div className={`${animClass} flex h-full w-full flex-col items-center justify-center`}>
      {/* 1. Voice & Audio Controls */}
      {voiceAssistant && (
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
      )}

      {transcript && (
        <p className="mb-4 text-center text-xs font-black tracking-widest text-slate-400 uppercase">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      {!zenMode && (
        <h3 className="mb-6 sm:mb-10 max-w-sm px-4 sm:px-6 text-center text-[10px] sm:text-[11px] leading-relaxed font-black tracking-[0.15em] text-slate-500 uppercase">
          <BionicText text={questionText} enabled={bionicReading} />
        </h3>
      )}

      <div className="flex w-full max-w-sm flex-wrap justify-center gap-4 px-2">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              opt.isCorrect ? onSuccess() : onError();
            }}
            disabled={isListening}
            className={`relative min-w-32 flex-1 ${btnPadding} flex flex-col items-center justify-center gap-3 rounded-4xl border-b-8 shadow-lg md:shadow-sm transition-all active:translate-y-2 active:border-b-0 ${
              isListening 
                ? 'opacity-50 grayscale text-white' 
                : activeHighlight === i
                  ? 'scale-105 ring-4 ring-yellow-400 bg-yellow-50 shadow-xl z-10 border-yellow-400 text-slate-900'
                  : `${themeStyles.button} hover:brightness-105 text-white`
            }`}
          >
            <span
              className="absolute top-3 left-4 sm:top-4 sm:left-5 text-xs sm:text-sm font-black text-white/50"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            {opt.icon && (
              <span className="text-3xl sm:text-4xl" aria-hidden="true">
                {opt.icon}
              </span>
            )}
            <span className="w-full text-center text-lg sm:text-xl font-bold wrap-break-word">
              <BionicText text={opt.text} enabled={bionicReading} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GraphemeExercise;
