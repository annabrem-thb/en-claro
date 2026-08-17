// Dedicated module worker for the local-TTS fallback (see useLocalTTS.js).
// Only ever created once a browser reports zero installed system voices
// (mainly desktop Firefox/Opera, which — unlike Chrome — have no bundled
// network voices and depend entirely on the OS).
//
// This used to run a neural VITS model (@huggingface/transformers) in wasm,
// but single-threaded wasm inference took 25-90s *per read-aloud click*
// (not just on first use) — unusable for a "read this exercise" button that
// users expect to respond in ~1s. meSpeak (a JS port of eSpeak, rule-based
// formant synthesis, not neural) trades voice naturalism — it sounds
// classically robotic — for synthesis that completes in well under a
// second, and a one-time engine download of ~4-5MB instead of ~110MB. GPL
// licensed; used here only as a client-side, in-browser dependency (nothing
// server-side links against it).
import meSpeak from 'mespeak';
import mespeakConfig from 'mespeak/src/mespeak_config.json';

meSpeak.loadConfig(mespeakConfig);

// voice_id values baked into each voice JSON file (see node_modules/mespeak
// voices/*.json's own "voice_id" field) — passed explicitly as the `voice`
// option on every speak() call so a request for one language is never
// accidentally spoken in whichever language happened to load last.
const VOICES = {
  en: { id: 'en/en-us', load: () => import('mespeak/voices/en/en-us.json') },
  de: { id: 'de', load: () => import('mespeak/voices/de.json') },
  pl: { id: 'pl', load: () => import('mespeak/voices/pl.json') },
};

const loadedLanguages = new Set();
const loadPromises = new Map();

function loadVoice(language) {
  if (loadedLanguages.has(language)) return Promise.resolve();
  if (!loadPromises.has(language)) {
    const promise = VOICES[language]
      .load()
      .then((mod) => {
        meSpeak.loadVoice(mod.default || mod);
        loadedLanguages.add(language);
      })
      .catch((error) => {
        loadPromises.delete(language);
        throw error;
      });
    loadPromises.set(language, promise);
  }
  return loadPromises.get(language);
}

self.onmessage = async (event) => {
  const { type, language } = event.data;

  if (type === 'load') {
    try {
      await loadVoice(language);
      self.postMessage({ type: 'ready', language });
    } catch (error) {
      self.postMessage({
        type: 'error',
        phase: 'load',
        language,
        message: error?.message || String(error),
      });
    }
    return;
  }

  if (type === 'synthesize') {
    const { text, requestId } = event.data;
    try {
      await loadVoice(language);
      // rawdata: 'array' avoids meSpeak's browser-only playback path (it
      // checks `typeof window`, which is undefined in a worker) — this
      // returns the synthesized WAV file as a plain byte array instead,
      // decoded on the main thread via AudioContext.decodeAudioData.
      const bytes = meSpeak.speak(text, {
        voice: VOICES[language].id,
        rawdata: 'array',
      });
      if (!bytes) {
        throw new Error('meSpeak returned no audio data');
      }
      const audio = Uint8Array.from(bytes);
      self.postMessage({ type: 'result', requestId, audio }, [audio.buffer]);
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
