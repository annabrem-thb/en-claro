// ContextExercise.jsx — a11y-aware with Shared Logic for Voice & Bionic Reading
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { getSmartSpellingHint } from '../../utils/spellingHints';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

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
}) {
  // Use the shared voice hook
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

  // Shuffle options predictably based on the sentence content
  const shuffledOptions = useMemo(() => {
    if (!data.options) return [];
    const hash = (str) =>
      Array.from(str).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
    const seed = hash(data.sentence_part1 || 'context');
    return [...data.options].sort(
      (a, b) => hash((a.text || '') + seed) - hash((b.text || '') + seed),
    );
  }, [data]);

  // Opóźniona informacja zwrotna: czyta pełne zdanie z poprawnym słowem
  const handleMistake = useCallback(() => {
    onError();
    setSafeTimeout(() => {
      window.speechSynthesis.cancel();
      clearAudioTimeouts();

      const correctOpt = shuffledOptions.find((o) => o.isCorrect);
      if (correctOpt) {
        const part1 = data.sentence_part1 || '';
        const part2 = data.sentence_part2 || '';
        const fullSentence = `${part1} ${correctOpt.text} ${part2}`
          .replace(/\s+([.,!?;:])/g, '$1') // Usuwa spacje przed znakami interpunkcyjnymi
          .replace(/\s+/g, ' ')            // Redukuje podwójne spacje do pojedynczych
          .trim();
        speak(fullSentence, extendedTime);
      }
    }, extendedTime ? 3500 : 2500);
  }, [onError, setSafeTimeout, clearAudioTimeouts, shuffledOptions, data, speak, extendedTime]);

  // Handle voice number selection
  const handleVoiceMatch = (num) => {
    clearAudioTimeouts();
    window.speechSynthesis.cancel();
    const selected = shuffledOptions[num - 1];
    if (selected) {
      selected.isCorrect ? onSuccess() : handleMistake();
    } else {
      handleMistake();
    }
  };

  // --- Read Content Aloud ---
  const readContextAndOptions = () => {
    window.speechSynthesis.cancel();
    clearAudioTimeouts();

    let delayAcc = 0;
    
    const instruction = t.selectCorrect || (language === 'pl' ? 'Wybierz poprawne słowo:' : 'Select the correct word:');
    setSafeTimeout(() => speak(instruction, extendedTime), delayAcc);
    delayAcc += instruction.length * (extendedTime ? 90 : 65) + 1000;

    if (data.sentence_part1) {
      setSafeTimeout(() => speak(data.sentence_part1, extendedTime), delayAcc);
      delayAcc += data.sentence_part1.length * (extendedTime ? 90 : 65) + 1000;
    }
    
    if (data.sentence_part2) {
      const cleanPart2 = data.sentence_part2.replace(/^[\.,!?;:]+$/, '');
      if (cleanPart2.trim()) {
         setSafeTimeout(() => speak(cleanPart2, extendedTime), delayAcc);
      }
      delayAcc += data.sentence_part2.length * (extendedTime ? 90 : 65) + 1500;
    }

    const allOptionTexts = shuffledOptions.map((o) => o.text);
    shuffledOptions.forEach((opt, index) => {
      const prefixes = {
        pl: `Opcja ${index + 1}: `,
        en: `Option ${index + 1}: `,
        de: `Option ${index + 1}: `
      };
      const optionPrefix = t.optionPrefix ? t.optionPrefix(index + 1) : (prefixes[language] || prefixes['en']);

      const hint = getSmartSpellingHint(opt.text, allOptionTexts, language, t);

      const hintCharCount = hint.length + optionPrefix.length;
      const stepDuration = hintCharCount * (extendedTime ? 90 : 65) + 800; // 800ms pause between options

      setSafeTimeout(() => {
        setActiveHighlight(index);
        speak(`${optionPrefix} ${hint}`);
      }, delayAcc);

      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === index ? null : prev));
      }, delayAcc + stepDuration - 200);

      delayAcc += stepDuration;
    });
  };

  // Styling logic
  const animClass = noFlash
    ? ''
    : 'animate-in slide-in-from-bottom duration-500';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const btnPadding = bigTargets ? 'py-8' : 'py-6';
  const controlBtnSize = bigTargets
    ? 'w-20 h-20 text-3xl'
    : 'w-16 h-16 text-2xl';

  return (
    <div className={`${animClass} flex w-full flex-col items-center`}>
      {!zenMode && (
        <h3 className="mb-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          {t.selectCorrect || 'Select the correct word'}
        </h3>
      )}

      {/* Sentence with blank */}
      <div className="mb-6 px-2 text-center text-2xl leading-relaxed font-bold text-slate-700">
        <BionicText text={data.sentence_part1} enabled={bionicReading} />
        <span
          className={`mx-2 border-b-4 px-4 ${themeStyles.border} rounded-lg bg-slate-50 text-slate-300`}
        >
          ____
        </span>
        <BionicText text={data.sentence_part2} enabled={bionicReading} />
      </div>

      {/* Controls */}
      <div className="mb-8 flex gap-6">
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

      {transcript && (
        <p className="mb-4 text-center text-xs font-black tracking-widest text-slate-400 uppercase">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      {/* Options */}
      <div className="grid w-full max-w-sm grid-cols-1 gap-3 px-2">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              window.speechSynthesis.cancel();
              opt.isCorrect ? onSuccess() : handleMistake();
            }}
            disabled={isListening}
            className={`relative ${btnPadding} rounded-3xl border-2 text-xl font-black shadow-sm transition-all active:scale-95 ${
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

export default ContextExercise;
