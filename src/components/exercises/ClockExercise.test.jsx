import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ClockExercise from './ClockExercise.jsx';

const data = {
  timeAnalog: 'Quarter past three',
  isNight: false,
  hourRotation: 97.5,
  minuteRotation: 90,
  options: [
    { text: '3:15', isCorrect: true },
    { text: '3:45', isCorrect: false },
  ],
};

const baseProps = {
  data,
  themeStyles: { border: 'border-slate-200', accent: 'text-slate-800', bg: '' },
  onSuccess: vi.fn(),
  onError: vi.fn(),
  language: 'en',
  t: (key) => key,
  speak: vi.fn(),
  voiceAssistant: false,
};

describe('ClockExercise', () => {
  it('keeps the spoken time in the DOM as sr-only in zen mode', () => {
    render(<ClockExercise {...baseProps} zenMode={true} />);

    expect(screen.getByText(data.timeAnalog).closest('p')).toHaveClass(
      'sr-only',
    );
  });

  it('shows the spoken time visibly outside zen mode', () => {
    render(<ClockExercise {...baseProps} zenMode={false} />);

    expect(screen.getByText(data.timeAnalog).closest('p')).not.toHaveClass(
      'sr-only',
    );
  });
});
