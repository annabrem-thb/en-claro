// Acceptance tests for a handful of product invariants that are easy to
// silently regress: praise strings drifting back toward exclamation marks
// or emoji, the gamification setting leaking into session flow control, a
// stray special-purpose font coming back, a design token going missing, or
// the gamification state growing extra counters again. Do not "fix" a
// failure here by loosening the assertion — fix the source it's checking
// instead.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useGamificationState } from '../hooks/useGamificationState.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(here, '..');
const read = (relPath) => fs.readFileSync(path.join(srcRoot, relPath), 'utf8');

// Matches any character outside the Basic Multilingual Plane's common
// ranges that Unicode assigns an Emoji property to (pictographs, dingbats,
// transport symbols, flags, skin-tone/ZWJ modifiers, etc.).
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

describe('feedback strings stay free of exclamation marks and emoji', () => {
  const translation = JSON.parse(read('locales/de/translation.json'));
  const feedback = JSON.parse(read('locales/de/feedback.json'));

  // Keys that carry user-facing praise/feedback copy, per source file.
  // Nested paths are looked up dot-by-dot. Exercise-answer feedback
  // (correct/incorrect) lives in feedback.json, not translation.json — it's
  // merged into i18next's single "feedback" namespace object alongside the
  // end-of-session survey strings (see src/locales/de.js), so `t('feedback.
  // correct')` resolves there, not to a "feedback" key inside
  // translation.json (which would in fact be silently overwritten by that
  // merge — the two must never both define a top-level "feedback" key).
  const CHECKED = [
    { file: 'locales/de/translation.json', data: translation, keys: [
      'realWorldImpact.newTreeTitle',
      'realWorldImpact.newTreeMsg',
      'voice.success',
      'voice.error',
    ] },
    { file: 'locales/de/feedback.json', data: feedback, keys: [
      'correct',
      'correctWithRule',
      'incorrect',
      'incorrectWithRule',
    ] },
  ];

  const resolve = (obj, dottedKey) =>
    dottedKey.split('.').reduce((node, key) => node?.[key], obj);

  // Flattens whatever shape a resolved value has (string, array, or a
  // nested object of strings/arrays) into a flat string list.
  const flattenStrings = (value) => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(flattenStrings);
    if (value && typeof value === 'object')
      return Object.values(value).flatMap(flattenStrings);
    return [];
  };

  for (const { file, data, keys } of CHECKED) {
    for (const key of keys) {
      it(`${file} "${key}" has no "!" and no emoji`, () => {
        const value = resolve(data, key);
        expect(value, `expected "${key}" to exist in ${file}`).toBeDefined();
        const strings = flattenStrings(value);
        expect(strings.length).toBeGreaterThan(0);
        for (const s of strings) {
          expect(
            s.includes('!'),
            `"${key}" contains "!": ${JSON.stringify(s)}`,
          ).toBe(false);
          expect(
            EMOJI_PATTERN.test(s),
            `"${key}" contains an emoji: ${JSON.stringify(s)}`,
          ).toBe(false);
        }
      });
    }
  }
});

describe('isGamified affects only rendering, never session flow', () => {
  it('useExerciseSession.js never references isGamified', () => {
    const source = read('hooks/useExerciseSession.js');
    expect(source.includes('isGamified')).toBe(false);
  });
});

describe('no special-purpose typeface is bundled', () => {
  it('no stylesheet under src/styles declares an OpenDyslexic @font-face', () => {
    const stylesDir = path.join(srcRoot, 'styles');
    for (const file of fs.readdirSync(stylesDir)) {
      if (!file.endsWith('.css')) continue;
      const source = fs.readFileSync(path.join(stylesDir, file), 'utf8');
      expect(/OpenDyslexic/i.test(source), `${file} mentions OpenDyslexic`).toBe(
        false,
      );
    }
  });
});

describe('required design tokens are present', () => {
  const REQUIRED_TOKENS = [
    '--font-size-exercise',
    '--font-size-ui',
    '--line-height',
    '--letter-spacing',
    '--word-spacing',
    '--paragraph-spacing',
    '--measure',
  ];

  const source = read('styles/index.css');

  for (const token of REQUIRED_TOKENS) {
    it(`index.css declares ${token}`, () => {
      expect(source.includes(`${token}:`)).toBe(true);
    });
  }
});

describe('gamification state is a single monotonic value', () => {
  it('useGamificationState exposes exactly one numeric field', () => {
    const { result } = renderHook(() => useGamificationState());
    const numericFields = Object.entries(result.current).filter(
      ([, value]) => typeof value === 'number',
    );
    expect(
      numericFields.map(([key]) => key),
      'expected exactly one numeric progress field (e.g. growthValue)',
    ).toHaveLength(1);
  });
});
