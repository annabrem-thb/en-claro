import { useState, useEffect } from 'react';

export function useVocabularyLoader(language, skip = false) {
  const [db, setDb] = useState(null);
  useEffect(() => {
    // While the intro screen is still showing, `language` reflects whatever
    // the last saved (or default) setting is — not necessarily what the
    // user is about to pick. Fetching eagerly here used to start a dynamic
    // import for that stale language, which got abandoned mid-flight the
    // instant the user picked a different one on the intro screen. Chrome
    // shrugs that off, but WebKit's module loader treats the cancelled
    // import as corrupting its state for the *browsing context*, not just
    // that one request: the very next dynamic import (the language the user
    // actually chose) then also throws "Importing a module script failed"
    // even though its own network fetch succeeds. Not loading anything
    // until there's a real, settled language choice avoids the wasted
    // fetch entirely — and the race it exposed on WebKit — rather than
    // patching around the symptom.
    if (skip) return undefined;
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
        console.error('Failed to load vocabulary database:', error);
      }
    };
    loadDatabase();
    return () => {
      isMounted = false;
    };
  }, [language, skip]);
  return db;
}
