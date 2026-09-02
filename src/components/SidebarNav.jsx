import { memo, useState, useEffect } from 'react';

import { CognitiveEnergyIndicator } from './CognitiveEnergyIndicator.jsx';
import AccessibleTTS from './common/AccessibleTTS.jsx';
import BionicText from './common/BionicText.jsx';
import Tooltip from './common/Tooltip.jsx';

const PILLAR_ICONS = { Literacy: '📖', Visual: '👁️', Cognitive: '🧩' };

const SidebarNav = memo(function SidebarNav({
  pillars,
  activeTab,
  onTabChange,
  onGardenClick,
  language,
  isGamified,
  theme,
  themeStyles,
  isHighContrast,
  bigTargets,
  setSettingsOpen,
  onOpenSurvey,
  t,
  loadLevel,
  speak,
  noFlash,
  bionicReading = false,
}) {
  const animClass = noFlash
    ? ''
    : 'animate-in fade-in slide-in-from-bottom-12 lg:slide-in-from-bottom-0 lg:slide-in-from-left-12 duration-700 ease-out';

  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    // A BeforeInstallPromptEvent can only be prompted once regardless of
    // outcome — clearing only on 'accepted' left the button visible but
    // dead after a 'dismissed' choice, since the stale event silently no-ops
    // on a second click.
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    // Sidebar/bottom-bar shape switches at `lg:` (1024px) rather than `md:` (768px)
    // so tablets in portrait (e.g. iPad 768–834px wide) keep the compact bottom
    // bar instead of squeezing a full vertical sidebar into a narrow portrait width.
    <aside
      className={`z-40 order-last flex min-h-0 w-full shrink-0 flex-row lg:order-first lg:w-60 lg:flex-col ${animClass} ${isHighContrast ? 'border-t border-white/20 bg-black shadow-sm lg:border-t-0 lg:border-r' : `border-t bg-[#fdfaf6] lg:border-t-0 lg:border-r ${themeStyles.border} shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] lg:shadow-xl lg:shadow-slate-200/50`}`}
    >
      <div
        className={`hidden h-16 shrink-0 items-center gap-2 p-3 lg:flex lg:p-5 ${isHighContrast ? 'border-b border-white/20' : `border-b ${themeStyles.border}`}`}
      >
        <span className="text-2xl drop-shadow-sm" aria-hidden="true">
          🧠
        </span>
        <AccessibleTTS
          text={t('appTitle')}
          speak={speak}
          language={language}
          className="hidden lg:flex"
        >
          <h1
            className={`text-base font-black tracking-tighter ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
          >
            <BionicText text={t('appTitle')} enabled={bionicReading} />
          </h1>
        </AccessibleTTS>
      </div>

      <nav
        className="no-scrollbar flex min-h-0 flex-1 flex-row justify-between gap-1 overflow-x-auto px-2 py-2 lg:flex-col lg:justify-start lg:gap-1.5 lg:overflow-y-auto lg:px-3 lg:py-3"
        aria-label={t('navAria')}
      >
        {pillars.map((p, index) => {
          const isSelected = activeTab === p;
          const label = t('pillars', { returnObjects: true })?.[p] || p;
          return (
            <Tooltip
              key={p}
              content={`${label} — ${t('shortcut') || 'Shortcut'}: Ctrl + ${index + 1}`}
              placement="top"
              isHighContrast={isHighContrast}
              wrapperClass="flex-1 lg:flex-none flex"
            >
              <button
                onClick={() => {
                  speak(label, true);
                  onTabChange(p);
                }}
                className={`group relative flex w-full flex-col items-center justify-center gap-1 lg:flex-row lg:justify-start lg:gap-3 ${bigTargets ? 'p-2 md:p-4 lg:p-5' : 'p-1.5 md:p-2 lg:p-3'} shrink-0 rounded-xl transition-all duration-300 lg:rounded-2xl ${isSelected ? (isHighContrast ? 'z-10 scale-105 bg-white font-black text-black shadow-lg' : `bg-white ${themeStyles.accent} ring-slate-900/5 z-10 scale-[1.02] font-black shadow-md ring-1`) : isHighContrast ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-600 hover:shadow-sm'}`}
                aria-current={isSelected ? 'page' : undefined}
                aria-label={label}
              >
                <span
                  className="text-xl lg:text-xl"
                  aria-hidden="true"
                >
                  {PILLAR_ICONS[p]}
                </span>
                <AccessibleTTS
                  text={label}
                  speak={speak}
                  language={language}
                  className="flex min-w-0 lg:flex"
                  interactive={false}
                >
                  {
                    // Never bionic-split: see BottomNav.jsx's identical
                    // choice for why a short, all-caps nav label doesn't
                    // benefit from the flowing-text bold/regular pattern.
                  }
                  <span className="line-clamp-2 max-w-full wrap-break-word text-[9px] font-bold tracking-wider uppercase lg:text-xs">
                    {label}
                  </span>
                </AccessibleTTS>
                <span
                  className={`ml-auto hidden shrink-0 font-mono text-[10px] font-bold tracking-tighter transition-opacity lg:block ${isSelected ? '' : 'opacity-0 group-hover:opacity-100'}`}
                  aria-hidden="true"
                >
                  ^ {index + 1}
                </span>
              </button>
            </Tooltip>
          );
        })}

        <div
          className={`my-2 hidden border-t lg:block ${isHighContrast ? 'border-white/20' : themeStyles.border}`}
        />
        <div
          className={`my-1 block w-px border-l lg:hidden ${isHighContrast ? 'border-white/20' : themeStyles.border}`}
        />

        {isGamified && (
          <Tooltip
            content={`${t('shortcut') || 'Shortcut'}: Ctrl + 4`}
            placement="top"
            isHighContrast={isHighContrast}
            wrapperClass="flex-1 lg:flex-none flex"
          >
            <button
              onClick={() => {
                speak(t('garden') || 'Garden', true);
                onGardenClick();
              }}
              className={`group relative flex w-full flex-col items-center justify-center gap-1 lg:flex-row lg:justify-start lg:gap-3 ${bigTargets ? 'p-2 md:p-4 lg:p-5' : 'p-1.5 md:p-2 lg:p-3'} shrink-0 rounded-xl transition-all duration-300 lg:rounded-2xl ${activeTab === 'Garden' ? (isHighContrast ? 'z-10 scale-105 bg-white font-black text-black shadow-lg' : `bg-white ${themeStyles.accent} ring-slate-900/5 z-10 scale-[1.02] font-black shadow-md ring-1`) : isHighContrast ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-600 hover:shadow-sm'}`}
              aria-current={activeTab === 'Garden' ? 'page' : undefined}
              aria-label={t('garden') || 'Garden'}
            >
              <span
                className="text-xl lg:text-xl"
                aria-hidden="true"
              >
                {t('levelIcons', { returnObjects: true })?.[theme]?.[0] || '🌱'}
              </span>
              <AccessibleTTS
                text={t('garden') || 'Garden'}
                speak={speak}
                language={language}
                className="flex min-w-0 lg:flex"
                interactive={false}
              >
                <span className="line-clamp-2 max-w-full wrap-break-word text-[9px] font-bold tracking-wider uppercase lg:text-xs">
                  {t('garden') || 'Garden'}
                </span>
              </AccessibleTTS>
              <span
                className={`ml-auto hidden shrink-0 font-mono text-[10px] font-bold tracking-tighter transition-opacity lg:block ${activeTab === 'Garden' ? '' : 'opacity-0 group-hover:opacity-100'}`}
                aria-hidden="true"
              >
                ^ 4
              </span>
            </button>
          </Tooltip>
        )}

        {isGamified && (
          <div
            className={`mt-auto hidden flex-col gap-2 border-t pt-3 lg:flex ${isHighContrast ? 'border-white/20' : themeStyles.border}`}
          >
            <div className="flex items-center justify-between px-2 pt-2">
              <span
                className={`text-[10px] font-bold tracking-wider uppercase ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
              >
                {t('energyTitle') || 'Energy'}
              </span>
              <CognitiveEnergyIndicator
                loadLevel={loadLevel}
                t={t}
                themeStyles={themeStyles}
                isHighContrast={isHighContrast}
                noFlash={noFlash}
                bigTargets={bigTargets}
                bionicReading={bionicReading}
              />
            </div>
          </div>
        )}

        {!isInstalled && installPrompt && (
          <Tooltip
            content={t('installApp') || 'Install App'}
            placement="top"
            isHighContrast={isHighContrast}
            wrapperClass={`flex-1 lg:flex-none flex ${isGamified ? 'mt-2 lg:mt-0' : 'lg:mt-auto'}`}
          >
            <button
              onClick={() => {
                speak(t('installApp') || 'Install App', true);
                handleInstallClick();
              }}
              className={`group flex w-full flex-col items-center justify-center gap-1 lg:flex-row lg:justify-start lg:gap-3 ${bigTargets ? 'p-2 md:p-4 lg:p-5' : 'p-1.5 md:p-2 lg:p-3'} shrink-0 rounded-xl transition-all duration-300 lg:rounded-2xl ${isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-indigo-500 text-white shadow-md hover:bg-indigo-400'}`}
              aria-label={t('installApp') || 'Install App'}
            >
              <span
                className="text-xl lg:text-xl"
                aria-hidden="true"
              >
                📱
              </span>
              <AccessibleTTS
                text={t('installApp') || 'Install App'}
                speak={speak}
                language={language}
                className={`flex min-w-0 lg:flex ${isHighContrast ? 'text-black' : 'text-white'}`}
                interactive={false}
              >
                <span className="line-clamp-2 max-w-full wrap-break-word text-[9px] font-bold tracking-wider uppercase lg:text-xs">
                  {t('installApp') || 'Install App'}
                </span>
              </AccessibleTTS>
            </button>
          </Tooltip>
        )}

        {}
        {/* Lets a user open the feedback survey on their own terms rather
            than only when it auto-appears every 10 points — placed directly
            above Settings, the item it's most often reached for alongside. */}
        <Tooltip
          content={t('surveyAria')}
          placement="top"
          isHighContrast={isHighContrast}
          wrapperClass={`flex-1 lg:flex-none flex ${isGamified || (!isInstalled && installPrompt) ? 'mt-2 lg:mt-0' : 'lg:mt-auto'}`}
        >
          <button
            onClick={() => {
              speak(t('surveyAria'), true);
              onOpenSurvey();
            }}
            className={`group flex w-full flex-col items-center justify-center gap-1 lg:flex-row lg:justify-start lg:gap-3 ${bigTargets ? 'p-2 md:p-4 lg:p-5' : 'p-1.5 md:p-2 lg:p-3'} shrink-0 rounded-xl transition-all duration-300 lg:rounded-2xl ${isHighContrast ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-600 hover:shadow-sm'}`}
            aria-label={t('surveyAria')}
          >
            <span
              className="text-xl lg:text-xl"
              aria-hidden="true"
            >
              📝
            </span>
            <AccessibleTTS
              text={t('surveyAria')}
              speak={speak}
              language={language}
              className="flex min-w-0 lg:flex"
              interactive={false}
            >
              <span className="line-clamp-2 max-w-full wrap-break-word text-[9px] font-bold tracking-wider uppercase lg:text-xs">
                {t('surveyAria')}
              </span>
            </AccessibleTTS>
          </button>
        </Tooltip>

        <Tooltip
          content={`${t('shortcut') || 'Shortcut'}: Ctrl + ,`}
          placement="top"
          isHighContrast={isHighContrast}
          wrapperClass="flex-1 lg:flex-none flex mt-2 lg:mt-0"
        >
          <button
            onClick={() => {
              speak(t('settingsAria'), true);
              setSettingsOpen(true);
            }}
            className={`group flex w-full flex-col items-center justify-center gap-1 lg:flex-row lg:justify-start lg:gap-3 ${bigTargets ? 'p-2 md:p-4 lg:p-5' : 'p-1.5 md:p-2 lg:p-3'} shrink-0 rounded-xl transition-all duration-300 lg:rounded-2xl ${isHighContrast ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-600 hover:shadow-sm'}`}
            aria-label={t('settingsAria')}
          >
            <span
              className="text-xl lg:text-xl"
              aria-hidden="true"
            >
              ⚙️
            </span>
            <AccessibleTTS
              text={t('settingsAria')}
              speak={speak}
              language={language}
              className="flex min-w-0 lg:flex"
              interactive={false}
            >
              <span className="line-clamp-2 max-w-full wrap-break-word text-[9px] font-bold tracking-wider uppercase lg:text-xs">
                {t('settingsAria')}
              </span>
            </AccessibleTTS>
            <span
              className={`ml-auto hidden shrink-0 font-mono text-[10px] font-bold tracking-tighter opacity-0 transition-opacity group-hover:opacity-100 lg:block`}
              aria-hidden="true"
            >
              ^ ,
            </span>
          </button>
        </Tooltip>
      </nav>
    </aside>
  );
});

export default SidebarNav;
