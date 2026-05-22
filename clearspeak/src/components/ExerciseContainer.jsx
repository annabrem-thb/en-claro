// 1. Import Shared Hooks
import { useSettings } from '../hooks/useSettings';
import { useExerciseVoice } from '../hooks/useExerciseVoice';
import { useFeedback } from '../hooks/useFeedback';

// 2. Import Constants & Utils
import { useTranslation } from '../i18n/i18n';
import { getExerciseStyles } from '../constants/exerciseStyles';

// 3. Import Exercise Components
import SpatialExercise from './exercises/SpatialExercise';
import SyllableExercise from './exercises/SyllableExercise';
import GraphemeExercise from './exercises/GraphemeExercise';
import ClockExercise from './exercises/ClockExercise';
import ScrabbleExercise from './exercises/ScrabbleExercise';
import SequenceExercise from './exercises/SequenceExercise';
import MemorySpanExercise from './exercises/MemorySpanExercise';
import PhonemeExercise from './exercises/PhonemeExercise';
import ContextExercise from './exercises/ContextExercise';

/**
 * ExerciseContainer - The "Brain" component.
 * It injects all shared logic (voice, sounds, settings) into the specific exercises.
 */
const ExerciseContainer = ({
  data,
  onComplete,
  onMistake,
  language = 'en',
}) => {
  // --- A. Setup Shared Logic ---
  const settings = useSettings();
  const t = useTranslation(language);
  const themeStyles = getExerciseStyles(settings.bigTargets, settings.noFlash);
  const { playSound, triggerVibration } = useFeedback();

  // --- B. Setup Voice Assistant ---
  const { isListening, transcript, speak, startListening } = useExerciseVoice(
    language,
    t,
  );

  // --- C. Handle Success/Error Globally ---
  const handleSuccess = () => {
    playSound('success');
    triggerVibration('success');
    onComplete();
  };

  const handleError = () => {
    playSound('error');
    triggerVibration('error');
    onMistake();
  };

  // --- D. Dynamic Exercise Factory ---
  // This map decides which component to render based on data.type
  const ExerciseMap = {
    spatial: SpatialExercise,
    syllable: SyllableExercise,
    grapheme: GraphemeExercise,
    clock: ClockExercise,
    scrabble: ScrabbleExercise,
    sequence: SequenceExercise,
    memory: MemorySpanExercise,
    phoneme: PhonemeExercise,
    context: ContextExercise,
  };

  const SelectedExercise = ExerciseMap[data.type];

  // If the type is unknown, show a fallback
  if (!SelectedExercise) {
    return (
      <div className="p-10 text-center">Unknown Exercise Type: {data.type}</div>
    );
  }

  // --- E. Prepare Props for the Child ---
  // We bundle everything common into a single object
  const commonProps = {
    data,
    themeStyles,
    t,
    language,
    onSuccess: handleSuccess,
    onError: handleError,
    speak,
    startListening,
    isListening,
    transcript,
    // Accessibility settings
    ...settings,
  };

  return (
    <div className={`mx-auto w-full max-w-4xl ${themeStyles.entry}`}>
      <SelectedExercise {...commonProps} />
    </div>
  );
};

export default ExerciseContainer;
