import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { wordDatabaseEN } from '../../data/vocabulary_en.js';

import GraphemePhonemeMatchExercise from './GraphemePhonemeMatchExercise.jsx';

const themeStyles = {
  button: 'bg-slate-500',
  buttonText: 'text-white',
};

const baseProps = {
  themeStyles,
  language: 'en',
  t: (key, opts) =>
    key === 'optionPrefix' ? `Option ${opts.number}:` : key,
  speak: vi.fn(),
  voiceAssistant: false,
};

describe('GraphemePhonemeMatchExercise', () => {
  it('phonemeToGrapheme direction: tapping the matching spelling submits immediately', () => {
    // id 1 is odd -> phonemeToGrapheme (hear a sound, pick the written form).
    const data = wordDatabaseEN.graphemePhoneme.find((item) => item.id === 1);
    const onSuccess = vi.fn();
    const onError = vi.fn();

    render(
      <GraphemePhonemeMatchExercise
        {...baseProps}
        data={data}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );

    fireEvent.click(screen.getByText(data.grapheme));

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it('graphemeToPhoneme direction: a first tap on an audio option previews it without submitting, a second tap submits', () => {
    // id 2 is even -> graphemeToPhoneme (see the written form, pick a sound).
    const data = wordDatabaseEN.graphemePhoneme.find((item) => item.id === 2);
    const onSuccess = vi.fn();
    const onError = vi.fn();

    render(
      <GraphemePhonemeMatchExercise
        {...baseProps}
        data={data}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );

    // The grapheme is shown as the visual prompt; option buttons carry only
    // a generic "Option N" label and a speaker icon, never their own text —
    // revealing it would hand over the answer in this direction.
    expect(screen.getByText(data.grapheme)).toBeInTheDocument();
    expect(screen.queryByText(data.distractors[0])).not.toBeInTheDocument();

    const optionButtons = screen.getAllByText(/^Option \d:$/);
    expect(optionButtons).toHaveLength(1 + data.distractors.length);

    const firstOption = optionButtons[0].closest('button');
    fireEvent.click(firstOption);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    fireEvent.click(firstOption);
    expect(onSuccess.mock.calls.length + onError.mock.calls.length).toBe(1);
  });
});
