import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Lottie from 'lottie-react';

import { useAutoReadAloud } from '../hooks/useAutoReadAloud.js';
import { useSafeTimeouts } from '../hooks/useSafeTimeouts.js';
import { getAllLogs } from '../utils/indexedDB.js';
import { safeJSONParse } from '../utils/safeJSONParse.js';

import { WeeklyCalendar } from './WeeklyCalendar.jsx';
import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';

// Matches App.jsx/useExerciseSession.js — kept local rather than shared
// since this is the only other place that needs to turn raw growthValue
// into a level number (for the share summary).
const POINTS_PER_LEVEL = 5;

function VirtualGarden({
  growthValue,
  streak,
  isHighContrast,
  theme = 'Natur',
  t,
  themeStyles,
  activeCategory = null,
  isFullScreen = false,
  noFlash = false,
  dailyProgress,
  minimalistMode = false,
  dailyGoal,
  userDifficulty,
  onDifficultyChange,
  bionicReading = false,
  speak,
  voiceAssistant = false,
}) {
  const ecosystemState = useMemo(() => {
    const growthLevel = Math.floor(growthValue / 5);

    const themeCategoryVisuals = {
      Natur: {
        Literacy: ['🌿', '🌿', '🪴', '🎋', '🌳'],
        Visual: ['🏔️', '🏔️', '🌋', '🏞️', '🗺️'],
        Cognitive: ['🌿', '🌿', '☘️', '🍀', '🍃'],
      },
      Musik: {
        Literacy: ['🎵', '🎶', '🎼', '🎹', '🎺'],
        Visual: ['🔈', '🔉', '🔊', '📈', '📉'],
        Cognitive: ['🎧', '🎤', '📻', '🎙️', '🎚️'],
      },
      Kunst: {
        Literacy: ['✏️', '✒️', '🖋️', '🖌️', '📝'],
        Visual: ['📷', '🗺️', '🌐', '🔭', '🛰️'],
        Cognitive: ['💡', '🎨', '🖼️', '🗿', '💎'],
      },
      Space: {
        Literacy: ['✨', '⭐', '🌟', '🌠', '💫'],
        Visual: ['🧭', '🗺️', '🌐', '🚀', '🪐'],
        Cognitive: ['🌑', '🌒', '🌓', '🌔', '🌕'],
      },
      Ocean: {
        Literacy: ['💧', '🌊', '🧭', '⚓', '🚢'],
        Visual: ['🧭', '⚓', '🗺️', '🌐', '🏝️'],
        Cognitive: ['🐟', '🐠', '🐡', '🐬', '🐳'],
      },
    };

    const levelIcons = t('levelIcons', { returnObjects: true });
    const progressStages = t('progressStages', { returnObjects: true });

    const themeIcons =
      activeCategory && themeCategoryVisuals[theme]?.[activeCategory]
        ? themeCategoryVisuals[theme][activeCategory]
        : levelIcons?.[theme] || levelIcons.Natur;

    const themeStages = progressStages?.[theme] || progressStages.Natur;

    const stageIndex = Math.min(growthLevel, themeIcons.length - 1);
    const plantVisual = themeIcons[stageIndex];
    const plantName = themeStages[stageIndex];

    const visitorsByTheme = {
      Natur: ['💧', '🌬️', '☀️', '⭐', '🌙'],
      Musik: ['🎵', '🎶', '🎼', '🎤', '🎧'],
      Kunst: ['💡', '🖌️', '🎨', '💎', '🏆'],
      Space: ['☄️', '🛸', '🛰️', '🚀', '🪐'],
      Ocean: ['🌊', '⚓', '🧭', '🚢', '🏝️'],
    };

    const themeVisitors = visitorsByTheme[theme] || visitorsByTheme.Natur;
    const hasVisitor = streak >= 3;

    const visitorIndex = Math.min(growthLevel, themeVisitors.length - 1);
    const visitor = hasVisitor ? themeVisitors[visitorIndex] : '';

    return {
      plantVisual,
      plantName,
      hasVisitor,
      visitor,
      themeVisitors,
    };
  }, [growthValue, streak, theme, t, activeCategory]);

  const [visitorAnimation, setVisitorAnimation] = useState(null);

  useEffect(() => {
    if (ecosystemState.hasVisitor) {
      const animationMap = {
        Natur: 'visitor-natur',
        Space: 'visitor-space',
        Musik: 'visitor-musik',
        Kunst: 'visitor-kunst',
        Ocean: 'visitor-ocean',
      };

      const animationFile = animationMap[theme] || 'visitor-natur';

      import(`../animations/${animationFile}.json`)
        .then((module) => {
          setVisitorAnimation(module.default);
        })
        .catch((error) =>
          console.warn(
            `Failed to load Lottie animation for theme '${theme}':`,
            error,
          ),
        );
    }
  }, [ecosystemState.hasVisitor, theme]);

  const [todayStats, setTodayStats] = useState(null);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    if (!isFullScreen) return;

    let isMounted = true;
    const fetchStats = async () => {
      try {
        const logs = await getAllLogs('exercise_history');
        if (!isMounted) return;

        const todayStr = new Date().toISOString().split('T')[0];
        const todayLogs = logs.filter((log) => log.date.startsWith(todayStr));

        if (todayLogs.length > 0) {
          const stats = { total: todayLogs.length, byType: {} };
          todayLogs.forEach((log) => {
            stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
          });
          setTodayStats(stats);
        }

        const uniqueDates = [
          ...new Set(logs.map((log) => log.date.split('T')[0])),
        ].sort();
        let calcCurrentStreak = 0;
        let calcHighestStreak = 0;
        let previousDate = null;

        uniqueDates.forEach((dateStr) => {
          const currentDate = new Date(dateStr);
          if (!previousDate) {
            calcCurrentStreak = 1;
          } else {
            const diffTime = currentDate - previousDate;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              calcCurrentStreak += 1;
            } else if (diffDays > 1) {
              calcCurrentStreak = 1;
            }
          }
          if (calcCurrentStreak > calcHighestStreak)
            calcHighestStreak = calcCurrentStreak;
          previousDate = currentDate;
        });
        setMaxStreak(calcHighestStreak);
      } catch (error) {
        console.warn(
          'Failed to load exercise history for daily summary',
          error,
        );
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [isFullScreen, growthValue]);

  const [justCopied, setJustCopied] = useState(false);

  const handleShare = async () => {
    const level = Math.floor(growthValue / POINTS_PER_LEVEL) + 1;

    const today = new Date();
    let goalDaysThisWeek = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      if ((dailyProgress[date.toDateString()]?.points || 0) >= dailyGoal) {
        goalDaysThisWeek += 1;
      }
    }

    const text = [
      t('sharePoints', { count: growthValue }),
      t('shareLevel', { count: level }),
      t('shareStreak', { count: maxStreak }),
      t('shareGoalDays', { count: goalDaysThisWeek }),
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: t('shareTitle'), text });
      } catch (err) {
        // AbortError just means the user closed the native share sheet —
        // not a failure worth surfacing.
        if (err.name !== 'AbortError') {
          console.warn('Failed to share progress', err);
        }
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2500);
    }
  };

  const todayKey = new Date().toDateString();
  const [checkInDone, setCheckInDone] = useState(
    () => localStorage.getItem('cfg_workload_checkin_date') === todayKey,
  );
  const [checkInDemand, setCheckInDemand] = useState(null);
  const [checkInFocus, setCheckInFocus] = useState(null);
  const [difficultyNote, setDifficultyNote] = useState(null);

  const submitWorkloadCheckIn = (demand, focus) => {
    const history = safeJSONParse(
      localStorage.getItem('cfg_workload_history'),
      [],
    );
    history.push({ date: todayKey, demand, focus });
    localStorage.setItem(
      'cfg_workload_history',
      JSON.stringify(history.slice(-14)),
    );
    localStorage.setItem('cfg_workload_checkin_date', todayKey);
    setCheckInDone(true);

    // Adaptive throttle: only look at the two most recent check-ins so one
    // rough day doesn't permanently recalibrate difficulty. Transparent by
    // design (Heumader et al.) — we always tell the user what changed and
    // that it's reversible in Settings, never adjust silently.
    const lastTwo = history.slice(-2);
    if (
      lastTwo.length === 2 &&
      lastTwo.every((entry) => entry.demand >= 4) &&
      userDifficulty > 1 &&
      onDifficultyChange
    ) {
      onDifficultyChange(userDifficulty - 1);
      setDifficultyNote('eased');
    } else if (
      lastTwo.length === 2 &&
      lastTwo.every((entry) => entry.demand <= 2) &&
      userDifficulty < 4 &&
      onDifficultyChange
    ) {
      onDifficultyChange(userDifficulty + 1);
      setDifficultyNote('raised');
    }
  };

  const skipWorkloadCheckIn = () => {
    localStorage.setItem('cfg_workload_checkin_date', todayKey);
    setCheckInDone(true);
  };

  const earnedTrophies = useMemo(() => {
    const themeMonuments = {
      Natur: [
        { req: 3, icon: '🪨' },
        { req: 7, icon: '🍄' },
        { req: 14, icon: '⛲' },
        { req: 30, icon: '🗿' },
      ],
      Musik: [
        { req: 3, icon: '📻' },
        { req: 7, icon: '🪗' },
        { req: 14, icon: '💿' },
        { req: 30, icon: '🎹' },
      ],
      Kunst: [
        { req: 3, icon: '🖍️' },
        { req: 7, icon: '🏺' },
        { req: 14, icon: '🖼️' },
        { req: 30, icon: '🏛️' },
      ],
      Space: [
        { req: 3, icon: '📡' },
        { req: 7, icon: '🛸' },
        { req: 14, icon: '🔭' },
        { req: 30, icon: '🌌' },
      ],
      Ocean: [
        { req: 3, icon: '🐚' },
        { req: 7, icon: '🦀' },
        { req: 14, icon: '🧜‍♀️' },
        { req: 30, icon: '🔱' },
      ],
    };
    const monuments = themeMonuments[theme] || themeMonuments.Natur;
    const effectiveStreak = Math.max(maxStreak, streak || 0);
    return monuments.filter((m) => effectiveStreak >= m.req);
  }, [maxStreak, streak, theme]);

  const srText = `${t('srPlantFeature')} ${ecosystemState.plantName}.
    ${ecosystemState.hasVisitor ? t('srVisitor') : ''}
    ${earnedTrophies.length > 0 ? t('srTrophies', { count: earnedTrophies.length }) : ''}`;

  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  // Same facts as `srText` above (screen-reader-only live region), just
  // built as clean, filtered segments instead of one string with blank
  // lines where a condition was false — narrated speech needs each part to
  // actually be a spoken sentence, not silently-empty template slots.
  const readGardenState = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const segments = [
      t('garden') || 'Garden',
      `${t('srPlantFeature')} ${ecosystemState.plantName}.`,
      ecosystemState.hasVisitor ? t('srVisitor') : null,
      earnedTrophies.length > 0
        ? t('srTrophies', { count: earnedTrophies.length })
        : null,
      todayStats && todayStats.total > 0
        ? `${t('dailySummary')}: ${t('exercisesCount', { count: todayStats.total })}`
        : null,
    ].filter(Boolean);
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 900;
    });
  }, [
    speak,
    t,
    ecosystemState,
    earnedTrophies,
    todayStats,
    setSafeTimeout,
    clearAllTimeouts,
  ]);

  useAutoReadAloud(!!voiceAssistant, readGardenState);

  // Leaving the Garden unmounts this component (App.jsx renders it only
  // while `activeTab === 'Garden'`), so this cleanup is what makes
  // switching away — back to an exercise, into Settings, anywhere —
  // actually cut the narration off instead of letting it talk over
  // whatever's read next.
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  // Card fill stays the same warm off-white the rest of the app uses for
  // "content on top of the themed page background" (see App.jsx's own
  // bg-[#FCFBF9] cards) — only the border picks up themeStyles.border, so
  // the Garden's own chrome (not just its growth icons) actually tracks the
  // selected theme instead of a fixed slate/white regardless of theme.
  const containerClasses = isFullScreen
    ? `relative flex flex-col items-center justify-center gap-4 sm:gap-8 w-full h-full p-4 sm:p-10 rounded-3xl sm:rounded-4xl transition-all duration-1000 ${isHighContrast ? 'bg-black border-2 border-white' : `bg-[#FCFBF9] border-2 ${themeStyles?.border || 'border-slate-100'} shadow-sm`}`
    : `relative flex items-center justify-start gap-3 flex-1 h-12 px-3 rounded-2xl border transition-all duration-700 ${isHighContrast ? 'bg-transparent border-white/30' : `bg-[#FCFBF9] ${themeStyles?.border || 'border-slate-200'}`}`;

  const plantTextSize = isFullScreen
    ? 'text-[64px] sm:text-[120px] md:text-[160px]'
    : 'text-3xl';
  const visitorTextSize = isFullScreen
    ? 'text-4xl sm:text-6xl md:text-8xl'
    : 'text-2xl';
  const visitorPosition = isFullScreen
    ? 'absolute top-4 right-4 sm:top-12 sm:right-12 md:top-20 md:right-20'
    : 'absolute -top-3 right-2';

  return (
    <div
      className={containerClasses}
      role="region"
      aria-label={t('garden') || 'Virtual Garden Progress'}
    >
      <div className="sr-only" aria-live="polite">
        {srText}
      </div>

      {minimalistMode ? (
        <div
          className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${isFullScreen ? 'mt-4 px-2 text-center text-lg sm:text-2xl' : 'px-2 text-sm'}`}
        >
          {ecosystemState.plantVisual}
        </div>
      ) : (
        <>
          <div
            className={`flex ${isFullScreen ? 'flex-col justify-center' : 'items-center'} w-full gap-4`}
            aria-hidden="true"
          >
            <div
              key={ecosystemState.plantVisual}
              className={`${plantTextSize} ${noFlash ? '' : 'animate-in fade-in duration-1000'}`}
            >
              {ecosystemState.plantVisual}
            </div>
          </div>

          {ecosystemState.hasVisitor && (
            <div
              key={ecosystemState.visitor}
              className={`${visitorPosition} ${visitorTextSize} ${noFlash ? '' : 'animate-in fade-in duration-1000'}`}
              aria-hidden="true"
            >
              <div className={noFlash ? '' : ''}>
                {visitorAnimation ? (
                  <Lottie
                    animationData={visitorAnimation}
                    autoplay={!noFlash}
                    loop={!noFlash}
                    style={{
                      width: isFullScreen ? 120 : 60,
                      height: isFullScreen ? 120 : 60,
                    }}
                  />
                ) : (
                  ecosystemState.visitor
                )}
              </div>
            </div>
          )}
        </>
      )}

      {isFullScreen && (
        <div className="animate-in fade-in mt-4 flex flex-col items-center gap-1 px-2 delay-500 duration-1000 sm:mt-8 sm:gap-2">
          <p
            className={`max-w-xs px-2 text-center text-xs leading-relaxed font-medium wrap-break-word sm:text-sm ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            <BionicText text={t('gardenEmpty')} enabled={bionicReading} />
          </p>
          <WeeklyCalendar
            dailyProgress={dailyProgress}
            dailyGoal={dailyGoal}
            t={t}
            themeStyles={themeStyles}
            isHighContrast={isHighContrast}
            theme={theme}
            noFlash={noFlash}
          />

          <button
            type="button"
            onClick={handleShare}
            className={`mt-3 flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-black tracking-widest uppercase transition-all active:scale-95 sm:mt-4 sm:px-6 sm:py-2.5 sm:text-sm ${isHighContrast ? 'border border-white bg-black text-white' : `${themeStyles?.button || 'bg-indigo-500'} ${themeStyles?.buttonText || 'text-white'} shadow-md hover:brightness-110`}`}
          >
            <span aria-hidden="true">📤</span>
            <BionicText text={t('shareProgress')} enabled={bionicReading} />
          </button>
          {justCopied && (
            <p
              role="status"
              className={`mt-1 text-[10px] font-bold sm:text-xs ${isHighContrast ? 'text-white' : 'text-emerald-600'}`}
            >
              <BionicText text={t('shareCopied')} enabled={bionicReading} />
            </p>
          )}

          {earnedTrophies.length > 0 && (
            <div
              className={`mt-4 w-full max-w-70 rounded-2xl border-2 p-3 transition-all sm:mt-6 sm:max-w-xs sm:rounded-3xl sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-bottom-4 delay-700 duration-700'} ${isHighContrast ? 'border-white/30 bg-black text-white' : `${themeStyles?.border || 'border-slate-100'} bg-[#FCFBF9] text-slate-700 shadow-sm`}`}
            >
              <h3
                className={`mb-3 text-center text-[10px] font-black tracking-widest wrap-break-word uppercase sm:mb-4 sm:text-xs ${isHighContrast ? 'text-white' : 'text-slate-600'}`}
              >
                <BionicText
                  text={t('gardenCollectionTitle')}
                  enabled={bionicReading}
                />
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {earnedTrophies.map((trophy) => trophy.icon).map((icon, i) => (
                  <div
                    key={i}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition-all sm:h-12 sm:w-12 sm:text-2xl ${noFlash ? '' : 'animate-in zoom-in duration-500'} ${isHighContrast ? 'border border-white/40 bg-white/10' : `border bg-white ${themeStyles?.border || 'border-slate-200'}`}`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Dialog
            open={!!(todayStats && todayStats.total > 0 && !checkInDone)}
            onClose={skipWorkloadCheckIn}
            labelledBy="workload-checkin-title"
            overlayClassName="z-60 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
            className={`no-scrollbar max-h-[90dvh] w-full max-w-xs overflow-y-auto rounded-3xl p-4 shadow-2xl outline-none sm:p-5 ${noFlash ? '' : 'animate-in zoom-in duration-300'} ${isHighContrast ? 'border-2 border-white bg-black text-white' : 'bg-[#FCFBF9] text-slate-700'}`}
          >
            <h3
              id="workload-checkin-title"
              className="mb-3 text-center text-[10px] font-black tracking-widest wrap-break-word text-slate-600 uppercase sm:mb-4 sm:text-xs"
            >
              <BionicText
                text={t('workloadCheckInTitle')}
                enabled={bionicReading}
              />
            </h3>

            <div className="mb-3 sm:mb-4">
              <p
                className={`mb-2 text-center text-xs font-bold sm:text-sm ${isHighContrast ? 'text-white/80' : 'text-slate-600'}`}
              >
                <BionicText
                  text={t('workloadDemandQuestion')}
                  enabled={bionicReading}
                />
              </p>
              <div
                className="flex items-center justify-center gap-1.5 sm:gap-2"
                role="radiogroup"
                aria-label={t('workloadDemandQuestion')}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={checkInDemand === n}
                    onClick={() => setCheckInDemand(n)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black transition-all active:scale-95 sm:h-10 sm:w-10 sm:text-sm ${
                      checkInDemand === n
                        ? isHighContrast
                          ? 'border-white bg-white text-black'
                          : `border-amber-500 bg-amber-500 text-white`
                        : isHighContrast
                          ? 'border-white/30 text-white/60'
                          : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div
                className={`mt-1 flex justify-between text-[9px] font-bold uppercase sm:text-[10px] ${isHighContrast ? 'text-white/50' : 'text-slate-400'}`}
              >
                <span>
                  <BionicText text={t('workloadLow')} enabled={bionicReading} />
                </span>
                <span>
                  <BionicText
                    text={t('workloadHigh')}
                    enabled={bionicReading}
                  />
                </span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <p
                className={`mb-2 text-center text-xs font-bold sm:text-sm ${isHighContrast ? 'text-white/80' : 'text-slate-600'}`}
              >
                <BionicText
                  text={t('workloadFocusQuestion')}
                  enabled={bionicReading}
                />
              </p>
              <div
                className="flex items-center justify-center gap-1.5 sm:gap-2"
                role="radiogroup"
                aria-label={t('workloadFocusQuestion')}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={checkInFocus === n}
                    onClick={() => setCheckInFocus(n)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black transition-all active:scale-95 sm:h-10 sm:w-10 sm:text-sm ${
                      checkInFocus === n
                        ? isHighContrast
                          ? 'border-white bg-white text-black'
                          : `border-emerald-700 bg-emerald-700 text-white`
                        : isHighContrast
                          ? 'border-white/30 text-white/60'
                          : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div
                className={`mt-1 flex justify-between text-[9px] font-bold uppercase sm:text-[10px] ${isHighContrast ? 'text-white/50' : 'text-slate-400'}`}
              >
                <span>
                  <BionicText
                    text={t('workloadFocusLow')}
                    enabled={bionicReading}
                  />
                </span>
                <span>
                  <BionicText
                    text={t('workloadFocusHigh')}
                    enabled={bionicReading}
                  />
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={skipWorkloadCheckIn}
                className={`text-[10px] font-bold uppercase underline sm:text-xs ${isHighContrast ? 'text-white/60' : 'text-slate-400'}`}
              >
                <BionicText text={t('skip')} enabled={bionicReading} />
              </button>
              <button
                type="button"
                disabled={checkInDemand === null || checkInFocus === null}
                onClick={() =>
                  submitWorkloadCheckIn(checkInDemand, checkInFocus)
                }
                className={`rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-40 sm:px-6 sm:py-2 sm:text-xs ${isHighContrast ? 'border border-white bg-black text-white' : `${themeStyles?.button || 'bg-indigo-500'} ${themeStyles?.buttonText || 'text-white'}`}`}
              >
                <BionicText
                  text={t('workloadSubmit')}
                  enabled={bionicReading}
                />
              </button>
            </div>
          </Dialog>

          {checkInDone && difficultyNote && (
            <p
              role="status"
              className={`mt-4 max-w-xs px-2 text-center text-[10px] font-bold sm:text-xs ${isHighContrast ? 'text-white' : 'text-indigo-600'}`}
            >
              <BionicText
                text={t(
                  difficultyNote === 'eased'
                    ? 'workloadEasedNote'
                    : 'workloadRaisedNote',
                )}
                enabled={bionicReading}
              />
            </p>
          )}

          {todayStats && todayStats.total > 0 && (
            <div
              className={`mt-4 w-full max-w-70 rounded-2xl border-2 p-3 transition-all sm:mt-6 sm:max-w-xs sm:rounded-3xl sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-bottom-4 delay-700 duration-700'} ${isHighContrast ? 'border-white/30 bg-black text-white' : `${themeStyles?.border || 'border-slate-100'} bg-[#FCFBF9] text-slate-700 shadow-sm`}`}
            >
              <h3 className="mb-3 text-center text-[10px] font-black tracking-widest wrap-break-word text-slate-600 uppercase sm:mb-4 sm:text-xs">
                <BionicText text={t('dailySummary')} enabled={bionicReading} />
              </h3>
              <div className="flex flex-col gap-2 sm:gap-3">
                {Object.entries(todayStats.byType).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex flex-nowrap items-center justify-between gap-2 text-[10px] sm:text-sm"
                  >
                    <span
                      className={`min-w-0 flex-1 truncate font-bold ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
                    >
                      <BionicText
                        text={
                          t('categories', { returnObjects: true })?.[type] ||
                          t('pillars', { returnObjects: true })?.[type] ||
                          type
                        }
                        enabled={bionicReading}
                      />
                    </span>
                    <span
                      className={`font-black whitespace-nowrap ${isHighContrast ? 'text-white' : themeStyles?.accent || ''}`}
                    >
                      <BionicText
                        text={t('exercisesCount', { count })}
                        enabled={bionicReading}
                      />
                    </span>
                  </div>
                ))}
                <div
                  className={`my-1 h-px ${isHighContrast ? 'bg-white/20' : 'bg-slate-100'}`}
                />
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <span
                    className={`text-[9px] font-black tracking-widest uppercase sm:text-xs ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
                  >
                    <BionicText
                      text={t('totalEffort')}
                      enabled={bionicReading}
                    />
                  </span>
                  <span
                    className={`text-sm font-black sm:text-lg ${isHighContrast ? 'text-white' : themeStyles?.accent || ''}`}
                  >
                    {todayStats.total}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(VirtualGarden);
