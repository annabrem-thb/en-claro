import { useState } from 'react';

const VARIANT_ORDERS = ['classicFirst', 'gamifiedFirst'];

function readStoredOrder() {
  const stored = localStorage.getItem('variantOrder');
  return VARIANT_ORDERS.includes(stored) ? stored : null;
}

// Which variant (classic/gamified) a participant starts on is decided once
// by whoever sets the device up for a study session, not chosen by the
// participant inside the app — same pattern as useStudySet.js's content-set
// assignment. Letting participants pick their own starting variant would
// undo the randomized order the comparison design relies on to separate a
// gamification effect from a plain order/practice effect, so this reads a
// `?order=classicFirst`/`?order=gamifiedFirst` URL param once on first load
// and persists it, rather than exposing a picker anywhere in the UI.
export function useVariantOrder() {
  const [variantOrder] = useState(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('order');
    if (VARIANT_ORDERS.includes(fromUrl)) {
      localStorage.setItem('variantOrder', fromUrl);
      return fromUrl;
    }
    return readStoredOrder();
  });

  return { variantOrder };
}
