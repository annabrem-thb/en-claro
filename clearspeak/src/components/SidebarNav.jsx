import React, { memo } from 'react';
import AccessibleTTS from './common/AccessibleTTS.jsx';
import { CognitiveEnergyIndicator } from './CognitiveEnergyIndicator.jsx';

const PILLAR_ICONS = { Literacy: '📖', Visual: '👁️', Cognitive: '🧩' };

const SidebarNav = memo(function SidebarNav({
  pillars,
  activeTab,
  onTabChange,
  onGardenClick,
  dailyQuests,
  language,
  isGamified,
  theme,
  themeStyles,
  isHighContrast,
  bigTargets,
  hideNavLabel,
  setSettingsOpen,
  t,
  coins,
  loadLevel,
  s,
  speak,
  noFlash
}) {
  const animClass = noFlash ? '' : 'animate-in fade-in slide-in-from-bottom-12 md:slide-in-from-bottom-0 md:slide-in-from-left-12 duration-700 ease-out';

  return (
    <aside className={`w-full md:w-60 flex flex-row md:flex-col shrink-0 min-h-0 z-40 order-last md:order-first ${animClass} ${isHighContrast ? 'bg-black border-t md:border-t-0 md:border-r border-white/20 shadow-sm' : `bg-[#fdfaf6] border-t md:border-t-0 md:border-r ${themeStyles.border} shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-xl md:shadow-slate-200/50`}`}>
      <div className={`hidden md:flex p-3 md:p-5 items-center gap-2 shrink-0 h-16 ${isHighContrast ? 'border-b border-white/20' : `border-b ${themeStyles.border}`}`}>
        <span className="text-2xl drop-shadow-sm" aria-hidden="true">🧠</span>
        <AccessibleTTS text={s.appTitle} speak={speak} language={language} className="hidden md:flex">
          <h1 className={`font-black text-base tracking-tighter ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>{s.appTitle}</h1>
        </AccessibleTTS>
      </div>
      
      <nav className="flex-1 min-h-0 overflow-x-auto md:overflow-y-auto no-scrollbar py-2 md:py-3 px-2 md:px-3 flex flex-row md:flex-col gap-1 md:gap-1.5 justify-between md:justify-start" aria-label={s.navAria}>
        {pillars.map((p, index) => {
          const isSelected     = activeTab === p;
          const questForPillar = dailyQuests.tasks.find(q => q.type === p);
          const label          = t.pillars?.[p] || p;
          return (
            <button key={p}
              onClick={() => onTabChange(p)}
              title={`Shortcut: Ctrl + ${index + 1}`}
              className={`relative group flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 ${bigTargets ? 'p-2 md:p-5' : 'p-1.5 md:p-3'} shrink-0 rounded-xl md:rounded-2xl transition-all duration-300 flex-1 md:flex-none ${isSelected ? (isHighContrast ? 'bg-white text-black font-black shadow-lg scale-105 z-10' : `bg-white ${themeStyles.accent} font-black shadow-md ring-1 ring-slate-900/5 scale-[1.02] z-10`) : (isHighContrast ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 hover:shadow-sm')}`}
              aria-current={isSelected ? 'page' : undefined}
              aria-label={label}
            >
              <span className={hideNavLabel ? 'text-2xl' : 'text-xl md:text-xl'} aria-hidden="true">{PILLAR_ICONS[p]}</span>
              {!hideNavLabel && (
                <>
                  <AccessibleTTS text={label} speak={speak} language={language} className="flex md:flex min-w-0">
                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider truncate max-w-full">{label.split(' ')[0]}</span>
                  </AccessibleTTS>
                  <span className={`hidden lg:block shrink-0 ml-auto text-[10px] font-mono font-bold tracking-tighter transition-opacity ${isSelected ? 'opacity-50' : 'opacity-0 group-hover:opacity-40'}`} aria-hidden="true">
                    ^ {index + 1}
                  </span>
                </>
              )}
              {questForPillar && !questForPillar.completed && questForPillar.current > 0 && (
                <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true" />
              )}
            </button>
          );
        })}
        
        <div className={`hidden md:block my-2 border-t ${isHighContrast ? 'border-white/20' : themeStyles.border}`} />
        <div className={`block md:hidden w-px my-1 border-l ${isHighContrast ? 'border-white/20' : themeStyles.border}`} />
        
        {isGamified && (
          <button
            onClick={onGardenClick}
            title="Shortcut: Ctrl + 4"
            className={`relative group flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 ${bigTargets ? 'p-2 md:p-5' : 'p-1.5 md:p-3'} shrink-0 rounded-xl md:rounded-2xl transition-all duration-300 flex-1 md:flex-none ${activeTab === 'Garden' ? (isHighContrast ? 'bg-white text-black font-black shadow-lg scale-105 z-10' : `bg-white ${themeStyles.accent} font-black shadow-md ring-1 ring-slate-900/5 scale-[1.02] z-10`) : (isHighContrast ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 hover:shadow-sm')}`}
            aria-current={activeTab === 'Garden' ? 'page' : undefined}
            aria-label={t.garden || "Garden"}
          >
            <span className={hideNavLabel ? 'text-2xl' : 'text-xl md:text-xl'} aria-hidden="true">
              {t?.levelIcons?.[theme]?.[0] || '🌱'}
            </span>
            {!hideNavLabel && (
              <>
                <AccessibleTTS text={t.garden || "Garden"} speak={speak} language={language} className="flex md:flex min-w-0">
                  <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider truncate max-w-full">{t.garden || "Garden"}</span>
                </AccessibleTTS>
                <span className={`hidden lg:block shrink-0 ml-auto text-[10px] font-mono font-bold tracking-tighter transition-opacity ${activeTab === 'Garden' ? 'opacity-50' : 'opacity-0 group-hover:opacity-40'}`} aria-hidden="true">
                  ^ 4
                </span>
              </>
            )}
          </button>
        )}

        {isGamified && (
          <div className={`hidden md:flex flex-col gap-2 mt-auto pt-3 border-t ${isHighContrast ? 'border-white/20' : themeStyles.border}`}>
            <div className="flex items-center justify-between px-2 pt-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{t.coins || 'Coins'}</span>
              <div className={`px-2 py-0.5 rounded-full font-black text-xs flex items-center gap-1 shadow-inner ${isHighContrast ? 'bg-white text-black' : 'bg-amber-100 text-amber-600'}`}>
                <span className="text-sm">💰</span> {coins}
              </div>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{t.energyTitle || 'Energy'}</span>
              <CognitiveEnergyIndicator loadLevel={loadLevel} t={t} themeStyles={themeStyles} isHighContrast={isHighContrast} noFlash={noFlash} bigTargets={bigTargets} />
            </div>
          </div>
        )}

        <button
          onClick={() => setSettingsOpen(true)}
          title="Shortcut: Ctrl + ,"
          className={`group flex flex-col md:flex-row items-center justify-center md:justify-start ${isGamified ? 'mt-2 md:mt-0' : 'md:mt-auto'} gap-1 md:gap-3 ${bigTargets ? 'p-2 md:p-5' : 'p-1.5 md:p-3'} shrink-0 rounded-xl md:rounded-2xl transition-all duration-300 flex-1 md:flex-none ${isHighContrast ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 hover:shadow-sm'}`}
          aria-label={s.settingsAria}
        >
          <span className={hideNavLabel ? 'text-2xl' : 'text-xl md:text-xl'} aria-hidden="true">⚙️</span>
          {!hideNavLabel && (
            <>
              <AccessibleTTS text={s.settingsAria} speak={speak} language={language} className="flex md:flex min-w-0">
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider truncate max-w-full">{s.settingsAria.split(' ')[0]}</span>
              </AccessibleTTS>
              <span className={`hidden lg:block shrink-0 ml-auto text-[10px] font-mono font-bold tracking-tighter transition-opacity opacity-0 group-hover:opacity-40`} aria-hidden="true">
                ^ ,
              </span>
            </>
          )}
        </button>
      </nav>
    </aside>
  );
});

export default SidebarNav;