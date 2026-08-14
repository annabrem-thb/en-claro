// WCAG 2.1 color contrast utilities: relative luminance, contrast ratio,
// and a dev-only console-warning helper for validating live CSS custom
// properties (this app's `--theme-bg`, `--accent-em`, `--page-text`, etc. —
// see src/styles/index.css and App.jsx's per-theme `hex`/`bg` values) against
// the WCAG AA thresholds (4.5:1 normal text, 3:1 large text).
//
// Plain JS, not TypeScript: the rest of this codebase is .jsx/.js (only a
// couple of isolated files use .ts/.tsx), so this matches the project's
// actual convention rather than introducing a one-off TS file.

// Expands `#abc` to `#aabbcc` and validates length; strips a leading `#`.
function normalizeHex(hex) {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`contrastChecker: "${hex}" is not a valid hex color`);
  }
  return h;
}

export function hexToRgb(hex) {
  const h = normalizeHex(hex);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// WCAG 2.1 relative luminance (https://www.w3.org/TR/WCAG21/#dfn-relative-luminance).
export function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// WCAG 2.1 contrast ratio (https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio).
// Returns a value from 1 (identical colors) to 21 (pure black on white).
export function getContrastRatio(hexA, hexB) {
  const lumA = getRelativeLuminance(hexA);
  const lumB = getRelativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

// "Large text" per WCAG: >=18pt (24px), or >=14pt (18.66px) bold.
export function isLargeText(fontSizePx, fontWeight = 400) {
  const isBold = fontWeight >= 700 || fontWeight === 'bold';
  return fontSizePx >= 24 || (isBold && fontSizePx >= 18.66);
}

export function checkContrast(
  foreground,
  background,
  { largeText = false } = {},
) {
  const ratio = getContrastRatio(foreground, background);
  const aaThreshold = largeText ? 3 : 4.5;
  const aaaThreshold = largeText ? 4.5 : 7;
  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= aaThreshold,
    passesAAA: ratio >= aaaThreshold,
    requiredAA: aaThreshold,
  };
}

// Dev-only console warning. `label` identifies the pairing in the warning
// (e.g. "Start button (bg-emerald-500 / text-white)") so a failure is
// actionable without having to reverse-engineer which UI element it was.
export function warnIfInsufficientContrast(
  label,
  foreground,
  background,
  options = {},
) {
  if (import.meta.env?.PROD) return;
  const { ratio, passesAA, requiredAA } = checkContrast(
    foreground,
    background,
    options,
  );
  if (!passesAA) {
    console.warn(
      `[contrastChecker] "${label}": ${foreground} on ${background} is ${ratio}:1, ` +
        `below the required ${requiredAA}:1 (${options.largeText ? 'large' : 'normal'} text).`,
    );
  }
  return { ratio, passesAA };
}

// Resolves a CSS custom property's *live, currently-applied* value (e.g.
// `--theme-bg`) from a given element (defaults to <html>, where this app's
// theme variables are set — see useThemeCSSVariables.js / index.css) and
// checks it against another color. This is the "dynamic" half of the
// requirement: static hex literals in source can be checked with
// `checkContrast` directly, but a CSS variable's actual value depends on
// which theme/mode is active at runtime, so it has to be read from the DOM.
export function warnIfCssVarContrastInsufficient(
  label,
  {
    foregroundVar,
    backgroundVar,
    element = document.documentElement,
    ...options
  },
) {
  if (import.meta.env?.PROD) return;
  const styles = getComputedStyle(element);
  const foreground = styles.getPropertyValue(foregroundVar).trim();
  const background = styles.getPropertyValue(backgroundVar).trim();
  if (!foreground || !background) {
    console.warn(
      `[contrastChecker] "${label}": could not resolve ${foregroundVar} and/or ${backgroundVar} on the given element.`,
    );
    return null;
  }
  try {
    return warnIfInsufficientContrast(label, foreground, background, options);
  } catch (err) {
    // CSS custom properties can hold non-hex values (rgb(), oklch(), a
    // theme's Tailwind class-based color, etc.) that this hex-only checker
    // can't parse — fail loudly in dev rather than silently skipping.
    console.warn(
      `[contrastChecker] "${label}": ${err.message} (only hex colors are supported; ` +
        `${foregroundVar}="${foreground}", ${backgroundVar}="${background}")`,
    );
    return null;
  }
}
