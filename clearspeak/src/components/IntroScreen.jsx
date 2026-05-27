import React from 'react';
import { useTranslation } from 'react-i18next';
import BionicText from './common/BionicText.jsx';
import { useUserSettingsContext } from './UserSettingsContext.jsx';
import { useGamification } from './GamificationContext.jsx';

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
];

// ─── Component ────────────────────────────────────────────────────────────────
function IntroScreen({ onStart, speak }) {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { isGamified, setIsGamified } = useGamification();

  const { language, contrast: isHighContrast, motorik: bigTargets, motion: noFlash } = settings;

  // Mapping legacy a11y keys to new names
  const A11Y_MAPPING = {
    'LRS': 'lrs',
    'Kontrast': 'contrast',
    'Niedowidzenie': 'vision',
    'Motorik': 'motorik',
    'Spacing': 'spacing',
    'Linijka': 'ruler',
    'Daltonizm': 'color',
    'Redukcja': 'motion',
    'Desaturacja': 'desaturation'
  };

  const toggleAddon = (addon, label) => {
    const mappedKey = A11Y_MAPPING[addon];
    const newState = !settings[mappedKey];
    updateSetting(mappedKey, newState);
    
    if (settings.voiceAssistant && speak) {
      speak(`${label} ${newState ? t('on', 'WŁĄCZONA') : t('off', 'WYŁĄCZONA')}`);
    }
  };

  const toggleInclusive = (opt, label) => {
    const newState = !settings[opt];
    updateSetting(opt, newState);
    
    if (settings.voiceAssistant && speak) {
      speak(`${label} ${newState ? t('on', 'WŁĄCZONA') : t('off', 'WYŁĄCZONA')}`);
    }
  };

  const hasLRS = settings.lrs;
  const hasContrast = settings.contrast;
  const hasVision = settings.vision;
  const hasMotorik = settings.motorik;
  const hasSpacing = settings.spacing;
  const hasRuler = settings.ruler;
  const hasColor = settings.color;
  const hasMotion = settings.motion;
  const hasDesaturation = settings.desaturation;
  
  const hasBionic = !!settings.bionicReading;
  const hasVoice = !!settings.voiceAssistant;
  const hasZen = !!settings.zenMode;

  const A11yBtn = ({ active, onClick, icon, label }) => (
    <button 
      onClick={onClick} 
      className={`relative ${bigTargets ? 'py-2.5 sm:py-3' : 'py-1.5 sm:py-2'} px-1 rounded-xl border-2 font-bold text-[10px] sm:text-[11px] leading-tight transition-all flex flex-col items-center justify-center gap-1 active:scale-95 overflow-hidden ${active ? (isHighContrast ? 'border-white bg-white/20 text-white' : 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm') : (isHighContrast ? 'border-white/30 text-white/50 hover:border-white/50' : 'border-slate-100 text-slate-500 hover:border-slate-300')}`}
    >
      {active && (
        <div className={`absolute top-0 right-0 w-4 h-4 flex items-center justify-center rounded-bl-lg ${isHighContrast ? 'bg-white text-black' : 'bg-amber-500 text-white'}`}>
          <span className="text-[8px] font-black">✓</span>
        </div>
      )}
      <span aria-hidden="true" className="text-lg sm:text-xl mb-0.5">{icon}</span>
      <span className="text-center px-1"><BionicText text={label} enabled={hasBionic} /></span>
    </button>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden ${isHighContrast ? 'bg-black' : 'bg-[#fdfaf6]'}`}>
      
      {/* Background Layer: Visible but does not interfere with text readability */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isHighContrast ? 'opacity-0' : 'opacity-10'} bg-gradient-to-br from-indigo-200 via-purple-100 to-emerald-100`}
      />

      {/* Main Glassmorphism Panel: Protective "glass" card ensuring high contrast for LRS users */}
      <div className={`relative z-10 flex flex-col items-center w-full max-w-lg px-4 sm:px-8 py-4 sm:py-6 rounded-[2rem] shadow-2xl text-center transition-all max-h-[96vh] sm:max-h-[98vh] overflow-y-auto no-scrollbar ${
        isHighContrast 
          ? 'bg-black border-2 border-white' 
          : 'bg-white/90 backdrop-blur-md border border-slate-200'
      }`}>

        <div className={`w-full flex flex-col items-center ${noFlash ? '' : 'animate-in fade-in zoom-in duration-500'}`}>
          <div className="text-4xl sm:text-6xl mb-1 drop-shadow-lg" aria-hidden="true">🧠</div>

          <h1 className={`text-2xl sm:text-4xl font-black mb-1 tracking-tighter drop-shadow-md ${isHighContrast ? 'text-white' : 'text-indigo-700'}`}>
            {t('appTitle', 'EnClaro')}
          </h1>
          
          <p className={`text-[10px] sm:text-sm font-bold mb-2 max-w-sm leading-snug ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>
            <BionicText text={t('intro.subtitle', 'Your safe space to grow! Choose mode and tools:')} enabled={hasBionic} />
          </p>

            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1 w-full text-left sm:text-center">
              <BionicText text={t('intro.chooseLanguage', 'Language')} enabled={hasBionic} />
            </p>
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mb-2 w-full">
              {LANGUAGES.map(({ code, flag, label }) => (
                <button
                  key={code}
                  onClick={() => {
                    updateSetting('language', code);
                    if (settings.voiceAssistant && speak) speak(label);
                  }}
                  className={`flex flex-row items-center justify-center gap-1 sm:gap-1.5 rounded-xl border-2 font-bold text-[10px] sm:text-xs transition-all active:scale-95 ${bigTargets ? 'py-2.5 sm:py-3' : 'py-1.5 sm:py-2.5'} ${
                    language === code
                      ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/10'}`
                      : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'}`
                  }`}
                  aria-pressed={language === code}
                  lang={code}
                >
                  <span className="text-sm sm:text-lg drop-shadow-md" aria-hidden="true">{flag}</span>
                  <span className="uppercase tracking-wider"><BionicText text={label} enabled={hasBionic} /></span>
                </button>
              ))}
            </div>

            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1 w-full text-left sm:text-center">
              <BionicText text={t('intro.appMode', 'Mode')} enabled={hasBionic} />
            </p>
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 mb-2 w-full">
              <button
                onClick={() => {
                  setIsGamified(false);
                  if (settings.voiceAssistant && speak) speak(t('intro.modeClassic', 'Learning Only'));
                }}
                className={`flex flex-row items-center justify-center gap-1.5 rounded-xl border-2 font-bold text-[10px] sm:text-xs transition-all active:scale-95 ${bigTargets ? 'py-2.5' : 'py-1.5 sm:py-2'} ${
                  !isGamified
                    ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'}`
                    : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'}`
                }`}
                aria-pressed={!isGamified}
              >
                <span className="text-sm sm:text-lg drop-shadow-sm" aria-hidden="true">📖</span>
                <span className="uppercase tracking-wider text-center"><BionicText text={t('intro.modeClassic', 'Learning Only')} enabled={hasBionic} /></span>
              </button>
              <button
                onClick={() => {
                  setIsGamified(true);
                  if (settings.voiceAssistant && speak) speak(t('intro.modeGamified', 'Gamified'));
                }}
                className={`flex flex-row items-center justify-center gap-1.5 rounded-xl border-2 font-bold text-[10px] sm:text-xs transition-all active:scale-95 ${bigTargets ? 'py-2.5' : 'py-1.5 sm:py-2'} ${
                  isGamified
                    ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'}`
                    : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300'}`
                }`}
                aria-pressed={isGamified}
              >
                <span className="text-sm sm:text-lg drop-shadow-sm" aria-hidden="true">🎮</span>
                <span className="uppercase tracking-wider text-center"><BionicText text={t('intro.modeGamified', 'Gamified')} enabled={hasBionic} /></span>
              </button>
            </div>

            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1 w-full text-left sm:text-center">
              <BionicText text={t('intro.a11y', 'Comfort Tools')} enabled={hasBionic} />
            </p>
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mb-3 w-full">
              <A11yBtn active={hasLRS} onClick={() => toggleAddon('LRS', t('intro.lrs', 'Friendly Font'))} icon="🅰️" label={t('intro.lrs', 'Friendly Font')} />
              <A11yBtn active={hasSpacing} onClick={() => toggleAddon('Spacing', t('intro.spacing', 'More Spacing'))} icon="🔠" label={t('intro.spacing', 'More Spacing')} />
              <A11yBtn active={hasVision} onClick={() => toggleAddon('Niedowidzenie', t('intro.vision', 'Bigger Text'))} icon="🔍" label={t('intro.vision', 'Bigger Text')} />
              
              <A11yBtn active={hasBionic} onClick={() => toggleInclusive('bionicReading', t('intro.bionic', 'Bionic'))} icon="👁️" label={t('intro.bionic', 'Bionic')} />
              <A11yBtn active={hasRuler} onClick={() => toggleAddon('Linijka', t('intro.ruler', 'Reading Ruler'))} icon="📏" label={t('intro.ruler', 'Reading Ruler')} />
              <A11yBtn active={hasVoice} onClick={() => toggleInclusive('voiceAssistant', t('intro.voice', 'Assistant'))} icon="🗣️" label={t('intro.voice', 'Assistant')} />
              
              <A11yBtn active={hasContrast} onClick={() => toggleAddon('Kontrast', t('intro.contrast', 'Kontrast'))} icon="🌗" label={t('intro.contrast', 'Kontrast')} />
              <A11yBtn active={hasColor} onClick={() => toggleAddon('Daltonizm', t('intro.color', 'Safe Colors'))} icon="🎨" label={t('intro.color', 'Safe Colors')} />
              <A11yBtn active={hasDesaturation} onClick={() => toggleAddon('Desaturacja', t('intro.desaturation', 'Soft Colors'))} icon="🌫️" label={t('intro.desaturation', 'Soft Colors')} />
              
              <A11yBtn active={hasMotorik} onClick={() => toggleAddon('Motorik', t('intro.big', 'Wygodne przyciski'))} icon="🖐️" label={t('intro.big', 'Wygodne przyciski')} />
              <A11yBtn active={hasMotion} onClick={() => toggleAddon('Redukcja', t('intro.motion', 'Reduced Motion'))} icon="⏸️" label={t('intro.motion', 'Reduced Motion')} />
              <A11yBtn active={hasZen} onClick={() => toggleInclusive('zenMode', t('intro.zen', 'Zen Mode'))} icon="🧘" label={t('intro.zen', 'Zen Mode')} />
            </div>

            {/* --- RECOMMENDED BROWSER MESSAGE --- */}
            <div className={`mt-1 mb-2 p-2 sm:p-3 rounded-2xl flex items-center gap-2 sm:gap-3 border-2 text-left transition-colors ${isHighContrast ? 'bg-black border-white/50 text-white' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
              <span className="text-lg sm:text-2xl shrink-0 drop-shadow-sm" aria-hidden="true">💡</span>
              <p className="text-xs sm:text-sm font-medium leading-snug">
                <BionicText text={t('intro.browserWarning', 'Dla najlepszej jakości asystenta głosowego zalecamy korzystanie z przeglądarki Google Chrome.')} enabled={hasBionic} />
              </p>
            </div>

            <button
              onClick={() => {
                if (settings.voiceAssistant && speak) speak(t('start', 'Start'));
                onStart();
              }}
              className={`w-full font-black uppercase tracking-widest transition-all active:scale-95 rounded-xl sm:rounded-2xl mt-1 shrink-0 ${
                bigTargets ? 'py-3 sm:py-4 text-base sm:text-xl' : 'py-2 sm:py-3 text-sm sm:text-lg'
              } ${isHighContrast ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-900/60'}`}
            >
            <BionicText text={t('start', 'Start')} enabled={hasBionic} />
            </button>
          </div>

      </div>
    </div>
  );
}

export default IntroScreen;