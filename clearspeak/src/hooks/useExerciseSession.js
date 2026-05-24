import { useState, useMemo, useCallback, useEffect } from 'react';
import { seededShuffle } from '../utils/shuffleUtils.js';
import { saveLog } from '../utils/indexedDB.js';

// Globalna instancja w celu ominięcia rygorystycznych limitów AudioContext przeglądarek
let sharedAudioCtx = null;

// Funkcja syntezująca unikalne dźwięki sukcesu dla poszczególnych motywów
const playThemeSound = (theme) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContext();
    }
    if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();
    const ctx = sharedAudioCtx;
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

    switch(theme) {
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
        playTone(1046.50, 'triangle', now + 0.3, 0.6, 0.15);
        break;
      case 'Kunst':
        playTone(329.63, 'sine', now, 0.5, 0.15);
        playTone(415.30, 'sine', now, 0.5, 0.15);
        playTone(523.25, 'sine', now, 0.5, 0.15);
        break;
      case 'Natur':
      default:
        playTone(700, 'sine', now, 0.2, 0.2);
        playTone(900, 'sine', now + 0.1, 0.3, 0.2);
        break;
    }
  } catch (e) {
    console.warn("Web Audio API not supported", e);
  }
};

const POINTS_PER_LEVEL = 5;

