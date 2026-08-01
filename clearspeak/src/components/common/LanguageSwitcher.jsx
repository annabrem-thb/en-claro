import React from 'react';
import { useUserSettingsContext } from '../UserSettingsContext.jsx';
import BionicText from './BionicText.jsx';

const LANGUAGES = [
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
];

/**
 * LanguageSwitcher Component
 * A simple, accessible component for changing the application's language.
 * It integrates with the existing UserSettingsContext.
 */
export default function LanguageSwitcher() {
  const { settings, updateSetting } = useUserSettingsContext();
  const { language, contrast: isHighContrast, bionicReading } = settings;

  return (
    <div className="flex gap-2" role="group" aria-label="Language Selection">
      {LANGUAGES.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => updateSetting('language', code)}
          aria-pressed={language === code}
          className={`flex-1 py-4 gap-1 rounded-2xl border-2 flex flex-col items-center transition-all active:scale-95 ${
            language === code
              ? (isHighContrast ? 'border-white bg-white/20 text-white shadow-sm' : 'border-indigo-400 bg-indigo-50 shadow-sm')
              : (isHighContrast ? 'border-white/30 bg-black text-white/70 hover:border-white/60' : 'border-slate-100 bg-white hover:border-slate-200')
          }`}
        >
          <span className="text-2xl transition-all" aria-hidden="true">{flag}</span>
          <span className={`text-xs font-black transition-all ${
            language === code 
              ? (isHighContrast ? 'text-white' : 'text-slate-700') 
              : (isHighContrast ? 'text-white/70' : 'text-slate-500')
          }`}>
            <BionicText text={label} enabled={bionicReading} />
          </span>
        </button>
      ))}
    </div>
  );
}