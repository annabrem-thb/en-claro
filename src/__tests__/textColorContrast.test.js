// Regression guard for the Tailwind text colors the components use on light
// surfaces: every (text, background) pair below was raised to meet the 7:1
// (WCAG AAA, normal text) target of requirement NF1, so reverting one of the
// class swaps back to a paler shade without updating this table is caught
// here rather than by eye. Same approach as contrastCompliance.test.js, but
// for palette utilities that live in component classNames instead of THEMES.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { THEMES } from '../data/themes.js';
import { checkContrast } from '../utils/contrastChecker.js';

// Tailwind v4 default palette, as hex.
const COLORS = {
  white: '#ffffff',
  page: '#fcfbf9', // bg-[#FCFBF9] card surface
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'red-800': '#991b1b',
  'emerald-50': '#ecfdf5',
  'emerald-800': '#065f46',
  'amber-50': '#fffbeb',
  'amber-900': '#78350f',
  'indigo-700': '#4338ca',
};

// [where it is used, text color, background]
const PAIRS = [
  ['Syllable/RhythmMemory undo hover', 'red-800', 'white'],
  ['VisualCategorization struck-through wrong word', 'red-800', 'white'],
  ['VirtualGarden "copied" status', 'emerald-800', 'page'],
  ['ExerciseContainer error message', 'red-800', 'page'],
  ['text-slate-700 body/secondary text on white', 'slate-700', 'white'],
  ['text-slate-700 secondary text on the card surface', 'slate-700', 'page'],
  ['SettingsModal equipped theme button', 'slate-800', 'slate-200'],
  ['IntroScreen selected tile, amber', 'amber-900', 'amber-50'],
  ['IntroScreen selected tile, emerald', 'emerald-800', 'emerald-50'],
  ['App/Survey completion heading', 'emerald-800', 'white'],
  ['Survey slider value', 'indigo-700', 'white'],
];

// Every theme background, so a newly added theme is checked automatically.
const THEME_BACKGROUNDS = Object.entries(THEMES).map(([key, theme]) => {
  const hex = /bg-\[(#[0-9a-fA-F]{6})\]/.exec(theme.bg)?.[1];
  return [key, hex];
});

describe('component text colors meet 7:1 on their surfaces', () => {
  for (const [label, text, bg] of PAIRS) {
    it(`${label} (${text} on ${bg})`, () => {
      const { ratio, passesAAA } = checkContrast(COLORS[text], COLORS[bg]);
      expect(passesAAA, `${COLORS[text]} on ${COLORS[bg]} is ${ratio}:1`).toBe(
        true,
      );
    });
  }
});

describe('text-slate-700 meets 7:1 on every theme background', () => {
  for (const [key, hex] of THEME_BACKGROUNDS) {
    it(`theme "${key}" (${hex})`, () => {
      expect(hex, `no bg-[#...] class in THEMES.${key}.bg`).toBeTruthy();
      const { ratio, passesAAA } = checkContrast(COLORS['slate-700'], hex);
      expect(passesAAA, `${COLORS['slate-700']} on ${hex} is ${ratio}:1`).toBe(
        true,
      );
    });
  }
});

describe('pale slate text classes are limited to disabled controls', () => {
  const walk = (dir) =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return walk(path);
      return /\.(jsx|tsx)$/.test(name) ? [path] : [];
    });

  it('has no text-slate-600 / text-slate-500 outside disabled lines', () => {
    const offenders = [];
    for (const file of walk(join(import.meta.dirname, '..'))) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (
            /text-slate-(500|600)/.test(line) &&
            !/cursor-not-allowed|disabled/.test(line)
          ) {
            offenders.push(`${file}:${i + 1}`);
          }
        });
    }
    expect(offenders).toEqual([]);
  });
});
