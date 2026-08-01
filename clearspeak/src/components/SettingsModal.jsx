import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserSettingsContext } from './UserSettingsContext.jsx';
import { useGamification } from './GamificationContext.jsx';
import BionicText from './common/BionicText.jsx';
import LanguageSwitcher from './common/LanguageSwitcher.jsx';

const THEMES = {
  Natur: { name: "Natura", icon: "🌿", desc: "Zielone barwy, relaks", price: 0 },
  Musik: { name: "Muzyka", icon: "🎵", desc: "Fiolet, dynamika", price: 3 },
  Kunst: { name: "Sztuka", icon: "🎨", desc: "Bursztyn, kreatywność", price: 5 },
  Space: { name: "Kosmos", icon: "🚀", desc: "Kosmiczna głębia", price: 8 },
  Ocean: { name: "Ocean", icon: "🐳", desc: "Morski spokój", price: 10 },
};

const SettingToggle = ({ label, desc, checked, onChange, bionic, isHighContrast }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl transition-colors ${checked ? (isHighContrast ? 'bg-white/10' : 'bg-slate-50') : ''}`}>
    <div className="flex-1 min-w-0 mr-4">
      <p className={`font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}><BionicText text={label} enabled={bionic} /></p>
      <p className={`text-xs ${isHighContrast ? 'text-white/60' : 'text-slate-500'}`}><BionicText text={desc} enabled={bionic} /></p>
    </div>
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-emerald-500' : (isHighContrast ? 'bg-white/30' : 'bg-slate-200')}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const GeneralTab = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { isGamified, setIsGamified } = useGamification();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="px-3 text-sm font-bold text-slate-500 mb-2">{t('languageLabel')}</h3>
        <LanguageSwitcher />
      </div>
      <div>
        <h3 className="px-3 text-sm font-bold text-slate-500 mb-2">{t('appMode')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setIsGamified(false)} aria-pressed={!isGamified} className={`p-4 rounded-xl text-left border-2 ${!isGamified ? 'border-indigo-500 bg-indigo-50' : 'bg-white hover:border-slate-300'}`}>
            <p className="font-bold text-slate-800">{t('v1Label')}</p>
            <p className="text-xs text-slate-500">{t('v1Desc')}</p>
          </button>
          <button onClick={() => setIsGamified(true)} aria-pressed={isGamified} className={`p-4 rounded-xl text-left border-2 ${isGamified ? 'border-indigo-500 bg-indigo-50' : 'bg-white hover:border-slate-300'}`}>
            <p className="font-bold text-slate-800">{t('v2Label')}</p>
            <p className="text-xs text-slate-500">{t('v2Desc')}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

