import React, { useState, useMemo, useEffect } from 'react';

import { useUserSettingsContext } from '../UserSettingsContext.jsx';

import BionicText from './BionicText.jsx';

export default function ChunkedText({
  originalText,
  simplifiedText,
  wordsPerScreen = 30,
  t = {},
  className = '',
}) {
  const [useSimplified, setUseSimplified] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const { settings } = useUserSettingsContext();
  const { language } = settings;
  const fallbacks = {
    pl: {
      show: 'Pokaż oryginał',
      sim: 'Uprość tekst ✨',
      prev: '← Poprzednia',
      next: 'Następna →',
    },
    de: {
      show: 'Original anzeigen',
      sim: 'Text vereinfachen ✨',
      prev: '← Zurück',
      next: 'Weiter →',
    },
    en: {
      show: 'Show original',
      sim: 'Simplify text ✨',
      prev: '← Previous',
      next: 'Next →',
    },
  };
  const l = fallbacks[language] || fallbacks.en;

  const activeText =
    useSimplified && simplifiedText ? simplifiedText : originalText;

  const chunks = useMemo(() => {
    if (!activeText) return [];
    const words = activeText.split(/\s+/);
    const result = [];
    for (let i = 0; i < words.length; i += wordsPerScreen) {
      result.push(words.slice(i, i + wordsPerScreen).join(' '));
    }
    return result;
  }, [activeText, wordsPerScreen]);

  useEffect(() => {
    setCurrentPage(0);
  }, [useSimplified]);

  if (chunks.length === 0) return null;

  return (
    <div className={`flex w-full flex-col gap-5 ${className}`}>
      {}
      {simplifiedText && (
        <div className="flex justify-end">
          <button
            onClick={() => setUseSimplified(!useSimplified)}
            className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-black tracking-widest text-indigo-700 uppercase shadow-sm transition-colors hover:bg-indigo-100"
          >
            {useSimplified
              ? t('showOriginal') || l.show
              : t('simplifyText') || l.sim}
          </button>
        </div>
      )}

      {}
      <div className="min-h-[120px] text-lg leading-relaxed">
        <BionicText text={chunks[currentPage]} />
      </div>

      {}
      {chunks.length > 1 && (
        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-30"
          >
            {t('prevPage') || l.prev}
          </button>
          <span className="text-xs font-black tracking-widest text-slate-600">
            {currentPage + 1} / {chunks.length}
          </span>
          <button
            disabled={currentPage === chunks.length - 1}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-30"
          >
            {t('nextPage') || l.next}
          </button>
        </div>
      )}
    </div>
  );
}
