import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';
import { getTTSException } from '../../hooks/useGlobalTTS';

/**
 * SyllableExercise Component
 * Focuses on segmenting words into syllables by "cutting" between characters.
 * Refactored to use centralized voice and text helpers.
 */
function SyllableExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  language = 'en',
  t,
  speak,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  zenMode = false,
  voiceAssistant = false,
}) {
  const [cuts, setCuts] = useState([]);
  const [isResolved, setIsResolved] = useState(false);

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

  // Map character index to syllable index for highlighting animations
  const charToSyl = useMemo(() => {
    if (!data.segments || !data.word) return [];
    const mapping = [];
    let currentSyl = 0;
    let charsInSyl = data.segments[0]?.length || 0;
    for (let i = 0; i < data.word.length; i++) {
      mapping.push(currentSyl);
      charsInSyl--;
      if (charsInSyl <= 0 && currentSyl < data.segments.length - 1) {
        currentSyl++;
        charsInSyl = data.segments[currentSyl]?.length || 0;
      }
    }
    return mapping;
  }, [data.segments, data.word]);

  /**
   * Logic to toggle a cut at a specific index.
   * Sorts cuts to ensure comparison logic works correctly.
   */
  const toggleCut = (index) => {
    if (isResolved) return;
    setCuts((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index].sort((a, b) => a - b),
    );
  };

  /**
   * Verification logic.
   * Dynamically calculates correct cut positions based on word segment lengths.
   */
  const checkAnswer = () => {
    if (!data.segments) return;
    const correctCuts = [];
    let pos = 0;
    for (let i = 0; i < data.segments.length - 1; i++) {
      pos += data.segments[i].length;
      correctCuts.push(pos);
    }

    if (JSON.stringify(cuts) === JSON.stringify(correctCuts)) {
      setIsResolved(true);
      playSyllables();
      setTimeout(onSuccess, extendedTime ? 2500 : 1500);
    } else {
      onError();
      setCuts([]); // Reset on failure
      // Wait for the error feedback to finish, then present the correct segmentation
      setSafeTimeout(() => {
        playSyllables();
      }, extendedTime ? 3500 : 2500);
    }
  };

  /**
   * Auditory feedback logic.
   * Plays segments one by one with a delay.
   */
  const playSyllables = () => {
    if (!data.segments) {
      speak(data.word, extendedTime);
      return;
    }
    window.speechSynthesis.cancel();
    clearAudioTimeouts();

    let delayAcc = 0;
    data.segments.forEach((syl, i) => {
      const stepDuration = syl.length * (extendedTime ? 90 : 65) + 600;
      setSafeTimeout(() => {
        setActiveHighlight(i);
        speak(syl.toLowerCase());
      }, delayAcc);
      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === i ? null : prev));
      }, delayAcc + stepDuration - 100);
      delayAcc += stepDuration;
    });
  };

  // Voice recognition callbacks
  const handleVoiceMatch = (num) => {
    // Allows user to say "1", "2", etc., to toggle cuts between letters
    if (num >= 1 && num < data.word.length) {
      toggleCut(num);
    } else {
      onError();
    }
  };

  const handleCommandMatch = (cmd) => {
    if (cmd === 'undo') setCuts([]);
    if (cmd === 'check') checkAnswer();
  };

  const wordChars = data.word.split('');

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const bounceClass = noFlash ? '' : 'animate-bounce';
  const charSize = bigTargets ? 'text-7xl' : 'text-6xl';
  const btnPadding = bigTargets ? 'py-6' : 'py-5';
  const cutHitbox = bigTargets ? 'w-14 h-20' : 'w-10 h-16';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const controlBtnSize = bigTargets
    ? 'w-20 h-20 text-3xl'
    : 'w-16 h-16 text-2xl';

  return (
    <div className={`${animClass} flex w-full flex-col items-center`}>
      {/* 1. Voice & Audio Controls */}
      {voiceAssistant && (
        <div className="mb-4 flex gap-6">
          <div className={isResolved ? 'pointer-events-none opacity-50 grayscale' : ''}>
            <TTSController
              onReadAloud={playSyllables}
              pauseAllTimeouts={pauseAllTimeouts}
              resumeAllTimeouts={resumeAllTimeouts}
              t={t}
              controlBtnSize={controlBtnSize}
            />
          </div>

          <button
            onClick={() => startListening(handleVoiceMatch, handleCommandMatch)}
            disabled={isResolved}
            className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
              isResolved
                ? 'cursor-not-allowed bg-slate-300 opacity-50 grayscale'
                : isListening
                  ? pulseClass + ' text-white'
                  : `${themeStyles.button} text-white hover:brightness-110`
            }`}
            aria-label={isListening ? t.listening : t.speakGapNumber}
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

      {/* 2. Decorative Icon (Hidden in Zen Mode) */}
      {!zenMode && (
        <div className="mb-6 text-6xl" aria-hidden="true">
          {data.icon || '✂️'}
        </div>
      )}

      {/* 2.5 Phonetic Hint Bubble (Synchronized with TTS readout) */}
      <div className="h-8 mb-4 flex items-center justify-center w-full">
        {activeHighlight !== null && (
          (() => {
            const syl = data.segments[activeHighlight];
            const phonetic = getTTSException(syl, language);
            if (phonetic && phonetic.toLowerCase() !== syl.toLowerCase()) {
              return (
                <span className="animate-in fade-in slide-in-from-bottom-2 px-5 py-1.5 rounded-full text-xs font-black tracking-widest shadow-md bg-slate-800 text-white uppercase">
                  / {phonetic} /
                </span>
              );
            }
            return null;
          })()
        )}
      </div>

      {/* 3. Word Segmentation Interface */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-y-6">
        {wordChars.map((char, index) => (
          <React.Fragment key={index}>
            <span
              className={`${charSize} font-black tracking-tighter transition-all duration-200 inline-block ${
                activeHighlight === charToSyl[index]
                  ? 'text-yellow-500 scale-110 drop-shadow-md z-10'
                  : themeStyles.accent
              }`}
            >
              {char}
            </span>

            {index < wordChars.length - 1 && (
              <button
                onClick={() => toggleCut(index + 1)}
                className={`group relative ${cutHitbox} mx-1 flex items-center justify-center transition-all`}
                disabled={isResolved || isListening}
                aria-label={
                  cuts.includes(index + 1)
                    ? t.removeCut(index + 1)
                    : t.addCut(index + 1)
                }
                aria-pressed={cuts.includes(index + 1)}
              >
                <div
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    cuts.includes(index + 1)
                      ? `h-14 ${themeStyles.button} shadow-lg`
                      : `h-4 bg-slate-100 ${isListening ? '' : 'group-hover:h-10 group-hover:bg-slate-200'}`
                  }`}
                />

                {cuts.includes(index + 1) && !isResolved && (
                  <span
                    className={`absolute -top-8 text-2xl ${bounceClass}`}
                    aria-hidden="true"
                  >
                    ✂️
                  </span>
                )}

                {/* Visible numeric indicator for Voice Control */}
                {!isResolved && (
                  <span className="absolute -bottom-6 text-[10px] font-black text-slate-300">
                    {index + 1}
                  </span>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 4. Action Buttons */}
      <div className="mt-4 w-full max-w-xs space-y-3 px-4">
        <button
          onClick={checkAnswer}
          disabled={isResolved || cuts.length === 0 || isListening}
          className={`w-full ${btnPadding} rounded-3xl font-black tracking-widest uppercase shadow-xl transition-all ${
            cuts.length > 0 && !isResolved && !isListening
              ? `${themeStyles.button} text-white active:scale-95`
              : 'cursor-not-allowed bg-slate-100 text-slate-300'
          }`}
        >
          <BionicText text={t.check || 'Check'} enabled={bionicReading} />
        </button>

        <button
          onClick={() => setCuts([])}
          disabled={isResolved || cuts.length === 0 || isListening}
          className={`w-full py-2 text-[10px] font-black tracking-widest uppercase transition-colors ${
            cuts.length > 0 && !isListening
              ? 'text-slate-400 hover:text-red-400'
              : 'text-transparent'
          }`}
        >
          <BionicText text={t.delete || 'Delete'} enabled={bionicReading} />
        </button>
      </div>
    </div>
  );
}

export default SyllableExercise;