const A11yTab = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { bionicReading, contrast, lrs, motorik, vision, spacing, ruler, color, motion, desaturation, voiceAssistant, zenMode } = settings;

  const a11yOptions = [
    { key: 'lrs', ...t('a11y.lrs', { returnObjects: true }) },
    { key: 'contrast', ...t('a11y.contrast', { returnObjects: true }) },
    { key: 'vision', ...t('a11y.vision', { returnObjects: true }) },
    { key: 'motorik', ...t('a11y.motor', { returnObjects: true }) },
    { key: 'spacing', ...t('a11y.spacing', { returnObjects: true }) },
    { key: 'ruler', ...t('a11y.ruler', { returnObjects: true }) },
    { key: 'color', ...t('a11y.colors', { returnObjects: true }) },
    { key: 'motion', ...t('a11y.motion', { returnObjects: true }) },
    { key: 'desaturation', ...t('a11y.desaturation', { returnObjects: true }) },
  ];

  const inclusiveOptions = [
    { key: 'bionicReading', ...t('inclusive.bionicReading', { returnObjects: true }) },
    { key: 'voiceAssistant', ...t('inclusive.voiceAssistant', { returnObjects: true }) },
    { key: 'zenMode', ...t('inclusive.zenMode', { returnObjects: true }) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="px-3 text-sm font-bold text-slate-500 mb-2">{t('a11yAddons')}</h3>
        <div className="space-y-1">
          {a11yOptions.map(opt => (
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
        <h3 className="px-3 text-sm font-bold text-slate-500 mb-2">{t('gamificationTitle')}</h3>
        <div className="space-y-1">
          {inclusiveOptions.map(opt => (
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

const ShopTab = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useUserSettingsContext();
  const { coins, setCoins, unlockedThemes, setUnlockedThemes } = useGamification();

  const handleBuyTheme = (themeKey, price) => {
    if (coins >= price && !unlockedThemes.includes(themeKey)) {
      setCoins(coins - price);
      setUnlockedThemes([...unlockedThemes, themeKey]);
      updateSetting('theme', themeKey);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-slate-50 rounded-xl">
        <p className="font-bold text-slate-500">{t('coins')}</p>
        <p className="text-4xl font-black text-amber-500">💰 {coins}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Object.entries(THEMES).map(([key, theme]) => {
          const isUnlocked = unlockedThemes.includes(key);
          const isSelected = settings.theme === key;
          const canAfford = coins >= theme.price;

          return (
            <div key={key} className={`p-4 rounded-xl border-2 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'bg-white'}`}>
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-1">{theme.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{t(`themes.${key}.name`, theme.name)}</h4>
                  <p className="text-xs text-slate-500">{t(`themes.${key}.desc`, theme.desc)}</p>
                </div>
                {isUnlocked ? (
                  <button onClick={() => updateSetting('theme', key)} disabled={isSelected} className={`px-4 py-1 text-xs font-bold rounded-full ${isSelected ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    {t('equipped')}
                  </button>
                ) : (
                  <button onClick={() => handleBuyTheme(key, theme.price)} disabled={!canAfford} className={`px-4 py-1 text-xs font-bold rounded-full text-white ${canAfford ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-300 cursor-not-allowed'}`}>
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


export default function SettingsModal({ open, onClose }) {
  const { t } = useTranslation();
  const { settings } = useUserSettingsContext();
  const { isGamified } = useGamification();
  const [activeTab, setActiveTab] = useState('general');

  if (!open) return null;

  const TABS = [
    { id: 'general', label: t('tabGeneral') },
    {
      id: 'a11y',
      label: t('tabA11y')
    },
  ];

  if (isGamified) {
    TABS.push({ id: 'shop', label: t('tabShop') });
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralTab />;
      case 'a11y': return <A11yTab />;
      case 'shop': return <ShopTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl animate-in zoom-in duration-300 ${settings.contrast ? 'bg-black border-2 border-white' : 'bg-slate-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <header className={`shrink-0 p-4 border-b ${settings.contrast ? 'border-white/20' : 'border-slate-200'} flex items-center justify-between`}>
          <h2 id="settings-title" className={`text-lg font-bold ${settings.contrast ? 'text-white' : 'text-slate-800'}`}>
            {t('settingsTitle')}
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold transition-colors ${settings.contrast ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-200'}`}
            aria-label={t('close')}
          >
            ✕
          </button>
        </header>

        {}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {}
          <nav className={`shrink-0 flex flex-row md:flex-col p-2 space-x-1 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-y-auto border-b md:border-b-0 md:border-r ${settings.contrast ? 'border-white/20' : 'border-slate-200'}`}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`w-full px-4 py-2 text-sm font-bold text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? (settings.contrast ? 'bg-white/20 text-white' : 'bg-white text-indigo-600')
                    : (settings.contrast ? 'text-white/70 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-200')
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {}
          <div className="flex-1 p-4 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>

        {}
        <footer className={`shrink-0 p-3 text-center border-t ${settings.contrast ? 'border-white/20' : 'border-slate-200'}`}>
          <p className={`text-xs ${settings.contrast ? 'text-white/50' : 'text-slate-400'}`}>
            {t('settingsFooter')}
          </p>
        </footer>
      </div>
    </div>
  );
}