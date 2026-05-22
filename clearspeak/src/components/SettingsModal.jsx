// SettingsModal.jsx — v5 (Added Voice Selection)
// Key changes:
//  • LRS is always-on base layer (no "Standard" anymore)
//  • Other a11y profiles are ADD-ONS (multi-select), not alternatives
//  • Gamification options only visible in V2 mode
//  • Theme shop with low prices (3–10 coins) + daily streak bonus
//  • Full i18n — every string goes through t() with PL/EN/DE fallbacks
//  • Compact layout, clear sections, no redundant scrolling
//  • EXPANDED: Added Voice Assistant, Zen Mode, Bionic Reading
//  • NEW: Added voice selection for TTS

import React, { useState, useEffect, useRef } from 'react';
import { STRINGS } from '../i18n/strings.js';
import { useGamification } from './GamificationContext.jsx';
import { getAllLogs } from '../utils/indexedDB.js';
import { useMonthlyStats } from '../hooks/useMonthlyStats.js';

// ─── Theme shop config ────────────────────────────────────────────────────────
const THEME_CONFIG = {
  Natur:  { icon: '🌿', cost: 0  },
  Musik:  { icon: '🎵', cost: 3  },
  Kunst:  { icon: '🎨', cost: 5  },
  Space:  { icon: '🚀', cost: 8  },
  Ocean:  { icon: '🐳', cost: 10 },
};

// ─── A11y add-on profiles (multi-select, on top of LRS base) ─────────────────
const A11Y_ADDONS = [
  {
    key: 'Kontrast',
    icon: '🌗',
    color: 'yellow',
    tags: ['kontrast', 'wzrok'],
  },
  {
    key: 'Motorik',
    icon: '🖐️',
    color: 'orange',
    tags: ['motor', 'dotyk'],
  },
  {
    key: 'Niedowidzenie',
    icon: '🔍',
    color: 'blue',
    tags: ['wzrok', 'zoom'],
  },
  {
    key: 'Daltonizm',
    icon: '🎨',
    color: 'teal',
    tags: ['kolor'],
  },
  {
    key: 'Redukcja',
    icon: '🧘',
    color: 'green',
    tags: ['ruch', 'epilepsja'],
  },
  {
    key: 'Linijka',
    icon: '📏',
    color: 'blue',
    tags: ['wzrok', 'linijka'],
  },
  {
    key: 'Spacing',
    icon: '🔠',
    color: 'teal',
    tags: ['wzrok'],
  },
  {
    key: 'Desaturacja',
    icon: '🌫️',
    color: 'slate',
    tags: ['kolor', 'wzrok'],
  },
];

// ─── Inclusive gamification extras & Premium Accessibility ───────────────────
const INCLUSIVE_OPTIONS = [
  { key: 'adaptiveDifficulty', icon: '🎯' },
  { key: 'bigTargets',         icon: '🟢' },
  { key: 'noFlash',            icon: '🚫' },
  { key: 'audioRewards',       icon: '🔔' },
  { key: 'extendedTime',       icon: '⏱️' },
  { key: 'voiceAssistant',     icon: '🗣️' }, // NEW: Voice Assistant
  { key: 'zenMode',            icon: '🧘' }, // NEW: Zen Mode
  { key: 'bionicReading',      icon: '👁️' }, // NEW: Bionic Reading
  { key: 'minimalistMode',     icon: '🧹' }, // NEW: Minimalist View
  { key: 'muteNotifications',  icon: '🔕' }, // NEW: Mute Notifications
];

