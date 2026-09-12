// WCAG 2.1 color contrast utilities: relative luminance and contrast ratio,
// checked against the AAA thresholds (7:1 normal text, 4.5:1 large text) —
// see checkContrast's callers: contrastCompliance.test.js (a static,
// always-run assertion against the app's real color values) and
// useThemeCSSVariables.js (a dev-only console warning covering colors that
// depend on the active theme/mode at runtime, so can't be checked statically).
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

function hexToRgb(hex) {
  const h = normalizeHex(hex);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// WCAG 2.1 relative luminance (https://www.w3.org/TR/WCAG21/#dfn-relative-luminance).
function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// WCAG 2.1 contrast ratio (https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio).
// Returns a value from 1 (identical colors) to 21 (pure black on white).
function getContrastRatio(hexA, hexB) {
  const lumA = getRelativeLuminance(hexA);
  const lumB = getRelativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

// Exported for contrastCompliance.test.js — a static, always-run assertion
// against the app's actual color values, which is what "enforced" has to
// mean for a check whose live counterpart below only ever runs in dev and
// only ever logs a console warning nobody is required to look at.
export function checkContrast(foreground, background, { largeText = false } = {}) {
  const ratio = getContrastRatio(foreground, background);
  const aaThreshold = largeText ? 3 : 4.5;
  const aaaThreshold = largeText ? 4.5 : 7;
  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= aaThreshold,
    passesAAA: ratio >= aaaThreshold,
    requiredAA: aaThreshold,
    requiredAAA: aaaThreshold,
  };
}

