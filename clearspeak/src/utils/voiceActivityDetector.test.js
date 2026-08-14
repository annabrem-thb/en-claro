import { describe, expect, it } from 'vitest';

import { createSilenceDetector } from './voiceActivityDetector.js';

describe('createSilenceDetector', () => {
  it('stops with "silence" once speech is followed by enough quiet', () => {
    const detector = createSilenceDetector({
      silenceThreshold: 0.02,
      silenceDurationMs: 1000,
      maxDurationMs: 8000,
    });

    expect(detector.feed(0.05, 0)).toEqual({ status: 'continue' });
    expect(detector.feed(0.01, 500)).toEqual({ status: 'continue' });
    expect(detector.feed(0.01, 999)).toEqual({ status: 'continue' });
    expect(detector.feed(0.01, 1500)).toEqual({
      status: 'stop',
      reason: 'silence',
    });
  });

  it('keeps going through a brief dip that does not reach silenceDurationMs', () => {
    const detector = createSilenceDetector({
      silenceThreshold: 0.02,
      silenceDurationMs: 1000,
      maxDurationMs: 8000,
    });

    expect(detector.feed(0.05, 0)).toEqual({ status: 'continue' });
    expect(detector.feed(0.01, 400)).toEqual({ status: 'continue' });
    // Loud again before the 1000ms silence window elapses — the silence
    // clock should reset off this sample, not the earlier one.
    expect(detector.feed(0.05, 700)).toEqual({ status: 'continue' });
    expect(detector.feed(0.01, 1500)).toEqual({ status: 'continue' });
  });

  it('stops with "timeout-no-speech" if the threshold is never crossed', () => {
    const detector = createSilenceDetector({
      silenceThreshold: 0.02,
      silenceDurationMs: 1000,
      maxDurationMs: 3000,
    });

    expect(detector.feed(0.001, 0)).toEqual({ status: 'continue' });
    expect(detector.feed(0.001, 1500)).toEqual({ status: 'continue' });
    expect(detector.feed(0.001, 3000)).toEqual({
      status: 'stop',
      reason: 'timeout-no-speech',
    });
  });

  it('stops with "max-duration" as a hard cap even while still speaking', () => {
    const detector = createSilenceDetector({
      silenceThreshold: 0.02,
      silenceDurationMs: 1000,
      maxDurationMs: 3000,
    });

    expect(detector.feed(0.05, 0)).toEqual({ status: 'continue' });
    expect(detector.feed(0.05, 1500)).toEqual({ status: 'continue' });
    expect(detector.feed(0.05, 3000)).toEqual({
      status: 'stop',
      reason: 'max-duration',
    });
  });
});
