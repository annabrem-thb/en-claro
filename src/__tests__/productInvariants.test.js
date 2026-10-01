// Acceptance tests for a handful of product invariants that are easy to
// silently regress: praise strings drifting back toward exclamation marks
// or emoji, the gamification setting leaking into session flow control, a
// stray special-purpose font coming back, a design token going missing, or
// the gamification state growing extra counters again. Do not "fix" a
// failure here by loosening the assertion — fix the source it's checking
// instead.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useGamificationState } from '../hooks/useGamificationState.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(here, '..');
const repoRoot = path.resolve(srcRoot, '..');
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

describe('ab_study_submissions schema matches buildDbData', () => {
  // netlify/functions/submit-survey has its own package.json ("type":
  // "commonjs") and its own node_modules — same reason
  // netlify/functions/submit-survey/index.test.js loads it via Node's
  // native `require` rather than an ESM `import`.
  const require = createRequire(import.meta.url);
  const { buildDbData } = require(
    path.join(
      repoRoot,
      'netlify/functions/submit-survey/index.js',
    ),
  );

  // Every column the CREATE TABLE statement declares, in the order they're
  // declared — CHECK(...) clauses are stripped first since they can contain
  // their own commas (e.g. a value list), which would otherwise be
  // misread as extra column boundaries. read() above is scoped to srcRoot,
  // but the schema file lives at the repo root, so it's read directly here.
  const schemaSource = fs.readFileSync(
    path.join(repoRoot, 'supabase/00_survey_schema.sql'),
    'utf8',
  );
  const tableMatch = schemaSource.match(
    /CREATE TABLE IF NOT EXISTS public\.ab_study_submissions \(([\s\S]*?)\n\);/,
  );
  if (!tableMatch) {
    throw new Error(
      'Could not find the ab_study_submissions CREATE TABLE statement in supabase/00_survey_schema.sql',
    );
  }
  const columnsBody = tableMatch[1]
    .replace(/--.*$/gm, '')
    .replace(/CHECK\s*\([^()]*(?:\([^()]*\)[^()]*)*\)/gi, '');
  const schemaColumns = columnsBody
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.split(/\s+/)[0]);

  // id/created_at are generated by Postgres (uuid_generate_v4()/NOW()) —
  // buildDbData never sets either, by design.
  const DB_GENERATED_COLUMNS = ['id', 'created_at'];

  it('parsed at least the columns this test itself already expects', () => {
    // A sanity check on the parser above, so a future schema-file rewrite
    // that silently breaks the regex fails loudly here instead of just
    // making the real assertion below vacuously pass with an empty list.
    expect(schemaColumns.length).toBeGreaterThan(20);
    expect(schemaColumns).toContain('app_version');
    expect(schemaColumns).toContain('questionnaire_version');
  });

  it('every schema column (except the DB-generated id/created_at) is produced by buildDbData', () => {
    // A representative, fully-populated payload — block: 2 + isGamified-
    // only fields both included, since buildDbData always assigns every
    // key it defines regardless of their value (undefined/null included),
    // so one call surfaces the complete key set it ever produces.
    const payload = {
      questionnaireVersion: 'v2',
      consentGiven: true,
      appVersion: 'vollversion',
      variantOrder: 'classicFirst',
      block: 2,
      mentalDemand: 50,
      physicalDemand: 50,
      temporalDemand: 50,
      performance: 50,
      effort: 50,
      frustration: 50,
      sus01: 3,
      sus02: 3,
      sus03: 3,
      sus04: 3,
      sus05: 3,
      sus06: 3,
      sus07: 3,
      sus08: 3,
      sus09: 3,
      sus10: 3,
      ueq01: 4,
      ueq02: 4,
      ueq03: 4,
      ueq04: 4,
      ueq05: 4,
      ueq06: 4,
      ueq07: 4,
      ueq08: 4,
      gardenMotivation: 3,
      badgeMotivation: 3,
      gameDistraction: 3,
      gameElementFeedback: 'x',
      lrsStatus: 'no',
      sltRole: 'no',
      ageGroup: '30-49',
      firstLanguage: ['de'],
      participantId: 'x',
      userLanguage: 'de',
      theme: 'Natur',
      a11yAddons: [],
      inclusiveOptions: {},
      userDifficulty: 2,
      dailyGoal: 5,
      localTimestamp: '2026-01-01T00:00:00.000Z',
    };

    const dbDataKeys = Object.keys(buildDbData(payload));
    const expectedColumns = schemaColumns.filter(
      (c) => !DB_GENERATED_COLUMNS.includes(c),
    );

    const missingFromBuildDbData = expectedColumns.filter(
      (c) => !dbDataKeys.includes(c),
    );
    const extraInBuildDbData = dbDataKeys.filter(
      (k) => !expectedColumns.includes(k),
    );

    expect(
      missingFromBuildDbData,
      'columns declared in supabase/00_survey_schema.sql but never written by buildDbData',
    ).toEqual([]);
    expect(
      extraInBuildDbData,
      'keys written by buildDbData that have no matching column in supabase/00_survey_schema.sql',
    ).toEqual([]);
  });
});
