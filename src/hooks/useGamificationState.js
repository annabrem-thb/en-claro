import { useState, useCallback, useEffect } from 'react';

import { safeJSONParse } from '../utils/safeJSONParse.js';

const makeDailyQuests = () => [
  {
    id: 1,
    type: 'Literacy',
    target: 3,
    current: 0,
    completed: false,
    reward: 3,
  },
  {
    id: 2,
    type: 'Cognitive',
    target: 2,
    current: 0,
    completed: false,
    reward: 3,
  },
  { id: 3, type: 'Any', target: 10, current: 0, completed: false, reward: 5 },
];

// Single source of truth for all gamification state (exercise-economy points/
// coins/quests, the daily-reward-choice flow, and the classic/gamified mode
// toggle). Consumed exclusively through GamificationContext's useGamification().
export function useGamificationState() {
  const [points, setPoints] = useState(
    () => Number(localStorage.getItem('pts')) || 0,
  );
  const [coins, setCoins] = useState(
    () => Number(localStorage.getItem('cfg_coins')) || 0,
  );
  const [rewards, setRewards] = useState(() =>
    safeJSONParse(localStorage.getItem('rew'), []),
  );
  const [dailyQuests, setDailyQuests] = useState(() => {
    const saved = localStorage.getItem('cfg_quests');
    const today = new Date().toDateString();
    const data = safeJSONParse(saved, null);
    return data && data.date === today
      ? data
      : { date: today, tasks: makeDailyQuests() };
  });

  const [isGamified, setIsGamified] = useState(() =>
    safeJSONParse(localStorage.getItem('cfg_gamified'), false),
  );
  const [selectedRewardId, setSelectedRewardId] = useState(null);
  const [competencePoints, setCompetencePoints] = useState(0);
  const [unlockedRewards, setUnlockedRewards] = useState([]);

  const updateQuests = useCallback((pillarType) => {
    setDailyQuests((prev) => {
      const newTasks = prev.tasks.map((task) => {
        if (task.completed) return task;
        if (task.type === pillarType || task.type === 'Any') {
          const newCurrent = task.current + 1;
          const done = newCurrent >= task.target;
          if (done) setCoins((c) => c + task.reward);
          return { ...task, current: newCurrent, completed: done };
        }
        return task;
      });
      return { ...prev, tasks: newTasks };
    });
  }, []);

  const completeDailyTask = useCallback(() => {
    setCompetencePoints((prev) => prev + 1);
  }, []);

  const chooseNextReward = useCallback((id) => {
    setSelectedRewardId(id);
  }, []);

  const unlockSelectedReward = useCallback(() => {
    setSelectedRewardId((current) => {
      if (current) {
        setUnlockedRewards((prev) => [...prev, current]);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('pts', String(points));
    localStorage.setItem('rew', JSON.stringify(rewards));
    localStorage.setItem('cfg_coins', String(coins));
    localStorage.setItem('cfg_quests', JSON.stringify(dailyQuests));
  }, [points, rewards, coins, dailyQuests]);

  useEffect(() => {
    localStorage.setItem('cfg_gamified', JSON.stringify(isGamified));
  }, [isGamified]);

  return {
    points: points,
    setPoints: setPoints,
    coins: coins,
    setCoins: setCoins,
    rewards: rewards,
    setRewards: setRewards,
    dailyQuests: dailyQuests,
    setDailyQuests: setDailyQuests,
    updateQuests: updateQuests,
    isGamified: isGamified,
    setIsGamified: setIsGamified,
    competencePoints: competencePoints,
    completeDailyTask: completeDailyTask,
    selectedRewardId: selectedRewardId,
    chooseNextReward: chooseNextReward,
    unlockedRewards: unlockedRewards,
    unlockSelectedReward: unlockSelectedReward,
  };
}
