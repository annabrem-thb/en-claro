import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  lazy,
  Suspense,
} from 'react';

import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { useAffirmativeNotifications } from '../hooks/useAffirmativeNotifications.js';
import { useCognitiveLoad } from '../hooks/useCognitiveLoad.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useExerciseSession } from '../hooks/useExerciseSession.js';
import { useGlobalTTS } from '../hooks/useGlobalTTS.js';
import { useHapticFeedback } from '../hooks/useHapticFeedback.js';
import { getInitialRouteState, useHashRoute } from '../hooks/useHashRoute.js';
import { useIndexedDB } from '../hooks/useIndexedDB.js';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';
import { useReadingRuler } from '../hooks/useReadingRuler.js';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation.js';
import { useThemeCSSVariables } from '../hooks/useThemeCSSVariables.js';
import { useVocabularyLoader } from '../hooks/useVocabularyLoader.js';
import i18n from '../i18n/config.ts';

import AffirmationToast from './AffirmationToast.jsx';
import BottomNav from './BottomNav.jsx';
import { CognitiveEnergyIndicator } from './CognitiveEnergyIndicator.jsx';
import ExerciseContainer from './ExerciseContainer.jsx';
import {
  GamificationProvider,
  useGamification,
} from './GamificationContext.jsx';
import IntroScreen from './IntroScreen.jsx';
import LevelUpModal from './LevelUpModal.jsx';
import NewTreeToast from './NewTreeToast.jsx';
import OfflineIndicator from './OfflineIndicator.jsx';
import { ProgressPill } from './ProgressPill.jsx';
import PwaUpdateBanner from './PwaUpdateBanner.jsx';
import SidebarNav from './SidebarNav.jsx';
import {
  UserSettingsProvider,
  useUserSettingsContext,
} from './UserSettingsContext.jsx';
import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';
import SkeletonLoader from './common/SkeletonLoader.jsx';

// Lazy-loaded: each of these pulls in a library only it needs (lottie-react
// for VirtualGarden) that would otherwise inflate the initial bundle for
// every user, even ones who never open Settings/Survey/Garden. See
// docs/bundle-size.md.
const SettingsModal = lazy(() => import('./SettingsModal.jsx'));
const VirtualGarden = lazy(() => import('./VirtualGarden.jsx'));
const SurveyComponent = lazy(() =>
  import('./SurveyComponent').then((m) => ({ default: m.SurveyComponent })),
);

const POINTS_PER_LEVEL = 5;
const PILLARS = ['Literacy', 'Visual', 'Cognitive'];
const TREE_NOTIFICATION_MS = 5000;
const APP_READY_DELAY_MS = 1500;

