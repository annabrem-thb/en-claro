import { memo } from 'react';

const PILLAR_ICONS = { Literacy: '📖', Visual: '👁️', Cognitive: '🧩' };

// One button shape shared by every entry (pillars, Garden, Settings)
// instead of near-identical inline JSX blocks that could
// silently drift apart — e.g. one gaining a badge dot or aria-current
// treatment the others don't. `activeGlow` and `badge` opt individual
// entries into the pillar-only affordances (the high-contrast icon glow,
// the daily-quest-in-progress dot).
function NavButton({
  onClick,
  isActive,
  isHighContrast,
  themeStyles,
  noFlash,
  bigTargets = false,
  activeGlow = false,
  icon,
  label,
  ariaLabel = label,
  badge = false,
  disabled = false,
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      // `min-h-14` (56px) mirrors SidebarNav/the exercise Skip button's own
      // bigTargets sizing (WCAG 2.5.5/2.5.8 target size) — without it, this
      // bar's per-button width is only whatever `flex-1` divides the
      // viewport into, which happily satisfies 56px on a typical phone but
      // isn't guaranteed to (narrow devices, 5 items when Garden is shown).
      className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl transition-all duration-300 active:scale-95 ${bigTargets ? 'min-h-14 p-3' : 'p-2'} ${disabled && !isActive ? 'cursor-not-allowed opacity-40' : ''} ${
        isActive
          ? isHighContrast
            ? 'bg-white/20 font-black text-white shadow-sm'
            : `bg-slate-50 ${themeStyles.accent} font-black shadow-sm ring-1 ring-slate-900/5`
          : isHighContrast
            ? 'text-white/50 hover:text-white/80'
            : 'text-slate-600 hover:bg-slate-50/50 hover:text-slate-600'
      }`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={ariaLabel}
    >
      <div
        className={`mb-1 text-2xl ${isActive && !noFlash ? 'animate-bounce' : ''} ${isActive && activeGlow && isHighContrast ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}
        aria-hidden="true"
      >
        {icon}
      </div>
      {}
      {/* Wraps onto a second line instead of a previous approach that
          either truncated to one line or hid the label outright once the
          user's UI text-size setting pushed it past a single line's width
          — both left the button's meaning readable only from its icon.
          `line-clamp-2` still caps runaway length (e.g. German compounds)
          with an ellipsis rather than growing the bar unboundedly. */}
      {
        // Never bionic-split: the bold/regular half-word pattern is meant
        // to anchor the eye while reading flowing sentences, but on a
        // short, single/two-word nav tag it just reads as an arbitrary
        // bold pattern — worse once `hideNavLabel`'s removal (above) made
        // these regularly two lines of tracking-wide text.
      }
      <span className="line-clamp-2 max-w-full text-center text-[10px] leading-tight wrap-break-word">
        {label}
      </span>
      {badge && (
        <span
          className={`absolute top-1 right-2 h-2.5 w-2.5 border-2 bg-blue-500 ${isHighContrast ? 'border-black' : 'border-white'} rounded-full`}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

// The mobile bottom tab bar (hidden at the `lg` breakpoint, where
// SidebarNav takes over). Pure props-in/callbacks-out: it owns no state of
// its own, so it re-renders only when something it actually displays
// changes, and `memo` lets React skip it entirely on the frequent
// exercise-session re-renders (streak/points ticking) that don't touch any
// prop here.
function BottomNavComponent({
  pillars,
  activeTab,
  isGamified,
  theme,
  themeStyles,
  isHighContrast,
  noFlash,
  bigTargets = false,
  t,
  onTabChange,
  onGardenClick,
  onOpenSettings,
  onOpenSurvey,
  vibrate,
  // Non-null while a guided study block is running — see SidebarNav.jsx's
  // identical prop for why switching away from this pillar is disabled for
  // its duration (Garden and the current pillar itself stay reachable).
  lockedToPillar = null,
  studyProgressLabel = null,
}) {
  const gardenIcon =
    t('levelIcons', { returnObjects: true })?.[theme]?.[0] || '🌱';
  const pillarsLocked = !!lockedToPillar;

  return (
    <div className="shrink-0 lg:hidden">
      {studyProgressLabel && (
        <p
          className={`px-2 py-1 text-center text-[10px] font-bold tracking-wide uppercase ${isHighContrast ? 'bg-black text-white/70' : 'bg-white text-slate-500'}`}
        >
          {studyProgressLabel}
        </p>
      )}
      <nav
        className={`z-40 flex items-center justify-around border-t px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-colors ${isHighContrast ? 'border-white/20 bg-black' : 'border-slate-100 bg-white'}`}
        aria-label={t('navAria') || 'Main Navigation'}
      >
        {pillars.map((pillar) => {
          const label =
            t('pillars', { returnObjects: true })?.[pillar] || pillar;
          return (
            <NavButton
              key={pillar}
              onClick={() => {
                vibrate(15);
                onTabChange(pillar);
              }}
              disabled={pillarsLocked && pillar !== lockedToPillar}
              isActive={activeTab === pillar}
              isHighContrast={isHighContrast}
              themeStyles={themeStyles}
              noFlash={noFlash}
              bigTargets={bigTargets}
              activeGlow
              icon={PILLAR_ICONS[pillar]}
              label={label}
            />
          );
        })}

        {isGamified && (
          <NavButton
            onClick={() => {
              vibrate(15);
              onGardenClick();
            }}
            isActive={activeTab === 'Garden'}
            isHighContrast={isHighContrast}
            themeStyles={themeStyles}
            noFlash={noFlash}
            bigTargets={bigTargets}
            icon={gardenIcon}
            label={t('garden') || 'Garden'}
          />
        )}

        {!pillarsLocked && (
          <NavButton
            onClick={() => {
              vibrate(15);
              onOpenSurvey();
            }}
            isHighContrast={isHighContrast}
            themeStyles={themeStyles}
            bigTargets={bigTargets}
            icon="📝"
            label={t('surveyAria') || 'Survey'}
          />
        )}

        <NavButton
          onClick={() => {
            vibrate(15);
            onOpenSettings();
          }}
          isHighContrast={isHighContrast}
          themeStyles={themeStyles}
          bigTargets={bigTargets}
          icon="⚙️"
          label={t('settings') || 'Settings'}
          ariaLabel={t('settingsAria') || 'Settings'}
        />
      </nav>
    </div>
  );
}

export default memo(BottomNavComponent);
