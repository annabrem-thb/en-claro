import { describe, it, expect } from 'vitest'; // Note: Change to '@jest/globals' if using Jest
import enDictionary from './locales/en.json';
import plDictionary from './locales/pl.json';
import deDictionary from './locales/de.json';

/**
 * Recursively extracts all keys from a nested object and flattens them into an array of dot-notated strings.
 * E.g., { common: { save: "Save" } } becomes ["common.save"]
 */
function getNestedKeys(obj: Record<string, any>, prefix: string = ''): string[] {
  return Object.keys(obj).reduce((keys: string[], key: string) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      return [...keys, ...getNestedKeys(obj[key], currentPath)];
    }
    
    return [...keys, currentPath];
  }, []);
}

describe('i18n Dictionaries', () => {
  it('should have the exact same keys across all supported locales (en, pl, de)', () => {
    const enKeys = getNestedKeys(enDictionary).sort();
    const plKeys = getNestedKeys(plDictionary).sort();
    const deKeys = getNestedKeys(deDictionary).sort();

    // Compare Polish and German keys against the English baseline.
    // If this fails, the test runner output will explicitly show which keys are missing or extra.
    expect(plKeys).toEqual(enKeys);
    expect(deKeys).toEqual(enKeys);
  });
});