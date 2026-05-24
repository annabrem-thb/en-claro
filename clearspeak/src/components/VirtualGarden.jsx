import React, { useMemo, useState, useEffect } from 'react';
import Lottie from 'lottie-react'; 

import { WeeklyCalendar } from './WeeklyCalendar.jsx';
import { getAllLogs } from '../utils/indexedDB.js';
import BionicText from '../components/common/BionicText.jsx';

export default function VirtualGarden({ 
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
  dailyGoal
}) {
  const ecosystemState = useMemo(() => {
    const growthLevel = Math.floor(points / 5);
    
    const themeCategoryVisuals = {
      Natur: {
        Literacy:  ['🌿', '🌿', '🪴', '🎋', '🌳'],
        Visual:  ['🏔️', '🏔️', '🌋', '🏞️', '🗺️'],
        Cognitive: ['🌿', '🌿', '☘️', '🍀', '🍃'],
      },
      Musik: {
        Literacy:  ['🎵', '🎶', '🎼', '🎹', '🎺'],
        Visual:  ['🔈', '🔉', '🔊', '📈', '📉'],
        Cognitive: ['🎧', '🎤', '📻', '🎙️', '🎚️'],
      },
      Kunst: {
        Literacy:  ['✏️', '✒️', '🖋️', '🖌️', '📝'],
        Visual:  ['📷', '🗺️', '🌐', '🔭', '🛰️'],
        Cognitive: ['💡', '🎨', '🖼️', '🗿', '💎'],
      },
      Space: {
        Literacy:  ['✨', '⭐', '🌟', '🌠', '💫'],
        Visual:  ['🧭', '🗺️', '🌐', '🚀', '🪐'],
        Cognitive: ['🌑', '🌒', '🌓', '🌔', '🌕'],
      },
      Ocean: {
        Literacy:  ['💧', '🌊', '🧭', '⚓', '🚢'],
        Visual:  ['🧭', '⚓', '🗺️', '🌐', '🏝️'],
        Cognitive: ['🐟', '🐠', '🐡', '🐬', '🐳'],
      }
    };

    const themeIcons = (activeCategory && themeCategoryVisuals[theme]?.[activeCategory])
      ? themeCategoryVisuals[theme][activeCategory]
      : (t?.levelIcons?.[theme] || ['🌿', '☘️', '🌳', '🌲', '🏔️']);
      
    const themeStages = t?.progressStages?.[theme] || ["Seed", "Stem", "Bud", "Blooming", "Flower"];

    const stageIndex = Math.min(growthLevel, themeIcons.length - 1);
    const plantVisual = themeIcons[stageIndex];
    const plantName = themeStages[stageIndex];

    const completedModules = dailyQuests?.tasks?.filter(t => t.completed).length || 0;
    
    const questIconsByTheme = {
      Natur: '🏅',
      Musik: '🏅',
      Kunst: '🏅',
      Space: '🏅',
      Ocean: '🏅'
    };
    const questIcon = questIconsByTheme[theme] || '🏅';
    const flowers = Array.from({ length: completedModules }).map(() => questIcon);

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

    return { plantVisual, plantName, flowers, hasVisitor, visitor, completedModules, themeVisitors };
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

      import(`../assets/animations/${animationFile}.json`)
        .then((module) => {
          setVisitorAnimation(module.default);
        })
        .catch((error) => console.warn(`Nie udało się załadować animacji Lottie dla motywu '${theme}':`, error));
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
        const todayLogs = logs.filter(log => log.date.startsWith(todayStr));

        if (todayLogs.length > 0) {
          const stats = { total: todayLogs.length, byType: {} };
          todayLogs.forEach(log => {
            stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
          });
          setTodayStats(stats);
        }
          
          const uniqueDates = [...new Set(logs.map(log => log.date.split('T')[0]))].sort();
          let calcCurrentStreak = 0;
          let calcHighestStreak = 0;
          let previousDate = null;

          uniqueDates.forEach(dateStr => {
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
            if (calcCurrentStreak > calcHighestStreak) calcHighestStreak = calcCurrentStreak;
            previousDate = currentDate;
          });
          setMaxStreak(calcHighestStreak);
          
      } catch (error) {
        console.warn("Failed to load exercise history for daily summary", error);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, [isFullScreen, points]);

  const earnedTrophies = useMemo(() => {
    const themeMonuments = {
      Natur: [ { req: 3, icon: '🪨' }, { req: 7, icon: '🍄' }, { req: 14, icon: '⛲' }, { req: 30, icon: '🗿' } ],
      Musik: [ { req: 3, icon: '📻' }, { req: 7, icon: '🪗' }, { req: 14, icon: '💿' }, { req: 30, icon: '🎹' } ],
      Kunst: [ { req: 3, icon: '🖍️' }, { req: 7, icon: '🏺' }, { req: 14, icon: '🖼️' }, { req: 30, icon: '🏛️' } ],
      Space: [ { req: 3, icon: '📡' }, { req: 7, icon: '🛸' }, { req: 14, icon: '🔭' }, { req: 30, icon: '🌌' } ],
      Ocean: [ { req: 3, icon: '🐚' }, { req: 7, icon: '🦀' }, { req: 14, icon: '🧜‍♀️' }, { req: 30, icon: '🔱' } ],
    };
    const monuments = themeMonuments[theme] || themeMonuments.Natur;
    return monuments.filter(m => maxStreak >= m.req);
  }, [maxStreak, theme]);

  const srText = `${t.srPlantFeature || 'Deine Reise beinhaltet aktuell ein(e)'} ${ecosystemState.plantName}. 
    ${ecosystemState.completedModules > 0 ? `${t.srDailyRewards || 'Es hat'} ${ecosystemState.completedModules} ${t.srRewardsCount || 'tägliche Belohnungen.'}` : ''} 
    ${ecosystemState.hasVisitor ? (t.srVisitor || 'Ein freundlicher Besucher hat sich dir aufgrund deiner beständigen Übung angeschlossen.') : ''}
    ${earnedTrophies.length > 0 && t.srTrophies ? t.srTrophies.replace('{count}', earnedTrophies.length) : ''}`;

  const containerClasses = isFullScreen
    ? `relative flex flex-col items-center justify-center gap-8 w-full h-full p-6 sm:p-10 rounded-4xl transition-all duration-1000 ${isHighContrast ? 'bg-black border-2 border-white' : `bg-white border-2 border-slate-100 shadow-sm`}`
    : `relative flex items-center justify-start gap-3 flex-1 h-12 px-3 rounded-2xl border transition-all duration-700 ${isHighContrast ? 'bg-transparent border-white/30' : `bg-slate-50 border-slate-200`}`;

  const plantTextSize = isFullScreen ? 'text-[120px] md:text-[160px]' : 'text-3xl';
  const flowerTextSize = isFullScreen ? 'text-4xl md:text-5xl' : 'text-lg';
  const visitorTextSize = isFullScreen ? 'text-6xl md:text-8xl' : 'text-2xl';
  const visitorPosition = isFullScreen ? 'absolute top-12 right-12 md:top-20 md:right-20' : 'absolute -top-3 right-2';

  return (
    <div className={containerClasses} aria-label="Progress Bar">
      <div className="sr-only" aria-live="polite">
        {srText}
      </div>

      {isFullScreen && (
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 text-4xl sm:text-5xl drop-shadow-md" aria-hidden="true">🧠</div>
      )}

      {minimalistMode ? (
        <div className={`flex items-center gap-3 ${isFullScreen ? 'justify-center text-2xl mt-4' : 'px-2 text-sm'}`}>
          <span className={`font-black uppercase tracking-widest ${isHighContrast ? 'text-white' : themeStyles?.accent}`}>{ecosystemState.plantName}</span>
          {ecosystemState.completedModules > 0 && (
            <span className={`opacity-70 font-medium ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>(+{ecosystemState.completedModules})</span>
          )}
        </div>
      ) : (
        <>

      <div className={`flex ${isFullScreen ? 'flex-col justify-center' : 'items-center'} gap-4 w-full`} aria-hidden="true">
        <div 
          key={ecosystemState.plantVisual}
          className={`${plantTextSize} ${noFlash ? '' : 'animate-in fade-in duration-1000'}`}
        >
          {ecosystemState.plantVisual}
        </div>

        <div className={`flex flex-wrap ${isFullScreen ? 'justify-center gap-4' : 'gap-0.5 items-center'}`}>
          {ecosystemState.flowers.map((flower, i) => (
            <span 
              key={i} 
              className={`${flowerTextSize} ${noFlash ? '' : 'animate-in fade-in duration-700 delay-150'}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {flower}
            </span>
          ))}
        </div>
        
        {isFullScreen && earnedTrophies.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-6">
            {earnedTrophies.map((trophy, i) => (
              <div 
                key={i} 
                className={`text-4xl md:text-5xl ${noFlash ? '' : 'animate-in fade-in duration-1000'}`}
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
                style={{ width: isFullScreen ? 120 : 60, height: isFullScreen ? 120 : 60 }}
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
        <div className="flex flex-col items-center gap-2 mt-8 animate-in fade-in duration-1000 delay-500">
          <h2 className={`text-xl md:text-2xl font-bold uppercase tracking-widest ${isHighContrast ? 'text-white' : 'text-slate-600'}`}>
            {ecosystemState.plantName}
          </h2>
          <p className={`text-sm font-medium max-w-xs text-center leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
            <BionicText>
              {ecosystemState.completedModules > 0 
                ? `${t.gardenBlooming || 'Der Garten blüht! Erreichte Ziele:'} ${ecosystemState.completedModules}` 
                : (t.gardenEmpty || 'Dein eigenes Ökosystem. Es wächst mit jedem deiner Fortschritte.')}
            </BionicText>
          </p>
          <WeeklyCalendar
            dailyProgress={dailyProgress}
            dailyGoal={dailyGoal}
            t={t}
            themeStyles={themeStyles}
            isHighContrast={isHighContrast}
            theme={theme}
          />
          
          {todayStats && todayStats.total > 0 && (
            <div className={`w-full max-w-xs mt-6 p-5 rounded-3xl border-2 transition-all animate-in slide-in-from-bottom-4 duration-700 delay-700 ${isHighContrast ? 'bg-black border-white/30 text-white' : 'bg-white border-slate-100 shadow-sm text-slate-700'}`}>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">
                {t.dailySummary}
              </h3>
              <div className="flex flex-col gap-3">
                {Object.entries(todayStats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className={`font-bold ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>{t.categories?.[type] || t.pillars?.[type] || type}</span>
                    <span className={`font-black ${isHighContrast ? 'text-white' : themeStyles?.accent || ''}`}>{count} {t.exercisesCount}</span>
                  </div>
                ))}
                <div className={`h-px my-1 ${isHighContrast ? 'bg-white/20' : 'bg-slate-100'}`} />
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-black uppercase text-xs tracking-widest ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{t.totalEffort}</span>
                  <span className={`font-black text-lg ${isHighContrast ? 'text-white' : themeStyles?.accent || ''}`}>{todayStats.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}