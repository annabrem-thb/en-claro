import React, { useState, useCallback, useEffect } from 'react';
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { seededShuffle } from '../../utils/shuffleUtils.js';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * Refactored to eliminate impurity errors and cascading renders.
 */
function SequenceExercise({
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
    const seedString = id || (Array.isArray(correctData)
        ? correctData.join('')
        : String(correctData));

    const words = seededShuffle(combined, seedString);

    return {
      available: words.map((w, i) => ({ id: `word-${i}`, text: w })),
      selected: [],
    };
  };

  const [taskWords, setTaskWords] = useState(() =>
    prepareWords(data.correct, data.id, data.scrambled),
  );

  // Check for task ID changes during render. 
  // prepareWords is pure (uses seededShuffle), so this follows React's best practices.
  const currentId = data.id || data.correct;
  if (currentId !== prevId) {
    setTaskWords(prepareWords(data.correct, currentId, data.scrambled));
    setPrevId(currentId);
  }

  const { available: availableWords, selected: selectedWords } = taskWords;

  const [activeHighlight, setActiveHighlight] = useState(null);
  const [isShowingCorrection, setIsShowingCorrection] = useState(false);
  const { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
      setActiveHighlight(null);
      setIsShowingCorrection(false);
    };
  }, [clearAllTimeouts]);

  const { isListening, transcript, startListening } = useExerciseVoice(
    language,
    t,
  );

  const handleSelect = useCallback((wordObj) => {
    if (isShowingCorrection) return;
    clearAllTimeouts();
    setTaskWords((prev) => ({
      selected: [...prev.selected, wordObj],
      available: prev.available.filter((w) => w.id !== wordObj.id),
    }));
  }, [clearAllTimeouts, isShowingCorrection]);

  const handleDeselect = useCallback((wordObj) => {
    if (isShowingCorrection) return;
    clearAllTimeouts();
    setTaskWords((prev) => ({
      available: [...prev.available, wordObj],
      selected: prev.selected.filter((w) => w.id !== wordObj.id),
    }));
  }, [clearAllTimeouts, isShowingCorrection]);

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

      // Present the correct answer temporarily
      setTaskWords({
        available: [],
        selected: wordsArray.map((w, i) => ({ id: `correct-${i}`, text: w })),
      });

      // Wait for the error feedback, then read the correct sequence
      setSafeTimeout(() => {
        speak(correctSentence, extendedTime);

        setSafeTimeout(() => {
          const combined = [...wordsArray, ...(data.distractors || [])];
          const shuffled = combined.sort(() => Math.random() - 0.5);
          setTaskWords({
            available: shuffled.map((w, i) => ({ id: `word-${i}`, text: w })),
            selected: [],
          });
          setIsShowingCorrection(false);
        }, correctSentence.length * (extendedTime ? 100 : 75) + 2000);
      }, extendedTime ? 3500 : 2500);
    }
  }, [selectedWords, data.correct, data.distractors, onSuccess, onError, clearAllTimeouts, setSafeTimeout, speak, extendedTime, isShowingCorrection]);

  const targetLength = Array.isArray(data.correct)
    ? data.correct.length
    : typeof data.correct === 'string'
      ? data.correct.split(' ').length
      : 0;

  const showCheckButton = availableWords.length === 0 || (data.distractors && selectedWords.length === targetLength);

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

    const instruction = data.instruction || t.orderCorrectly || '';
    speak(instruction, extendedTime);

    let delayAcc = instruction.length * (extendedTime ? 100 : 75) + 1500;

    availableWords.forEach((wordObj, index) => {
      const optionPrefix = t.wordPrefix ? t.wordPrefix(index + 1) : `Word ${index + 1}: `;

      // Remove colon from the prefix to prevent the TTS engine from cutting the sentence short
      const spokenPrefix = optionPrefix.replace(':', '.');
      const fullSpokenText = `${spokenPrefix} ${wordObj.text}`;

      // Calculate the pause duration based on the SPOKEN text length
      const stepDuration = fullSpokenText.length * (extendedTime ? 100 : 75) + 1500;

      setSafeTimeout(() => {
        setActiveHighlight(wordObj.id);
        speak(fullSpokenText);
      }, delayAcc);

      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === wordObj.id ? null : prev));
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
  const btnPadding = bigTargets ? 'py-3 px-4 sm:py-4 sm:px-6 text-lg sm:text-xl' : 'py-2 px-3 sm:py-3 sm:px-5 text-base sm:text-lg';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
    : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';

  return (
    <div className={`${animClass} flex h-full min-h-0 w-full max-w-2xl flex-col items-center justify-start px-2 pt-6 sm:pt-10 pb-2 overflow-hidden`}>
      {!zenMode && (
        <h3 className="mb-2 sm:mb-4 text-center text-[10px] sm:text-xs md:text-sm font-black tracking-widest text-slate-400 uppercase break-words shrink-0">
          <BionicText
            text={data.instruction || t.orderCorrectly}
            enabled={bionicReading}
          />
        </h3>
      )}

      {voiceAssistant && (
        <div className="mb-2 sm:mb-4 flex gap-4 sm:gap-6 shrink-0">
          <TTSController
            onReadAloud={readAvailableWords}
            pauseAllTimeouts={() => {
              if (!isShowingCorrection) pauseAllTimeouts();
            }}
            resumeAllTimeouts={() => {
              if (!isShowingCorrection) resumeAllTimeouts();
            }}
            t={t}
            controlBtnSize={controlBtnSize}
          />

          <button
            onClick={() => startListening(handleVoiceMatch, handleCommandMatch)}
            disabled={isShowingCorrection}
            className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale ${
              isListening
                ? pulseClass + ' text-white'
                : `${themeStyles.button} text-white hover:brightness-110`
            }`}
            aria-label={isListening ? t.listening : t.voiceInput}
          >
            {isListening ? '🛑' : '🎤'}
          </button>
        </div>
      )}

      {transcript && (
        <p className="mb-1 sm:mb-2 text-center text-[10px] sm:text-xs font-black tracking-widest text-slate-400 uppercase shrink-0">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      <div className="mb-2 sm:mb-4 flex min-h-[60px] sm:min-h-[100px] w-full max-h-[35vh] flex-wrap content-start gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl border-4 border-dashed border-slate-200 bg-slate-50 p-2.5 sm:p-4 shrink min-h-0 overflow-y-auto no-scrollbar">
        {selectedWords.length === 0 && (
          <div className="flex h-full w-full items-center justify-center px-2 sm:px-4 text-center text-xs sm:text-sm font-black tracking-widest text-slate-300 uppercase">
            <BionicText
              text={t.tapToBuild || 'Tap words to build'}
              enabled={bionicReading}
            />
          </div>
        )}
        {selectedWords.map((wordObj) => (
          <button
            key={wordObj.id}
            onClick={() => handleDeselect(wordObj)}
            disabled={isListening || isShowingCorrection}
            className={`${btnPadding} rounded-2xl font-black text-white shadow-md md:shadow-sm transition-all active:scale-95 ${
              isListening ? 'opacity-50 grayscale' : ''
            } ${
              isShowingCorrection ? 'bg-yellow-400 text-slate-900 shadow-xl scale-105 pointer-events-none' : themeStyles.button
            }`}
          >
            <BionicText text={wordObj.text} enabled={bionicReading} />
          </button>
        ))}
      </div>

      <div className="mb-2 sm:mb-4 flex w-full max-h-[40vh] flex-wrap justify-center gap-2 sm:gap-3 shrink min-h-0 overflow-y-auto no-scrollbar pt-2 pb-2 px-2">
        {availableWords.map((wordObj, i) => (
          <button
            key={wordObj.id}
            onClick={() => handleSelect(wordObj)}
            disabled={isListening || isShowingCorrection}
            className={`relative ${btnPadding} rounded-2xl border-2 font-black shadow-sm md:shadow-none transition-all active:scale-95 ${
              (isListening || isShowingCorrection)
                ? 'opacity-50 grayscale border-slate-200 bg-white text-slate-600' 
                : activeHighlight === wordObj.id
                  ? 'scale-105 ring-4 ring-yellow-400 bg-yellow-50 border-yellow-400 text-slate-900 shadow-xl z-10'
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
          className={`px-8 py-3 sm:px-12 sm:py-4 ${themeStyles.button} rounded-full text-lg sm:text-xl font-black text-white shadow-xl transition-all active:scale-95 mt-auto sm:mt-0 shrink-0 ${noFlash ? '' : 'animate-bounce'} ${(isListening || isShowingCorrection) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
        >
          <BionicText text={t.check || 'Check'} enabled={bionicReading} />
        </button>
      )}
    </div>
  );
}

export default React.memo(SequenceExercise);
