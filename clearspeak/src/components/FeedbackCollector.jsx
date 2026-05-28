import React, { useState } from 'react';

/**
 * FeedbackCollector Component
 * Renders a modal dialog for collecting UX metrics (NASA-TLX and UEQ-Short).
 * Fully supports accessibility (WCAG), high contrast, reduced motion (noFlash),
 * and enlarged touch targets (bigTargets) for motor-impaired users.
 */
export function FeedbackCollector({ open, onSubmit, onSkip, t, themeStyles, isHighContrast, noFlash, bigTargets }) {
  // Local state for NASA-TLX and UEQ-Short survey metrics
  const [mental, setMental] = useState(3);
  const [effort, setEffort] = useState(3);
  const [frustration, setFrustration] = useState(3);

  if (!open) return null;

  const v = t.feedback || {};

  // Styles enlarging slider thumbs, with dynamic background color injection via CSS variables
  const thumbBase = bigTargets ? "[&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer" : "";
  const thumbColor = isHighContrast ? "[&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:bg-white" : "[&::-webkit-slider-thumb]:bg-[var(--thumb-color)] [&::-moz-range-thumb]:bg-[var(--thumb-color)]";

  // Sub-component for rendering accessible range sliders
  const RangeInput = ({ label, desc, value, setValue, leftLabel, rightLabel }) => (
    <div className={`flex flex-col gap-1.5 sm:gap-2 ${bigTargets ? 'p-4 sm:p-6' : 'p-3 sm:p-4'} rounded-2xl border-2 shrink-0 ${isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider block break-words ${isHighContrast ? 'text-white' : 'text-slate-700'}`}>
            {label}
          </span>
          <span className={`text-[9px] sm:text-[10px] font-medium leading-tight block mt-0.5 break-words ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
            {desc}
          </span>
        </div>
        <span className={`text-lg sm:text-xl font-black shrink-0 ${themeStyles.accent}`}>{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={`${value} out of 5`}
        className={`w-full cursor-pointer rounded-lg appearance-none mt-2 ${isHighContrast ? 'bg-white/30' : 'bg-slate-200'} ${bigTargets ? `h-4 ${thumbBase} ${thumbColor}` : 'h-2'}`}
        style={{ 
          accentColor: isHighContrast ? '#ffffff' : themeStyles?.hex || '#10b981',
          '--thumb-color': isHighContrast ? '#ffffff' : themeStyles?.hex || '#10b981'
        }}
      />
      <div className="flex justify-between mt-1 gap-2">
        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left flex-1 break-words">
          {leftLabel || v.low || 'Low'}
        </span>
        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right flex-1 break-words">
          {rightLabel || v.high || 'High'}
        </span>
      </div>
    </div>
  );

  return (
    // Modal container with ARIA roles for screen reader support
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div 
        className={`relative w-full max-w-md max-h-[98vh] rounded-3xl sm:rounded-4xl shadow-2xl overflow-y-auto flex flex-col ${noFlash ? '' : 'animate-in zoom-in duration-300'} ${isHighContrast ? 'bg-black border-2 border-white' : 'bg-white'}`}
        style={{ scrollbarWidth: 'thin', scrollbarColor: isHighContrast ? '#ffffff #000000' : '#cbd5e1 transparent' }}
      >
        <div className="p-4 sm:p-6 md:p-8 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col gap-4 sm:gap-6">
          <div className="text-center shrink-0">
            <div className="text-3xl sm:text-4xl mb-1 sm:mb-2" aria-hidden="true">🧠</div>
            <h2 id="feedback-title" className={`text-lg sm:text-xl md:text-2xl font-black mb-1 sm:mb-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
              {v.title || 'A moment of reflection'}
            </h2>
            <p className={`text-[10px] sm:text-xs font-medium leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
              {v.desc || 'Your feedback helps us adapt the experience.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 shrink-0">
            <h3 className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/50' : 'text-slate-400'}`}>
              {v.nasaTitle || 'NASA-TLX'}
            </h3>
            <RangeInput label={v.nasa?.mental || v.mental} desc={v.nasa?.mentalDesc || v.mentalDesc} value={mental} setValue={setMental} />
            <RangeInput label={v.nasa?.physical || v.physical} desc={v.nasa?.physicalDesc || v.physicalDesc} value={effort} setValue={setEffort} />
            <RangeInput label={v.nasa?.frustration || v.frustration} desc={v.nasa?.frustrationDesc || v.frustrationDesc} value={frustration} setValue={setFrustration} />
          </div>

          {/* Action buttons with dynamic scaling for accessibility */}
          <div className="flex flex-col gap-2 mt-2 shrink-0">
            <button
              onClick={() => {
              onSubmit({ mental, effort, frustration });
              setMental(3); setEffort(3); setFrustration(3);
            }}
              className={`w-full ${bigTargets ? 'py-4 sm:py-6 text-sm sm:text-base' : 'py-3 sm:py-4 text-xs sm:text-sm'} rounded-full font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all ${isHighContrast ? 'bg-white text-black' : `${themeStyles.button} text-white`}`}
            >
              {v.submit || 'Save'}
            </button>
            <button onClick={onSkip} className={`w-full ${bigTargets ? 'py-3 sm:py-5 text-xs sm:text-sm' : 'py-2 sm:py-3 text-[10px] sm:text-xs'} rounded-full font-black uppercase tracking-widest transition-all ${isHighContrast ? 'text-white/70 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-50'}`}>
              {v.skip || 'Skip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}