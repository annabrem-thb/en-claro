// Regression guard for the Tailwind text colors the components use on light
// surfaces: every (text, background) pair below was raised to meet the 7:1
// (WCAG AAA, normal text) target of requirement NF1, so reverting one of the
// class swaps back to a paler shade without updating this table is caught
// here rather than by eye. Same approach as contrastCompliance.test.js, but
// for palette utilities that live in component classNames instead of THEMES.
import { describe, expect, it } from 'vitest';

import { checkContrast } from '../utils/contrastChecker.js';

// Tailwind v4 default palette, as hex.
const COLORS = {
  white: '#ffffff',
  page: '#fcfbf9', // bg-[#FCFBF9] card surface
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-600': '#475569',
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
  ['text-slate-600 body/secondary text on white', 'slate-600', 'white'],
  ['text-slate-600 secondary text on the card surface', 'slate-600', 'page'],
  ['IntroScreen selected tile, amber', 'amber-900', 'amber-50'],
  ['IntroScreen selected tile, emerald', 'emerald-800', 'emerald-50'],
  ['App/Survey completion heading', 'emerald-800', 'white'],
  ['Survey slider value', 'indigo-700', 'white'],
];

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
