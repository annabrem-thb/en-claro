import { useState, useEffect, useCallback } from 'react';

import { safeJSONParse } from '../utils/safeJSONParse.js';

const TTS_EXCEPTIONS = {
  pl: {
    pie: 'pje',
    die: 'dje',
    tie: 'tje',
    lie: 'lje',
    ha: 'cha',
    he: 'che',
    hi: 'chi',
    ho: 'cho',
    hu: 'chu',
    baw: 'baf',
    caw: 'caf',
    daw: 'daf',
    faw: 'faf',
    gaw: 'gaf',
    jaw: 'jaf',
    kaw: 'kaf',
    law: 'laf',
    maw: 'maf',
    naw: 'naf',
    paw: 'paf',
    raw: 'raf',
    saw: 'saf',
    taw: 'taf',
    zaw: 'zaf',
    lew: 'lef',
    mew: 'mef',
    pew: 'pef',
    zew: 'zef',
    krew: 'kref',
    drzew: 'drzef',
    new: 'nef',
    few: 'fef',
    bow: 'bof',
    cow: 'cof',
    dow: 'dof',
    how: 'chof',
    kow: 'kof',
    low: 'lof',
    mow: 'mof',
    now: 'nof',
    pow: 'pof',
    row: 'rof',
    sow: 'sof',
    tow: 'tof',
    zow: 'zof',
    piw: 'pif',
    siw: 'sif',
    liw: 'lif',
    dziw: 'dzif',
    bad: 'bat',
    sad: 'sat',
    mad: 'mat',
    rad: 'rat',
    dog: 'dok',
    log: 'lok',
    big: 'bik',
    dig: 'dik',
    leg: 'lek',
    bag: 'bak',
    cab: 'kap',
    pub: 'pap',
    ca: 'tsa',
  },
  en: {
    tion: 'shun',
    sion: 'shun',
    tious: 'shus',
    ous: 'us',
    reau: 'row',
    neur: 'nur',
    sci: 'shee',
    ci: 'shee',
    mu: 'myoo',
    ca: 'kay',
    za: 'zay',
    ta: 'tay',
    cy: 'see',
    ly: 'lee',
    ty: 'tee',
    tre: 'truh',
    pre: 'pruh',
  },
  de: { ig: 'ich', dig: 'dich', sig: 'sich' },
};
export function getTTSException(text, language) {
  if (typeof text !== 'string') return text;
  const normalized = text.trim().toLowerCase();
  return TTS_EXCEPTIONS[language]?.[normalized] || text;
}
// Ranks a language-matching voice by how likely it is to sound natural
// rather than robotic. Cloud/"online" voices (Google, Microsoft's Online
// Natural voices, Apple's "Enhanced"/"Premium" tiers) are markedly better
// than each OS's bundled compact/offline voices, but the Web Speech API
// exposes no quality metadata directly — the voice's own `name` string is
// the only signal available, so this matches the vendor/quality keywords
// those voices are conventionally labeled with. Used only as a fallback
// once no specific curated name (see NAMED_VOICE_PREFERENCES below) and no
// explicit user selection apply, so it never overrides a deliberate choice.
const QUALITY_HINTS = [
  'online',
  'natural',
  'neural',
  'enhanced',
  'premium',
  'google',
];
const LOW_QUALITY_HINTS = ['compact', 'espeak', 'festival'];

function scoreVoiceQuality(voice) {
  const name = voice.name.toLowerCase();
  if (LOW_QUALITY_HINTS.some((hint) => name.includes(hint))) return -1;
  return QUALITY_HINTS.some((hint) => name.includes(hint)) ? 1 : 0;
}

// Curated first choices per language — kept ahead of the generic quality
// heuristic below because a specific known-good voice is a stronger signal
// than a keyword match.
const NAMED_VOICE_PREFERENCES = {
  pl: ['Zofia', 'Paulina'],
  en: ['Emma'],
  de: ['Amala'],
};

const isVoiceForLanguage = (voice, code) =>
  voice.lang.toLowerCase().replace('_', '-').startsWith(code);

// Exported so callers deciding whether to route to the local (meSpeak)
// fallback can check the same match the native engine itself will use —
// a browser reporting voices at all (e.g. only English on Windows) is not
// the same as having one for the language actually being read aloud.
export function hasVoiceForLanguage(allVoices, language) {
  return allVoices.some((v) => isVoiceForLanguage(v, language));
}

function pickBestVoice(allVoices, language) {
  const langVoices = allVoices.filter((v) => isVoiceForLanguage(v, language));
  if (langVoices.length === 0) return null;

  for (const name of NAMED_VOICE_PREFERENCES[language] || []) {
    const match = langVoices.find((v) => v.name.includes(name));
    if (match) return match;
  }

  // No curated name matched (different OS/browser voice roster) — fall back
  // to whichever remaining voice scores highest on the quality heuristic,
  // preserving the browser's own ordering (its default is usually already
  // its best pick) as the final tiebreaker.
  return [...langVoices].sort(
    (a, b) => scoreVoiceQuality(b) - scoreVoiceQuality(a),
  )[0];
}

