// SequenceExercise.jsx — a11y-aware with Pure Render Logic and Voice Commands
import React, { useState, useCallback } from 'react';
// Importing shared utilities
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { seededShuffle } from '../../utils/shuffleUtils.js';

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
}) {
  // --- 1. State Management ---
  const [prevId, setPrevId] = useState(data.id || data.correct);

  // Initial state setup helper
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

  // --- 2. Pure State Adjustment ---
  // We check for ID changes during render. Because prepareWords is now PURE
  // (using seededShuffle), this is safe and follows React's best practices.
  const currentId = data.id || data.correct;
  if (currentId !== prevId) {
    setTaskWords(prepareWords(data.correct, currentId, data.scrambled));
    setPrevId(currentId);
  }

  const { available: availableWords, selected: selectedWords } = taskWords;

  // --- 3. Shared Hooks ---
  const { isListening, transcript, startListening } = useExerciseVoice(
    language,
    t,
  );

  // --- 4. Core Logic ---
  const handleSelect = useCallback((wordObj) => {
    setTaskWords((prev) => ({
      selected: [...prev.selected, wordObj],
      available: prev.available.filter((w) => w.id !== wordObj.id),
    }));
  }, []);

  const handleDeselect = useCallback((wordObj) => {
    setTaskWords((prev) => ({
      available: [...prev.available, wordObj],
      selected: prev.selected.filter((w) => w.id !== wordObj.id),
    }));
  }, []);

  const handleCheck = useCallback(() => {
    const correctSentence = Array.isArray(data.correct)
      ? data.correct.join(' ')
      : data.correct;
    const currentSentence = selectedWords.map((w) => w.text).join(' ');
    if (currentSentence === correctSentence) {
      onSuccess();
    } else {
      onError();
      // Manual reset on error - here Math.random is okay because it's inside an EVENT handler, not render.
      const wordsArray = Array.isArray(data.correct)
        ? [...data.correct]
        : typeof data.correct === 'string'
          ? data.correct.split(' ')
          : [];
      const combined = [...wordsArray, ...(data.distractors || [])];
      const shuffled = combined.sort(() => Math.random() - 0.5);
      setTaskWords({
        available: shuffled.map((w, i) => ({ id: `word-${i}`, text: w })),
        selected: [],
      });
    }
  }, [selectedWords, data.correct, onSuccess, onError]);

  // --- 5. Voice Callbacks ---
  const targetLength = Array.isArray(data.correct)
    ? data.correct.length
    : typeof data.correct === 'string'
      ? data.correct.split(' ').length
      : 0;

  const showCheckButton = availableWords.length === 0 || (data.distractors && selectedWords.length === targetLength);

  const handleVoiceMatch = (num) => {
    const wordObj = availableWords[num - 1];
    if (wordObj) handleSelect(wordObj);
    else onError();
  };

  const handleCommandMatch = (cmd) => {
    if (cmd === 'undo' && selectedWords.length > 0) {
      handleDeselect(selectedWords[selectedWords.length - 1]);
    } else if (cmd === 'check' && showCheckButton) {
      handleCheck();
    } else {
      onError();
    }
  };

  // --- 6. Read Aloud Logic ---
  const readAvailableWords = () => {
    const silentPause = ' ... , , , ... ';
    let spokenText = `${data.instruction || t.orderCorrectly}${silentPause}`;

    availableWords.forEach((wordObj, index) => {
      const optionPrefix =
        {
          pl: `Słowo ${index + 1}: `,
          en: `Word ${index + 1}: `,
          de: `Wort ${index + 1}: `,
        }[language] || `Word ${index + 1}: `;
      spokenText += `${optionPrefix} ${wordObj.text}. `;
    });

    speak(spokenText, extendedTime);
  };

  // Styling
  const animClass = noFlash
    ? ''
    : 'animate-in slide-in-from-bottom duration-500';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const btnPadding = bigTargets ? 'py-4 px-6 text-xl' : 'py-3 px-5 text-lg';
  const controlBtnSize = bigTargets
    ? 'w-20 h-20 text-3xl'
    : 'w-16 h-16 text-2xl';

  return (
    <div className={`${animClass} flex w-full max-w-2xl flex-col items-center`}>
      {!zenMode && (
        <h3 className="mb-6 text-center text-xs md:text-sm font-black tracking-widest text-slate-400 uppercase break-words">
          <BionicText
            text={data.instruction || t.orderCorrectly}
            enabled={bionicReading}
          />
        </h3>
      )}

      <div className="mb-8 flex gap-6">
        <button
          onClick={readAvailableWords}
          className={`${controlBtnSize} flex items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 shadow-sm transition-all hover:text-slate-600 active:scale-90`}
          aria-label={t.readAloud || 'Read words'}
        >
          🔊
        </button>

        <button
          onClick={() => startListening(handleVoiceMatch, handleCommandMatch)}
          className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
            isListening
              ? pulseClass + ' text-white'
              : `${themeStyles.button} text-white hover:brightness-110`
          }`}
          aria-label={isListening ? t.listening : t.voiceInput}
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>

      {transcript && (
        <p className="mb-4 text-center text-xs font-black tracking-widest text-slate-400 uppercase">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      <div className="mb-8 flex min-h-30 w-full flex-wrap content-start gap-3 rounded-3xl border-4 border-dashed border-slate-200 bg-slate-50 p-4">
        {selectedWords.length === 0 && (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm font-black tracking-widest text-slate-300 uppercase">
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
            disabled={isListening}
            className={`${btnPadding} ${themeStyles.button} rounded-2xl font-black text-white shadow-md transition-all active:scale-95 ${isListening ? 'opacity-50 grayscale' : ''}`}
          >
            <BionicText text={wordObj.text} enabled={bionicReading} />
          </button>
        ))}
      </div>

      <div className="mb-10 flex w-full flex-wrap justify-center gap-3">
        {availableWords.map((wordObj, i) => (
          <button
            key={wordObj.id}
            onClick={() => handleSelect(wordObj)}
            disabled={isListening}
            className={`relative ${btnPadding} rounded-2xl border-2 border-slate-200 bg-white font-black text-slate-600 shadow-sm transition-all hover:border-slate-300 active:scale-95 ${isListening ? 'opacity-50 grayscale' : ''}`}
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
          disabled={isListening}
          className={`px-12 py-4 ${themeStyles.button} rounded-full text-xl font-black text-white shadow-xl transition-all active:scale-95 ${noFlash ? '' : 'animate-bounce'} ${isListening ? 'opacity-50 grayscale' : ''}`}
        >
          <BionicText text={t.check || 'Check'} enabled={bionicReading} />
        </button>
      )}
    </div>
  );
}

export default SequenceExercise;