// ─── Color map ────────────────────────────────────────────────────────────────
const COLOR = {
  yellow: { ring: 'border-yellow-400 bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-600', dot: 'bg-yellow-400' },
  orange: { ring: 'border-orange-400 bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-600', dot: 'bg-orange-400' },
  blue:   { ring: 'border-blue-400 bg-blue-50',     text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-600',    dot: 'bg-blue-400'   },
  teal:   { ring: 'border-teal-400 bg-teal-50',     text: 'text-teal-700',   badge: 'bg-teal-100 text-teal-600',    dot: 'bg-teal-400'   },
  green:  { ring: 'border-green-400 bg-green-50',   text: 'text-green-700',  badge: 'bg-green-100 text-green-600',  dot: 'bg-green-400'  },
  slate:  { ring: 'border-slate-400 bg-slate-50',   text: 'text-slate-700',  badge: 'bg-slate-100 text-slate-600',  dot: 'bg-slate-400'  },
};

// ─── Shared sub-components ────────────────────────────────────────────────────
const Divider = () => <div className="h-px bg-slate-100 my-1" />;

const SectionLabel = ({ children, sub, isHighContrast }) => (
  <div className="mb-3">
    <h3 className={`text-xs md:text-sm font-black uppercase tracking-widest break-words ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{children}</h3>
    {sub && <p className={`text-xs mt-1 leading-snug break-words ${isHighContrast ? 'text-white/50' : 'text-slate-400'}`}>{sub}</p>}
  </div>
);

const Toggle = ({ on, isHighContrast }) => (
  <div className={`shrink-0 w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${on ? (isHighContrast ? 'bg-white' : 'bg-indigo-400') : (isHighContrast ? 'bg-white/30' : 'bg-slate-200')}`}>
    <div className={`w-4 h-4 rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'} ${isHighContrast && on ? 'bg-black' : 'bg-white'}`} />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
function SettingsModal({
  open, onClose,
  language = 'pl',        setLanguage,
  theme = 'Natur',        setTheme,
  dailyGoal = 5,          setDailyGoal,
  // a11yAddons is now a SET of active add-ons (array of keys), LRS always implied
  a11yAddons = [],        setA11yAddons,
  coins = 0,              setCoins,
  unlockedThemes = ['Natur'],  setUnlockedThemes,
  inclusiveOptions = {},  setInclusiveOptions,
  selectedVoiceURI,       setSelectedVoiceURI,
  voiceSpeed,             setVoiceSpeed,
  voicePitch,             setVoicePitch,
  isHighContrast = false,
  bigTargets = false,
}) {
  const { isGamified, setIsGamified } = useGamification();
  const [voices, setVoices] = useState([]);
  const [userSelectedTab, setUserSelectedTab] = useState('general');

  // --- Profile / Chart state ---
  const now = new Date();
  const [chartYear, setChartYear] = useState(now.getFullYear());
  const [chartMonth, setChartMonth] = useState(now.getMonth() + 1);
  const { stats: monthlyStats, maxCount, maxStreak, loading: statsLoading } = useMonthlyStats(chartYear, chartMonth);

  // If gamification is turned off while the user is on the "Game" tab,
  // derive the active tab to be "general" to avoid showing an empty screen.
  const activeTab = (!isGamified && (userSelectedTab === 'game' || userSelectedTab === 'shop'))
    ? 'general'
    : userSelectedTab;

  // --- NOWE: Stan i pobieranie danych do wykresu błędów ---
  const [errorStats, setErrorStats] = useState([]);
  const [errorStatsLoading, setErrorStatsLoading] = useState(true);

  useEffect(() => {
    if (activeTab !== 'profile') return;
    let isMounted = true;
    setErrorStatsLoading(true);
    
    getAllLogs('exercise_history').then(logs => {
      if (!isMounted) return;
      const daysInMonth = new Date(chartYear, chartMonth, 0).getDate();
      const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, errors: 0 }));
      
      logs.forEach(log => {
        if (log.correct === false && log.date) {
          const d = new Date(log.date);
          if (d.getFullYear() === chartYear && (d.getMonth() + 1) === chartMonth) {
            dailyData[d.getDate() - 1].errors += 1;
          }
        }
      });
      
      setErrorStats(dailyData);
      setErrorStatsLoading(false);
    }).catch(() => { if (isMounted) setErrorStatsLoading(false); });
    return () => { isMounted = false; };
  }, [chartYear, chartMonth, activeTab]);

  const maxErrors = Math.max(...errorStats.map(d => d.errors), 0);

  // --- Swipe-to-close logic ---
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };
  const onTouchMove = (e) => { touchEnd.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }; };
  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    if (distanceY < -50 && Math.abs(distanceY) > Math.abs(touchStart.current.x - touchEnd.current.x)) onClose();
  };
  
  // ─── Load available TTS voices ──────────────────────────────────────────
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  if (!open) return null;

  // Key-by-key fallback: if a string is missing in the current language, use Polish
  const s = { ...STRINGS.pl, ...(STRINGS[language] || {}) };

  // ─── A11y add-on toggle ─────────────────────────────────────────────────
  const toggleAddon = (key) => {
    setA11yAddons?.((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // ─── Theme purchase / equip ─────────────────────────────────────────────
  const handleThemeSelect = (themeKey) => {
    const isUnlocked = unlockedThemes.includes(themeKey);
    const cost = THEME_CONFIG[themeKey].cost;
    if (isUnlocked) {
      setTheme(themeKey);
    } else if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setUnlockedThemes((prev) => [...prev, themeKey]);
      setTheme(themeKey);
    }
  };

  // ─── Toggle inclusive option ────────────────────────────────────────────
  const toggleInclusive = (key) => {
    setInclusiveOptions?.((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const langCode = { pl: 'pl-PL', en: 'en-US', de: 'de-DE' }[language];
  const filteredVoices = voices.filter(v => v.lang === langCode);

  const handleTestVoice = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Interrupts previous tests if the user clicks quickly
    const msg = new SpeechSynthesisUtterance(s.testSentence);
    msg.lang = langCode;
    msg.rate = voiceSpeed;
    msg.pitch = voicePitch;

    let selectedVoice = null;
    if (selectedVoiceURI && selectedVoiceURI !== 'default') {
      selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    } else {
      if (language === 'pl')      selectedVoice = voices.find(v => v.name.includes('Zofia'));
      else if (language === 'en') selectedVoice = voices.find(v => v.name.includes('Emma'));
      else if (language === 'de') selectedVoice = voices.find(v => v.name.includes('Amala'));
    }

    if (selectedVoice) {
      msg.voice = selectedVoice;
    }
    window.speechSynthesis.speak(msg);
  };

  // ─── Export NASA-TLX logs to CSV ─────────────────────────────────────────
  const handleExportCSV = async () => {
    const logs = await getAllLogs('ux_logs').catch(() => []);
    
    let exportData = logs;
    if (exportData.length === 0) {
      const wantTest = window.confirm((s.noDataToExport || 'No data to export') + '\n\nCzy chcesz wygenerować testowy plik, aby sprawdzić pobieranie?');
      if (!wantTest) return;
      
      // Generowanie sztucznych danych testowych, aby potwierdzić działanie funkcji
      exportData = [{
        timestamp: new Date().toISOString(),
        pointsAtTime: 10,
        metrics: { mental: 4, effort: 3, frustration: 2, attractiveness: 4, stimulation: 5 }
      }];
    }

    const headers = ['Timestamp', 'Points At Time', 'Mental Demand', 'Effort', 'Frustration', 'Attractiveness', 'Stimulation'];
    const csvRows = [headers.join(',')];

    for (const log of exportData) {
      const row = [
        log.timestamp,
        log.pointsAtTime,
        log.metrics?.mental || '',
        log.metrics?.effort || '',
        log.metrics?.frustration || '',
        log.metrics?.attractiveness || '',
        log.metrics?.stimulation || ''
      ];
      csvRows.push(row.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', `ux_evaluation_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`rounded-t-[40px] sm:rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] ${isHighContrast ? 'bg-black border-2 border-white' : 'bg-white'}`}>

        {/* ── Header & Tabs ─────────────────────────────────────────────── */}
        <div 
          className={`px-5 pt-4 pb-0 flex flex-col gap-4 border-b sticky top-0 z-10 shrink-0 touch-pan-x ${isHighContrast ? 'bg-black/90 border-white/30' : 'bg-slate-50/80 border-slate-100'}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Drag handle (mobile) */}
          <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full sm:hidden ${isHighContrast ? 'bg-white/30' : 'bg-slate-200'}`} />

          <div className="flex items-center justify-between px-1">
            <h2 className={`text-base font-black tracking-tight flex items-center gap-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
              ⚙️ {s.settings}
            </h2>
            
            {isGamified && (
              <div className={`px-3 py-1 rounded-full font-black text-sm flex items-center gap-1.5 shadow-inner ${isHighContrast ? 'bg-white text-black' : 'bg-amber-100 text-amber-600'}`}>
                <span className="text-base">💰</span> {coins}
              </div>
            )}
            
            <button
              onClick={onClose}
              className={`rounded-full font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm ${bigTargets ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm'} ${isHighContrast ? 'bg-black border border-white text-white hover:bg-white/20' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              aria-label={s.close}
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className={`flex p-1 rounded-2xl mb-4 overflow-x-auto ${isHighContrast ? 'bg-white/20' : 'bg-slate-200/50'}`}>
            <button
              onClick={() => setUserSelectedTab('profile')}
              aria-current={activeTab === 'profile' ? 'step' : undefined}
              className={`flex-1 min-w-[70px] ${bigTargets ? 'py-4 text-sm' : 'py-2 text-xs'} font-bold rounded-xl transition-all whitespace-nowrap px-3 ${
                activeTab === 'profile' ? (isHighContrast ? 'bg-black border border-white text-white' : 'bg-white shadow-sm text-indigo-600') : (isHighContrast ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700')
              }`}
            >
              {s.profile || 'Profil'}
            </button>
            <button
              onClick={() => setUserSelectedTab('general')}
              aria-current={activeTab === 'general' ? 'step' : undefined}
                className={`flex-1 ${bigTargets ? 'py-4 text-sm' : 'py-2 text-xs'} font-bold rounded-xl transition-all whitespace-nowrap px-2 ${
                activeTab === 'general' ? (isHighContrast ? 'bg-black border border-white text-white' : 'bg-white shadow-sm text-indigo-600') : (isHighContrast ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700')
              }`}
            >
              {s.tabGeneral}
            </button>
            <button
                onClick={() => setUserSelectedTab('voice')}
                aria-current={activeTab === 'voice' ? 'step' : undefined}
                className={`flex-1 ${bigTargets ? 'py-4 text-sm' : 'py-2 text-xs'} font-bold rounded-xl transition-all whitespace-nowrap px-2 ${
                  activeTab === 'voice' ? (isHighContrast ? 'bg-black border border-white text-white' : 'bg-white shadow-sm text-indigo-600') : (isHighContrast ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700')
                }`}
              >
                {s.tabVoice}
              </button>
              <button
              onClick={() => setUserSelectedTab('a11y')}
              aria-current={activeTab === 'a11y' ? 'step' : undefined}
                className={`flex-1 ${bigTargets ? 'py-4 text-sm' : 'py-2 text-xs'} font-bold rounded-xl transition-all whitespace-nowrap px-2 ${
                activeTab === 'a11y' ? (isHighContrast ? 'bg-black border border-white text-white' : 'bg-white shadow-sm text-indigo-600') : (isHighContrast ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700')
              }`}
            >
              {s.tabA11y}
            </button>
            {isGamified && (
                <>
                  <button
                    onClick={() => setUserSelectedTab('game')}
                    aria-current={activeTab === 'game' ? 'step' : undefined}
                    className={`flex-1 ${bigTargets ? 'py-4 text-sm' : 'py-2 text-xs'} font-bold rounded-xl transition-all whitespace-nowrap px-2 ${ activeTab === 'game' ? (isHighContrast ? 'bg-black border border-white text-white' : 'bg-white shadow-sm text-indigo-600') : (isHighContrast ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700') }`}
                  >{s.tabGame}</button>
                  <button
                    onClick={() => setUserSelectedTab('shop')}
                    aria-current={activeTab === 'shop' ? 'step' : undefined}
                    className={`flex-1 ${bigTargets ? 'py-4 text-sm' : 'py-2 text-xs'} font-bold rounded-xl transition-all whitespace-nowrap px-2 ${ activeTab === 'shop' ? (isHighContrast ? 'bg-black border border-white text-white' : 'bg-white shadow-sm text-indigo-600') : (isHighContrast ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700') }`}
                  >{s.tabShop}</button>
                </>
            )}
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div className="p-5 overflow-y-auto flex flex-col gap-6 overscroll-contain">

          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <section>
                <SectionLabel isHighContrast={isHighContrast} sub={s.dailySummary || 'Twoja miesięczna aktywność'}>{s.profile || 'Profil'}</SectionLabel>
                
                <div className={`${bigTargets ? 'p-6 sm:p-8' : 'p-4 sm:p-5'} rounded-3xl border-2 flex flex-col gap-4 ${isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex justify-between items-center">
                    <button onClick={() => { setChartMonth(m => m === 1 ? 12 : m - 1); setChartYear(y => chartMonth === 1 ? y - 1 : y); }} className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center active:scale-90 transition-all ${isHighContrast ? 'bg-black border border-white text-white hover:bg-white/20' : 'bg-white text-slate-400 hover:text-slate-600'}`}>◀</button>
                    <span className={`font-black text-sm tracking-widest ${isHighContrast ? 'text-white' : 'text-slate-700'}`}>{chartYear} - {String(chartMonth).padStart(2, '0')}</span>
                    <button onClick={() => { setChartMonth(m => m === 12 ? 1 : m + 1); setChartYear(y => chartMonth === 12 ? y + 1 : y); }} className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center active:scale-90 transition-all ${isHighContrast ? 'bg-black border border-white text-white hover:bg-white/20' : 'bg-white text-slate-400 hover:text-slate-600'}`}>▶</button>
                  </div>

                  {statsLoading ? (
                    <div className={`h-40 flex items-center justify-center text-xs font-bold animate-pulse ${isHighContrast ? 'text-white/50' : 'text-slate-400'}`}>
                      ...
                    </div>
                  ) : (
                    <div className="h-40 flex items-end justify-between gap-[2px] sm:gap-1 mt-2 relative">
                      {monthlyStats.map((d) => {
                        const heightPct = maxCount > 0 ? Math.max((d.count / maxCount) * 100, d.count > 0 ? 5 : 0) : 0;
                        const isToday = now.getFullYear() === chartYear && (now.getMonth() + 1) === chartMonth && now.getDate() === d.day;
                        
                        return (
                          <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-1 h-full group relative">
                            {d.count > 0 && (
                              <span className={`absolute -top-7 text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-md ${isHighContrast ? 'bg-white text-black' : 'bg-slate-800 text-white'}`}>
                                {d.count}
                              </span>
                            )}
                            <div 
                              className={`w-full rounded-t-sm transition-all duration-700 delay-100 ${d.count === 0 ? 'bg-transparent' : isToday ? (isHighContrast ? 'bg-white border-2 border-b-0 border-white' : 'bg-indigo-500 shadow-sm') : (isHighContrast ? 'bg-white/50' : 'bg-emerald-400 hover:bg-emerald-300')}`}
                              style={{ height: `${heightPct}%` }}
                              aria-label={`Dzień ${d.day}: ${d.count} ćwiczeń`}
                            />
                            {/* Oś X - wyświetlana tylko dla pierwszego i co 5-go dnia */}
                            {(d.day % 5 === 0 || d.day === 1) ? (
                              <span className={`text-[8px] font-bold ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{d.day}</span>
                            ) : (
                              <span className="text-[8px] text-transparent select-none">{d.day}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Longest Streak Indicator */}
                {!statsLoading && (
                  <div className={`mt-4 border-2 ${bigTargets ? 'p-6' : 'p-4'} rounded-3xl shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-2 duration-500 ${isHighContrast ? 'bg-black border-white/30 text-white' : 'bg-white border-orange-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border ${isHighContrast ? 'bg-white text-black border-white' : 'bg-orange-50 text-orange-500 border-orange-100'}`} aria-hidden="true">
                        🔥
                      </div>
                      <span className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
                        {s.longestStreak || 'Najdłuższy ciąg dni'}
                      </span>
                    </div>
                    <span className={`text-xl font-black ${isHighContrast ? 'text-white' : 'text-orange-500'}`}>
                      {maxStreak} <span className={`text-xs uppercase tracking-widest ${isHighContrast ? 'text-white/70' : 'text-orange-400'}`}>{s.daysCount || 'dni'}</span>
                    </span>
                  </div>
                )}

                {/* --- NOWE: Wykres Analizy Błędów --- */}
                {!statsLoading && !errorStatsLoading && (
                  <div className={`mt-6 ${bigTargets ? 'p-6 sm:p-8' : 'p-4 sm:p-5'} rounded-3xl border-2 flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-150 ${isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-100'}`}>
                    <SectionLabel isHighContrast={isHighContrast} sub={s.errorAnalysisSub || 'Liczba pomyłek w poszczególnych dniach'}>
                      {s.errorAnalysis || 'Analiza błędów'}
                    </SectionLabel>
                    
                    <div className="h-32 flex items-end justify-between gap-[2px] sm:gap-1 mt-2 relative">
                      {errorStats.map((d) => {
                        const heightPct = maxErrors > 0 ? Math.max((d.errors / maxErrors) * 100, d.errors > 0 ? 5 : 0) : 0;
                        const isToday = now.getFullYear() === chartYear && (now.getMonth() + 1) === chartMonth && now.getDate() === d.day;
                        
                        return (
                          <div key={`err-${d.day}`} className="flex-1 flex flex-col items-center justify-end gap-1 h-full group relative">
                            {d.errors > 0 && (
                              <span className={`absolute -top-7 text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-md ${isHighContrast ? 'bg-white text-black' : 'bg-rose-600 text-white'}`}>
                                {d.errors}
                              </span>
                            )}
                            <div 
                              className={`w-full rounded-t-sm transition-all duration-700 delay-200 ${d.errors === 0 ? 'bg-transparent' : isToday ? (isHighContrast ? 'bg-white border-2 border-b-0 border-white' : 'bg-rose-500 shadow-sm') : (isHighContrast ? 'bg-white/50' : 'bg-rose-300 hover:bg-rose-400')}`}
                              style={{ height: `${heightPct}%` }}
                              aria-label={`Dzień ${d.day}: ${d.errors} błędów`}
                            />
                            {(d.day % 5 === 0 || d.day === 1) ? (
                              <span className={`text-[8px] font-bold ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{d.day}</span>
                            ) : (
                              <span className="text-[8px] text-transparent select-none">{d.day}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* ── 1. LANGUAGE ──────────────────────────────────────────────── */}
              <section>
                <SectionLabel isHighContrast={isHighContrast}>{s.language}</SectionLabel>
                <div className="flex gap-2">
                  {[
                    { code: 'pl', flag: '🇵🇱', label: 'PL' },
                    { code: 'en', flag: '🇺🇸', label: 'EN' },
                    { code: 'de', flag: '🇩🇪', label: 'DE' },
                  ].map(({ code, flag, label }) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      aria-pressed={language === code}
                      className={`flex-1 ${bigTargets ? 'py-6' : 'py-4'} rounded-2xl border-2 flex flex-col items-center gap-1 transition-all active:scale-95 ${
                        language === code
                          ? (isHighContrast ? 'border-white bg-white/20 text-white shadow-sm' : 'border-emerald-400 bg-emerald-50 shadow-sm')
                          : (isHighContrast ? 'border-white/30 bg-black text-white/70 hover:border-white/60' : 'border-slate-100 bg-white hover:border-slate-200')
                      }`}
                    >
                      <span className="text-2xl" aria-hidden="true">{flag}</span>
                      <span className={`text-xs font-black ${language === code ? (isHighContrast ? 'text-white' : 'text-slate-700') : (isHighContrast ? 'text-white/70' : 'text-slate-500')}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </section>
    
              {/* ── 2. APP MODE ──────────────────────────────────────────────── */}
              <section>
                <SectionLabel isHighContrast={isHighContrast}>{s.appMode}</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
    
                  {/* V1 — classic */}
                  <button
                    onClick={() => setIsGamified(false)}
                    aria-pressed={!isGamified}
                    className={`${bigTargets ? 'p-6' : 'p-5'} rounded-2xl border-2 text-left transition-all active:scale-95 ${
                      !isGamified
                        ? (isHighContrast ? 'border-white bg-white/20 text-white shadow-lg' : 'border-slate-700 bg-slate-800 text-white shadow-lg')
                        : (isHighContrast ? 'border-white/30 bg-black text-white/70 hover:border-white/60' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200')
                    }`}
                  >
                    <span className="text-3xl block mb-2" aria-hidden="true">📖</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${!isGamified ? 'text-white' : (isHighContrast ? 'text-white/70' : 'text-slate-700')}`}>
                      {s.v1Label}
                    </span>
                    <span className={`text-[10px] leading-tight block ${!isGamified ? (isHighContrast ? 'text-white/80' : 'text-slate-300') : (isHighContrast ? 'text-white/50' : 'text-slate-400')}`}>
                      {s.v1Desc}
                    </span>
                    {!isGamified && (
                      <span className={`mt-2 block text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 w-fit ${isHighContrast ? 'bg-white text-black' : 'bg-white/20 text-white/90'}`}>
                        ✓ {s.active}
                      </span>
                    )}
                  </button>
    
                  {/* V2 — gamified */}
                  <button
                    onClick={() => setIsGamified(true)}
                    aria-pressed={isGamified}
                    className={`${bigTargets ? 'p-6' : 'p-5'} rounded-2xl border-2 text-left transition-all active:scale-95 ${
                      isGamified
                        ? (isHighContrast ? 'border-white bg-white/20 text-white shadow-lg' : 'border-emerald-400 bg-linear-to-br from-emerald-50 to-teal-50 shadow-lg')
                        : (isHighContrast ? 'border-white/30 bg-black text-white/70 hover:border-white/60' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200')
                    }`}
                  >
                    <span className="text-3xl block mb-2" aria-hidden="true">🎮</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${isGamified ? (isHighContrast ? 'text-white' : 'text-emerald-700') : (isHighContrast ? 'text-white/70' : 'text-slate-700')}`}>
                      {s.v2Label}
                    </span>
                    <span className={`text-[10px] leading-tight block ${isGamified ? (isHighContrast ? 'text-white/80' : 'text-emerald-600') : (isHighContrast ? 'text-white/50' : 'text-slate-400')}`}>
                      {s.v2Desc}
                    </span>
                    {isGamified && (
                      <span className={`mt-2 block text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 w-fit ${isHighContrast ? 'bg-white text-black' : 'bg-emerald-400 text-white'}`}>
                        ✓ {s.active}
                      </span>
                    )}
                  </button>
                </div>
              </section>

              {/* ── 3. DAILY GOAL ──────────────────────────────────────────────── */}
              <section>
                <SectionLabel isHighContrast={isHighContrast}>{s.dailyGoal}</SectionLabel>
                <div className="flex flex-col gap-2">
                  {[5, 10, 15, 20].map(val => (
                    <button
                      key={val}
                      onClick={() => setDailyGoal(val)}
                      aria-pressed={dailyGoal === val}
                      className={`${bigTargets ? 'p-6' : 'p-4'} rounded-2xl border-2 transition-all active:scale-95 text-left flex items-center justify-between ${
                        dailyGoal === val
                          ? (isHighContrast ? 'border-white bg-white/20 text-white' : 'border-indigo-400 bg-indigo-50 shadow-sm')
                          : (isHighContrast ? 'border-white/30 bg-black hover:border-white/60' : 'border-slate-100 bg-white hover:border-slate-200')
                      }`}
                    >
                      <span className={`text-xs font-black ${dailyGoal === val ? (isHighContrast ? 'text-white' : 'text-indigo-700') : (isHighContrast ? 'text-white/70' : 'text-slate-600')}`}>
                        {s[`goal${val}`]}
                      </span>
              {dailyGoal === val && <span className={`text-xs font-black uppercase tracking-widest rounded-full px-2 py-1 ${isHighContrast ? 'bg-white text-black' : 'bg-indigo-400 text-white'}`}>✓ {s.active}</span>}
                    </button>
                  ))}
                </div>
              </section>

              {/* ── 4. EXPORT LOGS ──────────────────────────────────────────────── */}
              <section>
                <SectionLabel isHighContrast={isHighContrast} sub={s.exportDesc}>{s.exportLogs}</SectionLabel>
                <button
                  onClick={handleExportCSV}
                  className={`w-full ${bigTargets ? 'py-6 text-sm' : 'py-4 text-xs'} rounded-2xl border-2 font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 ${isHighContrast ? 'text-white bg-black border-white hover:bg-white/20' : 'text-indigo-600 bg-white border-slate-100 hover:border-indigo-300 hover:bg-indigo-50'}`}
                >
                  <span className="text-xl" aria-hidden="true">📊</span> {s.exportLogs}
                </button>
              </section>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <section>
                <SectionLabel isHighContrast={isHighContrast} sub={s.voiceDesc}>{s.voice}</SectionLabel>
                <div className="flex flex-col gap-4">
                  
                  {/* Voice Speed Slider */}
                  <div className={`${bigTargets ? 'p-6 sm:p-8' : 'p-4 sm:p-5'} rounded-2xl border-2 ${isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex justify-between items-center mb-3">
              <span className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>{s.voiceSpeed}</span>
              <span className={`text-xs font-black px-2 py-1 rounded-md ${isHighContrast ? 'text-black bg-white' : 'text-indigo-500 bg-indigo-100'}`}>{Number(voiceSpeed).toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                      className={`w-full cursor-pointer my-3 ${isHighContrast ? 'accent-white' : 'accent-indigo-500'} ${bigTargets ? 'h-4' : ''}`}
                    />
                    <div className="flex justify-between mt-1 mb-4">
              <span className={`text-xs font-bold ${isHighContrast ? 'text-white/60' : 'text-slate-400'}`}>{s.slow}</span>
              <span className={`text-xs font-bold ${isHighContrast ? 'text-white/60' : 'text-slate-400'}`}>{s.fast}</span>
                    </div>
                  
                  {/* Voice Pitch Slider */}
                  <div className="flex justify-between items-center mb-3 mt-6">
                    <span className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>{s.voicePitch || 'Pitch'}</span>
                    <span className={`text-xs font-black px-2 py-1 rounded-md ${isHighContrast ? 'text-black bg-white' : 'text-indigo-500 bg-indigo-100'}`}>{Number(voicePitch).toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(Number(e.target.value))}
                      className={`w-full cursor-pointer my-3 ${isHighContrast ? 'accent-white' : 'accent-indigo-500'} ${bigTargets ? 'h-4' : ''}`}
                  />
                  <div className="flex justify-between mt-1 mb-6">
                    <span className={`text-xs font-bold ${isHighContrast ? 'text-white/60' : 'text-slate-400'}`}>{s.pitchLow || 'Low'}</span>
                    <span className={`text-xs font-bold ${isHighContrast ? 'text-white/60' : 'text-slate-400'}`}>{s.pitchHigh || 'High'}</span>
                  </div>
                  
                    <button
                      onClick={handleTestVoice}
                      className={`w-full ${bigTargets ? 'py-4 text-sm' : 'py-2 text-xs'} rounded-xl font-bold transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 ${isHighContrast ? 'bg-black border border-white text-white hover:bg-white/20' : 'bg-white border border-slate-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50'}`}
                    >
                      <span className="text-base">🔊</span> {s.testVoice}
                    </button>
                  </div>
    
                  {/* Voice Selection (only if extra voices available) */}
                  {filteredVoices.length > 0 && (
                    <div className="relative mt-2">
                      <select
                        value={selectedVoiceURI}
                        onChange={(e) => setSelectedVoiceURI(e.target.value)}
                        className={`w-full appearance-none ${bigTargets ? 'p-6 text-sm' : 'p-4 text-xs'} rounded-2xl border-2 font-bold focus:outline-none transition-all cursor-pointer shadow-sm ${isHighContrast ? 'border-white bg-black hover:border-white/60 text-white focus:ring-4 focus:ring-white/30' : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}
                      >
                        <option value="default">{s.voiceDefault}</option>
                        {filteredVoices.map((voice) => (
                          <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                        <span className="text-xs">▼</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'a11y' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* ── 3. A11Y BASE (always-on, informational) ──────────────────── */}
              <section>
                <SectionLabel isHighContrast={isHighContrast}>{s.a11yBase}</SectionLabel>
                {/* LRS base — non-interactive, always active */}
                <div className={`flex items-center gap-3 ${bigTargets ? 'p-6' : 'p-4'} rounded-2xl border-2 ${isHighContrast ? 'border-white bg-black' : 'border-violet-300 bg-violet-50'}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border shadow-sm ${isHighContrast ? 'bg-black border-white' : 'bg-white border-violet-200'}`} aria-hidden="true">
                    🅰️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-black uppercase tracking-wider ${isHighContrast ? 'text-white' : 'text-violet-700'}`}>LRS</span>
              <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full px-2 py-0.5 ${isHighContrast ? 'bg-white text-black' : 'bg-violet-400 text-white'}`}>
                        ✓ {s.active}
                      </span>
                    </div>
            <span className={`text-xs font-medium leading-tight block mt-1 break-words ${isHighContrast ? 'text-white/80' : 'text-violet-600'}`}>
                      {s.a11yBaseDesc}
                    </span>
                  </div>
                </div>
              </section>
    
              {/* ── 4. A11Y ADD-ONS (multi-select) ───────────────────────────── */}
              <section>
                <SectionLabel isHighContrast={isHighContrast} sub={s.a11yAddonsDesc}>{s.a11yAddons}</SectionLabel>
                <div className="flex flex-col gap-2">
                  {A11Y_ADDONS.map((profile) => {
                    const isActive = a11yAddons.includes(profile.key);
                    const c = COLOR[profile.color];
                    const info = s.a11y[profile.key] || { name: profile.key, desc: '' };
                    return (
                      <button
                        key={profile.key}
                        onClick={() => toggleAddon(profile.key)}
                        className={`flex items-center gap-3 ${bigTargets ? 'p-6' : 'p-4'} rounded-2xl border-2 transition-all active:scale-[0.98] text-left ${
                          isActive
                            ? (isHighContrast ? 'border-white bg-white/20 text-white shadow-sm' : `${c.ring} shadow-sm`)
                            : (isHighContrast ? 'border-white/30 bg-black' : 'border-slate-100 bg-white hover:border-slate-200')
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                          isActive ? (isHighContrast ? 'bg-black border-white' : 'bg-white border-current/20') : (isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-100')
                    }`} aria-hidden="true">
                          {profile.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-black uppercase tracking-wider ${isActive ? (isHighContrast ? 'text-white' : c.text) : (isHighContrast ? 'text-white/70' : 'text-slate-700')}`}>
                              {info.name}
                            </span>
                          </div>
                  <span className={`text-xs font-medium leading-tight block mt-1 break-words ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{info.desc}</span>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {profile.tags.map((tag) => (
                      <span key={tag} className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                isActive ? (isHighContrast ? 'bg-white text-black' : c.badge) : (isHighContrast ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400')
                              }`}>
                                {s.tags[tag] || tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Checkbox-style indicator */}
                        <div className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isActive ? (isHighContrast ? 'border-white bg-white text-black' : `border-current ${c.ring} text-current`) : (isHighContrast ? 'border-white/50 bg-black' : 'border-slate-200 bg-white')
                        }`}>
                  {isActive && <span className="text-xs font-black">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'game' && isGamified && ( // This is now "Game Options"
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* ── 5. INCLUSIVE GAMIFICATION — only in V2 ───────────────────── */}
              <section>
                <SectionLabel isHighContrast={isHighContrast} sub={s.gamificationDesc}>{s.gamificationTitle}</SectionLabel>
                <div className="flex flex-col gap-2">
                  {INCLUSIVE_OPTIONS.map((opt) => {
                    const isOn = !!inclusiveOptions?.[opt.key];
                    const info = s.inclusive[opt.key] || { name: opt.key, desc: '' };
                    return (
                      <button
                        key={opt.key}
                        onClick={() => toggleInclusive(opt.key)}
                        className={`flex items-center gap-3 ${bigTargets ? 'p-6' : 'p-4'} rounded-2xl border-2 transition-all active:scale-[0.98] text-left ${
                          isOn
                            ? (isHighContrast ? 'border-white bg-white/20 text-white shadow-sm' : 'border-indigo-300 bg-indigo-50 shadow-sm')
                            : (isHighContrast ? 'border-white/30 bg-black text-white/70 hover:border-white/60' : 'border-slate-100 bg-white hover:border-slate-200')
                        }`}
                        aria-pressed={isOn}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                          isOn ? (isHighContrast ? 'bg-black border-white' : 'bg-white border-indigo-200') : (isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-100')
                    }`} aria-hidden="true">
                          {opt.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-black uppercase tracking-wider block ${isOn ? (isHighContrast ? 'text-white' : 'text-indigo-700') : (isHighContrast ? 'text-white/70' : 'text-slate-700')}`}>
                            {info.name}
                          </span>
                  <span className={`text-xs font-medium leading-tight mt-1 block break-words ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{info.desc}</span>
                        </div>
                        <Toggle on={isOn} isHighContrast={isHighContrast} />
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'shop' && isGamified && ( // This is the new "Shop" tab
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* ── 6. THEME SHOP — only in V2 ───────────────────────────────── */}
              <section>
                <SectionLabel isHighContrast={isHighContrast} sub={s.themeShopDesc}>{s.themeShop}</SectionLabel>
                <div className="flex flex-col gap-2">
                  {Object.entries(THEME_CONFIG).map(([themeKey, config]) => {
                    const isUnlocked = unlockedThemes.includes(themeKey);
                    const isSelected = theme === themeKey;
                    const canAfford  = coins >= config.cost;
                    const localName  = s.themes[themeKey] || themeKey;

                    return (
                      <button
                        key={themeKey}
                        onClick={() => handleThemeSelect(themeKey)}
                        disabled={!isUnlocked && !canAfford}
                      aria-pressed={isSelected}
                        className={`flex items-center justify-between ${bigTargets ? 'p-6' : 'p-4'} rounded-2xl border-2 transition-all active:scale-[0.98] ${
                          isSelected
                            ? (isHighContrast ? 'border-white bg-white/20 text-white shadow-sm' : 'border-emerald-400 bg-emerald-50 shadow-sm')
                            : isUnlocked
                              ? (isHighContrast ? 'border-white/50 bg-black text-white hover:border-white/70' : 'border-slate-200 bg-white hover:border-slate-300')
                              : canAfford
                                ? (isHighContrast ? 'border-white/30 bg-black text-white hover:border-white/50' : 'border-amber-200 bg-amber-50 hover:border-amber-300')
                                : (isHighContrast ? 'border-white/20 bg-black opacity-60 text-white' : 'border-slate-100 bg-slate-50 opacity-60')
                        }`}
                      >
                        <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl shadow-sm flex items-center justify-center text-xl border ${isHighContrast ? 'bg-black border-white' : 'bg-white border-slate-100'}`} aria-hidden="true">
                            {config.icon}
                          </div>
                          <span className={`font-black text-sm ${isSelected ? (isHighContrast ? 'text-white' : 'text-emerald-700') : (isHighContrast ? 'text-white' : 'text-slate-700')}`}>
                            {localName}
                          </span>
                        </div>

                        {/* Status badge */}
                        {isSelected ? (
                  <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full tracking-widest ${isHighContrast ? 'bg-white text-black' : 'bg-emerald-400 text-white'}`}>
                            ✓ {s.equipped}
                          </span>
                        ) : isUnlocked ? (
                  <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full tracking-widest ${isHighContrast ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {s.selectTheme}
                          </span>
                        ) : (
                  <span className={`text-xs font-black flex items-center gap-1 px-3 py-1.5 rounded-full ${
                            canAfford ? (isHighContrast ? 'bg-white text-black' : 'bg-amber-400 text-white') : (isHighContrast ? 'bg-white/20 text-white/50' : 'bg-slate-200 text-slate-400')
                          }`}>
                            💰 {config.cost}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Earn coins hint */}
                <p className={`text-[9px] text-center mt-2 font-medium ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>💡 {s.earnCoinHint}</p>
              </section>
    
              <div className={`h-px my-1 ${isHighContrast ? 'bg-white/20' : 'bg-slate-100'}`} />
    
            </div>
          )}

          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;