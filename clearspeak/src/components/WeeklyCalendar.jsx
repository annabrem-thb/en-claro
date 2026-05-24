import React from 'react';

const DAY_LABELS = {
  pl: ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
};

const Day = ({ dayLabel, isToday, isGoalMet, isFuture, themeStyles, isHighContrast, icon }) => {
  const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300';
  const todayClasses = isToday ? `ring-2 ring-offset-2 ${isHighContrast ? 'ring-white ring-offset-black' : 'ring-indigo-400 ring-offset-white'}` : '';
  const statusClasses = isGoalMet
    ? (isHighContrast ? 'bg-white text-black' : `${themeStyles?.button || 'bg-indigo-500'} ${themeStyles?.buttonText || 'text-white'} shadow-md`)
    : isFuture
      ? (isHighContrast ? 'bg-black border-2 border-dashed border-white/30' : 'bg-white border-2 border-dashed border-slate-200')
      : (isHighContrast ? 'bg-black border-2 border-white/30' : 'bg-slate-100 border-2 border-slate-200');

  return (
    <div className="flex flex-col items-center gap-2 text-center" aria-label={`${dayLabel} ${isGoalMet ? 'completed' : ''}`}>
      <div className={`${baseClasses} ${statusClasses} ${todayClasses}`} aria-hidden="true">
        {isGoalMet && (icon || '✓')}
      </div>
      <span className={`text-xs font-bold ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`} aria-hidden="true">
        {dayLabel}
      </span>
    </div>
  );
};

// Adding the 'export' keyword here resolves the Vite import error
export function WeeklyCalendar({ dailyProgress = {}, dailyGoal, t, themeStyles, isHighContrast, theme, noFlash = false }) {
  const today = new Date();
  
  // Generate the last 7 days including today
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - index));
    return date;
  });

  const labels = DAY_LABELS[t?.language || 'de'] || DAY_LABELS.de;
  const icon = t?.levelIcons?.[theme]?.[0] || '✨';

  return (
    <div className={`w-full p-4 rounded-3xl mt-8 ${noFlash ? '' : 'animate-in fade-in duration-500 delay-700'} ${isHighContrast ? 'bg-black border border-white/20' : 'bg-white border border-slate-100'}`}>
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">
        {t?.dailyGoalProgress || 'Daily Goal Progress'}
      </h3>
      <div className="flex justify-around items-start">
        {weekDays.map((date, index) => {
          const isGoalMet = (dailyProgress[date.toDateString()]?.points || 0) >= dailyGoal;
          const isToday = date.toDateString() === today.toDateString();
          const isFuture = date > today;
          const dayLabel = labels[date.getDay()];

          return (
            <Day 
              key={index} dayLabel={dayLabel} isToday={isToday} 
              isGoalMet={isGoalMet} isFuture={isFuture} 
              themeStyles={themeStyles} isHighContrast={isHighContrast} icon={icon} 
            />
          );
        })}
      </div>
    </div>
  );
}