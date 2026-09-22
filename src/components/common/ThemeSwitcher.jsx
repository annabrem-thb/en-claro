import { THEMES } from '../../data/themes.js';

const THEME_KEYS = Object.keys(THEMES);

// A quick-access theme picker for the main screen (sidebar/bottom nav),
// independent of the gamified Shop tab in Settings — free to use in
// Learning Only mode too, since it's just a visual preference, not a
// gamification reward.
//
// Each option carries its own visible name, not just its themed emoji — an
// icon alone doesn't tell a user what they're choosing, so the button's own
// text is what supplies its accessible name too (no separate aria-label
// needed); the emoji itself stays aria-hidden.
export default function ThemeSwitcher({
  theme,
  onThemeChange,
  isHighContrast,
  bigTargets = false,
  t,
  // False when a parent <fieldset>/<legend> already announces "Select
  // theme" as the group's accessible name (IntroScreen) — an inner
  // role="group" here would just repeat that same name on a second,
  // nested group for screen-reader users.
  standalone = true,
  // Id of a visible caption rendered by the caller just above this picker
  // (SidebarNav/BottomNav's "Select theme" heading) — wired up as
  // aria-labelledby instead of a second, invisible aria-label with the
  // same text, so the group's accessible name comes from the text that's
  // actually on screen rather than a duplicate copy of it.
  labelId,
}) {
  const groupProps = labelId
    ? { role: 'group', 'aria-labelledby': labelId }
    : standalone
      ? { role: 'group', 'aria-label': t('selectTheme') || 'Select theme' }
      : {};
  const iconSize = bigTargets ? 'text-xl' : 'text-base';
  const pad = bigTargets ? 'px-2 py-1.5' : 'px-1.5 py-1';
  const textSize = bigTargets ? 'text-[10px]' : 'text-[8px]';

  return (
    <div
      {...groupProps}
      className="flex w-full flex-wrap items-start justify-center gap-1"
    >
      {THEME_KEYS.map((key) => {
        const isSelected = theme === key;
        const label = t(`themes.${key}.name`, key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onThemeChange(key)}
            aria-pressed={isSelected}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-lg transition-all active:scale-95 ${pad} ${
              isSelected
                ? isHighContrast
                  ? 'bg-white/20'
                  : 'bg-slate-100'
                : isHighContrast
                  ? 'hover:bg-white/10'
                  : 'hover:bg-slate-50'
            }`}
          >
            <span
              aria-hidden="true"
              className={`${iconSize} flex shrink-0 items-center justify-center leading-none ${
                isSelected
                  ? 'drop-shadow-sm'
                  : 'opacity-60 grayscale-40'
              }`}
            >
              {THEMES[key].icon}
            </span>
            <span
              className={`${textSize} leading-none font-bold tracking-wide uppercase ${
                isSelected
                  ? isHighContrast
                    ? 'text-white'
                    : 'text-slate-700'
                  : isHighContrast
                    ? 'text-white/60'
                    : 'text-slate-500'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
