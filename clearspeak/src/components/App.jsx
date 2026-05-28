/* 
 * App.jsx (Version 4)
 * Main application component responsible for state management, theming, and exercise rendering.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import store from './store.js';

// Initialize global i18next engine (new architecture)
import '../hooks/config.ts';

import { useTranslation }  from '../i18n/i18n.js';

import IntroScreen        from './IntroScreen.jsx';
import SettingsModal      from './SettingsModal.jsx';
import { ProgressPill }   from './ProgressPill.jsx';
import VirtualGarden      from './VirtualGarden.jsx';
import BionicText         from './common/BionicText.jsx';
import SkeletonLoader     from './common/SkeletonLoader.jsx';
import SidebarNav         from './SidebarNav.jsx';
import { FeedbackCollector } from './FeedbackCollector.jsx';
import { CognitiveEnergyIndicator } from './CognitiveEnergyIndicator.jsx';
import { saveLog } from '../utils/indexedDB.js';
import { useIndexedDB } from '../hooks/useIndexedDB.js';
import { useCognitiveLoad } from '../hooks/useCognitiveLoad.js';
import { useAffirmativeNotifications } from '../hooks/useAffirmativeNotifications.js';
import { useGlobalTTS } from '../hooks/useGlobalTTS.js';
import { useExerciseSession } from '../hooks/useExerciseSession.js';
import { useGamificationState } from '../hooks/useGamificationState.js';
import { useVocabularyLoader } from '../hooks/useVocabularyLoader.js';
import { useReadingRuler } from '../hooks/useReadingRuler.js';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation.js';

import ExerciseContainer from './ExerciseContainer.jsx';
import { GamificationProvider, useGamification } from './GamificationContext.jsx';
import { UserSettingsProvider, useUserSettingsContext } from './UserSettingsContext.jsx';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { SurveyComponent } from './SurveyComponent';

// --- Global Constants & Configurations ---
const POINTS_PER_LEVEL = 5;
const PILLARS = ['Literacy', 'Visual', 'Cognitive'];

// Horticultural Therapy Framework - soft and soothing color palettes, elimination of pure white
const THEMES = {
  Natur: { accent: 'text-[#4A5D54]', bg: 'bg-[#F4F1EA]', button: 'bg-[#8A9A86]', buttonText: 'text-[#F4F1EA]', border: 'border-[#D0D6CE]', hex: '#8A9A86', price: 0 },
  Musik: { accent: 'text-[#6B5B7B]', bg: 'bg-[#F3F0F5]', button: 'bg-[#8F7D9E]', buttonText: 'text-[#F3F0F5]', border: 'border-[#D1C8D6]', hex: '#8F7D9E', price: 3 },
  Kunst: { accent: 'text-[#8A6A4B]', bg: 'bg-[#F7F4F0]', button: 'bg-[#B08E6D]', buttonText: 'text-[#F7F4F0]', border: 'border-[#DED4CA]', hex: '#B08E6D', price: 5 },
  Space: { accent: 'text-[#4B5E6B]', bg: 'bg-[#F0F3F5]', button: 'bg-[#6D8394]', buttonText: 'text-[#F0F3F5]', border: 'border-[#CAD4DE]', hex: '#6D8394', price: 8 },
  Ocean: { accent: 'text-[#437A7A]', bg: 'bg-[#EFF5F5]', button: 'bg-[#67A3A3]', buttonText: 'text-[#EFF5F5]', border: 'border-[#C4DBDB]', hex: '#67A3A3', price: 10 },
};

// --- Main App Component ---
function AppContent() {
  const { isGamified, setIsGamified } = useGamification();
  
  // Unified settings management using Context API
  const { settings, updateSetting } = useUserSettingsContext();
  const { language, theme, dailyGoal, userDifficulty } = settings;

  // Vocabulary Loader Module
  const db = useVocabularyLoader(language);

  // Synchronize global language state (PWA) with i18next engine
  useEffect(() => {
    import('i18next').then((i18next) => {
      if (i18next.default.language !== language) {
        i18next.default.changeLanguage(language);
      }
    });
  }, [language]);

  // Global TTS (Voice) Module
  const { 
    speak, 
    selectedVoiceURIs, setSelectedVoiceURIs, 
    voiceSpeed, setVoiceSpeed, 
    voicePitch, setVoicePitch 
  } = useGlobalTTS(language, settings.extendedTime);

  const [activeTab,    setActiveTab]    = useState('Literacy');
  const [lastPillar,   setLastPillar]   = useState('Literacy'); // Remembers the pillar for garden rendering
  const [showIntro,    setShowIntro]    = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [earnedCoinsAnim, setEarnedCoinsAnim] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState(false);

  // Gamification Module (Progress state, Coins, Shop)
  const {
    points, setPoints, coins, setCoins,
    rewards, setRewards,
    unlockedThemes, setUnlockedThemes,
    dailyQuests, setDailyQuests, updateQuests
  } = useGamificationState();

  const { 
    loadLevel,
    showBreakModal,
    setShowBreakModal,
    setSessionStartTime, setErrorTimestamps, 
    setLoadLevel 
  } = useCognitiveLoad(activeTab, settings.zenMode);

  // State for PWA Offline Support & Updates
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ onRegisterError: (err) => console.error('SW Error:', err) });

  const [dailyProgress, setDailyProgress] = useIndexedDB('daily_progress', 'date', 'cfg_daily_progress');

  // Affirmative Notifications Module
  const { affirmation, setAffirmation } = useAffirmativeNotifications(points, language);

  useEffect(() => {
    if (!isGamified && activeTab === 'Garden') {
      setActiveTab('Literacy');
    }
  }, [isGamified, activeTab]);

  const t = useTranslation(language);
  const s = t; // Alias 's' retained for compatibility with legacy component props (e.g. SidebarNav)
  
  const themeStyles = THEMES[theme]         || THEMES.Natur;
  const noFlash        = settings.noFlash || settings.motion;
  const bigTargets     = settings.bigTargets || settings.motorik;
  const hideNavLabel   = settings.vision;
  const isHighContrast = settings.contrast;
  const isColorblind   = settings.color;
  const hasRuler       = settings.ruler;

  // Reading Ruler logic
  const { cardRef, rulerPos } = useReadingRuler(hasRuler);

  useEffect(() => {
    const root = document.documentElement;
    
    // Colorblind-safe palette (Protanopia and Deuteranopia friendly)
    const safeAccent = isColorblind ? '#0072B2' : (THEMES[theme]?.hex || '#10b981');
    root.style.setProperty('--theme-accent', safeAccent);
    root.style.setProperty('--color-success', isColorblind ? '#0072B2' : '#10b981'); // Blue instead of Green
    root.style.setProperty('--color-error', isColorblind ? '#D55E00' : '#ef4444');   // Vermilion instead of Red
    root.style.setProperty('--color-warning', isColorblind ? '#F0E442' : '#f59e0b'); // Yellow instead of Amber
    
    // Extracts HEX color from classes like bg-[#F4F1EA] and sets it as a variable for gradients
    const bgHex = THEMES[theme]?.bg?.match(/\[(.*?)\]/)?.[1] || '#FDFBF7';
    root.style.setProperty('--theme-bg', isHighContrast ? '#000000' : bgHex);
    
    root.lang = language;
  }, [theme, isHighContrast, language]);

  // Training Session Module
  const {
    currentIndex, setCurrentIndex,
    setCycle,
    currentStreak, setCurrentStreak,
    feedback, setFeedback,
    isTransitioning,
    activePillarTasks, currentTask, safeIndex,
    goNext, goPrev, handleSuccess, handleError
  } = useExerciseSession({
    db, activeTab, language,
    userDifficulty, setUserDifficulty: (val) => updateSetting('userDifficulty', val),
    inclusiveOptions: settings, t, speak, theme, isGamified,
    points, setPoints, setCoins, setRewards,
    dailyQuests, updateQuests, setDailyProgress,
    setPendingFeedback, setShowSuccess, setShowFeedback, setEarnedCoinsAnim,
    setErrorTimestamps
  });

  // Analytics Logger - securely stores UX survey telemetry data into IndexedDB
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

  // --- Navigation Handlers ---
  const handleTabChange = useCallback((pillar) => {
    setActiveTab(pillar);
    setLastPillar(pillar);
    setCurrentIndex(0);
    setCycle(0);
    setFeedback(null);
    setCurrentStreak(0);
  }, [setCurrentIndex, setCycle, setFeedback, setCurrentStreak]);

  const handleGardenClick = useCallback(() => {
    setActiveTab('Garden');
    setFeedback(null);
  }, []);

  // --- Gesture Navigation (Swipe to switch tabs) ---
  const handleSwipeTab = useCallback((direction) => {
    const availableTabs = isGamified ? [...PILLARS, 'Garden'] : PILLARS;
    const currentIdx = availableTabs.indexOf(activeTab);
    if (currentIdx === -1) return;

    let newIdx = currentIdx;
    if (direction === 'left' && currentIdx < availableTabs.length - 1) {
      newIdx++;
    } else if (direction === 'right' && currentIdx > 0) {
      newIdx--;
    }

    if (newIdx !== currentIdx) {
      if (typeof navigator !== 'undefined' && navigator.vibrate && !settings.zenMode) navigator.vibrate(15);
      const nextTab = availableTabs[newIdx];
      if (nextTab === 'Garden') {
        handleGardenClick();
      } else {
        handleTabChange(nextTab);
      }
    }
  }, [activeTab, isGamified, handleTabChange, handleGardenClick]);

  const swipeHandlers = useSwipeNavigation({ 
    onSwipeLeft: () => handleSwipeTab('left'), 
    onSwipeRight: () => handleSwipeTab('right') 
  });

  // --- Keyboard Navigation (Ctrl/Cmd/Alt + 1-4) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if focus is in an input field or textarea to allow normal typing
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Direct Task Navigation (No modifiers required)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); goNext(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); return; }
      }

      // Require a modifier key (Ctrl, Cmd, or Alt) to prevent accidental tab switching triggers
      if (!(e.ctrlKey || e.metaKey || e.altKey)) return;

      const availableTabs = isGamified ? [...PILLARS, 'Garden'] : PILLARS;
      let targetTab = null;

      switch (e.key) {
        case '1': if (availableTabs.length >= 1) targetTab = availableTabs[0]; break;
        case '2': if (availableTabs.length >= 2) targetTab = availableTabs[1]; break;
        case '3': if (availableTabs.length >= 3) targetTab = availableTabs[2]; break;
        case '4': if (availableTabs.length >= 4) targetTab = availableTabs[3]; break;
        case ',':
          e.preventDefault();
          if (typeof navigator !== 'undefined' && navigator.vibrate && !settings.zenMode) navigator.vibrate(15);
          setSettingsOpen(true);
          return;
        default: return; // Not a relevant key
      }

      if (targetTab) {
        e.preventDefault(); // Prevent default browser tab switching
        if (typeof navigator !== 'undefined' && navigator.vibrate && !settings.zenMode) navigator.vibrate(15);
        
        targetTab === 'Garden' ? handleGardenClick() : handleTabChange(targetTab);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGamified, handleTabChange, handleGardenClick, goNext, goPrev, settings.zenMode, setSettingsOpen]);

  const renderCurrentExercise = () => {
    if (isTransitioning) {
      return <SkeletonLoader isHighContrast={isHighContrast} />;
    }

    // Voice Assistant Mode Logic
    // Voice icons (TTS & Mic) are only active if the Voice Assistant is enabled in settings,
    // EXCEPT for these 4 exercises which always require voice functionality:
    const isVoiceException = !!(
      currentTask?.dictation || // Zapis: Dyktanda
      currentTask?.lcwc ||      // Zapis: Pamięć (Spójrz na słowo...)
      currentTask?.phonetic ||  // Słowo: Dźwięki (Phonem)
      currentTask?.scrambled || // Zapis: Synteza (Scrabble)
      currentTask?.readAloud    // Czytanie: Na głos
    );
    
    const voiceAssistantActive = !!settings.voiceAssistant || isVoiceException;

    const commonProps = {
      themeStyles, speak, t, language,
      onSuccess: handleSuccess,
      onError: handleError,
      bigTargets,
      extendedTime: !!settings.extendedTime,
      noFlash,
      bionicReading: !!settings.bionicReading,
      zenMode:       !!settings.zenMode,
      isHighContrast,
      voiceAssistant: voiceAssistantActive,
    };
    
    return <ExerciseContainer currentTask={currentTask} {...commonProps} />;
  };

  // --- Render Intro Screen ---
  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} speak={speak} />;
  }

  // --- Render Settings Page ---
  if (settingsOpen) {
    return <SettingsModal 
      open={true}
      onClose={() => setSettingsOpen(false)} 
      selectedVoiceURIs={selectedVoiceURIs}
      setSelectedVoiceURIs={setSelectedVoiceURIs}
      voiceSpeed={voiceSpeed}
      setVoiceSpeed={setVoiceSpeed}
      voicePitch={voicePitch}
      setVoicePitch={setVoicePitch}
      coins={coins}
      setCoins={setCoins}
      unlockedThemes={unlockedThemes}
      setUnlockedThemes={setUnlockedThemes}
    />;
  }

  // --- Render Main Application Layout ---
  return (
    <div className={`flex flex-col md:flex-row h-screen h-dvh w-full overflow-hidden ${isHighContrast ? 'bg-black text-white' : `${themeStyles.bg} text-[#2D3732]`}`}>

        {/* Navigation Sidebar (Desktop) */}
        <div className="hidden md:flex h-full shrink-0 z-40">
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
            noFlash={noFlash}
          />
        </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* Subtle gradient at the top of the screen (masks scrolled text) */}
        <div 
          className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10" 
          style={{ background: 'linear-gradient(to bottom, var(--theme-bg) 0%, transparent)' }} 
          aria-hidden="true" 
        />

        <main 
          className={`flex-1 flex flex-col min-h-0 overflow-y-auto overscroll-none no-scrollbar px-3 md:px-8 pt-4 md:pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))] mx-auto w-full max-w-5xl touch-pan-y ${isHighContrast ? 'text-white' : 'text-[#2D3732]'}`}
          {...swipeHandlers}
        >
          {activeTab === 'Garden' ? (
            <div id="garden-container" className={`flex-1 w-full h-full py-2 ${noFlash ? '' : 'animate-in fade-in slide-in-from-bottom-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}>
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
                minimalistMode={!!settings.minimalistMode}
              />
            </div>
          ) : (
            <>
              {/* Minimal Progress Row without numeric noise */}
              {!settings.zenMode && (
                <div className={`rounded-3xl px-4 py-2.5 mb-3 md:mb-4 flex items-center justify-between gap-4 relative shrink-0 ${isHighContrast ? 'bg-black border border-white/30 shadow-sm md:shadow-none' : `bg-[#FCFBF9] border ${themeStyles.border} shadow-md md:shadow-sm shadow-slate-200/40`}`}>
                  {rewards.length > 0 && isGamified && (
                    <div className={`absolute -top-4 left-4 px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest shadow-lg border-2 z-20 flex items-center gap-1.5 ${isHighContrast ? 'bg-black border-white text-white' : `bg-[#FCFBF9] ${themeStyles.border} text-[#4A5D54]`} ${noFlash ? '' : 'animate-in zoom-in duration-300'}`}>
                      <span>{t.collectedLabel || s.collectedLabel}:</span>
                      <span className="text-xs">{rewards[rewards.length - 1]}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isGamified ? (
                      <ProgressPill points={points % POINTS_PER_LEVEL} max={POINTS_PER_LEVEL} theme={theme} isGamified={true} t={t} isHighContrast={isHighContrast} />
                    ) : (
                      <>
                        <div className={`scale-size-10 shrink-0 rounded-full flex items-center justify-center text-sm font-black ${isHighContrast ? 'bg-white text-black' : `${themeStyles.button} ${themeStyles.buttonText}`}`}>
                          {Math.floor(points / POINTS_PER_LEVEL) + 1}
                        </div>
                        <ProgressPill points={points % POINTS_PER_LEVEL} max={POINTS_PER_LEVEL} theme={theme} isGamified={false} t={t} isHighContrast={isHighContrast} />
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                  <CognitiveEnergyIndicator 
                    loadLevel={loadLevel || 'green'}
                    showModal={showBreakModal}
                    onTakeBreak={() => {
                      if (typeof setShowBreakModal === 'function') setShowBreakModal(false);
                      handleGardenClick();
                    }}
                    onDismiss={() => {
                      if (typeof setShowBreakModal === 'function') setShowBreakModal(false);
                    }}
                  t={t}
                    themeStyles={themeStyles}
                    isHighContrast={isHighContrast}
                    noFlash={noFlash}
                    bigTargets={bigTargets}
                  />
                    <div className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>
                      {!isGamified && `${safeIndex + 1} / ${activePillarTasks.length}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Exercise Card */}
              <section 
                ref={cardRef}
                className={`rounded-4xl flex flex-col items-center relative w-full flex-1 px-4 py-4 sm:px-8 sm:py-6 md:py-4 md:px-12 ${isHighContrast ? 'bg-black border border-white/30 shadow-lg md:shadow-sm shadow-white/10' : `bg-[#FCFBF9] border ${themeStyles.border} shadow-xl md:shadow-md shadow-slate-200/30`}`}
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
                  <BionicText text={feedback.msg} enabled={!!settings.bionicReading} />
                    </span>
                  </div>
                )}
                <div 
                  key={`exercise-wrapper-${activeTab}-${currentIndex}`}
                  className={`w-full h-full flex flex-col items-center justify-center flex-1 min-h-0 ${noFlash ? '' : 'animate-in fade-in slide-in-from-right-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}
                >
                  {renderCurrentExercise()}
                </div>
              </section>

              {feedback?.type === 'success' ? (
                <div className="mt-3 md:mt-4 flex flex-col items-center justify-center animate-in zoom-in duration-300 shrink-0 pb-1 md:pb-2">
                  <button onClick={goNext}
                        className={`${bigTargets ? 'px-14 py-5 md:py-6 text-lg' : 'px-12 py-3.5 md:py-4 text-sm'} rounded-full font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all ${noFlash ? '' : 'animate-bounce'} break-words ${isHighContrast ? 'bg-white text-black hover:bg-slate-200' : `${themeStyles.button} ${themeStyles.buttonText} opacity-90 hover:opacity-100`}`}>
                    {t.next || 'Next'}
                  </button>
                  <p className="hidden md:block mt-3 text-[10px] font-bold text-slate-400 opacity-60">
                    💡 {t.pressKey || 'Press'} <kbd className="font-mono bg-slate-200/50 px-1.5 py-0.5 rounded text-slate-500">Enter</kbd> {t.or || 'or'} <kbd className="font-mono bg-slate-200/50 px-1.5 py-0.5 rounded text-slate-500">→</kbd> {t.toContinue || 'to continue'}
                  </p>
                </div>
              ) : (
            currentTask && !settings.zenMode && (
                  <div className="mt-2 md:mt-3 flex flex-col items-center justify-center shrink-0 pb-1 md:pb-2">
                    <button onClick={goNext}
                      className={`${bigTargets ? 'px-10 py-4 text-xs' : 'px-8 py-2 text-[10px]'} bg-transparent border-2 rounded-full font-black uppercase tracking-widest transition-colors ${isHighContrast ? 'border-white/50 text-white/80 hover:bg-white/10' : 'border-slate-200 text-slate-400 hover:bg-slate-100'}`}>
                      {t.skip || 'Skip'}
                    </button>
                    <p className="hidden md:block mt-3 text-[10px] font-bold text-slate-400 opacity-60">
                      💡 {t.pressKey || 'Press'} <kbd className="font-mono bg-slate-200/50 px-1.5 py-0.5 rounded text-slate-500">→</kbd> {t.toSkip || 'to skip'}
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </main>
        
        {/* Subtle fade-out gradient at the bottom, indicating scrollable content */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10 hidden md:block" 
          style={{ background: 'linear-gradient(to top, var(--theme-bg) 5%, transparent)' }} 
          aria-hidden="true" 
        />

        {/* Mobile Bottom Navigation */}
        <nav 
          className={`md:hidden shrink-0 flex items-center justify-around px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 z-40 transition-colors shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t ${isHighContrast ? 'bg-black border-white/20' : 'bg-white border-slate-100'}`} 
          aria-label={t.navAria || 'Main Navigation'}
        >
          {PILLARS.map(pillar => {
            const isActive = activeTab === pillar;
            const quest = dailyQuests.tasks.find(tsk => tsk.type === pillar);
            const label = t.pillars?.[pillar] || pillar;
            const icon = { Literacy: '📖', Visual: '👁️', Cognitive: '🧩' }[pillar];
            return (
              <button 
                key={pillar}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.vibrate && !settings.zenMode) navigator.vibrate(15);
                  handleTabChange(pillar);
                }}
                className={`relative flex flex-col items-center justify-center flex-1 min-w-0 p-2 rounded-2xl transition-all duration-300 active:scale-95 ${isActive ? (isHighContrast ? 'bg-white/20 text-white font-black shadow-sm' : `bg-slate-50 ${themeStyles.accent} font-black shadow-sm ring-1 ring-slate-900/5`) : (isHighContrast ? 'text-white/50 hover:text-white/80' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50')}`}
                aria-pressed={isActive}
                aria-label={label}
              >
                <div className={`text-2xl mb-1 ${isActive && !noFlash ? 'animate-bounce' : ''} ${isActive && isHighContrast ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} aria-hidden="true">
                  {icon}
                </div>
                {!hideNavLabel && (
                  <span className="text-[10px] leading-none text-center max-w-full truncate">{label.split(' ')[0]}</span>
                )}
                {quest && !quest.completed && quest.current > 0 && (
                  <span className={`absolute ${hideNavLabel ? 'top-2 right-3' : 'top-1 right-2'} w-2.5 h-2.5 bg-blue-500 border-2 ${isHighContrast ? 'border-black' : 'border-white'} rounded-full`} aria-hidden="true" />
                )}
              </button>
            );
          })}

          {isGamified && (
            <button 
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate && !settings.zenMode) navigator.vibrate(15);
                handleGardenClick();
              }}
              className={`relative flex flex-col items-center justify-center flex-1 min-w-0 p-2 rounded-2xl transition-all duration-300 active:scale-95 ${activeTab === 'Garden' ? (isHighContrast ? 'bg-white/20 text-white font-black shadow-sm' : `bg-slate-50 ${themeStyles.accent} font-black shadow-sm ring-1 ring-slate-900/5`) : (isHighContrast ? 'text-white/50 hover:text-white/80' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50')}`}
              aria-pressed={activeTab === 'Garden'}
              aria-label={t.garden || 'Garden'}
            >
              <div className={`text-2xl mb-1 ${activeTab === 'Garden' && !noFlash ? 'animate-bounce' : ''}`} aria-hidden="true">
                {t?.levelIcons?.[theme]?.[0] || '🌱'}
              </div>
              {!hideNavLabel && (
                <span className="text-[10px] leading-none text-center max-w-full truncate">{t.garden || 'Garden'}</span>
              )}
            </button>
          )}

          <button 
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.vibrate && !settings.zenMode) navigator.vibrate(15);
              setSettingsOpen(true);
            }}
            className={`relative flex flex-col items-center justify-center flex-1 min-w-0 p-2 rounded-2xl transition-all duration-300 active:scale-95 ${isHighContrast ? 'text-white/50 hover:text-white/80' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'}`}
            aria-label={t.settingsAria || 'Settings'}
          >
            <div className="text-2xl mb-1" aria-hidden="true">⚙️</div>
            {!hideNavLabel && (
              <span className="text-[10px] leading-none text-center max-w-full truncate">{t.settings || 'Settings'}</span>
            )}
          </button>
        </nav>
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
          <div className={`text-5xl mb-4 opacity-80 drop-shadow-md ${noFlash ? '' : 'animate-bounce'}`} aria-hidden="true">🌱</div>
            <h2 id="level-up-title" className={`text-2xl font-bold mb-4 ${isHighContrast ? 'text-white' : 'text-slate-700'}`}>
              {t.levelUpTitle || 'Your garden is growing!'}
            </h2>
            <p className={`text-sm mb-8 leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
              {t.levelUpDesc || 'Another goal has been successfully achieved.'}
            </p>
            <button onClick={() => { setShowSuccess(false); if (pendingFeedback) { setShowFeedback(true); setPendingFeedback(false); } else { goNext(); } }}
              className={`w-full ${bigTargets ? 'py-7 text-xl' : 'py-4 text-lg'} rounded-3xl font-bold active:scale-95 transition-all ${isHighContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {t.next || 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Point 9: UX Metrics Micro-survey (NASA-TLX) */}
{showFeedback && (
  <div 
    className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
    {}
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto no-scrollbar rounded-3xl bg-white shadow-2xl animate-in zoom-in duration-300">
      
      {}
      <button 
        onClick={() => {
          setShowFeedback(false);
          goNext(); 
        }}
        className="absolute top-4 right-4 z-10 scale-size-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors font-bold"
      >
        ✕
      </button>

      <SurveyComponent />
      
    </div>
  </div>
)}

      {/* Gentle Affirmative Toast Notification */}
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
        <div className={`fixed bottom-20 sm:bottom-24 right-4 z-50 p-5 rounded-3xl shadow-2xl max-w-xs border-2 ${noFlash ? '' : 'animate-in slide-in-from-right duration-500'} ${isHighContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-100 text-slate-800'}`} role="alert" aria-live="assertive">
          <h4 className="font-black text-sm mb-1 flex items-center gap-2"><span aria-hidden="true">🌱</span> {t.pwaNewVersion || 'New version'}</h4>
          <p className={`text-xs font-medium mb-4 leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
            {t.pwaDescription || 'New content is available. Please update the app to get the latest offline changes.'}
          </p>
          <div className="flex gap-2">
            <button onClick={() => updateServiceWorker(true)} className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-white shadow-md active:scale-95 transition-all ${themeStyles.button}`}>
              {t.pwaUpdate || 'Update'}
            </button>
            <button onClick={() => setNeedRefresh(false)} className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${isHighContrast ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {t.pwaLater || 'Later'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <GamificationProvider>
        <UserSettingsProvider>
          <AppContent />
        </UserSettingsProvider>
      </GamificationProvider>
    </Provider>
  );
}