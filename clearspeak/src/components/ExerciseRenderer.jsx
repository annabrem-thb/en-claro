import React from 'react';

import PhonemeExercise from './exercises/PhonemeExercise';
import SyllableExercise from './exercises/SyllableExercise';
import GraphemeExercise from './exercises/GraphemeExercise';
import ScrabbleExercise from './exercises/ScrabbleExercise';
import ContextExercise from './exercises/ContextExercise';
import ClockExercise from './exercises/ClockExercise';
import SequenceExercise from './exercises/SequenceExercise.jsx';
import SpatialExercise from './exercises/SpatialExercise.jsx';
import MemorySpanExercise from './exercises/MemorySpanExercise';
import VisualCategorization from './exercises/VisualCategorization.jsx';
import DictationExercise from './exercises/DictationExercise.jsx';
import LookCoverWriteCheck from './exercises/LookCoverWriteCheck.jsx';

/**
 * ExerciseRenderer Component
 * Factory component that renders the appropriate exercise component
 * based on the task data (`currentTask`) using Duck Typing.
 */
export function ExerciseRenderer({ currentTask, ...commonProps }) {
  const { t } = commonProps;

  if (!currentTask) {
    return <div className="p-6 text-center text-slate-400">{t.noData || 'No data'}</div>;
  }

  // Duck-typing feature detection to route to the appropriate educational module
  if (currentTask.sentence_part1)
    return <ContextExercise data={currentTask} {...commonProps} />;
  if (currentTask.focus)
    return <GraphemeExercise data={currentTask} {...commonProps} />;
  if (currentTask.phonetic)
    return <PhonemeExercise data={currentTask} {...commonProps} />;
  if (currentTask.segments)
    return <SyllableExercise data={currentTask} {...commonProps} />;
  if (currentTask.image)
    return <ScrabbleExercise data={currentTask} {...commonProps} />;
  if (currentTask.timeAnalog)
    return <ClockExercise data={currentTask} {...commonProps} />;
  if (currentTask.items && currentTask.options)
    return <SpatialExercise data={currentTask} {...commonProps} />;
  if (currentTask.displayItems)
    return <MemorySpanExercise data={currentTask} {...commonProps} />;
  if (currentTask.buckets && currentTask.items)
    return <VisualCategorization data={currentTask} {...commonProps} />;
  if (currentTask.correct)
    return <SequenceExercise data={currentTask} {...commonProps} />;
  if (currentTask.dictation)
    return <DictationExercise data={currentTask} {...commonProps} />;
  if (currentTask.lcwc)
    return <LookCoverWriteCheck targetWord={currentTask.word} onSelfEvaluate={(res) => res.correct ? commonProps.onSuccess() : commonProps.onError()} data={currentTask} {...commonProps} />;

  return <div className="p-6 text-red-400">{t.formatNotRecognized || 'Format not recognized'}</div>;
}
