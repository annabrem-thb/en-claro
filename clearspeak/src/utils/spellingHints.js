// A map for phonetic-like descriptions of letters and digraphs
const PRONUNCIATIONS = {
  pl: {
    ó: 'o z kreską',
    u: 'u zwykłe',
    ż: 'żet z kropką',
    rz: 'er zet',
    h: 'samo ha',
    ch: 'ce ha',
    ę: 'e z ogonkiem',
    ą: 'a z ogonkiem',
    ś: 'eś',
    ć: 'cie',
    ń: 'eń',
    ź: 'ziet',
  },
  de: {
    ß: 'Eszett',
    ss: 'doppel S',
    ie: 'i e',
    ei: 'e i',
    ä: 'a Umlaut',
    ö: 'o Umlaut',
    ü: 'u Umlaut',
    v: 'vau',
    f: 'eff',
    d: 'd am Ende',
    t: 't am Ende',
  },
  en: {
    affect: 'affect, with an a',
    effect: 'effect, with an e',
    ie: 'i e',
    ei: 'e i',
    stationary: 'stationary, with a for "at rest"',
    stationery: 'stationery, with e for "envelopes"',
  },
};

/**
 * Finds the differing substring between two words.
 * e.g., findDifferingSubstring("może", "morze") => { diff1: "ż", diff2: "rz" }
 */
function findDifferingSubstring(str1, str2) {
  let i = 0;
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    i++;
  }

  let j = 0;
  while (
    j < str1.length - i &&
    j < str2.length - i &&
    str1[str1.length - 1 - j] === str2[str2.length - 1 - j]
  ) {
    j++;
  }

  const diff1 = str1.substring(i, str1.length - j);
  const diff2 = str2.substring(i, str2.length - j);

  if (diff1 || diff2) {
    return { diff1, diff2 };
  }
  return null;
}

/**
 * Generates a "smart" hint for homophones or similar-sounding words.
 * For example, for "może" vs "morze", it will say "może, pisane przez żet z kropką".
 * @param {string} word - The word to generate a hint for.
 * @param {string[]} allOptions - All possible word options in the exercise.
 * @param {string} lang - The current language code ('en', 'pl', 'de').
 * @param {object} t - The translation object.
 * @returns {string} - The original word, possibly with a hint appended.
 */
export function getSmartSpellingHint(word, allOptions, lang, t) {
  if (allOptions.length !== 2) return word;

  const otherWord = allOptions.find((opt) => opt !== word);
  if (!otherWord) return word;

  const diffs = findDifferingSubstring(
    word.toLowerCase(),
    otherWord.toLowerCase(),
  );
  if (!diffs) return word;

  const differingPart = diffs.diff1;
  const pronunciations = PRONUNCIATIONS[lang];

  if (pronunciations && pronunciations[differingPart]) {
    const hint = pronunciations[differingPart];
    return t?.spellingHint ? t.spellingHint(word, hint) : `${word}, with ${hint}`;
  }

  return word; // Fallback to just the word if no smart hint is found
}
