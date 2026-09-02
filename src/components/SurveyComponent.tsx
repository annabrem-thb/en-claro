import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { NasaTlxPayload, SusPayload, AppVersion } from '../../public/survey';
import { useGamification } from '../hooks/useGamification.js';
import { useUserSettingsContext } from '../hooks/useUserSettingsContext.js';

const NASA_SCALES: Array<{
  id: keyof NasaTlxPayload;
  label: string;
  desc: string;
}> = [
  {
    id: 'mentalDemand',
    label: 'feedback.nasa.mental',
    desc: 'feedback.nasa.mentalDesc',
  },
  {
    id: 'physicalDemand',
    label: 'feedback.nasa.physical',
    desc: 'feedback.nasa.physicalDesc',
  },
  {
    id: 'temporalDemand',
    label: 'feedback.nasa.temporal',
    desc: 'feedback.nasa.temporalDesc',
  },
  {
    id: 'performance',
    label: 'feedback.nasa.performance',
    desc: 'feedback.nasa.performanceDesc',
  },
  {
    id: 'effort',
    label: 'feedback.nasa.effort',
    desc: 'feedback.nasa.effortDesc',
  },
  {
    id: 'frustration',
    label: 'feedback.nasa.frustration',
    desc: 'feedback.nasa.frustrationDesc',
  },
];

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
  { id: 'sus10', label: 'survey.sus.q10' },
];

