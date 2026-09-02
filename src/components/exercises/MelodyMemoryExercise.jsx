import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import { getSharedAudioContext } from '../../utils/audioUnlock.js';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';

const playNote = (freq, durationMs = 450) => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.connect(gain);
    gain.connect(ctx.destination);
    const dur = durationMs / 1000;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  } catch {
    // Web Audio unavailable — the exercise still works via the visual
    // note-button icons and TTS instruction, just without actual pitch.
  }
};

// C-major arpeggio (do-mi-sol-do) — a wide, unambiguous interval spacing
// chosen deliberately over an adjacent scale (C-D-E-F): four consecutive
// scale steps are hard to tell apart by ear for anyone without trained
// pitch discrimination, which would turn "remember the melody" into
// "remember an almost-uniform hum". Each note also gets its own icon+label
// (never color alone) so the sequence is fully legible with sound off or
// for a colorblind/deaf-blind user reading the result screen.
const NOTES = [
  { freq: 261.63, icon: '★', label: 'Do' },
  { freq: 329.63, icon: '■', label: 'Mi' },
  { freq: 392.0, icon: '▲', label: 'Sol' },
  { freq: 523.25, icon: '●', label: 'Do′' },
];

function MelodyMemoryExercise({
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
  const [attempt, setAttempt] = useState([]);
  const [lastResult, setLastResult] = useState(null); // 'correct' | 'incorrect' | null
  const [playingIndex, setPlayingIndex] = useState(null);
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

  const sequence = useMemo(() => data.sequence || [], [data.sequence]);

  // Shuffles which *position* each note button sits in (a fixed left-to-
  // right do-mi-sol-do′ layout lets the learner just memorize "2nd button,
  // 4th button" instead of actually listening for pitch) — seeded by the
  // task id so it's stable for the duration of this item and re-shuffles on
  // the next one. Each note keeps its own icon/frequency wherever it lands;
  // only the screen position moves, never the icon-to-pitch mapping.
  const noteOrder = useMemo(() => {
    const seed = data.id || 0;
    return NOTES.map((_, i) => i)
      .map((i) => ({ i, sortKey: ((i + 1) * 2654435761 + seed) % 100000 }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((x) => x.i);
  }, [data.id]);

  // Render-time reset on a genuine task change — mirrors
  // RhythmMemoryExercise's approach (adjust state during render rather than
  // in a useEffect body, so no setState-in-effect warning).
  const [prevItemId, setPrevItemId] = useState(data.id);
  if (data.id !== prevItemId) {
    setPrevItemId(data.id);
    setPhase('listen');
    setAttempt([]);
    setLastResult(null);
    setPlayingIndex(null);
  }

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  const playMelody = useCallback(() => {
    clearAllTimeouts();
    const instruction =
      t('melodyMemoryInstruction') ||
      'Listen to the melody, then play it back in the same order';
    speak(instruction, extendedTime);
    let delayAcc = instruction.length * (extendedTime ? 90 : 65) + 1200;
    const noteGap = 550;

    sequence.forEach((noteIdx) => {
      // Highlight by *note identity* (which button this is), not by the
      // note's position within the sequence — those aren't the same number
      // once a note repeats or the sequence isn't just 0,1,2,3 in order,
      // and using the step index here was lighting up the wrong tile for
      // whatever note was actually sounding.
      setSafeTimeout(() => {
        setPlayingIndex(noteIdx);
        playNote(NOTES[noteIdx].freq);
      }, delayAcc);
      setSafeTimeout(
        () => {
          setPlayingIndex((prev) => (prev === noteIdx ? null : prev));
        },
        delayAcc + noteGap - 100,
      );
      delayAcc += noteGap;
    });

    setSafeTimeout(() => setPhase('tap'), delayAcc + 300);
  }, [sequence, speak, extendedTime, t, setSafeTimeout, clearAllTimeouts]);

  useEffect(() => {
    playMelody();
  }, [playMelody]);

  const playListen = useCallback(() => {
    setPhase('listen');
    setAttempt([]);
    setLastResult(null);
    setPlayingIndex(null);
    playMelody();
  }, [playMelody]);

  useAutoReadAloud(voiceAssistant, playListen);

  const handleNotePress = (noteIdx) => {
    if (phase !== 'tap') return;
    playNote(NOTES[noteIdx].freq, 300);
    const next = [...attempt, noteIdx];
    setAttempt(next);

    if (next.length === sequence.length) {
      clearAllTimeouts();
      const isCorrect = next.every((v, i) => v === sequence[i]);
      setLastResult(isCorrect ? 'correct' : 'incorrect');
      setPhase('result');
      if (isCorrect) {
        setSafeTimeout(onSuccess, extendedTime ? 2200 : 1400);
      } else {
        onError();
        setSafeTimeout(() => playListen(), extendedTime ? 3200 : 2200);
      }
    }
  };

  const handleUndo = () => {
    if (phase !== 'tap' || attempt.length === 0) return;
    setAttempt((prev) => prev.slice(0, -1));
  };

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const noteBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-24 sm:h-24 text-2xl sm:text-4xl'
    : 'w-14 h-14 sm:w-20 sm:h-20 text-xl sm:text-3xl';
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
              ? t('melodyMemoryInstruction') ||
                'Listen to the melody, then play it back in the same order'
              : lastResult === 'correct'
                ? t('rhythmCorrect') || 'Perfect!'
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
          🎵
        </div>
      )}

      {phase === 'result' && lastResult && (
        <p
          className={`mb-4 flex items-center gap-2 text-2xl font-black ${themeStyles.accent}`}
        >
          {sequence.map((noteIdx, i) => (
            <span key={i} aria-hidden="true">
              {NOTES[noteIdx].icon}
            </span>
          ))}
          <BionicText
            text={sequence.map((n) => NOTES[n].label).join(' ')}
            enabled={bionicReading}
          />
        </p>
      )}

      {(phase === 'listen' || phase === 'tap') && (
        <div
          className="mb-4 flex shrink-0 gap-3 sm:mb-6 sm:gap-4"
          aria-hidden={phase === 'listen'}
        >
          {noteOrder.map((i) => {
            const note = NOTES[i];
            return (
              <button
                key={i}
                onClick={() => handleNotePress(i)}
                disabled={phase !== 'tap'}
                className={`${noteBtnSize} flex items-center justify-center rounded-2xl border-b-4 shadow-lg transition-transform active:scale-90 active:border-b-0 disabled:opacity-40 ${
                  playingIndex === i
                    ? 'scale-110 border-yellow-500 bg-yellow-300 text-slate-900'
                    : `${themeStyles.button} ${themeStyles.buttonText}`
                }`}
                aria-label={note.label}
              >
                {note.icon}
              </button>
            );
          })}
        </div>
      )}

      {phase === 'tap' && (
        <>
          <div
            className="mb-2 flex min-h-8 shrink-0 flex-wrap items-center justify-center gap-1.5 sm:mb-4"
            aria-live="polite"
          >
            {attempt.map((noteIdx, i) => (
              <span
                key={i}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm sm:h-8 sm:w-8 ${themeStyles.button} ${themeStyles.buttonText}`}
                aria-hidden="true"
              >
                {NOTES[noteIdx].icon}
              </span>
            ))}
          </div>

          <button
            onClick={handleUndo}
            disabled={attempt.length === 0}
            className={`shrink-0 rounded-full px-6 py-2 text-xs font-black tracking-widest uppercase transition-colors ${
              attempt.length === 0
                ? 'cursor-not-allowed text-slate-300'
                : 'text-slate-600 hover:text-red-400'
            }`}
          >
            <BionicText text={t('delete') || 'Undo'} enabled={bionicReading} />
          </button>
        </>
      )}
    </div>
  );
}

export default React.memo(MelodyMemoryExercise);
