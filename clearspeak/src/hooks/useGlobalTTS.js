import { useState, useEffect, useCallback } from 'react';

/**
 * Zarządza globalnym syntezatorem mowy (Text-to-Speech)
 * oraz jego konfiguracją z automatycznym zapisem do localStorage.
 */
export function useGlobalTTS(language, extendedTime = false) {
  const [selectedVoiceURIs, setSelectedVoiceURIs] = useState(() => {
    const sv = localStorage.getItem('cfg_voice_uris');
    if (sv) return JSON.parse(sv);
    const oldSv = localStorage.getItem('cfg_voice_uri');
    return { pl: oldSv || 'default', en: oldSv || 'default', de: oldSv || 'default' };
  });
  const [voiceSpeed, setVoiceSpeed] = useState(() => Number(localStorage.getItem('cfg_voice_speed')) || 1.0);
  const [voicePitch, setVoicePitch] = useState(() => Number(localStorage.getItem('cfg_voice_pitch')) || 1.0);

  // Zapis do localStorage przy każdej zmianie parametrów
  useEffect(() => {
    localStorage.setItem('cfg_voice_uris', JSON.stringify(selectedVoiceURIs));
    localStorage.setItem('cfg_voice_speed', String(voiceSpeed));
    localStorage.setItem('cfg_voice_pitch', String(voicePitch));
  }, [selectedVoiceURIs, voiceSpeed, voicePitch]);

  const speak = useCallback((text, slow = false) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const msg  = new SpeechSynthesisUtterance(text);
    msg.lang   = { de: 'de-DE', pl: 'pl-PL', en: 'en-US' }[language] || 'de-DE';
    msg.rate   = (slow || extendedTime) ? voiceSpeed * 0.65 : voiceSpeed;
    msg.pitch  = voicePitch;

    const allVoices = window.speechSynthesis?.getVoices?.() || [];
    let selectedVoice = null;
    const currentVoiceURI = selectedVoiceURIs[language];

    if (currentVoiceURI && currentVoiceURI !== 'default') {
      selectedVoice = allVoices.find(v => v.voiceURI === currentVoiceURI);
    } else {
      if (language === 'pl')      selectedVoice = allVoices.find(v => v.name.includes('Zofia'));
      else if (language === 'en') selectedVoice = allVoices.find(v => v.name.includes('Emma'));
      else if (language === 'de') selectedVoice = allVoices.find(v => v.name.includes('Amala'));
    }

    if (selectedVoice) {
      msg.voice = selectedVoice;
    }
    window.speechSynthesis.speak(msg);
  }, [language, extendedTime, selectedVoiceURIs, voiceSpeed, voicePitch]);

  return { speak, selectedVoiceURIs, setSelectedVoiceURIs, voiceSpeed, setVoiceSpeed, voicePitch, setVoicePitch };
}