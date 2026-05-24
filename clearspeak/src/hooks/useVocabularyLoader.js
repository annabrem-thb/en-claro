import { useState, useEffect } from 'react';

/**
 * Ładuje odpowiednią bazę słownictwa (Code Splitting) na podstawie wybranego języka.
 */
export function useVocabularyLoader(language) {
  const [db, setDb] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadDatabase = async () => {
      try {
        let loadedModule;
        if (language === 'pl') {
          loadedModule = await import('../data/vocabulary_pl.js');
          if (isMounted) setDb(loadedModule.wordDatabasePL);
        } else if (language === 'en') {
          loadedModule = await import('../data/vocabulary_en.js');
          if (isMounted) setDb(loadedModule.wordDatabaseEN);
        } else {
          loadedModule = await import('../data/vocabulary_de.js');
          if (isMounted) setDb(loadedModule.wordDatabaseDE);
        }
      } catch (error) {
        console.error("Failed to load vocabulary database:", error);
      }
    };
    loadDatabase();
    return () => { isMounted = false; };
  }, [language]);

  return db;
}