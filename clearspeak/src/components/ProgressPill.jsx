// ProgressPill.jsx
import React from 'react';

// Stage icons mapped to each theme
const STAGE_ICONS = {
  Natur: ['🌱', '🌿', '🌿', '🌷', '🌸'],
  Musik: ['𝅘𝅥𝅰', '𝅘𝅥𝅯', '♩', '𝅗𝅥', '🎻'],
  Kunst: ['🖌️', '🎨', '🖼️', '🖼️', '✨'],
  Space: ['🌠', '☄️', '🌙', '🪐', '🚀'],
  Ocean: ['💧', '🐟', '🪸', '🐬', '🐳'],
};

function ProgressPill({
  points,
  max,
  theme,
  isGamified,
  t,
  isHighContrast = false,
}) {
  if (!isGamified)
    return (
      <div
        className={`h-3 flex-1 rounded-full ${isHighContrast ? 'bg-white/20' : 'bg-slate-100'}`}
      />
    );

  const themeLabels = t.progressStages[theme] || t.progressStages.Natur;
  const themeIcons = STAGE_ICONS[theme] || STAGE_ICONS.Natur;

  const stageIndex = Math.min(points, max - 1);
  const currentLabel = themeLabels[stageIndex];
  const currentIcon = themeIcons[stageIndex];

  return (
    <div 
      className="flex flex-1 flex-col gap-1"
      role="progressbar"
      aria-valuenow={points}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={currentLabel}
    >
      <div className="flex items-end justify-between px-1">
        <div className="flex items-center gap-2">
          {/* Animated level indicator */}
          {/* Minimalist D-UI: Usunięto 'animate-bounce', by zredukować szum wizualny i chronić przed rozproszeniem uwagi */}
          <span className="text-2xl" aria-hidden="true">
            {currentIcon}
          </span>
          <span
            className={`text-[8px] font-black tracking-wider uppercase ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}
          >
            {currentLabel}
          </span>
        </div>
        <span className="text-[9px] font-black text-slate-300">
          {points} / {max}
        </span>
      </div>

      {/* Progress bar structure */}
      {/* Minimalist D-UI: Segmentowany i płaski wskaźnik postępu zamiast rozpraszającego jednolitego tła */}
      <div className="flex gap-1 h-2 w-full mt-1">
          {[...Array(max)].map((_, index) => (
            <div
              key={index}
              className={`flex-1 rounded-full transition-all duration-700 ease-out ${
                index < points 
                  ? (isHighContrast ? 'bg-white' : 'bg-slate-400') 
                  : (isHighContrast ? 'bg-white/20' : 'bg-slate-200')
              }`}
            />
          ))}
      </div>
    </div>
  );
}

export default ProgressPill;
