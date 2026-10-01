import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useAutoReadAloud } from '../hooks/useAutoReadAloud.js';
import { useUserSettingsContext } from '../hooks/useUserSettingsContext.js';

import AccessibleTTS from './common/AccessibleTTS.jsx';
import BionicText from './common/BionicText.jsx';

// Information/consent screen shown once, before a guided study participant
// ever sees block 1 (App.jsx renders this instead of the normal app shell
// whenever studyMode.isActive is true and studyMode.consentGiven is still
// false — see useStudyModeState.js's STUDY_CONSENT_KEY). Not a Dialog: like
// IntroScreen.jsx, it replaces the whole screen rather than sitting on top
// of it, since there is nothing underneath to return to without consenting.
export default function StudyConsentScreen({ onConsent, speak }) {
  const { t } = useTranslation();
  const { settings } = useUserSettingsContext();
  const isHighContrast = !!settings.contrast;
  const hasBionic = !!settings.bionicReading;
  const voiceAssistant = !!settings.voiceAssistant && !!speak;

  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [infoConfirmed, setInfoConfirmed] = useState(false);
  const [showError, setShowError] = useState(false);

  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const points = t('studyConsent.points', { returnObjects: true }) || [];

  // One continuous read-through of the whole notice, via the app's existing
  // read-aloud mechanism (AccessibleTTS below reuses the exact same `speak`
  // call for the manual button) — not the staggered per-segment style used
  // for short dialog intros elsewhere, since every point here matters and
  // none should be skippable by arriving mid-speech on a later segment.
  const fullText = [t('studyConsent.heading'), ...points].join('. ');

  const readAloud = () => {
    if (speak) speak(fullText, true);
  };
  useAutoReadAloud(voiceAssistant, readAloud);

  const bothConfirmed = ageConfirmed && infoConfirmed;

  const handleStart = () => {
    if (!bothConfirmed) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onConsent();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-2 pt-[calc(0.5rem+env(safe-area-inset-top))] pr-[calc(0.5rem+env(safe-area-inset-right))] pb-[calc(0.5rem+env(safe-area-inset-bottom))] pl-[calc(0.5rem+env(safe-area-inset-left))] sm:p-4 ${isHighContrast ? 'bg-black' : 'bg-[#fdfaf6]'}`}
    >
      <main
        id="main-content"
        className={`relative z-10 flex max-h-[98dvh] min-h-0 w-full max-w-lg shrink flex-col items-stretch rounded-4xl text-center shadow-2xl transition-all ${
          isHighContrast
            ? 'border-2 border-white bg-black'
            : 'border border-slate-200 bg-white/90 backdrop-blur-md'
        }`}
      >
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pt-4 sm:px-6 sm:pt-6">
          <AccessibleTTS text={fullText} speak={speak} className="mb-2 justify-center">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className={`text-xl font-black tracking-tight outline-none sm:text-2xl ${isHighContrast ? 'text-white' : 'text-indigo-700'}`}
            >
              <BionicText text={t('studyConsent.heading')} enabled={hasBionic} />
            </h1>
          </AccessibleTTS>

          <ol
            className={`mb-4 list-decimal space-y-2 pl-5 text-left text-sm leading-snug font-medium sm:text-base ${isHighContrast ? 'text-white/90' : 'text-slate-700'}`}
          >
            {points.map((point, index) => (
              <li key={index}>
                <BionicText text={point} enabled={hasBionic} />
              </li>
            ))}
          </ol>
        </div>

        <div
          className={`shrink-0 border-t px-4 pt-3 pb-4 sm:px-6 sm:pb-6 ${isHighContrast ? 'border-white/20' : 'border-slate-100'}`}
        >
          <div className="mb-3 flex flex-col gap-3 text-left">
            <label
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 text-sm font-medium sm:text-base ${
                isHighContrast
                  ? 'border-white/40 text-white'
                  : 'border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0"
              />
              <BionicText text={t('studyConsent.checkbox1')} enabled={hasBionic} />
            </label>

            <label
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 text-sm font-medium sm:text-base ${
                isHighContrast
                  ? 'border-white/40 text-white'
                  : 'border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={infoConfirmed}
                onChange={(e) => setInfoConfirmed(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0"
              />
              <BionicText text={t('studyConsent.checkbox2')} enabled={hasBionic} />
            </label>
          </div>

          {showError && !bothConfirmed && (
            <div
              role="alert"
              aria-live="assertive"
              className={`mb-3 rounded-r-lg border-l-4 p-3 text-sm font-medium ${isHighContrast ? 'border-white bg-white/10 text-white' : 'border-red-500 bg-red-50 text-red-800'}`}
            >
              {t('studyConsent.error')}
            </div>
          )}

          <button
            type="button"
            onClick={handleStart}
            className={`w-full rounded-2xl py-4 text-sm font-black tracking-widest uppercase shadow-xl transition-all active:scale-[0.98] sm:py-5 sm:text-lg ${isHighContrast ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-700 text-white shadow-emerald-900/60 hover:bg-emerald-600'}`}
          >
            <BionicText text={t('studyConsent.startButton')} enabled={hasBionic} />
          </button>
        </div>
      </main>
    </div>
  );
}
