import ClockExercise from './exercises/ClockExercise';
import ContextExercise from './exercises/ContextExercise';
import DictationExercise from './exercises/DictationExercise.jsx';
import GraphemeExercise from './exercises/GraphemeExercise';
import GraphemePhonemeMatchExercise from './exercises/GraphemePhonemeMatchExercise.jsx';
import LookCoverWriteCheck from './exercises/LookCoverWriteCheck.jsx';
import MelodyMemoryExercise from './exercises/MelodyMemoryExercise.jsx';
import MemorySpanExercise from './exercises/MemorySpanExercise.jsx';
import PhonemeExercise from './exercises/PhonemeExercise';
import ReadAloudExercise from './exercises/ReadAloudExercise.jsx';
import ReadingComprehensionExercise from './exercises/ReadingComprehensionExercise.jsx';
import RhythmMemoryExercise from './exercises/RhythmMemoryExercise.jsx';
import RhythmTapExercise from './exercises/RhythmTapExercise.jsx';
import ScrabbleExercise from './exercises/ScrabbleExercise';
import SequenceExercise from './exercises/SequenceExercise';
import SpatialExercise from './exercises/SpatialExercise';
import SyllableExercise from './exercises/SyllableExercise';
import VisualCategorization from './exercises/VisualCategorization.jsx';

// Every vocabulary/task entry carries an explicit `type` field (see
// src/data/vocabulary_*.js) naming exactly one of the cases below — this
// replaces the old duck-typing dispatch that guessed the exercise kind from
// which data fields happened to be present (e.g. `focus`, `segments`,
// `items && options`), which broke silently whenever two categories shared a
// field name (the `diagnostic` category's `focus` field was being misrouted
// into GraphemeExercise for exactly this reason).
const EXERCISE_COMPONENTS = {
  phoneme: PhonemeExercise,
  grapheme: GraphemeExercise,
  graphemePhoneme: GraphemePhonemeMatchExercise,
  diagnostic: GraphemeExercise, // same question+options shape as `grapheme`
  syllable: SyllableExercise,
  scrabble: ScrabbleExercise,
  context: ContextExercise,
  clock: ClockExercise,
  sequence: SequenceExercise,
  spatial: SpatialExercise,
  categorization: VisualCategorization,
  memorySpan: MemorySpanExercise,
  dictation: DictationExercise,
  readAloud: ReadAloudExercise,
  comprehension: ReadingComprehensionExercise,
  rhythmTap: RhythmTapExercise,
  rhythmMemory: RhythmMemoryExercise,
  melodyMemory: MelodyMemoryExercise,
  // `lookCoverWriteCheck` is handled separately below — it needs an
  // onSelfEvaluate wrapper the other components don't.
};

export default function ExerciseContainer({ currentTask, ...commonProps }) {
  const { t } = commonProps;

  if (!currentTask) {
    return (
      <div
        className="p-6 text-center text-slate-600"
        role="alert"
        aria-live="polite"
      >
        {t?.('noData') || 'No data'}
      </div>
    );
  }

  const exerciseProps = {
    data: currentTask,
    ...commonProps,
  };

  if (currentTask.type === 'lookCoverWriteCheck') {
    return (
      <LookCoverWriteCheck
        targetWord={currentTask.word}
        onSelfEvaluate={(res) =>
          res.correct ? commonProps.onSuccess() : commonProps.onError()
        }
        {...exerciseProps}
      />
    );
  }

  const Component = EXERCISE_COMPONENTS[currentTask.type];
  if (Component) {
    return <Component {...exerciseProps} />;
  }

  return (
    <div className="p-6 text-red-400" role="alert" aria-live="assertive">
      {t?.('formatNotRecognized') || 'Format not recognized'}
    </div>
  );
}
