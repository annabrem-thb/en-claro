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
  const matches = [...indexCss.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`, 'g'))];
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
    const buttonTextHex = theme.buttonText === 'text-white' ? '#ffffff' : '#000000';

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
      expect(passesAAA, `${accentEm[mode]} on ${pageBg[mode]} is ${ratio}:1`).toBe(
        true,
      );
    });
  }
});
