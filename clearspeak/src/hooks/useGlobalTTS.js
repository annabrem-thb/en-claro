import { useState, useEffect, useCallback } from 'react';

export const TTS_EXCEPTIONS = {
  pl: {
    // 1. "ie" clusters (forcing softness, avoiding English "ay" / "ee")
    'pie': 'pje', 'die': 'dje', 'tie': 'tje', 'lie': 'lje',
    
    // 2. Hard "H" (to avoid 'he' being read as "hi", 'ho' as "how", etc.)
    'ha': 'cha', 'he': 'che', 'hi': 'chi', 'ho': 'cho', 'hu': 'chu',

    // 3. Devoicing W -> F at the end of syllables (common error with English diphthongs)
    'baw': 'baf', 'caw': 'caf', 'daw': 'daf', 'faw': 'faf', 'gaw': 'gaf', 'jaw': 'jaf', 
    'kaw': 'kaf', 'law': 'laf', 'maw': 'maf', 'naw': 'naf', 'paw': 'paf', 'raw': 'raf', 
    'saw': 'saf', 'taw': 'taf', 'zaw': 'zaf', 'lew': 'lef', 'mew': 'mef', 'pew': 'pef', 
    'zew': 'zef', 'krew': 'kref', 'drzew': 'drzef', 'new': 'nef', 'few': 'fef', 'bow': 'bof', 
    'cow': 'cof', 'dow': 'dof', 'how': 'chof', 'kow': 'kof', 'low': 'lof', 'mow': 'mof', 
    'now': 'nof', 'pow': 'pof', 'row': 'rof', 'sow': 'sof', 'tow': 'tof', 'zow': 'zof',
    'piw': 'pif', 'siw': 'sif', 'liw': 'lif', 'dziw': 'dzif',

    // 4. Accidental English words (devoicing D->T, G->K, B->P)
    'bad': 'bat', 'sad': 'sat', 'mad': 'mat', 'rad': 'rat', 
    'dog': 'dok', 'log': 'lok', 'big': 'bik', 'dig': 'dik',
    'leg': 'lek', 'bag': 'bak', 'cab': 'kap', 'pub': 'pap',

    // 5. Abbreviations and problematic syllables (e.g., "ca" interpreted as circa/ka)
    'ca': 'tsa'
  },
  en: {
    // Fixing English, non-phonetic syllables when read in isolation
    'tion': 'shun', 'sion': 'shun', 'tious': 'shus',
    'ous': 'us', 'reau': 'row', 'neur': 'nur',
    'sci': 'shee', 'ci': 'shee', 'mu': 'myoo',
    'ca': 'kay', 'za': 'zay', 'ta': 'tay',
    'cy': 'see', 'ly': 'lee', 'ty': 'tee',
    'tre': 'truh', 'pre': 'pruh'
  },
  de: {
    // Fixing pronunciation of German suffixes (Bühnendeutsch)
    'ig': 'ich',
    'dig': 'dich',
    'sig': 'sich'
  }
};

export function getTTSException(text, language) {
  if (typeof text !== 'string') return text;
  const normalized = text.trim().toLowerCase();
  return TTS_EXCEPTIONS[language]?.[normalized] || text;
}

/**
 * Manages global speech synthesizer (Text-to-Speech)
 * and its configuration with automatic save to localStorage.
 */
export function useGlobalTTS(language, extendedTime = false) {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURIs, setSelectedVoiceURIs] = useState(() => {
    const sv = localStorage.getItem('cfg_voice_uris');
    if (sv) return JSON.parse(sv);
    const oldSv = localStorage.getItem('cfg_voice_uri');
    return { pl: oldSv || 'default', en: oldSv || 'default', de: oldSv || 'default' };
  });
  const [voiceSpeed, setVoiceSpeed] = useState(() => Number(localStorage.getItem('cfg_voice_speed')) || 1.0);
  const [voicePitch, setVoicePitch] = useState(() => Number(localStorage.getItem('cfg_voice_pitch')) || 1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBoundary, setActiveBoundary] = useState(null);

  // Force loading voices to avoid empty array bug on Android/Chrome
  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices?.() || [];
      if (availableVoices.length > 0) setVoices(availableVoices);
    };
    updateVoices();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Monitor TTS playback state globally
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis?.speaking || false);
      setIsPaused(window.speechSynthesis?.paused || false);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage on every parameter change
  useEffect(() => {
    localStorage.setItem('cfg_voice_uris', JSON.stringify(selectedVoiceURIs));
    localStorage.setItem('cfg_voice_speed', String(voiceSpeed));
    localStorage.setItem('cfg_voice_pitch', String(voicePitch));
  }, [selectedVoiceURIs, voiceSpeed, voicePitch]);

  const speak = useCallback((text, slow = false) => {
    window.speechSynthesis?.cancel();

    const textToSpeak = getTTSException(text, language);
    const finalSpeed = (slow || extendedTime) ? voiceSpeed * 0.65 : voiceSpeed;

    if (!window.speechSynthesis) return;

    const msg  = new SpeechSynthesisUtterance(textToSpeak);
    msg.lang   = { de: 'de-DE', pl: 'pl-PL', en: 'en-US' }[language] || 'de-DE';
    msg.rate   = finalSpeed;
    msg.pitch  = voicePitch;

    // Use background-loaded voice state
    const allVoices = voices.length > 0 ? voices : (window.speechSynthesis?.getVoices?.() || []);
    let selectedVoice = null;
    const currentVoiceURI = selectedVoiceURIs[language];

    if (currentVoiceURI && currentVoiceURI !== 'default') {
      selectedVoice = allVoices.find(v => v.voiceURI === currentVoiceURI);
    } else {
      const isLang = (v, code) => v.lang.toLowerCase().replace('_', '-').startsWith(code);
      if (language === 'pl')      selectedVoice = allVoices.find(v => v.name.includes('Zofia')) || allVoices.find(v => v.name.includes('Paulina')) || allVoices.find(v => isLang(v, 'pl'));
      else if (language === 'en') selectedVoice = allVoices.find(v => v.name.includes('Emma')) || allVoices.find(v => isLang(v, 'en'));
      else if (language === 'de') selectedVoice = allVoices.find(v => v.name.includes('Amala')) || allVoices.find(v => isLang(v, 'de'));
    }

    if (selectedVoice) {
      msg.voice = selectedVoice;
    }

    // Track word boundaries for highlighting
    msg.onstart = () => {
      setActiveBoundary({ charIndex: 0, charLength: 0 });
    };
    msg.onboundary = (event) => {
      if (event.name === 'word') {
        setActiveBoundary({ charIndex: event.charIndex, charLength: event.charLength });
      }
    };
    msg.onend = () => setActiveBoundary(null);
    msg.onerror = () => setActiveBoundary(null);

    window.speechSynthesis.speak(msg);
  }, [language, extendedTime, selectedVoiceURIs, voiceSpeed, voicePitch, voices]);

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

  return { speak, cancelTTS, pauseTTS, resumeTTS, isSpeaking, isPaused, activeBoundary, selectedVoiceURIs, setSelectedVoiceURIs, voiceSpeed, setVoiceSpeed, voicePitch, setVoicePitch };
}