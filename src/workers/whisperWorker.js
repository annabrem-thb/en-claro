// Dedicated module worker for the local-Whisper mic fallback. Only ever
// created (see useLocalWhisper.js) once a user on a non-Chromium browser has
// explicitly consented to the model download — @huggingface/transformers and
// onnxruntime-web's wasm binaries live in this worker's own chunk, so
// Chrome/Edge users (native SpeechRecognition, the overwhelming majority)
// never fetch any of it.
import { pipeline } from '@huggingface/transformers';

// A module-level singleton, not per-message: the ~75MB model download and
// wasm session setup only need to happen once per worker lifetime, and this
// worker itself lives for as long as the tab does (see useLocalWhisper.js,
// which creates it lazily but never tears it down mid-session).
let transcriberPromise = null;

function loadTranscriber() {
  if (!transcriberPromise) {
    transcriberPromise = pipeline(
      'automatic-speech-recognition',
      'onnx-community/whisper-tiny',
      {
        // wasm, not webgpu: Firefox/Safari (the browsers this fallback
        // targets) have inconsistent WebGPU support, while wasm works
        // everywhere. fp32 encoder + q8 decoder is the documented default
        // pairing for Whisper on the wasm backend.
        device: 'wasm',
        dtype: { encoder_model: 'fp32', decoder_model_merged: 'q8' },
        progress_callback: (event) => {
          // Transformers.js fires one raw event per file per chunk, plus a
          // synthesized 'progress_total' event aggregated across every file
          // in this pipeline() call — the latter is what a single download
          // progress bar wants.
          if (event.status === 'progress_total') {
            self.postMessage({ type: 'progress', progress: event.progress });
          }
        },
      },
      // A failed download/init must not poison the singleton forever — the
      // first fix here without this reset was a load failure permanently
      // wedging the worker, since every later retry would just return the
      // same already-rejected promise instead of trying again.
    ).catch((error) => {
      transcriberPromise = null;
      throw error;
    });
  }
  return transcriberPromise;
}

self.onmessage = async (event) => {
  const { type } = event.data;

  if (type === 'load') {
    try {
      await loadTranscriber();
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({
        type: 'error',
        phase: 'load',
        message: error?.message || String(error),
      });
    }
    return;
  }

  if (type === 'transcribe') {
    const { audio, language } = event.data;
    try {
      const transcriber = await loadTranscriber();
      const output = await transcriber(audio, {
        language,
        task: 'transcribe',
      });
      self.postMessage({ type: 'result', text: output.text });
    } catch (error) {
      self.postMessage({
        type: 'error',
        phase: 'transcribe',
        message: error?.message || String(error),
      });
    }
  }
};
