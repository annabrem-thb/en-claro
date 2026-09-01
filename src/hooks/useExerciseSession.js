import { useState, useMemo, useCallback, useEffect } from 'react';

import { getSharedAudioContext } from '../utils/audioUnlock.js';
import { saveLog } from '../utils/indexedDB.js';
import { seededShuffle } from '../utils/shuffleUtils.js';

import { useSafeTimeouts } from './useSafeTimeouts.js';

const playThemeSound = (theme) => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    const playTone = (freq, type, startTime, duration, vol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + duration * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    switch (theme) {
      case 'Ocean':
        playTone(400, 'sine', now, 0.15, 0.2);
        playTone(600, 'sine', now + 0.1, 0.15, 0.2);
        playTone(800, 'sine', now + 0.2, 0.15, 0.2);
        break;
      case 'Space':
        playTone(440, 'sine', now, 0.4, 0.15);
        playTone(880, 'sine', now + 0.1, 0.3, 0.15);
        break;
      case 'Musik':
        playTone(523.25, 'triangle', now, 0.3, 0.15);
        playTone(659.25, 'triangle', now + 0.1, 0.3, 0.15);
        playTone(783.99, 'triangle', now + 0.2, 0.4, 0.15);
        playTone(1046.5, 'triangle', now + 0.3, 0.6, 0.15);
        break;
      case 'Kunst':
        playTone(329.63, 'sine', now, 0.5, 0.15);
        playTone(415.3, 'sine', now, 0.5, 0.15);
        playTone(523.25, 'sine', now, 0.5, 0.15);
        break;
      case 'Natur':
      default:
        playTone(700, 'sine', now, 0.2, 0.2);
        playTone(900, 'sine', now + 0.1, 0.3, 0.2);
        break;
    }
  } catch (e) {
    console.warn('Web Audio API not supported', e);
  }
};

