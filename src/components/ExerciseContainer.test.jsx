import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { describe, it, expect, vi, beforeAll } from 'vitest';

import { wordDatabaseEN } from '../data/vocabulary_en.js';
import i18n from '../i18n/config.ts';

import ExerciseContainer from './ExerciseContainer';
import { UserSettingsProvider } from './UserSettingsContext.jsx';

beforeAll(() => {
  i18n.changeLanguage('en');
  // jsdom doesn't implement matchMedia; UserSettingsProvider's install-prompt
  // effect calls it unconditionally on mount.
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    }));
});

// Minimal stand-in for App.jsx's THEMES[theme] styling object — exercise
// components read Tailwind class fragments off it (`themeStyles.button`,
// `.border`, `.accent`), so it needs the same shape, not real values.
const themeStyles = {
  accent: 'text-slate-700',
  bg: 'bg-white',
  button: 'bg-slate-500',
  buttonText: 'text-white',
  border: 'border-slate-200',
  hex: '#000000',
};

// One representative task per dispatch case in ExerciseContainer's
// EXERCISE_COMPONENTS map (see src/components/ExerciseContainer.jsx). This is
// a regression guard for exactly the kind of drift the old duck-typing
// dispatch (and, before that, the now-deleted duplicate ExerciseRenderer.jsx)
// was prone to: a task's `type` silently rendering the wrong component, or a
// shape mismatch crashing it outright. Real vocabulary entries are used
// rather than hand-rolled fixtures, so a schema change in the data files
// shows up here too.
const CASES = [
  ['phoneme', wordDatabaseEN.phonemes[0]],
  ['grapheme', wordDatabaseEN.graphemes[0]],
  ['graphemePhoneme', wordDatabaseEN.graphemePhoneme[0]],
  ['diagnostic', wordDatabaseEN.diagnostic[0]],
  ['syllable', wordDatabaseEN.syllables[0]],
  ['scrabble', wordDatabaseEN.scrabble[0]],
  ['context', wordDatabaseEN.context[0]],
  ['clock', wordDatabaseEN.clock[0]],
  ['sequence', wordDatabaseEN.sequences[0]],
  ['spatial', wordDatabaseEN.tracking[0]],
  ['categorization', wordDatabaseEN.categorization[0]],
  ['dictation', wordDatabaseEN.dictation[0]],
  ['readAloud', wordDatabaseEN.readAloud[0]],
  ['lookCoverWriteCheck', wordDatabaseEN.lcwc[0]],
];

function Harness({ currentTask }) {
  const { t } = useTranslation();
  return (
    <UserSettingsProvider>
      <ExerciseContainer
        currentTask={currentTask}
        language="en"
        theme="Natur"
        themeStyles={themeStyles}
        speak={vi.fn()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
        bigTargets={false}
        extendedTime={false}
        bionicReading={false}
        isHighContrast={false}
        noFlash={true}
        zenMode={false}
        voiceAssistant={false}
        isGamified={false}
        userDifficulty={1}
        t={t}
      />
    </UserSettingsProvider>
  );
}

describe('ExerciseContainer dispatch', () => {
  it.each(CASES)('renders %s tasks without crashing', (type, task) => {
    expect(task).toBeTruthy();
    expect(task.type).toBe(type);

    const { container } = render(<Harness currentTask={task} />);

    // A crash/format mismatch falls through to ExerciseContainer's own
    // "Format not recognized" error branch — the definitive sign the task's
    // `type` didn't reach a real exercise component.
    expect(container.textContent).not.toBe(i18n.t('formatNotRecognized'));
    expect(container.textContent.trim().length).toBeGreaterThan(0);
  });

  it('shows a "format not recognized" message for an unknown task type', () => {
    const { container } = render(
      <Harness currentTask={{ id: 'x', type: 'not-a-real-type' }} />,
    );
    expect(container.textContent).toBe(i18n.t('formatNotRecognized'));
  });
});
