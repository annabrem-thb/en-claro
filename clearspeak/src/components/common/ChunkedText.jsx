import React, { useState, useMemo, useEffect } from 'react';
import BionicText from './BionicText.jsx';
import { useAppSettings } from '../../hooks/useAppSettings.js';

/**
 * ChunkedText Component
 * Prevents visual crowding by paginating long blocks of text
 * and allows toggling to an AI-simplified version (e.g., NLP/BART).
 */
export default function ChunkedText({ 
  originalText, 
  simplifiedText,
  wordsPerScreen = 30, // Recommended word limit per view for dyslexic adults
  t = {},
  className = '' 
}) {
  const [useSimplified, setUseSimplified] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const { language } = useAppSettings();
  const fallbacks = {
    pl: { show: 'Pokaż oryginał', sim: 'Uprość tekst ✨', prev: '← Poprzednia', next: 'Następna →' },
    de: { show: 'Original anzeigen', sim: 'Text vereinfachen ✨', prev: '← Zurück', next: 'Weiter →' },
    en: { show: 'Show original', sim: 'Simplify text ✨', prev: '← Previous', next: 'Next →' }
  };
  const l = fallbacks[language] || fallbacks.en;

  // Select text source
  const activeText = useSimplified && simplifiedText ? simplifiedText : originalText;

  // Chunking Algorithm
  const chunks = useMemo(() => {
    if (!activeText) return [];
    const words = activeText.split(/\s+/);
    const result = [];
    for (let i = 0; i < words.length; i += wordsPerScreen) {
      result.push(words.slice(i, i + wordsPerScreen).join(' '));
    }
    return result;
  }, [activeText, wordsPerScreen]);

  // Reset page index on text version change
  useEffect(() => {
    setCurrentPage(0);
  }, [useSimplified]);

  if (chunks.length === 0) return null;

  return (
    <div className={`flex flex-col gap-5 w-full ${className}`}>
      {/* AI Simplification Toggle */}
      {simplifiedText && (
        <div className="flex justify-end">
          <button
            onClick={() => setUseSimplified(!useSimplified)}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            {useSimplified ? (t.showOriginal || l.show) : (t.simplifyText || l.sim)}
          </button>
        </div>
      )}

      {/* Main reading area */}
      <div className="min-h-[120px] text-lg leading-relaxed">
        <BionicText text={chunks[currentPage]} />
      </div>

      {/* Content Pacing Controls */}
      {chunks.length > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
          <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 disabled:opacity-30">
            {t.prevPage || l.prev}
          </button>
          <span className="text-xs font-black tracking-widest text-slate-400">
            {currentPage + 1} / {chunks.length}
          </span>
          <button disabled={currentPage === chunks.length - 1} onClick={() => setCurrentPage(p => p + 1)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-500 text-white disabled:opacity-30">
            {t.nextPage || l.next}
          </button>
        </div>
      )}
    </div>
  );
}