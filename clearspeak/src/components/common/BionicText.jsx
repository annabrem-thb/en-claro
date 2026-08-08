import React, { useMemo } from 'react';

function BionicText({ text, enabled = false }) {
  const processedText = useMemo(() => {
    if (!enabled || !text) {
      return text;
    }

    return text.split(/(\s+)/).map((segment, index) => {
      if (segment.match(/\s+/)) {
        return segment;
      }
      const midpoint = Math.ceil(segment.length / 2);
      const boldPart = segment.substring(0, midpoint);
      const regularPart = segment.substring(midpoint);
      return (
        <React.Fragment key={index}>
          <b className="font-black">{boldPart}</b>
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

  return <>{processedText}</>;
}

export default React.memo(BionicText);
