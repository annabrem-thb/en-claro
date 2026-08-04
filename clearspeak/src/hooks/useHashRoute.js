import { useEffect } from 'react';

const VALID_TABS = ['literacy', 'visual', 'cognitive'];

function parseHash() {
  return window.location.hash.replace(/^#\/?/, '').toLowerCase();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// One-time synchronous read used directly in useState initializers, so the
// very first render already reflects a deep-linked URL (e.g. #/visual)
// instead of flashing the intro screen before correcting itself.
export function getInitialRouteState() {
  const segment = parseHash();

  if (segment === 'settings') {
    return {
      showIntro: false,
      settingsOpen: true,
      activeTab: null,
    };
  }
  if (segment === 'garden') {
    return {
      showIntro: false,
      settingsOpen: false,
      activeTab: 'Garden',
    };
  }
  if (VALID_TABS.includes(segment)) {
    return {
      showIntro: false,
      settingsOpen: false,
      activeTab: capitalize(segment),
    };
  }
  return {
    showIntro: true,
    settingsOpen: false,
    activeTab: null,
  };
}

// A deliberately minimal, dependency-free router: just enough to make the
// browser back/forward buttons behave predictably and to let individual
// pillars/settings be linked to directly (e.g. for a study coordinator
// sending a participant straight to #/visual), without pulling in
// react-router for what is a handful of screens.
//
// It does not replace any existing state or click handlers — App.jsx's
// setSettingsOpen/handleTabChange/handleGardenClick keep working exactly as
// before. This hook only keeps window.location.hash in sync with that state
// (one effect writes state -> hash, another listens for hashchange to drive
// state the other way for back/forward navigation).
export function useHashRoute({
  showIntro,
  activeTab,
  settingsOpen,
  setShowIntro,
  setSettingsOpen,
  onNavigateTab,
}) {
  useEffect(() => {
    const desiredSegment = settingsOpen
      ? 'settings'
      : showIntro
        ? ''
        : activeTab.toLowerCase();
    const desiredHash = desiredSegment ? `#/${desiredSegment}` : '';
    if (window.location.hash !== desiredHash) {
      window.location.hash = desiredHash;
    }
  }, [showIntro, activeTab, settingsOpen]);

  useEffect(() => {
    const handleHashChange = () => {
      const segment = parseHash();

      if (segment === 'settings') {
        setShowIntro(false);
        setSettingsOpen(true);
        return;
      }
      if (segment === 'garden') {
        setSettingsOpen(false);
        setShowIntro(false);
        onNavigateTab('Garden');
        return;
      }
      if (VALID_TABS.includes(segment)) {
        setSettingsOpen(false);
        setShowIntro(false);
        onNavigateTab(capitalize(segment));
        return;
      }
      // Empty/unrecognized hash — e.g. the user pressed Back all the way to
      // the start, or a link was mistyped.
      setSettingsOpen(false);
      setShowIntro(true);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setShowIntro, setSettingsOpen, onNavigateTab]);
}