export const SurveyComponent: React.FC = () => {
  const { settings } = useUserSettingsContext();
  const { language, theme, userDifficulty, dailyGoal } = settings;
  const { isGamified } = useGamification();

  const { t } = useTranslation();

  const [nasaScores, setNasaScores] = useState<NasaTlxPayload>({
    mentalDemand: 50,
    physicalDemand: 50,
    temporalDemand: 50,
    performance: 50,
    effort: 50,
    frustration: 50,
  });

  const [susScores, setSusScores] = useState<SusPayload>({
    sus01: 3,
    sus02: 3,
    sus03: 3,
    sus04: 3,
    sus05: 3,
    sus06: 3,
    sus07: 3,
    sus08: 3,
    sus09: 3,
    sus10: 3,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let participantId = localStorage.getItem('cfg_participant_id');
      if (!participantId) {
        participantId =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('cfg_participant_id', participantId);
      }

      const appVersion: AppVersion = isGamified ? 'vollversion' : 'basis';

      // Reconstruct the legacy addon-name array / inclusive-options object shape
      // that the submit-survey function and Supabase schema expect, from the
      // canonical boolean settings object.
      const a11yAddons = Object.entries({
        LRS: settings.lrs,
        Kontrast: settings.contrast,
        Motorik: settings.motorik,
        // `vision`/`spacing` were fixed booleans (115% zoom; a fixed
        // spacing preset); now that both are continuous sliders, "active"
        // is approximated as "moved above its own default minimum" rather
        // than a specific position.
        Niedowidzenie: settings.fontSizeUi > 16 || settings.fontSizeExercise > 16,
        Daltonizm: settings.color,
        Redukcja: settings.motion,
        Linijka: settings.ruler,
        Spacing:
          settings.lineHeight > 1.5 ||
          settings.letterSpacing > 0 ||
          settings.wordSpacing > 0 ||
          settings.paragraphSpacing > 0,
        Desaturacja: settings.desaturation,
      })
        .filter(([, active]) => active)
        .map(([key]) => key);

      const inclusiveOptions = {
        adaptiveDifficulty: settings.adaptiveDifficulty,
        bigTargets: settings.bigTargets,
        noFlash: settings.noFlash,
        audioRewards: settings.audioRewards,
        extendedTime: settings.extendedTime,
        zenMode: settings.zenMode,
        bionicReading: settings.bionicReading,
        minimalistMode: settings.minimalist,
        muteNotifications: settings.muteNotifications,
        voiceAssistant: settings.voiceAssistant,
      };

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
        dailyGoal,
      };

      const response = await fetch('/.netlify/functions/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.details ||
            errData.error ||
            t('error', 'Wystąpił błąd komunikacji z serwerem.'),
        );
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
      <div className="rounded-3xl border-2 border-emerald-100 bg-emerald-50 p-8 text-center">
        <h2 className="mb-2 text-2xl font-black text-emerald-600">
          🎉 {t('success', 'Sukces!')}
        </h2>
        <p className="font-medium text-slate-600">
          {t('feedback.thankYou', 'Dziękujemy za Twoją opinię!')}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg md:p-8"
    >
      <header className="px-10 text-center sm:px-12">
        <h1
          id="survey-title"
          className="text-3xl font-black tracking-tight text-slate-800"
        >
          {t('feedback.title')}
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          {t('feedback.desc')}
        </p>
      </header>

      <p className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-xs leading-relaxed font-medium text-slate-600 sm:text-sm">
        {t('feedback.privacyNotice')}
      </p>

      {/* min-w-0: <fieldset> has a browser-default min-width of min-content,
          which silences flex/grid shrinking for every descendant (grid
          cells, wrapped labels, the legend text) regardless of their own
          classes — the actual source of several stubborn few-pixel overflows
          that individually-targeted min-w-0/flex-wrap fixes downstream
          couldn't resolve, since the constraint was coming from here. */}
      <fieldset className="flex min-w-0 flex-col gap-5">
        <legend className="mb-4 w-full border-b pb-2 text-lg font-black tracking-widest text-slate-400 uppercase">
          {t('feedback.nasaTitle')}
        </legend>
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {NASA_SCALES.map((scale) => (
            <div
              key={scale.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-end justify-between">
                <div>
                  <label
                    htmlFor={scale.id}
                    className="block text-sm font-bold text-slate-700"
                  >
                    {t(scale.label)}
                  </label>
                  <span className="text-xs font-medium text-slate-500">
                    {t(scale.desc)}
                  </span>
                </div>
                <span className="text-xl font-black text-indigo-500">
                  {nasaScores[scale.id]}
                </span>
              </div>
              {}
              <input
                id={scale.id}
                type="range"
                min="1"
                max="100"
                step="1"
                value={nasaScores[scale.id]}
                onChange={(e) =>
                  handleNasaChange(scale.id, parseInt(e.target.value, 10))
                }
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
              />
              <div className="mt-1 flex justify-between text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                <span aria-hidden="true">{t('feedback.low')}</span>
                <span aria-hidden="true">{t('feedback.high')}</span>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {}
      <fieldset className="flex min-w-0 flex-col gap-4">
        <legend className="mb-4 w-full border-b pb-2 text-lg font-black tracking-widest text-slate-400 uppercase">
          {t('survey.susTitle')}
        </legend>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          {SUS_SCALES.map((scale) => (
            <div
              key={scale.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <label
                id={`label-${scale.id}`}
                className="block text-sm leading-snug font-bold text-slate-700"
              >
                {t(scale.label)}
              </label>

              {}
              {/* Radio row and its two anchor labels are stacked rather than
                  forced onto one line: every size here (the 24-28px radio
                  circles, their gaps) is Tailwind's rem-based spacing scale,
                  which tracks the app's dynamic root font-size
                  (--font-size-ui) the same as body text does — a user with a
                  much larger OS/browser text size ends up with
                  proportionally much larger circles too. A single-line
                  layout had nowhere left to give and silently clipped the
                  "Strongly Agree" label and the last rating options past the
                  card's edge once it no longer fit. Stacking the circles
                  above the labels (with the circles free to wrap onto a
                  second line, and each label capped to under half the card's
                  width) keeps every option reachable at any text size
                  (WCAG 1.4.10 Reflow) instead of relying on one line having
                  enough room. */}
              <div className="mt-2 flex flex-col items-center gap-3">
                <div
                  className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
                  role="radiogroup"
                  aria-labelledby={`label-${scale.id}`}
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label
                      key={`${scale.id}-${val}`}
                      className="group relative flex cursor-pointer flex-col items-center p-1"
                    >
                      <span className="sr-only">{val}</span>
                      <input
                        type="radio"
                        name={scale.id}
                        value={val}
                        checked={susScores[scale.id] === val}
                        onChange={() => handleSusChange(scale.id, val)}
                        className="h-6 w-6 appearance-none rounded-full border-2 border-slate-300 transition-all group-hover:border-indigo-400 checked:border-transparent checked:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 md:h-7 md:w-7"
                        aria-label={t('feedback.rateAria', {
                          value: val,
                          defaultValue: `Rate ${val} out of 5`,
                        })}
                      />
                    </label>
                  ))}
                </div>

                <div className="flex w-full items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 text-center text-[10px] leading-tight font-bold text-slate-400 sm:text-xs">
                    {t(
                      'survey.susAnchors.stronglyDisagree',
                      'Strongly Disagree',
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-center text-[10px] leading-tight font-bold text-slate-400 sm:text-xs">
                    {t('survey.susAnchors.stronglyAgree', 'Strongly Agree')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {}
      {error && (
        <div className="rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-indigo-600 py-5 font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-200 focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting
            ? t('loading', 'Ładowanie...')
            : t('feedback.submit', 'Zapisz')}
        </button>
      </div>
    </form>
  );
};