export function useExerciseSession({
  db,
  activeTab,
  language,
  userDifficulty,
  setUserDifficulty,
  inclusiveOptions,
  t,
  speak,
  theme,
  growthValue,
  setGrowthValue,
  // Called once per completed unit, after growthValue/feedback are updated
  // but before the fixed advance-to-next-task delay is scheduled below.
  // This is the gamification module's only foothold into the session:
  // whatever it does (or doesn't do — passing no callback is a no-op) never
  // changes when the session pauses or what it waits for, only what appears
  // on screen while it does.
  onUnitCompleted,
  setErrorTimestamps,
}) {
  const [currentIndex, setCurrentIndex] = useState(
    () => Number(localStorage.getItem('idx')) || 0,
  );
  const [cycle, setCycle] = useState(0);
  // Never shown to the user and never feeds feedback copy — this exists
  // solely to trigger the adaptive-difficulty bump below after 5 correct
  // answers in a row.
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [errorCounter, setErrorCounter] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { setSafeTimeout } = useSafeTimeouts();

  useEffect(() => {
    // Genuinely synchronizing with an external system (a real setTimeout),
    // not deriving state from a prop — flagging the transition true here is
    // what lets the cleanup below reliably flip it back false 300ms later
    // and cancel a stale timer if currentIndex/activeTab/theme changes
    // again before that fires. There's no way to move the "revert after
    // 300ms" half out of an effect, and splitting the "start" half into a
    // render-time adjustment would decouple it from that cleanup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex, activeTab, theme]);

  useEffect(() => {
    localStorage.setItem('idx', String(currentIndex));
  }, [currentIndex]);

  const activePillarTasks = useMemo(() => {
    if (!db) return [];
    if (activeTab === 'Garden') return [];

    // Exercise Manager (Settings > Exercises): `activeExercises[dbKey] ===
    // false` opts a specific exercise type out of its pillar's task pool.
    // Missing/undefined keys default to active — this matters both for the
    // "all active by default" contract and so an older saved settings blob
    // (from before this feature existed, or missing a key added in a later
    // release) never silently drops a whole exercise type.
    const activeExercises = inclusiveOptions.activeExercises || {};
    // Tag every task with the exercise-type key it came from — `type` alone
    // isn't reliable for this (several dbKeys route through the same
    // component, e.g. `graphemes` and `diagnostic` both carry `type:
    // 'grapheme'`/`'diagnostic'`) — so the interleaving step below can group
    // strictly by *category*, not by rendering component.
    const includeIfActive = (dbKey) =>
      activeExercises[dbKey] !== false
        ? (db[dbKey] || []).map((task) => ({ ...task, __exerciseType: dbKey }))
        : [];
    const tagDiagnostic = (pillar) =>
      (db.diagnostic || [])
        .filter((d) => d.pillar === pillar)
        .map((task) => ({ ...task, __exerciseType: 'diagnostic' }));

    let rawTasks = [];
    switch (activeTab) {
      case 'Literacy':
        rawTasks = [
          ...includeIfActive('phonemes'),
          ...includeIfActive('syllables'),
          ...includeIfActive('graphemes'),
          ...includeIfActive('auditory'),
          ...includeIfActive('vocabulary'),
          ...includeIfActive('scrabble'),
          ...includeIfActive('lcwc'),
          ...includeIfActive('context'),
          ...includeIfActive('dictation'),
          ...includeIfActive('readAloud'),
          ...includeIfActive('comprehension'),
          ...includeIfActive('rhythm'),
          ...tagDiagnostic('Literacy'),
        ];
        break;
      case 'Visual':
        rawTasks = [
          ...includeIfActive('clock'),
          ...includeIfActive('tracking'),
          ...includeIfActive('mirrorImage'),
          ...includeIfActive('oddOneOut'),
          ...tagDiagnostic('Visual'),
        ];
        break;
      case 'Cognitive':
        rawTasks = [
          ...includeIfActive('categorization'),
          ...includeIfActive('sequences'),
          ...includeIfActive('memorySpan'),
          ...includeIfActive('logicalReasoning'),
          ...includeIfActive('rhythmMemory'),
          ...includeIfActive('melodyMemory'),
          ...tagDiagnostic('Cognitive'),
        ];
        break;
      default:
        rawTasks = [];
    }

    let tasks = rawTasks;
    let filteredTasks = tasks;
    if (inclusiveOptions.adaptiveDifficulty) {
      filteredTasks = tasks.filter((task) => {
        const diff = task.difficulty || 1;
        return diff === userDifficulty || diff === userDifficulty - 1;
      });
    } else {
      filteredTasks = tasks.filter(
        (task) => (task.difficulty || 1) === userDifficulty,
      );
    }

    if (filteredTasks.length === 0) {
      filteredTasks = tasks.filter(
        (task) => (task.difficulty || 1) <= userDifficulty,
      );
    }
    if (filteredTasks.length === 0) {
      filteredTasks = tasks;
    }

    const seed =
      activeTab.split('').reduce((a, b) => a + b.charCodeAt(0), 0) +
      (language === 'pl' ? 1 : 2) +
      cycle;

    // Group by exercise type so every active category gets an equal,
    // alternating share of the session — a flat shuffle would let a
    // content-rich type (e.g. 48 grapheme items) drown out a smaller one
    // (e.g. 3 memory-span items), so long runs of one category and near-total
    // absence of another both happen by chance. Each type is shuffled on its
    // own, trimmed to the smallest active type's count, then merged
    // round-robin; a richer type's *other* items aren't lost — they rotate in
    // on the next `cycle` reshuffle instead of all surfacing in one sitting.
    const groups = new Map();
    filteredTasks.forEach((task) => {
      const key = task.__exerciseType || 'unknown';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(task);
    });
    if (groups.size === 0) return [];

    const hashKey = (key) =>
      key.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const typeOrder = seededShuffle([...groups.keys()], seed + 7);
    const shuffledGroups = typeOrder.map((key) =>
      seededShuffle(groups.get(key), seed + hashKey(key)),
    );
    const perTypeCount = Math.min(...shuffledGroups.map((g) => g.length));

    const interleaved = [];
    for (let i = 0; i < perTypeCount; i++) {
      shuffledGroups.forEach((group) => interleaved.push(group[i]));
    }
    return interleaved;
  }, [
    activeTab,
    db,
    language,
    inclusiveOptions.adaptiveDifficulty,
    inclusiveOptions.activeExercises,
    userDifficulty,
    cycle,
  ]);

  const safeIndex = currentIndex % (activePillarTasks.length || 1);
  const currentTask =
    activePillarTasks.length > 0 ? activePillarTasks[safeIndex] : null;

  const goNext = useCallback(() => {
    setFeedback(null);
    if (activePillarTasks.length === 0) return;
    const length = activePillarTasks.length;
    setCurrentIndex((prevIdx) => {
      const currentSafe = prevIdx % length;
      const nextIdx = currentSafe + 1;
      if (nextIdx >= length) {
        setCycle((c) => c + 1);
        return 0;
      }
      return nextIdx;
    });
  }, [activePillarTasks.length]);

  const goPrev = useCallback(() => {
    setFeedback(null);
    if (activePillarTasks.length === 0) return;
    const length = activePillarTasks.length;
    setCurrentIndex((prevIdx) => {
      const currentSafe = prevIdx % length;
      const prevIdxCalc = currentSafe - 1;
      return prevIdxCalc < 0 ? length - 1 : prevIdxCalc;
    });
  }, [activePillarTasks.length]);

  const handleSuccess = useCallback(() => {
    const newConsecutiveCorrect = consecutiveCorrect + 1;
    setConsecutiveCorrect(newConsecutiveCorrect);
    if (
      inclusiveOptions.adaptiveDifficulty &&
      newConsecutiveCorrect > 0 &&
      newConsecutiveCorrect % 5 === 0 &&
      userDifficulty < 4
    )
      setUserDifficulty((prev) => Math.min(prev + 1, 4));
    setErrorCounter(0);
    if (inclusiveOptions.audioRewards && !inclusiveOptions.muteNotifications)
      playThemeSound(theme);
    const successMsgs = t('successMsg', { returnObjects: true });
    const msg = Array.isArray(successMsgs)
      ? successMsgs[Math.floor(Math.random() * successMsgs.length)]
      : successMsgs;
    setFeedback({ type: 'success', msg });
    const voiceSuccess = t('voice.success', { returnObjects: true });
    const voiceSuccessMsg = Array.isArray(voiceSuccess)
      ? voiceSuccess[Math.floor(Math.random() * voiceSuccess.length)]
      : voiceSuccess || '';
    // Bug fix: this used to check only `muteNotifications`, so success/error
    // speech ignored the global `voiceAssistant` toggle entirely — a user who
    // turned Voice Assistant off would still hear these lines on every
    // answer. Both flags must allow speech: the master toggle first, then
    // the narrower "mute notifications" sub-preference.
    if (inclusiveOptions.voiceAssistant && !inclusiveOptions.muteNotifications)
      speak(voiceSuccessMsg);
    const newGrowthValue = growthValue + 1;
    setGrowthValue(newGrowthValue);
    onUnitCompleted?.(newGrowthValue);
    // Advance timing must be identical regardless of what onUnitCompleted
    // does (or whether anything is wired to it at all) — it's a single
    // shared schedule, not something the gamification setting should be
    // able to change. The in-session feedback-survey popup this used to
    // also schedule has been removed entirely: the survey is opened
    // explicitly by the user now, not triggered inline by point count.
    const advanceDelay = inclusiveOptions.extendedTime ? 3000 : 1500;
    setSafeTimeout(goNext, advanceDelay);
    saveLog('exercise_history', {
      date: new Date().toISOString(),
      type: activeTab,
      correct: true,
    }).catch(console.error);
  }, [
    consecutiveCorrect,
    activeTab,
    t,
    speak,
    growthValue,
    theme,
    inclusiveOptions,
    userDifficulty,
    goNext,
    setGrowthValue,
    onUnitCompleted,
    setUserDifficulty,
    setSafeTimeout,
  ]);

  const handleError = useCallback(() => {
    setErrorTimestamps((prev) => [...prev, Date.now()]);
    const newErrorCounter = errorCounter + 1;
    setErrorCounter(newErrorCounter);
    if (
      inclusiveOptions.adaptiveDifficulty &&
      newErrorCounter >= 2 &&
      userDifficulty > 1
    ) {
      setUserDifficulty((prev) => Math.max(prev - 1, 1));
      setErrorCounter(0);
    }
    const voiceError = t('voice.error', { returnObjects: true });
    const errorMsg = Array.isArray(voiceError)
      ? voiceError[Math.floor(Math.random() * voiceError.length)]
      : voiceError || "Let's look closer at this one together.";
    setFeedback({ type: 'error', msg: errorMsg });
    // Same fix as handleSuccess above: respect the global voiceAssistant
    // toggle, not just muteNotifications.
    if (inclusiveOptions.voiceAssistant && !inclusiveOptions.muteNotifications)
      speak(errorMsg);
    saveLog('exercise_history', {
      date: new Date().toISOString(),
      type: activeTab,
      correct: false,
    }).catch(console.error);
  }, [
    t,
    speak,
    errorCounter,
    inclusiveOptions,
    userDifficulty,
    activeTab,
    setErrorTimestamps,
    setUserDifficulty,
  ]);

  return {
    currentIndex,
    setCurrentIndex,
    cycle,
    setCycle,
    setConsecutiveCorrect,
    feedback,
    setFeedback,
    isTransitioning,
    activePillarTasks,
    currentTask,
    safeIndex,
    goNext,
    goPrev,
    handleSuccess,
    handleError,
  };
}
