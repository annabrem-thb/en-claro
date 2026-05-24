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
  const [attractiveness, setAttractiveness] = useState(3);
  const [stimulation, setStimulation] = useState(3);

  if (!open) return null;

  const v = t.feedback || {};

  // Sub-component for rendering accessible range sliders
  const RangeInput = ({ label, desc, value, setValue, leftLabel, rightLabel }) => (
    <div className={`flex flex-col gap-2 ${bigTargets ? 'p-6' : 'p-4'} rounded-2xl border-2 ${isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex justify-between items-end">
        <div>
          <span className={`text-xs font-black uppercase tracking-wider block ${isHighContrast ? 'text-white' : 'text-slate-700'}`}>
            {label}
          </span>
          <span className={`text-[10px] font-medium leading-tight ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
            {desc}
          </span>
        </div>
        <span className={`text-lg font-black ${themeStyles.accent}`}>{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className={`w-full cursor-pointer bg-slate-200 rounded-lg appearance-none mt-2 ${bigTargets ? 'h-4' : 'h-2'}`}
        style={{ accentColor: isHighContrast ? '#ffffff' : themeStyles?.hex || '#10b981' }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {leftLabel || v.low || 'Low'}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {rightLabel || v.high || 'High'}
        </span>
      </div>
    </div>
  );

  return (
    // Modal container with ARIA roles for screen reader support
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className={`w-full max-w-md p-6 sm:p-8 rounded-4xl shadow-2xl flex flex-col gap-3 ${noFlash ? '' : 'animate-in zoom-in duration-300'} ${isHighContrast ? 'bg-black border-2 border-white' : 'bg-white'} max-h-[95vh]`}>
        <div className="text-center">
          <div className="text-4xl mb-2" aria-hidden="true">🧠</div>
          <h2 id="feedback-title" className={`text-xl sm:text-2xl font-black mb-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
            {v.title || 'A moment of reflection'}
          </h2>
          <p className={`text-xs font-medium leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
            {v.desc || 'Your feedback helps us adapt the experience.'}
          </p>
        </div>

        <div className="flex flex-col gap-4 my-2 overflow-y-auto pr-1 pb-2">
          <div className="flex flex-col gap-2">
            <h3 className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/50' : 'text-slate-400'}`}>
              {v.nasaTitle || 'NASA-TLX'}
            </h3>
            <RangeInput label={v.mental} desc={v.mentalDesc} value={mental} setValue={setMental} />
            <RangeInput label={v.physical} desc={v.physicalDesc} value={effort} setValue={setEffort} />
            <RangeInput label={v.frustration} desc={v.frustrationDesc} value={frustration} setValue={setFrustration} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className={`text-xs font-black uppercase tracking-widest ${isHighContrast ? 'text-white/50' : 'text-slate-400'}`}>
              {v.ueqTitle || 'UEQ-Short'}
            </h3>
            <RangeInput label={v.ueqAttractiveness} value={attractiveness} setValue={setAttractiveness} leftLabel={v.ueqAttrLeft} rightLabel={v.ueqAttrRight} />
            <RangeInput label={v.ueqStimulation} value={stimulation} setValue={setStimulation} leftLabel={v.ueqStimLeft} rightLabel={v.ueqStimRight} />
          </div>
        </div>

        {/* Action buttons with dynamic scaling for accessibility */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => {
              onSubmit({ mental, effort, frustration, attractiveness, stimulation });
              setMental(3); setEffort(3); setFrustration(3); setAttractiveness(3); setStimulation(3);
            }}
            className={`w-full ${bigTargets ? 'py-6 text-base' : 'py-4 text-sm'} rounded-full font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all ${isHighContrast ? 'bg-white text-black' : `${themeStyles.button} text-white`}`}
          >
            {v.submit || 'Save'}
          </button>
          <button onClick={onSkip} className={`w-full ${bigTargets ? 'py-5 text-sm' : 'py-3 text-xs'} rounded-full font-black uppercase tracking-widest transition-all ${isHighContrast ? 'text-white/70 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-50'}`}>
            {v.skip || 'Skip'}
          </button>
        </div>
      </div>
    </div>
  );
}