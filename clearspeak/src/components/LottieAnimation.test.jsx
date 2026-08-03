import React from 'react';

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import LottieAnimation from './LottieAnimation';
import * as userSettingsContext from './UserSettingsContext';

vi.mock('lottie-react', () => {
  return {
    default: () => <div data-testid="lottie-mock">Mocked Lottie</div>,
  };
});

describe('LottieAnimation Component', () => {
  it('powinien wyrenderować domyślną animację Lottie', () => {
    vi.spyOn(userSettingsContext, 'useUserSettingsContext').mockReturnValue({
      settings: { theme: 'Natur', contrast: false },
    });

    render(<LottieAnimation animationData={{}} ariaLabel="Testowa Animacja" />);

    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument();
    expect(screen.getByLabelText('Testowa Animacja')).toBeInTheDocument();
  });

  it('powinien wymusić render statycznego emoji (fallback), gdy noFlash jest aktywne', () => {
    vi.spyOn(userSettingsContext, 'useUserSettingsContext').mockReturnValue({
      settings: { theme: 'Natur', contrast: false },
    });

    render(
      <LottieAnimation animationData={{}} noFlash={true} fallbackEmoji="🌱" />,
    );

    expect(screen.queryByTestId('lottie-mock')).not.toBeInTheDocument();

    expect(screen.getByText('🌱')).toBeInTheDocument();
  });

  it('powinien zaaplikować odpowiednie filtry dla trybu wysokiego kontrastu (WCAG)', () => {
    vi.spyOn(userSettingsContext, 'useUserSettingsContext').mockReturnValue({
      settings: { theme: 'Natur', contrast: true },
    });

    render(<LottieAnimation animationData={{}} ariaLabel="Test Kontrastu" />);

    const wrapper = screen.getByLabelText('Test Kontrastu');

    expect(wrapper.style.filter).toContain('grayscale(100%)');
    expect(wrapper.style.filter).toContain('contrast(150%)');
  });

  it('powinien zaaplikować rotację barw (hue-rotate) w zależności od motywu z kontekstu', () => {
    vi.spyOn(userSettingsContext, 'useUserSettingsContext').mockReturnValue({
      settings: { theme: 'Space', contrast: false },
    });

    render(<LottieAnimation animationData={{}} ariaLabel="Test Motywu" />);

    const wrapper = screen.getByLabelText('Test Motywu');
    expect(wrapper.style.filter).toContain('hue-rotate(90deg)');
  });
});
