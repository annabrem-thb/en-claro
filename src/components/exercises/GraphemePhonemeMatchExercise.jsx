import React, { useCallback, useMemo, useState } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import { playPhoneme } from '../../utils/phonemeAudio';
import BionicText from '../common/BionicText';
import TTSController from '../common/TTSController';

function GraphemePhonemeMatchExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  language,
  t,
  speak,
  ttsFallback,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  zenMode = false,
  voiceAssistant = false,
  isHighContrast = false,
}) {
  // Which modality is shown and which is played alternates by id, not by an
  // authored field — so the same item pool exercises the match in both
  // directions (hear a sound → pick its spelling; see a spelling → pick its
  // sound) across a session, without doubling the content to author.
  const direction =
    (data.id ?? 0) % 2 === 0 ? 'graphemeToPhoneme' : 'phonemeToGrapheme';

  const [activeHighlight, setActiveHighlight] = useState(null);
  // Only used in graphemeToPhoneme mode: a first tap on an audio option
  // previews its sound, a second tap on the same option submits it. Unlike
  // this app's usual single-tap-to-answer buttons, the option's content
  // *is* the sound itself — there's nothing to read before committing, so
  // committing on the first tap would make the exercise unplayable.
  const [previewIndex, setPreviewIndex] = useState(null);

  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

  const options = useMemo(() => {
    const seed = data.id || 0;
    const all = [data.grapheme, ...(data.distractors || [])];
    return [...all].sort(
      (a, b) => (a.charCodeAt(0) || 0) + seed - ((b.charCodeAt(0) || 0) + seed),
    );
  }, [data]);

  // phonemeToGrapheme: play the target sound, then read the written options
  // aloud in turn (narration parity with GraphemeExercise) — safe to speak
  // here since the options are the spelling choices, not the answer key.
  // graphemeToPhoneme: only the instruction is spoken. The grapheme itself
  // is shown on screen but deliberately never spoken — the audio options
  // *are* the answer key in this direction, so reading any of them here
  // would give the answer away before the learner taps anything.
  const readAloud = useCallback(() => {
    clearAllTimeouts();
    setActiveHighlight(null);

    const readOptionsSequentially = (index) => {
      if (index >= options.length) return;
      setActiveHighlight(index);
      const prefix = (
        t('optionPrefix', { number: index + 1 }) || `Option ${index + 1}:`
      ).replace(':', '.');
      speak(`${prefix} ${options[index]}`, extendedTime, () => {
        setSafeTimeout(() => {
          setActiveHighlight((prev) => (prev === index ? null : prev));
          readOptionsSequentially(index + 1);
        }, 300);
      });
    };

    if (direction === 'phonemeToGrapheme') {
      playPhoneme(data.grapheme, language, speak, extendedTime, () => {
        setSafeTimeout(() => readOptionsSequentially(0), 500);
      });
    } else {
      const prompt =
        t('graphemePhonemeChooseSoundPrompt') ||
        'Look at the letters, then choose the matching sound:';
      speak(prompt, extendedTime);
    }
  }, [
    direction,
    data.grapheme,
    options,
    language,
    speak,
    extendedTime,
    clearAllTimeouts,
    setSafeTimeout,
    t,
  ]);

  useAutoReadAloud(voiceAssistant, readAloud);

  const handleTextOptionTap = (option) => {
    clearAllTimeouts();
    option === data.grapheme ? onSuccess() : onError();
  };

  const handleAudioOptionTap = (index, option) => {
    if (previewIndex === index) {
      clearAllTimeouts();
      option === data.grapheme ? onSuccess() : onError();
      return;
    }
    setPreviewIndex(index);
    playPhoneme(option, language, speak, extendedTime);
  };

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const btnPadding = bigTargets
    ? 'py-5 px-4 sm:py-8 sm:px-6'
    : 'py-4 px-3 sm:py-6 sm:px-4';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl sm:text-3xl'
    : 'w-12 h-12 text-xl sm:text-2xl';

  const headerText =
    direction === 'phonemeToGrapheme'
      ? t('graphemePhonemeListenPrompt') ||
        'Listen to the sound, then choose the matching spelling:'
      : t('graphemePhonemeChooseSoundPrompt') ||
        'Look at the letters, then choose the matching sound:';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-start overflow-hidden px-2 pt-6 pb-2 sm:pt-10`}
    >
      <div className="mb-2 flex shrink-0 gap-4 sm:mb-4 sm:gap-6">
        <TTSController
          onReadAloud={readAloud}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          t={t}
          controlBtnSize={controlBtnSize}
          isHighContrast={isHighContrast}
          noFlash={noFlash}
          bionicReading={bionicReading}
          ttsFallback={ttsFallback}
        />
      </div>

      {!zenMode && (
        <h3
          className={`mx-auto mb-3 min-h-0 max-w-[65ch] shrink-0 px-4 text-center text-[10px] leading-relaxed font-black tracking-[0.15em] uppercase sm:mb-6 sm:text-[11px] ${isHighContrast ? 'text-white/50' : 'text-slate-500'}`}
        >
          <BionicText text={headerText} enabled={bionicReading} />
        </h3>
      )}

      {direction === 'graphemeToPhoneme' && (
        <p
          className={`mb-4 shrink-0 text-center text-5xl font-black tracking-wide sm:text-6xl ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
        >
          {data.grapheme}
        </p>
      )}

      <div className="no-scrollbar flex max-h-full min-h-0 w-full max-w-sm shrink flex-wrap justify-center gap-2 overflow-y-auto px-2 pt-2 pb-2 sm:gap-3">
        {options.map((option, i) =>
          direction === 'phonemeToGrapheme' ? (
            <button
              key={i}
              onClick={() => handleTextOptionTap(option)}
              className={`relative min-w-32 flex-1 ${btnPadding} flex flex-col items-center justify-center gap-3 rounded-4xl border-b-8 shadow-lg transition-all active:translate-y-2 active:border-b-0 md:shadow-sm ${
                activeHighlight === i
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : `${themeStyles.button} ${themeStyles.buttonText} hover:brightness-105`
              }`}
            >
              <span
                className={`absolute top-3 left-4 text-xs font-black sm:top-4 sm:left-5 sm:text-sm ${themeStyles.buttonText}`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="w-full text-center text-lg font-bold break-all sm:text-xl">
                <BionicText text={option} enabled={bionicReading} />
              </span>
            </button>
          ) : (
            <button
              key={i}
              onClick={() => handleAudioOptionTap(i, option)}
              className={`relative min-w-32 flex-1 ${btnPadding} flex flex-col items-center justify-center gap-2 rounded-4xl border-b-8 shadow-lg transition-all active:translate-y-2 active:border-b-0 md:shadow-sm ${
                previewIndex === i
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : `${themeStyles.button} ${themeStyles.buttonText} hover:brightness-105`
              }`}
            >
              <span
                className={`absolute top-3 left-4 text-xs font-black sm:top-4 sm:left-5 sm:text-sm ${previewIndex === i ? 'text-slate-900' : themeStyles.buttonText}`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-3xl sm:text-4xl" aria-hidden="true">
                🔊
              </span>
              <span className="text-center text-xs font-bold sm:text-sm">
                <BionicText
                  text={
                    t('optionPrefix', { number: i + 1 }) || `Option ${i + 1}`
                  }
                  enabled={bionicReading}
                />
              </span>
              {previewIndex === i && (
                <span className="text-center text-[10px] font-medium sm:text-xs">
                  <BionicText
                    text={
                      t('graphemePhonemeTapAgainToConfirm') ||
                      'Tap again to choose this one'
                    }
                    enabled={bionicReading}
                  />
                </span>
              )}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export default React.memo(GraphemePhonemeMatchExercise);
