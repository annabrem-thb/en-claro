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
          <b className="font-black">{boldPart}</b>{regularPart}
        </React.Fragment>
      );
    });
  }, [text, enabled]);

  return <>{processedText}</>;
}

export default React.memo(BionicText);