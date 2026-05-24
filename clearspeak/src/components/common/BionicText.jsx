import React from 'react';
import { useAppSettings } from '../../hooks/useAppSettings.js';

export default function BionicText({ text, children, className = '', enabled }) {
  const { inclusiveOptions } = useAppSettings();
  const content = text || children;

  const isBionic = enabled !== undefined ? enabled : inclusiveOptions?.bionicReading;

  // Jeśli tryb jest wyłączony lub podano coś innego niż tekst, zwracamy oryginał
  if (!isBionic || typeof content !== 'string') {
    return <span className={className}>{content}</span>;
  }

  // Dzielimy tekst na wyrazy, zachowując spacje jako osobne elementy tablicy
  const words = content.split(/(\s+)/);

  const bionicContent = words.map((word, index) => {
    // Jeśli to są tylko spacje, po prostu je renderujemy
    if (/^\s+$/.test(word)) {
      return word;
    }

    // Algorytm Bionic Reading: wyliczamy połowę długości słowa
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