import React, { useEffect, useCallback } from 'react';
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import TTSController from '../common/TTSController';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';

export default function ReadAloudExercise({
  data, themeStyles, onSuccess, onError, language, t, speak,
  noFlash, bigTargets, extendedTime, bionicReading, zenMode, voiceAssistant
}) {
  const { isListening, transcript, startListening } = useExerciseVoice(language, t);
  const { pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  // Funkcja normalizująca tekst: usuwa interpunkcję i wielkie litery, żeby 
  // porównanie nie psuło się przez przecinki dodawane przez rozpoznawanie mowy
  const normalizeText = (text) => 
    text.toLowerCase().replace(/[.,!?;:„”"'-]/g, '').trim();

  const handleCheck = useCallback(() => {
    if (!transcript) return;
    const cleanSpoken = normalizeText(transcript);
    const cleanTarget = normalizeText(data.text);
    
    // Zezwalamy na zaliczenie zadania, jeśli mowa w dużym stopniu się pokrywa.
    // Jest to łagodniejsze dla osób z dysleksją i radzi sobie z drobnymi przejęzyczeniami.
    if (cleanSpoken === cleanTarget || cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
      onSuccess();
    } else {
      onError();
    }
  }, [transcript, data.text, onSuccess, onError]);

  const controlBtnSize = bigTargets ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl' : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';
  const pulseClass = noFlash ? 'bg-red-500' : 'bg-red-500 animate-pulse ring-8 ring-red-100';

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center ${noFlash ? '' : 'animate-in fade-in zoom-in duration-500'}`}>
      {!zenMode && (
        <h3 className="mb-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          <BionicText text={t.readAloudTitle || 'Read aloud'} enabled={bionicReading} />
        </h3>
      )}

      <div className="mb-8 px-4 sm:px-8 py-8 sm:py-12 w-full max-w-2xl bg-white border-2 border-slate-100 rounded-3xl shadow-sm text-center">
        <span className="text-2xl sm:text-4xl font-bold leading-relaxed text-slate-700">
          <BionicText text={data.text} enabled={bionicReading} />
        </span>
      </div>

      <div className="flex gap-4 mb-6">
        {voiceAssistant && (
          <TTSController
            onReadAloud={() => speak(data.text, extendedTime)}
            pauseAllTimeouts={pauseAllTimeouts}
            resumeAllTimeouts={resumeAllTimeouts}
            t={t}
            controlBtnSize={controlBtnSize}
          />
        )}
        
        <button
          onClick={() => startListening()}
          className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
            isListening ? pulseClass + ' text-white' : `${themeStyles.button} text-white hover:brightness-110`
          }`}
          aria-label={t.voiceInput}
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>

      {transcript && (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <p className="text-center text-xs font-black tracking-widest text-slate-400 uppercase">
            {t.heard}: <span className="text-slate-600">{transcript}</span>
          </p>
          <button
            onClick={handleCheck}
            className={`w-full py-4 rounded-full font-black uppercase tracking-widest transition-all active:scale-95 ${themeStyles.button} text-white shadow-xl hover:brightness-110`}
          >
            <BionicText text={t.check || 'Check'} enabled={bionicReading} />
          </button>
        </div>
      )}
    </div>
  );
}