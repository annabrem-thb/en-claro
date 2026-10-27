import { useTranslation } from 'react-i18next';

import { useUserSettingsContext } from '../../hooks/useUserSettingsContext.js';

import BionicText from './BionicText.jsx';

const LANGUAGES = [
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
];

export default function LanguageSwitcher() {
  const { settings, updateSetting } = useUserSettingsContext();
  const { language, contrast: isHighContrast, bionicReading } = settings;
  const { t } = useTranslation();

  return (
    <div className="flex gap-2" role="group" aria-label={t('languageLabel')}>
      {LANGUAGES.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => updateSetting('language', code)}
          aria-pressed={language === code}
          className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 py-4 transition-all active:scale-95 ${
            language === code
              ? isHighContrast
                ? 'border-white bg-white/20 text-white shadow-sm'
                : 'border-indigo-400 bg-indigo-50 shadow-sm'
              : isHighContrast
                ? 'border-white/30 bg-black text-white/70 hover:border-white/60'
                : 'border-slate-100 bg-white hover:border-slate-200'
          }`}
        >
          <span className="text-2xl transition-all" aria-hidden="true">
            {flag}
          </span>
          <span
            className={`text-xs font-black transition-all ${
              language === code
                ? isHighContrast
                  ? 'text-white'
                  : 'text-slate-700'
                : isHighContrast
                  ? 'text-white/70'
                  : 'text-slate-700'
            }`}
          >
            <BionicText text={label} enabled={bionicReading} />
          </span>
        </button>
      ))}
    </div>
  );
}