export function useExerciseSession({
  db, activeTab, language,
  userDifficulty, setUserDifficulty,
  inclusiveOptions, t, speak, theme, isGamified,
  points, setPoints, setCoins, setRewards,
  dailyQuests, updateQuests, setDailyProgress,
  setPendingFeedback, setShowSuccess, setShowFeedback, setEarnedCoinsAnim,
  setErrorTimestamps
}) {
  const [currentIndex, setCurrentIndex] = useState(() => Number(localStorage.getItem('idx')) || 0);
  const [cycle, setCycle] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [errorCounter, setErrorCounter] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex, activeTab, theme]);
  
  // Automatyczny zapis indeksu bieżącego zadania do pamięci przeglądarki
  useEffect(() => {
    localStorage.setItem('idx', String(currentIndex));
  }, [currentIndex]);

  const activePillarTasks = useMemo(() => {
    if (!db) return [];
    if (activeTab === 'Garden') return [];
    let rawTasks = [];
    switch (activeTab) {
      case 'Literacy':  rawTasks = [...(db.phonemes || []), ...(db.syllables || []), ...(db.graphemes || []), ...(db.scrabble || []), ...(db.lcwc || []), ...(db.context || []), ...(db.dictation || []), ...(db.diagnostic?.filter(d => d.pillar === 'Literacy') || [])]; break;
      case 'Visual':    rawTasks = [...(db.clock || []), ...(db.tracking || []), ...(db.diagnostic?.filter(d => d.pillar === 'Visual') || [])]; break;
      case 'Cognitive': rawTasks = [...(db.categorization || []), ...(db.sequences || []), ...(db.diagnostic?.filter(d => d.pillar === 'Cognitive') || [])]; break;
      default:          rawTasks = [];
    }

    let tasks = rawTasks;
    let filteredTasks = tasks;
    if (inclusiveOptions.adaptiveDifficulty) {
      filteredTasks = tasks.filter(task => {
        const diff = task.difficulty || 1;
        return diff === userDifficulty || diff === userDifficulty - 1;
      });
    } else {
      filteredTasks = tasks.filter(task => (task.difficulty || 1) === userDifficulty);
    }

    if (filteredTasks.length === 0) {
      filteredTasks = tasks.filter(task => (task.difficulty || 1) <= userDifficulty);
    }
    if (filteredTasks.length === 0) {
      filteredTasks = tasks;
    }

    const seed = activeTab.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + (language === 'pl' ? 1 : 2) + cycle;
    return seededShuffle([...filteredTasks], seed);
  }, [activeTab, db, language, inclusiveOptions.adaptiveDifficulty, userDifficulty, cycle]);

  const safeIndex = currentIndex % (activePillarTasks.length || 1);
  const currentTask = activePillarTasks.length > 0 ? activePillarTasks[safeIndex] : null;

  const goNext = useCallback(() => {
    setFeedback(null);
    if (activePillarTasks.length === 0) return;
    const length = activePillarTasks.length;
    const currentSafe = currentIndex % length;
    const nextIdx = currentSafe + 1;
    if (nextIdx >= length) {
      setCycle(c => c + 1);
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIdx);
    }
  }, [currentIndex, activePillarTasks.length]);

  const goPrev = useCallback(() => {
    setFeedback(null);
    if (activePillarTasks.length === 0) return;
    const length = activePillarTasks.length;
    const currentSafe = currentIndex % length;
    const prevIdx = currentSafe - 1;
    if (prevIdx < 0) {
      setCurrentIndex(length - 1);
    } else {
      setCurrentIndex(prevIdx);
    }
  }, [currentIndex, activePillarTasks.length]);

  const handleSuccess = useCallback(() => {
    const newStreak = currentStreak + 1;
    setCurrentStreak(newStreak);
    if (inclusiveOptions.adaptiveDifficulty && newStreak > 0 && newStreak % 5 === 0 && userDifficulty < 4) setUserDifficulty(prev => Math.min(prev + 1, 4));
    setErrorCounter(0);
    if (inclusiveOptions.audioRewards && !inclusiveOptions.muteNotifications) playThemeSound(theme);
    let earnedCoins = 1;
    if (isGamified) dailyQuests.tasks.forEach(task => { if (!task.completed && (task.type === activeTab || task.type === 'Any')) if (task.current + 1 >= task.target) earnedCoins += task.reward; });
    updateQuests(activeTab);
    const baseSuccessMsg = Array.isArray(t.successMsg) ? t.successMsg[Math.floor(Math.random() * t.successMsg.length)] : t.successMsg;
    let msg = baseSuccessMsg;
    if (newStreak >= 3 && t.streakMsg) msg = Array.isArray(t.streakMsg) ? t.streakMsg[Math.floor(Math.random() * t.streakMsg.length)].replace(/{count}/g, newStreak) : (typeof t.streakMsg === 'function' ? t.streakMsg(newStreak) : t.streakMsg);
    setFeedback({ type: 'success', msg });
    let voiceSuccessMsg = Array.isArray(t.voice?.success) ? t.voice.success[Math.floor(Math.random() * t.voice.success.length)] : (t.voice?.success || '');
    if (newStreak >= 3 && t.voice?.streak) voiceSuccessMsg = Array.isArray(t.voice.streak) ? t.voice.streak[Math.floor(Math.random() * t.voice.streak.length)].replace(/{count}/g, newStreak) : t.voice.streak;
    if (!inclusiveOptions.muteNotifications) speak(voiceSuccessMsg);
    const newPoints = points + 1;
    setPoints(newPoints);
    if (isGamified) {
      setCoins(prev => prev + 1);
      const todayStr = new Date().toDateString();
      setDailyProgress(prev => { const todayPoints = prev[todayStr]?.points || 0; return { ...prev, [todayStr]: { points: todayPoints + 1 } }; });
      setEarnedCoinsAnim(earnedCoins);
      setTimeout(() => setEarnedCoinsAnim(null), 1500);
      const pool = t.rewardItems?.[theme] || t.rewardItems?.Natur || ['⭐'];
      setRewards(prev => [...prev, pool[Math.floor(Math.random() * pool.length)]]);
      if (newPoints % POINTS_PER_LEVEL === 0) { if (newPoints > 0 && newPoints % 10 === 0) setPendingFeedback(true); setTimeout(() => setShowSuccess(true), 1000); } else setTimeout(goNext, inclusiveOptions.extendedTime ? 3000 : 1500);
    } else {
      if (newPoints > 0 && newPoints % 10 === 0) setTimeout(() => setShowFeedback(true), inclusiveOptions.extendedTime ? 3000 : 1500); else setTimeout(goNext, inclusiveOptions.extendedTime ? 3000 : 1500);
    }
    saveLog('exercise_history', { date: new Date().toISOString(), type: activeTab, correct: true }).catch(console.error);
  }, [currentStreak, isGamified, dailyQuests, activeTab, updateQuests, t, speak, points, theme, setRewards, inclusiveOptions, setDailyProgress, userDifficulty, goNext, setCoins, setEarnedCoinsAnim, setPoints, setPendingFeedback, setShowSuccess, setShowFeedback, setUserDifficulty]);

  const handleError = useCallback(() => {
    setErrorTimestamps(prev => [...prev, Date.now()]);
    const newErrorCounter = errorCounter + 1;
    setErrorCounter(newErrorCounter);
    if (inclusiveOptions.adaptiveDifficulty && newErrorCounter >= 2 && userDifficulty > 1) { setUserDifficulty(prev => Math.max(prev - 1, 1)); setErrorCounter(0); }
    const errorMsg = Array.isArray(t.voice?.error) ? t.voice.error[Math.floor(Math.random() * t.voice.error.length)] : (t.voice?.error || "Let's look closer at this one together.");
    setFeedback({ type: 'error', msg: errorMsg });
    if (!inclusiveOptions.muteNotifications) speak(errorMsg);
    saveLog('exercise_history', { date: new Date().toISOString(), type: activeTab, correct: false }).catch(console.error);
  }, [t, speak, errorCounter, inclusiveOptions, userDifficulty, activeTab, setErrorTimestamps, setUserDifficulty]);

  return { currentIndex, setCurrentIndex, cycle, setCycle, currentStreak, setCurrentStreak, feedback, setFeedback, isTransitioning, activePillarTasks, currentTask, safeIndex, goNext, goPrev, handleSuccess, handleError };
}