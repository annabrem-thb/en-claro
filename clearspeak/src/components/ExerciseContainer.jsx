import React from 'react';

import SpatialExercise from './exercises/SpatialExercise';
import SyllableExercise from './exercises/SyllableExercise';
import GraphemeExercise from './exercises/GraphemeExercise';
import ClockExercise from './exercises/ClockExercise';
import ScrabbleExercise from './exercises/ScrabbleExercise';
import SequenceExercise from './exercises/SequenceExercise';
import MemorySpanExercise from './exercises/MemorySpanExercise';
import PhonemeExercise from './exercises/PhonemeExercise';
import ContextExercise from './exercises/ContextExercise';
import VisualCategorization from './exercises/VisualCategorization.jsx';
import DictationExercise from './exercises/DictationExercise.jsx';
import LookCoverWriteCheck from './exercises/LookCoverWriteCheck.jsx';
import ReadAloudExercise from './exercises/ReadAloudExercise.jsx';

/**
 * ExerciseContainer Component
 * Factory component that determines which exercise module to render 
 * based on the unique properties of the provided task data (Duck Typing).
 */
export default function ExerciseContainer({ currentTask, ...commonProps }) {
  const { t, language } = commonProps;

  if (!currentTask) {
    return <div className="p-6 text-center text-slate-400" role="alert" aria-live="polite">{t?.noData || 'No data'}</div>;
  }

  const exerciseProps = {
    data: currentTask,
    ...commonProps,
  };

  // Duck-typing feature detection to route to the appropriate educational module
  if (currentTask.sentence_part1) return <ContextExercise {...exerciseProps} />;
  if (currentTask.focus)          return <GraphemeExercise {...exerciseProps} />;
  if (currentTask.phonetic)       return <PhonemeExercise {...exerciseProps} />;
  if (currentTask.segments)       return <SyllableExercise {...exerciseProps} />;
  if (currentTask.image)          return <ScrabbleExercise {...exerciseProps} />;
  if (currentTask.timeAnalog)     return <ClockExercise {...exerciseProps} />;
  if (currentTask.items && currentTask.options) return <SpatialExercise {...exerciseProps} />;
  if (currentTask.displayItems)   return <MemorySpanExercise {...exerciseProps} />;
  if (currentTask.buckets && currentTask.items) return <VisualCategorization {...exerciseProps} />;
  if (currentTask.lcwc)           return <LookCoverWriteCheck targetWord={currentTask.word} onSelfEvaluate={(res) => res.correct ? commonProps.onSuccess() : commonProps.onError()} {...exerciseProps} />;
  if (currentTask.dictation)      return <DictationExercise {...exerciseProps} />;
  if (currentTask.correct)        return <SequenceExercise {...exerciseProps} />;
  if (currentTask.readAloud)      return <ReadAloudExercise {...exerciseProps} />;

  return <div className="p-6 text-red-400" role="alert" aria-live="assertive">{t?.formatNotRecognized || 'Format not recognized'}</div>;
}
