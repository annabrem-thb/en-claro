import React, { useMemo } from 'react';

// Splits `str` into user-perceived characters ("grapheme clusters") rather
// than raw UTF-16 code units. Plain-language text (including PL/DE
// diacritics like "ą"/"ü") is one code unit per character either way, so
// this changes nothing for ordinary words — but most emoji aren't: a
// surrogate-pair emoji like "🔷" is 2 code units, and a
// base-plus-variation-selector one like "➡️" is too. Splitting those by
// `.substring()` at their code-unit midpoint cuts a surrogate pair or a
// variation selector away from its base character, producing an invalid,
// unrenderable half on each side (visible as a broken/tofu glyph) — see the
// Visual pillar's emoji-only answer options, the first content in this app
// to put raw emoji through BionicText directly rather than in a separate
// (never bionic-split) `icon` field.
function splitGraphemes(str) {
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: 'grapheme',
    });
    return Array.from(segmenter.segment(str), (s) => s.segment);
  }
  // Intl.Segmenter is unavailable (older Firefox): fall back to code-point
  // iteration, which at least keeps surrogate pairs intact even though it
  // can't join a base character with a following variation selector/ZWJ.
  return Array.from(str);
}

function BionicText({ text, enabled = false }) {
  const processedText = useMemo(() => {
    if (!enabled || !text) {
      return text;
    }

    return text.split(/(\s+)/).map((segment, index) => {
      if (segment.match(/\s+/)) {
        return segment;
      }
      const graphemes = splitGraphemes(segment);
      const midpoint = Math.ceil(graphemes.length / 2);
      const boldPart = graphemes.slice(0, midpoint).join('');
      const regularPart = graphemes.slice(midpoint).join('');
      return (
        <React.Fragment key={index}>
          <b className="font-semibold">{boldPart}</b>
          {/* Many callers (uppercase nav headings, button labels) already
              set font-bold/font-black on the whole string, which makes the
              "regular" half render at the exact same weight as the bold
              half — the emphasis contrast disappears even though this
              component is wired up correctly. Forcing font-normal here
              guarantees the two halves are always visually distinct,
              regardless of the ambient weight around this component. */}
          <span className="font-normal">{regularPart}</span>
        </React.Fragment>
      );
    });
  }, [text, enabled]);

  // A bare Fragment here used to let every `<b>`/`<span>` pair "leak" out
  // as a direct child of whatever rendered <BionicText>. That's invisible
  // in normal block/inline flow, but inside any `flex ...  gap-*` container
  // (the icon+label button pattern used all over this app), each pair
  // becomes its own flex item — so the container's gap gets inserted
  // *inside* every word, between its bold and regular halves, rendering as
  // a visible split ("UDOST ĘPNIJ POS TĘP" instead of "UDOSTĘPNIJ POSTĘP").
  // A single wrapping <span> makes this always render as one flex/inline
  // item, with no effect on plain (non-flex) callers since an unstyled
  // span is transparent to normal text flow.
  return <span>{processedText}</span>;
}

export default React.memo(BionicText);
