import React, { useMemo } from 'react';

/**
 * BionicText Component (Optimized with Memoization)
 * 
 * Renders text with the Bionic Reading method, bolding the first half of each word.
 * This optimized version uses `React.memo` to prevent unnecessary re-renders and
 * `useMemo` to cache the result of the text processing, ensuring high performance
 * even with frequent updates.
 * 
 * @param {object} props
 * @param {string} props.text - The text to be rendered.
 * @param {boolean} [props.enabled=false] - Toggles Bionic Reading on or off.
 */
function BionicText({ text, enabled = false }) {
  // useMemo caches the processed JSX. The calculation only re-runs if 'text' or 'enabled' changes.
  const processedText = useMemo(() => {
    if (!enabled || !text) {
      return text;
    }

    // The core logic of Bionic Reading
    return text.split(/(\s+)/).map((segment, index) => {
      // Preserve whitespace segments (spaces, newlines)
      if (segment.match(/\s+/)) {
        return segment;
      }
      // Process only word segments
      const midpoint = Math.ceil(segment.length / 2);
      const boldPart = segment.substring(0, midpoint);
      const regularPart = segment.substring(midpoint);
      return (
        <React.Fragment key={index}>
          <b className="font-black">{boldPart}</b>{regularPart}
        </React.Fragment>
      );
    });
  }, [text, enabled]);

  return <>{processedText}</>;
}

export default React.memo(BionicText);