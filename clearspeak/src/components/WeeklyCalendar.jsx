import React from 'react';

const DAY_LABELS = {
  pl: ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
};

const Day = ({ dayLabel, isToday, isGoalMet, isFuture, themeStyles, isHighContrast, icon }) => {
  const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300";
  const todayRing = isToday ? `ring-2 ring-offset-2 ${isHighContrast ? 'ring-white ring-offset-black' : 'ring-indigo-400 ring-offset-white'}` : '';

  let stateClasses = '';
  if (isGoalMet) {
    stateClasses = isHighContrast ? 'bg-white text-black' : `${themeStyles.button} ${themeStyles.buttonText} shadow-md`;
  } else if (isFuture) {
    stateClasses = isHighContrast ? 'bg-black border-2 border-dashed border-white/30' : 'bg-white border-2 border-dashed border-slate-200';
  } else {
    stateClasses = isHighContrast ? 'bg-black border-2 border-white/30' : 'bg-slate-100 border-2 border-slate-200';
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center" aria-label={`${dayLabel} ${isGoalMet ? 'ukończone' : ''}`}>
      <div className={`${baseClasses} ${stateClasses} ${todayRing}`} aria-hidden="true">
        {isGoalMet && (icon || '✓')}
      </div>
      <span className={`text-xs font-bold ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`} aria-hidden="true">{dayLabel}</span>
    </div>
  );
};

export default function WeeklyCalendar({ dailyProgress, dailyGoal, t, themeStyles, isHighContrast, theme }) {
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - i));
    return date;
  });

  const labels = DAY_LABELS[t.language] || DAY_LABELS.en;
  const themeIcon = t?.levelIcons?.[theme]?.[0] || '✨';

  return (
    <div className={`w-full p-4 rounded-3xl mt-8 animate-in fade-in duration-500 delay-700 ${isHighContrast ? 'bg-black border border-white/20' : 'bg-white border border-slate-100'}`}>
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">
        {t.dailyGoalProgress || 'Daily Goal Progress'}
      </h3>
      <div className="flex justify-around items-start">
        {days.map((date, index) => {
          const dateString = date.toDateString();
          const progress = dailyProgress[dateString]?.points || 0;
          const isGoalMet = progress >= dailyGoal;
          const isToday = date.toDateString() === today.toDateString();
          const isFuture = date > today;
          const dayLabel = labels[date.getDay()];

          return (
            <Day key={index} dayLabel={dayLabel} isToday={isToday} isGoalMet={isGoalMet} isFuture={isFuture} themeStyles={themeStyles} isHighContrast={isHighContrast} icon={themeIcon} />
          );
        })}
      </div>
    </div>
  );
}