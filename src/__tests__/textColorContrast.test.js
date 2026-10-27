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

// Tailwind v4 default palette (oklch converted to sRGB), as hex.
const COLORS = {
  white: '#ffffff',
  page: '#fcfbf9', // bg-[#FCFBF9] card surface
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'red-50': '#fef2f2',
  'red-800': '#9f0712',
  'emerald-50': '#ecfdf5',
  'emerald-800': '#006045',
  'emerald-900': '#004f3b',
  'amber-50': '#fffbeb',
  'amber-800': '#973c00',
  'amber-900': '#7b3306',
  'indigo-700': '#432dd7',
  'indigo-800': '#372aac',
  'blue-800': '#193cb8',
  'blue-900': '#1c398e',
  'yellow-200': '#fff085',
  'yellow-400': '#fdc700',
  'yellow-950': '#432004',
  'slate-900': '#0f172b',
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
  [
    'Primary buttons (Intro, LookCoverWrite, Settings, Consent, VisualCat.)',
    'white',
    'emerald-800',
  ],
  ['Primary buttons, hover', 'white', 'emerald-900'],
  ['NewTreeToast', 'white', 'emerald-800'],
  [
    'Indigo buttons (App, Sidebar, Survey, LookCoverWrite, VisualCat.)',
    'white',
    'indigo-700',
  ],
  ['Indigo buttons, hover', 'white', 'indigo-800'],
  ['MemorySpan / VoiceAnswer recording button', 'white', 'red-800'],
  ['IntroScreen selected-tile check mark', 'white', 'amber-800'],
  ['Syllable highlighted letter', 'slate-900', 'yellow-200'],
  [
    'ExerciseToggleManager/VirtualGarden/Settings link text on white',
    'indigo-700',
    'white',
  ],
  ['ExerciseToggleManager link text on page', 'indigo-700', 'page'],
  ['VisualCategorization correct answer on white', 'emerald-800', 'white'],
  ['VisualCategorization correct answer on page', 'emerald-800', 'page'],
  ['Survey error message', 'red-800', 'red-50'],
  ['Survey/ExerciseToggleManager/VisualCat. notice', 'amber-900', 'amber-50'],
  ['VoiceAnswerButton help link', 'blue-800', 'white'],
  ['VoiceAnswerButton help link, hover', 'blue-900', 'white'],
  ['OfflineIndicator', 'yellow-950', 'yellow-400'],
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

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(jsx|tsx)$/.test(name) ? [path] : [];
  });

describe('pale slate text classes are limited to disabled controls', () => {
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

describe('low-contrast color combinations are not reintroduced', () => {
  const FILL =
    /bg-(emerald-600|emerald-700|indigo-500|indigo-600|red-500|red-700|amber-700)(?![\w/-])/;
  const TEXT =
    /(?<![\w:-])text-(yellow-500|indigo-600|emerald-700|red-700|blue-600)(?![\w/-])/;

  it('has no white text on weak fills and no weak colored text classes', () => {
    const offenders = [];
    for (const file of walk(join(import.meta.dirname, '..'))) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/cursor-not-allowed|disabled/.test(line)) return;
          // Toggles/switches carry no text, so a fill alone is fine; only
          // flag it when white text sits in the same class string.
          const whiteOnFill =
            /text-white(?![\w/-])/.test(line) &&
            new RegExp(
              '([\'"`])[^\'"`]*(?:text-white[^\'"`]*' +
                FILL.source +
                '|' +
                FILL.source +
                '[^\'"`]*text-white)',
            ).test(line);
          if (whiteOnFill || TEXT.test(line))
            offenders.push(`${file}:${i + 1}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
