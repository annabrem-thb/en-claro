import React, { memo } from 'react';
import AccessibleTTS from './common/AccessibleTTS.jsx';

const PILLAR_ICONS = { Literacy: '📖', Visual: '👁️', Cognitive: '🧠' };

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
  speak
}) {
  return (
    <aside className={`w-16 md:w-60 flex flex-col shrink-0 z-40 ${isHighContrast ? 'bg-black border-r border-white/20 shadow-sm' : `bg-[#fdfaf6] border-r ${themeStyles.border} shadow-xl shadow-slate-200/50`}`}>
      <div className={`p-3 md:p-5 flex items-center gap-2 h-16 ${isHighContrast ? 'border-b border-white/20' : `border-b ${themeStyles.border}`}`}>
        <span className="text-2xl drop-shadow-sm" aria-hidden="true">🧠</span>
        <AccessibleTTS text={s.appTitle} speak={speak} language={language} className="hidden md:flex">
          <h1 className={`font-black text-base tracking-tighter ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>{s.appTitle}</h1>
        </AccessibleTTS>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-3 px-2 md:px-3 flex flex-col gap-1.5" aria-label={s.navAria}>
        {pillars.map(p => {
          const isSelected     = activeTab === p;
          const questForPillar = dailyQuests.tasks.find(q => q.type === p);
          const label          = t.pillars?.[p] || p;
          return (
            <button key={p}
              onClick={() => onTabChange(p)}
              className={`relative flex items-center justify-center md:justify-start gap-3 ${bigTargets ? 'p-4 md:p-5' : 'p-2.5 md:p-3'} rounded-2xl transition-all ${isSelected ? (isHighContrast ? 'bg-white text-black font-bold' : `${themeStyles.bg} ${themeStyles.accent} font-bold shadow-sm`) : (isHighContrast ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-50')}`}
              aria-pressed={isSelected}
              aria-label={label}
            >
              <span className={hideNavLabel ? 'text-2xl' : 'text-xl'} aria-hidden="true">{PILLAR_ICONS[p]}</span>
              {!hideNavLabel && (
                <AccessibleTTS text={label} speak={speak} language={language} className="hidden md:flex">
                  <span className="text-xs font-bold uppercase tracking-wider truncate">{label}</span>
                </AccessibleTTS>
              )}
              {questForPillar && !questForPillar.completed && questForPillar.current > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true" />
              )}
            </button>
          );
        })}
        
        <div className={`my-2 border-t ${isHighContrast ? 'border-white/20' : themeStyles.border}`} />
        
        {isGamified && (
          <button
            onClick={onGardenClick}
            className={`relative flex items-center justify-center md:justify-start gap-3 ${bigTargets ? 'p-4 md:p-5' : 'p-2.5 md:p-3'} rounded-2xl transition-all ${activeTab === 'Garden' ? (isHighContrast ? 'bg-white text-black font-bold' : `${themeStyles.bg} ${themeStyles.accent} font-bold shadow-sm`) : (isHighContrast ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-50')}`}
            aria-pressed={activeTab === 'Garden'}
            aria-label={t.garden || "Ogród"}
          >
            <span className={hideNavLabel ? 'text-2xl' : 'text-xl'} aria-hidden="true">
              {t?.levelIcons?.[theme]?.[0] || '🌱'}
            </span>
            {!hideNavLabel && (
              <AccessibleTTS text={t.garden || "Ogród"} speak={speak} language={language} className="hidden md:flex">
                <span className="text-xs font-bold uppercase tracking-wider truncate">{t.garden || "Ogród"}</span>
              </AccessibleTTS>
            )}
          </button>
        )}
        
        <button
          onClick={() => setSettingsOpen(true)}
          className={`flex items-center justify-center md:justify-start gap-3 ${bigTargets ? 'p-4 md:p-5' : 'p-2.5 md:p-3'} rounded-2xl transition-all ${isHighContrast ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
          aria-label={s.settingsAria}
        >
          <span className={hideNavLabel ? 'text-2xl' : 'text-xl'} aria-hidden="true">⚙️</span>
          {!hideNavLabel && (
            <AccessibleTTS text={s.settingsAria} speak={speak} language={language} className="hidden md:flex">
              <span className="text-xs font-bold uppercase tracking-wider">{s.settingsAria}</span>
            </AccessibleTTS>
          )}
        </button>
      </nav>
    </aside>
  );
});

export default SidebarNav;