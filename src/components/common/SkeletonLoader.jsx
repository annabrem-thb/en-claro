export default function SkeletonLoader({ isHighContrast, noFlash = false }) {
  const baseBg = isHighContrast ? 'bg-white/20' : 'bg-slate-200';

  return (
    <div
      className={`flex h-full w-full max-w-md flex-col items-center justify-center gap-8 py-8 ${noFlash ? '' : 'animate-pulse'}`}
      aria-hidden="true"
    >
      {}
      <div className={`h-3 w-1/3 rounded-full ${baseBg}`} />

      {}
      <div className={`h-20 w-3/4 rounded-3xl md:w-2/3 ${baseBg}`} />

      {}
      <div className="mt-4 flex gap-6">
        <div className={`h-16 w-16 rounded-full md:h-20 md:w-20 ${baseBg}`} />
        <div className={`h-16 w-16 rounded-full md:h-20 md:w-20 ${baseBg}`} />
      </div>

      {}
      <div className="mt-4 flex w-full flex-wrap justify-center gap-3">
        <div className={`h-12 w-28 rounded-2xl ${baseBg}`} />
        <div className={`h-12 w-28 rounded-2xl ${baseBg}`} />
        <div className={`h-12 w-28 rounded-2xl ${baseBg}`} />
      </div>
    </div>
  );
}
