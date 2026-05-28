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

function ContextExercise({
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

  // Shuffle options predictably based on the sentence seed
  const shuffledOptions = useMemo(() => {
    if (!data.options) return [];
    const hash = (str) =>
      Array.from(str).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
    const seed = hash(data.sentence_part1 || 'context');
    return [...data.options].sort(
      (a, b) => hash((a.text || '') + seed) - hash((b.text || '') + seed),
    );
  }, [data]);

  // Delayed feedback: reads the full sentence with the correct word
  const handleMistake = useCallback(() => {
    onError();
    setSafeTimeout(() => {
      clearAudioTimeouts();

      const correctOpt = shuffledOptions.find((o) => o.isCorrect);
      if (correctOpt) {
        const part1 = data.sentence_part1 || '';
        const part2 = data.sentence_part2 || '';
        const fullSentence = `${part1} ${correctOpt.text} ${part2}`
          .replace(/\s+([.,!?;:])/g, '$1') // Remove spaces before punctuation marks
          .replace(/\s+/g, ' ')            // Reduce multiple spaces to a single space
          .trim();
        // Format time for TTS within the context sentence
        speak(formatTimeForTTS(fullSentence, language), extendedTime);
      }
    }, extendedTime ? 3500 : 2500);
  }, [onError, setSafeTimeout, clearAudioTimeouts, shuffledOptions, data, speak, extendedTime, language]);

  const handleVoiceMatch = (num) => {
    clearAudioTimeouts();
    const selected = shuffledOptions[num - 1];
    if (selected) {
      selected.isCorrect ? onSuccess() : handleMistake();
    } else {
      handleMistake();
    }
  };

  const readContextAndOptions = () => {
    clearAudioTimeouts();

    let delayAcc = 0;
    
    const instruction = t.selectCorrect || 'Select the correct word:';
    setSafeTimeout(() => speak(instruction, extendedTime), delayAcc);
    delayAcc += instruction.length * (extendedTime ? 90 : 65) + 1000;

    if (data.sentence_part1) {
      setSafeTimeout(() => speak(formatTimeForTTS(data.sentence_part1, language), extendedTime), delayAcc);
      delayAcc += data.sentence_part1.length * (extendedTime ? 90 : 65) + 1000;
    }
    
    if (data.sentence_part2) {
      const cleanPart2 = data.sentence_part2.replace(/^[\.,!?;:]+$/, '');
      if (cleanPart2.trim()) {
         setSafeTimeout(() => speak(formatTimeForTTS(cleanPart2, language), extendedTime), delayAcc);
      }
      delayAcc += data.sentence_part2.length * (extendedTime ? 90 : 65) + 1500;
    }

    const allOptionTexts = shuffledOptions.map((o) => o.text);
    shuffledOptions.forEach((opt, index) => {
      const optionPrefix = t.optionPrefix ? t.optionPrefix(index + 1) : `Option ${index + 1}: `;

      const hint = getSmartSpellingHint(opt.text, allOptionTexts, language, t);

      // Remove colon from the prefix to prevent TTS from stopping prematurely
      const spokenPrefix = optionPrefix.replace(':', '.');
      const spokenHint = formatTimeForTTS(hint, language);
      const fullSpokenText = `${spokenPrefix} ${spokenHint}`;

      // Calculate step duration based on spoken text length (includes buffer for expanded numbers)
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

  const animClass = noFlash
    ? ''
    : 'animate-in slide-in-from-bottom duration-500';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const btnPadding = bigTargets ? 'py-5 sm:py-6' : 'py-4 sm:py-5';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl sm:text-3xl'
    : 'w-12 h-12 text-xl sm:text-2xl';

  return (
    <div className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-start overflow-hidden px-2 pt-6 sm:pt-10 pb-2`}>
      {!zenMode && (
        <h3 className="mb-2 sm:mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase shrink-0">
          {t.selectCorrect || 'Select the correct word'}
        </h3>
      )}

      <div className="mb-3 sm:mb-4 px-2 text-center text-base sm:text-xl md:text-2xl leading-relaxed font-bold text-slate-700 shrink min-h-0">
        <BionicText text={data.sentence_part1} enabled={bionicReading} />
        <span
          className={`mx-1 sm:mx-2 border-b-4 px-3 sm:px-4 ${themeStyles.border} rounded-lg bg-slate-50 text-slate-300`}
        >
          ____
        </span>
        <BionicText text={data.sentence_part2} enabled={bionicReading} />
      </div>

      {voiceAssistant && (
        <div className="mb-3 sm:mb-6 flex gap-4 sm:gap-6 shrink-0">
          <TTSController
            onReadAloud={readContextAndOptions}
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
            aria-label={t.voiceInput}
          >
            {isListening ? '🛑' : '🎤'}
          </button>
        </div>
      )}

      {transcript && (
        <p className="mb-2 sm:mb-3 text-center text-[10px] sm:text-xs font-black tracking-widest text-slate-400 uppercase shrink-0">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      <div className="grid w-full max-w-sm grid-cols-1 gap-2 sm:gap-3 px-2 pt-4 pb-4 shrink min-h-0 overflow-y-auto">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              opt.isCorrect ? onSuccess() : handleMistake();
            }}
            disabled={isListening}
            className={`relative ${btnPadding} rounded-2xl sm:rounded-3xl border-2 text-base sm:text-xl font-black shadow-sm md:shadow-none transition-all active:scale-95 ${
              isListening 
                ? 'opacity-50 grayscale' 
                : activeHighlight === i
                  ? 'scale-105 ring-4 ring-yellow-400 bg-yellow-50 shadow-xl z-10 border-yellow-400 text-slate-900'
                  : `${themeStyles.border} ${themeStyles.accent} bg-white hover:${themeStyles.bg}`
            }`}
          >
            <span
              className="absolute top-4 left-5 text-sm font-black text-slate-300"
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

export default React.memo(ContextExercise);
