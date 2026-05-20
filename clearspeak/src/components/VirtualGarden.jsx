import React, { useMemo, useState, useEffect } from 'react';
// Upewnij się, że masz zainstalowane: npm install lottie-react
import Lottie from 'lottie-react'; 

import WeeklyCalendar from './WeeklyCalendar.jsx';

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
  dailyGoal
}) {
  // 1. Ecosystem Mapping Logic
  const ecosystemState = useMemo(() => {
    // Map total points to the main plant's structural growth
    const growthLevel = Math.floor(points / 5);
    
    // Map pillars to specific visual elements across ALL themes (Organic Progress Visualization)
    const themeCategoryVisuals = {
      Natur: {
        Spelling:  ['🌿', '🌿', '🪴', '🎋', '🌳'], // Growth from herb to tree
        Structure: ['🌿', '🌿', '🪴', '🌲', '🌴'], // Structural plants
        Memory:    ['🌿', '🌿', '☘️', '🍀', '🍃'], // Leaf variations
        Spatial:   ['🏔️', '🏔️', '🌋', '🏞️', '🗺️'], // Landscapes
      },
      Musik: {
        Spelling:  ['🎵', '🎶', '🎼', '🎹', '🎺'], // From note to instrument
        Structure: ['-','=', '≡', '🎼', '📊'], // From simple line to complex chart
        Memory:    ['🎧', '🎤', '📻', '🎙️', '🎚️'], // Audio equipment
        Spatial:   ['🔈', '🔉', '🔊', '📈', '📉'], // Volume and charts
      },
      Kunst: {
        Spelling:  ['✏️', '✒️', '🖋️', '🖌️', '📝'], // Writing and drawing tools
        Structure: ['📏', '📐', '🧭', '🏛️', '🏗️'], // Tools and architecture
        Memory:    ['💡', '🎨', '🖼️', '🗿', '💎'], // Idea, art, masterpiece
        Spatial:   ['📷', '🗺️', '🌐', '🔭', '🛰️'], // Perspective and exploration
      },
      Space: {
        Spelling:  ['✨', '⭐', '🌟', '🌠', '💫'], // Star evolution
        Structure: ['🛰️', '📡', '🔭', '🌌', '🌍'], // From satellite to galaxy
        Memory:    ['🌑', '🌒', '🌓', '🌔', '🌕'], // Memory of phases
        Spatial:   ['🧭', '🗺️', '🌐', '🚀', '🪐'], // Navigation and exploration
      },
      Ocean: {
        Spelling:  ['💧', '🌊', '🧭', '⚓', '🚢'], // From drop to ship
        Structure: ['🪸', '🐚', '💎', '🔱', '🗺️'], // Structures and treasures
        Memory:    ['🐟', '🐠', '🐡', '🐬', '🐳'], // Kept fish as they are fairly neutral
        Spatial:   ['🧭', '⚓', '🗺️', '🌐', '🏝️'], // Navigation
      }
    };

    // Pick the visual progression based on the current theme and active exercise category
    const themeIcons = (activeCategory && themeCategoryVisuals[theme]?.[activeCategory])
      ? themeCategoryVisuals[theme][activeCategory]
      : (t?.levelIcons?.[theme] || ['🌿', '☘️', '🌳', '🌲', '🏔️']);
      
    const themeStages = t?.progressStages?.[theme] || ["Seed", "Stem", "Bud", "Blooming", "Flower"];

    const stageIndex = Math.min(growthLevel, themeIcons.length - 1);
    const plantVisual = themeIcons[stageIndex];
    const plantName = themeStages[stageIndex];

    // Map completed optional quests to blooming flowers
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

    // Map consistency (streak) to environmental fauna based on theme and points
    const visitorsByTheme = {
      Natur: ['💧', '🌬️', '☀️', '⭐', '🌙'], // Weather/Nature phenomena
      Musik: ['🎵', '🎶', '🎼', '🎤', '🎧'], // Music symbols
      Kunst: ['💡', '🖌️', '🎨', '💎', '🏆'], // Art/Idea symbols
      Space: ['☄️', '🛸', '🛰️', '🚀', '🪐'], // Space objects
      Ocean: ['🌊', '⚓', '🧭', '🚢', '🏝️'], // Sea/Navigation symbols
    };
    
    const themeVisitors = visitorsByTheme[theme] || visitorsByTheme.Natur;
    const hasVisitor = streak >= 3;
    
    // Pick a visitor that evolves as the plant grows
    const visitorIndex = Math.min(growthLevel, themeVisitors.length - 1);
    const visitor = hasVisitor ? themeVisitors[visitorIndex] : '';

    return { plantVisual, plantName, flowers, hasVisitor, visitor, completedModules, themeVisitors };
  }, [points, streak, dailyQuests, theme, t, activeCategory]);

  // Asynchroniczne ładowanie pliku JSON z animacją Lottie
  const [visitorAnimation, setVisitorAnimation] = useState(null);
  
  useEffect(() => {
    if (ecosystemState.hasVisitor) {
      // 1. Zdefiniuj mapowanie motywów na nazwy plików animacji
      const animationMap = {
        Natur: 'visitor-natur',
        Space: 'visitor-space',
        Musik: 'visitor-musik',
        Kunst: 'visitor-kunst',
        Ocean: 'visitor-ocean',
      };

      // 2. Wybierz plik animacji na podstawie motywu, z domyślnym fallbackiem
      const animationFile = animationMap[theme] || 'visitor-natur';

      // 3. Użyj dynamicznego importu z szablonem, aby załadować właściwy plik
      import(`../assets/animations/${animationFile}.json`)
        .then((module) => {
          setVisitorAnimation(module.default);
        })
        .catch((error) => console.warn(`Nie udało się załadować animacji Lottie dla motywu '${theme}':`, error));
    }
  }, [ecosystemState.hasVisitor, theme]); // Dodaj 'theme' do zależności, aby animacja zmieniała się z motywem

  // 2. Accessibility Screen Reader Text (WCAG Compliant)
  const srText = `${t.srPlantFeature || 'Deine Reise beinhaltet aktuell ein(e)'} ${ecosystemState.plantName}. 
    ${ecosystemState.completedModules > 0 ? `${t.srDailyRewards || 'Es hat'} ${ecosystemState.completedModules} ${t.srRewardsCount || 'tägliche Belohnungen.'}` : ''} 
    ${ecosystemState.hasVisitor ? (t.srVisitor || 'Ein freundlicher Besucher hat sich dir aufgrund deiner beständigen Übung angeschlossen.') : ''}`;

  // Dynamic classes based on full screen state
  const containerClasses = isFullScreen
    ? `relative flex flex-col items-center justify-center gap-8 w-full h-full p-6 sm:p-10 rounded-4xl transition-all duration-1000 ${isHighContrast ? 'bg-black border-4 border-white/30' : `${themeStyles?.bg || 'bg-slate-50'} border-4 ${themeStyles?.border || 'border-transparent'} shadow-2xl`}`
    : `relative flex items-center justify-start gap-3 flex-1 h-12 px-3 rounded-2xl border transition-all duration-700 ${isHighContrast ? 'bg-transparent border-white/30' : `${themeStyles?.bg || 'bg-slate-50'} ${themeStyles?.border || 'border-transparent'} shadow-inner`}`;

  const plantTextSize = isFullScreen ? 'text-[120px] md:text-[160px]' : 'text-3xl';
  const flowerTextSize = isFullScreen ? 'text-4xl md:text-5xl' : 'text-lg';
  const visitorTextSize = isFullScreen ? 'text-6xl md:text-8xl' : 'text-2xl';
  const visitorPosition = isFullScreen ? 'absolute top-12 right-12 md:top-20 md:right-20' : 'absolute -top-3 right-2';

  return (
    <div className={containerClasses} aria-label="Progress Bar">
      {/* Screen Reader Only Announcement */}
      <div className="sr-only" aria-live="polite">
        {srText}
      </div>

      {/* Visual Garden Elements (Hidden from Screen Readers to avoid emoji clutter) */}
      <div className={`flex ${isFullScreen ? 'flex-col justify-center' : 'items-center'} gap-4 w-full`} aria-hidden="true">
        {/* Main Plant */}
        <div 
          key={ecosystemState.plantVisual}
          className={`${plantTextSize} ${noFlash ? '' : 'animate-in zoom-in slide-in-from-bottom-4 duration-1000'} drop-shadow-lg`}
        >
          {ecosystemState.plantVisual}
        </div>

        {/* Blooming Flowers based on daily quests */}
        <div className={`flex flex-wrap ${isFullScreen ? 'justify-center gap-4' : 'gap-0.5 items-center'}`}>
          {ecosystemState.flowers.map((flower, i) => (
            <span 
              key={i} 
              className={`${flowerTextSize} ${noFlash ? '' : 'animate-in zoom-in duration-500 delay-150'} drop-shadow-md`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {flower}
            </span>
          ))}
        </div>
      </div>

      {/* Consistency Fauna (Streak Visitor) */}
      {ecosystemState.hasVisitor && (
        <div 
          key={ecosystemState.visitor}
          className={`${visitorPosition} ${visitorTextSize} drop-shadow-xl ${noFlash ? '' : 'animate-in zoom-in slide-in-from-top-8 duration-1000'}`} 
          aria-hidden="true"
        >
          <div className={noFlash ? '' : 'animate-bounce'} style={{ animationDuration: '4s' }}>
            {visitorAnimation ? (
              <Lottie 
                animationData={visitorAnimation} 
                autoplay={!noFlash} 
                loop={!noFlash} 
                style={{ width: isFullScreen ? 120 : 60, height: isFullScreen ? 120 : 60 }}
              /> 
            ) : (
              // Zapasowy wariant (emoji), dopóki animacja się nie załaduje lub jeśli wystąpi błąd
              ecosystemState.visitor
            )}
          </div>
        </div>
      )}

      {/* Extended Text Only For Full Screen Dashboard */}
      {isFullScreen && (
        <div className="flex flex-col items-center gap-2 mt-8 animate-in fade-in duration-1000 delay-500">
          <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-widest ${isHighContrast ? 'text-white' : themeStyles?.accent || 'text-slate-800'}`}>
            {ecosystemState.plantName}
          </h2>
          <p className={`text-sm font-medium max-w-xs text-center leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
            {ecosystemState.completedModules > 0 
              ? `${t.gardenBlooming || 'Der Garten blüht! Erreichte Ziele:'} ${ecosystemState.completedModules}` 
              : (t.gardenEmpty || 'Dein eigenes Ökosystem. Es wächst mit jedem deiner Fortschritte.')}
          </p>
          <WeeklyCalendar
            dailyProgress={dailyProgress}
            dailyGoal={dailyGoal}
            t={t}
            themeStyles={themeStyles}
            isHighContrast={isHighContrast}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}