import React from 'react';

const DAY_LABELS = {
  pl: ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
};

const Day = ({
  dayLabel,
  isToday,
  isGoalMet,
  isFuture,
  themeStyles,
  isHighContrast,
  icon,
  bigTargets,
}) => {
  const baseClasses = `${bigTargets ? 'w-10 h-10 sm:w-12 sm:h-12 text-xs sm:text-sm' : 'w-8 h-8 sm:w-10 sm:h-10 text-[10px] sm:text-xs'} rounded-full flex items-center justify-center font-black transition-all duration-300`;
  const todayClasses = isToday
    ? `ring-2 ring-offset-2 ${isHighContrast ? 'ring-white ring-offset-black' : 'ring-indigo-400 ring-offset-white'}`
    : '';
  const statusClasses = isGoalMet
    ? isHighContrast
      ? 'bg-white text-black'
      : `${themeStyles?.button || 'bg-indigo-500'} ${themeStyles?.buttonText || 'text-white'} shadow-md`
    : isFuture
      ? isHighContrast
        ? 'bg-black border-2 border-dashed border-white/30'
        : 'bg-white border-2 border-dashed border-slate-200'
      : isHighContrast
        ? 'bg-black border-2 border-white/30'
        : 'bg-slate-100 border-2 border-slate-200';

  return (
    <div
      className="flex flex-col items-center gap-1.5 text-center sm:gap-2"
      role="listitem"
      aria-label={`${dayLabel} ${isGoalMet ? 'completed' : 'incomplete'}`}
    >
      <div
        className={`${baseClasses} ${statusClasses} ${todayClasses}`}
        aria-hidden="true"
      >
        {isGoalMet && (icon || '✓')}
      </div>
      <span
        className={`${bigTargets ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} font-bold ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
        aria-hidden="true"
      >
        {dayLabel}
      </span>
    </div>
  );
};

export function WeeklyCalendar({
  dailyProgress = {},
  dailyGoal,
  t,
  themeStyles,
  isHighContrast,
  theme,
  noFlash = false,
  bigTargets = false,
  language = 'en',
}) {
  const today = new Date();

  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - index));
    return date;
  });

  const labels = DAY_LABELS[language] || DAY_LABELS.en;
  const icon = t?.('levelIcons', { returnObjects: true })?.[theme]?.[0] || '✨';

  return (
    <div
      className={`w-full ${bigTargets ? 'p-4 sm:p-6' : 'p-3 sm:p-4'} mt-4 rounded-2xl sm:mt-8 sm:rounded-3xl ${noFlash ? '' : 'animate-in fade-in delay-700 duration-500'} ${isHighContrast ? 'border border-white/20 bg-black' : 'border border-slate-100 bg-white shadow-sm'}`}
      role="list"
      aria-label={t?.('dailyGoalProgress') || 'Daily Goal Progress'}
    >
      <h3
        className={`${bigTargets ? 'mb-3 text-xs sm:mb-6 sm:text-sm' : 'mb-2 text-[10px] sm:mb-4 sm:text-xs'} text-center font-black tracking-widest break-words text-slate-600 uppercase`}
      >
        {t?.('dailyGoalProgress') || 'Daily Goal Progress'}
      </h3>
      <div className="flex items-start justify-around gap-1 sm:gap-2">
        {weekDays.map((date, index) => {
          const isGoalMet =
            (dailyProgress[date.toDateString()]?.points || 0) >= dailyGoal;
          const isToday = date.toDateString() === today.toDateString();
          const isFuture = date > today;
          const dayLabel = labels[date.getDay()];

          return (
            <Day
              key={index}
              dayLabel={dayLabel}
              isToday={isToday}
              isGoalMet={isGoalMet}
              isFuture={isFuture}
              themeStyles={themeStyles}
              isHighContrast={isHighContrast}
              icon={icon}
              bigTargets={bigTargets}
            />
          );
        })}
      </div>
    </div>
  );
}
