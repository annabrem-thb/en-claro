import React from 'react';
import { useAppSettings } from '../../hooks/useAppSettings.js';

export default function BionicText({ text, children, className = '', enabled }) {
  const { inclusiveOptions } = useAppSettings();
  const content = text || children;

  const isBionic = enabled !== undefined ? enabled : inclusiveOptions?.bionicReading;

  // Return original content if Bionic Reading is disabled or content is not a string
  if (!isBionic || typeof content !== 'string') {
    return <span className={className}>{content}</span>;
  }

  // Split text into words while preserving spaces as separate array elements
  const words = content.split(/(\s+)/);

  const bionicContent = words.map((word, index) => {
    // Render whitespace characters as-is
    if (/^\s+$/.test(word)) {
      return word;
    }

    // Bionic Reading Algorithm: calculate the midpoint of the word to bold the first half
    const mid = Math.ceil(word.length / 2);
    
    const boldPart = word.slice(0, mid);
    const normalPart = word.slice(mid);

    return (
      <span key={index}>
        <b className="font-black">{boldPart}</b>
        <span className="opacity-80">{normalPart}</span>
      </span>
    );
  });

  return <span className={className}>{bionicContent}</span>;
}