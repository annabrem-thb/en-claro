import React, { useState, useEffect, useCallback } from 'react';
import BionicText from '../common/BionicText';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

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
  bionicReading,
  noFlash = false,
  zenMode = false,
  speak,
  extendedTime,
  t,
  language,
  voiceAssistant = false,
}) {
  const [placements, setPlacements] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [isShowingCorrection, setIsShowingCorrection] = useState(false);
  const { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  const clearAudioTimeouts = useCallback(() => {
    clearAllTimeouts();
    setActiveHighlight(null);
  }, [clearAllTimeouts]);

  useEffect(() => {
    return () => {
      clearAudioTimeouts();
      window.speechSynthesis.cancel();
      setIsShowingCorrection(false);
    };
  }, [clearAudioTimeouts]);

  const unplacedItems = data.items.filter((item) => !placements[item.id]);
  const isComplete = unplacedItems.length === 0;

  const readCategorization = useCallback(() => {
    window.speechSynthesis.cancel();
    clearAudioTimeouts();

    let delayAcc = 0;
    const fallbacks = {
      pl: "Przyporządkuj elementy",
      de: "Ordne die Elemente zu",
      en: "Categorize the items"
    };
    const instruction = data.instruction || t?.categorizeItems || (fallbacks[language] || fallbacks.en);
    setSafeTimeout(() => { if (speak) speak(instruction, extendedTime); }, delayAcc);
    delayAcc += instruction.length * (extendedTime ? 100 : 75) + 1500;

    data.buckets.forEach((bucket) => {
      const bText = bucket.label;
      const stepDuration = bText.length * (extendedTime ? 100 : 75) + 1500;
      setSafeTimeout(() => {
        setActiveHighlight(`bucket-${bucket.id}`);
        if(speak) speak(bText);
      }, delayAcc);
      setSafeTimeout(() => setActiveHighlight(null), delayAcc + stepDuration - 200);
      delayAcc += stepDuration;
    });

    unplacedItems.forEach((item) => {
      const iText = item.word;
      const stepDuration = iText.length * (extendedTime ? 100 : 75) + 1500;
      setSafeTimeout(() => {
        setActiveHighlight(`item-${item.id}`);
        if(speak) speak(iText);
      }, delayAcc);
      setSafeTimeout(() => setActiveHighlight(null), delayAcc + stepDuration - 200);
      delayAcc += stepDuration;
    });
  }, [data, unplacedItems, speak, extendedTime, setSafeTimeout, clearAudioTimeouts, t]);

  // WCAG Action: Select an item to be moved
  const handleItemClick = (item) => {
    if (isShowingCorrection) return;
    if (activeItem?.id === item.id) setActiveItem(null);
    else setActiveItem(item);
  };

  // WCAG Action: Drop the selected item into the target bucket
  const handleBucketClick = (bucketId) => {
    if (isShowingCorrection) return;
    if (activeItem) {
      setPlacements((prev) => ({ ...prev, [activeItem.id]: bucketId }));
      setActiveItem(null);
    }
  };

  // WCAG Action: Return an item back to the unplaced pool
  const handleRemoveFromBucket = (itemId, e) => {
    e.stopPropagation();
    if (isShowingCorrection) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  // Non-punitive Self-Correction Validation
  const handleCheck = () => {
    if (isShowingCorrection) return;
    const isAllCorrect = data.items.every((item) => placements[item.id] === item.bucketId);
    
    if (isAllCorrect) {
      onSuccess();
    } else {
      onError();
      setIsShowingCorrection(true);
      setActiveItem(null);

      // Self-Correction Loop: Keep correct items in buckets, gently return incorrect ones to the pool
      const correctPlacements = {};
      const incorrectItems = [];
      data.items.forEach((item) => {
        if (placements[item.id] === item.bucketId) {
          correctPlacements[item.id] = item.bucketId;
        } else {
          incorrectItems.push(item);
        }
      });
      setPlacements(correctPlacements);

      // Visual and auditory hint for the first incorrect item
      if (incorrectItems.length > 0) {
        const hintItem = incorrectItems[0];
        const targetBucket = data.buckets.find(b => b.id === hintItem.bucketId);

        setSafeTimeout(() => {
          window.speechSynthesis.cancel();
          clearAudioTimeouts();

          // 1. Highlight and read the tile that returned to the pool
          setActiveHighlight(`item-${hintItem.id}`);
          if (speak) speak(`${hintItem.word}`, extendedTime);

          const itemDur = hintItem.word.length * (extendedTime ? 100 : 75) + 1500;
          const bucketDur = targetBucket.label.length * (extendedTime ? 100 : 75) + 1500;

          // 2. Then highlight the target bucket
          setSafeTimeout(() => {
            setActiveHighlight(`bucket-${targetBucket.id}`);
            if (speak) speak(`${targetBucket.label}`, extendedTime);
          }, itemDur);

          // 3. Clear highlights and unlock the interface
          setSafeTimeout(() => {
            setActiveHighlight(null);
            setIsShowingCorrection(false);
          }, itemDur + bucketDur);

        }, extendedTime ? 3500 : 2500); // Wait for the error message
      } else {
        setIsShowingCorrection(false);
      }
    }
  };

  // Dynamic classes for Accessibility scaling
  const animClass = noFlash ? '' : 'animate-in fade-in duration-500';
  const itemPadding = bigTargets ? 'px-6 py-4 sm:px-8 sm:py-5 text-base sm:text-lg' : 'px-4 py-3 sm:px-5 sm:py-3 text-xs sm:text-sm';
  const bucketMinHeight = bigTargets ? 'min-h-[160px] sm:min-h-[200px]' : 'min-h-[140px] sm:min-h-[160px]';

  return (
    <div className={`flex flex-col items-center w-full ${animClass} gap-8`}>
      {!zenMode && (
        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400 text-center px-4" aria-live="polite">
          <BionicText text={data.instruction || t?.categorizeItems || (language === 'pl' ? 'Przyporządkuj elementy' : language === 'de' ? 'Ordne die Elemente zu' : 'Categorize the items')} enabled={bionicReading} />
        </h2>
      )}

      {voiceAssistant && (
        <div className="flex w-full justify-center">
          <TTSController
            onReadAloud={readCategorization}
            pauseAllTimeouts={pauseAllTimeouts}
            resumeAllTimeouts={resumeAllTimeouts}
            t={t}
            controlBtnSize={bigTargets ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl'}
          />
        </div>
      )}

      {/* Unplaced Items Pool */}
      <div className={`flex flex-wrap justify-center gap-3 w-full p-4 rounded-3xl min-h-[100px] border-2 transition-colors ${activeItem ? (isHighContrast ? 'border-white/50' : 'border-indigo-200 bg-indigo-50/30') : 'border-transparent'}`} aria-label="Available items">
        {unplacedItems.map((item) => (
          <button key={item.id} disabled={isShowingCorrection} onClick={() => handleItemClick(item)} className={`${itemPadding} rounded-2xl font-bold shadow-sm md:shadow-none transition-all active:scale-95 disabled:opacity-80 ${
            activeItem?.id === item.id 
              ? (isHighContrast ? 'bg-white text-black ring-4 ring-white/50' : 'bg-indigo-500 text-white ring-4 ring-indigo-200 shadow-md') 
              : activeHighlight === `item-${item.id}`
                ? 'scale-105 ring-4 ring-yellow-400 bg-yellow-50 border-yellow-400 text-slate-900 shadow-xl z-10'
                : (isHighContrast ? 'bg-black text-white border-2 border-white/50 hover:border-white' : 'bg-white text-slate-700 border-2 border-slate-100 hover:border-slate-300')
          }`}>
            <BionicText text={item.word} enabled={bionicReading} />
          </button>
        ))}
        {unplacedItems.length === 0 && (
          <span className="text-sm font-bold text-slate-400 my-auto">
            {language === 'pl' ? 'Wszystkie elementy przypisane' : language === 'de' ? 'Alle Elemente zugeordnet' : 'All items placed'}
          </span>
        )}
      </div>

      {/* Target Buckets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full w-max-2xl">
        {data.buckets.map((bucket) => {
          const bucketItems = data.items.filter((item) => placements[item.id] === bucket.id);
          return (
            <button key={bucket.id} onClick={() => handleBucketClick(bucket.id)} disabled={(!activeItem && bucketItems.length === 0) || isShowingCorrection} className={`relative flex flex-col p-4 sm:p-6 rounded-3xl ${bucketMinHeight} transition-all border-4 text-left ${
              activeHighlight === `bucket-${bucket.id}`
                ? 'ring-4 ring-yellow-400 bg-yellow-50 border-yellow-400 scale-105 z-10'
                : activeItem 
                  ? (isHighContrast ? 'border-white border-dashed bg-white/10 hover:bg-white/20 cursor-pointer' : 'border-indigo-300 border-dashed bg-indigo-50 hover:bg-indigo-100 cursor-pointer') 
                  : (isHighContrast ? 'border-white/20 bg-black cursor-default' : 'border-slate-100 bg-slate-50 cursor-default')
            }`}>
              <div className="flex items-center gap-2 mb-4 pointer-events-none">
                <span className="text-2xl" aria-hidden="true">{bucket.icon}</span>
                <span className={`font-black uppercase tracking-widest text-xs ${isHighContrast ? 'text-white' : 'text-slate-500'}`}>{bucket.label}</span>
              </div>
              <div className="flex flex-wrap gap-2 pointer-events-none">
                {bucketItems.map((item) => (
                  <div key={item.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-sm pointer-events-auto ${isShowingCorrection ? 'opacity-70 grayscale cursor-not-allowed' : (isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:bg-red-50')}`} onClick={(e) => handleRemoveFromBucket(item.id, e)} aria-label={`Remove ${item.word}`}>
                    {item.word} <span className="opacity-50" aria-hidden="true">✕</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Verification Action */}
      <button onClick={handleCheck} disabled={!isComplete || isShowingCorrection} className={`w-full max-w-sm mt-4 px-10 py-5 rounded-full font-black uppercase tracking-widest transition-all active:scale-95 text-sm focus-visible:ring-4 focus:outline-none ${(!isComplete || isShowingCorrection) ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-transparent' : (isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-emerald-500 text-white shadow-xl hover:bg-emerald-400')}`}>
        {t?.check || (language === 'pl' ? 'Sprawdź odpowiedzi' : language === 'de' ? 'Antworten überprüfen' : 'Check Answers')}
      </button>
    </div>
  );
}