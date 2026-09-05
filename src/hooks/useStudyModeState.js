import { useState } from 'react';

import { STUDY_EXERCISE_PILLARS } from '../data/exerciseTypes.js';
import { safeJSONParse } from '../utils/safeJSONParse.js';

const VARIANT_ORDERS = ['classicFirst', 'gamifiedFirst'];

// The three pillars, visited in this fixed order during a guided block —
// matches PILLARS in App.jsx (Literacy/Visual/Cognitive), just named here
// independently so this hook has no import-time dependency on App.jsx.
export const PILLAR_SEQUENCE = ['Literacy', 'Visual', 'Cognitive'];

// How many distinct exercise *types* each pillar contributes to a block.
// Visual (3 types) and Cognitive (4 types) get full coverage — there's
// barely more to cover. Literacy has 12 candidate types; 8 was chosen as
// "more than a token 3, but not the full set" so every session still stays
// within a manageable length. See STUDY_EXERCISE_PILLARS for the pools this
// is sampled from.
export const TASKS_PER_PILLAR = { Literacy: 8, Visual: 3, Cognitive: 4 };

const DEFAULT_PROGRESS = {
  block: 1,
  pillarIndex: 0,
  pillarCount: 0,
  // 'tasks': working through the current block's pillars.
  // 'garden': gamified block only — pillars just finished, Garden shown
  // before that block's survey (see recordUnitCompleted/recordGardenSeen).
  // 'survey': block finished, waiting on that block's survey submission.
  // 'done': both blocks and both surveys are complete.
  phase: 'tasks',
};

function readStudyModeEnabled() {
  const stored = localStorage.getItem('studyModeEnabled');
  // No stored preference yet (first-ever launch) defaults to on — most
  // visitors during data collection are participants who should get the
  // guided flow without a researcher having to configure anything.
  return stored === null ? true : stored === 'true';
}

function readStoredOrder() {
  const stored = localStorage.getItem('variantOrder');
  return VARIANT_ORDERS.includes(stored) ? stored : null;
}

// Picks TASKS_PER_PILLAR[pillar] distinct exercise types per pillar, once
// per participant, and remembers the choice — so a pillar's block-1 and
// block-2 visits draw from the exact same set of types (a paired
// classic-vs-gamified comparison per exercise type) instead of each block
// rolling its own independent, possibly-different subset.
function assignExercisePlan() {
  const plan = Object.fromEntries(
    PILLAR_SEQUENCE.map((pillar) => {
      const pool = STUDY_EXERCISE_PILLARS[pillar];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return [pillar, shuffled.slice(0, TASKS_PER_PILLAR[pillar])];
    }),
  );
  localStorage.setItem('studyExercisePlan', JSON.stringify(plan));
  return plan;
}

function readStoredExercisePlan() {
  return safeJSONParse(localStorage.getItem('studyExercisePlan'), null);
}

