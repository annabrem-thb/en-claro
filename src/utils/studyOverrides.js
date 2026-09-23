// Settings the guided study pins regardless of what the participant chose,
// so the two blocks differ only in the gamification condition. Adaptive
// difficulty changes which items a participant sees based on how they
// answer (useExerciseSession.js), so left on it would make block 1 and
// block 2 diverge by individual performance. The stored preference itself
// is left alone: this returns an effective copy, and the participant's own
// value applies again in free use afterwards.
export function applyStudyOverrides(settings, studyActive) {
  return studyActive ? { ...settings, adaptiveDifficulty: false } : settings;
}
