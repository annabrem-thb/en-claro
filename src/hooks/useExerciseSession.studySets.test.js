import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { STUDY_PLAN_EXERCISE_PILLARS } from '../data/exerciseTypes.js';
import { wordDatabaseDE } from '../data/vocabulary_de.js';
import { wordDatabaseEN } from '../data/vocabulary_en.js';
import { wordDatabasePL } from '../data/vocabulary_pl.js';

import { useExerciseSession } from './useExerciseSession.js';
import { PILLAR_SEQUENCE, TASKS_PER_PILLAR } from './useStudyModeState.js';

const noop = () => {};

function blockTasks({ db, language, pillar, studySet, plan }) {
  const { result } = renderHook(() =>
    useExerciseSession({
      db,
      activeTab: pillar,
      language,
      userDifficulty: 2,
      setUserDifficulty: noop,
      inclusiveOptions: { adaptiveDifficulty: false, activeExercises: {} },
      t: (key) => key,
      speak: noop,
      theme: 'Natur',
      studySet,
      growthValue: 0,
      setGrowthValue: noop,
      setErrorTimestamps: noop,
      studyExerciseTypes: plan,
    }),
  );
  return result.current.activePillarTasks.slice(0, TASKS_PER_PILLAR[pillar]);
}

describe('guided-study blocks draw different items from the same exercise plan', () => {
  const databases = {
    de: wordDatabaseDE,
    en: wordDatabaseEN,
    pl: wordDatabasePL,
  };

  for (const [language, db] of Object.entries(databases)) {
    for (const pillar of PILLAR_SEQUENCE) {
      it(`${language}/${pillar}: block 1 (Set A) and block 2 (Set B) share types but no items`, () => {
        // The plan a participant would get: the first TASKS_PER_PILLAR types
        // of the study-eligible pool (any choice from it must work).
        const plan = STUDY_PLAN_EXERCISE_PILLARS[pillar].slice(
          0,
          TASKS_PER_PILLAR[pillar],
        );
        const block1 = blockTasks({ db, language, pillar, studySet: 'A', plan });
        const block2 = blockTasks({ db, language, pillar, studySet: 'B', plan });

        expect(block1).toHaveLength(TASKS_PER_PILLAR[pillar]);
        expect(block2).toHaveLength(TASKS_PER_PILLAR[pillar]);

        const typesOf = (tasks) => tasks.map((t) => t.__exerciseType).sort();
        expect(typesOf(block1)).toEqual([...plan].sort());
        expect(typesOf(block2)).toEqual([...plan].sort());

        const keyOf = (t) => `${t.__exerciseType}#${t.id}`;
        const block1Keys = new Set(block1.map(keyOf));
        expect(block2.filter((t) => block1Keys.has(keyOf(t)))).toEqual([]);
        expect(block1.every((t) => t.set === 'A')).toBe(true);
        expect(block2.every((t) => t.set === 'B')).toBe(true);
      });
    }
  }
});
