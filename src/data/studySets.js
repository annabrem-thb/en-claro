// Content counterbalancing mechanism: an exercise item may optionally carry
// a `set` field ('A' or 'B') so a session can be locked to one content set.
// Outside the guided study a device is pinned to one set via `?set=` (see
// useStudySet.js); inside the guided study each block gets its own set
// (see studySetForBlock below), so a participant never repeats the same
// items in the second block.
export const STUDY_SETS = ['A', 'B'];

// An unassigned task (no `set` field) or an unconfigured device (no active
// set) is always included — this is what keeps the mechanism a no-op until
// content actually gets assigned, and keeps every other exercise type
// (which will likely never need this split) unaffected.
export function belongsToActiveSet(task, activeSet) {
  if (!activeSet) return true;
  if (!task.set) return true;
  return task.set === activeSet;
}

// Guided study: block 1 always draws from Set A, block 2 from Set B. The
// counterbalancing across conditions comes from variantOrder, which is
// randomized 50/50 per participant (useStudyModeState.js): a
// 'classicFirst' participant sees classic+A then gamified+B, a
// 'gamifiedFirst' participant gamified+A then classic+B — so across
// participants each set is paired with each condition equally often. What
// this two-order design cannot separate is set from block position (A is
// always the first block); that would need a second, independent
// randomization.
export function studySetForBlock(block) {
  return block === 2 ? 'B' : 'A';
}
