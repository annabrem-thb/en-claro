import React, { useState, useEffect, useCallback, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import {
  NasaTlxPayload,
  SusPayload,
  UeqPayload,
  GamificationFeedbackPayload,
  AppVersion,
} from '../../public/survey';
import { useAutoReadAloud } from '../hooks/useAutoReadAloud.js';
import { useGamification } from '../hooks/useGamification.js';
import { useSafeTimeouts } from '../hooks/useSafeTimeouts.js';
import { useUserSettingsContext } from '../hooks/useUserSettingsContext.js';
import { safeJSONParse } from '../utils/safeJSONParse.js';

import BionicText from './common/BionicText.jsx';

// Versioned so a future change to the payload shape can invalidate old
// drafts outright instead of trying to merge them. Keyed by checkpointId
// (a study-block number, or 'manual' for a nav-opened survey) rather than
// one fixed slot — the emergency bypass below (see attemptCount) can leave
// a block's draft behind on purpose, and the *next* checkpoint's survey
// must not load a previous, unrelated block's abandoned answers.
const SURVEY_DRAFT_KEY_PREFIX = 'enclaro:survey:v1:';

type SurveyDraft = {
  nasaScores: NasaTlxPayload;
  susScores: SusPayload;
  ueqScores: UeqPayload;
  gamificationFeedback: GamificationFeedbackPayload;
};

// Every localStorage access here is wrapped: private-browsing modes and a
// full storage quota can make both getItem and setItem throw, and losing a
// draft save is an acceptable failure — crashing the survey over it isn't.
function readSurveyDraft(checkpointId: string): SurveyDraft | null {
  try {
    return safeJSONParse(
      localStorage.getItem(SURVEY_DRAFT_KEY_PREFIX + checkpointId),
      null,
    );
  } catch {
    return null;
  }
}

function writeSurveyDraft(checkpointId: string, draft: SurveyDraft) {
  try {
    localStorage.setItem(
      SURVEY_DRAFT_KEY_PREFIX + checkpointId,
      JSON.stringify(draft),
    );
  } catch {
    // Nothing to recover into if this fails — the in-memory form state is
    // still authoritative for the current tab.
  }
}

function clearSurveyDraft(checkpointId: string) {
  try {
    localStorage.removeItem(SURVEY_DRAFT_KEY_PREFIX + checkpointId);
  } catch {
    // Stale draft left behind is harmless: it's overwritten by the next
    // autosave or simply ignored once a fresh submission succeeds again.
  }
}

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

// Standard UEQ-S item order: the first 4 pairs load onto the pragmatic
// quality factor, the last 4 onto hedonic quality.
const UEQ_SCALES: Array<{
  id: keyof UeqPayload;
  negLabel: string;
  posLabel: string;
}> = [
  {
    id: 'ueq01',
    negLabel: 'feedback.ueq.obstructive',
    posLabel: 'feedback.ueq.supportive',
  },
  {
    id: 'ueq02',
    negLabel: 'feedback.ueq.complicated',
    posLabel: 'feedback.ueq.easy',
  },
  {
    id: 'ueq03',
    negLabel: 'feedback.ueq.inefficient',
    posLabel: 'feedback.ueq.efficient',
  },
  {
    id: 'ueq04',
    negLabel: 'feedback.ueq.confusing',
    posLabel: 'feedback.ueq.clear',
  },
  {
    id: 'ueq05',
    negLabel: 'feedback.ueq.boring',
    posLabel: 'feedback.ueq.exciting',
  },
  {
    id: 'ueq06',
    negLabel: 'feedback.ueq.notInteresting',
    posLabel: 'feedback.ueq.interesting',
  },
  {
    id: 'ueq07',
    negLabel: 'feedback.ueq.conventional',
    posLabel: 'feedback.ueq.inventive',
  },
  {
    id: 'ueq08',
    negLabel: 'feedback.ueq.usual',
    posLabel: 'feedback.ueq.leadingEdge',
  },
];

// Only asked for a gamified session (see the isGamified gate around its
// fieldset below) — these target game elements a basis-version session
// never shows, so they'd be meaningless there.
const GAMIFICATION_SCALES: Array<{
  id: 'gardenMotivation' | 'badgeMotivation' | 'gameDistraction';
  label: string;
}> = [
  { id: 'gardenMotivation', label: 'feedback.gamification.gardenMotivation' },
  { id: 'badgeMotivation', label: 'feedback.gamification.badgeMotivation' },
  { id: 'gameDistraction', label: 'feedback.gamification.distraction' },
];

export const SurveyComponent: React.FC<{
  onSubmitted?: () => void;
  // Which draft slot this survey occurrence reads/writes/clears — a study
  // block number ('block-1', 'block-2') for a guided checkpoint, or the
  // default for a nav-opened survey. Keeps one block's bypassed, still-
  // unsent draft (see attemptCount below) from being read back as the
  // next block's answers.
  checkpointId?: string;
  // Same speak(text, slow?, onEnd?) every exercise/IntroScreen/Settings
  // gets from App.jsx — optional because the small handful of existing
  // callers (see SurveyComponent.test.tsx, if any) don't pass it, in which
  // case the voice-assistant announcements below simply no-op.
  speak?: (text: string, slow?: boolean, onEnd?: () => void) => void;
}> = ({ onSubmitted, checkpointId = 'manual', speak }) => {
  const { settings } = useUserSettingsContext();
  const { language, theme, userDifficulty, dailyGoal } = settings;
  const { isGamified } = useGamification();
  const voiceAssistant = !!settings.voiceAssistant && !!speak;
  // Every other dialog in the app (SettingsModal, IntroScreen, exercises)
  // branches on these two — the survey previously didn't, so High Contrast
  // mode left its colors untouched and Bionic Reading never bolded any of
  // its text, unlike everywhere else these settings apply.
  const isHighContrast = !!settings.contrast;
  const hasBionic = !!settings.bionicReading;

  const { t } = useTranslation();
  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  // Mirrors SettingsModal.jsx's own cleanup: a still-pending staggered
  // segment (see readIntroAloud/readSuccessAloud below) must not keep
  // talking, or start talking, once this dialog has closed.
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  const [nasaScores, setNasaScores] = useState<NasaTlxPayload>(
    () =>
      readSurveyDraft(checkpointId)?.nasaScores ?? {
        mentalDemand: 50,
        physicalDemand: 50,
        temporalDemand: 50,
        performance: 50,
        effort: 50,
        frustration: 50,
      },
  );

  const [susScores, setSusScores] = useState<SusPayload>(
    () =>
      readSurveyDraft(checkpointId)?.susScores ?? {
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
      },
  );

  const [ueqScores, setUeqScores] = useState<UeqPayload>(
    () =>
      readSurveyDraft(checkpointId)?.ueqScores ?? {
        ueq01: 4,
        ueq02: 4,
        ueq03: 4,
        ueq04: 4,
        ueq05: 4,
        ueq06: 4,
        ueq07: 4,
        ueq08: 4,
      },
  );

  const [gamificationFeedback, setGamificationFeedback] =
    useState<GamificationFeedbackPayload>(
      () =>
        readSurveyDraft(checkpointId)?.gamificationFeedback ?? {
          gardenMotivation: 3,
          badgeMotivation: 3,
          gameDistraction: 3,
          gameElementFeedback: '',
        },
    );

  // Autosaves on every change so a lost tab (crash, accidental reload,
  // closed by mistake) doesn't take an in-progress NASA-TLX/SUS/UEQ
  // response with it — restored above on next mount, cleared only once the
  // survey actually reaches the server (see handleSubmit's success path).
  useEffect(() => {
    writeSurveyDraft(checkpointId, {
      nasaScores,
      susScores,
      ueqScores,
      gamificationFeedback,
    });
  }, [checkpointId, nasaScores, susScores, ueqScores, gamificationFeedback]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Counts consecutive failed submit attempts so the emergency bypass below
  // only appears once it's clear this isn't a one-off blip — not on the
  // very first failure.
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Orients a voice-assistant user to what dialog they just landed in —
  // same "lead with what's on screen" convention as SettingsModal's
  // readGeneralTab, deliberately short (title + one-line description, not
  // the privacy notice or all ~27 individual items below) since every
  // NASA-TLX/SUS/UEQ/gamification item announces itself on interaction
  // instead (see handleNasaCommit/handleSusChange/handleUeqChange/
  // handleGamificationChange below) — reading all of them upfront here
  // would mean sitting through a very long monologue before being able to
  // answer anything.
  const readIntroAloud = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const segments = [t('feedback.title'), t('feedback.desc')];
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 900;
    });
  }, [speak, t, setSafeTimeout, clearAllTimeouts]);
  useAutoReadAloud(voiceAssistant && !isSuccess, readIntroAloud);

  // Confirms the submission actually went through — the visual success
  // screen already has role="status"/aria-live="polite" for a screen
  // reader, but a voice-assistant user without one still needs to hear it.
  const readSuccessAloud = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const segments = [
      t('feedback.successHeading', 'Sukces!'),
      t('feedback.thankYou'),
    ];
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 900;
    });
  }, [speak, t, setSafeTimeout, clearAllTimeouts]);
  useAutoReadAloud(voiceAssistant && isSuccess, readSuccessAloud);

  // Shared by every SUS/UEQ/gamification radio's onChange below and the
  // NASA slider's commit handlers further down — mirrors SettingsModal's
  // toggle-announce convention (label + the value just chosen), except a
  // slider only announces once the drag/keypress settles (see
  // handleNasaCommit), not on every intermediate value while dragging.
  const announce = (text: string) => {
    if (!voiceAssistant || !speak) return;
    clearAllTimeouts();
    speak(text);
  };

  const handleNasaChange = (id: keyof NasaTlxPayload, value: number) => {
    setNasaScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleNasaCommit = (
    scale: { id: keyof NasaTlxPayload; label: string },
    e: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    announce(`${t(scale.label)}, ${e.currentTarget.value}`);
  };

  const handleSusChange = (id: keyof SusPayload, value: number) => {
    setSusScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleUeqChange = (id: keyof UeqPayload, value: number) => {
    setUeqScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleGamificationChange = (
    id: 'gardenMotivation' | 'badgeMotivation' | 'gameDistraction',
    value: number,
  ) => {
    setGamificationFeedback((prev) => ({ ...prev, [id]: value }));
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
        ...ueqScores,
        // Only meaningful for the gamified condition — a basis-version
        // session never shows these elements, so they're left out of the
        // payload entirely rather than submitted as a meaningless score.
        ...(isGamified ? gamificationFeedback : {}),
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
        // The function's error/details text is always English and not
        // meant for end users (e.g. "a11yAddons must be an array.") — log
        // it for debugging but never render it, so a PL/DE participant
        // never sees raw untranslated backend text mid-form.
        console.error(
          '[survey submit] server error:',
          errData.details || errData.error || response.status,
        );
        throw new Error(
          t('feedback.errorServer', 'Wystąpił błąd komunikacji z serwerem.'),
        );
      }

      // Only here, on a confirmed 2xx response — not in `finally` below,
      // and not before the fetch resolves, so a failed or interrupted
      // submission always leaves the draft in place to retry from.
      clearSurveyDraft(checkpointId);
      setIsSuccess(true);
    } catch (err: any) {
      // Same reasoning as above: a genuine network/JS exception's own
      // `.message` (e.g. "Failed to fetch") is browser-generated English,
      // not a translated string — log it, but show the localized fallback.
      console.error('[survey submit]', err);
      setError(t('feedback.errorGeneric', 'Wystąpił nieoczekiwany błąd.'));
      setFailedAttempts((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Escape hatch for a genuine outage: a guided study checkpoint can't be
  // dismissed (see App.jsx's isStudyCheckpoint), so without this, a
  // participant hitting a dead server would be stuck retrying forever.
  // Deliberately does NOT clear the draft or set isSuccess — the answers
  // stay saved under this checkpoint's own key (never submitted, not lost
  // either) and the caller advances the study flow the same as a real
  // submit would.
  const handleBypass = () => {
    onSubmitted?.();
  };

  // Gives the participant a moment to see the confirmation before the
  // caller (App.jsx) reacts — closing the dialog, and for a guided study
  // block's checkpoint, advancing to the next block/finishing the study.
  useEffect(() => {
    if (!isSuccess || !onSubmitted) return;
    const timer = setTimeout(onSubmitted, 2000);
    return () => clearTimeout(timer);
  }, [isSuccess, onSubmitted]);

  const successRef = useRef<HTMLDivElement>(null);
  // The form (and whatever had focus on it, e.g. the Submit button) is
  // replaced by this confirmation entirely — without moving focus here, a
  // screen-reader user's focus is left on a now-detached element with
  // nothing announced, so they'd have no way to know the submission
  // actually succeeded.
  useEffect(() => {
    if (isSuccess) successRef.current?.focus();
  }, [isSuccess]);

  if (isSuccess) {
    return (
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className={`rounded-3xl border-2 p-8 text-center focus:outline-none ${isHighContrast ? 'border-white bg-black' : 'border-emerald-100 bg-emerald-50'}`}
      >
        <h2
          className={`mb-2 text-2xl font-black ${isHighContrast ? 'text-white' : 'text-emerald-600'}`}
        >
          🎉{' '}
          <BionicText
            text={t('feedback.successHeading', 'Sukces!')}
            enabled={hasBionic}
          />
        </h2>
        <p
          className={`font-medium ${isHighContrast ? 'text-white/80' : 'text-slate-600'}`}
        >
          <BionicText
            text={t('feedback.thankYou', 'Dziękujemy za Twoją opinię!')}
            enabled={hasBionic}
          />
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl border p-6 shadow-lg md:p-8 ${isHighContrast ? 'border-white bg-black' : 'border-slate-100 bg-white'}`}
    >
      <header className="px-10 text-center sm:px-12">
        <h1
          id="survey-title"
          className={`text-3xl font-black tracking-tight ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
        >
          <BionicText text={t('feedback.title')} enabled={hasBionic} />
        </h1>
        <p
          className={`mt-2 text-sm font-medium ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
        >
          <BionicText text={t('feedback.desc')} enabled={hasBionic} />
        </p>
      </header>

      <p
        className={`rounded-2xl border p-4 text-xs leading-relaxed font-medium sm:text-sm ${isHighContrast ? 'border-white/40 bg-white/10 text-white' : 'border-indigo-100 bg-indigo-50 text-slate-600'}`}
      >
        <BionicText text={t('feedback.privacyNotice')} enabled={hasBionic} />
      </p>

      {/* min-w-0: <fieldset> has a browser-default min-width of min-content,
          which silences flex/grid shrinking for every descendant (grid
          cells, wrapped labels, the legend text) regardless of their own
          classes — the actual source of several stubborn few-pixel overflows
          that individually-targeted min-w-0/flex-wrap fixes downstream
          couldn't resolve, since the constraint was coming from here. */}
      <fieldset className="flex min-w-0 flex-col gap-5">
        <legend
          className={`mb-4 w-full border-b pb-2 text-lg font-black tracking-widest uppercase ${isHighContrast ? 'border-white/30 text-white' : 'text-slate-400'}`}
        >
          <BionicText text={t('feedback.nasaTitle')} enabled={hasBionic} />
        </legend>
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {NASA_SCALES.map((scale) => (
            <div
              key={scale.id}
              className={`flex flex-col gap-2 rounded-2xl border p-4 ${isHighContrast ? 'border-white/30 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
            >
              <div className="flex items-end justify-between">
                <div>
                  <label
                    htmlFor={scale.id}
                    className={`block text-sm font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
                  >
                    <BionicText text={t(scale.label)} enabled={hasBionic} />
                  </label>
                  <span
                    className={`text-xs font-medium ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
                  >
                    <BionicText text={t(scale.desc)} enabled={hasBionic} />
                  </span>
                </div>
                <span
                  className={`text-xl font-black ${isHighContrast ? 'text-white' : 'text-indigo-500'}`}
                >
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
                onMouseUp={(e) => handleNasaCommit(scale, e)}
                onTouchEnd={(e) => handleNasaCommit(scale, e)}
                onKeyUp={(e) => handleNasaCommit(scale, e)}
                className={`mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg focus:ring-4 focus:outline-none ${isHighContrast ? 'bg-white/20 accent-white focus:ring-white/30' : 'bg-slate-200 accent-indigo-600 focus:ring-indigo-100'}`}
              />
              <div
                className={`mt-1 flex justify-between text-[10px] font-bold tracking-widest uppercase ${isHighContrast ? 'text-white/60' : 'text-slate-400'}`}
              >
                <span aria-hidden="true">
                  <BionicText text={t('feedback.low')} enabled={hasBionic} />
                </span>
                <span aria-hidden="true">
                  <BionicText text={t('feedback.high')} enabled={hasBionic} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {}
      <fieldset className="flex min-w-0 flex-col gap-4">
        <legend
          className={`mb-4 w-full border-b pb-2 text-lg font-black tracking-widest uppercase ${isHighContrast ? 'border-white/30 text-white' : 'text-slate-400'}`}
        >
          <BionicText text={t('survey.susTitle')} enabled={hasBionic} />
        </legend>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          {SUS_SCALES.map((scale) => (
            <div
              key={scale.id}
              className={`flex flex-col gap-3 rounded-2xl border p-4 ${isHighContrast ? 'border-white/30 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
            >
              <label
                id={`label-${scale.id}`}
                className={`block text-sm leading-snug font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
              >
                <BionicText text={t(scale.label)} enabled={hasBionic} />
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
                        onChange={() => {
                          handleSusChange(scale.id, val);
                          announce(`${t(scale.label)}, ${val}`);
                        }}
                        className={`h-6 w-6 appearance-none rounded-full border-2 transition-all focus:outline-none focus-visible:ring-4 md:h-7 md:w-7 ${isHighContrast ? 'border-white/50 checked:border-white checked:bg-white focus-visible:ring-white/30' : 'border-slate-300 checked:border-transparent checked:bg-indigo-500 group-hover:border-indigo-400 focus-visible:ring-indigo-100'}`}
                        aria-label={t('feedback.rateAria', {
                          value: val,
                          max: 5,
                          defaultValue: `Rate ${val} out of 5`,
                        })}
                      />
                    </label>
                  ))}
                </div>

                <div className="flex w-full items-start justify-between gap-2">
                  <span
                    className={`min-w-0 flex-1 text-center text-[10px] leading-tight font-bold sm:text-xs ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}
                  >
                    <BionicText
                      text={t(
                        'survey.susAnchors.stronglyDisagree',
                        'Strongly Disagree',
                      )}
                      enabled={hasBionic}
                    />
                  </span>
                  <span
                    className={`min-w-0 flex-1 text-center text-[10px] leading-tight font-bold sm:text-xs ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}
                  >
                    <BionicText
                      text={t(
                        'survey.susAnchors.stronglyAgree',
                        'Strongly Agree',
                      )}
                      enabled={hasBionic}
                    />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {}
      <fieldset className="flex min-w-0 flex-col gap-4">
        <legend
          className={`mb-4 w-full border-b pb-2 text-lg font-black tracking-widest uppercase ${isHighContrast ? 'border-white/30 text-white' : 'text-slate-400'}`}
        >
          <BionicText text={t('feedback.ueqTitle')} enabled={hasBionic} />
        </legend>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          {UEQ_SCALES.map((scale) => (
            <div
              key={scale.id}
              className={`flex flex-col gap-3 rounded-2xl border p-4 ${isHighContrast ? 'border-white/30 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
            >
              <div
                id={`label-${scale.id}`}
                className="flex w-full items-start justify-between gap-2"
              >
                <span
                  className={`min-w-0 flex-1 text-left text-sm font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
                >
                  <BionicText text={t(scale.negLabel)} enabled={hasBionic} />
                </span>
                <span
                  className={`min-w-0 flex-1 text-right text-sm font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
                >
                  <BionicText text={t(scale.posLabel)} enabled={hasBionic} />
                </span>
              </div>

              <div
                className="flex flex-wrap items-center justify-center gap-2 md:gap-3"
                role="radiogroup"
                aria-labelledby={`label-${scale.id}`}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                  <label
                    key={`${scale.id}-${val}`}
                    className="group relative flex cursor-pointer flex-col items-center p-1"
                  >
                    <span className="sr-only">{val}</span>
                    <input
                      type="radio"
                      name={scale.id}
                      value={val}
                      checked={ueqScores[scale.id] === val}
                      onChange={() => {
                        handleUeqChange(scale.id, val);
                        announce(
                          `${t(scale.negLabel)} – ${t(scale.posLabel)}, ${val}`,
                        );
                      }}
                      className={`h-6 w-6 appearance-none rounded-full border-2 transition-all focus:outline-none focus-visible:ring-4 md:h-7 md:w-7 ${isHighContrast ? 'border-white/50 checked:border-white checked:bg-white focus-visible:ring-white/30' : 'border-slate-300 checked:border-transparent checked:bg-indigo-500 group-hover:border-indigo-400 focus-visible:ring-indigo-100'}`}
                      aria-label={t('feedback.rateAria', {
                        value: val,
                        max: 7,
                        defaultValue: `Rate ${val} out of 7`,
                      })}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {}
      {/* Only a gamified session ever shows a garden, badges, or the
          progress indicator these three items ask about — a basis-version
          session skips this fieldset entirely rather than asking about
          elements the participant never saw (see isGamified in the
          payload construction above, which mirrors this same gate). */}
      {isGamified && (
        <fieldset className="flex min-w-0 flex-col gap-4">
          <legend
            className={`mb-4 w-full border-b pb-2 text-lg font-black tracking-widest uppercase ${isHighContrast ? 'border-white/30 text-white' : 'text-slate-400'}`}
          >
            <BionicText
              text={t('feedback.gamificationTitle')}
              enabled={hasBionic}
            />
          </legend>
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
            {GAMIFICATION_SCALES.map((scale) => (
              <div
                key={scale.id}
                className={`flex flex-col gap-3 rounded-2xl border p-4 ${isHighContrast ? 'border-white/30 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
              >
                <label
                  id={`label-${scale.id}`}
                  className={`block text-sm leading-snug font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
                >
                  <BionicText text={t(scale.label)} enabled={hasBionic} />
                </label>

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
                          checked={gamificationFeedback[scale.id] === val}
                          onChange={() => {
                            handleGamificationChange(scale.id, val);
                            announce(`${t(scale.label)}, ${val}`);
                          }}
                          className={`h-6 w-6 appearance-none rounded-full border-2 transition-all focus:outline-none focus-visible:ring-4 md:h-7 md:w-7 ${isHighContrast ? 'border-white/50 checked:border-white checked:bg-white focus-visible:ring-white/30' : 'border-slate-300 checked:border-transparent checked:bg-indigo-500 group-hover:border-indigo-400 focus-visible:ring-indigo-100'}`}
                          aria-label={t('feedback.rateAria', {
                            value: val,
                            max: 5,
                            defaultValue: `Rate ${val} out of 5`,
                          })}
                        />
                      </label>
                    ))}
                  </div>

                  <div className="flex w-full items-start justify-between gap-2">
                    <span
                      className={`min-w-0 flex-1 text-center text-[10px] leading-tight font-bold sm:text-xs ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}
                    >
                      <BionicText
                        text={t(
                          'survey.susAnchors.stronglyDisagree',
                          'Strongly Disagree',
                        )}
                        enabled={hasBionic}
                      />
                    </span>
                    <span
                      className={`min-w-0 flex-1 text-center text-[10px] leading-tight font-bold sm:text-xs ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}
                    >
                      <BionicText
                        text={t(
                          'survey.susAnchors.stronglyAgree',
                          'Strongly Agree',
                        )}
                        enabled={hasBionic}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div
              className={`flex flex-col gap-2 rounded-2xl border p-4 lg:col-span-2 ${isHighContrast ? 'border-white/30 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
            >
              <label
                htmlFor="gameElementFeedback"
                className={`block text-sm leading-snug font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
              >
                <BionicText
                  text={t('feedback.gamification.elementFeedbackLabel')}
                  enabled={hasBionic}
                />
              </label>
              <textarea
                id="gameElementFeedback"
                value={gamificationFeedback.gameElementFeedback}
                onChange={(e) =>
                  setGamificationFeedback((prev) => ({
                    ...prev,
                    gameElementFeedback: e.target.value,
                  }))
                }
                maxLength={500}
                rows={3}
                placeholder={t(
                  'feedback.gamification.elementFeedbackPlaceholder',
                )}
                className={`w-full resize-none rounded-xl border p-3 text-sm focus:ring-4 focus:outline-none ${isHighContrast ? 'border-white/50 bg-black text-white focus:ring-white/30 placeholder:text-white/50' : 'border-slate-200 bg-white text-slate-700 focus:ring-indigo-100'}`}
              />
            </div>
          </div>
        </fieldset>
      )}

      {}
      {error && (
        <div
          className={`rounded-r-lg border-l-4 p-4 text-sm font-medium ${isHighContrast ? 'border-white bg-white/10 text-white' : 'border-red-500 bg-red-50 text-red-700'}`}
        >
          {error}
        </div>
      )}

      {}
      {/* Only after repeated failures, not the first one — a single dropped
          request shouldn't immediately offer to bail on submitting. Below
          a normal Submit retry rather than replacing it: the network may
          well recover, and this only exists for the case where it doesn't. */}
      {failedAttempts >= 2 && (
        <div
          className={`rounded-r-lg border-l-4 p-4 text-sm ${isHighContrast ? 'border-white bg-white/10 text-white' : 'border-amber-400 bg-amber-50 text-amber-800'}`}
        >
          <p className="font-medium">
            <BionicText
              text={t('feedback.offlineNotice')}
              enabled={hasBionic}
            />
          </p>
          <button
            type="button"
            onClick={handleBypass}
            className={`mt-3 font-black tracking-widest uppercase underline underline-offset-2 ${isHighContrast ? 'hover:text-white/80' : 'hover:text-amber-900'}`}
          >
            <BionicText text={t('feedback.skip')} enabled={hasBionic} />
          </button>
        </div>
      )}

      <div
        className={`border-t pt-4 ${isHighContrast ? 'border-white/30' : 'border-slate-100'}`}
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-2xl py-5 font-black tracking-widest uppercase shadow-lg transition-all focus:ring-4 focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:grayscale ${isHighContrast ? 'bg-white text-black hover:bg-slate-200 focus:ring-white/30' : 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-200'}`}
        >
          <BionicText
            text={
              isSubmitting
                ? t('loading', 'Ładowanie...')
                : t('feedback.submit', 'Zapisz')
            }
            enabled={hasBionic}
          />
        </button>
      </div>
    </form>
  );
};
