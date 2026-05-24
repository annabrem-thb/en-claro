import { useState, useCallback, useEffect } from 'react';

const makeDailyQuests = () => [
  { id: 1, type: 'Literacy',  target: 3,  current: 0, completed: false, reward: 3 },
  { id: 2, type: 'Cognitive', target: 2,  current: 0, completed: false, reward: 3 },
  { id: 3, type: 'Any',       target: 10, current: 0, completed: false, reward: 5 },
];

export function useGamificationState() {
  const [points, setPoints] = useState(() => Number(localStorage.getItem('pts')) || 0);
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('cfg_coins')) || 0);
  const [rewards, setRewards] = useState(() => JSON.parse(localStorage.getItem('rew') || '[]'));
  
  const [unlockedThemes, setUnlockedThemes] = useState(() => {
    const sv = localStorage.getItem('cfg_unlocked_themes'); 
    return sv ? JSON.parse(sv) : ['Natur'];
  });
  
  const [dailyQuests, setDailyQuests] = useState(() => {
    const saved = localStorage.getItem('cfg_quests');
    const today = new Date().toDateString();
    const data  = saved ? JSON.parse(saved) : null;
    return (data && data.date === today) ? data : { date: today, tasks: makeDailyQuests() };
  });

  const updateQuests = useCallback((pillarType) => {
    setDailyQuests(prev => {
      const newTasks = prev.tasks.map(task => {
        if (task.completed) return task;
        if (task.type === pillarType || task.type === 'Any') {
          const newCurrent = task.current + 1;
          const done = newCurrent >= task.target;
          if (done) setCoins(c => c + task.reward);
          return { ...task, current: newCurrent, completed: done };
        }
        return task;
      });
      return { ...prev, tasks: newTasks };
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('pts', String(points));
    localStorage.setItem('rew', JSON.stringify(rewards));
    localStorage.setItem('cfg_coins', String(coins));
    localStorage.setItem('cfg_unlocked_themes', JSON.stringify(unlockedThemes));
    localStorage.setItem('cfg_quests', JSON.stringify(dailyQuests));
  }, [points, rewards, coins, unlockedThemes, dailyQuests]);

  return { points, setPoints, coins, setCoins, rewards, setRewards, unlockedThemes, setUnlockedThemes, dailyQuests, setDailyQuests, updateQuests };
}