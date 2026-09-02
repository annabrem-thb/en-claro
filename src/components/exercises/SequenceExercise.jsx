import React, { useState, useCallback, useEffect } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import { seededShuffle } from '../../utils/shuffleUtils.js';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';
import VoiceAnswerButton from '../common/VoiceAnswerButton';

function SequenceExercise({
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
  const [prevId, setPrevId] = useState(data.id || data.correct);

  const prepareWords = (correctData, id, scrambledData, distractors = []) => {
    let baseArray = [];
    if (scrambledData && Array.isArray(scrambledData)) {
      baseArray = [...scrambledData];
    } else {
      baseArray = Array.isArray(correctData)
        ? [...correctData]
        : typeof correctData === 'string'
          ? correctData.split(' ')
          : [];
    }

    const combined = [...baseArray, ...distractors];
    const seedString =
      id ||
      (Array.isArray(correctData) ? correctData.join('') : String(correctData));

    const words = seededShuffle(combined, seedString);

    return {
      available: words.map((w, i) => ({ id: `word-${i}`, text: w })),
      selected: [],
    };
  };

  const [taskWords, setTaskWords] = useState(() =>
    prepareWords(data.correct, data.id, data.scrambled),
  );

  const currentId = data.id || data.correct;
  if (currentId !== prevId) {
    setTaskWords(prepareWords(data.correct, currentId, data.scrambled));
    setPrevId(currentId);
  }

  const { available: availableWords, selected: selectedWords } = taskWords;

  const [activeHighlight, setActiveHighlight] = useState(null);
  const [isShowingCorrection, setIsShowingCorrection] = useState(false);
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
      setActiveHighlight(null);
      setIsShowingCorrection(false);
    };
  }, [clearAllTimeouts]);

  const {
    isListening,
    transcript,
    startListening,
    error,
    voiceStatus,
    modelDownloadProgress,
    confirmModelDownload,
    declineModelDownload,
  } = useExerciseVoice(language, t);

  const handleSelect = useCallback(
    (wordObj) => {
      if (isShowingCorrection) return;
      clearAllTimeouts();
      setTaskWords((prev) => ({
        selected: [...prev.selected, wordObj],
        available: prev.available.filter((w) => w.id !== wordObj.id),
      }));
    },
    [clearAllTimeouts, isShowingCorrection],
  );

  const handleDeselect = useCallback(
    (wordObj) => {
      if (isShowingCorrection) return;
      clearAllTimeouts();
      setTaskWords((prev) => ({
        available: [...prev.available, wordObj],
        selected: prev.selected.filter((w) => w.id !== wordObj.id),
      }));
    },
    [clearAllTimeouts, isShowingCorrection],
  );

  const handleCheck = useCallback(() => {
    if (isShowingCorrection) return;
    clearAllTimeouts();
    const correctSentence = Array.isArray(data.correct)
      ? data.correct.join(' ')
      : data.correct;
    const currentSentence = selectedWords.map((w) => w.text).join(' ');
    if (currentSentence === correctSentence) {
      onSuccess();
    } else {
      onError();
      setIsShowingCorrection(true);

      const wordsArray = Array.isArray(data.correct)
        ? [...data.correct]
        : typeof data.correct === 'string'
          ? data.correct.split(' ')
          : [];

      setTaskWords({
        available: [],
        selected: wordsArray.map((w, i) => ({ id: `correct-${i}`, text: w })),
      });

      setSafeTimeout(
        () => {
          speak(correctSentence, extendedTime);

          setSafeTimeout(
            () => {
              const combined = [...wordsArray, ...(data.distractors || [])];
              const shuffled = combined.sort(() => Math.random() - 0.5);
              setTaskWords({
                available: shuffled.map((w, i) => ({
                  id: `word-${i}`,
                  text: w,
                })),
                selected: [],
              });
              setIsShowingCorrection(false);
            },
            correctSentence.length * (extendedTime ? 100 : 75) + 2000,
          );
        },
        extendedTime ? 3500 : 2500,
      );
    }
  }, [
    selectedWords,
    data.correct,
    data.distractors,
    onSuccess,
    onError,
    clearAllTimeouts,
    setSafeTimeout,
    speak,
    extendedTime,
    isShowingCorrection,
  ]);

  const targetLength = Array.isArray(data.correct)
    ? data.correct.length
    : typeof data.correct === 'string'
      ? data.correct.split(' ').length
      : 0;

  const showCheckButton =
    availableWords.length === 0 ||
    (data.distractors && selectedWords.length === targetLength);

  const handleVoiceMatch = (num) => {
    if (isShowingCorrection) return;
    clearAllTimeouts();
    const wordObj = availableWords[num - 1];
    if (wordObj) handleSelect(wordObj);
    else onError();
  };

  const handleCommandMatch = (cmd) => {
    if (isShowingCorrection) return;
    clearAllTimeouts();
    if (cmd === 'undo' && selectedWords.length > 0) {
      handleDeselect(selectedWords[selectedWords.length - 1]);
    } else if (cmd === 'check' && showCheckButton) {
      handleCheck();
    } else {
      onError();
    }
  };

  const readAvailableWords = () => {
    clearAllTimeouts();

    const instruction = data.instruction || t('orderCorrectly') || '';
    speak(instruction, extendedTime);

    let delayAcc = instruction.length * (extendedTime ? 100 : 75) + 1500;

    availableWords.forEach((wordObj, index) => {
      const optionPrefix = t('wordPrefix', { number: index + 1 });

      const spokenPrefix = optionPrefix.replace(':', '.');
      const fullSpokenText = `${spokenPrefix} ${wordObj.text}`;

      const stepDuration =
        fullSpokenText.length * (extendedTime ? 100 : 75) + 1500;

      setSafeTimeout(() => {
        setActiveHighlight(wordObj.id);
        speak(fullSpokenText);
      }, delayAcc);

      setSafeTimeout(
        () => {
          setActiveHighlight((prev) => (prev === wordObj.id ? null : prev));
        },
        delayAcc + stepDuration - 200,
      );

      delayAcc += stepDuration;
    });
  };

  useAutoReadAloud(voiceAssistant, readAvailableWords);

  const animClass = noFlash
    ? ''
    : 'animate-in slide-in-from-bottom duration-500';
  const btnPadding = bigTargets
    ? 'py-3 px-4 sm:py-4 sm:px-6 text-lg sm:text-xl'
    : 'py-2 px-3 sm:py-3 sm:px-5 text-base sm:text-lg';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
    : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full max-w-2xl flex-col items-center justify-start overflow-hidden px-2 pt-6 pb-2 sm:pt-10`}
    >
      {!zenMode && (
        <h3
          className={`mx-auto mb-2 max-w-[65ch] shrink-0 text-center text-[10px] font-black tracking-widest wrap-break-word uppercase sm:mb-4 sm:text-xs md:text-sm ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          <BionicText
            text={data.instruction || t('orderCorrectly')}
            enabled={bionicReading}
          />
        </h3>
      )}

      <ExerciseControlsRow className="mb-2 flex shrink-0 gap-4 sm:mb-4 sm:gap-6">
        <TTSController
          onReadAloud={readAvailableWords}
          pauseAllTimeouts={() => {
            if (!isShowingCorrection) pauseAllTimeouts();
          }}
          resumeAllTimeouts={() => {
            if (!isShowingCorrection) resumeAllTimeouts();
          }}
          controlBtnSize={controlBtnSize}
          noFlash={noFlash}
          ttsFallback={ttsFallback}
        />

        <VoiceAnswerButton
          isListening={isListening}
          onStart={() => startListening(handleVoiceMatch, handleCommandMatch)}
          disabled={isShowingCorrection}
          error={error}
          t={t}
          themeStyles={themeStyles}
          noFlash={noFlash}
          bigTargets={bigTargets}
          isHighContrast={isHighContrast}
          bionicReading={bionicReading}
          voiceStatus={voiceStatus}
          modelDownloadProgress={modelDownloadProgress}
          confirmModelDownload={confirmModelDownload}
          declineModelDownload={declineModelDownload}
          controlBtnSize={controlBtnSize}
        />
      </ExerciseControlsRow>

      {/* Before this, the only clue that the mic expects a spoken *option
          number* was the button's aria-label — invisible to sighted users,
          who had no way to know what to say. */}
      {transcript ? (
        <p
          className={`mb-1 shrink-0 text-center text-[10px] font-black tracking-widest uppercase sm:mb-2 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('heard')}:{' '}
          <span className={isHighContrast ? 'text-white' : 'text-slate-600'}>
            {transcript}
          </span>
        </p>
      ) : (
        <p
          className={`mb-1 shrink-0 text-center text-[10px] font-medium sm:mb-2 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('speakOptionNumber')}
        </p>
      )}

      <div className="no-scrollbar mb-2 flex max-h-[35dvh] min-h-15 w-full shrink flex-wrap content-start gap-2 overflow-y-auto rounded-2xl border-4 border-dashed border-slate-200 bg-slate-50 p-2.5 sm:mb-4 sm:min-h-25 sm:gap-3 sm:rounded-3xl sm:p-4">
        {selectedWords.length === 0 && (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs font-black tracking-widest text-slate-600 uppercase sm:px-4 sm:text-sm">
            <BionicText
              text={t('tapToBuild') || 'Tap words to build'}
              enabled={bionicReading}
            />
          </div>
        )}
        {selectedWords.map((wordObj) => (
          <button
            key={wordObj.id}
            onClick={() => handleDeselect(wordObj)}
            disabled={isListening || isShowingCorrection}
            className={`${btnPadding} rounded-2xl font-black text-white shadow-md transition-all active:scale-95 md:shadow-sm ${
              isListening ? 'opacity-50 grayscale' : ''
            } ${
              isShowingCorrection
                ? 'pointer-events-none scale-105 bg-yellow-400 text-slate-900 shadow-xl'
                : themeStyles.button
            }`}
          >
            <BionicText text={wordObj.text} enabled={bionicReading} />
          </button>
        ))}
      </div>

      <div className="no-scrollbar mb-2 flex max-h-[40dvh] w-full shrink flex-wrap justify-center gap-2 overflow-y-auto px-2 pt-2 pb-2 sm:mb-4 sm:gap-3">
        {availableWords.map((wordObj, i) => (
          <button
            key={wordObj.id}
            onClick={() => handleSelect(wordObj)}
            disabled={isListening || isShowingCorrection}
            className={`relative ${btnPadding} rounded-2xl border-2 font-black shadow-sm transition-all active:scale-95 md:shadow-none ${
              isListening || isShowingCorrection
                ? 'border-slate-200 bg-white text-slate-600 opacity-50 grayscale'
                : activeHighlight === wordObj.id
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <span
              className="absolute -top-3 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs text-white shadow-sm"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <BionicText text={wordObj.text} enabled={bionicReading} />
          </button>
        ))}
      </div>

      {showCheckButton && (
        <button
          onClick={handleCheck}
          disabled={isListening || isShowingCorrection}
          className={`px-8 py-3 sm:px-12 sm:py-4 ${themeStyles.button} ${themeStyles.buttonText} mt-auto shrink-0 rounded-full text-lg font-black shadow-xl transition-all active:scale-95 sm:mt-0 sm:text-xl ${noFlash ? '' : 'animate-bounce'} ${isListening || isShowingCorrection ? 'cursor-not-allowed opacity-50 grayscale' : ''}`}
        >
          <BionicText text={t('check') || 'Check'} enabled={bionicReading} />
        </button>
      )}
    </div>
  );
}

export default React.memo(SequenceExercise);
