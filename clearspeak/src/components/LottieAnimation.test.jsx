import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import LottieAnimation from './LottieAnimation';
import * as appSettingsHook from '../hooks/useAppSettings';

// Zastępujemy bibliotekę lottie-react mockiem,
// aby uniknąć ciężkiego renderowania SVG/Canvas w środowisku testowym (JSDOM).
vi.mock('lottie-react', () => {
  return {
    default: () => <div data-testid="lottie-mock">Mocked Lottie</div>
  };
});

describe('LottieAnimation Component', () => {
  it('powinien wyrenderować domyślną animację Lottie', () => {
    vi.spyOn(appSettingsHook, 'useAppSettings').mockReturnValue({
      theme: 'Natur',
      a11yAddons: []
    });

    render(<LottieAnimation animationData={{}} ariaLabel="Testowa Animacja" />);
    
    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument();
    expect(screen.getByLabelText('Testowa Animacja')).toBeInTheDocument();
  });

  it('powinien wymusić render statycznego emoji (fallback), gdy noFlash jest aktywne', () => {
    vi.spyOn(appSettingsHook, 'useAppSettings').mockReturnValue({
      theme: 'Natur',
      a11yAddons: []
    });

    render(<LottieAnimation animationData={{}} noFlash={true} fallbackEmoji="🌱" />);
    
    // Animacja Lottie NIE powinna istnieć w DOM
    expect(screen.queryByTestId('lottie-mock')).not.toBeInTheDocument();
    
    // Statyczny znak zastępczy POWINIEN się pojawić
    expect(screen.getByText('🌱')).toBeInTheDocument();
  });

  it('powinien zaaplikować odpowiednie filtry dla trybu wysokiego kontrastu (WCAG)', () => {
    vi.spyOn(appSettingsHook, 'useAppSettings').mockReturnValue({
      theme: 'Natur',
      a11yAddons: ['Kontrast'] // Symulujemy włączony wysoki kontrast
    });

    render(<LottieAnimation animationData={{}} ariaLabel="Test Kontrastu" />);
    
    const wrapper = screen.getByLabelText('Test Kontrastu');
    
    // Sprawdzamy czy wygenerowany styl poprawnie zaaplikował szarości/kontrasty
    expect(wrapper.style.filter).toContain('grayscale(100%)');
    expect(wrapper.style.filter).toContain('contrast(150%)');
  });

  it('powinien zaaplikować rotację barw (hue-rotate) w zależności od motywu z kontekstu', () => {
    vi.spyOn(appSettingsHook, 'useAppSettings').mockReturnValue({
      theme: 'Space', // Kosmos to chłodne, zmutowane kolory
      a11yAddons: []
    });

    render(<LottieAnimation animationData={{}} ariaLabel="Test Motywu" />);
    
    const wrapper = screen.getByLabelText('Test Motywu');
    expect(wrapper.style.filter).toContain('hue-rotate(90deg)');
  });
});