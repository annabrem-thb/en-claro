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
import { saveLog } from '../utils/indexedDB.js';
import { useIndexedDB } from '../hooks/useIndexedDB.js';
import { useCognitiveLoad } from '../hooks/useCognitiveLoad.js';
import { useAffirmativeNotifications } from '../hooks/useAffirmativeNotifications.js';
import { useGlobalTTS } from '../hooks/useGlobalTTS.js';
import { useAppSettings } from '../hooks/useAppSettings.js';
import { useExerciseSession } from '../hooks/useExerciseSession.js';
import { useGamificationState } from '../hooks/useGamificationState.js';
import { useVocabularyLoader } from '../hooks/useVocabularyLoader.js';
import { useReadingRuler } from '../hooks/useReadingRuler.js';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation.js';

import ExerciseContainer from './ExerciseContainer.jsx';
import { GamificationProvider, useGamification } from './GamificationContext.jsx';
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
  
  // Global App Settings Module
  const {
    language, setLanguage, theme, setTheme,
    a11yAddons, setA11yAddons,
    inclusiveOptions, setInclusiveOptions,
    dailyGoal, setDailyGoal,
    userDifficulty, setUserDifficulty,
    textScale, setTextScale
  } = useAppSettings();

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
  } = useGlobalTTS(language, inclusiveOptions.extendedTime);

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
    loadLevel, setSessionStartTime, setErrorTimestamps, 
    setLoadLevel 
  } = useCognitiveLoad(activeTab, inclusiveOptions.zenMode);

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
  
  const fallbacks = {
    pl: { next: 'Dalej', skip: 'Pomiń', lvlTitle: 'Twój ogród rośnie!', lvlDesc: 'Kolejny cel został pomyślnie zrealizowany.', pwaTitle: 'Nowa wersja', pwaDesc: 'Dostępna jest nowa treść. Zaktualizuj aplikację, aby pobrać najnowsze zmiany do trybu offline.', pwaUp: 'Aktualizuj', pwaLater: 'Później' },
    de: { next: 'Weiter', skip: 'Überspringen', lvlTitle: 'Dein Garten wächst!', lvlDesc: 'Ein weiteres Ziel wurde erfolgreich erreicht.', pwaTitle: 'Neue Version', pwaDesc: 'Neue Inhalte sind verfügbar. Bitte aktualisiere die App für die neuesten Offline-Änderungen.', pwaUp: 'Aktualisieren', pwaLater: 'Später' },
    en: { next: 'Next', skip: 'Skip', lvlTitle: 'Your garden is growing!', lvlDesc: 'Another goal successfully completed.', pwaTitle: 'New version', pwaDesc: 'New content is available. Please update the app to get the latest offline changes.', pwaUp: 'Update', pwaLater: 'Later' }
  };
  const l = fallbacks[language] || fallbacks.en;

  const themeStyles = THEMES[theme]         || THEMES.Natur;
  const noFlash        = !!(inclusiveOptions.noFlash    || a11yAddons.includes('Redukcja'));
  const bigTargets     = !!(inclusiveOptions.bigTargets || a11yAddons.includes('Motorik'));
  const hideNavLabel   = a11yAddons.includes('Niedowidzenie');
  const isHighContrast = a11yAddons.includes('Kontrast');
  const hasRuler       = a11yAddons.includes('Linijka');

  // Reading Ruler logic
  const { cardRef, rulerPos } = useReadingRuler(hasRuler);

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
    
    // Extracts HEX color from classes like bg-[#F4F1EA] and sets it as a variable for gradients
    const bgHex = THEMES[theme]?.bg?.match(/\[(.*?)\]/)?.[1] || '#FDFBF7';
    root.style.setProperty('--theme-bg', isHighContrast ? '#000000' : bgHex);
    
    root.style.setProperty('--user-text-scale', textScale / 100);
    root.lang = language;
  }, [a11yAddons, inclusiveOptions, theme, isHighContrast, bigTargets, noFlash, language, textScale]);

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
    userDifficulty, setUserDifficulty,
    inclusiveOptions, t, speak, theme, isGamified,
    points, setPoints, setCoins, setRewards,
    dailyQuests, updateQuests, setDailyProgress,
    setPendingFeedback, setShowSuccess, setShowFeedback, setEarnedCoinsAnim,
    setErrorTimestamps
  });

  // Swipe Navigation (must be initialized after useExerciseSession to access goNext/goPrev)
  const swipeHandlers = useSwipeNavigation({ onSwipeLeft: goNext, onSwipeRight: goPrev });

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
          textScale={textScale}
          setTextScale={setTextScale}
    />;
  }

  // --- Render Settings Page ---
  if (settingsOpen) {
    return <SettingsModal 
      open={true}
      onClose={() => setSettingsOpen(false)} 
      language={language}
      setLanguage={setLanguage}
      theme={theme}
      setTheme={setTheme}
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
      coins={coins}
      setCoins={setCoins}
      unlockedThemes={unlockedThemes}
      setUnlockedThemes={setUnlockedThemes}
      textScale={textScale}
      setTextScale={setTextScale}
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
      <div className="flex-1 flex flex-col min-w-0 h-screen h-dvh overflow-hidden relative">
        
        {/* Subtle gradient at the top of the screen (masks scrolled text) */}
        <div 
          className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10" 
          style={{ background: 'linear-gradient(to bottom, var(--theme-bg) 0%, transparent)' }} 
          aria-hidden="true" 
        />

        <main 
          className={`flex-1 flex flex-col min-h-0 overflow-y-auto overscroll-none no-scrollbar px-3 md:px-8 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom))] mx-auto w-full max-w-4xl ${isHighContrast ? 'text-white' : 'text-[#2D3732]'}`}
          {...swipeHandlers}
        >
          {activeTab === 'Garden' ? (
            <div id="garden-container" className={`flex-1 w-full h-full py-2 ${noFlash ? '' : 'animate-in fade-in zoom-in duration-500'}`}>
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
                  {inclusiveOptions.zenMode ? (
                    <div className={`h-3 flex-1 rounded-full ${isHighContrast ? 'bg-white/20' : 'bg-slate-100'}`} />
                  ) : isGamified ? (
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
                  <div className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>
                    {!isGamified && `${safeIndex + 1} / ${activePillarTasks.length}`}
                  </div>
                </div>
              </div>

              {/* Active Exercise Card */}
              <section 
                ref={cardRef}
                className={`rounded-4xl flex flex-col items-center relative w-full flex-1 px-4 py-6 sm:px-10 sm:py-8 ${isHighContrast ? 'bg-black border border-white/30 shadow-lg shadow-white/10' : `bg-[#FCFBF9] border ${themeStyles.border} shadow-xl shadow-slate-200/30`}`}
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
                    {t.next || s.next || l.next}
                  </button>
                </div>
              ) : (
                currentTask && !inclusiveOptions.zenMode && (
                  <div className="mt-3 flex justify-center shrink-0 pb-2">
                    <button onClick={goNext}
                      className={`${bigTargets ? 'px-10 py-4 text-xs' : 'px-8 py-2 text-[10px]'} bg-transparent border-2 rounded-full font-black uppercase tracking-widest transition-colors ${isHighContrast ? 'border-white/50 text-white/80 hover:bg-white/10' : 'border-slate-200 text-slate-400 hover:bg-slate-100'}`}>
                      {t.skip || s.skip || l.skip}
                    </button>
                  </div>
                )
              )}
            </>
          )}
        </main>
        
        {/* Subtle fade-out gradient at the bottom, indicating scrollable content */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10" 
          style={{ background: 'linear-gradient(to top, var(--theme-bg) 5%, transparent)' }} 
          aria-hidden="true" 
        />
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
              {t.levelUpTitle || l.lvlTitle}
            </h2>
            <p className={`text-sm mb-8 leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
              {t.levelUpDesc || l.lvlDesc}
            </p>
            <button onClick={() => { setShowSuccess(false); if (pendingFeedback) { setShowFeedback(true); setPendingFeedback(false); } else { goNext(); } }}
              className={`w-full ${bigTargets ? 'py-7 text-xl' : 'py-4 text-lg'} rounded-3xl font-bold active:scale-95 transition-all ${isHighContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {t.next || s.next || l.next}
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
          <h4 className="font-black text-sm mb-1 flex items-center gap-2"><span aria-hidden="true">🌱</span> {t.pwaNewVersion || l.pwaTitle}</h4>
          <p className={`text-xs font-medium mb-4 leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
            {t.pwaDescription || l.pwaDesc}
          </p>
          <div className="flex gap-2">
            <button onClick={() => updateServiceWorker(true)} className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-white shadow-md active:scale-95 transition-all ${themeStyles.button}`}>
              {t.pwaUpdate || l.pwaUp}
            </button>
            <button onClick={() => setNeedRefresh(false)} className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${isHighContrast ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {t.pwaLater || l.pwaLater}
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
        <AppContent />
      </GamificationProvider>
    </Provider>
  );
}