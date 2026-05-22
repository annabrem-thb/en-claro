import React, { useState } from 'react';
import BionicText from '../common/BionicText';

/**
 * VisualCategorization Component (Mind-Mapping)
 * 
 * Dyslexia-focused spatial organization strategy:
 * Uses a WCAG-compliant "Tap-to-Select -> Tap-to-Drop" mechanism instead of 
 * native Drag & Drop to ensure full accessibility for motor-impaired users.
 */
export default function VisualCategorization({ 
  data, 
  onSuccess, 
  onError, 
  isHighContrast, 
  bigTargets, 
  bionicReading 
}) {
  const [placements, setPlacements] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  const unplacedItems = data.items.filter((item) => !placements[item.id]);
  const isComplete = unplacedItems.length === 0;

  // WCAG Action: Select an item to be moved
  const handleItemClick = (item) => {
    if (activeItem?.id === item.id) setActiveItem(null);
    else setActiveItem(item);
  };

  // WCAG Action: Drop the selected item into the target bucket
  const handleBucketClick = (bucketId) => {
    if (activeItem) {
      setPlacements((prev) => ({ ...prev, [activeItem.id]: bucketId }));
      setActiveItem(null);
    }
  };

  // WCAG Action: Return an item back to the unplaced pool
  const handleRemoveFromBucket = (itemId, e) => {
    e.stopPropagation();
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  // Non-punitive Self-Correction Validation
  const handleCheck = () => {
    const isAllCorrect = data.items.every((item) => placements[item.id] === item.bucketId);
    
    if (isAllCorrect) {
      onSuccess();
    } else {
      onError();
      // Self-Correction Loop: Keep correct items in buckets, gently return incorrect ones to the pool
      const correctPlacements = {};
      data.items.forEach((item) => {
        if (placements[item.id] === item.bucketId) {
          correctPlacements[item.id] = item.bucketId;
        }
      });
      setPlacements(correctPlacements);
    }
  };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500 gap-8">
      <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400 text-center px-4" aria-live="polite">
        <BionicText text={data.instruction || "Categorize the items"} enabled={bionicReading} />
      </h2>

      {/* Unplaced Items Pool */}
      <div className={`flex flex-wrap justify-center gap-3 w-full p-4 rounded-3xl min-h-[100px] border-2 transition-colors ${activeItem ? (isHighContrast ? 'border-white/50' : 'border-indigo-200 bg-indigo-50/30') : 'border-transparent'}`} aria-label="Available items">
        {unplacedItems.map((item) => (
          <button key={item.id} onClick={() => handleItemClick(item)} className={`px-5 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95 ${activeItem?.id === item.id ? (isHighContrast ? 'bg-white text-black ring-4 ring-white/50' : 'bg-indigo-500 text-white ring-4 ring-indigo-200 shadow-md') : (isHighContrast ? 'bg-black text-white border-2 border-white/50 hover:border-white' : 'bg-white text-slate-700 border-2 border-slate-100 hover:border-slate-300')}`}>
            <BionicText text={item.word} enabled={bionicReading} />
          </button>
        ))}
        {unplacedItems.length === 0 && (
          <span className="text-sm font-bold text-slate-400 my-auto">All items placed</span>
        )}
      </div>

      {/* Target Buckets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full w-max-2xl">
        {data.buckets.map((bucket) => {
          const bucketItems = data.items.filter((item) => placements[item.id] === bucket.id);
          return (
            <button key={bucket.id} onClick={() => handleBucketClick(bucket.id)} disabled={!activeItem && bucketItems.length === 0} className={`relative flex flex-col p-4 sm:p-6 rounded-3xl min-h-[160px] transition-all border-4 text-left ${activeItem ? (isHighContrast ? 'border-white border-dashed bg-white/10 hover:bg-white/20 cursor-pointer' : 'border-indigo-300 border-dashed bg-indigo-50 hover:bg-indigo-100 cursor-pointer') : (isHighContrast ? 'border-white/20 bg-black cursor-default' : 'border-slate-100 bg-slate-50 cursor-default')}`}>
              <div className="flex items-center gap-2 mb-4 pointer-events-none">
                <span className="text-2xl" aria-hidden="true">{bucket.icon}</span>
                <span className={`font-black uppercase tracking-widest text-xs ${isHighContrast ? 'text-white' : 'text-slate-500'}`}>{bucket.label}</span>
              </div>
              <div className="flex flex-wrap gap-2 pointer-events-none">
                {bucketItems.map((item) => (
                  <div key={item.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-sm pointer-events-auto ${isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:bg-red-50'}`} onClick={(e) => handleRemoveFromBucket(item.id, e)} aria-label={`Remove ${item.word}`}>
                    {item.word} <span className="opacity-50" aria-hidden="true">✕</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Verification Action */}
      <button onClick={handleCheck} disabled={!isComplete} className={`w-full max-w-sm mt-4 px-10 py-5 rounded-full font-black uppercase tracking-widest transition-all active:scale-95 text-sm focus-visible:ring-4 focus:outline-none ${!isComplete ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-transparent' : (isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-emerald-500 text-white shadow-xl hover:bg-emerald-400')}`}>
        Check Answers
      </button>
    </div>
  );
}