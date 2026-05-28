import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { FeedbackCollector } from './FeedbackCollector';

describe('FeedbackCollector Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnSkip = vi.fn();
  const mockT = {
    feedback: {
      title: 'Chwila na refleksję',
      desc: 'Twoja opinia pomaga nam dostosować aplikację.',
      nasaTitle: 'NASA-TLX',
      mental: 'Wysiłek umysłowy',
      physical: 'Wysiłek fizyczny',
      frustration: 'Poziom frustracji',
      low: 'Niski',
      high: 'Wysoki',
      submit: 'Zapisz',
      skip: 'Pomiń',
    },
  };
  const mockThemeStyles = { accent: 'text-indigo-600', button: 'bg-indigo-600' };

  beforeEach(() => {
    // Czyścimy mocki przed każdym testem
    mockOnSubmit.mockClear();
    mockOnSkip.mockClear();
  });

  it('nie powinien renderować się, gdy prop "open" jest fałszywy', () => {
    render(
      <FeedbackCollector
        open={false}
        onSubmit={mockOnSubmit}
        onSkip={mockOnSkip}
        t={mockT}
        themeStyles={mockThemeStyles}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('powinien renderować się poprawnie, gdy prop "open" jest prawdziwy', () => {
    render(
      <FeedbackCollector
        open={true}
        onSubmit={mockOnSubmit}
        onSkip={mockOnSkip}
        t={mockT}
        themeStyles={mockThemeStyles}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Chwila na refleksję')).toBeInTheDocument();
    expect(screen.getByLabelText('Wysiłek umysłowy')).toBeInTheDocument();
    expect(screen.getByLabelText('Wysiłek fizyczny')).toBeInTheDocument();
    expect(screen.getByLabelText('Poziom frustracji')).toBeInTheDocument();
  });

  it('powinien aktualizować wartość suwaka po interakcji użytkownika', () => {
    render(
      <FeedbackCollector open={true} t={mockT} themeStyles={mockThemeStyles} />
    );

    const mentalSlider = screen.getByLabelText('Wysiłek umysłowy');
    const valueDisplay = mentalSlider.previousElementSibling.lastChild;

    expect(valueDisplay.textContent).toBe('3');
    fireEvent.change(mentalSlider, { target: { value: '5' } });

    // Musimy ponownie znaleźć element, ponieważ komponent się przerenderował
    const updatedValueDisplay = screen.getByLabelText('Wysiłek umysłowy').previousElementSibling.lastChild;
    expect(updatedValueDisplay.textContent).toBe('5');
  });

  it('powinien wywołać onSubmit z poprawnymi wartościami po kliknięciu "Zapisz"', () => {
    render(
      <FeedbackCollector open={true} onSubmit={mockOnSubmit} onSkip={mockOnSkip} t={mockT} themeStyles={mockThemeStyles} />
    );

    fireEvent.change(screen.getByLabelText('Wysiłek umysłowy'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Wysiłek fizyczny'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Poziom frustracji'), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      mental: 4,
      effort: 2,
      frustration: 1,
    });
  });

  it('powinien wywołać onSkip po kliknięciu "Pomiń"', () => {
    render(
      <FeedbackCollector open={true} onSubmit={mockOnSubmit} onSkip={mockOnSkip} t={mockT} themeStyles={mockThemeStyles} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pomiń' }));
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });
});