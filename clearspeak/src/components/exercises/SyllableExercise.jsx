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
      window.speechSynthesis?.cancel();
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
      setSafeTimeout(onSuccess, extendedTime ? 2500 : 1500);
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

  // Responsive dynamic sizing to integrate long words (e.g., German compound words)
  const wordLen = data.word?.length || 0;
  const isLong = wordLen > 12;
  const isVeryLong = wordLen > 18;

  const charSize = bigTargets 
    ? (isLong ? 'text-3xl sm:text-5xl' : 'text-5xl sm:text-7xl') 
    : (isVeryLong ? 'text-xl sm:text-3xl' : isLong ? 'text-2xl sm:text-4xl' : 'text-4xl sm:text-6xl');
  const btnPadding = bigTargets ? 'py-5 sm:py-6' : 'py-4 sm:py-5';
  const cutHitbox = bigTargets 
    ? (isLong ? 'w-8 h-12 sm:w-10 sm:h-14 mx-0.5' : 'w-10 h-16 sm:w-14 sm:h-20 mx-1') 
    : (isVeryLong ? 'w-4 h-8 sm:w-6 sm:h-10 mx-px' : isLong ? 'w-6 h-10 sm:w-8 sm:h-12 mx-0.5' : 'w-8 h-12 sm:w-10 sm:h-16 mx-1');
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-8 ring-red-100';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
    : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';

  return (
    <div className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2`}>
      {/* 1. Voice & Audio Controls */}
      {voiceAssistant && (
        <div className="mb-2 sm:mb-4 flex gap-4 sm:gap-6 shrink-0">
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
                  : `${themeStyles.button} ${themeStyles.buttonText} hover:brightness-110`
            }`}
            aria-label={isListening ? t.listening : t.speakGapNumber}
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

      {/* 2. Decorative Icon (Hidden in Zen Mode) */}
      {!zenMode && (
        <div className="mb-2 sm:mb-4 text-4xl sm:text-6xl shrink-0" aria-hidden="true">
          {data.icon || '✂️'}
        </div>
      )}

      {/* 2.5 Phonetic Hint Bubble (Synchronized with TTS readout) */}
      <div className="h-6 sm:h-8 mb-1 sm:mb-2 flex items-center justify-center w-full shrink-0">
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
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-center gap-y-4 sm:gap-y-6 shrink min-h-0 overflow-y-auto">
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
              className={`group relative ${cutHitbox} flex items-center justify-center transition-all shrink-0`}
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
                      ? `h-14 ${themeStyles.button} shadow-lg md:shadow-sm`
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
      <div className="mt-auto pt-2 sm:pt-4 w-full max-w-xs space-y-2 sm:space-y-3 px-4 shrink-0">
        <button
          onClick={checkAnswer}
          disabled={isResolved || cuts.length === 0 || isListening}
          className={`w-full ${btnPadding} rounded-3xl font-black tracking-widest uppercase shadow-xl transition-all ${
            cuts.length > 0 && !isResolved && !isListening
              ? `${themeStyles.button} ${themeStyles.buttonText} active:scale-95`
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

export default React.memo(SyllableExercise);
