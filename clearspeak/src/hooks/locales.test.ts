import { describe, it, expect } from 'vitest';
import plDictionary from '../i18n-core/locales/pl.json';
import deDictionary from '../i18n-core/locales/de.json';

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
  it('should have the exact same keys across complete locales (pl, de)', () => {
    const plKeys = getNestedKeys(plDictionary).sort();
    const deKeys = getNestedKeys(deDictionary).sort();

    // Compare Polish and German keys as they are fully translated.
    expect(deKeys).toEqual(plKeys);
  });
});