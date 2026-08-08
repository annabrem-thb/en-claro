import React from 'react';

import { useUserSettingsContext } from './UserSettingsContext';
import BionicText from './common/BionicText';

const CATEGORY_COLORS = {
  Literacy: {
    bg: 'bg-sky-50',
    border: 'border-sky-400',
    text: 'text-sky-700',
    fill: 'bg-sky-500',
  },
  Visual: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    text: 'text-amber-700',
    fill: 'bg-amber-500',
  },
  Cognitive: {
    bg: 'bg-purple-50',
    border: 'border-purple-400',
    text: 'text-purple-700',
    fill: 'bg-purple-500',
  },
  Any: {
    bg: 'bg-slate-50',
    border: 'border-slate-400',
    text: 'text-slate-700',
    fill: 'bg-slate-500',
  },
};

export default function DailyChecklist({ quests, t }) {
  const { settings } = useUserSettingsContext();
  const isHighContrast = settings.contrast;
  const noFlash = !!(settings.noFlash || settings.motion);
  const bigTargets = !!(settings.bigTargets || settings.motorik);
  const bionicReading = !!settings.bionicReading;

  if (!quests || !quests.tasks) return null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <h2
        className={`px-1 text-xl font-black ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
      >
        <BionicText
          text={t('quests') || 'Daily Checklist'}
          enabled={bionicReading}
        />
      </h2>

      <div className="flex flex-col gap-3" role="list">
        {quests.tasks.map((task) => {
          const isCompleted = task.completed || task.current >= task.target;
          const colors = CATEGORY_COLORS[task.type] || CATEGORY_COLORS.Any;

          const containerClass = isHighContrast
            ? isCompleted
              ? 'bg-white text-black border-white'
              : 'bg-black text-white border-white/50'
            : isCompleted
              ? `${colors.fill} text-white border-transparent`
              : `bg-white text-slate-700 border-slate-200`;

          const labelColorClass = isHighContrast
            ? 'text-current'
            : isCompleted
              ? 'text-white/90'
              : colors.text;

          return (
            <div
              key={task.id}
              role="listitem"
              className={`flex items-center gap-4 ${bigTargets ? 'p-6' : 'p-5'} rounded-2xl border-2 transition-all duration-500 ${containerClass} ${isCompleted ? 'scale-[0.98] opacity-90 shadow-none' : 'shadow-sm hover:border-slate-300'}`}
            >
              {}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? isHighContrast
                      ? 'border-black bg-black text-white'
                      : 'border-white bg-white text-current'
                    : isHighContrast
                      ? 'border-white/50 bg-transparent'
                      : `bg-slate-50 ${colors.border}`
                }`}
                aria-hidden="true"
              >
                {isCompleted && (
                  <span
                    className={`text-sm font-black ${noFlash ? '' : 'animate-in zoom-in duration-300'}`}
                  >
                    ✓
                  </span>
                )}
              </div>

              {}
              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={`text-base font-bold break-words hyphens-auto ${isCompleted ? (isHighContrast ? 'text-black' : 'text-white') : 'text-slate-800'}`}
                >
                  <BionicText
                    text={t('questLabel', {
                      target: task.target,
                      typeLabel:
                        task.type === 'Any'
                          ? t('questAny')
                          : t('pillars', { returnObjects: true })?.[
                              task.type
                            ] || task.type,
                    })}
                    enabled={bionicReading}
                  />
                </span>
                <span
                  className={`mt-1 text-xs font-black tracking-widest uppercase ${labelColorClass}`}
                >
                  {task.current} / {task.target}{' '}
                  <BionicText
                    text={t('done') || 'Done'}
                    enabled={bionicReading}
                  />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