// Single source of truth for the guided study session: whether it's active
// at all, which variant the device starts on, and progress through the
// fixed 3-pillar-x-3-task block / survey / block / survey structure.
// Consumed exclusively through StudyModeContext's useStudyMode().
export function useStudyModeState() {
  const [studyModeEnabled, setStudyModeEnabledState] = useState(
    readStudyModeEnabled,
  );

  const assignRandomOrder = () => {
    const assigned = Math.random() < 0.5 ? 'classicFirst' : 'gamifiedFirst';
    localStorage.setItem('variantOrder', assigned);
    return assigned;
  };

  const [variantOrder, setVariantOrder] = useState(() => {
    const fromUrl = new URLSearchParams(window.location.search)
      .get('order');
    if (VARIANT_ORDERS.includes(fromUrl)) {
      localStorage.setItem('variantOrder', fromUrl);
      return fromUrl;
    }
    const stored = readStoredOrder();
    if (stored) return stored;
    if (!readStudyModeEnabled()) return null;
    // First-ever launch with study mode on and no ?order= override: assign
    // a starting variant by coin flip and remember it. This is what makes
    // "randomized starting order" actually happen for a plain shared link,
    // rather than depending on every participant getting a hand-crafted
    // URL from whoever runs the study.
    return assignRandomOrder();
  });

  const [progress, setProgressState] = useState(() =>
    safeJSONParse(localStorage.getItem('studyProgress'), DEFAULT_PROGRESS),
  );

  const setProgress = (next) => {
    localStorage.setItem('studyProgress', JSON.stringify(next));
    setProgressState(next);
  };

  const [exercisePlan, setExercisePlan] = useState(
    () => readStoredExercisePlan() || (readStudyModeEnabled() ? assignExercisePlan() : null),
  );

  const setStudyModeEnabled = (value) => {
    localStorage.setItem('studyModeEnabled', String(value));
    setStudyModeEnabledState(value);
    // Re-enabling after a previous run already finished starts a fresh one
    // (new coin flip, progress reset, new exercise-type plan) rather than
    // staying permanently inert — otherwise the toggle would show on while
    // the free picker/nav stays up, exactly the inconsistent state this
    // flag exists to prevent.
    if (value && progress.phase === 'done') {
      setProgress(DEFAULT_PROGRESS);
      setVariantOrder(assignRandomOrder());
      setExercisePlan(assignExercisePlan());
    }
  };

  // Guided mode only actually governs anything once a starting variant
  // exists and the participant hasn't already finished both blocks.
  const isActive = studyModeEnabled && !!variantOrder && progress.phase !== 'done';

  const currentPillar =
    isActive && progress.phase === 'tasks'
      ? PILLAR_SEQUENCE[progress.pillarIndex]
      : null;

  // How many tasks the current pillar's block requires, and which exercise
  // types those tasks must come from — both null once no pillar is current.
  const pillarTotal = currentPillar ? TASKS_PER_PILLAR[currentPillar] : null;
  const currentExerciseTypes = currentPillar
    ? exercisePlan?.[currentPillar] || null
    : null;

  // Which variant the current block requires, independent of any manual
  // toggle — block 1 is whatever the coin flip/URL assigned, block 2 is
  // the other one.
  const blockIsGamified =
    variantOrder === 'classicFirst'
      ? progress.block === 2
      : progress.block === 1;

  // Call once per completed exercise unit (success or skip) while a block
  // is in progress. Advances to the next pillar after TASKS_PER_PILLAR
  // units, or once all three pillars are done: to 'garden' for the
  // gamified block (it's the one thing that block is meant to show off,
  // so it gets a stop before the survey closes it out) or straight to
  // 'survey' for the classic block, which has no gamification to visit.
  const recordUnitCompleted = () => {
    if (!isActive || progress.phase !== 'tasks') return;
    const nextCount = progress.pillarCount + 1;
    const target = TASKS_PER_PILLAR[PILLAR_SEQUENCE[progress.pillarIndex]];
    if (nextCount < target) {
      setProgress({ ...progress, pillarCount: nextCount });
      return;
    }
    if (progress.pillarIndex < PILLAR_SEQUENCE.length - 1) {
      setProgress({
        ...progress,
        pillarIndex: progress.pillarIndex + 1,
        pillarCount: 0,
      });
    } else {
      setProgress({
        ...progress,
        pillarCount: nextCount,
        phase: blockIsGamified ? 'garden' : 'survey',
      });
    }
  };

  // Call once the participant chooses to move on from the post-block Garden
  // visit (gamified block only). Moves to that block's survey.
  const recordGardenSeen = () => {
    if (!isActive || progress.phase !== 'garden') return;
    setProgress({ ...progress, phase: 'survey' });
  };

  // Call once a block's survey has actually been submitted successfully
  // (not just closed/dismissed). Moves to block 2 in the other variant, or
  // to 'done' if this was block 2's survey.
  const recordSurveySubmitted = () => {
    if (!isActive || progress.phase !== 'survey') return;
    if (progress.block === 1) {
      setProgress({ block: 2, pillarIndex: 0, pillarCount: 0, phase: 'tasks' });
    } else {
      setProgress({ ...progress, phase: 'done' });
      // Both blocks and both surveys are done — turn the toggle itself off
      // rather than leaving it on but functionally inert, so the app
      // plainly reflects "guided part finished, free practice from here"
      // instead of a toggle that still reads on with no visible effect.
      localStorage.setItem('studyModeEnabled', 'false');
      setStudyModeEnabledState(false);
    }
  };

  return {
    studyModeEnabled,
    setStudyModeEnabled,
    variantOrder,
    isActive,
    phase: progress.phase,
    block: progress.block,
    currentPillar,
    pillarIndex: progress.pillarIndex,
    pillarCount: progress.pillarCount,
    pillarTotal,
    currentExerciseTypes,
    blockIsGamified,
    recordUnitCompleted,
    recordGardenSeen,
    recordSurveySubmitted,
  };
}
