import React, { useState, useEffect } from 'react';

const STAGE_ICONS = {
  Natur: ['🌱', '🌿', '🌿', '🌷', '🌸'],
  Musik: ['𝅘𝅥𝅰', '𝅘𝅥𝅯', '♩', '𝅗𝅥', '🎻'],
  Kunst: ['🖌️', '🎨', '🖼️', '🖼️', '✨'],
  Space: ['🌠', '☄️', '🌙', '🪐', '🚀'],
  Ocean: ['💧', '🐟', '🪸', '🐬', '🐳']
};

export function ProgressPill({ points, max, theme, isGamified, t, isHighContrast = false }) {
  if (!isGamified) {
    return (
      <div className={`h-3 flex-1 rounded-full ${isHighContrast ? 'bg-white/20' : 'bg-slate-100'}`} />
    );
  }

  // State to track the most recently gained point for animation
  const [justGained, setJustGained] = useState(null);

  useEffect(() => {
    if (points > 0) {
      setJustGained(points - 1);
      const timer = setTimeout(() => setJustGained(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [points]);

  const stages = t.progressStages[theme] || t.progressStages.Natur;
  const icons = STAGE_ICONS[theme] || STAGE_ICONS.Natur;
  
  const stageIndex = Math.min(points, max - 1);
  const stageName = stages[stageIndex];
  const stageIcon = icons[stageIndex];

  return (
    <div className="flex flex-1 flex-col gap-1" role="progressbar" aria-valuenow={points} aria-valuemin={0} aria-valuemax={max} aria-label={stageName}>
      <div className="flex items-end justify-between px-1">
        <div className="flex items-center gap-2">
          {/* Using 'key' forces React to remount the span, triggering the pop-in animation on stage evolution */}
          <span key={stageIcon} className="text-2xl animate-in zoom-in duration-300" aria-hidden="true">{stageIcon}</span>
          <span className={`text-[8px] font-black tracking-wider uppercase ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{stageName}</span>
        </div>
        <span className="text-[9px] font-black text-slate-300">{points} / {max}</span>
      </div>
      <div className="flex gap-1 h-2 w-full mt-1">
        {[...Array(max)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-full transition-all duration-500 ease-out ${
              i < points ? (isHighContrast ? 'bg-white' : 'bg-slate-400') : (isHighContrast ? 'bg-white/20' : 'bg-slate-200')
            } ${
              i === justGained ? 'scale-125 ring-2 ring-current drop-shadow-md z-10' : 'scale-100'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}