// Dedicated module worker for the local-TTS fallback (see useLocalTTS.js).
// Only ever created once a browser reports zero installed system voices
// (mainly desktop Firefox, which — unlike Chrome — has no bundled network
// voices and depends entirely on the OS) and the user has consented to the
// one-time model download. @huggingface/transformers and onnxruntime-web's
// wasm binaries live in this worker's own chunk, so browsers with usable
// native voices never fetch any of it.
import { pipeline } from '@huggingface/transformers';

// MMS-TTS (VITS) checkpoints, one per app language. Unlike Whisper, TTS
// models aren't multilingual — each language is a separate ~114MB download,
// loaded lazily (see loadSynthesizer) so a session only ever fetches the
// language actually being read aloud, not all three up front. There is no
// official ONNX conversion of facebook/mms-tts-pol published by HuggingFace
// or Xenova at the time this was written — payam1394's is the only
// transformers.js-compatible conversion available; it's a community upload
// (not officially maintained) and carries the same cc-by-nc-4.0 license as
// every mms-tts-* checkpoint.
const MODELS = {
  en: 'Xenova/mms-tts-eng',
  de: 'Xenova/mms-tts-deu',
  pl: 'payam1394/traxlate-mms-tts-pol',
};

// One singleton pipeline per language, not per-message — session setup only
// needs to happen once per language per worker lifetime. fp32 (not a
// quantized dtype): measured meaningfully *faster* inference than the q8
// build for these VITS models (no optimized wasm kernel for the quantized
// ops here), so there's no tradeoff to make the way there was for Whisper's
// decoder — fp32 wins on both speed and (having been the one actually
// exercised) confidence.
const pipelines = new Map();

function loadSynthesizer(language) {
  if (!pipelines.has(language)) {
    const modelId = MODELS[language];
    pipelines.set(
      language,
      pipeline('text-to-speech', modelId, {
        device: 'wasm',
        dtype: 'fp32',
        progress_callback: (event) => {
          if (event.status === 'progress_total') {
            self.postMessage({ type: 'progress', progress: event.progress });
          }
        },
        // A failed download/init must not poison the singleton forever —
        // without this reset, a later retry would just return the same
        // already-rejected promise instead of trying again.
      }).catch((error) => {
        pipelines.delete(language);
        throw error;
      }),
    );
  }
  return pipelines.get(language);
}

self.onmessage = async (event) => {
  const { type, language } = event.data;

  if (type === 'load') {
    try {
      await loadSynthesizer(language);
      self.postMessage({ type: 'ready', language });
    } catch (error) {
      self.postMessage({
        type: 'error',
        phase: 'load',
        message: error?.message || String(error),
      });
    }
    return;
  }

  if (type === 'synthesize') {
    const { text, requestId } = event.data;
    try {
      const synthesizer = await loadSynthesizer(language);
      const output = await synthesizer(text);
      const audio = Float32Array.from(output.audio);
      self.postMessage(
        {
          type: 'result',
          requestId,
          audio,
          samplingRate: output.sampling_rate,
        },
        [audio.buffer],
      );
    } catch (error) {
      self.postMessage({
        type: 'error',
        phase: 'synthesize',
        requestId,
        message: error?.message || String(error),
      });
    }
  }
};
