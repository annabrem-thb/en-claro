import { useState, useEffect, useCallback, useRef } from 'react';

export const TTS_EXCEPTIONS = {
  pl: {
    // 1. Zbitki "ie" (wymuszanie miękkości, unikanie ang. "aj" / "i")
    'pie': 'pje', 'die': 'dje', 'tie': 'tje', 'lie': 'lje',
    
    // 2. Twarde "H" (żeby 'he' nie czytało "hi", 'ho' jako "hoł" itp.)
    'ha': 'cha', 'he': 'che', 'hi': 'chi', 'ho': 'cho', 'hu': 'chu',

    // 3. Ubezdźwięcznienia W -> F na końcu sylab (częsty błąd z ang. dyftongami)
    'baw': 'baf', 'caw': 'caf', 'daw': 'daf', 'faw': 'faf', 'gaw': 'gaf', 'jaw': 'jaf', 
    'kaw': 'kaf', 'law': 'laf', 'maw': 'maf', 'naw': 'naf', 'paw': 'paf', 'raw': 'raf', 
    'saw': 'saf', 'taw': 'taf', 'zaw': 'zaf', 'lew': 'lef', 'mew': 'mef', 'pew': 'pef', 
    'zew': 'zef', 'krew': 'kref', 'drzew': 'drzef', 'new': 'nef', 'few': 'fef', 'bow': 'bof', 
    'cow': 'cof', 'dow': 'dof', 'how': 'chof', 'kow': 'kof', 'low': 'lof', 'mow': 'mof', 
    'now': 'nof', 'pow': 'pof', 'row': 'rof', 'sow': 'sof', 'tow': 'tof', 'zow': 'zof',
    'piw': 'pif', 'siw': 'sif', 'liw': 'lif', 'dziw': 'dzif',

    // 4. Przypadkowe angielskie słówka (ubezdźwięcznienia D->T, G->K, B->P)
    'bad': 'bat', 'sad': 'sat', 'mad': 'mat', 'rad': 'rat', 
    'dog': 'dok', 'log': 'lok', 'big': 'bik', 'dig': 'dik',
    'leg': 'lek', 'bag': 'bak', 'cab': 'kap', 'pub': 'pap',

    // 5. Skróty i problematyczne sylaby (np. "ca" interpretowane jako circa/ka)
    'ca': 'tsa'
  },
  en: {
    // Naprawa angielskich, niefonetycznych sylab przy odczycie w izolacji
    'tion': 'shun', 'sion': 'shun', 'tious': 'shus',
    'ous': 'us', 'reau': 'row', 'neur': 'nur',
    'sci': 'shee', 'ci': 'shee', 'mu': 'myoo',
    'ca': 'kay', 'za': 'zay', 'ta': 'tay',
    'cy': 'see', 'ly': 'lee', 'ty': 'tee',
    'tre': 'truh', 'pre': 'pruh'
  },
  de: {
    // Naprawa wymowy niemieckich przyrostków (Bühnendeutsch)
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
 * Zarządza globalnym syntezatorem mowy (Text-to-Speech)
 * oraz jego konfiguracją z automatycznym zapisem do localStorage.
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
  const audioRef = useRef(null);

  // Wymuszenie ładowania głosów w celu uniknięcia błędu z pustą tablicą na Androidzie/Chrome
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
      if (audioRef.current) return; // Jeśli gra z chmury, zarządzamy stanem ręcznie
      setIsSpeaking(window.speechSynthesis?.speaking || false);
      setIsPaused(window.speechSynthesis?.paused || false);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Zapis do localStorage przy każdej zmianie parametrów
  useEffect(() => {
    localStorage.setItem('cfg_voice_uris', JSON.stringify(selectedVoiceURIs));
    localStorage.setItem('cfg_voice_speed', String(voiceSpeed));
    localStorage.setItem('cfg_voice_pitch', String(voicePitch));
  }, [selectedVoiceURIs, voiceSpeed, voicePitch]);

  const speak = useCallback(async (text, slow = false) => {
    // Anuluj stare odtwarzania
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();

    const textToSpeak = getTTSException(text, language);
    const finalSpeed = (slow || extendedTime) ? voiceSpeed * 0.65 : voiceSpeed;

    try {
      // Próba odtworzenia czystego głosu z chmury za pośrednictwem Netlify
      const response = await fetch('/.netlify/functions/synthesize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          languageCode: language === 'pl' ? 'pl-PL' : language === 'de' ? 'de-DE' : 'en-US',
          // Używamy profesjonalnych głosów Wavenet (sieci neuronowe)
          voiceName: language === 'pl' ? 'pl-PL-Wavenet-B' : language === 'de' ? 'de-DE-Wavenet-B' : 'en-US-Wavenet-D',
          speed: finalSpeed,
          // Skala pitch API Google to od -20.0 do 20.0 (domyślnie 0.0)
          pitch: (voicePitch - 1.0) * 10 
        })
      });

      if (!response.ok) throw new Error('Cloud TTS niedostępne');

      const { audioContent } = await response.json();
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      
      audioRef.current = audio;
      
      audio.onplay = () => { setIsSpeaking(true); setActiveBoundary({ charIndex: 0, charLength: textToSpeak.length }); };
      audio.onended = () => { setIsSpeaking(false); setActiveBoundary(null); };
      audio.onerror = () => { setIsSpeaking(false); setActiveBoundary(null); };
      
      await audio.play();
      return; // Odtworzono z sukcesem, koniec procedury!
    } catch (error) {
      console.warn("Lektor w chmurze niedostępny. Przechodzę w tryb awaryjny (offline) wbudowany w przeglądarkę.", error.message);
    }

    // --- FALLBACK (Web Speech API) ---
    if (!window.speechSynthesis) return;

    const msg  = new SpeechSynthesisUtterance(textToSpeak);
    msg.lang   = { de: 'de-DE', pl: 'pl-PL', en: 'en-US' }[language] || 'de-DE';
    msg.rate   = finalSpeed;
    msg.pitch  = voicePitch;

    // Korzystamy z załadowanego w tle stanu głosów
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setActiveBoundary(null);
    }
  }, []);

  const pauseTTS = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resumeTTS = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPaused(false);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
  }, []);

  return { speak, cancelTTS, pauseTTS, resumeTTS, isSpeaking, isPaused, activeBoundary, selectedVoiceURIs, setSelectedVoiceURIs, voiceSpeed, setVoiceSpeed, voicePitch, setVoicePitch };
}