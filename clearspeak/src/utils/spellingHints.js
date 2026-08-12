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
const DASH_WORD = { pl: 'myślnik', en: 'hyphen', de: 'Bindestrich' };

// Detects an option that differs from a sibling only by spacing/hyphenation
// (e.g. "nie odwołalna" / "nie-odwołalna" vs the correct "nieodwołalna") —
// exercises across grapheme/context items test exactly this joined-vs-
// separate-vs-hyphenated distinction, in Polish ("nie"/"na" + word) and
// German (compound nouns) alike. A bare space or hyphen often isn't read
// with an audible-enough pause to actually tell the variants apart by ear,
// which makes an otherwise-legitimate spelling exercise unsolvable through
// the voice assistant alone. Forcing a comma pause at each word part, and
// explicitly naming a hyphen when present, makes every variant sound
// distinct. Only fires when a genuinely joined sibling exists in the same
// option set — an ordinary multi-word answer with no such sibling is left
// untouched rather than gaining an artificial pause.
function getSpacingVariantHint(word, allOptions, lang) {
  if (!/[\s-]/.test(word)) return null;
  const stripped = word.replace(/[\s-]/g, '').toLowerCase();
  const hasJoinedSibling = allOptions.some(
    (other) =>
      other !== word && other.replace(/[\s-]/g, '').toLowerCase() === stripped,
  );
  if (!hasJoinedSibling) return null;
  const dashWord = DASH_WORD[lang] || DASH_WORD.en;
  // Spaces first, then hyphens: the hyphen replacement's own inserted text
  // (", myślnik, ") contains spaces of its own — running the space pass
  // second would re-match and double up those just-inserted commas.
  return word.replace(/ +/g, ', ').replace(/-/g, `, ${dashWord}, `);
}

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
    return { diff1: diff1, diff2: diff2 };
  }
  return null;
}
export function getSmartSpellingHint(word, allOptions, lang, t) {
  const spacingHint = getSpacingVariantHint(word, allOptions, lang);
  if (spacingHint) return spacingHint;

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
    return t('spellingHint', { word, hint });
  }
  return word;
}
