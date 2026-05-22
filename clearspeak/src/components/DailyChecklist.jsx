import React from 'react';
import { useConfig } from '../useConfig';

// Consistent, dyslexia-friendly color coding to aid visual memory mapping
// Different hues help users quickly associate tasks without reading
const CATEGORY_COLORS = {
  Literacy:  { bg: 'bg-sky-50',     border: 'border-sky-400',    text: 'text-sky-700',    fill: 'bg-sky-500' },
  Visual:    { bg: 'bg-amber-50',   border: 'border-amber-400',  text: 'text-amber-700',  fill: 'bg-amber-500' },
  Cognitive: { bg: 'bg-purple-50',  border: 'border-purple-400', text: 'text-purple-700', fill: 'bg-purple-500' },
  Any:       { bg: 'bg-slate-50',   border: 'border-slate-400',  text: 'text-slate-700',  fill: 'bg-slate-500' }
};

/**
 * DailyChecklist Component
 * Provides a simple, tangible checklist to replicate the satisfaction of pen-and-paper lists.
 * Helps prospective memory by offering a clear, non-overwhelming summary of the day's goals.
 */
export default function DailyChecklist({ quests, t }) {
  const { a11ySettings } = useConfig();
  const isHighContrast = a11ySettings?.contrast;

  if (!quests || !quests.tasks) return null;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 className={`text-xl font-black px-1 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
        {t.quests || "Daily Checklist"}
      </h2>
      
      <div className="flex flex-col gap-3" role="list">
        {quests.tasks.map((task) => {
          const isCompleted = task.completed || task.current >= task.target;
          const colors = CATEGORY_COLORS[task.type] || CATEGORY_COLORS.Any;
          
          // Visual logic: When checked, the box visually "sinks" and solidifies to give a satisfying sense of completion
          const containerClass = isHighContrast 
            ? (isCompleted ? 'bg-white text-black border-white' : 'bg-black text-white border-white/50')
            : (isCompleted ? `${colors.fill} text-white border-transparent` : `bg-white text-slate-700 border-slate-200`);

          const labelColorClass = isHighContrast
            ? 'text-current'
            : (isCompleted ? 'text-white/90' : colors.text);

          return (
            <div 
              key={task.id}
              role="listitem"
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-500 ${containerClass} ${isCompleted ? 'scale-[0.98] opacity-90 shadow-none' : 'shadow-sm hover:border-slate-300'}`}
            >
              {/* The "Tick Off" Checkbox Element */}
              <div 
                className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? (isHighContrast ? 'bg-black border-black text-white' : 'bg-white border-white text-current') 
                    : (isHighContrast ? 'bg-transparent border-white/50' : `bg-slate-50 ${colors.border}`)
                }`}
                aria-hidden="true"
              >
                {isCompleted && <span className="text-sm font-black animate-in zoom-in duration-300">✓</span>}
              </div>
              
              {/* Text Information */}
              <div className="flex-1 flex flex-col">
                <span className={`text-base font-bold ${isCompleted ? (isHighContrast ? 'text-black' : 'text-white') : 'text-slate-800'}`}>
                  {t.questLabel ? t.questLabel(task.target, task.type, t.pillars) : `Complete ${task.target} ${task.type} tasks`}
                </span>
                <span className={`text-xs font-black uppercase tracking-widest mt-1 ${labelColorClass}`}>
                  {task.current} / {task.target} {t.done || 'Done'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}