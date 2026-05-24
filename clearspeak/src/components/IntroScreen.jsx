import React from 'react';
import { useTranslation } from '../i18n/i18n.js';

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
];

// ─── Component ────────────────────────────────────────────────────────────────
function IntroScreen({ 
  language, setLanguage,
  onStart, 
  isGamified, setIsGamified,
  a11yAddons = [], setA11yAddons,
  inclusiveOptions = {}, setInclusiveOptions,
  noFlash = false, isHighContrast = false, bigTargets = false,
  selectedVoiceURIs, setSelectedVoiceURIs,
  voiceSpeed, setVoiceSpeed, voicePitch, setVoicePitch
}) {
  const t = useTranslation(language);

  const toggleAddon = (addon) => {
    if (setA11yAddons) {
      if (a11yAddons.includes(addon)) {
        setA11yAddons(a11yAddons.filter(a => a !== addon));
      } else {
        setA11yAddons([...a11yAddons, addon]);
      }
    }
  };

  const toggleInclusive = (opt) => {
    if (setInclusiveOptions) {
      setInclusiveOptions(prev => ({ ...prev, [opt]: !prev[opt] }));
    }
  };

  const hasLRS = a11yAddons.includes('LRS');
  const hasContrast = a11yAddons.includes('Kontrast');
  const hasVision = a11yAddons.includes('Niedowidzenie');
  const hasMotorik = a11yAddons.includes('Motorik');
  const hasSpacing = a11yAddons.includes('Spacing');
  const hasRuler = a11yAddons.includes('Linijka');
  const hasColor = a11yAddons.includes('Daltonizm');
  const hasMotion = a11yAddons.includes('Redukcja');
  const hasDesaturation = a11yAddons.includes('Desaturacja');
  
  const hasBionic = !!inclusiveOptions?.bionicReading;
  const hasVoice = !!inclusiveOptions?.voiceAssistant;
  const hasZen = !!inclusiveOptions?.zenMode;

  const A11yBtn = ({ active, onClick, icon, label }) => (
    <button 
      onClick={onClick} 
      className={`${bigTargets ? 'py-3' : 'py-2 sm:py-2.5'} px-1 rounded-xl border-2 font-bold text-[10px] sm:text-[11px] leading-tight transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${active ? (isHighContrast ? 'border-white bg-white/20 text-white' : 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm') : (isHighContrast ? 'border-white/30 text-white/50 hover:border-white/50' : 'border-slate-100 text-slate-500 hover:border-slate-300')}`}
    >
      <span aria-hidden="true" className="text-lg sm:text-xl mb-0.5">{icon}</span>
      <span className="text-center">{label}</span>
    </button>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden ${isHighContrast ? 'bg-black' : 'bg-[#fdfaf6]'}`}>
      
      {/* --- BACKGROUND LAYER --- */}
      {/* The background image is visible (opacity-50) but does not interfere with text readability */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isHighContrast ? 'opacity-0' : 'opacity-10'} bg-gradient-to-br from-indigo-200 via-purple-100 to-emerald-100`}
        style={{ backgroundImage: "url('/image.png')" }}
      />

      {/* --- MAIN GLASSMORPHISM PANEL --- */}
      {/* This container acts as a protective "glass" card, ensuring high contrast for LRS users */}
      <div className={`relative z-10 flex flex-col items-center w-full max-w-lg px-5 sm:px-8 py-6 sm:py-8 rounded-[2rem] shadow-2xl text-center transition-all max-h-[98vh] overflow-y-auto ${
        isHighContrast 
          ? 'bg-black border-2 border-white' 
          : 'bg-white/90 backdrop-blur-md border border-slate-200'
      }`}>

        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
          {/* Application Icon */}
          <div className="text-5xl sm:text-6xl mb-3 drop-shadow-lg" aria-hidden="true">🧠</div>

          {/* Main App Title */}
          <h1 className={`text-3xl sm:text-4xl font-black mb-2 tracking-tighter drop-shadow-md ${isHighContrast ? 'text-white' : 'text-indigo-700'}`}>
            {t.appTitle || 'Claro'}
          </h1>
          
          {/* Motivating Subtitle */}
          <p className={`text-xs sm:text-sm font-bold mb-4 max-w-sm leading-snug ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>
            {t.intro?.subtitle || 'Twoja bezpieczna przestrzeń do rozwoju! Wybierz tryb i narzędzia:'}
          </p>

            {/* Language Selection */}
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5 w-full text-left sm:text-center">
              {t.intro?.chooseLanguage || 'Język'}
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
              {t.intro?.appMode || 'Tryb'}
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
                <span className="uppercase tracking-wider text-center">{t.intro?.modeClassic || 'Tylko nauka'}</span>
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
                <span className="uppercase tracking-wider text-center">{t.intro?.modeGamified || 'Gra (nagrody)'}</span>
              </button>
            </div>

            {/* Accessibility Selection */}
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5 w-full text-left sm:text-center">
              {t.intro?.a11y || 'Narzędzia komfortu'}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-6 w-full">
              <A11yBtn active={hasLRS} onClick={() => toggleAddon('LRS')} icon="🅰️" label={t.intro?.lrs || 'Przyjazna czcionka'} />
              <A11yBtn active={hasSpacing} onClick={() => toggleAddon('Spacing')} icon="🔠" label={t.intro?.spacing || 'Większe odstępy'} />
              <A11yBtn active={hasVision} onClick={() => toggleAddon('Niedowidzenie')} icon="🔍" label={t.intro?.vision || 'Większy tekst'} />
              
              <A11yBtn active={hasBionic} onClick={() => toggleInclusive('bionicReading')} icon="👁️" label={t.intro?.bionic || 'Bionic'} />
              <A11yBtn active={hasRuler} onClick={() => toggleAddon('Linijka')} icon="📏" label={t.intro?.ruler || 'Linijka skupienia'} />
              <A11yBtn active={hasVoice} onClick={() => toggleInclusive('voiceAssistant')} icon="🗣️" label={t.intro?.voice || 'Asystent'} />
              
              <A11yBtn active={hasContrast} onClick={() => toggleAddon('Kontrast')} icon="🌗" label={t.intro?.contrast || 'Kontrast'} />
              <A11yBtn active={hasColor} onClick={() => toggleAddon('Daltonizm')} icon="🎨" label={t.intro?.color || 'Bezpieczne kolory'} />
              <A11yBtn active={hasDesaturation} onClick={() => toggleAddon('Desaturacja')} icon="🌫️" label={t.intro?.desaturation || 'Łagodne barwy'} />
              
              <A11yBtn active={hasMotorik} onClick={() => toggleAddon('Motorik')} icon="🖐️" label={t.intro?.big || 'Wygodne przyciski'} />
              <A11yBtn active={hasMotion} onClick={() => toggleAddon('Redukcja')} icon="⏸️" label={t.intro?.motion || 'Spokojny ekran'} />
              <A11yBtn active={hasZen} onClick={() => toggleInclusive('zenMode')} icon="🧘" label={t.intro?.zen || 'Tryb Zen'} />
            </div>

            {/* Start Button */}
            <button
              onClick={onStart}
              className={`w-full font-black uppercase tracking-widest transition-all active:scale-95 rounded-2xl mt-2 ${
                bigTargets ? 'py-5 text-lg sm:text-xl' : 'py-3.5 sm:py-4 text-base sm:text-lg'
              } ${isHighContrast ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-900/60'}`}
            >
            {t.start || 'Rozpocznij'}
            </button>
          </div>

      </div>
    </div>
  );
}

export default IntroScreen;