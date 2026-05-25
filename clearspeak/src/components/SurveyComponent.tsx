import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../hooks/useAppSettings.js';
import { useGamification } from './GamificationContext.jsx';
import { NasaTlxPayload, SusPayload, AppVersion } from '../../public/survey';

// DRY Configuration: Array mappings for NASA-TLX
const NASA_SCALES: Array<{ id: keyof NasaTlxPayload; label: string; desc: string }> = [
  { id: 'mentalDemand', label: 'feedback.nasa.mental', desc: 'feedback.nasa.mentalDesc' },
  { id: 'physicalDemand', label: 'feedback.nasa.physical', desc: 'feedback.nasa.physicalDesc' },
  { id: 'temporalDemand', label: 'feedback.nasa.temporal', desc: 'feedback.nasa.temporalDesc' },
  { id: 'performance', label: 'feedback.nasa.performance', desc: 'feedback.nasa.performanceDesc' },
  { id: 'effort', label: 'feedback.nasa.effort', desc: 'feedback.nasa.effortDesc' },
  { id: 'frustration', label: 'feedback.nasa.frustration', desc: 'feedback.nasa.frustrationDesc' }
];

// DRY Configuration: Array mappings for System Usability Scale (SUS)
const SUS_SCALES: Array<{ id: keyof SusPayload; label: string }> = [
  { id: 'sus01', label: 'survey.sus.q01' },
  { id: 'sus02', label: 'survey.sus.q02' },
  { id: 'sus03', label: 'survey.sus.q03' },
  { id: 'sus04', label: 'survey.sus.q04' },
  { id: 'sus05', label: 'survey.sus.q05' },
  { id: 'sus06', label: 'survey.sus.q06' },
  { id: 'sus07', label: 'survey.sus.q07' },
  { id: 'sus08', label: 'survey.sus.q08' },
  { id: 'sus09', label: 'survey.sus.q09' },
  { id: 'sus10', label: 'survey.sus.q10' }
];

export const SurveyComponent: React.FC = () => {
  const { language, theme, a11yAddons, inclusiveOptions, userDifficulty, dailyGoal } = useAppSettings();
  const { isGamified } = useGamification();
  
  // Pobieranie metody `t` natywnie z react-i18next
  const { t } = useTranslation();

  // State definitions matching the schema requirements
  const [nasaScores, setNasaScores] = useState<NasaTlxPayload>({
    mentalDemand: 50,
    physicalDemand: 50,
    temporalDemand: 50,
    performance: 50,
    effort: 50,
    frustration: 50,
  });

  const [susScores, setSusScores] = useState<SusPayload>({
    sus01: 3, sus02: 3, sus03: 3, sus04: 3, sus05: 3, sus06: 3, sus07: 3, sus08: 3, sus09: 3, sus10: 3
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNasaChange = (id: keyof NasaTlxPayload, value: number) => {
    setNasaScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleSusChange = (id: keyof SusPayload, value: number) => {
    setSusScores((prev) => ({ ...prev, [id]: value }));
  };

  /**
   * Handles processing the form and passing the payload to the Netlify Serverless Function proxy.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Retrieve or generate a persistent anonymous participant ID
      let participantId = localStorage.getItem('cfg_participant_id');
      if (!participantId) {
        participantId = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('cfg_participant_id', participantId);
      }
      
      const appVersion: AppVersion = isGamified ? 'vollversion' : 'basis';

      const payload = {
        ...nasaScores,
        ...susScores,
        participantId,
        appVersion,
        userLanguage: language,
        localTimestamp: new Date().toISOString(),
        theme,
        a11yAddons,
        inclusiveOptions,
        userDifficulty,
        dailyGoal
      };

      const response = await fetch('/.netlify/functions/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || t('error', 'Wystąpił błąd komunikacji z serwerem.'));
      }
      
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || t('error', 'Wystąpił nieoczekiwany błąd.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 text-center bg-emerald-50 rounded-3xl border-2 border-emerald-100">
        <h2 className="text-2xl font-black text-emerald-600 mb-2">🎉 {t('success', 'Sukces!')}</h2>
        <p className="text-slate-600 font-medium">{t('feedback.thankYou', 'Dziękujemy za Twoją opinię!')}</p>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-8 w-full max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100"
    >
      <header className="text-center">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('feedback.title')}</h1>
        <p className="text-sm font-medium text-slate-500 mt-2">{t('feedback.desc')}</p>
      </header>

      {/* --- NASA-TLX Section --- */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-lg font-black uppercase tracking-widest text-slate-400 mb-4 border-b w-full pb-2">
          {t('feedback.nasaTitle')}
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {NASA_SCALES.map((scale) => (
          <div key={scale.id} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-end">
              <div>
                <label htmlFor={scale.id} className="text-sm font-bold text-slate-700 block">
                  {t(scale.label)}
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {t(scale.desc)}
                </span>
              </div>
              <span className="text-xl font-black text-indigo-500">
                {nasaScores[scale.id]}
              </span>
            </div>
            {/* Accessible slider input */}
            <input
              id={scale.id}
              type="range"
              min="1"
              max="100"
              step="1"
              value={nasaScores[scale.id]}
              onChange={(e) => handleNasaChange(scale.id, parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            />
            <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span aria-hidden="true">{t('feedback.low')}</span>
              <span aria-hidden="true">{t('feedback.high')}</span>
            </div>
          </div>
        ))}
        </div>
      </fieldset>

      {/* --- System Usability Scale (SUS) Section --- */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-lg font-black uppercase tracking-widest text-slate-400 mb-4 border-b w-full pb-2">
          {t('survey.susTitle')}
        </legend>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {SUS_SCALES.map((scale) => (
          <div key={scale.id} className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <label id={`label-${scale.id}`} className="text-sm font-bold text-slate-700 block leading-snug">
              {t(scale.label)}
            </label>

            <div className="flex items-center justify-between mt-2 gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 max-w-[80px] text-center leading-tight">
                {t('survey.susAnchors.stronglyDisagree', 'Strongly Disagree')}
              </span>
              
              {/* 5-Point Likert Radio Buttons */}
              <div className="flex gap-2 md:gap-4 items-center justify-center flex-1" role="radiogroup" aria-labelledby={`label-${scale.id}`}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <label key={`${scale.id}-${val}`} className="flex flex-col items-center cursor-pointer group p-1 relative">
                    <span className="sr-only">{val}</span>
                    <input
                      type="radio"
                      name={scale.id}
                      value={val}
                      checked={susScores[scale.id] === val}
                      onChange={() => handleSusChange(scale.id, val)}
                      className="w-6 h-6 md:w-7 md:h-7 appearance-none border-2 border-slate-300 rounded-full checked:bg-indigo-500 checked:border-transparent transition-all group-hover:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-100 focus:outline-none"
                      aria-label={`Rate ${val} out of 5`}
                    />
                  </label>
                ))}
              </div>

              <span className="text-[10px] sm:text-xs font-bold text-slate-400 max-w-[80px] text-center leading-tight">
                {t('survey.susAnchors.stronglyAgree', 'Strongly Agree')}
              </span>
            </div>
          </div>
        ))}
        </div>
      </fieldset>

      {/* --- Error & Submission --- */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium text-sm">
          {error}
        </div>
      )}

      <div className="pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-lg hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          {isSubmitting ? t('loading', 'Ładowanie...') : t('feedback.submit', 'Zapisz')}
        </button>
      </div>
    </form>
  );
};