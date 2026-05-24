import React, { useState, useMemo, useEffect } from 'react';
import BionicText from './BionicText.jsx';

/**
 * ChunkedText Component
 * Zapobiega tłokowi wizualnemu poprzez "stronicowanie" długich bloków tekstu
 * oraz umożliwia przełączenie na uproszczoną wersję (np. z API NLP/BART).
 */
export default function ChunkedText({ 
  originalText, 
  simplifiedText, 
  wordsPerScreen = 30, // Rekomendowany limit dla dorosłych z dysleksją
  t = {},
  className = '' 
}) {
  const [useSimplified, setUseSimplified] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Wybierz źródło tekstu
  const activeText = useSimplified && simplifiedText ? simplifiedText : originalText;

  // Algorytm dzielący (Chunking Algorithm)
  const chunks = useMemo(() => {
    if (!activeText) return [];
    const words = activeText.split(/\s+/);
    const result = [];
    for (let i = 0; i < words.length; i += wordsPerScreen) {
      result.push(words.slice(i, i + wordsPerScreen).join(' '));
    }
    return result;
  }, [activeText, wordsPerScreen]);

  // Zabezpieczenie przed błędem indeksu po zmianie wersji tekstu
  useEffect(() => {
    setCurrentPage(0);
  }, [useSimplified]);

  if (chunks.length === 0) return null;

  return (
    <div className={`flex flex-col gap-5 w-full ${className}`}>
      {/* Przełącznik uproszczenia (AI Simplification Toggle) */}
      {simplifiedText && (
        <div className="flex justify-end">
          <button
            onClick={() => setUseSimplified(!useSimplified)}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            {useSimplified ? (t.showOriginal || 'Show original') : (t.simplifyText || 'Simplify text ✨')}
          </button>
        </div>
      )}

      {/* Główny obszar czytania */}
      <div className="min-h-[120px] text-lg leading-relaxed">
        <BionicText text={chunks[currentPage]} />
      </div>

      {/* Paginacja (Content Pacing Controls) */}
      {chunks.length > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
          <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 disabled:opacity-30">
            {t.prevPage || '← Previous'}
          </button>
          <span className="text-xs font-black tracking-widest text-slate-400">
            {currentPage + 1} / {chunks.length}
          </span>
          <button disabled={currentPage === chunks.length - 1} onClick={() => setCurrentPage(p => p + 1)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-500 text-white disabled:opacity-30">
            {t.nextPage || 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}