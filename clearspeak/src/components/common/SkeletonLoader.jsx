import React from 'react';

export default function SkeletonLoader({ isHighContrast }) {
  const baseBg = isHighContrast ? 'bg-white/20' : 'bg-slate-200';
  
  return (
    <div className="flex w-full h-full max-w-md flex-col items-center justify-center animate-pulse py-8 gap-8" aria-hidden="true">
      {}
      <div className={`h-3 w-1/3 rounded-full ${baseBg}`} />

      {}
      <div className={`h-20 w-3/4 md:w-2/3 rounded-3xl ${baseBg}`} />

      {}
      <div className="flex gap-6 mt-4">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${baseBg}`} />
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${baseBg}`} />
      </div>

      {}
      <div className="flex flex-wrap justify-center gap-3 w-full mt-4">
        <div className={`h-12 w-28 rounded-2xl ${baseBg}`} />
        <div className={`h-12 w-28 rounded-2xl ${baseBg}`} />
        <div className={`h-12 w-28 rounded-2xl ${baseBg}`} />
      </div>
    </div>
  );
}