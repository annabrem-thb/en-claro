// Dedicated module worker for the local-Whisper mic fallback. Only ever
// created (see useLocalWhisper.js) once a user on a non-Chromium browser has
// explicitly consented to the model download — @huggingface/transformers and
// onnxruntime-web's wasm binaries live in this worker's own chunk, so
// Chrome/Edge users (native SpeechRecognition, the overwhelming majority)
// never fetch any of it.
import { pipeline, env } from '@huggingface/transformers';

// transformers.js always points onnxruntime-web at its threaded/"asyncify"
// wasm binary regardless of cross-origin isolation (this app deliberately
// isn't isolated — see vite.config.js), so no SharedArrayBuffer is
// available for it to actually use. Left at onnxruntime-web's own default
// thread count, that mismatch can hang session creation/inference
// indefinitely instead of falling back cleanly (reproduced in
// ttsWorker.js's identical setup — see the comment there). Forcing 1 here
// too, defensively, since both workers share the same library and backend.
env.backends.onnx.wasm.numThreads = 1;

// A module-level singleton, not per-message: the ~150MB model download and
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
        // everywhere. fp32 for both: the quantized decoder
        // (decoder_model_merged_quantized.onnx, dtype 'q8') fails session
        // creation in onnxruntime-web wasm with "TransposeDQWeightsForMatMulNBits
        // Missing required scale" — a QDQ-graph incompatibility reproduced
        // across both the transformers.js-pinned onnxruntime-web build and
        // the latest stable 1.26.0, so it isn't an ORT-version fix. fp32
        // trades a larger one-time download for a decoder graph with no
        // DequantizeLinear nodes at all, sidestepping the bug entirely.
        device: 'wasm',
        dtype: { encoder_model: 'fp32', decoder_model_merged: 'fp32' },
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
