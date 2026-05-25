import React, { useState } from 'react';
import { useTranslation } from '../i18n/i18n.js';
import { useAppSettings } from '../hooks/useAppSettings.js';
import { NasaTlxPayload, UeqShortPayload } from '../types/survey';

// DRY Configuration: Array mappings for NASA-TLX
const NASA_SCALES: Array<{ id: keyof NasaTlxPayload; label: string; desc: string }> = [
  { id: 'mentalDemand', label: 'feedback.nasa.mental', desc: 'feedback.nasa.mentalDesc' },
  { id: 'physicalDemand', label: 'feedback.nasa.physical', desc: 'feedback.nasa.physicalDesc' },
  { id: 'temporalDemand', label: 'feedback.nasa.temporal', desc: 'feedback.nasa.temporalDesc' },
  { id: 'performance', label: 'feedback.nasa.performance', desc: 'feedback.nasa.performanceDesc' },
  { id: 'effort', label: 'feedback.nasa.effort', desc: 'feedback.nasa.effortDesc' },
  { id: 'frustration', label: 'feedback.nasa.frustration', desc: 'feedback.nasa.frustrationDesc' }
];

// DRY Configuration: Array mappings for UEQ-Short
const UEQ_SCALES: Array<{ id: keyof UeqShortPayload; leftAnchor: string; rightAnchor: string }> = [
  { id: 'ueq1', leftAnchor: 'feedback.ueq.obstructive', rightAnchor: 'feedback.ueq.supportive' },
  { id: 'ueq2', leftAnchor: 'feedback.ueq.complicated', rightAnchor: 'feedback.ueq.easy' },
  { id: 'ueq3', leftAnchor: 'feedback.ueq.inefficient', rightAnchor: 'feedback.ueq.efficient' },
  { id: 'ueq4', leftAnchor: 'feedback.ueq.confusing', rightAnchor: 'feedback.ueq.clear' },
  { id: 'ueq5', leftAnchor: 'feedback.ueq.boring', rightAnchor: 'feedback.ueq.exciting' },
  { id: 'ueq6', leftAnchor: 'feedback.ueq.notInteresting', rightAnchor: 'feedback.ueq.interesting' },
  { id: 'ueq7', leftAnchor: 'feedback.ueq.conventional', rightAnchor: 'feedback.ueq.inventive' },
  { id: 'ueq8', leftAnchor: 'feedback.ueq.usual', rightAnchor: 'feedback.ueq.leadingEdge' }
];

export const SurveyComponent: React.FC = () => {
  const { language, theme, a11yAddons, inclusiveOptions, userDifficulty, dailyGoal } = useAppSettings();
  const dict = useTranslation(language);

  // Funkcja pomocnicza pozwalająca pobierać zagnieżdżone tłumaczenia (np. "feedback.nasa.mental")
  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let result: any = dict;
    for (const k of keys) {
      if (result == null) break;
      result = result[k];
    }
    return result || fallback || path;
  };

  // State definitions matching the schema requirements
  const [nasaScores, setNasaScores] = useState<NasaTlxPayload>({
    mentalDemand: 50,
    physicalDemand: 50,
    temporalDemand: 50,
    performance: 50,
    effort: 50,
    frustration: 50,
  });

  const [ueqScores, setUeqScores] = useState<UeqShortPayload>({
    ueq1: 4, ueq2: 4, ueq3: 4, ueq4: 4, ueq5: 4, ueq6: 4, ueq7: 4, ueq8: 4,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNasaChange = (id: keyof NasaTlxPayload, value: number) => {
    setNasaScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleUeqChange = (id: keyof UeqShortPayload, value: number) => {
    setUeqScores((prev) => ({ ...prev, [id]: value }));
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

      const payload = {
        ...nasaScores,
        ...ueqScores,
        participantId,
        userLanguage: language,
        localTimestamp: new Date().toISOString(),
        theme,
        a11yAddons: Array.isArray(a11yAddons) ? a11yAddons.join(', ') : '',
        inclusiveOptions: inclusiveOptions ? Object.keys(inclusiveOptions).filter(k => inclusiveOptions[k]).join(', ') : '',
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
      className="flex flex-col gap-8 w-full max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100"
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
      </fieldset>

      {/* --- UEQ-Short Section --- */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-lg font-black uppercase tracking-widest text-slate-400 mb-4 border-b w-full pb-2">
          {t('feedback.ueqTitle')}
        </legend>
        {UEQ_SCALES.map((scale) => (
          <div key={scale.id} className="flex items-center justify-between gap-2 md:gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            {/* Left anchor */}
            <span className="flex-1 text-right text-xs md:text-sm font-bold text-slate-600 leading-tight">
              {t(scale.leftAnchor)}
            </span>
            
            {/* 7-Point Likert Radio Buttons */}
            <div 
              className="flex gap-1 md:gap-2 items-center justify-center shrink-0" 
              role="radiogroup" 
              aria-label={`${t(scale.leftAnchor)} vs ${t(scale.rightAnchor)}`}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                <label 
                  key={`${scale.id}-${val}`} 
                  className="flex flex-col items-center cursor-pointer group p-1"
                >
                  <span className="sr-only">{val}</span>
                  <input
                    type="radio"
                    name={scale.id}
                    value={val}
                    checked={ueqScores[scale.id] === val}
                    onChange={() => handleUeqChange(scale.id, val)}
                    className="w-5 h-5 md:w-6 md:h-6 appearance-none border-2 border-slate-300 rounded-full checked:bg-indigo-500 checked:border-transparent transition-all group-hover:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-100 focus:outline-none"
                    aria-label={`Rate ${val} out of 7`}
                  />
                </label>
              ))}
            </div>
            
            {/* Right anchor */}
            <span className="flex-1 text-left text-xs md:text-sm font-bold text-slate-600 leading-tight">
              {t(scale.rightAnchor)}
            </span>
          </div>
        ))}
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