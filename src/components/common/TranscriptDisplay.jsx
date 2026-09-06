// Every exercise with speech-to-text input shows the same pair of prompts —
// what the mic heard once there's a transcript, an idle hint before that —
// each hand-rolled per exercise. Most of them hardcoded the transcript's own
// <span> to text-slate-600 regardless of isHighContrast, which reads as
// near-invisible against that mode's black background; a few hardcoded the
// whole block that way. Centralizing it here means every exercise gets the
// isHighContrast branch for free instead of relying on each copy staying in
// sync by hand.
export default function TranscriptDisplay({
  transcript,
  idleText,
  isHighContrast = false,
  t,
  className = 'mb-2 shrink-0 text-center text-[10px] sm:mb-3 sm:text-xs',
}) {
  if (transcript) {
    return (
      <p
        className={`${className} font-black tracking-widest uppercase ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
      >
        {t('heard')}:{' '}
        <span className={isHighContrast ? 'text-white' : 'text-slate-600'}>
          {transcript}
        </span>
      </p>
    );
  }
  if (!idleText) return null;
  return (
    <p
      className={`${className} font-medium ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
    >
      {idleText}
    </p>
  );
}
