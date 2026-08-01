import React, { createContext, useContext, useState, useEffect } from 'react';

const GamificationContext = createContext();

export function GamificationProvider({ children }) {
  const [selectedRewardId, setSelectedRewardId] = useState(null);
  const [competencePoints, setCompetencePoints] = useState(0);
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  const [isGamified, setIsGamified] = useState(() => {
    const stored = localStorage.getItem('cfg_gamified');
    return stored === null ? false : JSON.parse(stored);
  });

  useEffect(() => {
    localStorage.setItem('cfg_gamified', JSON.stringify(isGamified));
  }, [isGamified]);

  const completeDailyTask = () => {
    setCompetencePoints((prev) => prev + 1);
  };

  const chooseNextReward = (id) => {
    setSelectedRewardId(id);
  };

  const unlockSelectedReward = () => {
    if (selectedRewardId) {
      setUnlockedRewards((prev) => [...prev, selectedRewardId]);
      setSelectedRewardId(null);
    }
  };

  const value = {
    isGamified, setIsGamified,
    competencePoints, completeDailyTask,
    selectedRewardId, chooseNextReward,
    unlockedRewards, unlockSelectedReward
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  return useContext(GamificationContext);
}