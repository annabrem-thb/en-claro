import React, { useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { useGamification } from './GamificationContext';
import { useUserSettingsContext } from './UserSettingsContext';

export default function DailyTaskComplete({
  isOpen,
  onClose,
  language = 'pl',
  isHighContrast = false,
  noFlash = false,
  bigTargets = false,
}) {
  const { selectedRewardId, chooseNextReward, unlockSelectedReward } =
    useGamification();
  const { settings } = useUserSettingsContext();
  const { theme } = settings;
  const { t } = useTranslation();
  const dtc = t('dailyTaskComplete', { returnObjects: true }) || {};

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const FALLBACK_REWARDS = {
    Natur: [
      {
        id: 'tree',
        icon: '🌳',
        pl: { name: 'Dąb', desc: 'Symbol siły i wytrzymałości.' },
        en: { name: 'Oak Tree', desc: 'Symbol of strength.' },
        de: { name: 'Eiche', desc: 'Symbol der Stärke.' },
      },
      {
        id: 'flower',
        icon: '🌹',
        pl: { name: 'Róża', desc: 'Piękna nagroda za skupienie.' },
        en: { name: 'Rose', desc: 'A beautiful reward.' },
        de: { name: 'Rose', desc: 'Eine schöne Belohnung.' },
      },
      {
        id: 'plant',
        icon: '🪴',
        pl: { name: 'Bonsai', desc: 'Cierpliwość i stały rozwój.' },
        en: { name: 'Bonsai', desc: 'Patience and growth.' },
        de: { name: 'Bonsai', desc: 'Geduld und Wachstum.' },
      },
    ],
    Musik: [
      {
        id: 'guitar',
        icon: '🎸',
        pl: { name: 'Gitara', desc: 'Akustyczna melodia.' },
        en: { name: 'Guitar', desc: 'Acoustic melody.' },
        de: { name: 'Gitarre', desc: 'Akustische Melodie.' },
      },
      {
        id: 'trumpet',
        icon: '�',
        pl: { name: 'Trąbka', desc: 'Złoty blask.' },
        en: { name: 'Trumpet', desc: 'Golden brass.' },
        de: { name: 'Trompete', desc: 'Goldenes Blech.' },
      },
      {
        id: 'drum',
        icon: '🥁',
        pl: { name: 'Bęben', desc: 'Równy rytm.' },
        en: { name: 'Drum', desc: 'Steady rhythm.' },
        de: { name: 'Trommel', desc: 'Stetiger Rhythmus.' },
      },
    ],
    Kunst: [
      {
        id: 'palette',
        icon: '🎨',
        pl: { name: 'Paleta', desc: 'Kolory radości.' },
        en: { name: 'Palette', desc: 'Colors of joy.' },
        de: { name: 'Palette', desc: 'Farben der Freude.' },
      },
      {
        id: 'brush',
        icon: '🖌️',
        pl: { name: 'Pędzel', desc: 'Kreatywne pociągnięcia.' },
        en: { name: 'Brush', desc: 'Creative strokes.' },
        de: { name: 'Pinsel', desc: 'Kreative Striche.' },
      },
      {
        id: 'frame',
        icon: '🖼️',
        pl: { name: 'Obraz', desc: 'Oprawione arcydzieło.' },
        en: { name: 'Painting', desc: 'Framed masterpiece.' },
        de: { name: 'Gemälde', desc: 'Gerahmtes Meisterwerk.' },
      },
    ],
    Space: [
      {
        id: 'rocket',
        icon: '🚀',
        pl: { name: 'Rakieta', desc: 'Prosto do gwiazd.' },
        en: { name: 'Rocket', desc: 'To the stars.' },
        de: { name: 'Rakete', desc: 'Zu den Sternen.' },
      },
      {
        id: 'satellite',
        icon: '🛰️',
        pl: { name: 'Satelita', desc: 'Na wysokiej orbicie.' },
        en: { name: 'Satellite', desc: 'Orbiting high.' },
        de: { name: 'Satellit', desc: 'Hoch in der Umlaufbahn.' },
      },
      {
        id: 'telescope',
        icon: '🔭',
        pl: { name: 'Teleskop', desc: 'Głęboki kosmos.' },
        en: { name: 'Telescope', desc: 'Deep space.' },
        de: { name: 'Teleskop', desc: 'Tiefraum.' },
      },
    ],
    Ocean: [
      {
        id: 'dolphin',
        icon: '🐬',
        pl: { name: 'Delfin', desc: 'Morska inteligencja.' },
        en: { name: 'Dolphin', desc: 'Ocean intelligence.' },
        de: { name: 'Delfin', desc: 'Ozeanische Intelligenz.' },
      },
      {
        id: 'shell',
        icon: '🐚',
        pl: { name: 'Muszla', desc: 'Perła w środku.' },
        en: { name: 'Seashell', desc: 'Pearl inside.' },
        de: { name: 'Muschel', desc: 'Perle im Inneren.' },
      },
      {
        id: 'coral',
        icon: '🪸',
        pl: { name: 'Koralowiec', desc: 'Tętniąca życiem rafa.' },
        en: { name: 'Coral', desc: 'Vibrant reef.' },
        de: { name: 'Koralle', desc: 'Lebhaftes Riff.' },
      },
    ],
  };

  const currentTheme = theme || 'Natur';
  const options = FALLBACK_REWARDS[currentTheme] || FALLBACK_REWARDS['Natur'];

  const REWARD_OPTIONS = options.map((opt) => ({
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
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/80 p-2 backdrop-blur-md transition-opacity sm:p-4 ${noFlash ? '' : 'animate-in fade-in duration-500'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      aria-describedby="completion-description"
    >
      <section
        ref={modalRef}
        tabIndex="-1"
        className={`flex max-h-[98vh] min-h-0 w-full max-w-lg shrink flex-col rounded-[2rem] ${bigTargets ? 'p-6 sm:p-10' : 'p-4 sm:p-8'} shadow-2xl focus:outline-none ${noFlash ? '' : 'animate-in fade-in slide-in-from-bottom-12 duration-500 ease-out'} ${
          isHighContrast
            ? 'border-4 border-white bg-black text-white'
            : 'border border-slate-100 bg-white text-slate-800'
        }`}
      >
        {}
        <header
          className="mb-4 flex shrink-0 flex-col items-center text-center sm:mb-8"
          aria-live="polite"
        >
          <div
            className={`mb-2 text-5xl drop-shadow-md sm:mb-4 sm:text-6xl ${noFlash ? '' : 'animate-bounce'}`}
            aria-hidden="true"
          >
            🧠
          </div>
          <h1
            id="completion-title"
            className={`${bigTargets ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'} mb-1 font-black sm:mb-2`}
          >
            {dtc.title || 'Excellent Effort Today!'}
          </h1>
          <p
            id="completion-description"
            className={`${bigTargets ? 'text-base' : 'text-sm'} font-medium ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}
          >
            {dtc.desc ||
              'You have completed your daily practice. Your consistency is building strong foundations.'}
          </p>
        </header>

        {}
        <div className="mb-4 min-h-0 shrink overflow-y-auto pr-1 sm:mb-8">
          <h2 className="mb-2 shrink-0 text-center text-[10px] font-black tracking-widest uppercase opacity-70 sm:mb-4 sm:text-xs">
            {dtc.chooseReward || 'Choose your next reward to grow'}
          </h2>

          <ul
            className="flex shrink-0 flex-col gap-2 sm:gap-3"
            role="radiogroup"
            aria-label="Available plants to grow"
          >
            {REWARD_OPTIONS.map((option) => {
              const isSelected = selectedRewardId === option.id;
              return (
                <li key={option.id}>
                  <button
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => chooseNextReward(option.id)}
                    className={`flex w-full items-center gap-3 sm:gap-4 ${bigTargets ? 'p-4 sm:p-6' : 'p-3 sm:p-4'} rounded-2xl border-2 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 active:scale-[0.98] ${
                      isSelected
                        ? isHighContrast
                          ? 'border-white bg-white text-black'
                          : 'border-emerald-400 bg-emerald-50 text-emerald-800 shadow-md'
                        : isHighContrast
                          ? 'border-white/30 bg-black text-white hover:border-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={
                        bigTargets
                          ? 'text-3xl sm:text-4xl'
                          : 'text-2xl sm:text-3xl'
                      }
                      aria-hidden="true"
                    >
                      {option.icon}
                    </span>
                    <div className="flex-1 text-left">
                      <span
                        className={`block font-bold ${bigTargets ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} mb-1 leading-none`}
                      >
                        {option.name}
                      </span>
                      <span
                        className={`block ${bigTargets ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} ${isSelected ? (isHighContrast ? 'text-black/70' : 'text-emerald-600') : isHighContrast ? 'text-white/60' : 'text-slate-600'}`}
                      >
                        {option.desc}
                      </span>
                    </div>
                    {}
                    {isSelected && (
                      <span className="text-lg sm:text-xl" aria-hidden="true">
                        ✔️
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={handleConfirmChoice}
          disabled={!selectedRewardId}
          className={`mt-auto w-full shrink-0 ${bigTargets ? 'py-4 text-sm sm:py-6 sm:text-base' : 'py-3.5 text-xs sm:py-5 sm:text-sm'} rounded-2xl font-black tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 ${
            !selectedRewardId
              ? 'cursor-not-allowed bg-slate-100 text-slate-600 opacity-50'
              : isHighContrast
                ? 'bg-white text-black hover:bg-slate-200'
                : 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-500'
          }`}
        >
          {dtc.plantSeed || 'Plant Seed & Continue'}
        </button>
      </section>
    </div>
  );
}
