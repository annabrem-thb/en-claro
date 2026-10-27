// Statically verifies the app's actual color values meet the spec's 7:1
// (WCAG AAA, normal text) requirement — the thing the dev-only console
// warning in useThemeCSSVariables.js can never itself guarantee, since
// nothing forces anyone to look at a browser console. Reads real values
// (THEMES from App.jsx, the base page colors from index.css) rather than
// hardcoded copies, so a color changed later without updating this test
// still gets caught here instead of drifting silently out of compliance.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { THEMES } from '../data/themes.js';
import { checkContrast } from '../utils/contrastChecker.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(here, '..');
const indexCss = fs.readFileSync(
  path.join(srcRoot, 'styles/index.css'),
  'utf8',
);

// `--x: #hex;` appears twice in index.css for page-bg/page-text/accent-em —
// once under the default :root (light), once under
// `@media (prefers-color-scheme: dark)` (dark), in that document order.
function readCssVarPair(name) {
  const matches = [
    ...indexCss.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`, 'g')),
  ];
  if (matches.length !== 2) {
    throw new Error(
      `expected exactly 2 declarations of --${name} in index.css (light + dark), found ${matches.length}`,
    );
  }
  return { light: matches[0][1], dark: matches[1][1] };
}

const extractHex = (tailwindArbitraryClass) =>
  tailwindArbitraryClass?.match(/\[(.*?)\]/)?.[1];

describe('color pairs meet WCAG AAA (7:1) contrast', () => {
  for (const [name, theme] of Object.entries(THEMES)) {
    const accentHex = extractHex(theme.accent);
    const bgHex = extractHex(theme.bg);
    const buttonHex = extractHex(theme.button);
    const buttonTextHex =
      theme.buttonText === 'text-white' ? '#ffffff' : '#000000';

    it(`${name}: accent text on the theme's background`, () => {
      const { ratio, passesAAA } = checkContrast(accentHex, bgHex);
      expect(passesAAA, `${accentHex} on ${bgHex} is ${ratio}:1`).toBe(true);
    });

    it(`${name}: button text on the theme's button background`, () => {
      const { ratio, passesAAA } = checkContrast(buttonTextHex, buttonHex);
      expect(passesAAA, `${buttonTextHex} on ${buttonHex} is ${ratio}:1`).toBe(
        true,
      );
    });
  }

  const pageColors = readCssVarPair('page-text');
  const pageBg = readCssVarPair('page-bg');
  const accentEm = readCssVarPair('accent-em');

  for (const mode of ['light', 'dark']) {
    it(`base page text on page background (${mode})`, () => {
      const { ratio, passesAAA } = checkContrast(
        pageColors[mode],
        pageBg[mode],
      );
      expect(
        passesAAA,
        `${pageColors[mode]} on ${pageBg[mode]} is ${ratio}:1`,
      ).toBe(true);
    });

    it(`emphasized (em/i) text on page background (${mode})`, () => {
      const { ratio, passesAAA } = checkContrast(accentEm[mode], pageBg[mode]);
      expect(
        passesAAA,
        `${accentEm[mode]} on ${pageBg[mode]} is ${ratio}:1`,
      ).toBe(true);
    });
  }
});

// WCAG 1.4.11 (non-text contrast, 3:1) and 2.4.7 (focus visible): UI
// components and focus indicators against the colors next to them. Tailwind
// v4 default palette hex values; the focus ring is read from index.css like
// the pairs above. Selected/checked controls with white text or glyphs on
// top (amber-800 rating button, amber-700 tile badge) are held to the same
// 3:1 for the glyph, and 7:1 where it is a digit read as text.
describe('non-text and focus colors meet WCAG 1.4.11 (3:1)', () => {
  const NON_TEXT = 3;
  const palette = {
    white: '#ffffff',
    black: '#000000',
    card: '#fcfbf9', // bg-[#FCFBF9]
    'slate-100': '#f1f5f9', // Settings modal surface
    'slate-500': '#64748b',
    'emerald-700': '#047857',
    'indigo-600': '#4f46e5',
    'amber-50': '#fffbeb',
    'amber-700': '#b45309',
    'amber-800': '#92400e',
    'red-700': '#b91c1c',
    // text-white/60 and border-white over a black high-contrast surface
    'white/60 on black': '#999999',
  };

  const focusRing = readCssVarPair('focus-ring');
  const pageBg = readCssVarPair('page-bg');
  for (const mode of ['light', 'dark']) {
    it(`global focus ring on page background (${mode})`, () => {
      const { ratio } = checkContrast(focusRing[mode], pageBg[mode]);
      expect(
        ratio,
        `${focusRing[mode]} on ${pageBg[mode]}`,
      ).toBeGreaterThanOrEqual(NON_TEXT);
    });
  }

  // [what, foreground, background, minimum ratio]
  const PAIRS = [
    ['local focus ring (indigo-600) on white', 'indigo-600', 'white', 3],
    ['error focus ring (red-700) on white', 'red-700', 'white', 3],
    ['switch off track on the card surface', 'slate-500', 'card', 3],
    ['switch off track on the settings modal', 'slate-500', 'slate-100', 3],
    ['switch on track on the card surface', 'emerald-700', 'card', 3],
    ['switch on track on the settings modal', 'emerald-700', 'slate-100', 3],
    ['switch knob on the off track', 'white', 'slate-500', 3],
    ['switch knob on the on track', 'white', 'emerald-700', 3],
    [
      'high-contrast switch off track on black',
      'white/60 on black',
      'black',
      3,
    ],
    ['selected intro tile border on its fill', 'amber-700', 'amber-50', 3],
    ['intro tile check mark on its badge', 'white', 'amber-700', 3],
    ['unselected radio border on the card surface', 'slate-500', 'card', 3],
    ['checked radio fill on the card surface', 'indigo-600', 'card', 3],
    ['NASA slider track border on the card surface', 'slate-500', 'card', 3],
    [
      'unselected rating button border on the card surface',
      'slate-500',
      'card',
      3,
    ],
    [
      'selected rating button digit (white on amber-800)',
      'white',
      'amber-800',
      7,
    ],
  ];

  for (const [label, fg, bg, min] of PAIRS) {
    it(`${label} is at least ${min}:1`, () => {
      const { ratio } = checkContrast(palette[fg], palette[bg]);
      expect(ratio, `${palette[fg]} on ${palette[bg]}`).toBeGreaterThanOrEqual(
        min,
      );
    });
  }
});
