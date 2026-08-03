import React, { useMemo, useState, useEffect } from 'react';

import Lottie from 'lottie-react';

import { getAllLogs } from '../utils/indexedDB.js';

import { WeeklyCalendar } from './WeeklyCalendar.jsx';
import BionicText from './common/BionicText.jsx';

function VirtualGarden({
  points,
  streak,
  dailyQuests,
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
}) {
  const ecosystemState = useMemo(() => {
    const growthLevel = Math.floor(points / 5);

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

    const completedModules =
      dailyQuests?.tasks?.filter((t) => t.completed).length || 0;

    const questIconsByTheme = {
      Natur: '🏅',
      Musik: '🏅',
      Kunst: '🏅',
      Space: '🏅',
      Ocean: '🏅',
    };
    const questIcon = questIconsByTheme[theme] || '🏅';
    const flowers = Array.from({ length: completedModules }).map(
      () => questIcon,
    );

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
      flowers,
      hasVisitor,
      visitor,
      completedModules,
      themeVisitors,
    };
  }, [points, streak, dailyQuests, theme, t, activeCategory]);

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
  }, [isFullScreen, points]);

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
    ${ecosystemState.completedModules > 0 ? `${t('srDailyRewards')} ${ecosystemState.completedModules} ${t('srRewardsCount')}` : ''}
    ${ecosystemState.hasVisitor ? t('srVisitor') : ''}
    ${earnedTrophies.length > 0 ? t('srTrophies', { count: earnedTrophies.length }) : ''}`;

  const containerClasses = isFullScreen
    ? `relative flex flex-col items-center justify-center gap-4 sm:gap-8 w-full h-full p-4 sm:p-10 rounded-3xl sm:rounded-4xl transition-all duration-1000 ${isHighContrast ? 'bg-black border-2 border-white' : `bg-white border-2 border-slate-100 shadow-sm`}`
    : `relative flex items-center justify-start gap-3 flex-1 h-12 px-3 rounded-2xl border transition-all duration-700 ${isHighContrast ? 'bg-transparent border-white/30' : `bg-slate-50 border-slate-200`}`;

  const plantTextSize = isFullScreen
    ? 'text-[64px] sm:text-[120px] md:text-[160px]'
    : 'text-3xl';
  const flowerTextSize = isFullScreen
    ? 'text-2xl sm:text-4xl md:text-5xl'
    : 'text-lg';
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
          <span
            className={`text-center font-black tracking-widest uppercase ${isHighContrast ? 'text-white' : themeStyles?.accent}`}
          >
            {ecosystemState.plantName}
          </span>
          {ecosystemState.completedModules > 0 && (
            <span
              className={`font-medium opacity-70 ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
            >
              (+{ecosystemState.completedModules})
            </span>
          )}
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

            <div
              className={`flex flex-wrap ${isFullScreen ? 'justify-center gap-4' : 'items-center gap-0.5'}`}
            >
              {ecosystemState.flowers.map((flower, i) => (
                <span
                  key={i}
                  className={`${flowerTextSize} ${noFlash ? '' : 'animate-in fade-in delay-150 duration-700'}`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {flower}
                </span>
              ))}
            </div>

            {isFullScreen && earnedTrophies.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-3 sm:mt-4 sm:gap-6 md:mt-6">
                {earnedTrophies.map((trophy, i) => (
                  <div
                    key={i}
                    className={`text-3xl sm:text-4xl md:text-5xl ${noFlash ? '' : 'animate-in fade-in duration-1000'}`}
                    style={{ animationDelay: `${(i + 1) * 300}ms` }}
                  >
                    {trophy.icon}
                  </div>
                ))}
              </div>
            )}
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
          <h2
            className={`text-center text-lg font-bold tracking-widest uppercase sm:text-xl md:text-2xl ${isHighContrast ? 'text-white' : 'text-slate-600'}`}
          >
            {ecosystemState.plantName}
          </h2>
          <p
            className={`max-w-xs px-2 text-center text-xs leading-relaxed font-medium break-words sm:text-sm ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            <BionicText>
              {ecosystemState.completedModules > 0
                ? `${t('gardenBlooming')} ${ecosystemState.completedModules}`
                : t('gardenEmpty')}
            </BionicText>
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

          {todayStats && todayStats.total > 0 && (
            <div
              className={`mt-4 w-full max-w-[280px] rounded-2xl border-2 p-3 transition-all sm:mt-6 sm:max-w-xs sm:rounded-3xl sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-bottom-4 delay-700 duration-700'} ${isHighContrast ? 'border-white/30 bg-black text-white' : 'border-slate-100 bg-white text-slate-700 shadow-sm'}`}
            >
              <h3 className="mb-3 text-center text-[10px] font-black tracking-widest break-words text-slate-600 uppercase sm:mb-4 sm:text-xs">
                {t('dailySummary')}
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
                      {t('categories', { returnObjects: true })?.[type] ||
                        t('pillars', { returnObjects: true })?.[type] ||
                        type}
                    </span>
                    <span
                      className={`font-black whitespace-nowrap ${isHighContrast ? 'text-white' : themeStyles?.accent || ''}`}
                    >
                      {t('exercisesCount', { count })}
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
                    {t('totalEffort')}
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
