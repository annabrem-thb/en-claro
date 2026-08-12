import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useExerciseVoice } from './useExerciseVoice.jsx';

// A controllable fake SpeechRecognition — real recognition needs an actual
// microphone and (in Chrome) a live connection to Google's speech backend,
// neither available in a test environment, so every test here drives the
// hook through a fake engine whose start()/abort() behavior we control.
class FakeSpeechRecognition {
  constructor() {
    this.lang = null;
    this.interimResults = null;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    this.onresult = null;
    FakeSpeechRecognition.instances.push(this);
  }
  start() {
    if (FakeSpeechRecognition.throwOnStart) {
      throw new DOMException('already started', 'InvalidStateError');
    }
  }
  abort() {}
}
FakeSpeechRecognition.instances = [];
FakeSpeechRecognition.throwOnStart = false;

describe('useExerciseVoice', () => {
  beforeEach(() => {
    FakeSpeechRecognition.instances = [];
    FakeSpeechRecognition.throwOnStart = false;
    window.SpeechRecognition = FakeSpeechRecognition;
    window.speechSynthesis = { cancel: vi.fn() };
  });

  afterEach(() => {
    delete window.SpeechRecognition;
    delete window.speechSynthesis;
    vi.restoreAllMocks();
  });

  it('sets isListening once the engine reports onstart', () => {
    const { result } = renderHook(() => useExerciseVoice('pl', null));

    act(() => result.current.startListening());
    act(() => FakeSpeechRecognition.instances[0].onstart());

    expect(result.current.isListening).toBe(true);
  });

  // The actual bug: recognition.start() can throw synchronously (the spec's
  // documented behavior when the browser considers a recognition session
  // already active), and prior to this fix nothing caught it — onstart
  // never fires, isListening stays false forever, and the mic button looks
  // permanently dead with zero feedback shown to the user.
  it('recovers instead of getting stuck when recognition.start() throws', () => {
    FakeSpeechRecognition.throwOnStart = true;
    const { result } = renderHook(() => useExerciseVoice('pl', null));

    act(() => result.current.startListening());

    expect(result.current.isListening).toBe(false);
    expect(result.current.error).toBe('start-failed');
  });

  it('allows a fresh attempt after a start() failure', () => {
    FakeSpeechRecognition.throwOnStart = true;
    const { result } = renderHook(() => useExerciseVoice('pl', null));
    act(() => result.current.startListening());
    expect(result.current.error).toBe('start-failed');

    FakeSpeechRecognition.throwOnStart = false;
    act(() => result.current.startListening());
    act(() => FakeSpeechRecognition.instances[1].onstart());

    expect(result.current.isListening).toBe(true);
  });

  it('surfaces non-permission errors (e.g. no-speech) via the error state', () => {
    const { result } = renderHook(() => useExerciseVoice('pl', null));
    act(() => result.current.startListening());
    act(() =>
      FakeSpeechRecognition.instances[0].onerror({ error: 'no-speech' }),
    );

    expect(result.current.error).toBe('no-speech');
    expect(result.current.isListening).toBe(false);
    // no-speech says nothing about permission state — must not flip it.
    expect(result.current.micPermissionGranted).toBeNull();
  });

  it('sets error to unsupported when the browser has no SpeechRecognition', () => {
    delete window.SpeechRecognition;
    const { result } = renderHook(() => useExerciseVoice('pl', null));

    act(() => result.current.startListening());

    expect(result.current.error).toBe('unsupported');
    expect(FakeSpeechRecognition.instances.length).toBe(0);
  });
});
