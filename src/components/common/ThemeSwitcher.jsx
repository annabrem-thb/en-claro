import { THEMES } from '../../data/themes.js';

const THEME_KEYS = Object.keys(THEMES);

// A quick-access theme picker for the main screen (sidebar/bottom nav),
// independent of the gamified Shop tab in Settings — free to use in
// Learning Only mode too, since it's just a visual preference, not a
// gamification reward.
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
}) {
  const dim = bigTargets ? 'h-9 w-9' : 'h-6 w-6';
  const groupProps = standalone
    ? { role: 'group', 'aria-label': t('selectTheme') || 'Select theme' }
    : {};

  return (
    <div {...groupProps} className="flex shrink-0 items-center gap-2">
      {THEME_KEYS.map((key) => {
        const isSelected = theme === key;
        const label = t(`themes.${key}.name`, key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onThemeChange(key)}
            aria-label={label}
            aria-pressed={isSelected}
            className={`${dim} shrink-0 rounded-full transition-transform active:scale-90 ${
              isSelected
                ? `scale-110 ring-2 ring-offset-2 ${isHighContrast ? 'ring-white ring-offset-black' : 'ring-slate-800 ring-offset-white'}`
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{ backgroundColor: THEMES[key].hex }}
          />
        );
      })}
    </div>
  );
}
