import React, { memo } from 'react';
import AccessibleTTS from './common/AccessibleTTS.jsx';

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
  s,
  speak,
  noFlash
}) {
  const animClass = noFlash ? '' : 'animate-in fade-in slide-in-from-bottom-12 md:slide-in-from-bottom-0 md:slide-in-from-left-12 duration-700 ease-out';

  return (
    <aside className={`w-full md:w-60 flex flex-row md:flex-col shrink-0 z-40 order-last md:order-first ${animClass} ${isHighContrast ? 'bg-black border-t md:border-t-0 md:border-r border-white/20 shadow-sm' : `bg-[#fdfaf6] border-t md:border-t-0 md:border-r ${themeStyles.border} shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-xl md:shadow-slate-200/50`}`}>
      <div className={`hidden md:flex p-3 md:p-5 items-center gap-2 h-16 ${isHighContrast ? 'border-b border-white/20' : `border-b ${themeStyles.border}`}`}>
        <span className="text-2xl drop-shadow-sm" aria-hidden="true">🧠</span>
        <AccessibleTTS text={s.appTitle} speak={speak} language={language} className="hidden md:flex">
          <h1 className={`font-black text-base tracking-tighter ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>{s.appTitle}</h1>
        </AccessibleTTS>
      </div>
      
      <nav className="flex-1 overflow-x-auto md:overflow-y-auto no-scrollbar py-2 md:py-3 px-2 md:px-3 flex flex-row md:flex-col gap-1 md:gap-1.5 justify-between md:justify-start" aria-label={s.navAria}>
        {pillars.map(p => {
          const isSelected     = activeTab === p;
          const questForPillar = dailyQuests.tasks.find(q => q.type === p);
          const label          = t.pillars?.[p] || p;
          return (
            <button key={p}
              onClick={() => onTabChange(p)}
              className={`relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 ${bigTargets ? 'p-2 md:p-5' : 'p-1.5 md:p-3'} rounded-xl md:rounded-2xl transition-all flex-1 md:flex-none ${isSelected ? (isHighContrast ? 'bg-white text-black font-bold' : `${themeStyles.bg} ${themeStyles.accent} font-bold shadow-sm`) : (isHighContrast ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-50')}`}
              aria-pressed={isSelected}
              aria-label={label}
            >
              <span className={hideNavLabel ? 'text-2xl' : 'text-xl md:text-xl'} aria-hidden="true">{PILLAR_ICONS[p]}</span>
              {!hideNavLabel && (
                <AccessibleTTS text={label} speak={speak} language={language} className="flex md:flex">
                  <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider truncate max-w-full">{label.split(' ')[0]}</span>
                </AccessibleTTS>
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
            className={`relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 ${bigTargets ? 'p-2 md:p-5' : 'p-1.5 md:p-3'} rounded-xl md:rounded-2xl transition-all flex-1 md:flex-none ${activeTab === 'Garden' ? (isHighContrast ? 'bg-white text-black font-bold' : `${themeStyles.bg} ${themeStyles.accent} font-bold shadow-sm`) : (isHighContrast ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-50')}`}
            aria-pressed={activeTab === 'Garden'}
            aria-label={t.garden || "Garden"}
          >
            <span className={hideNavLabel ? 'text-2xl' : 'text-xl md:text-xl'} aria-hidden="true">
              {t?.levelIcons?.[theme]?.[0] || '🌱'}
            </span>
            {!hideNavLabel && (
              <AccessibleTTS text={t.garden || "Garden"} speak={speak} language={language} className="flex md:flex">
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider truncate max-w-full">{t.garden || "Garden"}</span>
              </AccessibleTTS>
            )}
          </button>
        )}
        
        <button
          onClick={() => setSettingsOpen(true)}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 ${bigTargets ? 'p-2 md:p-5' : 'p-1.5 md:p-3'} rounded-xl md:rounded-2xl transition-all flex-1 md:flex-none ${isHighContrast ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
          aria-label={s.settingsAria}
        >
          <span className={hideNavLabel ? 'text-2xl' : 'text-xl md:text-xl'} aria-hidden="true">⚙️</span>
          {!hideNavLabel && (
            <AccessibleTTS text={s.settingsAria} speak={speak} language={language} className="flex md:flex">
              <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider truncate max-w-full">{s.settingsAria.split(' ')[0]}</span>
            </AccessibleTTS>
          )}
        </button>
      </nav>
    </aside>
  );
});

export default SidebarNav;