import React from 'react';
import { useTranslation } from '../i18n/i18n.js';

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
];

// Przeniesiony na zewnątrz, aby uniknąć problemów z ponownym renderowaniem
const A11yBtn = ({ active, onClick, icon, label, isHighContrast, bigTargets }) => (
  <button 
    onClick={onClick} 
    className={`${bigTargets ? 'py-3' : 'py-2 sm:py-2.5'} px-1 rounded-xl border-2 font-bold text-[10px] sm:text-[11px] leading-tight transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${active ? (isHighContrast ? 'border-white bg-white/20 text-white' : 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm') : (isHighContrast ? 'border-white/30 text-white/50 hover:border-white/50' : 'border-slate-100 text-slate-500 hover:border-slate-300')}`}
  >
    <span aria-hidden="true" className="text-lg sm:text-xl mb-0.5">{icon}</span>
    <span className="text-center">{label || 'Opcja'}</span>
  </button>
);

function SettingsPage({ 
  onBack,
  language, setLanguage,
  isGamified, setIsGamified,
  a11yAddons = [], setA11yAddons,
  inclusiveOptions = {}, setInclusiveOptions,
  noFlash = false, isHighContrast = false, bigTargets = false 
}) {
  // Gwarantujemy, że 's' będzie zawsze obiektem, nawet jeśli tłumaczenie się nie załaduje
  const s = useTranslation(language) || {};

  // Zabezpieczenie przed 'null' (częsty błąd odczytu z localStorage)
  const safeAddons = Array.isArray(a11yAddons) ? a11yAddons : [];
  const safeInclusive = inclusiveOptions || {};

  const toggleAddon = (addon) => {
    if (setA11yAddons) {
      if (safeAddons.includes(addon)) {
        setA11yAddons(safeAddons.filter(a => a !== addon));
      } else {
        setA11yAddons([...safeAddons, addon]);
      }
    }
  };

  const toggleInclusive = (opt) => {
    if (setInclusiveOptions) {
      setInclusiveOptions(prev => ({ ...(prev || {}), [opt]: !(prev || {})[opt] }));
    }
  };

  const hasLRS = safeAddons.includes('LRS');
  const hasContrast = safeAddons.includes('Kontrast');
  const hasVision = safeAddons.includes('Niedowidzenie');
  const hasMotorik = safeAddons.includes('Motorik');
  const hasSpacing = safeAddons.includes('Spacing');
  const hasRuler = safeAddons.includes('Linijka');
  const hasColor = safeAddons.includes('Daltonizm');
  const hasMotion = safeAddons.includes('Redukcja');
  const hasDesaturation = safeAddons.includes('Desaturacja');
  
  const hasBionic = !!safeInclusive.bionicReading;
  const hasVoice = !!safeInclusive.voiceAssistant;
  const hasZen = !!safeInclusive.zenMode;

  // Bezpieczny dostęp do słowników z i18n
  const dictA11y = s.a11y || {};
  const dictIncl = s.inclusive || {};

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden ${isHighContrast ? 'bg-black' : 'bg-[#fdfaf6]'}`}>
      
      {/* --- BACKGROUND LAYER --- */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isHighContrast ? 'opacity-0' : 'opacity-10'}`}
        style={{ backgroundImage: "url('/image.png')" }}
      />

      {/* --- MAIN GLASSMORPHISM PANEL --- */}
      <div className={`relative z-10 flex flex-col items-center w-full max-w-lg px-5 sm:px-8 py-6 sm:py-8 rounded-[2rem] shadow-2xl text-center transition-all max-h-[98vh] overflow-y-auto ${
        isHighContrast 
          ? 'bg-black border-2 border-white' 
          : 'bg-white/90 backdrop-blur-md border border-slate-200'
      }`}>

        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
          
          <div className="flex justify-between items-center w-full mb-6">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tighter drop-shadow-md ${isHighContrast ? 'text-white' : 'text-indigo-700'}`}>
              ⚙️ {s.settingsTitle || s.settings || 'Settings'}
            </h1>
            <button
              onClick={onBack}
              className={`rounded-full font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm ${bigTargets ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm'} ${isHighContrast ? 'bg-black border border-white text-white hover:bg-white/20' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              aria-label={s.close || 'Close'}
            >
              ✕
            </button>
          </div>

          {/* Language Selection */}
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5 w-full text-left sm:text-center">
            {s.language || 'Language'}
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4 w-full">
            {LANGUAGES.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`flex flex-row items-center justify-center gap-2 rounded-xl border-2 font-bold text-[11px] sm:text-xs transition-all active:scale-95 ${bigTargets ? 'py-3.5' : 'py-2.5 sm:py-3'} ${
                  language === code
                    ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/10'}`
                    : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'}`
                }`}
                aria-pressed={language === code}
                lang={code}
              >
                <span className="text-base sm:text-lg drop-shadow-md" aria-hidden="true">{flag}</span>
                <span className="uppercase tracking-wider">{label}</span>
              </button>
            ))}
          </div>

          {/* App Mode Selection */}
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5 w-full text-left sm:text-center">
            {s.appMode || 'App Mode'}
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4 w-full">
            <button
              onClick={() => setIsGamified(false)}
              className={`flex flex-row items-center justify-center gap-2 rounded-xl border-2 font-bold text-[11px] sm:text-xs transition-all active:scale-95 ${bigTargets ? 'py-3' : 'py-2 sm:py-2.5'} ${
                !isGamified
                  ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'}`
                  : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'}`
              }`}
              aria-pressed={!isGamified}
            >
              <span className="text-base sm:text-lg drop-shadow-sm" aria-hidden="true">📖</span>
              <span className="uppercase tracking-wider text-center">{s.v1Label || 'Classic'}</span>
            </button>
            <button
              onClick={() => setIsGamified(true)}
              className={`flex flex-row items-center justify-center gap-2 rounded-xl border-2 font-bold text-[11px] sm:text-xs transition-all active:scale-95 ${bigTargets ? 'py-3' : 'py-2 sm:py-2.5'} ${
                isGamified
                  ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'}`
                  : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300'}`
              }`}
              aria-pressed={isGamified}
            >
              <span className="text-base sm:text-lg drop-shadow-sm" aria-hidden="true">🎮</span>
              <span className="uppercase tracking-wider text-center">{s.v2Label || 'Gamified'}</span>
            </button>
          </div>

          {/* Accessibility Selection */}
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5 w-full text-left sm:text-center">
            {s.accessibility || s.a11yAddons || 'Comfort Tools'}
          </p>
          <div className="grid grid-cols-3 gap-2 mb-6 w-full">
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasLRS} onClick={() => toggleAddon('LRS')} icon="🅰️" label={dictA11y.LRS?.name || 'Friendly font'} />
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasSpacing} onClick={() => toggleAddon('Spacing')} icon="🔠" label={dictA11y.Spacing?.name || 'Wider spacing'} />
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasVision} onClick={() => toggleAddon('Niedowidzenie')} icon="🔍" label={dictA11y.Niedowidzenie?.name || 'Larger text'} />
            
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasBionic} onClick={() => toggleInclusive('bionicReading')} icon="👁️" label={dictIncl.bionicReading?.name || 'Bionic'} />
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasRuler} onClick={() => toggleAddon('Linijka')} icon="📏" label={dictA11y.Linijka?.name || 'Focus ruler'} />
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasVoice} onClick={() => toggleInclusive('voiceAssistant')} icon="🗣️" label={dictIncl.voiceAssistant?.name || 'Voice Assist'} />
            
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasContrast} onClick={() => toggleAddon('Kontrast')} icon="🌗" label={dictA11y.Kontrast?.name || 'Contrast'} />
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasColor} onClick={() => toggleAddon('Daltonizm')} icon="🎨" label={dictA11y.Daltonizm?.name || 'Safe colors'} />
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasDesaturation} onClick={() => toggleAddon('Desaturacja')} icon="🌫️" label={dictA11y.Desaturacja?.name || 'Soft colors'} />
            
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasMotorik} onClick={() => toggleAddon('Motorik')} icon="🖐️" label={dictA11y.Motorik?.name || 'Comfort buttons'} />
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasMotion} onClick={() => toggleAddon('Redukcja')} icon="⏸️" label={dictA11y.Redukcja?.name || 'Calm screen'} />
            <A11yBtn isHighContrast={isHighContrast} bigTargets={bigTargets} active={hasZen} onClick={() => toggleInclusive('zenMode')} icon="🧘" label={dictIncl.zenMode?.name || 'Zen Mode'} />
          </div>

          <button
            onClick={onBack}
            className={`w-full font-black uppercase tracking-widest transition-all active:scale-95 rounded-2xl mt-2 ${
              bigTargets ? 'py-5 text-lg sm:text-xl' : 'py-3.5 sm:py-4 text-base sm:text-lg'
            } ${isHighContrast ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-900/60'}`}
          >
            {s.done || 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
