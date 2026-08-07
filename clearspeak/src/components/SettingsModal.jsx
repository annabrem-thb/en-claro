import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { EXERCISE_PILLARS } from '../data/exerciseTypes.js';
import { useAutoReadAloud } from '../hooks/useAutoReadAloud.js';
import { useSafeTimeouts } from '../hooks/useSafeTimeouts.js';

import ExerciseToggleManager from './ExerciseToggleManager.jsx';
import { useGamification } from './GamificationContext.jsx';
import { useUserSettingsContext } from './UserSettingsContext.jsx';
import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';
import LanguageSwitcher from './common/LanguageSwitcher.jsx';

const THEMES = {
  Natur: {
    name: 'Natura',
    icon: '🌿',
    desc: 'Zielone barwy, relaks',
    price: 0,
  },
  Musik: { name: 'Muzyka', icon: '🎵', desc: 'Fiolet, dynamika', price: 3 },
  Kunst: {
    name: 'Sztuka',
    icon: '🎨',
    desc: 'Bursztyn, kreatywność',
    price: 5,
  },
  Space: { name: 'Kosmos', icon: '🚀', desc: 'Kosmiczna głębia', price: 8 },
  Ocean: { name: 'Ocean', icon: '🐳', desc: 'Morski spokój', price: 10 },
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

const GeneralTab = ({ speak }) => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { isGamified, setIsGamified } = useGamification();
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
      t('dailyGoal'),
    ].filter(Boolean);
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 900;
    });
  }, [speak, t, setSafeTimeout, clearAllTimeouts]);

  useAutoReadAloud(!!settings.voiceAssistant, readGeneralTab);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
          {t('languageLabel')}
        </h3>
        <LanguageSwitcher />
      </div>
      <div>
        <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
          {t('appMode')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsGamified(false)}
            aria-pressed={!isGamified}
            className={`rounded-xl border-2 p-4 text-left ${!isGamified ? 'border-indigo-500 bg-indigo-50' : 'bg-white hover:border-slate-300'}`}
          >
            <p className="font-bold text-slate-800">{t('v1Label')}</p>
            <p className="text-xs text-slate-500">{t('v1Desc')}</p>
          </button>
          <button
            onClick={() => setIsGamified(true)}
            aria-pressed={isGamified}
            className={`rounded-xl border-2 p-4 text-left ${isGamified ? 'border-indigo-500 bg-indigo-50' : 'bg-white hover:border-slate-300'}`}
          >
            <p className="font-bold text-slate-800">{t('v2Label')}</p>
            <p className="text-xs text-slate-500">{t('v2Desc')}</p>
          </button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
          {t('dailyGoal')}
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
              <p className="font-bold text-slate-800">{t(`goal${minutes}`)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const A11yTab = ({ speak }) => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const {
    bionicReading,
    contrast,
    lrs,
    motorik,
    vision,
    spacing,
    ruler,
    color,
    motion,
    desaturation,
    voiceAssistant,
    zenMode,
  } = settings;
  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  const a11yOptions = useMemo(
    () => [
      { key: 'lrs', ...t('a11y.lrs', { returnObjects: true }) },
      { key: 'contrast', ...t('a11y.contrast', { returnObjects: true }) },
      { key: 'vision', ...t('a11y.vision', { returnObjects: true }) },
      { key: 'motorik', ...t('a11y.motor', { returnObjects: true }) },
      { key: 'spacing', ...t('a11y.spacing', { returnObjects: true }) },
      { key: 'ruler', ...t('a11y.ruler', { returnObjects: true }) },
      { key: 'color', ...t('a11y.colors', { returnObjects: true }) },
      { key: 'motion', ...t('a11y.motion', { returnObjects: true }) },
      {
        key: 'desaturation',
        ...t('a11y.desaturation', { returnObjects: true }),
      },
    ],
    [t],
  );

  const inclusiveOptions = useMemo(
    () => [
      {
        key: 'bionicReading',
        ...t('inclusive.bionicReading', { returnObjects: true }),
      },
      {
        key: 'voiceAssistant',
        ...t('inclusive.voiceAssistant', { returnObjects: true }),
      },
      { key: 'zenMode', ...t('inclusive.zenMode', { returnObjects: true }) },
      {
        key: 'cognitiveBreaks',
        ...t('inclusive.cognitiveBreaks', { returnObjects: true }),
      },
      {
        key: 'adaptiveDifficulty',
        ...t('inclusive.adaptiveDifficulty', { returnObjects: true }),
      },
    ],
    [t],
  );

  // Only the option *names* (not the longer descriptions) are read out —
  // between the two groups that's already 14 items, reading every
  // description too would make this take over a minute.
  const readA11yTab = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const segments = [
      t('tabA11y'),
      t('a11yAddons'),
      ...a11yOptions.map((opt) => opt.name).filter(Boolean),
      t('gamificationTitle'),
      ...inclusiveOptions.map((opt) => opt.name).filter(Boolean),
    ].filter(Boolean);
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 700;
    });
  }, [
    speak,
    t,
    a11yOptions,
    inclusiveOptions,
    setSafeTimeout,
    clearAllTimeouts,
  ]);

  useAutoReadAloud(!!voiceAssistant, readA11yTab);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
          {t('a11yAddons')}
        </h3>
        <div className="space-y-1">
          {a11yOptions.map((opt) => (
            <SettingToggle
              key={opt.key}
              label={opt.name}
              desc={opt.desc}
              checked={!!settings[opt.key]}
              onChange={() => updateSetting(opt.key, !settings[opt.key])}
              bionic={bionicReading}
              isHighContrast={contrast}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 px-3 text-sm font-bold text-slate-500">
          {t('gamificationTitle')}
        </h3>
        <div className="space-y-1">
          {inclusiveOptions.map((opt) => (
            <SettingToggle
              key={opt.key}
              label={opt.name}
              desc={opt.desc}
              checked={!!settings[opt.key]}
              onChange={() => updateSetting(opt.key, !settings[opt.key])}
              bionic={bionicReading}
              isHighContrast={contrast}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ShopTab = ({ speak }) => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { coins, setCoins, unlockedThemes, setUnlockedThemes } =
    useGamification();
  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAllTimeouts]);

  const handleBuyTheme = (themeKey, price) => {
    if (coins >= price && !unlockedThemes.includes(themeKey)) {
      setCoins(coins - price);
      setUnlockedThemes([...unlockedThemes, themeKey]);
      updateSetting('theme', themeKey);
    }
  };

  const readShopTab = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const themeNames = Object.entries(THEMES).map(([key, theme]) =>
      t(`themes.${key}.name`, theme.name),
    );
    const segments = [t('tabShop'), `${t('coins')}: ${coins}`, ...themeNames];
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 700;
    });
  }, [speak, t, coins, setSafeTimeout, clearAllTimeouts]);

  useAutoReadAloud(!!settings.voiceAssistant, readShopTab);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-4 text-center">
        <p className="font-bold text-slate-500">{t('coins')}</p>
        <p className="text-4xl font-black text-amber-500">💰 {coins}</p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {Object.entries(THEMES).map(([key, theme]) => {
          const isUnlocked = unlockedThemes.includes(key);
          const isSelected = settings.theme === key;
          const canAfford = coins >= theme.price;

          return (
            <div
              key={key}
              className={`rounded-xl border-2 p-4 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'bg-white'}`}
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 text-3xl">{theme.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">
                    {t(`themes.${key}.name`, theme.name)}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t(`themes.${key}.desc`, theme.desc)}
                  </p>
                </div>
                {isUnlocked ? (
                  <button
                    onClick={() => updateSetting('theme', key)}
                    disabled={isSelected}
                    className={`rounded-full px-4 py-1 text-xs font-bold ${isSelected ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {t('equipped')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyTheme(key, theme.price)}
                    disabled={!canAfford}
                    className={`rounded-full px-4 py-1 text-xs font-bold text-white ${canAfford ? 'bg-emerald-500 hover:bg-emerald-600' : 'cursor-not-allowed bg-slate-300'}`}
                  >
                    {t('buy')} ({theme.price}💰)
                  </button>
                )}
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

  // Same "lead with the tab name, then read the group labels" pattern as
  // the other tabs — individual exercise-type names aren't read here (there
  // are 12 of them; unlike A11yTab's shorter list, reading all of them on
  // every tab visit would make voice assistant users wait a long time for a
  // list most will never need read aloud, since each switch already has its
  // own accessible name for on-demand screen-reader review).
  const readExercisesTab = useCallback(() => {
    if (!speak) return;
    clearAllTimeouts();
    const segments = [
      t('tabExercises'),
      ...Object.keys(EXERCISE_PILLARS).map((pillarKey) =>
        t(`pillars.${pillarKey}`, pillarKey),
      ),
    ];
    let delayAcc = 0;
    segments.forEach((segment) => {
      setSafeTimeout(() => speak(segment), delayAcc);
      delayAcc += segment.length * 70 + 700;
    });
  }, [speak, t, setSafeTimeout, clearAllTimeouts]);

  useAutoReadAloud(!!settings.voiceAssistant, readExercisesTab);

  return <ExerciseToggleManager t={t} bigTargets={bigTargets} />;
};

export default function SettingsModal({ open, onClose, speak }) {
  const { t } = useTranslation();
  const { settings } = useUserSettingsContext();
  const { isGamified } = useGamification();
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
      overlayClassName="z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      className={`animate-in zoom-in relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl shadow-2xl duration-300 outline-none ${settings.contrast ? 'border-2 border-white bg-black' : 'bg-slate-100'}`}
    >
      {}
      <header
        className={`shrink-0 border-b p-4 ${settings.contrast ? 'border-white/20' : 'border-slate-200'} flex items-center justify-between`}
      >
        <h2
          id="settings-title"
          className={`text-lg font-bold ${settings.contrast ? 'text-white' : 'text-slate-800'}`}
        >
          {t('settingsTitle')}
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
              {tab.label}
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
          {t('settingsFooter')}
        </p>
      </footer>
    </Dialog>
  );
}
