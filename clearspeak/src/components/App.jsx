import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from 'react';

import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { useAffirmativeNotifications } from '../hooks/useAffirmativeNotifications.js';
import { useCognitiveLoad } from '../hooks/useCognitiveLoad.js';
import { useExerciseSession } from '../hooks/useExerciseSession.js';
import { useGlobalTTS } from '../hooks/useGlobalTTS.js';
import { getInitialRouteState, useHashRoute } from '../hooks/useHashRoute.js';
import { useIndexedDB } from '../hooks/useIndexedDB.js';
import { useReadingRuler } from '../hooks/useReadingRuler.js';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation.js';
import { useVocabularyLoader } from '../hooks/useVocabularyLoader.js';
import i18n from '../i18n/config.ts';
import { saveLog } from '../utils/indexedDB.js';

import { CognitiveEnergyIndicator } from './CognitiveEnergyIndicator.jsx';
import ExerciseContainer from './ExerciseContainer.jsx';
import { FeedbackCollector } from './FeedbackCollector.jsx';
import {
  GamificationProvider,
  useGamification,
} from './GamificationContext.jsx';
import IntroScreen from './IntroScreen.jsx';
import OfflineIndicator from './OfflineIndicator.jsx';
import { ProgressPill } from './ProgressPill.jsx';
import SidebarNav from './SidebarNav.jsx';
import {
  UserSettingsProvider,
  useUserSettingsContext,
} from './UserSettingsContext.jsx';
import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';
import SkeletonLoader from './common/SkeletonLoader.jsx';

// Lazy-loaded: each of these pulls in a library only it needs (recharts for
// ProfileModal's radar chart, lottie-react for VirtualGarden) that would
// otherwise inflate the initial bundle for every user, even ones who never
// open Settings/Profile/Survey/Garden. See docs/bundle-size.md.
const SettingsModal = lazy(() => import('./SettingsModal.jsx'));
const ProfileModal = lazy(() => import('./ProfileModal.jsx'));
const VirtualGarden = lazy(() => import('./VirtualGarden.jsx'));
const SurveyComponent = lazy(() =>
  import('./SurveyComponent').then((m) => ({ default: m.SurveyComponent })),
);

const POINTS_PER_LEVEL = 5;
const PILLARS = ['Literacy', 'Visual', 'Cognitive'];

// `buttonText` is pure black across every theme: none of these five button
// background colors reach 4.5:1 against their original light/cream text
// (2.59–3.94:1, an axe-core color-contrast finding) — black gives a
// comfortable 5.3–7.3:1 against all of them without changing the palette.
const THEMES = {
  Natur: {
    accent: 'text-[#4A5D54]',
    bg: 'bg-[#F4F1EA]',
    button: 'bg-[#8A9A86]',
    buttonText: 'text-black',
    border: 'border-[#D0D6CE]',
    hex: '#8A9A86',
    price: 0,
  },
  Musik: {
    accent: 'text-[#6B5B7B]',
    bg: 'bg-[#F3F0F5]',
    button: 'bg-[#8F7D9E]',
    buttonText: 'text-black',
    border: 'border-[#D1C8D6]',
    hex: '#8F7D9E',
    price: 3,
  },
  Kunst: {
    accent: 'text-[#8A6A4B]',
    bg: 'bg-[#F7F4F0]',
    button: 'bg-[#B08E6D]',
    buttonText: 'text-black',
    border: 'border-[#DED4CA]',
    hex: '#B08E6D',
    price: 5,
  },
  Space: {
    accent: 'text-[#4B5E6B]',
    bg: 'bg-[#F0F3F5]',
    button: 'bg-[#6D8394]',
    buttonText: 'text-black',
    border: 'border-[#CAD4DE]',
    hex: '#6D8394',
    price: 8,
  },
  Ocean: {
    accent: 'text-[#437A7A]',
    bg: 'bg-[#EFF5F5]',
    button: 'bg-[#67A3A3]',
    buttonText: 'text-black',
    border: 'border-[#C4DBDB]',
    hex: '#67A3A3',
    price: 10,
  },
};

