import { useEffect } from 'react';

// WCAG 2.4.2 (Page Titled): this app is a single static HTML document
// (hash-routed, no react-router), so index.html's <title>EnClaro</title>
// otherwise never changes as the user moves between the intro, a pillar,
// Settings, or the Garden — every view is announced identically to a screen
// reader user and looks identical in browser history/tab-switcher UI.
export function useDocumentTitle(segment) {
  useEffect(() => {
    document.title = segment ? `EnClaro | ${segment}` : 'EnClaro';
  }, [segment]);
}