// `buttonText` is pure black across every theme: none of these five button
// background colors reach 4.5:1 against their original light/cream text
// (2.59–3.94:1, an axe-core color-contrast finding) — black gives a
// comfortable 5.3–7.3:1 against all of them without changing the palette.
// `ring` mirrors each theme's `hex`/`button` hue as a literal `ring-[#...]`
// Tailwind class — used by WeeklyCalendar.jsx's "today" indicator so the
// Garden's own chrome (and not just its growth icons) actually tracks the
// selected theme instead of a fixed indigo regardless of theme.
const THEMES = {
  Natur: {
    accent: 'text-[#4A5D54]',
    bg: 'bg-[#F4F1EA]',
    button: 'bg-[#8A9A86]',
    buttonText: 'text-black',
    border: 'border-[#D0D6CE]',
    ring: 'ring-[#8A9A86]',
    hex: '#8A9A86',
  },
  Musik: {
    accent: 'text-[#6B5B7B]',
    bg: 'bg-[#F3F0F5]',
    button: 'bg-[#8F7D9E]',
    buttonText: 'text-black',
    border: 'border-[#D1C8D6]',
    ring: 'ring-[#8F7D9E]',
    hex: '#8F7D9E',
  },
  Kunst: {
    accent: 'text-[#8A6A4B]',
    bg: 'bg-[#F7F4F0]',
    button: 'bg-[#B08E6D]',
    buttonText: 'text-black',
    border: 'border-[#DED4CA]',
    ring: 'ring-[#B08E6D]',
    hex: '#B08E6D',
  },
  Space: {
    accent: 'text-[#4B5E6B]',
    bg: 'bg-[#F0F3F5]',
    button: 'bg-[#6D8394]',
    buttonText: 'text-black',
    border: 'border-[#CAD4DE]',
    ring: 'ring-[#6D8394]',
    hex: '#6D8394',
  },
  Ocean: {
    accent: 'text-[#437A7A]',
    bg: 'bg-[#EFF5F5]',
    button: 'bg-[#67A3A3]',
    buttonText: 'text-black',
    border: 'border-[#C4DBDB]',
    ring: 'ring-[#67A3A3]',
    hex: '#67A3A3',
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
    dailyQuests,
    setDailyQuests,
    updateQuests,
  } = useGamification();

  const { settings, updateSetting } = useUserSettingsContext();
  const { language, theme, dailyGoal, userDifficulty } = settings;

  // Single source of truth for the "buzz the phone" side effect — every
  // handler below calls this instead of repeating the
  // `navigator.vibrate`-exists-and-Zen-Mode-is-off guard inline.
  const vibrate = useHapticFeedback(settings.zenMode);

  const [initialRoute] = useState(getInitialRouteState);
  const [showIntro, setShowIntro] = useState(initialRoute.showIntro);

  // Skipped while the intro screen is up — see useVocabularyLoader.js for
  // why eagerly fetching the not-yet-confirmed default language here caused
  // WebKit to fail the *next* dynamic import too, once the user picked a
  // different language and abandoned this one mid-flight.
  const db = useVocabularyLoader(language, showIntro);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
      // Any narration already playing was reading the *previous* language —
      // letting it finish would mean hearing e.g. Polish text spoken over
      // (or after) a switch to German. Cutting it off here means the next
      // speak() call, whenever it happens, is the first one in the new
      // language rather than a leftover from the old one.
      window.speechSynthesis?.cancel();
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

  const [activeTab, setActiveTab] = useState(
    initialRoute.activeTab || 'Literacy',
  );
  const [lastPillar, setLastPillar] = useState('Literacy');
  const [settingsOpen, setSettingsOpen] = useState(initialRoute.settingsOpen);
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
    const timer = setTimeout(() => setIsAppReady(true), APP_READY_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prevTrees = Math.floor(prevPointsRef.current / 10);
    const currentTrees = Math.floor(points / 10);

    if (isAppReady && currentTrees > prevTrees && currentTrees > 0) {
      setNewTreeNotification(true);
      vibrate([50, 50, 50]);
      const timer = setTimeout(
        () => setNewTreeNotification(false),
        TREE_NOTIFICATION_MS,
      );
      return () => clearTimeout(timer);
    }
    prevPointsRef.current = points;
  }, [points, isAppReady, vibrate]);

  useEffect(() => {
    if (!isGamified && activeTab === 'Garden') {
      setActiveTab('Literacy');
    }
  }, [isGamified, activeTab]);

  const { t } = useTranslation();

  const documentTitleSegment = showIntro
    ? null
    : settingsOpen
      ? t('settings') || 'Settings'
      : activeTab === 'Garden'
        ? t('garden') || 'Garden'
        : t('pillars', { returnObjects: true })?.[activeTab] || activeTab;
  useDocumentTitle(documentTitleSegment);

  const themeStyles = THEMES[theme] || THEMES.Natur;
  const noFlash = settings.noFlash || settings.motion;
  const bigTargets = settings.bigTargets || settings.motorik;
  const hideNavLabel = settings.vision;
  const isHighContrast = settings.contrast;
  const isColorblind = settings.color;
  const hasRuler = settings.ruler;

  const { cardRef, rulerPos } = useReadingRuler(hasRuler);

  useThemeCSSVariables({
    themeStyles,
    isHighContrast,
    isColorblind,
    language,
  });

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
  }, [setFeedback]);

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
  // #/visual, #/cognitive, #/garden, #/settings) so the browser
  // back/forward buttons work predictably and a specific pillar can be
  // linked to directly — useful for a study coordinator sending a
  // participant straight to a given exercise during an evaluation session.
  useHashRoute({
    showIntro,
    activeTab,
    settingsOpen,
    setShowIntro,
    setSettingsOpen,
    onNavigateTab: handleNavigateTab,
  });

  const openSettings = useCallback(() => setSettingsOpen(true), []);

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
        vibrate(15);
        const nextTab = availableTabs[newIdx];
        if (nextTab === 'Garden') {
          handleGardenClick();
        } else {
          handleTabChange(nextTab);
        }
      }
    },
    [activeTab, isGamified, handleTabChange, handleGardenClick, vibrate],
  );

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => handleSwipeTab('left'),
    onSwipeRight: () => handleSwipeTab('right'),
  });

  useKeyboardShortcuts({
    isGamified,
    pillars: PILLARS,
    goNext,
    goPrev,
    onTabChange: handleTabChange,
    onGardenClick: handleGardenClick,
    onOpenSettings: openSettings,
    vibrate,
    // While any focus-trapped dialog is open, it owns the keyboard —
    // otherwise ArrowRight/Enter meant for a control inside e.g. the
    // feedback survey would also be read as "advance to the next exercise"
    // by this app-wide listener.
    enabled: !settingsOpen && !showFeedback && !showSuccess && !showBreakModal,
  });

  const isVoiceException = !!(
    currentTask?.dictation ||
    currentTask?.lcwc ||
    currentTask?.phonetic ||
    currentTask?.scrambled ||
    currentTask?.readAloud
  );
  const voiceAssistantActive = !!settings.voiceAssistant || isVoiceException;

  // Memoized so a re-render triggered by unrelated state (e.g. the tree
  // notification timer) doesn't hand ExerciseContainer a brand-new props
  // object when nothing it actually reads has changed — a prerequisite for
  // wrapping ExerciseContainer itself in React.memo down the line.
  const exerciseCommonProps = useMemo(
    () => ({
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
    }),
    [
      themeStyles,
      speak,
      t,
      language,
      handleSuccess,
      handleError,
      bigTargets,
      settings.extendedTime,
      noFlash,
      settings.bionicReading,
      settings.zenMode,
      isHighContrast,
      voiceAssistantActive,
    ],
  );

  const renderCurrentExercise = () => {
    if (isTransitioning) {
      return (
        <SkeletonLoader isHighContrast={isHighContrast} noFlash={noFlash} />
      );
    }

    return (
      <ExerciseContainer currentTask={currentTask} {...exerciseCommonProps} />
    );
  };

  const handleLevelUpNext = useCallback(() => {
    setShowSuccess(false);
    if (pendingFeedback) {
      setShowFeedback(true);
      setPendingFeedback(false);
    } else {
      goNext();
    }
  }, [pendingFeedback, goNext]);

  const dismissPwaUpdate = useCallback(
    () => setNeedRefresh(false),
    [setNeedRefresh],
  );
  const applyPwaUpdate = useCallback(
    () => updateServiceWorker(true),
    [updateServiceWorker],
  );

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} speak={speak} />;
  }

  if (settingsOpen) {
    return (
      <Suspense
        fallback={
          <SkeletonLoader isHighContrast={isHighContrast} noFlash={noFlash} />
        }
      >
        <SettingsModal
          open={true}
          onClose={() => setSettingsOpen(false)}
          speak={speak}
        />
      </Suspense>
    );
  }

  return (
    <div
      className={`fixed inset-0 flex w-full flex-col overflow-hidden lg:flex-row ${isHighContrast ? 'bg-black text-white' : `${themeStyles.bg} text-[#2D3732]`}`}
    >
      {}
      {/* Only reachable by keyboard (sr-only until focused): lets a Tab-only
          user jump past the sidebar/bottom nav straight to the exercise
          instead of tabbing through every nav item on every page load.
          Focus is moved manually rather than left to the browser's default
          hash-navigation, because this app already overloads
          `location.hash` for routing (#/literacy, #/settings, ...) —
          letting the browser set it to "#main-content" would fire the
          router's hashchange listener, which doesn't recognize that
          segment and would reset the whole app back to the intro screen. */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-800 focus:shadow-lg"
      >
        <BionicText
          text={t('skipToContent') || 'Skip to main content'}
          enabled={!!settings.bionicReading}
        />
      </a>

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
          t={t}
          coins={coins}
          loadLevel={loadLevel}
          speak={speak}
          noFlash={noFlash}
          bionicReading={!!settings.bionicReading}
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
          id="main-content"
          tabIndex={-1}
          className={`no-scrollbar mx-auto flex min-h-0 w-full max-w-5xl flex-1 touch-pan-y flex-col overflow-y-auto overscroll-none px-3 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:px-6 md:pt-5 xl:px-8 ${isHighContrast ? 'text-white' : 'text-[#2D3732]'}`}
          {...swipeHandlers}
        >
          {activeTab === 'Garden' ? (
            <div
              id="garden-container"
              className={`h-full w-full flex-1 py-2 ${noFlash ? '' : 'animate-in fade-in slide-in-from-bottom-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}
            >
              <Suspense
                fallback={
                  <SkeletonLoader
                    isHighContrast={isHighContrast}
                    noFlash={noFlash}
                  />
                }
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
                  userDifficulty={userDifficulty}
                  onDifficultyChange={(val) =>
                    updateSetting('userDifficulty', val)
                  }
                  bionicReading={!!settings.bionicReading}
                  speak={speak}
                  voiceAssistant={!!settings.voiceAssistant}
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
                      <span>
                        <BionicText
                          text={t('collectedLabel')}
                          enabled={!!settings.bionicReading}
                        />
                        :
                      </span>
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
                      bionicReading={!!settings.bionicReading}
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
                    className={`pointer-events-none absolute right-0 left-0 z-[100] ${bigTargets ? 'h-24' : 'h-16'} ${noFlash ? '' : 'transition-transform duration-75'} ${isHighContrast ? 'border-y-2 border-white/60 bg-white/10' : 'border-y border-indigo-500/20 bg-indigo-500/10 backdrop-invert-[0.02]'}`}
                    style={{ top: rulerPos.y - (bigTargets ? 48 : 32) }}
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
                  <BionicText
                    text={
                      t('bionicExplanation') ||
                      'Bionic Reading® is a typographic method that supports the reading flow.'
                    }
                    enabled={!!settings.bionicReading}
                  />
                </p>
              )}

              {feedback?.type === 'success' ? (
                <div className="animate-in zoom-in mt-3 flex shrink-0 flex-col items-center justify-center pb-1 duration-300 md:mt-4 md:pb-2">
                  <button
                    onClick={goNext}
                    className={`${bigTargets ? 'px-14 py-5 text-lg md:py-6' : 'px-12 py-3.5 text-sm md:py-4'} rounded-full font-black tracking-widest uppercase shadow-xl transition-all active:scale-95 ${noFlash ? '' : 'animate-bounce'} break-words hyphens-auto ${isHighContrast ? 'bg-white text-black hover:bg-slate-200' : `${themeStyles.button} ${themeStyles.buttonText} opacity-90 hover:opacity-100`}`}
                  >
                    <BionicText
                      text={t('next') || 'Next'}
                      enabled={!!settings.bionicReading}
                    />
                  </button>
                  <p
                    className={`mt-3 hidden text-[10px] font-bold md:block ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
                  >
                    💡{' '}
                    <BionicText
                      text={t('pressKey') || 'Press'}
                      enabled={!!settings.bionicReading}
                    />{' '}
                    <kbd className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-slate-600">
                      Enter
                    </kbd>{' '}
                    <BionicText
                      text={t('or') || 'or'}
                      enabled={!!settings.bionicReading}
                    />{' '}
                    <kbd className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-slate-600">
                      →
                    </kbd>{' '}
                    <BionicText
                      text={t('toContinue') || 'to continue'}
                      enabled={!!settings.bionicReading}
                    />
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
                      <BionicText
                        text={t('skip') || 'Skip'}
                        enabled={!!settings.bionicReading}
                      />
                    </button>
                    <p
                      className={`mt-3 hidden text-[10px] font-bold md:block ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
                    >
                      💡{' '}
                      <BionicText
                        text={t('pressKey') || 'Press'}
                        enabled={!!settings.bionicReading}
                      />{' '}
                      <kbd className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-slate-600">
                        →
                      </kbd>{' '}
                      <BionicText
                        text={t('toSkip') || 'to skip'}
                        enabled={!!settings.bionicReading}
                      />
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
        <BottomNav
          pillars={PILLARS}
          activeTab={activeTab}
          dailyQuests={dailyQuests}
          isGamified={isGamified}
          theme={theme}
          themeStyles={themeStyles}
          isHighContrast={isHighContrast}
          hideNavLabel={hideNavLabel}
          noFlash={noFlash}
          bigTargets={bigTargets}
          bionicReading={!!settings.bionicReading}
          t={t}
          onTabChange={handleTabChange}
          onGardenClick={handleGardenClick}
          onOpenSettings={openSettings}
          vibrate={vibrate}
        />
      </div>

      <NewTreeToast
        show={newTreeNotification}
        noFlash={noFlash}
        isHighContrast={isHighContrast}
        t={t}
      />

      <LevelUpModal
        open={showSuccess}
        isHighContrast={isHighContrast}
        noFlash={noFlash}
        bigTargets={bigTargets}
        t={t}
        onNext={handleLevelUpNext}
        bionicReading={!!settings.bionicReading}
      />

      {}
      <Dialog
        open={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          goNext();
        }}
        labelledBy="survey-title"
        overlayClassName="z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6"
        className="no-scrollbar animate-in zoom-in relative max-h-[95dvh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl duration-300"
      >
        {}
        <button
          onClick={() => {
            setShowFeedback(false);
            goNext();
          }}
          aria-label={t('close') || 'Close'}
          className="scale-size-10 absolute top-4 right-4 z-10 flex items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 transition-colors hover:bg-slate-200"
        >
          ✕
        </button>

        <Suspense
          fallback={<SkeletonLoader isHighContrast={false} noFlash={noFlash} />}
        >
          <SurveyComponent />
        </Suspense>
      </Dialog>

      <AffirmationToast
        message={affirmation}
        isHighContrast={isHighContrast}
        noFlash={noFlash}
      />

      {}
      <OfflineIndicator />

      <PwaUpdateBanner
        show={needRefresh}
        isHighContrast={isHighContrast}
        noFlash={noFlash}
        themeStyles={themeStyles}
        t={t}
        onUpdate={applyPwaUpdate}
        onDismiss={dismissPwaUpdate}
        bionicReading={!!settings.bionicReading}
      />
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
