import { describe, it, expect } from 'vitest';

import { buildTranslation } from './index.js';

const enDictionary = buildTranslation('en');
const plDictionary = buildTranslation('pl');
const deDictionary = buildTranslation('de');

function getNestedKeys(
  obj: Record<string, any>,
  prefix: string = '',
): string[] {
  return Object.keys(obj).reduce((keys: string[], key: string) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      return [...keys, ...getNestedKeys(obj[key], currentPath)];
    }

    return [...keys, currentPath];
  }, []);
}

const PLURAL_SUFFIXES = ['zero', 'one', 'two', 'few', 'many', 'other'];

function pluralBaseKey(key: string): string | null {
  for (const suffix of PLURAL_SUFFIXES) {
    if (key.endsWith(`_${suffix}`)) return key.slice(0, -(suffix.length + 1));
  }
  return null;
}

// i18next plural keys ("exercisesCount_one/_few/_many/_other") only need the
// suffixes that a language's own CLDR cardinal rules can actually produce for
// integers — comparing English's suffix set directly against Polish's would
// wrongly demand an "_other" form Polish never reaches for whole-number
// counts (see check-locales.mjs, which special-cases this the same way).
function requiredPluralSuffixes(lang: string): Set<string> {
  const rules = new Intl.PluralRules(lang, { type: 'cardinal' });
  const suffixes = new Set<string>();
  for (let n = 0; n <= 200; n++) suffixes.add(rules.select(n));
  return suffixes;
}

function missingKeysAgainstEnglish(
  targetDictionary: Record<string, any>,
  targetLang: string,
): string[] {
  const enKeys = getNestedKeys(enDictionary);
  const enPluralBases = new Set(enKeys.map(pluralBaseKey).filter(Boolean));
  const targetKeys = new Set(getNestedKeys(targetDictionary));
  const required = requiredPluralSuffixes(targetLang);

  return enKeys.filter((key) => {
    if (targetKeys.has(key)) return false;
    const base = pluralBaseKey(key);
    if (base && enPluralBases.has(base)) {
      const suffix = key.slice(base.length + 1);
      return required.has(suffix);
    }
    return true;
  });
}

describe('i18n Dictionaries', () => {
  it('Polish should have every English key it actually needs (CLDR-aware)', () => {
    expect(missingKeysAgainstEnglish(plDictionary, 'pl')).toEqual([]);
  });

  it('German should have every English key it actually needs (CLDR-aware)', () => {
    expect(missingKeysAgainstEnglish(deDictionary, 'de')).toEqual([]);
  });
});