function AppContent() {
  const {
    isGamified,
    setIsGamified,
    points,
    setPoints,
    coins,
    setCoins,
    rewards,
    setRewards,
    unlockedThemes,
    setUnlockedThemes,
    dailyQuests,
    setDailyQuests,
    updateQuests,
  } = useGamification();

  const { settings, updateSetting } = useUserSettingsContext();
  const { language, theme, dailyGoal, userDifficulty } = settings;

  const db = useVocabularyLoader(language);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const {
    speak,
    selectedVoiceURIs,
    setSelectedVoiceURIs,
    voiceSpeed,
    setVoiceSpeed,
    voicePitch,
    setVoicePitch,
  } = useGlobalTTS(language, settings.extendedTime);

  const [initialRoute] = useState(getInitialRouteState);
  const [activeTab, setActiveTab] = useState(
    initialRoute.activeTab || 'Literacy',
  );
  const [lastPillar, setLastPillar] = useState('Literacy');
  const [showIntro, setShowIntro] = useState(initialRoute.showIntro);
  const [settingsOpen, setSettingsOpen] = useState(initialRoute.settingsOpen);
  const [profileOpen, setProfileOpen] = useState(initialRoute.profileOpen);
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedCoinsAnim, setEarnedCoinsAnim] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState(false);

  const {
    loadLevel,
    showBreakModal,
    setShowBreakModal,
    setSessionStartTime,
    setErrorTimestamps,
    setLoadLevel,
  } = useCognitiveLoad(activeTab, settings.zenMode);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError: (err) => console.error('SW Error:', err),
  });

  const [dailyProgress, setDailyProgress] = useIndexedDB(
    'daily_progress',
    'date',
    'cfg_daily_progress',
  );

  const { affirmation, setAffirmation } = useAffirmativeNotifications(
    points,
    language,
  );

  const prevPointsRef = useRef(points);
  const [newTreeNotification, setNewTreeNotification] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prevTrees = Math.floor(prevPointsRef.current / 10);
    const currentTrees = Math.floor(points / 10);

    if (isAppReady && currentTrees > prevTrees && currentTrees > 0) {
      setNewTreeNotification(true);
      if (
        typeof navigator !== 'undefined' &&
        navigator.vibrate &&
        !settings.zenMode
      )
        navigator.vibrate([50, 50, 50]);
      const timer = setTimeout(() => setNewTreeNotification(false), 5000);
      return () => clearTimeout(timer);
    }
    prevPointsRef.current = points;
  }, [points, isAppReady, settings.zenMode]);

  useEffect(() => {
    if (!isGamified && activeTab === 'Garden') {
      setActiveTab('Literacy');
    }
  }, [isGamified, activeTab]);

  const { t } = useTranslation();

  const themeStyles = THEMES[theme] || THEMES.Natur;
  const noFlash = settings.noFlash || settings.motion;
  const bigTargets = settings.bigTargets || settings.motorik;
  const hideNavLabel = settings.vision;
  const isHighContrast = settings.contrast;
  const isColorblind = settings.color;
  const hasRuler = settings.ruler;

  const { cardRef, rulerPos } = useReadingRuler(hasRuler);

  useEffect(() => {
    const root = document.documentElement;

    const safeAccent = isColorblind
      ? '#0072B2'
      : THEMES[theme]?.hex || '#10b981';
    root.style.setProperty('--theme-accent', safeAccent);
    root.style.setProperty(
      '--color-success',
      isColorblind ? '#0072B2' : '#10b981',
    );
    root.style.setProperty(
      '--color-error',
      isColorblind ? '#D55E00' : '#ef4444',
    );
    root.style.setProperty(
      '--color-warning',
      isColorblind ? '#F0E442' : '#f59e0b',
    );

    const bgHex = THEMES[theme]?.bg?.match(/\[(.*?)\]/)?.[1] || '#FDFBF7';
    root.style.setProperty('--theme-bg', isHighContrast ? '#000000' : bgHex);

    root.lang = language;
  }, [theme, isHighContrast, language]);

  const {
    currentIndex,
    setCurrentIndex,
    setCycle,
    currentStreak,
    setCurrentStreak,
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
  } = useExerciseSession({
    db,
    activeTab,
    language,
    userDifficulty,
    setUserDifficulty: (val) => updateSetting('userDifficulty', val),
    inclusiveOptions: settings,
    t,
    speak,
    theme,
    isGamified,
    points,
    setPoints,
    setCoins,
    setRewards,
    dailyQuests,
    updateQuests,
    setDailyProgress,
    setPendingFeedback,
    setShowSuccess,
    setShowFeedback,
    setEarnedCoinsAnim,
    setErrorTimestamps,
  });

  const handleFeedbackSubmit = useCallback(
    async (surveyData) => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        pointsAtTime: points,
        metrics: surveyData,
      };

      try {
        await saveLog('ux_logs', logEntry);
      } catch (error) {
        console.error('Failed to save UX logs to IndexedDB:', error);
      }

      setShowFeedback(false);
      goNext();
    },
    [points, goNext],
  );

  const handleTabChange = useCallback(
    (pillar) => {
      setActiveTab(pillar);
      setLastPillar(pillar);
      setCurrentIndex(0);
      setCycle(0);
      setFeedback(null);
      setCurrentStreak(0);
    },
    [setCurrentIndex, setCycle, setFeedback, setCurrentStreak],
  );

  const handleGardenClick = useCallback(() => {
    setActiveTab('Garden');
    setFeedback(null);
  }, []);

  const handleNavigateTab = useCallback(
    (tab) => {
      if (tab === 'Garden') {
        handleGardenClick();
      } else {
        handleTabChange(tab);
      }
    },
    [handleGardenClick, handleTabChange],
  );

  // Keeps window.location.hash in sync with the current screen (#/literacy,
  // #/visual, #/cognitive, #/garden, #/settings, #/profile) so the browser
  // back/forward buttons work predictably and a specific pillar can be
  // linked to directly — useful for a study coordinator sending a
  // participant straight to a given exercise during an evaluation session.
  useHashRoute({
    showIntro,
    activeTab,
    settingsOpen,
    profileOpen,
    setShowIntro,
    setSettingsOpen,
    setProfileOpen,
    onNavigateTab: handleNavigateTab,
  });

  const handleSwipeTab = useCallback(
    (direction) => {
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
        if (
          typeof navigator !== 'undefined' &&
          navigator.vibrate &&
          !settings.zenMode
        )
          navigator.vibrate(15);
        const nextTab = availableTabs[newIdx];
        if (nextTab === 'Garden') {
          handleGardenClick();
        } else {
          handleTabChange(nextTab);
        }
      }
    },
    [activeTab, isGamified, handleTabChange, handleGardenClick],
  );

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => handleSwipeTab('left'),
    onSwipeRight: () => handleSwipeTab('right'),
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return;

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          e.preventDefault();
          goNext();
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
          return;
        }
      }

      if (!(e.ctrlKey || e.metaKey || e.altKey)) return;

      const availableTabs = isGamified ? [...PILLARS, 'Garden'] : PILLARS;
      let targetTab = null;

      switch (e.key) {
        case '1':
          if (availableTabs.length >= 1) targetTab = availableTabs[0];
          break;
        case '2':
          if (availableTabs.length >= 2) targetTab = availableTabs[1];
          break;
        case '3':
          if (availableTabs.length >= 3) targetTab = availableTabs[2];
          break;
        case '4':
          if (availableTabs.length >= 4) targetTab = availableTabs[3];
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          if (
            typeof navigator !== 'undefined' &&
            navigator.vibrate &&
            !settings.zenMode
          )
            navigator.vibrate(15);
          setProfileOpen(true);
          return;
        case ',':
          e.preventDefault();
          if (
            typeof navigator !== 'undefined' &&
            navigator.vibrate &&
            !settings.zenMode
          )
            navigator.vibrate(15);
          setSettingsOpen(true);
          return;
        default:
          return;
      }

      if (targetTab) {
        e.preventDefault();
        if (
          typeof navigator !== 'undefined' &&
          navigator.vibrate &&
          !settings.zenMode
        )
          navigator.vibrate(15);

        targetTab === 'Garden'
          ? handleGardenClick()
          : handleTabChange(targetTab);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isGamified,
    handleTabChange,
    handleGardenClick,
    goNext,
    goPrev,
    settings.zenMode,
    setSettingsOpen,
  ]);

  const renderCurrentExercise = () => {
    if (isTransitioning) {
      return <SkeletonLoader isHighContrast={isHighContrast} />;
    }

    const isVoiceException = !!(
      currentTask?.dictation ||
      currentTask?.lcwc ||
      currentTask?.phonetic ||
      currentTask?.scrambled ||
      currentTask?.readAloud
    );

    const voiceAssistantActive = !!settings.voiceAssistant || isVoiceException;

    const commonProps = {
      themeStyles,
      speak,
      t,
      language,
      onSuccess: handleSuccess,
      onError: handleError,
      bigTargets,
      extendedTime: !!settings.extendedTime,
      noFlash,
      bionicReading: !!settings.bionicReading,
      zenMode: !!settings.zenMode,
      isHighContrast,
      voiceAssistant: voiceAssistantActive,
    };

    return <ExerciseContainer currentTask={currentTask} {...commonProps} />;
  };

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} speak={speak} />;
  }

  if (settingsOpen) {
    return (
      <Suspense fallback={<SkeletonLoader isHighContrast={isHighContrast} />}>
        <SettingsModal open={true} onClose={() => setSettingsOpen(false)} />
      </Suspense>
    );
  }

  if (profileOpen) {
    return (
      <Suspense fallback={<SkeletonLoader isHighContrast={isHighContrast} />}>
        <ProfileModal open={true} onClose={() => setProfileOpen(false)} />
      </Suspense>
    );
  }

  return (
    <div
      className={`fixed inset-0 flex w-full flex-col overflow-hidden lg:flex-row ${isHighContrast ? 'bg-black text-white' : `${themeStyles.bg} text-[#2D3732]`}`}
    >
      {}
      {/* lg: matches SidebarNav's own breakpoint, so tablets in portrait keep
          the bottom bar below instead of switching to a squeezed sidebar. */}
      <div className="z-40 hidden h-full shrink-0 lg:flex">
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
          setProfileOpen={setProfileOpen}
          t={t}
          coins={coins}
          loadLevel={loadLevel}
          speak={speak}
          noFlash={noFlash}
        />
      </div>

      {}
      <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {}
        <div
          className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-10"
          style={{
            background:
              'linear-gradient(to bottom, var(--theme-bg) 0%, transparent)',
          }}
          aria-hidden="true"
        />

        <main
          className={`no-scrollbar mx-auto flex min-h-0 w-full max-w-5xl flex-1 touch-pan-y flex-col overflow-y-auto overscroll-none px-3 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:px-6 md:pt-5 xl:px-8 ${isHighContrast ? 'text-white' : 'text-[#2D3732]'}`}
          {...swipeHandlers}
        >
          {activeTab === 'Garden' ? (
            <div
              id="garden-container"
              className={`h-full w-full flex-1 py-2 ${noFlash ? '' : 'animate-in fade-in slide-in-from-bottom-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}
            >
              <Suspense
                fallback={<SkeletonLoader isHighContrast={isHighContrast} />}
              >
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
              </Suspense>
            </div>
          ) : (
            <>
              {}
              {!settings.zenMode && (
                <div
                  className={`relative mb-3 flex shrink-0 items-center justify-between gap-4 rounded-3xl px-3 py-2.5 sm:px-4 md:mb-4 ${isHighContrast ? 'border border-white/30 bg-black shadow-sm md:shadow-none' : `border bg-[#FCFBF9] ${themeStyles.border} shadow-md shadow-slate-200/40 md:shadow-sm`}`}
                >
                  {rewards.length > 0 && isGamified && (
                    <div
                      className={`absolute -top-4 left-4 z-20 flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-black tracking-widest uppercase shadow-lg ${isHighContrast ? 'border-white bg-black text-white' : `bg-[#FCFBF9] ${themeStyles.border} text-[#4A5D54]`} ${noFlash ? '' : 'animate-in zoom-in duration-300'}`}
                    >
                      <span>{t('collectedLabel')}:</span>
                      <span className="text-xs">
                        {rewards[rewards.length - 1]}
                      </span>
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {isGamified ? (
                      <ProgressPill
                        points={points % POINTS_PER_LEVEL}
                        max={POINTS_PER_LEVEL}
                        theme={theme}
                        isGamified={true}
                        t={t}
                        isHighContrast={isHighContrast}
                      />
                    ) : (
                      <>
                        <div
                          className={`scale-size-10 flex shrink-0 items-center justify-center rounded-full text-sm font-black ${isHighContrast ? 'bg-white text-black' : `${themeStyles.button} ${themeStyles.buttonText}`}`}
                        >
                          {Math.floor(points / POINTS_PER_LEVEL) + 1}
                        </div>
                        <ProgressPill
                          points={points % POINTS_PER_LEVEL}
                          max={POINTS_PER_LEVEL}
                          theme={theme}
                          isGamified={false}
                          t={t}
                          isHighContrast={isHighContrast}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <CognitiveEnergyIndicator
                      loadLevel={loadLevel || 'green'}
                      showModal={showBreakModal}
                      onTakeBreak={() => {
                        if (typeof setShowBreakModal === 'function')
                          setShowBreakModal(false);
                        handleGardenClick();
                      }}
                      onDismiss={() => {
                        if (typeof setShowBreakModal === 'function')
                          setShowBreakModal(false);
                      }}
                      t={t}
                      themeStyles={themeStyles}
                      isHighContrast={isHighContrast}
                      noFlash={noFlash}
                      bigTargets={bigTargets}
                    />
                    <div
                      className={`text-xs font-black tracking-widest uppercase ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
                    >
                      {!isGamified &&
                        `${safeIndex + 1} / ${activePillarTasks.length}`}
                    </div>
                  </div>
                </div>
              )}

              {}
              <section
                ref={cardRef}
                className={`relative flex min-h-0 w-full flex-1 flex-col items-center rounded-4xl px-2 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-12 ${isHighContrast ? 'border border-white/30 bg-black shadow-lg shadow-white/10 md:shadow-sm' : `border bg-[#FCFBF9] ${themeStyles.border} shadow-xl shadow-slate-200/30 md:shadow-md`}`}
                aria-label={t('exerciseAria')}
              >
                {}
                {hasRuler && rulerPos.visible && (
                  <div
                    className={`pointer-events-none absolute right-0 left-0 z-[100] h-16 transition-transform duration-75 ${isHighContrast ? 'border-y border-white/30 bg-white/10' : 'border-y border-indigo-500/20 bg-indigo-500/10 backdrop-invert-[0.02]'}`}
                    style={{ top: rulerPos.y - 32 }}
                    aria-hidden="true"
                  />
                )}
                {feedback && (
                  <div
                    className={`absolute top-4 left-1/2 z-20 w-full max-w-[90%] -translate-x-1/2 sm:max-w-md ${noFlash ? '' : 'animate-in slide-in-from-top duration-300'}`}
                  >
                    <span
                      className={`block rounded-2xl border px-4 py-3 text-center text-sm font-medium break-words hyphens-auto shadow-sm sm:px-6 ${isHighContrast ? 'border-white bg-black text-white' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                      role="status"
                      aria-live="polite"
                    >
                      <BionicText
                        text={feedback.msg}
                        enabled={!!settings.bionicReading}
                      />
                    </span>
                  </div>
                )}
                <div
                  key={`exercise-wrapper-${activeTab}-${currentIndex}`}
                  className={`flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center ${noFlash ? '' : 'animate-in fade-in slide-in-from-right-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}
                >
                  {renderCurrentExercise()}
                </div>
              </section>

              {settings.bionicReading && !settings.zenMode && (
                <p
                  className={`mt-2 shrink-0 text-center text-[9px] font-bold sm:text-[10px] md:mt-3 ${isHighContrast ? 'text-white/80' : 'text-slate-600'}`}
                >
                  {t('bionicExplanation') ||
                    'Bionic Reading® is a typographic method that supports the reading flow.'}
                </p>
              )}

              {feedback?.type === 'success' ? (
                <div className="animate-in zoom-in mt-3 flex shrink-0 flex-col items-center justify-center pb-1 duration-300 md:mt-4 md:pb-2">
                  <button
                    onClick={goNext}
                    className={`${bigTargets ? 'px-14 py-5 text-lg md:py-6' : 'px-12 py-3.5 text-sm md:py-4'} rounded-full font-black tracking-widest uppercase shadow-xl transition-all active:scale-95 ${noFlash ? '' : 'animate-bounce'} break-words hyphens-auto ${isHighContrast ? 'bg-white text-black hover:bg-slate-200' : `${themeStyles.button} ${themeStyles.buttonText} opacity-90 hover:opacity-100`}`}
                  >
                    {t('next') || 'Next'}
                  </button>
                  <p
                    className={`mt-3 hidden text-[10px] font-bold md:block ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
                  >
                    💡 {t('pressKey') || 'Press'}{' '}
                    <kbd className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-slate-500">
                      Enter
                    </kbd>{' '}
                    {t('or') || 'or'}{' '}
                    <kbd className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-slate-500">
                      →
                    </kbd>{' '}
                    {t('toContinue') || 'to continue'}
                  </p>
                </div>
              ) : (
                currentTask &&
                !settings.zenMode && (
                  <div className="mt-2 flex shrink-0 flex-col items-center justify-center pb-1 md:mt-3 md:pb-2">
                    <button
                      onClick={goNext}
                      className={`${bigTargets ? 'px-10 py-4 text-xs' : 'px-8 py-2 text-[10px]'} rounded-full border-2 bg-transparent font-black tracking-widest uppercase transition-colors ${isHighContrast ? 'border-white/50 text-white/80 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                    >
                      {t('skip') || 'Skip'}
                    </button>
                    <p
                      className={`mt-3 hidden text-[10px] font-bold md:block ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
                    >
                      💡 {t('pressKey') || 'Press'}{' '}
                      <kbd className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-slate-500">
                        →
                      </kbd>{' '}
                      {t('toSkip') || 'to skip'}
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </main>

        {}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 hidden h-24 md:block"
          style={{
            background:
              'linear-gradient(to top, var(--theme-bg) 5%, transparent)',
          }}
          aria-hidden="true"
        />

        {}
        {/* lg: matches the sidebar wrapper's breakpoint above, so tablets in
            portrait keep this bottom bar instead of a cramped desktop sidebar. */}
        <nav
          className={`z-40 flex shrink-0 items-center justify-around border-t px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-colors lg:hidden ${isHighContrast ? 'border-white/20 bg-black' : 'border-slate-100 bg-white'}`}
          aria-label={t('navAria') || 'Main Navigation'}
        >
          {PILLARS.map((pillar) => {
            const isActive = activeTab === pillar;
            const quest = dailyQuests.tasks.find((tsk) => tsk.type === pillar);
            const label =
              t('pillars', { returnObjects: true })?.[pillar] || pillar;
            const icon = { Literacy: '📖', Visual: '👁️', Cognitive: '🧩' }[
              pillar
            ];
            return (
              <button
                key={pillar}
                onClick={() => {
                  if (
                    typeof navigator !== 'undefined' &&
                    navigator.vibrate &&
                    !settings.zenMode
                  )
                    navigator.vibrate(15);
                  handleTabChange(pillar);
                }}
                className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl p-2 transition-all duration-300 active:scale-95 ${isActive ? (isHighContrast ? 'bg-white/20 font-black text-white shadow-sm' : `bg-slate-50 ${themeStyles.accent} font-black shadow-sm ring-1 ring-slate-900/5`) : isHighContrast ? 'text-white/50 hover:text-white/80' : 'text-slate-600 hover:bg-slate-50/50 hover:text-slate-600'}`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
              >
                <div
                  className={`mb-1 text-2xl ${isActive && !noFlash ? 'animate-bounce' : ''} ${isActive && isHighContrast ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}
                  aria-hidden="true"
                >
                  {icon}
                </div>
                {!hideNavLabel && (
                  <span className="max-w-full truncate text-center text-[10px] leading-none">
                    {label.split(' ')[0]}
                  </span>
                )}
                {quest && !quest.completed && quest.current > 0 && (
                  <span
                    className={`absolute ${hideNavLabel ? 'top-2 right-3' : 'top-1 right-2'} h-2.5 w-2.5 border-2 bg-blue-500 ${isHighContrast ? 'border-black' : 'border-white'} rounded-full`}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}

          {isGamified && (
            <button
              onClick={() => {
                if (
                  typeof navigator !== 'undefined' &&
                  navigator.vibrate &&
                  !settings.zenMode
                )
                  navigator.vibrate(15);
                handleGardenClick();
              }}
              className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl p-2 transition-all duration-300 active:scale-95 ${activeTab === 'Garden' ? (isHighContrast ? 'bg-white/20 font-black text-white shadow-sm' : `bg-slate-50 ${themeStyles.accent} font-black shadow-sm ring-1 ring-slate-900/5`) : isHighContrast ? 'text-white/50 hover:text-white/80' : 'text-slate-600 hover:bg-slate-50/50 hover:text-slate-600'}`}
              aria-current={activeTab === 'Garden' ? 'page' : undefined}
              aria-label={t('garden') || 'Garden'}
            >
              <div
                className={`mb-1 text-2xl ${activeTab === 'Garden' && !noFlash ? 'animate-bounce' : ''}`}
                aria-hidden="true"
              >
                {t('levelIcons', { returnObjects: true })?.[theme]?.[0] || '🌱'}
              </div>
              {!hideNavLabel && (
                <span className="max-w-full truncate text-center text-[10px] leading-none">
                  {t('garden') || 'Garden'}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => {
              if (
                typeof navigator !== 'undefined' &&
                navigator.vibrate &&
                !settings.zenMode
              )
                navigator.vibrate(15);
              setProfileOpen(true);
            }}
            className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl p-2 transition-all duration-300 active:scale-95 ${isHighContrast ? 'text-white/50 hover:text-white/80' : 'text-slate-600 hover:bg-slate-50/50 hover:text-slate-600'}`}
            aria-label={t('profile') || 'Profile'}
          >
            <div className="mb-1 text-2xl" aria-hidden="true">
              👤
            </div>
            {!hideNavLabel && (
              <span className="max-w-full truncate text-center text-[10px] leading-none">
                {t('profile') || 'Profile'}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (
                typeof navigator !== 'undefined' &&
                navigator.vibrate &&
                !settings.zenMode
              )
                navigator.vibrate(15);
              setSettingsOpen(true);
            }}
            className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl p-2 transition-all duration-300 active:scale-95 ${isHighContrast ? 'text-white/50 hover:text-white/80' : 'text-slate-600 hover:bg-slate-50/50 hover:text-slate-600'}`}
            aria-label={t('settingsAria') || 'Settings'}
          >
            <div className="mb-1 text-2xl" aria-hidden="true">
              ⚙️
            </div>
            {!hideNavLabel && (
              <span className="max-w-full truncate text-center text-[10px] leading-none">
                {t('settings') || 'Settings'}
              </span>
            )}
          </button>
        </nav>
      </div>

      {}
      {newTreeNotification && (
        <div className="pointer-events-none fixed top-16 left-1/2 z-[110] w-full max-w-sm -translate-x-1/2 px-4 sm:top-20">
          <div
            className={`flex items-center gap-3 rounded-3xl border-2 p-4 shadow-2xl sm:gap-4 sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-top-8 fade-in duration-500'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-emerald-400 bg-emerald-600 text-white'}`}
          >
            <span
              className="text-4xl drop-shadow-md sm:text-5xl"
              aria-hidden="true"
            >
              🌳
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 text-xs font-black tracking-widest uppercase sm:text-sm">
                {t('realWorldImpact.newTreeTitle') || 'New Tree! 🎉'}
              </h4>
              <p
                className={`text-[10px] leading-tight font-medium break-words hyphens-auto sm:text-xs ${isHighContrast ? 'text-white/80' : 'text-emerald-50'}`}
              >
                {t('realWorldImpact.newTreeMsg') ||
                  'Amazing! Your consistent learning helped us virtually plant another tree.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {}
      {showSuccess && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 text-center ${isHighContrast ? 'bg-black/90 backdrop-blur-sm' : 'bg-slate-50/90 backdrop-blur-md'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-up-title"
        >
          <div
            className={`flex w-full max-w-sm flex-col items-center rounded-4xl border p-6 shadow-lg sm:p-10 ${noFlash ? '' : 'animate-in fade-in zoom-in duration-700'} ${isHighContrast ? 'border-white bg-black' : 'border-slate-200 bg-white'}`}
          >
            <div
              className={`mb-4 text-5xl opacity-80 drop-shadow-md ${noFlash ? '' : 'animate-bounce'}`}
              aria-hidden="true"
            >
              🌱
            </div>
            <h2
              id="level-up-title"
              className={`mb-4 text-2xl font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
            >
              {t('levelUpTitle') || 'Your garden is growing!'}
            </h2>
            <p
              className={`mb-8 text-sm leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
            >
              {t('levelUpDesc') ||
                'Another goal has been successfully achieved.'}
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                if (pendingFeedback) {
                  setShowFeedback(true);
                  setPendingFeedback(false);
                } else {
                  goNext();
                }
              }}
              className={`w-full ${bigTargets ? 'py-7 text-xl' : 'py-4 text-lg'} rounded-3xl font-bold transition-all active:scale-95 ${isHighContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {t('next') || 'Next'}
            </button>
          </div>
        </div>
      )}

      {}
      <Dialog
        open={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          goNext();
        }}
        labelledBy="survey-title"
        overlayClassName="z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6"
        className="no-scrollbar animate-in zoom-in relative max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl duration-300"
      >
        {}
        <button
          onClick={() => {
            setShowFeedback(false);
            goNext();
          }}
          className="scale-size-10 absolute top-4 right-4 z-10 flex items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 transition-colors hover:bg-slate-200"
        >
          ✕
        </button>

        <Suspense fallback={<SkeletonLoader isHighContrast={false} />}>
          <SurveyComponent />
        </Suspense>
      </Dialog>

      {}
      {affirmation && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] w-full max-w-sm -translate-x-1/2 px-4">
          <div
            className={`rounded-2xl border p-4 shadow-lg ${noFlash ? '' : 'animate-in slide-in-from-bottom-8 fade-in duration-700'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-slate-100 bg-white text-slate-700'}`}
          >
            <p className="text-center text-sm leading-relaxed font-medium">
              {affirmation}
            </p>
          </div>
        </div>
      )}

      {}
      <OfflineIndicator />

      {}
      {needRefresh && (
        <div
          className={`fixed right-4 bottom-20 left-4 z-50 w-auto rounded-3xl border-2 p-4 shadow-2xl sm:right-4 sm:bottom-24 sm:left-auto sm:w-full sm:max-w-xs sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-bottom sm:slide-in-from-right duration-500'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-slate-100 bg-white text-slate-800'}`}
          role="alert"
          aria-live="assertive"
        >
          <h4 className="mb-1 flex items-center gap-2 text-sm font-black">
            <span aria-hidden="true">🌱</span>{' '}
            {t('pwaNewVersion') || 'New version'}
          </h4>
          <p
            className={`mb-4 text-xs leading-relaxed font-medium ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            {t('pwaDescription') ||
              'New content is available. Please update the app to get the latest offline changes.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateServiceWorker(true)}
              className={`flex-1 rounded-xl py-3 text-[10px] font-black tracking-widest uppercase shadow-md transition-all active:scale-95 sm:text-xs ${themeStyles.button} ${themeStyles.buttonText}`}
            >
              {t('pwaUpdate') || 'Update'}
            </button>
            <button
              onClick={() => setNeedRefresh(false)}
              className={`flex-1 rounded-xl py-3 text-[10px] font-black tracking-widest uppercase transition-all sm:text-xs ${isHighContrast ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {t('pwaLater') || 'Later'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GamificationProvider>
      <UserSettingsProvider>
        <AppContent />
      </UserSettingsProvider>
    </GamificationProvider>
  );
}
