// 1. Import Voice Hook
import { useExerciseVoice } from '../hooks/useExerciseVoice';

// 2. Import Exercise Components
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

export default function ExerciseContainer({ currentTask, ...commonProps }) {
  const { t, language } = commonProps;

  // Setup Voice Assistant globally for all exercises
  const { isListening, transcript, startListening } = useExerciseVoice(language, t);

  if (!currentTask) {
    return <div className="p-6 text-center text-slate-400">{t?.noData || 'No data'}</div>;
  }

  // Inject voice properties into the props passed down from App.jsx
  const exerciseProps = {
    data: currentTask,
    ...commonProps,
    isListening,
    transcript,
    startListening,
  };

  // Use duck-typing feature detection because word databases lack strict 'type' properties
  if (currentTask.sentence_part1) return <ContextExercise {...exerciseProps} />;
  if (currentTask.focus)          return <GraphemeExercise {...exerciseProps} />;
  if (currentTask.phonetic)       return <PhonemeExercise {...exerciseProps} />;
  if (currentTask.segments)       return <SyllableExercise {...exerciseProps} />;
  if (currentTask.image)          return <ScrabbleExercise {...exerciseProps} />;
  if (currentTask.timeAnalog)     return <ClockExercise {...exerciseProps} />;
  if (currentTask.items && currentTask.options) return <SpatialExercise {...exerciseProps} />;
  if (currentTask.displayItems)   return <MemorySpanExercise {...exerciseProps} />;
  if (currentTask.buckets && currentTask.items) return <VisualCategorization {...exerciseProps} />;
  if (currentTask.lcwc)           return <LookCoverWriteCheck targetWord={currentTask.word} onSelfEvaluate={(res) => res.correct ? commonProps.onSuccess() : commonProps.onError()} />;
  if (currentTask.dictation)      return <DictationExercise {...exerciseProps} />;
  if (currentTask.correct)        return <SequenceExercise {...exerciseProps} />;

  return <div className="p-6 text-red-400">{t?.formatNotRecognized || 'Format not recognized'}</div>;
}