export function useGlobalTTS(language, extendedTime = false) {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURIs, setSelectedVoiceURIs] = useState(() => {
    const sv = localStorage.getItem('cfg_voice_uris');
    const parsed = safeJSONParse(sv, null);
    if (parsed) return parsed;
    const oldSv = localStorage.getItem('cfg_voice_uri');
    return {
      pl: oldSv || 'default',
      en: oldSv || 'default',
      de: oldSv || 'default',
    };
  });
  // 0.9 rather than 1.0: a touch slower than natural conversational speed
  // reads more clearly for a dyslexia-focused audience without sounding
  // unnaturally slow.
  const [voiceSpeed, setVoiceSpeed] = useState(
    () => Number(localStorage.getItem('cfg_voice_speed')) || 0.9,
  );
  const [voicePitch, setVoicePitch] = useState(
    () => Number(localStorage.getItem('cfg_voice_pitch')) || 1,
  );
  const [voiceVolume, setVoiceVolume] = useState(
    () => Number(localStorage.getItem('cfg_voice_volume')) || 1,
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBoundary, setActiveBoundary] = useState(null);
  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices?.() || [];
      if (availableVoices.length > 0) setVoices(availableVoices);
    };
    updateVoices();
    if (
      window.speechSynthesis &&
      window.speechSynthesis.onvoiceschanged !== undefined
    ) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis?.speaking || false);
      setIsPaused(window.speechSynthesis?.paused || false);
    }, 200);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    localStorage.setItem('cfg_voice_uris', JSON.stringify(selectedVoiceURIs));
    localStorage.setItem('cfg_voice_speed', String(voiceSpeed));
    localStorage.setItem('cfg_voice_pitch', String(voicePitch));
    localStorage.setItem('cfg_voice_volume', String(voiceVolume));
  }, [selectedVoiceURIs, voiceSpeed, voicePitch, voiceVolume]);
  // Safari (both macOS and iOS) can leave speechSynthesis in a "stuck"
  // state after the tab is backgrounded mid-utterance — the engine pauses
  // but never reports back, so any later `speak()` call silently does
  // nothing. Cancelling on hide and nudging the engine with a near-silent
  // utterance on return is the standard workaround (WebKit bug 195763);
  // folded in here instead of a separate hook so every consumer of this
  // hook gets it automatically rather than needing to remember to wire up
  // a second one.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!window.speechSynthesis) return;
      if (document.visibilityState === 'hidden') {
        window.speechSynthesis.cancel();
      } else {
        const wake = new SpeechSynthesisUtterance(' ');
        wake.volume = 0;
        window.speechSynthesis.speak(wake);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  const speak = useCallback(
    // `onEnd` is optional and additive — every existing call site that only
    // passes (text) or (text, slow) is unaffected. It exists so a caller
    // that needs to speak several things in strict sequence (e.g. a
    // question followed by N options) can chain off the utterance's *real*
    // completion instead of guessing a duration from character count, which
    // silently drifts out of sync with actual speech (different voices,
    // rates, and the extendedTime slowdown all change real duration in ways
    // a fixed ms-per-char formula can't track) and cancels the next item's
    // narration mid-sentence once the schedule runs ahead of the audio.
    (text, slow = false, onEnd) => {
      window.speechSynthesis?.cancel();
      const textToSpeak = getTTSException(text, language);
      const finalSpeed = slow || extendedTime ? voiceSpeed * 0.65 : voiceSpeed;
      if (!window.speechSynthesis) {
        onEnd?.();
        return;
      }
      const msg = new SpeechSynthesisUtterance(textToSpeak);
      msg.lang = { de: 'de-DE', pl: 'pl-PL', en: 'en-US' }[language] || 'de-DE';
      msg.rate = finalSpeed;
      msg.pitch = voicePitch;
      msg.volume = voiceVolume;
      const allVoices =
        voices.length > 0
          ? voices
          : window.speechSynthesis?.getVoices?.() || [];
      let selectedVoice = null;
      const currentVoiceURI = selectedVoiceURIs[language];
      if (currentVoiceURI && currentVoiceURI !== 'default') {
        selectedVoice = allVoices.find((v) => v.voiceURI === currentVoiceURI);
      }
      // Falls through here both when the user hasn't picked a specific
      // voice and when a previously-saved voiceURI no longer exists (a
      // browser update or OS voice-pack change can remove one) — either
      // way, better to pick the best available match than silently fall
      // back to whatever the engine's own untuned default happens to be.
      if (!selectedVoice) {
        selectedVoice = pickBestVoice(allVoices, language);
      }
      if (selectedVoice) {
        msg.voice = selectedVoice;
      }
      msg.onstart = () => {
        setActiveBoundary({ charIndex: 0, charLength: 0 });
      };
      msg.onboundary = (event) => {
        if (event.name === 'word') {
          setActiveBoundary({
            charIndex: event.charIndex,
            charLength: event.charLength,
          });
        }
      };
      msg.onend = () => {
        setActiveBoundary(null);
        onEnd?.();
      };
      msg.onerror = () => {
        setActiveBoundary(null);
        onEnd?.();
      };
      window.speechSynthesis.speak(msg);
    },
    [
      language,
      extendedTime,
      selectedVoiceURIs,
      voiceSpeed,
      voicePitch,
      voiceVolume,
      voices,
    ],
  );
  const cancelTTS = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setActiveBoundary(null);
    }
  }, []);
  const pauseTTS = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  }, []);
  const resumeTTS = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
  }, []);
  return {
    speak: speak,
    cancelTTS: cancelTTS,
    pauseTTS: pauseTTS,
    resumeTTS: resumeTTS,
    isSpeaking: isSpeaking,
    isPaused: isPaused,
    activeBoundary: activeBoundary,
    selectedVoiceURIs: selectedVoiceURIs,
    setSelectedVoiceURIs: setSelectedVoiceURIs,
    voiceSpeed: voiceSpeed,
    setVoiceSpeed: setVoiceSpeed,
    voicePitch: voicePitch,
    setVoicePitch: setVoicePitch,
    voiceVolume: voiceVolume,
    setVoiceVolume: setVoiceVolume,
  };
}
