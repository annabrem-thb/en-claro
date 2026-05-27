import React, { useEffect, useRef } from 'react';
import { useGamification } from './GamificationContext';
import { useTranslation } from '../i18n/i18n';
import { useAppSettings } from '../hooks/useAppSettings';

/**
 * DailyTaskComplete Component
 * A WCAG-compliant modal that reinforces competence and satisfies autonomy 
 * by letting the user choose their next virtual garden reward.
 */
export default function DailyTaskComplete({ 
  isOpen, 
  onClose, 
  language = 'pl', 
  isHighContrast = false, 
  noFlash = false,
  bigTargets = false
}) {
  const { selectedRewardId, chooseNextReward, unlockSelectedReward } = useGamification();
  const { theme } = useAppSettings();
  const t = useTranslation(language);
  const dtc = t.dailyTaskComplete || {};

  const modalRef = useRef(null);

  // WCAG Focus Management: Trap focus inside the dialog when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const FALLBACK_REWARDS = {
    Natur: [
      { id: 'tree', icon: '🌳', pl: { name: 'Dąb', desc: 'Symbol siły i wytrzymałości.' }, en: { name: 'Oak Tree', desc: 'Symbol of strength.' }, de: { name: 'Eiche', desc: 'Symbol der Stärke.' } },
      { id: 'flower', icon: '🌹', pl: { name: 'Róża', desc: 'Piękna nagroda za skupienie.' }, en: { name: 'Rose', desc: 'A beautiful reward.' }, de: { name: 'Rose', desc: 'Eine schöne Belohnung.' } },
      { id: 'plant', icon: '🪴', pl: { name: 'Bonsai', desc: 'Cierpliwość i stały rozwój.' }, en: { name: 'Bonsai', desc: 'Patience and growth.' }, de: { name: 'Bonsai', desc: 'Geduld und Wachstum.' } }
    ],
    Musik: [
      { id: 'guitar', icon: '🎸', pl: { name: 'Gitara', desc: 'Akustyczna melodia.' }, en: { name: 'Guitar', desc: 'Acoustic melody.' }, de: { name: 'Gitarre', desc: 'Akustische Melodie.' } },
      { id: 'trumpet', icon: '�', pl: { name: 'Trąbka', desc: 'Złoty blask.' }, en: { name: 'Trumpet', desc: 'Golden brass.' }, de: { name: 'Trompete', desc: 'Goldenes Blech.' } },
      { id: 'drum', icon: '🥁', pl: { name: 'Bęben', desc: 'Równy rytm.' }, en: { name: 'Drum', desc: 'Steady rhythm.' }, de: { name: 'Trommel', desc: 'Stetiger Rhythmus.' } }
    ],
    Kunst: [
      { id: 'palette', icon: '🎨', pl: { name: 'Paleta', desc: 'Kolory radości.' }, en: { name: 'Palette', desc: 'Colors of joy.' }, de: { name: 'Palette', desc: 'Farben der Freude.' } },
      { id: 'brush', icon: '🖌️', pl: { name: 'Pędzel', desc: 'Kreatywne pociągnięcia.' }, en: { name: 'Brush', desc: 'Creative strokes.' }, de: { name: 'Pinsel', desc: 'Kreative Striche.' } },
      { id: 'frame', icon: '🖼️', pl: { name: 'Obraz', desc: 'Oprawione arcydzieło.' }, en: { name: 'Painting', desc: 'Framed masterpiece.' }, de: { name: 'Gemälde', desc: 'Gerahmtes Meisterwerk.' } }
    ],
    Space: [
      { id: 'rocket', icon: '🚀', pl: { name: 'Rakieta', desc: 'Prosto do gwiazd.' }, en: { name: 'Rocket', desc: 'To the stars.' }, de: { name: 'Rakete', desc: 'Zu den Sternen.' } },
      { id: 'satellite', icon: '🛰️', pl: { name: 'Satelita', desc: 'Na wysokiej orbicie.' }, en: { name: 'Satellite', desc: 'Orbiting high.' }, de: { name: 'Satellit', desc: 'Hoch in der Umlaufbahn.' } },
      { id: 'telescope', icon: '🔭', pl: { name: 'Teleskop', desc: 'Głęboki kosmos.' }, en: { name: 'Telescope', desc: 'Deep space.' }, de: { name: 'Teleskop', desc: 'Tiefraum.' } }
    ],
    Ocean: [
      { id: 'dolphin', icon: '🐬', pl: { name: 'Delfin', desc: 'Morska inteligencja.' }, en: { name: 'Dolphin', desc: 'Ocean intelligence.' }, de: { name: 'Delfin', desc: 'Ozeanische Intelligenz.' } },
      { id: 'shell', icon: '🐚', pl: { name: 'Muszla', desc: 'Perła w środku.' }, en: { name: 'Seashell', desc: 'Pearl inside.' }, de: { name: 'Muschel', desc: 'Perle im Inneren.' } },
      { id: 'coral', icon: '🪸', pl: { name: 'Koralowiec', desc: 'Tętniąca życiem rafa.' }, en: { name: 'Coral', desc: 'Vibrant reef.' }, de: { name: 'Koralle', desc: 'Lebhaftes Riff.' } }
    ]
  };

  const currentTheme = theme || 'Natur';
  const options = FALLBACK_REWARDS[currentTheme] || FALLBACK_REWARDS['Natur'];

  // Resolve localized text for options based on selected language, defaulting to English
  const REWARD_OPTIONS = options.map(opt => ({
    id: opt.id,
    icon: opt.icon,
    name: opt[language]?.name || opt.en.name,
    desc: opt[language]?.desc || opt.en.desc,
  }));

  const handleConfirmChoice = () => {
    unlockSelectedReward();
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md transition-opacity ${noFlash ? '' : 'animate-in fade-in duration-500'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      aria-describedby="completion-description"
    >
      <section 
        ref={modalRef}
        tabIndex="-1"
        className={`w-full max-w-lg rounded-[2rem] ${bigTargets ? 'p-10' : 'p-8'} shadow-2xl focus:outline-none ${noFlash ? '' : 'animate-in fade-in slide-in-from-bottom-12 duration-500 ease-out'} ${
          isHighContrast 
            ? 'bg-black border-4 border-white text-white' 
            : 'bg-white border border-slate-100 text-slate-800'
        }`}
      >
        {/* Affirmative Feedback (Competence) */}
        <header className="flex flex-col items-center text-center mb-8" aria-live="polite">
          <div className={`text-6xl mb-4 drop-shadow-md ${noFlash ? '' : 'animate-bounce'}`} aria-hidden="true">🧠</div>
          <h1 id="completion-title" className={`${bigTargets ? 'text-4xl' : 'text-3xl'} font-black mb-2`}>
            {dtc.title || 'Excellent Effort Today!'}
          </h1>
          <p id="completion-description" className={`${bigTargets ? 'text-base' : 'text-sm'} font-medium ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>
            {dtc.desc || 'You have completed your daily practice. Your consistency is building strong foundations.'}
          </p>
        </header>

        {/* Choice Selection (Autonomy) */}
        <div className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-center mb-4 opacity-70">
          {dtc.chooseReward || 'Choose your next reward to grow'}
          </h2>
          
          <ul className="flex flex-col gap-3" role="radiogroup" aria-label="Available plants to grow">
            {REWARD_OPTIONS.map((option) => {
              const isSelected = selectedRewardId === option.id;
              return (
                <li key={option.id}>
                  <button
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => chooseNextReward(option.id)}
                    className={`w-full flex items-center gap-4 ${bigTargets ? 'p-6' : 'p-4'} rounded-2xl border-2 transition-all active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-indigo-400 focus:outline-none ${
                      isSelected 
                        ? (isHighContrast ? 'bg-white text-black border-white' : 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md')
                        : (isHighContrast ? 'bg-black text-white border-white/30 hover:border-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')
                    }`}
                  >
                    <span className={bigTargets ? 'text-4xl' : 'text-3xl'} aria-hidden="true">{option.icon}</span>
                    <div className="text-left flex-1">
                      <span className={`block font-bold ${bigTargets ? 'text-xl' : 'text-lg'} leading-none mb-1`}>{option.name}</span>
                      <span className={`block ${bigTargets ? 'text-sm' : 'text-xs'} ${isSelected ? (isHighContrast ? 'text-black/70' : 'text-emerald-600') : (isHighContrast ? 'text-white/60' : 'text-slate-400')}`}>
                        {option.desc}
                      </span>
                    </div>
                    {/* Visual checkmark for cognitive clarity */}
                    {isSelected && <span className="text-xl" aria-hidden="true">✔️</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={handleConfirmChoice}
          disabled={!selectedRewardId}
          className={`w-full ${bigTargets ? 'py-6 text-base' : 'py-5 text-sm'} rounded-2xl font-black uppercase tracking-widest transition-all focus-visible:ring-4 focus-visible:ring-indigo-400 focus:outline-none ${
            !selectedRewardId 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' 
              : (isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl')
          }`}
        >
          {dtc.plantSeed || 'Plant Seed & Continue'}
        </button>
      </section>
    </div>
  );
}