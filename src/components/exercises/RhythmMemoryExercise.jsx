import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import { getSharedAudioContext } from '../../utils/audioUnlock.js';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';

// Two distinct pitches — the higher "cue" tone marks the start of playback
// (an audible "get ready"), the lower "beat" tone is the pattern itself, so
// the two never get confused by ear alone.
const playTone = (freq) => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch {
    // Web Audio not available — the exercise still works via the visual
    // pulse and TTS instruction, just without the click track.
  }
};

const BEAT_GAP = 260; // ms between taps within the same group
const GROUP_GAP = 750; // ms between groups
// Taps are re-grouped from raw timestamps using half the authoring group
// gap as the split threshold — comfortably above natural jitter between
// consecutive taps within a group, comfortably below the deliberate pause
// the user leaves between groups.
const GROUP_SPLIT_THRESHOLD = GROUP_GAP / 2;

const groupTaps = (timestamps) => {
  if (timestamps.length === 0) return [];
  const groups = [1];
  for (let i = 1; i < timestamps.length; i++) {
    if (timestamps[i] - timestamps[i - 1] > GROUP_SPLIT_THRESHOLD) {
      groups.push(1);
    } else {
      groups[groups.length - 1]++;
    }
  }
  return groups;
};

function RhythmMemoryExercise({
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
  const [tapTimestamps, setTapTimestamps] = useState([]);
  const [lastResult, setLastResult] = useState(null); // 'correct' | 'incorrect' | null
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

  const pattern = useMemo(() => data.pattern || [], [data.pattern]);

  // Same render-time "adjust state when a prop changes" pattern used in
  // RhythmTapExercise — resets synchronously on a genuine task change
  // without ever calling setState from inside a useEffect body.
  const [prevItemId, setPrevItemId] = useState(data.id);
  if (data.id !== prevItemId) {
    setPrevItemId(data.id);
    setPhase('listen');
    setTapTimestamps([]);
    setLastResult(null);
  }

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  const playPattern = useCallback(() => {
    clearAllTimeouts();
    const instruction =
      t('rhythmMemoryInstruction') ||
      'Listen to the beat pattern, then tap it back';
    speak(instruction, extendedTime);
    let delayAcc = instruction.length * (extendedTime ? 90 : 65) + 1200;

    pattern.forEach((groupSize) => {
      for (let i = 0; i < groupSize; i++) {
        setSafeTimeout(() => playTone(440), delayAcc);
        delayAcc += BEAT_GAP;
      }
      delayAcc += GROUP_GAP - BEAT_GAP;
    });

    setSafeTimeout(() => setPhase('tap'), delayAcc + 300);
  }, [pattern, speak, extendedTime, t, setSafeTimeout, clearAllTimeouts]);

  useEffect(() => {
    playPattern();
  }, [playPattern]);

  const playListen = useCallback(() => {
    setPhase('listen');
    setTapTimestamps([]);
    setLastResult(null);
    playPattern();
  }, [playPattern]);

  useAutoReadAloud(voiceAssistant, playListen);

  const handleTap = () => {
    if (phase !== 'tap') return;
    playTone(660);
    setTapTimestamps((prev) => [...prev, Date.now()]);
  };

  const handleUndo = () => {
    if (phase !== 'tap' || tapTimestamps.length === 0) return;
    setTapTimestamps((prev) => prev.slice(0, -1));
  };

  const handleCheck = () => {
    if (phase !== 'tap' || tapTimestamps.length === 0) return;
    clearAllTimeouts();
    const reproduced = groupTaps(tapTimestamps);
    const isCorrect = JSON.stringify(reproduced) === JSON.stringify(pattern);
    setLastResult(isCorrect ? 'correct' : 'incorrect');
    setPhase('result');
    speak(pattern.join('-'), extendedTime);

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

  const tappedGroups = groupTaps(tapTimestamps);

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
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
              ? t('rhythmMemoryInstruction') ||
                'Listen to the beat pattern, then tap it back'
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

      {!zenMode && (
        <div className="mb-3 text-4xl sm:mb-6 sm:text-6xl" aria-hidden="true">
          🥁
        </div>
      )}

      {phase === 'result' && lastResult && (
        <p className={`mb-4 text-2xl font-black ${themeStyles.accent}`}>
          <BionicText text={pattern.join(' · ')} enabled={bionicReading} />
        </p>
      )}

      {phase === 'tap' && (
        <>
          <button
            onClick={handleTap}
            className={`${tapPadSize} mb-3 flex shrink-0 items-center justify-center rounded-full border-b-8 shadow-xl transition-transform active:scale-90 active:border-b-0 sm:mb-6 ${themeStyles.button} ${themeStyles.buttonText}`}
            aria-label={t('rhythmMemoryTapButton') || 'Tap here for each beat'}
          >
            👆
          </button>

          <div
            className="mb-2 flex min-h-8 shrink-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-1 sm:mb-4"
            aria-live="polite"
          >
            {tappedGroups.map((count, gi) => (
              <span key={gi} className="flex items-center gap-1">
                {Array.from({ length: count }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${themeStyles.button}`}
                    aria-hidden="true"
                  />
                ))}
                {gi < tappedGroups.length - 1 && (
                  <span
                    className={`mx-1 h-0.5 w-3 rounded-full sm:w-4 ${isHighContrast ? 'bg-white/40' : 'bg-slate-300'}`}
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>

          <div className="flex w-full max-w-xs shrink-0 gap-2 px-4">
            <button
              onClick={handleUndo}
              disabled={tapTimestamps.length === 0}
              className={`flex-1 rounded-full py-2.5 text-xs font-black tracking-widest uppercase transition-colors sm:py-3 ${
                tapTimestamps.length === 0
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
              disabled={tapTimestamps.length === 0}
              className={`flex-1 rounded-full py-2.5 text-xs font-black tracking-widest uppercase shadow-lg transition-all sm:py-3 ${
                tapTimestamps.length === 0
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

export default React.memo(RhythmMemoryExercise);
