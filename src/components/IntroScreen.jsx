import { useCallback, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useAutoReadAloud } from '../hooks/useAutoReadAloud.js';
import { useGamification } from '../hooks/useGamification.js';
import { UNLOCK_AFTER_UNITS } from '../hooks/useGamificationState.js';
import { useSafeTimeouts } from '../hooks/useSafeTimeouts.js';
import { useUserSettingsContext } from '../hooks/useUserSettingsContext.js';

import BionicText from './common/BionicText.jsx';

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
];

const A11yBtn = ({
  active,
  onClick,
  icon,
  label,
  bigTargets,
  isHighContrast,
  hasBionic,
}) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={`relative ${bigTargets ? 'py-2.5 sm:py-3' : 'py-1.5 sm:py-2'} flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 px-1 text-xs leading-tight font-bold transition-all active:scale-95 sm:text-sm ${active ? (isHighContrast ? 'border-white bg-white/20 text-white' : 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm') : isHighContrast ? 'border-white/30 text-white/50 hover:border-white/50' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
  >
    {active && (
      <div
        className={`absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-bl-lg ${isHighContrast ? 'bg-white text-black' : 'bg-amber-500 text-white'}`}
      >
        <span className="text-[8px] font-black">✓</span>
      </div>
    )}
    <span aria-hidden="true" className="mb-0.5 text-lg sm:text-xl">
      {icon}
    </span>
    <span className="w-full px-1 text-center wrap-break-word hyphens-auto">
      <BionicText text={label} enabled={hasBionic} />
    </span>
  </button>
);

function IntroScreen({ onStart, speak }) {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { isGamified, setIsGamified, lockedIsGamified, growthValue } =
    useGamification();
  const tasksUntilUnlock = Math.max(0, UNLOCK_AFTER_UNITS - growthValue);

  const {
    language,
    contrast: isHighContrast,
    motorik: bigTargets,
    motion: noFlash,
  } = settings;

  const A11Y_MAPPING = {
    LRS: 'lrs',
    Kontrast: 'contrast',
    Motorik: 'motorik',
    Linijka: 'ruler',
    Daltonizm: 'color',
    Redukcja: 'motion',
    Desaturacja: 'desaturation',
  };

  // 'Niedowidzenie' ("Bigger text") and 'Spacing' used to be single fixed
  // booleans; now that the six design-token sliders can be anywhere in
  // their range, a one-tap quick toggle here jumps them to a preset
  // instead — same pattern as the `lrs` toggle in useUserSettings.js — and
  // reverts to the plain baseline on a second tap rather than trying to
  // remember whatever custom slider position was there before.
  const BIGGER_TEXT_PRESET = { fontSizeUi: 20, fontSizeExercise: 20 };
  const MORE_SPACING_PRESET = { lineHeight: 2, letterSpacing: 0.15, wordSpacing: 0.35 };
  const BASELINE_TEXT = { fontSizeUi: 16, fontSizeExercise: 16 };
  const BASELINE_SPACING = { lineHeight: 1.5, letterSpacing: 0, wordSpacing: 0 };

  const applyPreset = (preset) => {
    Object.entries(preset).forEach(([key, value]) => updateSetting(key, value));
  };

  const toggleAddon = (addon, label) => {
    let newState;
    if (addon === 'Niedowidzenie') {
      newState = !hasVision;
      applyPreset(newState ? BIGGER_TEXT_PRESET : BASELINE_TEXT);
    } else if (addon === 'Spacing') {
      newState = !hasSpacing;
      applyPreset(newState ? MORE_SPACING_PRESET : BASELINE_SPACING);
    } else {
      const mappedKey = A11Y_MAPPING[addon];
      newState = !settings[mappedKey];
      updateSetting(mappedKey, newState);
    }

    if (settings.voiceAssistant && speak) {
      speak(
        `${label} ${newState ? t('on', 'WŁĄCZONA') : t('off', 'WYŁĄCZONA')}`,
      );
    }
  };

  const toggleInclusive = (opt, label) => {
    const newState = !settings[opt];
    updateSetting(opt, newState);

    if (settings.voiceAssistant && speak) {
      speak(
        `${label} ${newState ? t('on', 'WŁĄCZONA') : t('off', 'WYŁĄCZONA')}`,
      );
    }
  };

  const hasLRS = settings.lrs;
  const hasContrast = settings.contrast;
  // Approximated from the sliders now: "moved above its own default
  // minimum" rather than a specific fixed position — see the matching
  // definition in SurveyComponent.tsx's a11yAddons.
  const hasVision = settings.fontSizeUi > 16 || settings.fontSizeExercise > 16;
  const hasMotorik = settings.motorik;
  const hasSpacing =
    settings.lineHeight > 1.5 ||
    settings.letterSpacing > 0 ||
    settings.wordSpacing > 0;
  const hasRuler = settings.ruler;
  const hasColor = settings.color;
  const hasMotion = settings.motion;
  const hasDesaturation = settings.desaturation;

  const hasBionic = !!settings.bionicReading;
  const hasVoice = !!settings.voiceAssistant;
  const hasZen = !!settings.zenMode;

  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  // "What this app is" — read automatically once the voice assistant is
  // active, same as Settings and the exercises (useAutoReadAloud), instead
  // of only ever confirming individual toggle clicks like the rest of this
  // screen already did.
  const readWelcome = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const segments = [
      t('appTitle', 'EnClaro'),
      t('intro.subtitle', 'Your safe space to grow! Choose mode and tools:'),
      t(
        'intro.browserWarning',
        'For the best Voice Assistant quality, we recommend using Google Chrome.',
      ),
    ].filter(Boolean);
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 900;
    });
  }, [speak, t, setSafeTimeout, clearAllTimeouts]);

  useAutoReadAloud(hasVoice, readWelcome);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-2 pt-[calc(0.5rem+env(safe-area-inset-top))] pr-[calc(0.5rem+env(safe-area-inset-right))] pb-[calc(0.5rem+env(safe-area-inset-bottom))] pl-[calc(0.5rem+env(safe-area-inset-left))] sm:p-4 ${isHighContrast ? 'bg-black' : 'bg-[#fdfaf6]'}`}
    >
      {}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isHighContrast ? 'opacity-0' : 'opacity-10'} bg-linear-to-br from-indigo-200 via-purple-100 to-emerald-100`}
      />

      {}
      {/* This is the very first screen most visitors (and any automated
          landmark scanner) hit — App.jsx returns straight to IntroScreen
          while `showIntro` is true, before the <main>/<nav> shell further
          down in App.jsx ever mounts. Without its own landmark here, a
          region-based audit (WAVE, axe "Regions") correctly reports zero
          landmarks on this screen even though the rest of the app has them. */}
      <main
        id="main-content"
        className={`relative z-10 flex max-h-[98dvh] min-h-0 w-full max-w-lg shrink flex-col items-stretch rounded-4xl text-center shadow-2xl transition-all ${
          isHighContrast
            ? 'border-2 border-white bg-black'
            : 'border border-slate-200 bg-white/90 backdrop-blur-md'
        }`}
      >
        {}
        {/* The Start button used to live inside this same scrolling region,
            at the bottom of a tall stack of a11y toggles — on a typical
            phone viewport it sat ~300px below the fold with nothing on
            screen hinting there was more content (or a Start button at
            all) below. Splitting the card into a scrollable body plus this
            always-visible footer keeps every toggle reachable while making
            sure the primary CTA never requires scrolling to find. */}
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pt-3 sm:px-6 sm:pt-5">
          <div
            className={`flex min-h-0 w-full shrink flex-col items-center ${noFlash ? '' : 'animate-in fade-in zoom-in duration-500'}`}
          >
            <div
              className="mb-1 shrink-0 text-3xl drop-shadow-lg sm:text-5xl"
              aria-hidden="true"
            >
              🧠
            </div>

            <h1
              className={`mb-1 shrink-0 text-xl font-black tracking-tighter drop-shadow-md sm:text-3xl ${isHighContrast ? 'text-white' : 'text-indigo-700'}`}
            >
              {t('appTitle', 'EnClaro')}
            </h1>

            <p
              className={`mb-2 max-w-sm shrink-0 text-xs leading-snug font-bold sm:text-sm ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}
            >
              <BionicText
                text={t(
                  'intro.subtitle',
                  'Your safe space to grow! Choose mode and tools:',
                )}
                enabled={hasBionic}
              />
            </p>

            {}
            <fieldset className="m-0 mb-2 grid w-full shrink-0 grid-cols-3 gap-1 border-none p-0 sm:gap-1.5">
              {/* HTML's content model for <legend> explicitly permits a single
                heading element (h1-h6) as its entire content, alongside
                plain phrasing content — so this <h2> gives the group a real,
                axe-valid heading (reachable via screen-reader heading
                navigation, the "H" key in NVDA/JAWS) while the <legend>
                still supplies the <fieldset>'s accessible name from that
                same text, same as before. (A `role="heading"` attribute
                directly on <legend> looked equivalent but fails axe's
                aria-allowed-role check — legend isn't in the allowed-role
                list for that role.) */}
              <legend className="mb-1 w-full p-0 text-left sm:text-center">
                <h2
                  className={`text-sm font-black tracking-widest uppercase ${isHighContrast ? 'text-white' : 'text-slate-600'}`}
                >
                  <BionicText
                    text={t('intro.chooseLanguage', 'Language')}
                    enabled={hasBionic}
                  />
                </h2>
              </legend>
              {LANGUAGES.map(({ code, flag, label }) => (
                <button
                  key={code}
                  onClick={() => {
                    updateSetting('language', code);
                    if (settings.voiceAssistant && speak) speak(label);
                  }}
                  className={`flex flex-row items-center justify-center gap-1 rounded-xl border-2 text-xs font-bold transition-all active:scale-95 sm:gap-1.5 sm:text-sm ${bigTargets ? 'py-2.5 sm:py-3' : 'py-1.5 sm:py-2.5'} ${
                    language === code
                      ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/10'}`
                      : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'}`
                  }`}
                  aria-pressed={language === code}
                  lang={code}
                >
                  <span
                    className="text-sm drop-shadow-md sm:text-lg"
                    aria-hidden="true"
                  >
                    {flag}
                  </span>
                  <span className="tracking-wider uppercase">
                    <BionicText text={label} enabled={hasBionic} />
                  </span>
                </button>
              ))}
            </fieldset>

            <fieldset className="m-0 mb-2 grid w-full shrink-0 grid-cols-2 gap-1 border-none p-0 sm:gap-1.5">
              {/* HTML's content model for <legend> explicitly permits a single
                heading element (h1-h6) as its entire content, alongside
                plain phrasing content — so this <h2> gives the group a real,
                axe-valid heading (reachable via screen-reader heading
                navigation, the "H" key in NVDA/JAWS) while the <legend>
                still supplies the <fieldset>'s accessible name from that
                same text, same as before. (A `role="heading"` attribute
                directly on <legend> looked equivalent but fails axe's
                aria-allowed-role check — legend isn't in the allowed-role
                list for that role.) */}
              <legend className="mb-1 w-full p-0 text-left sm:text-center">
                <h2
                  className={`text-sm font-black tracking-widest uppercase ${isHighContrast ? 'text-white' : 'text-slate-600'}`}
                >
                  <BionicText
                    text={t('intro.appMode', 'Mode')}
                    enabled={hasBionic}
                  />
                </h2>
              </legend>
              <button
                onClick={() => {
                  if (lockedIsGamified === false) return;
                  setIsGamified(false);
                  if (settings.voiceAssistant && speak)
                    speak(t('intro.modeClassic', 'Learning Only'));
                }}
                disabled={lockedIsGamified === false}
                className={`flex flex-row items-center justify-center gap-1.5 rounded-xl border-2 text-xs font-bold transition-all active:scale-95 sm:text-sm ${bigTargets ? 'py-2.5' : 'py-1.5 sm:py-2'} ${
                  lockedIsGamified === false
                    ? 'cursor-not-allowed opacity-40'
                    : ''
                } ${
                  !isGamified
                    ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'}`
                    : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'}`
                }`}
                aria-pressed={!isGamified}
              >
                <span
                  className="text-sm drop-shadow-sm sm:text-lg"
                  aria-hidden="true"
                >
                  📖
                </span>
                <span className="text-center tracking-wider uppercase">
                  <BionicText
                    text={t('intro.modeClassic', 'Learning Only')}
                    enabled={hasBionic}
                  />
                </span>
              </button>
              <button
                onClick={() => {
                  if (lockedIsGamified === true) return;
                  setIsGamified(true);
                  if (settings.voiceAssistant && speak)
                    speak(t('intro.modeGamified', 'Gamified'));
                }}
                disabled={lockedIsGamified === true}
                className={`flex flex-row items-center justify-center gap-1.5 rounded-xl border-2 text-xs font-bold transition-all active:scale-95 sm:text-sm ${bigTargets ? 'py-2.5' : 'py-1.5 sm:py-2'} ${
                  lockedIsGamified === true
                    ? 'cursor-not-allowed opacity-40'
                    : ''
                } ${
                  isGamified
                    ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'}`
                    : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300'}`
                }`}
                aria-pressed={isGamified}
              >
                <span
                  className="text-sm drop-shadow-sm sm:text-lg"
                  aria-hidden="true"
                >
                  🎮
                </span>
                <span className="text-center tracking-wider uppercase">
                  <BionicText
                    text={t('intro.modeGamified', 'Gamified')}
                    enabled={hasBionic}
                  />
                </span>
              </button>
              {lockedIsGamified !== null && (
                <p
                  className={`col-span-2 mt-1 text-center text-[11px] ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
                >
                  {t('intro.modeLocked', {
                    count: tasksUntilUnlock,
                    defaultValue:
                      'Unlocks after {{count}} more completed exercises',
                  })}
                </p>
              )}
            </fieldset>

            <fieldset className="m-0 mb-2 grid w-full shrink-0 grid-cols-2 gap-1 border-none p-0 sm:mb-3 sm:gap-1.5">
              <legend className="mb-1 w-full p-0 text-left sm:text-center">
                <h2
                  className={`text-sm font-black tracking-widest uppercase ${isHighContrast ? 'text-white' : 'text-slate-600'}`}
                >
                  <BionicText text={t('dailyGoal')} enabled={hasBionic} />
                </h2>
              </legend>
              {[5, 10, 15, 20].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => {
                    updateSetting('dailyGoal', minutes);
                    if (settings.voiceAssistant && speak)
                      speak(t(`goal${minutes}`));
                  }}
                  className={`flex flex-row items-center justify-center gap-1.5 rounded-xl border-2 text-xs font-bold transition-all active:scale-95 sm:text-sm ${bigTargets ? 'py-2.5' : 'py-1.5 sm:py-2'} ${
                    settings.dailyGoal === minutes
                      ? `${isHighContrast ? 'border-white bg-white/20 text-white' : 'border-amber-500 bg-amber-50 text-amber-700 shadow-md'}`
                      : `${isHighContrast ? 'border-white/30 bg-transparent text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-300'}`
                  }`}
                  aria-pressed={settings.dailyGoal === minutes}
                >
                  <span className="text-center tracking-wider uppercase">
                    <BionicText
                      text={t(`goal${minutes}`)}
                      enabled={hasBionic}
                    />
                  </span>
                </button>
              ))}
            </fieldset>

            <fieldset className="m-0 mb-2 grid w-full shrink-0 grid-cols-2 gap-1 border-none p-0 sm:mb-3 sm:grid-cols-3 sm:gap-1.5">
              {/* HTML's content model for <legend> explicitly permits a single
                heading element (h1-h6) as its entire content, alongside
                plain phrasing content — so this <h2> gives the group a real,
                axe-valid heading (reachable via screen-reader heading
                navigation, the "H" key in NVDA/JAWS) while the <legend>
                still supplies the <fieldset>'s accessible name from that
                same text, same as before. (A `role="heading"` attribute
                directly on <legend> looked equivalent but fails axe's
                aria-allowed-role check — legend isn't in the allowed-role
                list for that role.) */}
              <legend className="mb-1 w-full p-0 text-left sm:text-center">
                <h2
                  className={`text-sm font-black tracking-widest uppercase ${isHighContrast ? 'text-white' : 'text-slate-600'}`}
                >
                  <BionicText
                    text={t('intro.a11y', 'Comfort Tools')}
                    enabled={hasBionic}
                  />
                </h2>
              </legend>
              <A11yBtn
                active={hasLRS}
                onClick={() =>
                  toggleAddon('LRS', t('intro.lrs', 'Friendly Font'))
                }
                icon="🅰️"
                label={t('intro.lrs', 'Friendly Font')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
              <A11yBtn
                active={hasSpacing}
                onClick={() =>
                  toggleAddon('Spacing', t('intro.spacing', 'More Spacing'))
                }
                icon="🔠"
                label={t('intro.spacing', 'More Spacing')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
              <A11yBtn
                active={hasVision}
                onClick={() =>
                  toggleAddon('Niedowidzenie', t('intro.vision', 'Bigger Text'))
                }
                icon="🔍"
                label={t('intro.vision', 'Bigger Text')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />

              <A11yBtn
                active={hasBionic}
                onClick={() =>
                  toggleInclusive('bionicReading', t('intro.bionic', 'Bionic'))
                }
                icon="👁️"
                label={t('intro.bionic', 'Bionic')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
              <A11yBtn
                active={hasRuler}
                onClick={() =>
                  toggleAddon('Linijka', t('intro.ruler', 'Reading Ruler'))
                }
                icon="📏"
                label={t('intro.ruler', 'Reading Ruler')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
              <A11yBtn
                active={hasVoice}
                onClick={() =>
                  toggleInclusive(
                    'voiceAssistant',
                    t('intro.voice', 'Assistant'),
                  )
                }
                icon="🗣️"
                label={t('intro.voice', 'Assistant')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />

              <A11yBtn
                active={hasContrast}
                onClick={() =>
                  toggleAddon('Kontrast', t('intro.contrast', 'Kontrast'))
                }
                icon="🌗"
                label={t('intro.contrast', 'Kontrast')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
              <A11yBtn
                active={hasColor}
                onClick={() =>
                  toggleAddon('Daltonizm', t('intro.color', 'Safe Colors'))
                }
                icon="🎨"
                label={t('intro.color', 'Safe Colors')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
              <A11yBtn
                active={hasDesaturation}
                onClick={() =>
                  toggleAddon(
                    'Desaturacja',
                    t('intro.desaturation', 'Soft Colors'),
                  )
                }
                icon="🌫️"
                label={t('intro.desaturation', 'Soft Colors')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />

              <A11yBtn
                active={hasMotorik}
                onClick={() =>
                  toggleAddon('Motorik', t('intro.big', 'Wygodne przyciski'))
                }
                icon="🖐️"
                label={t('intro.big', 'Wygodne przyciski')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
              <A11yBtn
                active={hasMotion}
                onClick={() =>
                  toggleAddon('Redukcja', t('intro.motion', 'Reduced Motion'))
                }
                icon="⏸️"
                label={t('intro.motion', 'Reduced Motion')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
              <A11yBtn
                active={hasZen}
                onClick={() =>
                  toggleInclusive('zenMode', t('intro.zen', 'Zen Mode'))
                }
                icon="🧘"
                label={t('intro.zen', 'Zen Mode')}
                bigTargets={bigTargets}
                isHighContrast={isHighContrast}
                hasBionic={hasBionic}
              />
            </fieldset>
          </div>
        </div>

        {}
        {/* Pinned footer, outside the scrollable body above, so the Start
            button — the one control every visitor needs — is always on
            screen regardless of how many a11y toggles are above it. */}
        <div
          className={`shrink-0 border-t px-3 pt-2 pb-3 sm:px-6 sm:pb-5 ${isHighContrast ? 'border-white/20' : 'border-slate-100'}`}
        >
          <div
            className={`mt-1 mb-2 flex shrink-0 items-center gap-2 rounded-xl border-2 p-2 text-left transition-colors ${isHighContrast ? 'border-white/50 bg-black text-white' : 'border-blue-200 bg-blue-50 text-blue-800'}`}
          >
            <span
              className="shrink-0 text-base drop-shadow-sm sm:text-xl"
              aria-hidden="true"
            >
              💡
            </span>
            <p className="text-xs leading-snug font-medium sm:text-sm">
              <BionicText
                text={t(
                  'intro.browserWarning',
                  'For the best Voice Assistant quality, we recommend using Google Chrome.',
                )}
                enabled={hasBionic}
              />
            </p>
          </div>

          <button
            onClick={() => {
              if (settings.voiceAssistant && speak) speak(t('start', 'Start'));
              onStart();
            }}
            className={`w-full shrink-0 rounded-xl font-black tracking-widest uppercase transition-all active:scale-95 sm:rounded-2xl ${
              bigTargets
                ? 'py-3 text-sm sm:py-4 sm:text-lg'
                : 'py-2.5 text-sm sm:py-3'
            } ${isHighContrast ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-700 text-white shadow-xl shadow-emerald-900/60 hover:bg-emerald-600'}`}
          >
            <BionicText text={t('start', 'Start')} enabled={hasBionic} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default IntroScreen;
