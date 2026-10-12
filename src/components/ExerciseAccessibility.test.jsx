import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { wordDatabaseEN } from '../data/vocabulary_en.js';
import i18n from '../i18n/config.ts';

import ExerciseContainer from './ExerciseContainer';
import { UserSettingsProvider } from './UserSettingsContext.jsx';

beforeAll(async () => {
  await i18n.changeLanguage('en');
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    }));
});

afterAll(() => i18n.changeLanguage('en'));

const themeStyles = {
  accent: 'text-slate-700',
  bg: 'bg-white',
  button: 'bg-slate-500',
  buttonText: 'text-white',
  border: 'border-slate-200',
  hex: '#000000',
};

function Harness({ currentTask, zenMode = false, language = 'en' }) {
  const { t } = useTranslation();
  return (
    <UserSettingsProvider>
      <ExerciseContainer
        currentTask={currentTask}
        language={language}
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
        zenMode={zenMode}
        voiceAssistant={false}
        isGamified={false}
        userDifficulty={1}
        t={t}
      />
    </UserSettingsProvider>
  );
}

// Every exercise type that has a task heading on first render.
const TYPES = [
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

// Types whose answer options sit in a role="group" named by the heading.
const GROUPED = [
  'grapheme',
  'graphemePhoneme',
  'diagnostic',
  'clock',
  'spatial',
  'sequence',
  'categorization',
];

describe('exercise task heading focus', () => {
  it.each(TYPES)('%s: focus lands on the task heading', (_type, task) => {
    render(<Harness currentTask={task} />);
    const heading = screen.getAllByRole('heading')[0];
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(heading);
  });

  it('keeps a heading to focus in zen mode (visually hidden)', () => {
    render(<Harness currentTask={wordDatabaseEN.graphemes[0]} zenMode />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('sr-only');
    expect(document.activeElement).toBe(heading);
  });

  it('moves focus to the new heading when the task changes', () => {
    const [first, second] = wordDatabaseEN.graphemes;
    const { rerender } = render(
      <div key="a">
        <Harness currentTask={first} />
      </div>,
    );
    // Simulate focus having moved on (e.g. onto an answer button).
    screen.getAllByRole('button')[0].focus();
    expect(document.activeElement).not.toBe(screen.getByRole('heading'));

    // App.jsx remounts the exercise wrapper per task (key=currentIndex).
    rerender(
      <div key="b">
        <Harness currentTask={second} />
      </div>,
    );
    expect(document.activeElement).toBe(screen.getByRole('heading'));
  });
});

describe('exercise answer groups', () => {
  it.each(TYPES.filter(([type]) => GROUPED.includes(type)))(
    '%s: options group is named by the task heading',
    (_type, task) => {
      render(<Harness currentTask={task} />);
      const heading = screen.getAllByRole('heading')[0];
      const group = screen.getByRole('group', { name: heading.textContent });
      expect(group).toHaveAttribute('aria-labelledby', heading.id);
      expect(within(group).getAllByRole('button').length).toBeGreaterThan(0);
    },
  );

  it('context: group is named by instruction and sentence, gap is "Lücke"', async () => {
    await i18n.changeLanguage('de');
    const task = wordDatabaseEN.context[0];
    render(<Harness currentTask={task} language="de" />);

    const gap = screen.getByRole('img', { name: 'Lücke' });
    expect(gap).toHaveTextContent('____');

    const heading = screen.getByRole('heading');
    const sentence = gap.parentElement;
    const group = screen.getByRole('group');
    // The gap contributes its label (not underscores) and the sentence
    // still reads as one piece, with spaces around the gap.
    const name = `${heading.textContent} ${sentence.textContent.replace('____', 'Lücke')}`;
    expect(group).toHaveAccessibleName(name);
    expect(group.getAttribute('aria-labelledby')).toContain(sentence.id);
    expect(heading).toHaveAttribute('aria-describedby', sentence.id);
    await i18n.changeLanguage('en');
  });
});
