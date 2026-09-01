// Canonical registry of user-toggleable exercise types, grouped by pillar.
//
// Each key here is the exact vocabulary DB array name consumed by
// useExerciseSession.js's `activePillarTasks` (see src/data/vocabulary_*.js
// — `db.phonemes`, `db.syllables`, etc.), not the per-task `type` field used
// by ExerciseContainer.jsx for component routing. The two are intentionally
// decoupled: DB keys are the actual granularity the vocabulary data is
// organized into (e.g. `lcwc` holds tasks routed via `type ===
// 'lookCoverWriteCheck'`, `tracking` holds tasks routed via `type ===
// 'spatial'`), so filtering at this level is a single, minimal change in
// activePillarTasks rather than requiring every exercise component's
// internal `type` string to be reconciled with a second naming scheme.
//
// `diagnostic` is deliberately NOT included: it's a one-off initial
// assessment pool shared across all three pillars (filtered by `d.pillar`),
// not a specific skill a learner would want to mute for being "mastered" —
// it stays unconditionally available regardless of these toggles.
export const EXERCISE_PILLARS = {
  Literacy: [
    'phonemes',
    'syllables',
    'graphemes',
    'auditory',
    'vocabulary',
    'scrabble',
    'lcwc',
    'context',
    'dictation',
    'readAloud',
    'comprehension',
    'rhythm',
  ],
  Visual: ['clock', 'tracking', 'mirrorImage', 'oddOneOut'],
  Cognitive: [
    'categorization',
    'sequences',
    'memorySpan',
    'logicalReasoning',
    'rhythmMemory',
    'melodyMemory',
  ],
};

// Flat list of every toggleable key, in the same order they appear above —
// used to build the default "all active" settings map and to validate keys.
const ALL_EXERCISE_KEYS = Object.values(EXERCISE_PILLARS).flat();

export function getDefaultActiveExercises() {
  return Object.fromEntries(ALL_EXERCISE_KEYS.map((key) => [key, true]));
}

// Exercise types kept in the codebase (components, data, per-user toggle)
// but not offered in this build's session routing — a code-level gate that
// wins regardless of the user's own activeExercises setting, unlike every
// other key above. `tracking` routes to the spatial-tracking exercise,
// `rhythm`/`rhythmMemory`/`melodyMemory` to the sound-timing/melody-recall
// ones; none exercise phoneme/grapheme decoding, the skill this pillar set
// is meant to practice.
const EXCLUDED_FROM_STUDY = ['tracking', 'rhythm', 'rhythmMemory', 'melodyMemory'];

export const STUDY_EXERCISE_TYPES = new Set(
  ALL_EXERCISE_KEYS.filter((key) => !EXCLUDED_FROM_STUDY.includes(key)),
);

// Same shape as EXERCISE_PILLARS, with the excluded keys dropped from each
// pillar's list — what exercise-toggle UI should render, so it never offers
// a switch for a type that STUDY_EXERCISE_TYPES will never select anyway.
export const STUDY_EXERCISE_PILLARS = Object.fromEntries(
  Object.entries(EXERCISE_PILLARS).map(([pillar, keys]) => [
    pillar,
    keys.filter((key) => !EXCLUDED_FROM_STUDY.includes(key)),
  ]),
);
