import React from 'react';

import { useTranslation } from 'react-i18next';

import { useGamification } from './GamificationContext.jsx';
import { useUserSettingsContext } from './UserSettingsContext.jsx';
import BionicText from './common/BionicText.jsx';

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
];

function IntroScreen({ onStart, speak }) {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { isGamified, setIsGamified } = useGamification();

  const {
    language,
    contrast: isHighContrast,
    motorik: bigTargets,
    motion: noFlash,
  } = settings;

  const A11Y_MAPPING = {
    LRS: 'lrs',
    Kontrast: 'contrast',
    Niedowidzenie: 'vision',
    Motorik: 'motorik',
    Spacing: 'spacing',
    Linijka: 'ruler',
    Daltonizm: 'color',
    Redukcja: 'motion',
    Desaturacja: 'desaturation',
  };

  const toggleAddon = (addon, label) => {
    const mappedKey = A11Y_MAPPING[addon];
    const newState = !settings[mappedKey];
    updateSetting(mappedKey, newState);

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
  const hasVision = settings.vision;
  const hasMotorik = settings.motorik;
  const hasSpacing = settings.spacing;
  const hasRuler = settings.ruler;
  const hasColor = settings.color;
  const hasMotion = settings.motion;
  const hasDesaturation = settings.desaturation;

  const hasBionic = !!settings.bionicReading;
  const hasVoice = !!settings.voiceAssistant;
  const hasZen = !!settings.zenMode;

  const A11yBtn = ({ active, onClick, icon, label }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`relative ${bigTargets ? 'py-2.5 sm:py-3' : 'py-1.5 sm:py-2'} flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 px-1 text-[10px] leading-tight font-bold transition-all active:scale-95 sm:text-[11px] ${active ? (isHighContrast ? 'border-white bg-white/20 text-white' : 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm') : isHighContrast ? 'border-white/30 text-white/50 hover:border-white/50' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
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
      <span className="w-full px-1 text-center break-words hyphens-auto">
        <BionicText text={label} enabled={hasBionic} />
      </span>
    </button>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-2 sm:p-4 ${isHighContrast ? 'bg-black' : 'bg-[#fdfaf6]'}`}
    >
      {}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isHighContrast ? 'opacity-0' : 'opacity-10'} bg-gradient-to-br from-indigo-200 via-purple-100 to-emerald-100`}
      />

      {}
      <div
        className={`no-scrollbar relative z-10 flex max-h-[98vh] min-h-0 w-full max-w-lg shrink flex-col items-center overflow-y-auto rounded-[2rem] px-3 py-3 text-center shadow-2xl transition-all sm:px-6 sm:py-5 ${
          isHighContrast
            ? 'border-2 border-white bg-black'
            : 'border border-slate-200 bg-white/90 backdrop-blur-md'
        }`}
      >
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
            className={`mb-2 max-w-sm shrink-0 text-[10px] leading-snug font-bold sm:text-xs ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}
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
            <legend className="mb-1 w-full p-0 text-left text-[10px] font-black tracking-widest text-slate-600 uppercase sm:text-center sm:text-xs">
              <BionicText
                text={t('intro.chooseLanguage', 'Language')}
                enabled={hasBionic}
              />
            </legend>
            {LANGUAGES.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => {
                  updateSetting('language', code);
                  if (settings.voiceAssistant && speak) speak(label);
                }}
                className={`flex flex-row items-center justify-center gap-1 rounded-xl border-2 text-[10px] font-bold transition-all active:scale-95 sm:gap-1.5 sm:text-xs ${bigTargets ? 'py-2.5 sm:py-3' : 'py-1.5 sm:py-2.5'} ${
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
            <legend className="mb-1 w-full p-0 text-left text-[10px] font-black tracking-widest text-slate-600 uppercase sm:text-center sm:text-xs">
              <BionicText
                text={t('intro.appMode', 'Mode')}
                enabled={hasBionic}
              />
            </legend>
            <button
              onClick={() => {
                setIsGamified(false);
                if (settings.voiceAssistant && speak)
                  speak(t('intro.modeClassic', 'Learning Only'));
              }}
              className={`flex flex-row items-center justify-center gap-1.5 rounded-xl border-2 text-[10px] font-bold transition-all active:scale-95 sm:text-xs ${bigTargets ? 'py-2.5' : 'py-1.5 sm:py-2'} ${
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
                setIsGamified(true);
                if (settings.voiceAssistant && speak)
                  speak(t('intro.modeGamified', 'Gamified'));
              }}
              className={`flex flex-row items-center justify-center gap-1.5 rounded-xl border-2 text-[10px] font-bold transition-all active:scale-95 sm:text-xs ${bigTargets ? 'py-2.5' : 'py-1.5 sm:py-2'} ${
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
          </fieldset>

          <fieldset className="m-0 mb-2 grid w-full shrink-0 grid-cols-2 gap-1 border-none p-0 sm:mb-3 sm:grid-cols-3 sm:gap-1.5">
            <legend className="mb-1 w-full p-0 text-left text-[10px] font-black tracking-widest text-slate-600 uppercase sm:text-center sm:text-xs">
              <BionicText
                text={t('intro.a11y', 'Comfort Tools')}
                enabled={hasBionic}
              />
            </legend>
            <A11yBtn
              active={hasLRS}
              onClick={() =>
                toggleAddon('LRS', t('intro.lrs', 'Friendly Font'))
              }
              icon="🅰️"
              label={t('intro.lrs', 'Friendly Font')}
            />
            <A11yBtn
              active={hasSpacing}
              onClick={() =>
                toggleAddon('Spacing', t('intro.spacing', 'More Spacing'))
              }
              icon="🔠"
              label={t('intro.spacing', 'More Spacing')}
            />
            <A11yBtn
              active={hasVision}
              onClick={() =>
                toggleAddon('Niedowidzenie', t('intro.vision', 'Bigger Text'))
              }
              icon="🔍"
              label={t('intro.vision', 'Bigger Text')}
            />

            <A11yBtn
              active={hasBionic}
              onClick={() =>
                toggleInclusive('bionicReading', t('intro.bionic', 'Bionic'))
              }
              icon="👁️"
              label={t('intro.bionic', 'Bionic')}
            />
            <A11yBtn
              active={hasRuler}
              onClick={() =>
                toggleAddon('Linijka', t('intro.ruler', 'Reading Ruler'))
              }
              icon="📏"
              label={t('intro.ruler', 'Reading Ruler')}
            />
            <A11yBtn
              active={hasVoice}
              onClick={() =>
                toggleInclusive('voiceAssistant', t('intro.voice', 'Assistant'))
              }
              icon="🗣️"
              label={t('intro.voice', 'Assistant')}
            />

            <A11yBtn
              active={hasContrast}
              onClick={() =>
                toggleAddon('Kontrast', t('intro.contrast', 'Kontrast'))
              }
              icon="🌗"
              label={t('intro.contrast', 'Kontrast')}
            />
            <A11yBtn
              active={hasColor}
              onClick={() =>
                toggleAddon('Daltonizm', t('intro.color', 'Safe Colors'))
              }
              icon="🎨"
              label={t('intro.color', 'Safe Colors')}
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
            />

            <A11yBtn
              active={hasMotorik}
              onClick={() =>
                toggleAddon('Motorik', t('intro.big', 'Wygodne przyciski'))
              }
              icon="🖐️"
              label={t('intro.big', 'Wygodne przyciski')}
            />
            <A11yBtn
              active={hasMotion}
              onClick={() =>
                toggleAddon('Redukcja', t('intro.motion', 'Reduced Motion'))
              }
              icon="⏸️"
              label={t('intro.motion', 'Reduced Motion')}
            />
            <A11yBtn
              active={hasZen}
              onClick={() =>
                toggleInclusive('zenMode', t('intro.zen', 'Zen Mode'))
              }
              icon="🧘"
              label={t('intro.zen', 'Zen Mode')}
            />
          </fieldset>

          {}
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
            className={`mt-auto w-full shrink-0 rounded-xl font-black tracking-widest uppercase transition-all active:scale-95 sm:rounded-2xl ${
              bigTargets
                ? 'py-3 text-sm sm:py-4 sm:text-lg'
                : 'py-2.5 text-sm sm:py-3'
            } ${isHighContrast ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-900/60 hover:bg-emerald-400'}`}
          >
            <BionicText text={t('start', 'Start')} enabled={hasBionic} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroScreen;
