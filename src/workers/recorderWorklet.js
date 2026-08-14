// Runs in the separate AudioWorkletGlobalScope (registered via
// audioContext.audioWorklet.addModule in useLocalWhisper.js), not the main
// thread. Deliberately dumb: mixes each 128-sample render block to mono,
// computes its RMS, and hands both to the main thread — buffering, the
// silence/VAD state machine (voiceActivityDetector.js), and resampling all
// happen there instead, where they're far easier to debug and don't need to
// survive the worklet's much more restricted execution environment.
class RecorderWorklet extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0 || input[0].length === 0) return true;

    const channelCount = input.length;
    const frameCount = input[0].length;
    const mono = new Float32Array(frameCount);

    for (let i = 0; i < frameCount; i++) {
      let sum = 0;
      for (let channel = 0; channel < channelCount; channel++) {
        sum += input[channel][i];
      }
      mono[i] = sum / channelCount;
    }

    let sumSquares = 0;
    for (let i = 0; i < frameCount; i++) {
      sumSquares += mono[i] * mono[i];
    }
    const rms = Math.sqrt(sumSquares / frameCount);

    // Transferred (not copied) — mono's buffer is handed off wholesale
    // since nothing here needs it after posting.
    this.port.postMessage({ rms, samples: mono }, [mono.buffer]);

    return true;
  }
}

registerProcessor('recorder-worklet', RecorderWorklet);
