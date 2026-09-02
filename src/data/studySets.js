// Content counterbalancing mechanism: an exercise item may optionally carry
// a `set` field ('A' or 'B') so a participant's device can be locked to one
// content set for the length of a study. No item in vocabulary_*.js carries
// this field yet — assigning which items belong to which set is a content
// decision made separately, not something this module does.
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
