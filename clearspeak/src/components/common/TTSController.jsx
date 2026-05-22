import React, { useState, useEffect } from 'react';

export default function TTSController({
  voiceSpeed, setVoiceSpeed,
  selectedVoiceURI, setSelectedVoiceURI,
  language, isHighContrast, themeStyles, t
}) {
  const [voices, setVoices] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Filtrowanie głosów z uwzględnieniem wybranego języka
  const langCode = { pl: 'pl-PL', en: 'en-US', de: 'de-DE' }[language] || 'de-DE';
  const filteredVoices = voices.filter(v => v.lang.startsWith(langCode.substring(0, 2)));

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 items-end pointer-events-none">
      {isExpanded && (
        <div className={`p-5 rounded-3xl shadow-2xl flex flex-col gap-4 w-64 sm:w-72 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300 ${isHighContrast ? 'bg-black border-2 border-white text-white' : 'bg-white border border-slate-100 text-slate-800'}`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">{t?.voiceSpeed || 'Tempo'}</span>
            <span className="text-xs font-black text-indigo-500 bg-indigo-100 px-2 py-1 rounded-md">{Number(voiceSpeed).toFixed(2)}x</span>
          </div>
          <input
            type="range" min="0.5" max="1.5" step="0.05"
            value={voiceSpeed}
            onChange={(e) => setVoiceSpeed(Number(e.target.value))}
            className="w-full cursor-pointer accent-indigo-500"
            aria-label={t?.voiceSpeed || 'Tempo mowy'}
          />
          
          {filteredVoices.length > 0 && (
            <div className="relative mt-1">
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className={`w-full appearance-none p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm ${isHighContrast ? 'bg-black border-2 border-white text-white' : 'bg-slate-50 border-2 border-slate-100 text-slate-700 hover:border-indigo-300 focus:ring-4 focus:ring-indigo-50'}`}
                aria-label="Wybór głosu"
              >
                <option value="default">{t?.voiceDefault || 'Domyślny głos'}</option>
                {filteredVoices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <span className="text-[10px]">▼</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all active:scale-95 border-2 ${isHighContrast ? 'bg-white text-black border-black' : `${themeStyles?.button || 'bg-slate-800'} text-white border-transparent hover:brightness-110`}`}
        aria-label="Ustawienia mowy (TTS)"
        aria-expanded={isExpanded}
      >
        <span className="text-2xl drop-shadow-md">{isExpanded ? '✖' : '🗣️'}</span>
      </button>
    </div>
  );
}