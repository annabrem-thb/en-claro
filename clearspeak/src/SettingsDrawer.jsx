import React, { useEffect } from 'react';
import { useConfig } from './useConfig';
import { useTranslation } from './i18n';

const THEME_KEYS = ['Musik', 'Natur', 'Kunst'];
const PROFILE_KEYS = ['Standard', 'LRS'];

const ADDON_KEYS = [
  { key: 'contrast', profileKey: 'Kontrast', icon: '🌗', ring: 'ring-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  { key: 'motorik', profileKey: 'Motorik', icon: '🖐️', ring: 'ring-rose-400', bg: 'bg-rose-50', text: 'text-rose-700' },
  { key: 'vision', profileKey: 'Niedowidzenie', icon: '🔍', ring: 'ring-blue-400', bg: 'bg-blue-50', text: 'text-blue-700' },
  { key: 'color', profileKey: 'Daltonizm', icon: '🎨', ring: 'ring-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  { key: 'motion', profileKey: 'Redukcja', icon: '🛡️', ring: 'ring-indigo-400', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  { key: 'bionic', profileKey: 'Bionic', icon: '📖', ring: 'ring-cyan-400', bg: 'bg-cyan-50', text: 'text-cyan-700' },
  { key: 'ruler', profileKey: 'Linijka', icon: '📏', ring: 'ring-fuchsia-400', bg: 'bg-fuchsia-50', text: 'text-fuchsia-700' },
  { key: 'spacing', profileKey: 'Spacing', icon: '🔠', ring: 'ring-teal-400', bg: 'bg-teal-50', text: 'text-teal-700' },
  { key: 'desaturation', profileKey: 'Desaturacja', icon: '🌫️', ring: 'ring-slate-400', bg: 'bg-slate-50', text: 'text-slate-700' }
];

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
];

const THEME_ACCENT = {
  Musik:  { ring: 'ring-purple-400', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  Natur:  { ring: 'ring-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  Kunst:  { ring: 'ring-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
};

const PROFILE_ACCENT = {
  Standard: { ring: 'ring-sky-400',    bg: 'bg-sky-50',    text: 'text-sky-700' },
  LRS:      { ring: 'ring-violet-400', bg: 'bg-violet-50', text: 'text-violet-700' },
  Kontrast: { ring: 'ring-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  Motorik:  { ring: 'ring-rose-400',   bg: 'bg-rose-50',   text: 'text-rose-700' },
};

export default function SettingsDrawer({ open, onClose, isGamified, setIsGamified }) {
  const { theme, setTheme, accessibility, setAccessibility, language, setLanguage, a11ySettings, toggleA11ySetting } = useConfig();
  const t = useTranslation(language);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-modal="true"
        role="dialog"
        aria-label={t.settingsTitle}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-black text-slate-800 text-lg">{t.settingsTitle}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {t.settingsSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

          <section>
            <SectionLabel>{t.languageLabel}</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`py-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    language === l.code
                      ? 'border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-sky-200'
                      : 'border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <span className="text-2xl">{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>{t.versionGamified}</SectionLabel>
            <div className="flex gap-2">
              <ModeButton
                active={!isGamified}
                onClick={() => setIsGamified(false)}
                emoji="📖"
                label={t.versionBase}
                sublabel={t.versionBaseSub}
                activeClass="border-slate-400 bg-slate-50 text-slate-700 ring-2 ring-slate-200"
              />
              <ModeButton
                active={isGamified}
                onClick={() => setIsGamified(true)}
                emoji="🎮"
                label={t.versionGamified}
                sublabel={t.versionGamifiedSub}
                activeClass="border-teal-400 bg-teal-50 text-teal-700 ring-2 ring-teal-200"
              />
            </div>
          </section>

          <section className={`transition-opacity duration-200 ${isGamified ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <SectionLabel>{t.settingsTheme}</SectionLabel>
            <div className="grid gap-2">
              {THEME_KEYS.map(key => {
                const themeData = t.themes[key];
                const ac = THEME_ACCENT[key];
                const active = theme === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                      active
                        ? `${ac.ring} ${ac.bg} ring-2 border-transparent`
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-3xl">{themeData.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-black text-sm ${active ? ac.text : 'text-slate-700'}`}>
                        {themeData.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{themeData.desc}</p>
                    </div>
                    {active && <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${ac.dot}`} />}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <SectionLabel>{t.settingsAccessibility}</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {PROFILE_KEYS.map(key => {
                const profile = t.profiles[key];
                const ac = PROFILE_ACCENT[key];
                const active = accessibility === key;
                return (
                  <button
                    key={key}
                    onClick={() => setAccessibility(key)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      active
                        ? `${ac.ring} ${ac.bg} ring-2 border-transparent`
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <p className={`font-black text-xs ${active ? ac.text : 'text-slate-700'}`}>
                      {profile.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{profile.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <SectionLabel>{t.a11yAddons}</SectionLabel>
            <div className="flex flex-col gap-2">
              {ADDON_KEYS.map(({ key, profileKey, icon, ring, bg, text }) => {
                const profile = t.profiles[profileKey];
                const isActive = a11ySettings?.[key];
                
                return (
                  <button
                    key={key}
                    onClick={() => toggleA11ySetting(key)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                      isActive
                        ? `${ring} ${bg} ring-2 border-transparent`
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${isActive ? 'bg-white border-current/20' : 'bg-slate-50 border-slate-100'}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-black text-xs ${isActive ? text : 'text-slate-700'}`}>
                        {profile?.name || profileKey}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{profile?.desc}</p>
                    </div>
                    <div className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isActive ? `border-current ${ring} text-current` : `border-slate-200 bg-white`}`}>
                      {isActive && <span className="text-[10px] font-black">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="pb-6 text-center">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed">
              {t.thesisInfo.split('\n').map((line, i) => (
                <React.Fragment key={i}>{line}<br /></React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">
      {children}
    </p>
  );
}

function ModeButton({ active, onClick, emoji, label, sublabel, activeClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${
        active ? activeClass : 'border-slate-100 text-slate-500 hover:border-slate-200'
      }`}
    >
      <span className="text-2xl block mb-1">{emoji}</span>
      <p className="font-black text-xs leading-tight">{label}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{sublabel}</p>
    </button>
  );
}