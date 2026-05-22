import { useState, useEffect } from 'react';
import { getAllLogs } from '../utils/indexedDB.js';

export function useMonthlyStats(year, month) {
  const [stats, setStats] = useState([]);
  const [maxCount, setMaxCount] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      setLoading(true);
      try {
        const logs = await getAllLogs('exercise_history');
        if (!isMounted) return;

        // Formatowanie do YYYY-MM
        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        const monthLogs = logs.filter(log => log.date.startsWith(prefix));

        // Przygotowanie pustej tablicy na każdy dzień miesiąca
        const daysInMonth = new Date(year, month, 0).getDate();
        const dailyCounts = Array.from({ length: daysInMonth }, (_, i) => ({
          day: i + 1,
          count: 0
        }));

        // Agregacja wyników
        monthLogs.forEach(log => {
          const dayInt = parseInt(log.date.split('T')[0].split('-')[2], 10);
          if (dayInt >= 1 && dayInt <= daysInMonth) {
            dailyCounts[dayInt - 1].count += 1;
          }
        });

        const max = Math.max(...dailyCounts.map(d => d.count), 1); // Zapobieganie dzieleniu przez 0
        
        setStats(dailyCounts);
        setMaxCount(max);
      } catch (error) {
        console.error("Failed to load monthly stats", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => { isMounted = false; };
  }, [year, month]);

  return { stats, maxCount, maxStreak, loading };
}