/* 
 * App.jsx (Version 4)
 * Main application component responsible for state management, theming, and exercise rendering.
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

import { useTranslation }  from '../i18n/i18n.js';

import IntroScreen        from './IntroScreen.jsx';
import SettingsModal      from './SettingsModal.jsx';
import { ProgressPill }   from './ProgressPill.jsx';
import VirtualGarden      from './VirtualGarden.jsx';
import BionicText         from './common/BionicText.jsx';
import AccessibleTTS      from './common/AccessibleTTS.jsx';
import TTSController      from './common/TTSController.jsx';
import SkeletonLoader     from './common/SkeletonLoader.jsx';
import SidebarNav         from './SidebarNav.jsx';
import { FeedbackCollector } from './FeedbackCollector.jsx';
import { CognitiveEnergyIndicator } from './CognitiveEnergyIndicator.jsx';
import { saveLog } from '../utils/indexedDB.js';
import { useIndexedDB } from '../hooks/useIndexedDB.js';
import { useCognitiveLoad } from '../hooks/useCognitiveLoad.js';
import { useAffirmativeNotifications } from '../hooks/useAffirmativeNotifications.js';

import ExerciseContainer from './ExerciseContainer.jsx';
import { GamificationProvider, useGamification } from './GamificationContext.jsx';
import { AppConfigProvider } from '../context/AppConfigContext.jsx';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { seededShuffle } from '../utils/shuffleUtils.js';

// --- Global Constants & Configurations ---
const POINTS_PER_LEVEL = 5;
const PILLARS = ['Literacy', 'Visual', 'Cognitive'];

// Punkt 7: Horticultural Therapy Framework - łagodne i uspokajające palety barw, eliminacja czystej bieli
const THEMES = {
  Natur: { accent: 'text-[#4A5D54]', bg: 'bg-[#F4F1EA]', button: 'bg-[#8A9A86]', buttonText: 'text-[#F4F1EA]', border: 'border-[#D0D6CE]', hex: '#8A9A86', price: 0 },
  Musik: { accent: 'text-[#6B5B7B]', bg: 'bg-[#F3F0F5]', button: 'bg-[#8F7D9E]', buttonText: 'text-[#F3F0F5]', border: 'border-[#D1C8D6]', hex: '#8F7D9E', price: 3 },
  Kunst: { accent: 'text-[#8A6A4B]', bg: 'bg-[#F7F4F0]', button: 'bg-[#B08E6D]', buttonText: 'text-[#F7F4F0]', border: 'border-[#DED4CA]', hex: '#B08E6D', price: 5 },
  Space: { accent: 'text-[#4B5E6B]', bg: 'bg-[#F0F3F5]', button: 'bg-[#6D8394]', buttonText: 'text-[#F0F3F5]', border: 'border-[#CAD4DE]', hex: '#6D8394', price: 8 },
  Ocean: { accent: 'text-[#437A7A]', bg: 'bg-[#EFF5F5]', button: 'bg-[#67A3A3]', buttonText: 'text-[#EFF5F5]', border: 'border-[#C4DBDB]', hex: '#67A3A3', price: 10 },
};

// Globalna instancja w celu ominięcia rygorystycznych limitów AudioContext przeglądarek
let sharedAudioCtx = null;

// Function synthesizing unique sounds for themes using Web Audio API
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
      case 'Ocean': // Bubble sound
        playTone(400, 'sine', now, 0.15, 0.2);
        playTone(600, 'sine', now + 0.1, 0.15, 0.2);
        playTone(800, 'sine', now + 0.2, 0.15, 0.2);
        break;
      case 'Space': // Retro-space sound (Theremin)
        playTone(440, 'sine', now, 0.4, 0.15);
        playTone(880, 'sine', now + 0.1, 0.3, 0.15);
        break;
      case 'Musik': // Harp/bell arpeggio
        playTone(523.25, 'triangle', now, 0.3, 0.15);
        playTone(659.25, 'triangle', now + 0.1, 0.3, 0.15);
        playTone(783.99, 'triangle', now + 0.2, 0.4, 0.15);
        playTone(1046.50, 'triangle', now + 0.3, 0.6, 0.15);
        break;
      case 'Kunst': // Inspiring chord
        playTone(329.63, 'sine', now, 0.5, 0.15); // E4
        playTone(415.30, 'sine', now, 0.5, 0.15); // G#4
        playTone(523.25, 'sine', now, 0.5, 0.15); // C5
        break;
      case 'Natur':
      default: // Gentle wooden marimba / chirp
        playTone(700, 'sine', now, 0.2, 0.2);
        playTone(900, 'sine', now + 0.1, 0.3, 0.2);
        break;
    }
  } catch (e) {
    console.warn("Web Audio API not supported", e);
  }
};

const makeDailyQuests = () => [
  { id: 1, type: 'Literacy',  target: 3,  current: 0, completed: false, reward: 3 },
  { id: 2, type: 'Cognitive', target: 2,  current: 0, completed: false, reward: 3 },
  { id: 3, type: 'Any',       target: 10, current: 0, completed: false, reward: 5 },
];

// --- Main App Component ---
function AppContent() {
  const [language,         setLanguage]         = useState(() => localStorage.getItem('cfg_lang')  || 'de');
  const [db,               setDb]               = useState(null);
  const [theme,            setTheme]            = useState(() => localStorage.getItem('cfg_theme') || 'Natur');
  const [a11yAddons,       setA11yAddons]       = useState(() => {
    const sv = localStorage.getItem('cfg_addons');
    const migrated = localStorage.getItem('cfg_migrated_v3');
    if (!migrated) {
      localStorage.setItem('cfg_migrated_v3', 'true');
      return ['LRS', 'Spacing'];
    }
    return sv ? JSON.parse(sv) : ['LRS', 'Spacing'];
  });
  const { isGamified, setIsGamified } = useGamification();
  const [inclusiveOptions, setInclusiveOptions] = useState(() => {
    const sv = localStorage.getItem('cfg_inclusive');
    return sv ? JSON.parse(sv) : { adaptiveDifficulty: true, bigTargets: false, noFlash: false, audioRewards: false, extendedTime: false, zenMode: false, bionicReading: true, minimalistMode: false, muteNotifications: false, voiceAssistant: false };
  });
  const [dailyGoal, setDailyGoal] = useState(() => Number(localStorage.getItem('cfg_goal')) || 5);
  const [selectedVoiceURIs, setSelectedVoiceURIs] = useState(() => {
    const sv = localStorage.getItem('cfg_voice_uris');
    if (sv) return JSON.parse(sv);
    const oldSv = localStorage.getItem('cfg_voice_uri');
    return { pl: oldSv || 'default', en: oldSv || 'default', de: oldSv || 'default' };
  });
  const [voiceSpeed, setVoiceSpeed] = useState(() => Number(localStorage.getItem('cfg_voice_speed')) || 1.0);
  const [voicePitch, setVoicePitch] = useState(() => Number(localStorage.getItem('cfg_voice_pitch')) || 1.0);

  const [activeTab,    setActiveTab]    = useState('Literacy');
  const [lastPillar,   setLastPillar]   = useState('Literacy'); // Remembers the pillar for garden rendering
  const [showIntro,    setShowIntro]    = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [earnedCoinsAnim, setEarnedCoinsAnim] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState(false);

  const [currentIndex,  setCurrentIndex]  = useState(() => Number(localStorage.getItem('idx')) || 0);
  const [cycle,         setCycle]         = useState(0);
  const [points,        setPoints]        = useState(() => Number(localStorage.getItem('pts')) || 0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [feedback,      setFeedback]      = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rewards,       setRewards]       = useState(() => JSON.parse(localStorage.getItem('rew') || '[]'));

  const [coins,          setCoins]          = useState(() => Number(localStorage.getItem('cfg_coins')) || 0);
  const [unlockedThemes, setUnlockedThemes] = useState(() => {
    const sv = localStorage.getItem('cfg_unlocked_themes'); return sv ? JSON.parse(sv) : ['Natur'];
  });
  const [dailyQuests, setDailyQuests] = useState(() => {
    const saved = localStorage.getItem('cfg_quests');
    const today = new Date().toDateString();
    const data  = saved ? JSON.parse(saved) : null;
    return (data && data.date === today) ? data : { date: today, tasks: makeDailyQuests() };
  });
  const [userDifficulty, setUserDifficulty] = useState(() => Number(localStorage.getItem('cfg_difficulty')) || 2);
  const [errorCounter, setErrorCounter] = useState(0);

  const { 
    loadLevel, showBreakModal, setSessionStartTime, setErrorTimestamps, 
    setLoadLevel, setShowBreakModal, setBreakDismissed 
  } = useCognitiveLoad(activeTab, inclusiveOptions.zenMode);

  // State for PWA Offline Support & Updates
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ onRegisterError: (err) => console.error('SW Error:', err) });

  const [dailyProgress, setDailyProgress] = useIndexedDB('daily_progress', 'date', 'cfg_daily_progress');

  // Moduł wiadomości afirmatywnych
  const { affirmation, setAffirmation } = useAffirmativeNotifications(points, language);

  // --- Dynamiczne ładowanie baz słówek (Code Splitting) ---
  useEffect(() => {
    let isMounted = true;
    const loadDatabase = async () => {
      try {
        let loadedModule;
        if (language === 'pl') {
          loadedModule = await import('../data/vocabulary_pl.js');
          if (isMounted) setDb(loadedModule.wordDatabasePL);
        } else if (language === 'en') {
          loadedModule = await import('../data/vocabulary_en.js');
          if (isMounted) setDb(loadedModule.wordDatabaseEN);
        } else {
          loadedModule = await import('../data/vocabulary_de.js');
          if (isMounted) setDb(loadedModule.wordDatabaseDE);
        }
      } catch (error) {
        console.error("Failed to load vocabulary database:", error);
      }
    };
    loadDatabase();
    return () => { isMounted = false; };
  }, [language]);

  useEffect(() => {
    if (!isGamified && activeTab === 'Garden') {
      setActiveTab('Literacy');
    }
  }, [isGamified, activeTab]);

  // Wyświetlanie Skeleton Loadera przez 300ms za każdym razem, 
  // gdy użytkownik przechodzi do następnego zadania, zmienia zakładkę lub motyw.
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex, activeTab, theme]);

  const t = useTranslation(language);
  const s = t; // Alias 's' pozostawiony dla zgodności z propsami starszych komponentów (np. SidebarNav)
  const themeStyles = THEMES[theme]         || THEMES.Natur;
  const noFlash        = !!(inclusiveOptions.noFlash    || a11yAddons.includes('Redukcja'));
  const bigTargets     = !!(inclusiveOptions.bigTargets || a11yAddons.includes('Motorik'));
  const hideNavLabel   = a11yAddons.includes('Niedowidzenie');
  const isHighContrast = a11yAddons.includes('Kontrast');
  const hasRuler       = a11yAddons.includes('Linijka');

  const cardRef = useRef(null);
  const [rulerPos, setRulerPos] = useState({ y: 0, visible: false });

  useEffect(() => {
    if (!hasRuler) return;
    
    const updateRuler = (clientX, clientY) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        // Check if the cursor is within the bounds of the exercise card
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          setRulerPos({ y: clientY - rect.top, visible: true }); // y calculated relative to the top of the card
        } else {
          setRulerPos(prev => prev.visible ? { ...prev, visible: false } : prev);
        }
      }
    };

    const handleMouseMove = (e) => updateRuler(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        updateRuler(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, [hasRuler]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-a11y-contrast', String(isHighContrast));
    root.setAttribute('data-a11y-motor',    String(bigTargets));
    root.setAttribute('data-a11y-vision',   String(a11yAddons.includes('Niedowidzenie')));
    root.setAttribute('data-a11y-color',    String(a11yAddons.includes('Daltonizm')));
    root.setAttribute('data-a11y-motion',   String(noFlash));
    root.setAttribute('data-a11y-spacing',  String(a11yAddons.includes('Spacing')));
    root.setAttribute('data-a11y-lrs',      String(a11yAddons.includes('LRS')));
    root.setAttribute('data-a11y-desaturation', String(a11yAddons.includes('Desaturacja')));
    root.setAttribute('data-a11y-minimalist', String(!!inclusiveOptions.minimalistMode));
    root.style.setProperty('--theme-accent', THEMES[theme]?.hex || '#10b981');
    root.lang = language;
  }, [a11yAddons, inclusiveOptions, theme, isHighContrast, bigTargets, noFlash, language]);

  useEffect(() => {
    localStorage.setItem('cfg_lang',            language);
    localStorage.setItem('cfg_theme',           theme);
    localStorage.setItem('cfg_addons',          JSON.stringify(a11yAddons));
    localStorage.setItem('cfg_inclusive',       JSON.stringify(inclusiveOptions));
    localStorage.setItem('pts',                 String(points));
    localStorage.setItem('idx',                 String(currentIndex));
    localStorage.setItem('rew',                 JSON.stringify(rewards));
    localStorage.setItem('cfg_coins',           String(coins));
    localStorage.setItem('cfg_unlocked_themes', JSON.stringify(unlockedThemes));
    localStorage.setItem('cfg_quests',          JSON.stringify(dailyQuests))
    localStorage.setItem('cfg_voice_uris',      JSON.stringify(selectedVoiceURIs));
    localStorage.setItem('cfg_voice_speed',     String(voiceSpeed)); 
    localStorage.setItem('cfg_voice_pitch',     String(voicePitch)); 
    localStorage.setItem('cfg_difficulty',    String(userDifficulty));
    localStorage.setItem('cfg_goal',            String(dailyGoal));
  }, [language, theme, a11yAddons, inclusiveOptions, points, currentIndex, rewards, coins, unlockedThemes, dailyQuests, selectedVoiceURIs, voiceSpeed, voicePitch, dailyGoal, userDifficulty]);

  const speak = useCallback((text, slow = false) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const msg  = new SpeechSynthesisUtterance(text);
    msg.lang   = { de: 'de-DE', pl: 'pl-PL', en: 'en-US' }[language];
    msg.rate   = (slow || inclusiveOptions.extendedTime) ? voiceSpeed * 0.65 : voiceSpeed;
    msg.pitch  = voicePitch;

    const allVoices = window.speechSynthesis?.getVoices?.() || [];
    let selectedVoice = null;
    const currentVoiceURI = selectedVoiceURIs[language];

    if (currentVoiceURI && currentVoiceURI !== 'default') {
      selectedVoice = allVoices.find(v => v.voiceURI === currentVoiceURI);
    } else {
      if (language === 'pl')      selectedVoice = allVoices.find(v => v.name.includes('Zofia'));
      else if (language === 'en') selectedVoice = allVoices.find(v => v.name.includes('Emma'));
      else if (language === 'de') selectedVoice = allVoices.find(v => v.name.includes('Amala'));
    }

    if (selectedVoice) {
      msg.voice = selectedVoice;
    }
    window.speechSynthesis.speak(msg);
  }, [language, inclusiveOptions.extendedTime, selectedVoiceURIs, voiceSpeed, voicePitch]);

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
      // W trybie adaptacyjnym: główny nacisk na aktualny poziom, ale pozwalamy na 1 poziom niżej jako powtórkę
      filteredTasks = tasks.filter(task => {
        const diff = task.difficulty || 1;
        return diff === userDifficulty || diff === userDifficulty - 1;
      });
    } else {
      // Ręczna kontrola: pokaż zadania o DOKŁADNIE wybranej trudności
      filteredTasks = tasks.filter(task => (task.difficulty || 1) === userDifficulty);
    }

    // Bezpieczne fallbacki:
    // 1. Jeśli brakuje zadań na docelowym poziomie, pokaż jakiekolwiek zadania nieprzekraczające wybranej trudności
    if (filteredTasks.length === 0) {
      filteredTasks = tasks.filter(task => (task.difficulty || 1) <= userDifficulty);
    }
    // 2. Jeśli kategoria jest zupełnie pusta (np. dostępne są tylko zadania trudniejsze), zabezpiecz przed awarią i pokaż wszystkie
    if (filteredTasks.length === 0) {
      filteredTasks = tasks;
    }

    const seed = activeTab.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + (language === 'pl' ? 1 : 2) + cycle;
    return seededShuffle([...filteredTasks], seed);
  }, [activeTab, db, language, inclusiveOptions.adaptiveDifficulty, userDifficulty, cycle]);

  const safeIndex = currentIndex % (activePillarTasks.length || 1);
  const currentTask = activePillarTasks.length > 0 ? activePillarTasks[safeIndex] : null;

  const updateQuests = useCallback((pillarType) => {
    setDailyQuests(prev => {
      const newTasks = prev.tasks.map(task => {
        if (task.completed) return task;
        if (task.type === pillarType || task.type === 'Any') {
          const newCurrent = task.current + 1;
          const done = newCurrent >= task.target;
          if (done) setCoins(c => c + task.reward);
          return { ...task, current: newCurrent, completed: done };
        }
        return task;
      });
      return { ...prev, tasks: newTasks };
    });
  }, []);

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

    // Adaptacyjna trudność: po 5 sukcesach z rzędu, zwiększ poziom, jeśli nie jest na max
    if (inclusiveOptions.adaptiveDifficulty && newStreak > 0 && newStreak % 5 === 0 && userDifficulty < 4) {
      setUserDifficulty(prev => Math.min(prev + 1, 4));
    }
    setErrorCounter(0); // Zresetuj licznik błędów po sukcesie

    // Play thematic success sound (if audio rewards are enabled)
    if (inclusiveOptions.audioRewards && !inclusiveOptions.muteNotifications) {
      playThemeSound(theme);
    }

    let earnedCoins = 1;
    if (isGamified) {
      dailyQuests.tasks.forEach(task => {
        if (!task.completed && (task.type === activeTab || task.type === 'Any')) {
          if (task.current + 1 >= task.target) {
            earnedCoins += task.reward;
          }
        }
      });
    }

    updateQuests(activeTab);

    const baseSuccessMsg = Array.isArray(t.successMsg) 
      ? t.successMsg[Math.floor(Math.random() * t.successMsg.length)] 
      : t.successMsg;
      
    let msg = baseSuccessMsg;
    if (newStreak >= 3 && t.streakMsg) {
      msg = Array.isArray(t.streakMsg) 
        ? t.streakMsg[Math.floor(Math.random() * t.streakMsg.length)].replace(/{count}/g, newStreak)
        : (typeof t.streakMsg === 'function' ? t.streakMsg(newStreak) : t.streakMsg);
    }
    setFeedback({ type: 'success', msg });

    let voiceSuccessMsg = Array.isArray(t.voice?.success)
      ? t.voice.success[Math.floor(Math.random() * t.voice.success.length)]
      : (t.voice?.success || '');
      
    if (newStreak >= 3 && t.voice?.streak) {
      voiceSuccessMsg = Array.isArray(t.voice.streak)
        ? t.voice.streak[Math.floor(Math.random() * t.voice.streak.length)].replace(/{count}/g, newStreak)
        : t.voice.streak;
    }
    if (!inclusiveOptions.muteNotifications) {
      speak(voiceSuccessMsg);
    }

    const newPoints = points + 1;
    setPoints(newPoints);

    if (isGamified) {
      setCoins(prev => prev + 1);

      // Update daily progress for the calendar
      const todayStr = new Date().toDateString();
      setDailyProgress(prev => {
        const todayPoints = prev[todayStr]?.points || 0;
        return { ...prev, [todayStr]: { points: todayPoints + 1 } };
      });


      setEarnedCoinsAnim(earnedCoins);
      setTimeout(() => setEarnedCoinsAnim(null), 1500);

      const pool = t.rewardItems?.[theme] || t.rewardItems?.Natur || ['⭐'];
      setRewards(prev => [...prev, pool[Math.floor(Math.random() * pool.length)]]);
      if (newPoints % POINTS_PER_LEVEL === 0) {
        // Wyzwalacz NASA-TLX: ustawiamy ankietę jako oczekującą co 10 punktów
        if (newPoints > 0 && newPoints % 10 === 0) {
          setPendingFeedback(true);
        }
        setTimeout(() => setShowSuccess(true), 1000);
      } else {
        setTimeout(goNext, inclusiveOptions.extendedTime ? 3000 : 1500);
      }
    } else {
      if (newPoints > 0 && newPoints % 10 === 0) {
        setTimeout(() => setShowFeedback(true), inclusiveOptions.extendedTime ? 3000 : 1500);
      } else {
        setTimeout(goNext, inclusiveOptions.extendedTime ? 3000 : 1500);
      }
    }

    // PWA Asynchronous Log: Bezpiecznie zapisujemy zdarzenie w IndexedDB poza głównym wątkiem Reacta
    saveLog('exercise_history', { 
      date: new Date().toISOString(), 
      type: activeTab, 
      correct: true 
    }).catch(console.error);
  }, [
    currentStreak, isGamified, dailyQuests, activeTab, updateQuests, t, speak,
    points, theme, setRewards, inclusiveOptions, setDailyProgress, dailyGoal, userDifficulty, goNext
  ]);

  const handleError = useCallback(() => {
    // USUNIĘTO: setCurrentStreak(0); - Kary za błędy drastycznie obniżają motywację u dorosłych. Ciągłość pozostaje nienaruszona.
    // Point 4 Log - Add timestamp for calculating Error Velocity
    setErrorTimestamps(prev => [...prev, Date.now()]);

    // Adaptacyjna trudność: po 2 błędach z rzędu, zmniejsz poziom, jeśli nie jest na min
    const newErrorCounter = errorCounter + 1;
    setErrorCounter(newErrorCounter);
    if (inclusiveOptions.adaptiveDifficulty && newErrorCounter >= 2 && userDifficulty > 1) {
      setUserDifficulty(prev => Math.max(prev - 1, 1));
      setErrorCounter(0); // Zresetuj licznik po zmianie poziomu
    }
    const errorMsg = Array.isArray(t.voice?.error) 
      ? t.voice.error[Math.floor(Math.random() * t.voice.error.length)] 
      // Punkt 3 specyfikacji: Zamiana surowego "✗" na przyjazny tekst wspierający (Positive Affect)
      : (t.voice?.error || "Let's look closer at this one together.");
      
    setFeedback({ type: 'error', msg: errorMsg });
    if (!inclusiveOptions.muteNotifications) {
      speak(errorMsg);
    }

    // PWA Asynchronous Log: Zapis błędu do budowy algorytmów analitycznych
    saveLog('exercise_history', { 
      date: new Date().toISOString(), 
      type: activeTab, 
      correct: false 
    }).catch(console.error);
  }, [t, speak, errorCounter, inclusiveOptions.adaptiveDifficulty, userDifficulty]);

  // Logger analityczny (Point 9) - zapisuje dane telemetryczne z ankiety
  const handleFeedbackSubmit = useCallback(async (surveyData) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      pointsAtTime: points,
      metrics: surveyData
    };
    
    try {
      await saveLog('ux_logs', logEntry);
    } catch (error) {
      console.error('Failed to save UX logs to IndexedDB:', error);
    }
    
    setShowFeedback(false);
    goNext();
  }, [points, goNext]);

  // Point 4 Handlers
  const handleTakeBreak = useCallback(() => {
    setCoins(c => c + 2); // Nagroda za proaktywny odpoczynek!
    setSessionStartTime(Date.now());
    setErrorTimestamps([]);
    setLoadLevel('green');
    setShowBreakModal(false);
    setBreakDismissed(false);
    setFeedback(null);
    setActiveTab('Garden');
  }, []);
  const handleDismissBreak = useCallback(() => {
    setShowBreakModal(false);
    setBreakDismissed(true);
  }, []);

  // --- Swipe-to-navigate logic ---
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };
  const onTouchMove = (e) => { touchEnd.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }; };
  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distanceX = touchStart.current.x - touchEnd.current.x;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(touchStart.current.y - touchEnd.current.y);
    
    if (isHorizontalSwipe && distanceX > 50) goNext();       // Swipe left -> Next task
    if (isHorizontalSwipe && distanceX < -50) goPrev();      // Swipe right -> Prev task
  };

  // --- Navigation Handlers (Zoptymalizowane dla SidebarNav) ---
  const handleTabChange = useCallback((pillar) => {
    setActiveTab(pillar);
    setLastPillar(pillar);
    setCurrentIndex(0);
    setCycle(0);
    setFeedback(null);
    setCurrentStreak(0);
  }, []);

  const handleGardenClick = useCallback(() => {
    setActiveTab('Garden');
    setFeedback(null);
  }, []);

  const renderCurrentExercise = () => {
    if (isTransitioning) {
      return <SkeletonLoader isHighContrast={isHighContrast} />;
    }

    const commonProps = {
      themeStyles, speak, t, language,
      onSuccess: handleSuccess,
      onError: handleError,
      bigTargets,
      extendedTime: !!inclusiveOptions.extendedTime,
      noFlash,
      bionicReading: !!inclusiveOptions.bionicReading,
      zenMode:       !!inclusiveOptions.zenMode,
      isHighContrast,
    };
    return <ExerciseContainer
      key={`${activeTab}-${currentIndex}`}
      currentTask={currentTask}
      {...commonProps} />;
  };

  // --- Render Intro Screen ---
  if (showIntro) {
    return <IntroScreen 
      language={language} 
      setLanguage={setLanguage} 
      onStart={() => setShowIntro(false)} 
          isGamified={isGamified}
          setIsGamified={setIsGamified}
          a11yAddons={a11yAddons}
          setA11yAddons={setA11yAddons}
          inclusiveOptions={inclusiveOptions}
          setInclusiveOptions={setInclusiveOptions}
      noFlash={noFlash}
      isHighContrast={isHighContrast}
      bigTargets={bigTargets}
      selectedVoiceURIs={selectedVoiceURIs}
      setSelectedVoiceURIs={setSelectedVoiceURIs}
          voiceSpeed={voiceSpeed}
          setVoiceSpeed={setVoiceSpeed}
          voicePitch={voicePitch}
          setVoicePitch={setVoicePitch}
    />;
  }

  // --- Render Settings Page ---
  if (settingsOpen) {
    return <SettingsModal 
      open={true}
      onClose={() => setSettingsOpen(false)} 
      language={language}
      setLanguage={setLanguage}
      isGamified={isGamified}
      setIsGamified={setIsGamified}
      a11yAddons={a11yAddons}
      setA11yAddons={setA11yAddons}
      inclusiveOptions={inclusiveOptions}
      setInclusiveOptions={setInclusiveOptions}
      noFlash={noFlash}
      isHighContrast={isHighContrast}
      bigTargets={bigTargets}
      selectedVoiceURIs={selectedVoiceURIs}
      setSelectedVoiceURIs={setSelectedVoiceURIs}
      voiceSpeed={voiceSpeed}
      setVoiceSpeed={setVoiceSpeed}
      voicePitch={voicePitch}
      setVoicePitch={setVoicePitch}
    />;
  }

  // --- Render Main Application Layout ---
  return (
    <div className={`flex h-screen h-dvh w-full overflow-hidden ${isHighContrast ? 'bg-black text-white' : `${themeStyles.bg} text-[#2D3732]`}`}>

      {/* Navigation Sidebar */}
      <SidebarNav
        pillars={PILLARS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onGardenClick={handleGardenClick}
        dailyQuests={dailyQuests}
        language={language}
        isGamified={isGamified}
        theme={theme}
        themeStyles={themeStyles}
        isHighContrast={isHighContrast}
        bigTargets={bigTargets}
        hideNavLabel={hideNavLabel}
        setSettingsOpen={setSettingsOpen}
        t={t}
        s={s}
        speak={speak}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen h-dvh overflow-hidden">
        <main 
          className={`flex-1 flex flex-col min-h-0 overflow-y-auto px-3 md:px-6 py-4 mx-auto w-full max-w-xl ${isHighContrast ? 'text-white' : 'text-[#2D3732]'}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {activeTab === 'Garden' ? (
            <div className="flex-1 w-full h-full py-2 animate-in fade-in zoom-in duration-500">
              <VirtualGarden 
                points={points} 
                streak={currentStreak} 
                dailyQuests={dailyQuests} 
                isHighContrast={isHighContrast} 
                theme={theme} 
                themeStyles={themeStyles} 
                t={t} 
                activeCategory={lastPillar} 
                isFullScreen={true} 
                noFlash={noFlash}
                dailyProgress={dailyProgress}
                dailyGoal={dailyGoal}
                minimalistMode={!!inclusiveOptions.minimalistMode}
              />
            </div>
          ) : (
            <>
              {/* Minimal Progress Row without numeric noise */}
              <div className={`rounded-3xl px-4 py-3 mb-4 flex items-center justify-between gap-4 relative shrink-0 ${isHighContrast ? 'bg-black border border-white/30 shadow-sm' : `bg-[#FCFBF9] border ${themeStyles.border} shadow-md shadow-slate-200/40`}`}>
                {rewards.length > 0 && isGamified && !inclusiveOptions.zenMode && (
          <div className={`absolute -top-4 left-4 px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest shadow-lg border-2 z-20 flex items-center gap-1.5 ${isHighContrast ? 'bg-black border-white text-white' : `bg-[#FCFBF9] ${themeStyles.border} text-[#4A5D54]`} ${noFlash ? '' : 'animate-in zoom-in duration-300'}`}>
                    <span>{t.collectedLabel || s.collectedLabel}:</span>
                    <span className="text-xs">{rewards[rewards.length - 1]}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {isGamified && !inclusiveOptions.zenMode ? (
                    <VirtualGarden 
                      points={points} 
                      streak={currentStreak} 
                      dailyQuests={dailyQuests} 
                      isHighContrast={isHighContrast} 
                      theme={theme} 
                      themeStyles={themeStyles} 
                      t={t} 
                      activeCategory={lastPillar} 
                      isFullScreen={false} 
                      noFlash={noFlash} 
                      minimalistMode={!!inclusiveOptions.minimalistMode}
                    />
                  ) : (
                    <>
                      <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-black ${isHighContrast ? 'bg-white text-black' : `${themeStyles.button} ${themeStyles.buttonText}`}`}>
                        {Math.floor(points / POINTS_PER_LEVEL) + 1}
                      </div>
                      <ProgressPill points={points % POINTS_PER_LEVEL} max={POINTS_PER_LEVEL} theme={theme} isGamified={isGamified} t={t} isHighContrast={isHighContrast} />
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {!inclusiveOptions.zenMode && (
                    <CognitiveEnergyIndicator 
                      loadLevel={loadLevel} showModal={showBreakModal}
                      onTakeBreak={handleTakeBreak} onDismiss={handleDismissBreak}
                      t={t} themeStyles={themeStyles} isHighContrast={isHighContrast} noFlash={noFlash}
                      bigTargets={bigTargets}
                    />
                  )}
                  <div className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>
                    {!isGamified && `${safeIndex + 1} / ${activePillarTasks.length}`}
                  </div>
                </div>
              </div>

              {/* Active Exercise Card */}
              <section 
                ref={cardRef}
                className={`rounded-4xl flex flex-col items-center relative flex-1 min-h-0 overflow-y-auto px-4 py-6 ${isHighContrast ? 'bg-black border border-white/30 shadow-lg shadow-white/10' : `bg-[#FCFBF9] border ${themeStyles.border} shadow-xl shadow-slate-200/30`}`}
                aria-label={s.exerciseAria}
              >
                {/* Reading Ruler Overlay (Restricted to Card) */}
                {hasRuler && rulerPos.visible && (
                  <div 
                    className={`absolute left-0 right-0 h-16 pointer-events-none z-[100] transition-transform duration-75 ${isHighContrast ? 'bg-white/10 border-y border-white/30' : 'bg-indigo-500/10 border-y border-indigo-500/20 backdrop-invert-[0.02]'}`}
                    style={{ top: rulerPos.y - 32 }}
                    aria-hidden="true"
                  />
                )}
                {feedback && (
                  <div className={`absolute top-4 z-20 ${noFlash ? '' : 'animate-in slide-in-from-top duration-300'}`}>
                <span className={`px-6 py-3 rounded-2xl text-sm font-medium shadow-sm border ${isHighContrast ? 'bg-black border-white text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                          role="status" aria-live="polite">
                      <BionicText text={feedback.msg} enabled={!!inclusiveOptions.bionicReading} />
                    </span>
                  </div>
                )}
                <div className="w-full h-full flex flex-col items-center justify-center flex-1 min-h-0">
                  {renderCurrentExercise()}
                </div>
              </section>

              {feedback?.type === 'success' ? (
                <div className="mt-4 flex justify-center animate-in zoom-in duration-300 shrink-0 pb-2">
                  <button onClick={goNext}
                        className={`${bigTargets ? 'px-14 py-6 text-lg' : 'px-12 py-4 text-sm'} rounded-full font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all ${noFlash ? '' : 'animate-bounce'} break-words ${isHighContrast ? 'bg-white text-black hover:bg-slate-200' : `${themeStyles.button} ${themeStyles.buttonText} opacity-90 hover:opacity-100`}`}>
                    {t.next || s.next || 'Dalej'}
                  </button>
                </div>
              ) : (
                currentTask && !inclusiveOptions.zenMode && (
                  <div className="mt-3 flex justify-center shrink-0 pb-2">
                    <button onClick={goNext}
                      className={`${bigTargets ? 'px-10 py-4 text-xs' : 'px-8 py-2 text-[10px]'} bg-transparent border-2 rounded-full font-black uppercase tracking-widest transition-colors ${isHighContrast ? 'border-white/50 text-white/80 hover:bg-white/10' : 'border-slate-200 text-slate-400 hover:bg-slate-100'}`}>
                      {t.skip || s.skip || 'Pomiń'}
                    </button>
                  </div>
                )
              )}
            </>
          )}
        </main>
      </div>

      {/* Level-Up Success Overlay */}
      {showSuccess && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 text-center ${isHighContrast ? 'bg-black/90 backdrop-blur-sm' : 'bg-slate-50/90 backdrop-blur-md'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-up-title"
        >
          <div className={`flex flex-col items-center rounded-4xl p-10 shadow-lg max-w-sm w-full border ${noFlash ? '' : 'animate-in fade-in zoom-in duration-700'} ${isHighContrast ? 'bg-black border-white' : 'bg-white border-slate-200'}`}>
            <div className="text-5xl mb-4 opacity-80 drop-shadow-md" aria-hidden="true">🧠</div>
            <h2 id="level-up-title" className={`text-2xl font-bold mb-4 ${isHighContrast ? 'text-white' : 'text-slate-700'}`}>
              {t.gardenBlooming || "Twój ogród rośnie!"}
            </h2>
            <p className={`text-sm mb-8 leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
              {t.srVisitor || "Kolejny cel został pomyślnie zrealizowany."}
            </p>
            <button onClick={() => { setShowSuccess(false); if (pendingFeedback) { setShowFeedback(true); setPendingFeedback(false); } else { goNext(); } }}
              className={`w-full ${bigTargets ? 'py-7 text-xl' : 'py-4 text-lg'} rounded-3xl font-bold active:scale-95 transition-all ${isHighContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {t.next || s.next}
            </button>
          </div>
        </div>
      )}

      {/* Point 9: UX Metrics Micro-survey (NASA-TLX) */}
      <FeedbackCollector 
        open={showFeedback}
        onSubmit={handleFeedbackSubmit}
        onSkip={() => { setShowFeedback(false); goNext(); }}
        t={t}
        themeStyles={themeStyles}
        isHighContrast={isHighContrast}
        noFlash={noFlash}
        bigTargets={bigTargets}
      />

      {/* Floating Global TTS Controls */}
      <TTSController
        voiceSpeed={voiceSpeed} setVoiceSpeed={setVoiceSpeed}
        voicePitch={voicePitch} setVoicePitch={setVoicePitch}
        selectedVoiceURIs={selectedVoiceURIs} setSelectedVoiceURIs={setSelectedVoiceURIs}
        language={language} isHighContrast={isHighContrast} themeStyles={themeStyles} t={t}
      />

      {/* Delikatne okienko (Toast) Modułu Afirmatywnego */}
      {affirmation && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-sm pointer-events-none">
          <div className={`p-4 rounded-2xl shadow-lg border ${noFlash ? '' : 'animate-in slide-in-from-bottom-8 fade-in duration-700'} ${isHighContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-100 text-slate-700'}`}>
            <p className="text-sm font-medium text-center leading-relaxed">
              {affirmation}
            </p>
          </div>
        </div>
      )}

      {/* Non-intrusive PWA Update Prompt */}
      {needRefresh && (
        <div className={`fixed bottom-20 sm:bottom-24 right-4 z-50 p-5 rounded-3xl shadow-2xl max-w-xs animate-in slide-in-from-right duration-500 border-2 ${isHighContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-100 text-slate-800'}`} role="alert" aria-live="assertive">
          <h4 className="font-black text-sm mb-1 flex items-center gap-2"><span aria-hidden="true">🌱</span> Nowa wersja</h4>
          <p className={`text-xs font-medium mb-4 leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
            Dostępna jest nowa treść. Zaktualizuj aplikację, aby pobrać najnowsze zmiany do trybu offline.
          </p>
          <div className="flex gap-2">
            <button onClick={() => updateServiceWorker(true)} className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-white shadow-md active:scale-95 transition-all ${themeStyles.button}`}>
              Aktualizuj
            </button>
            <button onClick={() => setNeedRefresh(false)} className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${isHighContrast ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              Później
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppConfigProvider>
      <GamificationProvider>
        <AppContent />
      </GamificationProvider>
    </AppConfigProvider>
  );
}