import { useCallback, useEffect, useId, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { STUDY_EXERCISE_PILLARS } from '../data/exerciseTypes.js';
import { useAutoReadAloud } from '../hooks/useAutoReadAloud.js';
import { useGamification } from '../hooks/useGamification.js';
import { useSafeTimeouts } from '../hooks/useSafeTimeouts.js';
import { useStudyMode } from '../hooks/useStudyMode.js';
import { useStudySet } from '../hooks/useStudySet.js';
import { useUserSettingsContext } from '../hooks/useUserSettingsContext.js';

import ExerciseToggleManager from './ExerciseToggleManager.jsx';
import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';
import LanguageSwitcher from './common/LanguageSwitcher.jsx';

const THEMES = {
  Natur: {
    name: 'Natura',
    icon: '🌿',
    desc: 'Zielone barwy, relaks',
  },
  Musik: { name: 'Muzyka', icon: '🎵', desc: 'Fiolet, dynamika' },
  Kunst: {
    name: 'Sztuka',
    icon: '🎨',
    desc: 'Bursztyn, kreatywność',
  },
  Space: { name: 'Kosmos', icon: '🚀', desc: 'Kosmiczna głębia' },
  Ocean: { name: 'Ocean', icon: '🐳', desc: 'Morski spokój' },
};

const SettingToggle = ({
  label,
  desc,
  checked,
  onChange,
  bionic,
  isHighContrast,
}) => (
  <div
    className={`flex items-center justify-between rounded-xl p-3 transition-colors ${checked ? (isHighContrast ? 'bg-white/10' : 'bg-slate-50') : ''}`}
  >
    <div className="mr-4 min-w-0 flex-1">
      <p
        className={`font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
      >
        <BionicText text={label} enabled={bionic} />
      </p>
      <p
        className={`text-xs ${isHighContrast ? 'text-white/60' : 'text-slate-500'}`}
      >
        <BionicText text={desc} enabled={bionic} />
      </p>
    </div>
    <button
      role="switch"
      aria-checked={checked}
      // The visible label/description above are separate sibling <p>
      // elements, not children of this button, so without an explicit
      // accessible name a screen reader announces every one of these
      // switches identically as just "switch, not checked" — indistinguishable
      // from each other. (Caught by an axe-core sweep: `button-name`,
      // critical impact, all 14 switches on this tab.)
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-emerald-500' : isHighContrast ? 'bg-white/30' : 'bg-slate-200'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

// One of the six design-token sliders — reaches from `min` (today's default
// look, unchanged) up to `max` (the spec's stated cap). Unlike SettingToggle
// this is a genuine range control, not a repurposed switch, since these
// tokens are continuous values rather than on/off states.
const SettingSlider = ({
  label,
  desc,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  bionic,
  isHighContrast,
}) => {
  const inputId = useId();
  return (
    <div className="rounded-xl p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label
          htmlFor={inputId}
          className={`font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
        >
          <BionicText text={label} enabled={bionic} />
        </label>
        <span
          className={`shrink-0 text-sm font-medium tabular-nums ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
        >
          {value}
          {unit}
        </span>
      </div>
      <p
        className={`mb-2 text-xs ${isHighContrast ? 'text-white/60' : 'text-slate-500'}`}
      >
        <BionicText text={desc} enabled={bionic} />
      </p>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500"
      />
    </div>
  );
};

const GeneralTab = ({ speak }) => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { isGamified, setIsGamified } = useGamification();
  const { studyModeEnabled, setStudyModeEnabled, isActive: studyModeActive } =
    useStudyMode();
  const bionicReading = !!settings.bionicReading;
  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  // Leads with the tab name so switching into Settings (or into this tab)
  // orients the listener before diving into its content — same "read what's
  // on screen when the voice assistant is active" behavior as the exercises
  // (useAutoReadAloud), just applied to Settings/the start screen per user
  // request.
  const readGeneralTab = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const segments = [
      t('tabGeneral'),
      t('languageLabel'),
      t('appMode'),
      `${t('v1Label')}. ${t('v1Desc')}`,
      `${t('v2Label')}. ${t('v2Desc')}`,
      isGamified ? t('dailyGoal') : null,
    ].filter(Boolean);
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 900;
    });
  }, [speak, t, setSafeTimeout, clearAllTimeouts, isGamified]);

  useAutoReadAloud(!!settings.voiceAssistant, readGeneralTab);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
          <BionicText text={t('languageLabel')} enabled={bionicReading} />
        </h3>
        <LanguageSwitcher />
      </div>
      <div>
        <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
          <BionicText text={t('studyMode.toggleLabel')} enabled={bionicReading} />
        </h3>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-slate-500">
            <BionicText text={t('studyMode.infoText')} enabled={bionicReading} />
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={studyModeEnabled}
            aria-label={t('studyMode.toggleLabel')}
            onClick={() => setStudyModeEnabled(!studyModeEnabled)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${studyModeEnabled ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <span
              aria-hidden="true"
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${studyModeEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
          <BionicText text={t('appMode')} enabled={bionicReading} />
        </h3>
        {studyModeActive ? (
          <p className="rounded-xl border-2 border-slate-100 bg-slate-50 p-4 text-center text-sm font-bold text-slate-600">
            {isGamified
              ? t('studyMode.currentVariantGamified')
              : t('studyMode.currentVariantClassic')}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsGamified(false)}
              aria-pressed={!isGamified}
              className={`rounded-xl border-2 p-4 text-left ${!isGamified ? 'border-indigo-500 bg-indigo-50' : 'bg-white hover:border-slate-300'}`}
            >
              <p className="font-bold text-slate-800">
                <BionicText text={t('v1Label')} enabled={bionicReading} />
              </p>
              <p className="text-xs text-slate-500">
                <BionicText text={t('v1Desc')} enabled={bionicReading} />
              </p>
            </button>
            <button
              onClick={() => setIsGamified(true)}
              aria-pressed={isGamified}
              className={`rounded-xl border-2 p-4 text-left ${isGamified ? 'border-indigo-500 bg-indigo-50' : 'bg-white hover:border-slate-300'}`}
            >
              <p className="font-bold text-slate-800">
                <BionicText text={t('v2Label')} enabled={bionicReading} />
              </p>
              <p className="text-xs text-slate-500">
                <BionicText text={t('v2Desc')} enabled={bionicReading} />
              </p>
            </button>
          </div>
        )}
      </div>
      {isGamified && (
        <div>
          <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
            <BionicText text={t('dailyGoal')} enabled={bionicReading} />
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[5, 10, 15, 20].map((minutes) => (
              <button
                key={minutes}
                onClick={() => {
                  updateSetting('dailyGoal', minutes);
                  if (settings.voiceAssistant && speak)
                    speak(t(`goal${minutes}`));
                }}
                aria-pressed={settings.dailyGoal === minutes}
                className={`rounded-xl border-2 p-4 text-left ${settings.dailyGoal === minutes ? 'border-amber-500 bg-amber-50' : 'bg-white hover:border-slate-300'}`}
              >
                <p className="font-bold text-slate-800">
                  <BionicText
                    text={t(`goal${minutes}`)}
                    enabled={bionicReading}
                  />
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Every toggle this tab can show, grouped by what kind of accommodation it
// addresses rather than by which settings-object namespace it happens to
// live in (`a11y.*` vs `inclusive.*` — an implementation detail the old
// layout accidentally exposed as its only grouping: two flat lists that
// mixed e.g. a colorblind-safe palette toggle with a daily-difficulty
// toggle under the same unlabeled heading). Four sections instead: sight,
// reading/focus, motor+sensory, and voice/pace — the same taxonomy most
// OS-level accessibility panels use, so it should already feel familiar.
const A11Y_SECTIONS = [
  {
    titleKey: 'a11ySectionVision',
    icon: '👁️',
    keys: ['contrast', 'color', 'desaturation'],
  },
  {
    titleKey: 'a11ySectionReading',
    icon: '📖',
    keys: ['lrs', 'ruler', 'bionicReading', 'zenMode'],
  },
  {
    titleKey: 'a11ySectionMotor',
    icon: '🤲',
    keys: ['motorik', 'motion'],
  },
  {
    titleKey: 'a11ySectionVoice',
    icon: '🔊',
    keys: ['voiceAssistant', 'cognitiveBreaks', 'adaptiveDifficulty'],
  },
];

// The six adjustable design tokens (see src/styles/index.css). Each min
// reproduces today's default look exactly; each max is the spec's stated
// cap. `lrs` above still exists as a one-tap preset that jumps these same
// settings fields, so moving a slider here is exactly equivalent to what
// that toggle already does, just to any value in between too.
const DESIGN_TOKEN_SLIDERS = [
  { key: 'fontSizeExercise', min: 16, max: 32, step: 1, unit: 'px' },
  { key: 'fontSizeUi', min: 16, max: 28, step: 1, unit: 'px' },
  { key: 'lineHeight', min: 1.5, max: 2.2, step: 0.1, unit: '' },
  { key: 'letterSpacing', min: 0, max: 0.24, step: 0.02, unit: 'em' },
  { key: 'wordSpacing', min: 0, max: 0.32, step: 0.02, unit: 'em' },
  { key: 'paragraphSpacing', min: 0, max: 3, step: 0.25, unit: 'em' },
];

const A11yTab = ({ speak }) => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { bionicReading, contrast, voiceAssistant } = settings;
  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  const optionsByKey = useMemo(
    () => ({
      contrast: t('a11y.contrast', { returnObjects: true }),
      color: t('a11y.colors', { returnObjects: true }),
      desaturation: t('a11y.desaturation', { returnObjects: true }),
      lrs: t('a11y.lrs', { returnObjects: true }),
      ruler: t('a11y.ruler', { returnObjects: true }),
      bionicReading: t('inclusive.bionicReading', { returnObjects: true }),
      zenMode: t('inclusive.zenMode', { returnObjects: true }),
      motorik: t('a11y.motor', { returnObjects: true }),
      motion: t('a11y.motion', { returnObjects: true }),
      voiceAssistant: t('inclusive.voiceAssistant', { returnObjects: true }),
      cognitiveBreaks: t('inclusive.cognitiveBreaks', {
        returnObjects: true,
      }),
      adaptiveDifficulty: t('inclusive.adaptiveDifficulty', {
        returnObjects: true,
      }),
    }),
    [t],
  );

  const designTokensByKey = useMemo(
    () =>
      Object.fromEntries(
        DESIGN_TOKEN_SLIDERS.map(({ key }) => [
          key,
          t(`designTokens.${key}`, { returnObjects: true }),
        ]),
      ),
    [t],
  );

  // Only the option *names* (not the longer descriptions) are read out —
  // 14 items across four sections is already a lot — but each name is
  // paired with its current on/off state, since a sighted-but-silent
  // reading of just the label would leave a voice-assistant user with no
  // way to know whether a given tool is actually active without also
  // looking at the screen.
  const readA11yTab = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const segments = [
      t('tabA11y'),
      ...A11Y_SECTIONS.flatMap((section) => [
        t(section.titleKey),
        ...section.keys
          .filter((key) => optionsByKey[key]?.name)
          .map(
            (key) =>
              // "opcja włączona/wyłączona" rather than pairing the raw
              // on/off word directly with each option's own name: many
              // option names carry a different grammatical gender than
              // "opcja" ("kontrast" is masculine, "opcja" is feminine), so
              // the on/off adjective — inflected for feminine — only agrees
              // grammatically once "opcja" is the explicit noun it modifies.
              `${optionsByKey[key].name}, ${settings[key] ? t('optionOn') : t('optionOff')}`,
          ),
      ]),
      t('designTokensSectionTitle'),
      ...DESIGN_TOKEN_SLIDERS.filter(({ key }) => designTokensByKey[key]?.name).map(
        ({ key, unit }) => `${designTokensByKey[key].name}, ${settings[key]}${unit}`,
      ),
    ].filter(Boolean);
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 700;
    });
  }, [
    speak,
    t,
    optionsByKey,
    designTokensByKey,
    settings,
    setSafeTimeout,
    clearAllTimeouts,
  ]);

  useAutoReadAloud(!!voiceAssistant, readA11yTab);

  return (
    <div className="space-y-6">
      <p
        className={`px-3 text-xs ${contrast ? 'text-white/60' : 'text-slate-500'}`}
      >
        <BionicText text={t('a11yAddonsDesc')} enabled={bionicReading} />
      </p>
      {A11Y_SECTIONS.map((section, index) => (
        <div
          key={section.titleKey}
          className={
            index > 0
              ? `border-t pt-6 ${contrast ? 'border-white/20' : 'border-slate-200'}`
              : ''
          }
        >
          <h3
            className={`mb-2 flex items-center gap-2 px-3 text-sm font-bold ${contrast ? 'text-white' : 'text-slate-500'}`}
          >
            <span aria-hidden="true">{section.icon}</span>
            <BionicText text={t(section.titleKey)} enabled={bionicReading} />
          </h3>
          <div className="space-y-1">
            {section.keys.map((key) => {
              const opt = optionsByKey[key];
              if (!opt) return null;
              return (
                <SettingToggle
                  key={key}
                  label={opt.name}
                  desc={opt.desc}
                  checked={!!settings[key]}
                  onChange={() => {
                    const next = !settings[key];
                    updateSetting(key, next);
                    // Confirms the exact change just made, not just the tab's
                    // full state on open — a voice-assistant user flipping
                    // one switch among 14 needs to hear that specific result
                    // without waiting for (or re-triggering) the whole-tab
                    // readout. clearAllTimeouts() first: without it, a
                    // still-catching-up auto-read-on-open segment (each
                    // scheduled up to several seconds ahead) could fire right
                    // after and overwrite this announcement with unrelated
                    // queued text before the user finished hearing it.
                    if (voiceAssistant && speak) {
                      clearAllTimeouts();
                      speak(
                        `${opt.name}, ${next ? t('optionOn') : t('optionOff')}`,
                      );
                    }
                  }}
                  bionic={bionicReading}
                  isHighContrast={contrast}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div
        className={`border-t pt-6 ${contrast ? 'border-white/20' : 'border-slate-200'}`}
      >
        <h3
          className={`mb-2 flex items-center gap-2 px-3 text-sm font-bold ${contrast ? 'text-white' : 'text-slate-500'}`}
        >
          <span aria-hidden="true">🔤</span>
          <BionicText
            text={t('designTokensSectionTitle')}
            enabled={bionicReading}
          />
        </h3>
        <div className="space-y-1">
          {DESIGN_TOKEN_SLIDERS.map(({ key, min, max, step, unit }) => {
            const opt = designTokensByKey[key];
            if (!opt) return null;
            return (
              <SettingSlider
                key={key}
                label={opt.name}
                desc={opt.desc}
                value={settings[key]}
                min={min}
                max={max}
                step={step}
                unit={unit}
                onChange={(next) => updateSetting(key, next)}
                bionic={bionicReading}
                isHighContrast={contrast}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ShopTab = ({ speak }) => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const bionicReading = !!settings.bionicReading;
  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  const readShopTab = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const themeNames = Object.entries(THEMES).map(([key, theme]) =>
      t(`themes.${key}.name`, theme.name),
    );
    const segments = [t('tabShop'), ...themeNames];
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 700;
    });
  }, [speak, t, setSafeTimeout, clearAllTimeouts]);

  useAutoReadAloud(!!settings.voiceAssistant, readShopTab);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {Object.entries(THEMES).map(([key, theme]) => {
          const isSelected = settings.theme === key;

          return (
            <div
              key={key}
              className={`rounded-xl border-2 p-4 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'bg-white'}`}
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 text-3xl">{theme.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">
                    <BionicText
                      text={t(`themes.${key}.name`, theme.name)}
                      enabled={bionicReading}
                    />
                  </h4>
                  <p className="text-xs text-slate-500">
                    <BionicText
                      text={t(`themes.${key}.desc`, theme.desc)}
                      enabled={bionicReading}
                    />
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('theme', key)}
                  disabled={isSelected}
                  className={`rounded-full px-4 py-1 text-xs font-bold ${isSelected ? 'bg-slate-200 text-slate-500' : 'bg-emerald-700 text-white hover:bg-emerald-600'}`}
                >
                  <BionicText
                    text={t(isSelected ? 'equipped' : 'select')}
                    enabled={bionicReading}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ExercisesTab = ({ speak }) => {
  const { t } = useTranslation();
  const { settings } = useUserSettingsContext();
  const bigTargets = !!(settings.bigTargets || settings.motorik);
  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  // Leads with the tab name, then each pillar name followed by every
  // exercise type in it and its current on/off state — longer than before
  // (12 types total), but a voice-assistant user has no other way to learn
  // which exercise types are active without also looking at the screen.
  const readExercisesTab = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const activeExercises = settings.activeExercises || {};
    const segments = [
      t('tabExercises'),
      ...Object.entries(STUDY_EXERCISE_PILLARS).flatMap(
        ([pillarKey, exerciseKeys]) => [
          t(`pillars.${pillarKey}`, pillarKey),
          ...exerciseKeys.map((key) => {
            const label = t(`exerciseManager.types.${key}`, key);
            const isActive = activeExercises[key] !== false;
            return `${label}, ${isActive ? t('optionOn') : t('optionOff')}`;
          }),
        ],
      ),
    ];
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 700;
    });
  }, [speak, t, settings.activeExercises, setSafeTimeout, clearAllTimeouts]);

  useAutoReadAloud(!!settings.voiceAssistant, readExercisesTab);

  // Cancels this tab's own auto-read-on-open queue before letting a single
  // toggle's confirmation speak — otherwise a still-catching-up segment
  // from that queue (each one scheduled up to several seconds ahead) can
  // fire moments later and overwrite the confirmation with unrelated text.
  const speakNow = useCallback(
    (text) => {
      clearAllTimeouts();
      speak?.(text);
    },
    [speak, clearAllTimeouts],
  );

  return (
    <ExerciseToggleManager
      t={t}
      speak={speakNow}
      bigTargets={bigTargets}
      bionicReading={!!settings.bionicReading}
    />
  );
};

export default function SettingsModal({ open, onClose, speak }) {
  const { t } = useTranslation();
  const { settings } = useUserSettingsContext();
  const bionicReading = !!settings.bionicReading;
  const { isGamified } = useGamification();
  const { studySet } = useStudySet();
  const [activeTab, setActiveTab] = useState('general');

  const TABS = [
    { id: 'general', label: t('tabGeneral') },
    {
      id: 'a11y',
      label: t('tabA11y'),
    },
    { id: 'exercises', label: t('tabExercises') },
  ];

  if (isGamified) {
    TABS.push({ id: 'shop', label: t('tabShop') });
  }

  // WAI-ARIA APG "Tabs" keyboard pattern: the roving tabIndex below (only
  // the active tab is in the Tab order) means Left/Right/Home/End are the
  // *only* way to reach the other tab buttons — without this handler, Tab
  // skips straight from the active tab button into the panel content and
  // the inactive tabs (including the Accessibility tab itself) become
  // completely unreachable by keyboard.
  const handleTabKeyDown = (e) => {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
    let nextIndex;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TABS.length;
    else if (e.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = TABS.length - 1;
    else return;

    e.preventDefault();
    const nextTab = TABS[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`settings-tab-${nextTab.id}`)?.focus();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab speak={speak} />;
      case 'a11y':
        return <A11yTab speak={speak} />;
      case 'exercises':
        return <ExercisesTab speak={speak} />;
      case 'shop':
        return <ShopTab speak={speak} />;
      default:
        return <GeneralTab speak={speak} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="settings-title"
      overlayClassName="z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      className={`animate-in zoom-in relative flex max-h-[90dvh] w-full max-w-2xl flex-col rounded-3xl shadow-2xl duration-300 outline-none ${settings.contrast ? 'border-2 border-white bg-black' : 'bg-slate-100'}`}
    >
      {}
      <header
        className={`shrink-0 border-b p-4 ${settings.contrast ? 'border-white/20' : 'border-slate-200'} flex items-center justify-between`}
      >
        <h2
          id="settings-title"
          className={`text-lg font-bold ${settings.contrast ? 'text-white' : 'text-slate-800'}`}
        >
          <BionicText text={t('settingsTitle')} enabled={bionicReading} />
        </h2>
        <button
          onClick={onClose}
          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold transition-colors ${settings.contrast ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-200'}`}
          aria-label={t('close')}
        >
          ✕
        </button>
      </header>

      {}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {}
        {/* jsx-a11y's non-interactive-to-interactive-role check doesn't
            recognize `role="tablist"` as a valid pairing for <nav> — but
            this is the standard WAI-ARIA APG Tabs pattern (a <nav> landmark
            containing the tablist is explicitly permitted), and this exact
            markup has already been verified against real axe-core scans
            with 0 violations. Restructuring to a plain <div> to satisfy the
            linter would lose the landmark for no accessibility gain. */}
        <nav
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="tablist"
          aria-label={t('settingsTitle')}
          onKeyDown={handleTabKeyDown}
          className={`flex shrink-0 flex-row space-x-1 overflow-x-auto border-b p-2 md:flex-col md:space-y-1 md:space-x-0 md:overflow-y-auto md:border-r md:border-b-0 ${settings.contrast ? 'border-white/20' : 'border-slate-200'}`}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`settings-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`settings-panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? settings.contrast
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-indigo-600'
                  : settings.contrast
                    ? 'text-white/70 hover:bg-white/10'
                    : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BionicText text={tab.label} enabled={bionicReading} />
            </button>
          ))}
        </nav>

        {}
        {/* Likewise, `tabIndex={0}` on a `role="tabpanel"` container is the
            WAI-ARIA APG-recommended pattern (lets a screen reader/keyboard
            user land directly on the panel after switching tabs, rather
            than skipping straight past it to whatever's focusable inside),
            not an accidental non-interactive-element tabIndex. */}
        <div
          className="flex-1 overflow-y-auto p-4"
          role="tabpanel"
          id={`settings-panel-${activeTab}`}
          aria-labelledby={`settings-tab-${activeTab}`}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          {renderTabContent()}
        </div>
      </div>

      {}
      <footer
        className={`shrink-0 border-t p-3 text-center ${settings.contrast ? 'border-white/20' : 'border-slate-200'}`}
      >
        <p
          className={`text-xs ${settings.contrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          <BionicText text={t('settingsFooter')} enabled={bionicReading} />
        </p>
        {studySet && (
          <p
            className={`mt-1 text-xs ${settings.contrast ? 'text-white/30' : 'text-slate-400'}`}
          >
            {t('studySetIndicator', { set: studySet })}
          </p>
        )}
      </footer>
    </Dialog>
  );
}
