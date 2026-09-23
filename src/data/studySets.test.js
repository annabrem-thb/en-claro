import { describe, expect, it } from 'vitest';

import {
  PILLAR_SEQUENCE,
  TASKS_PER_PILLAR,
  isBlockGamified,
} from '../hooks/useStudyModeState.js';

import { STUDY_PLAN_EXERCISE_PILLARS } from './exerciseTypes.js';
import { belongsToActiveSet, studySetForBlock } from './studySets.js';
import { wordDatabaseDE } from './vocabulary_de.js';
import { wordDatabaseEN } from './vocabulary_en.js';
import { wordDatabasePL } from './vocabulary_pl.js';

describe('belongsToActiveSet', () => {
  it('includes everything when no set is active', () => {
    expect(belongsToActiveSet({ id: 1 }, null)).toBe(true);
    expect(belongsToActiveSet({ id: 1, set: 'A' }, null)).toBe(true);
  });

  it('includes unassigned tasks regardless of the active set', () => {
    expect(belongsToActiveSet({ id: 1 }, 'A')).toBe(true);
    expect(belongsToActiveSet({ id: 1 }, 'B')).toBe(true);
  });

  it('includes a task only when its set matches the active set', () => {
    expect(belongsToActiveSet({ id: 1, set: 'A' }, 'A')).toBe(true);
    expect(belongsToActiveSet({ id: 1, set: 'A' }, 'B')).toBe(false);
    expect(belongsToActiveSet({ id: 1, set: 'B' }, 'A')).toBe(false);
  });
});

describe('studySetForBlock', () => {
  it('gives block 1 Set A and block 2 Set B', () => {
    expect(studySetForBlock(1)).toBe('A');
    expect(studySetForBlock(2)).toBe('B');
  });

  it('pairs each set with each condition equally often across the two start orders', () => {
    const pairs = [];
    for (const variantOrder of ['classicFirst', 'gamifiedFirst']) {
      for (const block of [1, 2]) {
        const condition = isBlockGamified(variantOrder, block)
          ? 'gamified'
          : 'classic';
        pairs.push(`${condition}+${studySetForBlock(block)}`);
      }
    }
    expect(pairs.sort()).toEqual([
      'classic+A',
      'classic+B',
      'gamified+A',
      'gamified+B',
    ]);
  });

  it('gives every participant both sets and both conditions', () => {
    for (const variantOrder of ['classicFirst', 'gamifiedFirst']) {
      const conditions = [1, 2].map((block) =>
        isBlockGamified(variantOrder, block),
      );
      expect(new Set(conditions).size).toBe(2);
      expect(new Set([1, 2].map(studySetForBlock)).size).toBe(2);
    }
  });
});

// The guided study assigns each participant a fixed exercise-type plan, then
// runs block 1 on Set A and block 2 on Set B with that same plan. A type
// missing from one set at the study difficulty would silently drop out of
// that block, leaving it short of its required task count.
describe('study exercise plan is servable from both content sets', () => {
  // Matches getDefaultSettings().userDifficulty in useUserSettings.js — the
  // difficulty the guided study runs at, since adaptive difficulty is off.
  const STUDY_DIFFICULTY = 2;
  const databases = {
    de: wordDatabaseDE,
    en: wordDatabaseEN,
    pl: wordDatabasePL,
  };

  for (const [pillar, types] of Object.entries(STUDY_PLAN_EXERCISE_PILLARS)) {
    it(`${pillar}: enough types to fill a block`, () => {
      expect(types.length).toBeGreaterThanOrEqual(TASKS_PER_PILLAR[pillar]);
    });

    for (const type of types) {
      for (const [lang, db] of Object.entries(databases)) {
        for (const set of ['A', 'B']) {
          it(`${lang}/${pillar}/${type} has a Set ${set} item at difficulty ${STUDY_DIFFICULTY}`, () => {
            const items = (db[type] || []).filter(
              (item) =>
                item.set === set &&
                (item.difficulty || 1) === STUDY_DIFFICULTY,
            );
            expect(items.length).toBeGreaterThan(0);
          });
        }
      }
    }
  }

  it('covers every pillar in the fixed study sequence', () => {
    expect(Object.keys(STUDY_PLAN_EXERCISE_PILLARS).sort()).toEqual(
      [...PILLAR_SEQUENCE].sort(),
    );
  });
});
