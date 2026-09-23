import { useState } from 'react';

import { STUDY_SETS } from '../data/studySets.js';

function readStoredSet() {
  const stored = localStorage.getItem('studySet');
  return STUDY_SETS.includes(stored) ? stored : null;
}

// Which content set (A/B) a device is locked to is decided once by
// whoever sets the device up for a study session, not chosen by the
// participant inside the app — so this reads a `?set=A`/`?set=B` URL param
// once on first load (a one-time device setup step) and persists it,
// rather than exposing a picker anywhere in the app's own UI.
export function useStudySet() {
  const [studySet, setStudySetState] = useState(() => {
    const fromUrl = new URLSearchParams(window.location.search)
      .get('set')
      ?.toUpperCase();
    if (STUDY_SETS.includes(fromUrl)) {
      localStorage.setItem('studySet', fromUrl);
      return fromUrl;
    }
    return readStoredSet();
  });

  const setStudySet = (value) => {
    if (value === null) {
      localStorage.removeItem('studySet');
    } else {
      localStorage.setItem('studySet', value);
    }
    setStudySetState(value);
  };

  return { studySet, setStudySet };
}
