// Canonical registry of the app's achievement/badge system — a discrete,
// milestone-based complement to the continuous growthValue counter (see
// useGamificationState.js). Kept in its own module so both the unlock logic
// (useAchievements.js) and the display (VirtualGarden.jsx's badge shelf,
// AchievementToast.jsx) share one source of truth for ids/icons/copy keys.
//
// Each unlock condition is chosen to be reachable within a single short
// guided study block (see useStudyModeState.js's TASKS_PER_PILLAR —
// 8/3/4 tasks), not just over weeks of regular use, so a study participant
// who only ever sees one gamified block still gets to encounter every
// badge before filling out that block's survey.
export const ACHIEVEMENTS = [
  {
    id: 'firstCorrect',
    icon: '🌱',
    titleKey: 'achievements.firstCorrect.title',
    descKey: 'achievements.firstCorrect.desc',
  },
  {
    id: 'combo3',
    icon: '🔥',
    titleKey: 'achievements.combo3.title',
    descKey: 'achievements.combo3.desc',
  },
  {
    id: 'gardenVisit',
    icon: '🏁',
    titleKey: 'achievements.gardenVisit.title',
    descKey: 'achievements.gardenVisit.desc',
  },
];
