import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import { getSmartSpellingHint } from '../../utils/spellingHints';
import BionicText from '../common/BionicText';
import TTSController from '../common/TTSController';

const formatTimeForTTS = (text, lang) => {
  if (!text) return '';
  return text
    .replace(/\b0?(\d+):(\d+)\b/g, (match, h, m) => {
      const min = parseInt(m, 10);
      if (lang === 'pl') {
        return min === 0 ? `godzina ${h}` : `godzina ${h} i ${min} minut`;
      }
      if (lang === 'de') {
        return min === 0 ? `${h} Uhr` : `${h} Uhr ${min}`;
      }
      return min === 0 ? `${h}` : `${h} ${min}`;
    })
    .replace(/\s*Uhr\s*Uhr/gi, ' Uhr');
};

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
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

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

  const questionText =
    data.question?.[language] ||
    data.question?.en ||
    t('chooseCorrectSpelling') ||
    'Choose the correct spelling:';

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

    const sanitizedQuestion = formatTimeForTTS(
      questionText.replace(/_+/g, ''),
      language,
    );
    speak(sanitizedQuestion, extendedTime);

    const charCount = (sanitizedQuestion || '').length;
    let delayAcc = charCount * (extendedTime ? 90 : 65) + 1500;

    const allOptionTexts = shuffledOptions.map((o) => o.text);
    shuffledOptions.forEach((opt, index) => {
      const hint = getSmartSpellingHint(opt.text, allOptionTexts, language, t);
      const prefix = t('optionPrefix', { number: index + 1 });

      const spokenPrefix = prefix.replace(':', '.');
      const spokenHint = formatTimeForTTS(hint, language);
      const fullSpokenText = `${spokenPrefix} ${spokenHint}`;

      const stepDuration =
        fullSpokenText.length * (extendedTime ? 100 : 75) + 1500;

      setSafeTimeout(() => {
        setActiveHighlight(index);
        speak(fullSpokenText);
      }, delayAcc);

      setSafeTimeout(
        () => {
          setActiveHighlight((prev) => (prev === index ? null : prev));
        },
        delayAcc + stepDuration - 200,
      );

      delayAcc += stepDuration;
    });
  };

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const btnPadding = bigTargets
    ? 'py-5 px-4 sm:py-8 sm:px-6'
    : 'py-4 px-3 sm:py-6 sm:px-4';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl sm:text-3xl'
    : 'w-12 h-12 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-start overflow-hidden px-2 pt-6 pb-2 sm:pt-10`}
    >
      {}
      {voiceAssistant && (
        <div className="mb-2 flex shrink-0 gap-4 sm:mb-4 sm:gap-6">
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
            aria-label={isListening ? t('listening') : t('speakOptionNumber')}
            aria-pressed={isListening}
          >
            {isListening ? '🛑' : '🎤'}
          </button>
        </div>
      )}

      {transcript && (
        <p className="mb-2 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-600 uppercase sm:mb-3 sm:text-xs">
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      {!zenMode && (
        <h3 className="mx-auto mb-3 min-h-0 max-w-[65ch] shrink-0 px-4 text-center text-[10px] leading-relaxed font-black tracking-[0.15em] text-slate-500 uppercase sm:mb-6 sm:text-[11px]">
          <BionicText text={questionText} enabled={bionicReading} />
        </h3>
      )}

      <div className="no-scrollbar flex max-h-full min-h-0 w-full max-w-sm shrink flex-wrap justify-center gap-2 overflow-y-auto px-2 pt-2 pb-2 sm:gap-3">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              opt.isCorrect ? onSuccess() : onError();
            }}
            disabled={isListening}
            className={`relative min-w-32 flex-1 ${btnPadding} flex flex-col items-center justify-center gap-3 rounded-4xl border-b-8 shadow-lg transition-all active:translate-y-2 active:border-b-0 md:shadow-sm ${
              isListening
                ? 'text-white opacity-50 grayscale'
                : activeHighlight === i
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : `${themeStyles.button} text-white hover:brightness-105`
            }`}
          >
            <span
              className="absolute top-3 left-4 text-xs font-black text-white/50 sm:top-4 sm:left-5 sm:text-sm"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            {opt.icon && (
              <span className="text-3xl sm:text-4xl" aria-hidden="true">
                {opt.icon}
              </span>
            )}
            <span className="w-full text-center text-lg font-bold wrap-break-word sm:text-xl">
              <BionicText text={opt.text} enabled={bionicReading} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(GraphemeExercise);
