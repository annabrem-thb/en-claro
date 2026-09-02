import { useState } from 'react';

import { safeJSONParse } from '../utils/safeJSONParse.js';

const VARIANT_ORDERS = ['classicFirst', 'gamifiedFirst'];

// The three pillars, visited in this fixed order during a guided block —
// matches PILLARS in App.jsx (Literacy/Visual/Cognitive), just named here
// independently so this hook has no import-time dependency on App.jsx.
export const PILLAR_SEQUENCE = ['Literacy', 'Visual', 'Cognitive'];
export const TASKS_PER_PILLAR = 3;

const DEFAULT_PROGRESS = {
  block: 1,
  pillarIndex: 0,
  pillarCount: 0,
  // 'tasks': working through the current block's pillars.
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

  const setStudyModeEnabled = (value) => {
    localStorage.setItem('studyModeEnabled', String(value));
    setStudyModeEnabledState(value);
    // Re-enabling after a previous run already finished starts a fresh one
    // (new coin flip, progress reset) rather than staying permanently inert
    // — otherwise the toggle would show on while the free picker/nav stays
    // up, exactly the inconsistent state this flag exists to prevent.
    if (value && progress.phase === 'done') {
      setProgress(DEFAULT_PROGRESS);
      setVariantOrder(assignRandomOrder());
    }
  };

  // Guided mode only actually governs anything once a starting variant
  // exists and the participant hasn't already finished both blocks.
  const isActive = studyModeEnabled && !!variantOrder && progress.phase !== 'done';

  const currentPillar =
    isActive && progress.phase === 'tasks'
      ? PILLAR_SEQUENCE[progress.pillarIndex]
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
  // units, or to the 'survey' phase once all three pillars are done.
  const recordUnitCompleted = () => {
    if (!isActive || progress.phase !== 'tasks') return;
    const nextCount = progress.pillarCount + 1;
    if (nextCount < TASKS_PER_PILLAR) {
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
      setProgress({ ...progress, pillarCount: nextCount, phase: 'survey' });
    }
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
    blockIsGamified,
    recordUnitCompleted,
    recordSurveySubmitted,
  };
}
