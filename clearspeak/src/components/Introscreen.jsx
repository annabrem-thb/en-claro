import React from 'react';

// Standalone intro/language-selection screen.
// All strings are defined inline to ensure the UI can be localized before the main app state loads.

// ─── Localization Dictionary ───────────────────────────────────────────────
const INTRO_STRINGS = {
  pl: {
    title:    'Context Master',
    subtitle: 'Twoja bezstresowa przestrzeń do ćwiczeń. Rozwijaj się i zdobywaj nagrody we własnym tempie!',
    chooseLanguage: 'Wybierz język',
    start:    'Rozpocznij',
    features: [
      { icon: '🌱', text: 'Przyjazne i spokojne środowisko' },
      { icon: '🎮', text: 'Grywalizacja bez presji czasu' },
      { icon: '♿', text: 'Pełna dostępność wizualna' },
    ],
    next: 'Dalej',
  },
  en: {
    title:    'Context Master',
    subtitle: 'Your stress-free space for therapy. Grow and earn rewards at your own pace!',
    chooseLanguage: 'Choose language',
    start:    'Start Journey',
    features: [
      { icon: '🌱', text: 'Calm & friendly environment' },
      { icon: '🎮', text: 'Gamification without time pressure' },
      { icon: '♿', text: 'Full visual accessibility' },
    ],
    next: 'Next',
  },
  de: {
    title:    'Context Master',
    subtitle: 'Dein stressfreier Raum für Übungen. Wachse und sammle Belohnungen in deinem eigenen Tempo!',
    chooseLanguage: 'Sprache wählen',
    start:    'Starten',
    features: [
      { icon: '🌱', text: 'Ruhige & freundliche Umgebung' },
      { icon: '🎮', text: 'Gamifizierung ohne Zeitdruck' },
      { icon: '♿', text: 'Volle visuelle Barrierefreiheit' },
    ],
    next: 'Weiter',
  },
};

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
];

// ─── Component ────────────────────────────────────────────────────────────────
function IntroScreen({ 
  language, setLanguage,
  onStart, 
  noFlash = false, isHighContrast = false, bigTargets = false 
}) {
  const s = INTRO_STRINGS[language] || INTRO_STRINGS.de;
  const bounceClass = noFlash ? '' : 'animate-bounce';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden ${isHighContrast ? 'bg-black' : 'bg-[#fdfaf6]'}`}>
      
      {/* --- BACKGROUND LAYER --- */}
      {/* The background image is visible (opacity-50) but does not interfere with text readability */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isHighContrast ? 'opacity-0' : 'opacity-10'}`}
        style={{ backgroundImage: "url('/image.png')" }}
      />

      {/* --- MAIN GLASSMORPHISM PANEL --- */}
      {/* This container acts as a protective "glass" card, ensuring high contrast for LRS users */}
      <div className={`relative z-10 flex flex-col items-center w-full max-w-md px-4 sm:px-6 py-8 rounded-[2.5rem] shadow-2xl text-center transition-all max-h-[95vh] overflow-y-auto ${
        isHighContrast 
          ? 'bg-black border-2 border-white' 
          : 'bg-white/90 backdrop-blur-md border border-slate-200'
      }`}>

        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
          {/* Logo animation */}
          <div className={`text-5xl sm:text-6xl mb-2 drop-shadow-lg ${bounceClass}`} aria-hidden="true">🧩</div>

          {/* Main App Title */}
          <h1 className={`text-3xl sm:text-4xl font-black mb-2 tracking-tighter drop-shadow-md ${isHighContrast ? 'text-white' : 'text-indigo-700'}`}>
            {s.title}
          </h1>
          
          {/* Motivating Subtitle */}
          <p className={`text-[11px] sm:text-xs font-medium mb-4 max-w-xs leading-relaxed ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>
            {s.subtitle}
          </p>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-2 mb-5 w-full">
              {s.features.map((f, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2 sm:py-3 text-left transition-colors ${isHighContrast ? 'bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  <span className="text-xl" aria-hidden="true">{f.icon}</span>
                  <span className={`text-sm font-medium ${isHighContrast ? 'text-white' : 'text-slate-700'}`}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Language Selection */}
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
              {s.chooseLanguage}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-8 w-full">
              {LANGUAGES.map(({ code, flag, label }) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border-2 transition-all active:scale-95 ${bigTargets ? 'py-4' : 'py-2 sm:py-3'} ${
                    language === code
                      ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/10'}`
                      : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'}`
                  }`}
                  aria-pressed={language === code}
                  lang={code}
                >
                  <span className="text-xl sm:text-2xl drop-shadow-md" aria-hidden="true">{flag}</span>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">{label}</span>
                </button>
              ))}
            </div>


            {/* Start Button */}
            <button
              onClick={onStart}
              className={`w-full sm:w-auto font-black uppercase tracking-wide transition-all active:scale-95 rounded-3xl ${
                bigTargets ? 'px-12 py-5 text-xl' : 'px-12 py-3 sm:py-4 text-lg'
              } ${isHighContrast ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-900/60'}`}
            >
              {s.start}
            </button>
          </div>

      </div>
    </div>
  );
}

export default IntroScreen;