import React, { useState, useEffect, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';

function VisualCategorization({
  data,
  onSuccess,
  onError,
  isHighContrast,
  bigTargets,
  bionicReading,
  noFlash = false,
  zenMode = false,
  speak,
  ttsFallback,
  extendedTime,
  t,
  voiceAssistant = false,
}) {
  const [placements, setPlacements] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [isShowingCorrection, setIsShowingCorrection] = useState(false);
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

  const clearAudioTimeouts = useCallback(() => {
    clearAllTimeouts();
    setActiveHighlight(null);
  }, [clearAllTimeouts]);

  useEffect(() => {
    return () => {
      clearAudioTimeouts();
      window.speechSynthesis?.cancel();
      setIsShowingCorrection(false);
    };
  }, [clearAudioTimeouts]);

  const unplacedItems = data.items.filter((item) => !placements[item.id]);
  const isComplete = unplacedItems.length === 0;

  const readCategorization = useCallback(() => {
    clearAudioTimeouts();

    let delayAcc = 0;
    const instruction =
      data.instruction || t('categorizeItems') || 'Categorize the items';
    setSafeTimeout(() => {
      if (speak) speak(instruction, extendedTime);
    }, delayAcc);
    delayAcc += instruction.length * (extendedTime ? 100 : 75) + 1500;

    data.buckets.forEach((bucket) => {
      const bText = bucket.label;
      const stepDuration = bText.length * (extendedTime ? 100 : 75) + 1500;
      setSafeTimeout(() => {
        setActiveHighlight(`bucket-${bucket.id}`);
        if (speak) speak(bText);
      }, delayAcc);
      setSafeTimeout(
        () => setActiveHighlight(null),
        delayAcc + stepDuration - 200,
      );
      delayAcc += stepDuration;
    });

    unplacedItems.forEach((item) => {
      const iText = item.word;
      const stepDuration = iText.length * (extendedTime ? 100 : 75) + 1500;
      setSafeTimeout(() => {
        setActiveHighlight(`item-${item.id}`);
        if (speak) speak(iText);
      }, delayAcc);
      setSafeTimeout(
        () => setActiveHighlight(null),
        delayAcc + stepDuration - 200,
      );
      delayAcc += stepDuration;
    });
  }, [
    data,
    unplacedItems,
    speak,
    extendedTime,
    setSafeTimeout,
    clearAudioTimeouts,
    t,
  ]);

  useAutoReadAloud(voiceAssistant, readCategorization);

  const handleItemClick = (item) => {
    if (isShowingCorrection) return;
    if (activeItem?.id === item.id) setActiveItem(null);
    else setActiveItem(item);
  };

  const handleBucketClick = (bucketId) => {
    if (isShowingCorrection) return;
    if (activeItem) {
      setPlacements((prev) => ({ ...prev, [activeItem.id]: bucketId }));
      setActiveItem(null);
    }
  };

  const handleRemoveFromBucket = (itemId, e) => {
    e.stopPropagation();
    if (isShowingCorrection) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleCheck = () => {
    if (isShowingCorrection) return;
    const isAllCorrect = data.items.every(
      (item) => placements[item.id] === item.bucketId,
    );

    if (isAllCorrect) {
      onSuccess();
    } else {
      onError();
      setIsShowingCorrection(true);
      setActiveItem(null);

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

      if (incorrectItems.length > 0) {
        const hintItem = incorrectItems[0];
        const targetBucket = data.buckets.find(
          (b) => b.id === hintItem.bucketId,
        );

        setSafeTimeout(
          () => {
            clearAudioTimeouts();

            setActiveHighlight(`item-${hintItem.id}`);
            if (speak) speak(`${hintItem.word}`, extendedTime);

            const itemDur =
              hintItem.word.length * (extendedTime ? 100 : 75) + 1500;
            const bucketDur =
              targetBucket.label.length * (extendedTime ? 100 : 75) + 1500;

            setSafeTimeout(() => {
              setActiveHighlight(`bucket-${targetBucket.id}`);
              if (speak) speak(`${targetBucket.label}`, extendedTime);
            }, itemDur);

            setSafeTimeout(() => {
              setActiveHighlight(null);
              setIsShowingCorrection(false);
            }, itemDur + bucketDur);
          },
          extendedTime ? 3500 : 2500,
        );
      } else {
        setIsShowingCorrection(false);
      }
    }
  };

  const animClass = noFlash ? '' : 'animate-in fade-in duration-500';

  const maxWordLen = Math.max(...data.items.map((i) => i.word.length), 0);
  const isLong = maxWordLen > 10;
  const isVeryLong = maxWordLen > 15;

  const itemPadding = bigTargets
    ? isVeryLong
      ? 'px-3 py-2 sm:px-4 sm:py-3 text-sm'
      : isLong
        ? 'px-4 py-3 sm:px-6 sm:py-4 text-base'
        : 'px-6 py-4 sm:px-8 sm:py-5 text-base sm:text-lg'
    : isVeryLong
      ? 'px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs'
      : isLong
        ? 'px-3 py-2 sm:px-4 sm:py-2 text-xs'
        : 'px-4 py-3 sm:px-5 sm:py-3 text-xs sm:text-sm';
  const bucketMinHeight = bigTargets
    ? isVeryLong
      ? 'min-h-[120px] sm:min-h-[160px]'
      : 'min-h-[160px] sm:min-h-[200px]'
    : isVeryLong
      ? 'min-h-[100px] sm:min-h-[120px]'
      : 'min-h-[140px] sm:min-h-[160px]';

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col items-center justify-start ${animClass} gap-2 overflow-hidden px-2 py-2 sm:gap-4`}
    >
      {!zenMode && (
        <h2
          className={`mx-auto max-w-[65ch] shrink-0 px-4 text-center text-xs font-black tracking-[0.15em] uppercase sm:text-sm ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
          aria-live="polite"
        >
          <BionicText
            text={
              data.instruction || t('categorizeItems') || 'Categorize the items'
            }
            enabled={bionicReading}
          />
        </h2>
      )}

      <ExerciseControlsRow className="flex w-full shrink-0 justify-center">
        <TTSController
          onReadAloud={readCategorization}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          controlBtnSize={
            bigTargets ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl'
          }
          noFlash={noFlash}
          ttsFallback={ttsFallback}
        />
      </ExerciseControlsRow>

      {}
      <div
        className={`no-scrollbar flex max-h-[35dvh] min-h-15 w-full shrink flex-wrap justify-center gap-2 overflow-y-auto rounded-3xl border-2 p-2 transition-colors sm:min-h-20 sm:gap-3 sm:p-3 ${activeItem ? (isHighContrast ? 'border-white/50' : 'border-indigo-200 bg-indigo-50/30') : 'border-transparent'}`}
        aria-label="Available items"
      >
        {unplacedItems.map((item) => (
          <button
            key={item.id}
            disabled={isShowingCorrection}
            onClick={() => handleItemClick(item)}
            className={`${itemPadding} rounded-2xl font-bold shadow-sm transition-all active:scale-95 disabled:opacity-80 md:shadow-none ${
              activeItem?.id === item.id
                ? isHighContrast
                  ? 'bg-white text-black ring-4 ring-white/50'
                  : 'bg-indigo-500 text-white shadow-md ring-4 ring-indigo-200'
                : activeHighlight === `item-${item.id}`
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : isHighContrast
                    ? 'border-2 border-white/50 bg-black text-white hover:border-white'
                    : 'border-2 border-slate-100 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <BionicText text={item.word} enabled={bionicReading} />
          </button>
        ))}
        {unplacedItems.length === 0 && (
          <span className="my-auto text-sm font-bold text-slate-600">
            {t('allItemsPlaced') || 'All items placed'}
          </span>
        )}
      </div>

      {}
      <div className="no-scrollbar grid max-h-full min-h-0 w-full max-w-2xl shrink grid-cols-1 gap-2 overflow-y-auto p-1 sm:grid-cols-2 sm:gap-4">
        {data.buckets.map((bucket) => {
          const bucketItems = data.items.filter(
            (item) => placements[item.id] === bucket.id,
          );
          const bucketDisabled =
            (!activeItem && bucketItems.length === 0) || isShowingCorrection;
          return (
            <div
              key={bucket.id}
              role="button"
              tabIndex={bucketDisabled ? -1 : 0}
              aria-disabled={bucketDisabled}
              aria-label={bucket.label}
              onClick={() => !bucketDisabled && handleBucketClick(bucket.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !bucketDisabled) {
                  e.preventDefault();
                  handleBucketClick(bucket.id);
                }
              }}
              className={`relative flex flex-col rounded-3xl p-4 sm:p-6 ${bucketMinHeight} border-4 text-left transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 ${
                activeHighlight === `bucket-${bucket.id}`
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 ring-4 ring-yellow-400'
                  : activeItem
                    ? isHighContrast
                      ? 'cursor-pointer border-dashed border-white bg-white/10 hover:bg-white/20'
                      : 'cursor-pointer border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100'
                    : isHighContrast
                      ? 'cursor-default border-white/20 bg-black'
                      : 'cursor-default border-slate-100 bg-slate-50'
              }`}
            >
              <div className="pointer-events-none mb-4 flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  {bucket.icon}
                </span>
                <span
                  className={`text-xs font-black tracking-widest uppercase ${isHighContrast ? 'text-white' : 'text-slate-500'}`}
                >
                  {bucket.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {bucketItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isShowingCorrection}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold shadow-sm transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400 ${isShowingCorrection ? 'cursor-not-allowed opacity-70 grayscale' : isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'border border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50'}`}
                    onClick={(e) => handleRemoveFromBucket(item.id, e)}
                    aria-label={`Remove ${item.word}`}
                  >
                    {item.word}{' '}
                    <span className="opacity-50" aria-hidden="true">
                      ✕
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {data.incorrectExamples && data.incorrectExamples.length > 0 && (
        <div
          className={`w-full max-w-2xl shrink-0 rounded-2xl border-2 border-dashed p-3 sm:p-4 ${isHighContrast ? 'border-white/40 bg-black' : 'border-amber-200 bg-amber-50'}`}
        >
          <h4
            className={`mb-2 text-center text-[10px] font-black tracking-widest uppercase sm:text-xs ${isHighContrast ? 'text-white' : 'text-amber-800'}`}
          >
            {t('incorrectSpellingsTitle') ||
              'Watch out for these common mistakes'}
          </h4>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {data.incorrectExamples.map((ex, i) => (
              <span
                key={i}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${isHighContrast ? 'bg-white text-black' : 'bg-white text-slate-700'}`}
              >
                <span className="text-red-500 line-through">{ex.wrong}</span>
                <span aria-hidden="true">→</span>
                <span className="text-emerald-700">{ex.correct}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {}
      <button
        onClick={handleCheck}
        disabled={!isComplete || isShowingCorrection}
        className={`mt-auto w-full max-w-sm shrink-0 rounded-full px-10 py-4 pt-2 text-sm font-black tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-4 active:scale-95 sm:py-5 sm:pt-4 ${!isComplete || isShowingCorrection ? 'cursor-not-allowed border-2 border-transparent bg-slate-100 text-slate-300' : isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-emerald-700 text-white shadow-xl hover:bg-emerald-600'}`}
      >
        {t('checkAnswers') || t('check') || 'Check Answers'}
      </button>
    </div>
  );
}

export default React.memo(VisualCategorization);
