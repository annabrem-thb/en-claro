import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App.jsx';

vi.mock('./Introscreen.jsx', () => ({ default: ({ onStart }) => (
  <div data-testid="intro-screen">
    <button onClick={onStart}>Start</button>
  </div>
)}));

vi.mock('./SettingsModal.jsx', () => ({ default: ({ open, onClose }) => open ? (
  <div data-testid="settings-modal">
    <button onClick={onClose}>Close Settings</button>
  </div>
) : null }));

vi.mock('./VirtualGarden.jsx', () => ({ default: () => <div data-testid="virtual-garden" /> }));

vi.mock('./ExerciseRenderer.jsx', () => ({
  ExerciseRenderer: () => <div data-testid="exercise-renderer" />
}));

vi.mock('./GamificationContext.jsx', () => ({
  GamificationProvider: ({ children }) => <div data-testid="gamification-provider">{children}</div>,
  useGamification: () => ({ isGamified: true, setIsGamified: vi.fn() })
}));

vi.mock('./common/TTSController.jsx', () => ({ default: () => <div data-testid="tts-controller" /> }));

vi.mock('./common/AccessibleTTS.jsx', () => ({ default: ({ children }) => <div data-testid="accessible-tts">{children}</div> }));

vi.mock('./common/SkeletonLoader.jsx', () => ({ default: () => <div data-testid="skeleton-loader" /> }));

describe('Komponent Główny - App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('Wyświetla ekran IntroScreen przy pierwszym uruchomieniu', () => {
    render(<App />);
    expect(screen.getByTestId('intro-screen')).toBeInTheDocument();
  });

  test('Przechodzi do głównego widoku aplikacji po kliknięciu "Start"', () => {
    render(<App />);
    
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('tts-controller')).toBeInTheDocument();
    
    expect(screen.getByTestId('virtual-garden')).toBeInTheDocument();
  });

  test('Pozwala na swobodne otwieranie i zamykanie okna Ustawień (SettingsModal)', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Start'));
    
    const settingsButton = screen.getByText('⚙️').closest('button');
    expect(settingsButton).toBeInTheDocument();
    fireEvent.click(settingsButton);
    
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    
    const closeSettingsButton = screen.getByText('Close Settings');
    fireEvent.click(closeSettingsButton);
    expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
  });
});