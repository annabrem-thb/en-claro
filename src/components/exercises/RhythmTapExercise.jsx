import React, { useState, useEffect, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import { getSharedAudioContext } from '../../utils/audioUnlock.js';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';

// A short percussive click — deliberately not a spoken/synthesized sound, so
// it reads as a "beat" rather than a repeat of the TTS voice. Mirrors the
// oscillator-based approach already used for theme/reward sounds elsewhere
// in this codebase rather than pulling in an audio file dependency.
const playTapClick = () => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch {
    // Web Audio not available — tapping still works, just silently.
  }
};

function RhythmTapExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
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
  const [phase, setPhase] = useState('listen'); // 'listen' | 'tap' | 'result'
  const [tapCount, setTapCount] = useState(0);
  const [lastResult, setLastResult] = useState(null); // 'correct' | 'incorrect' | null
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

  const syllableCount = data.segments?.length || 0;

  // "Adjust state when a prop changes" during render (React's documented
  // alternative to resetting state from inside an effect) — comparing
  // against the previously-seen item id and resetting synchronously here
  // avoids an extra render pass and never calls setState from inside a
  // useEffect body.
  const [prevItemId, setPrevItemId] = useState(data.id);
  if (data.id !== prevItemId) {
    setPrevItemId(data.id);
    setPhase('listen');
    setTapCount(0);
    setLastResult(null);
  }

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  // Only schedules speech/timers — any state change it causes (advancing to
  // the "tap" phase) happens inside the setSafeTimeout callback, not
  // synchronously in the caller, so this is safe to invoke both from a
  // plain useEffect (below, on task change) and from event handlers (the
  // manual replay button).
  const playWordAudio = useCallback(() => {
    clearAllTimeouts();
    const instruction =
      t('rhythmInstruction') ||
      'Listen to the word, then tap once for every syllable';
    speak(instruction, extendedTime);
    const instructionDelay =
      instruction.length * (extendedTime ? 90 : 65) + 1200;

    setSafeTimeout(() => {
      speak(data.word, extendedTime);
    }, instructionDelay);

    const wordDelay =
      (data.word?.length || 0) * (extendedTime ? 90 : 65) + 1500;
    setSafeTimeout(() => {
      setPhase('tap');
    }, instructionDelay + wordDelay);
  }, [data.word, speak, extendedTime, t, setSafeTimeout, clearAllTimeouts]);

  useEffect(() => {
    playWordAudio();
  }, [playWordAudio]);

  const playListen = useCallback(() => {
    setPhase('listen');
    setTapCount(0);
    setLastResult(null);
    playWordAudio();
  }, [playWordAudio]);

  useAutoReadAloud(voiceAssistant, playListen);

  const handleTap = () => {
    if (phase !== 'tap') return;
    playTapClick();
    setTapCount((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (phase !== 'tap' || tapCount === 0) return;
    setTapCount((prev) => Math.max(0, prev - 1));
  };

  const handleCheck = () => {
    if (phase !== 'tap' || tapCount === 0) return;
    clearAllTimeouts();
    const isCorrect = tapCount === syllableCount;
    setLastResult(isCorrect ? 'correct' : 'incorrect');
    setPhase('result');

    const breakdown = data.segments?.join('-') || data.word;
    speak(breakdown, extendedTime);

    if (isCorrect) {
      setSafeTimeout(onSuccess, extendedTime ? 2200 : 1400);
    } else {
      onError();
      setSafeTimeout(
        () => {
          playListen();
        },
        extendedTime ? 3200 : 2200,
      );
    }
  };

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const wordSize = bigTargets ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl';
  const tapPadSize = bigTargets
    ? 'w-40 h-40 sm:w-56 sm:h-56 text-5xl sm:text-6xl'
    : 'w-32 h-32 sm:w-48 sm:h-48 text-4xl sm:text-5xl';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl sm:text-3xl'
    : 'w-12 h-12 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2`}
    >
      {!zenMode && (
        <h3
          className={`mb-2 shrink-0 px-4 text-center text-[10px] leading-relaxed font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {phase === 'listen'
            ? t('rhythmListening') || 'Listen carefully…'
            : phase === 'tap'
              ? t('rhythmInstruction') ||
                'Listen to the word, then tap once for every syllable'
              : lastResult === 'correct'
                ? t('rhythmCorrect') || 'Perfect rhythm!'
                : t('rhythmIncorrect') || 'Not quite — listen again'}
        </h3>
      )}

      {phase === 'tap' && (
        <ExerciseControlsRow>
          <TTSController
            onReadAloud={playListen}
            pauseAllTimeouts={pauseAllTimeouts}
            resumeAllTimeouts={resumeAllTimeouts}
            controlBtnSize={controlBtnSize}
            noFlash={noFlash}
            ttsFallback={ttsFallback}
          />
        </ExerciseControlsRow>
      )}

      <div className="mb-3 shrink-0 text-center sm:mb-6">
        {!zenMode && (
          <div className="mb-1 text-4xl sm:mb-2 sm:text-6xl" aria-hidden="true">
            {data.icon || '🥁'}
          </div>
        )}
        <div className={`${wordSize} font-black ${themeStyles.accent}`}>
          <BionicText
            text={
              phase === 'result' && lastResult
                ? data.segments?.join(' · ') || data.word
                : data.word
            }
            enabled={bionicReading}
          />
        </div>
      </div>

      {phase === 'tap' && (
        <>
          <button
            onClick={handleTap}
            className={`${tapPadSize} mb-3 flex shrink-0 items-center justify-center rounded-full border-b-8 shadow-xl transition-transform active:scale-90 active:border-b-0 sm:mb-6 ${themeStyles.button} ${themeStyles.buttonText}`}
            aria-label={t('rhythmTapButton') || 'Tap here for each syllable'}
          >
            👆
          </button>

          <div
            className="mb-2 flex min-h-8 shrink-0 items-center justify-center gap-1.5 sm:mb-4"
            aria-live="polite"
          >
            {Array.from({ length: tapCount }).map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${themeStyles.button}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p
            className={`mb-3 text-xs font-bold sm:mb-4 ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            {t('rhythmTapCount', { count: tapCount }) || `Taps: ${tapCount}`}
          </p>

          <div className="flex w-full max-w-xs shrink-0 gap-2 px-4">
            <button
              onClick={handleUndo}
              disabled={tapCount === 0}
              className={`flex-1 rounded-full py-2.5 text-xs font-black tracking-widest uppercase transition-colors sm:py-3 ${
                tapCount === 0
                  ? 'cursor-not-allowed text-slate-300'
                  : 'text-slate-600 hover:text-red-400'
              }`}
            >
              <BionicText
                text={t('delete') || 'Undo'}
                enabled={bionicReading}
              />
            </button>
            <button
              onClick={handleCheck}
              disabled={tapCount === 0}
              className={`flex-1 rounded-full py-2.5 text-xs font-black tracking-widest uppercase shadow-lg transition-all sm:py-3 ${
                tapCount === 0
                  ? 'cursor-not-allowed bg-slate-100 text-slate-300'
                  : `${themeStyles.button} ${themeStyles.buttonText} active:scale-95`
              }`}
            >
              <BionicText
                text={t('check') || 'Check'}
                enabled={bionicReading}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(RhythmTapExercise);
