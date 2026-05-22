import React, { createContext, useContext, useState } from 'react';

const GamificationContext = createContext();

/**
 * GamificationProvider
 * Manages the state of the non-punitive, intrinsic reward system.
 * Built around the PENS (Player Experience of Need Satisfaction) psychological model.
 */
export function GamificationProvider({ children }) {
  // PENS Model - Autonomy: Giving users the freedom to choose their own meaningful rewards
  // Users select which plant they want to grow next, satisfying the need for self-direction.
  const [selectedRewardId, setSelectedRewardId] = useState(null);
  
  // PENS Model - Competence: Accumulating progress in a purely positive, non-punitive way.
  // There are no fail states, point deductions, or broken streaks; progress only moves forward.
  const [competencePoints, setCompetencePoints] = useState(0);
  
  // The user's collection of earned virtual plants/items representing past successes
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  
  // Legacy support for the app's base mode toggle (Gamified vs Minimalist)
  const [isGamified, setIsGamified] = useState(true);

  // Action: Triggered when a user successfully finishes an exercise module
  const completeDailyTask = () => {
    setCompetencePoints((prevPoints) => prevPoints + 1);
  };

  // Action: Unlocks the previously chosen plant, usually called after hitting a milestone
  const unlockSelectedReward = () => {
    if (selectedRewardId) {
      setUnlockedRewards((prev) => [...prev, selectedRewardId]);
      setSelectedRewardId(null); // Reset to prompt a new autonomous choice for tomorrow
    }
  };

  // Action: Called when the user actively decides their future goal
  const chooseNextReward = (rewardId) => {
    setSelectedRewardId(rewardId);
  };

  return (
    <GamificationContext.Provider value={{
      isGamified, setIsGamified,
      competencePoints, completeDailyTask,
      selectedRewardId, chooseNextReward,
      unlockedRewards, unlockSelectedReward
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export const useGamification = () => useContext(GamificationContext);