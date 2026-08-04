const STAGE_ICONS = {
  Natur: ['🌱', '🌿', '🌿', '🌷', '🌸'],
  Musik: ['𝅘𝅥𝅰', '𝅘𝅥𝅯', '♩', '𝅗𝅥', '🎻'],
  Kunst: ['🖌️', '🎨', '🖼️', '🖼️', '✨'],
  Space: ['🌠', '☄️', '🌙', '🪐', '🚀'],
  Ocean: ['💧', '🐟', '🪸', '🐬', '🐳'],
};

export function ProgressPill({
  points,
  max,
  theme,
  isGamified,
  t,
  isHighContrast = false,
}) {
  if (!isGamified) {
    return (
      <div
        className={`h-3 flex-1 rounded-full ${isHighContrast ? 'bg-white/20' : 'bg-slate-100'}`}
      />
    );
  }

  const progressStages = t('progressStages', { returnObjects: true });
  const stages = progressStages[theme] || progressStages.Natur;
  const icons = STAGE_ICONS[theme] || STAGE_ICONS.Natur;

  const stageIndex = Math.min(points, max - 1);
  const stageName = stages[stageIndex];
  const stageIcon = icons[stageIndex];

  return (
    <div
      className="flex flex-1 flex-col gap-1"
      role="progressbar"
      aria-valuenow={points}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={stageName}
    >
      <div className="flex items-end justify-between px-1">
        <div className="flex items-center gap-2">
          {}
          <span
            key={stageIcon}
            className="animate-in zoom-in text-2xl duration-300"
            aria-hidden="true"
          >
            {stageIcon}
          </span>
          <span
            className={`text-[8px] font-black tracking-wider uppercase ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
          >
            {stageName}
          </span>
        </div>
        <span className="text-[9px] font-black text-slate-300">
          {points} / {max}
        </span>
      </div>
      <div className="mt-1 flex h-2 w-full gap-1">
        {[...Array(max)].map((_, i) => {
          // The pip that was just filled gets a one-shot CSS pulse (pop to
          // 125% with a ring, settle back over ~900ms) driven entirely by a
          // keyframe animation, not JS state — `key` ties it to `points` so
          // remounting retriggers the animation each time a new point comes
          // in, with no setState/setTimeout pair (and the extra render
          // cycle that pairing cost) needed to "un-flash" it afterward.
          const isJustFilled = i === points - 1;
          return (
            <div
              key={isJustFilled ? `filled-${points}` : i}
              className={`flex-1 rounded-full transition-all duration-500 ease-out ${
                i < points
                  ? isHighContrast
                    ? 'bg-white'
                    : 'bg-slate-400'
                  : isHighContrast
                    ? 'bg-white/20'
                    : 'bg-slate-200'
              } ${isJustFilled ? 'animate-pip-pulse z-10' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}
