// vocabularyPL.js — version for dyslexic adults v2
// 15 items per category
// Focus: Polish spelling traps (u/ó, rz/ż, ch/h, nie/-, -bym),
//            phonetics of difficult consonant clusters, professional word segmentation,
//            spatial orientation and auditory memory.
// Hint language: PL / EN / DE

export const wordDatabasePL = {
  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: PHONEME
  // Difficult words for adults: consonant clusters, nasal vowels, palatalization.
  // ─────────────────────────────────────────────────────────────────────────────
  phonemes: [
    {
      id: 1,
      word: 'Chrząszcz',
      difficulty: 3, // 1=łatwe, 2=średnie, 3=trudne
      phonetic: '/ xʂɔ̃ʂt͡ʂ /',
      hints: {
        pl: 'Owad z twardą pokrywą na skrzydłach, np. leśny żuk',
        en: 'Beetle — forest insect with hard wing covers',
        de: 'Käfer — Waldinsekt mit harten Flügeldecken',
      },
    },
    {
      id: 2,
      word: 'Szczegół',
      difficulty: 1,
      phonetic: '/ ˈʂt͡ʂɛ.ɡuw /',
      hints: {
        pl: 'Drobna, ale ważna informacja lub element całości',
        en: 'Detail — a small but important piece of information',
        de: 'Detail — ein kleines, aber wichtiges Merkmal',
      },
    },
    {
      id: 3,
      word: 'Źródło',
      difficulty: 1,
      phonetic: '/ ˈʑrud.wɔ /',
      hints: {
        pl: 'Pierwotne miejsce wypływu wody lub pochodzenia informacji',
        en: 'Source — origin of water or information',
        de: 'Quelle — Herkunft von Wasser oder Information',
      },
    },
    {
      id: 4,
      word: 'Gwóźdź',
      difficulty: 2,
      phonetic: '/ ɡvuɕd͡ʑ /',
      hints: {
        pl: 'Metalowy sztyft wbijany w drewno lub ścianę',
        en: 'Nail — metal fastener hammered into wood or wall',
        de: 'Nagel — Metallstift, der in Holz oder Wand getrieben wird',
      },
    },
    {
      id: 5,
      word: 'Przestrzeń',
      difficulty: 1,
      phonetic: '/ ˈpʂɛst.ʂɛɲ /',
      hints: {
        pl: 'Nieograniczony obszar lub wolne miejsce w pomieszczeniu',
        en: 'Space — unlimited area or empty room',
        de: 'Raum — unbegrenzter Bereich oder leeres Zimmer',
      },
    },
    {
      id: 6,
      word: 'Właściciel',
      difficulty: 2,
      phonetic: '/ vwaˈɕt͡ɕi.t͡ɕɛl /',
      hints: {
        pl: 'Osoba będąca prawnym posiadaczem nieruchomości lub firmy',
        en: 'Owner — legal possessor of property or business',
        de: 'Eigentümer — rechtmäßiger Besitzer von Immobilien oder Unternehmen',
      },
    },
    {
      id: 7,
      word: 'Przyszłość',
      difficulty: 1,
      phonetic: '/ ˈpʂɨʂ.wɔɕt͡ɕ /',
      hints: {
        pl: 'Czas, który jeszcze przed nami; perspektywy na jutro',
        en: 'Future — time still ahead of us',
        de: 'Zukunft — die vor uns liegende Zeit',
      },
    },
    {
      id: 8,
      word: 'Bezwzględny',
      difficulty: 3,
      phonetic: '/ bɛzˈvzɡlɛnd.nɨ /',
      hints: {
        pl: 'Surowy, niepodatny na litość ani wyjątki',
        en: 'Ruthless — strict, allowing no mercy or exceptions',
        de: 'Rücksichtslos — streng, keine Gnade kennend',
      },
    },
    {
      id: 9,
      word: 'Wynagrodzenie',
      difficulty: 2,
      tags: ['business'],
      phonetic: '/ vɨ.na.ɡrɔˈd͡zɛ.ɲɛ /',
      hints: {
        pl: 'Pieniądze wypłacane pracownikowi za wykonywaną pracę',
        en: 'Salary — money paid to an employee for work',
        de: 'Gehalt — Geld, das einem Arbeitnehmer für Arbeit gezahlt wird',
      },
    },
    {
      id: 10,
      word: 'Zaangażowanie',
      difficulty: 2,
      phonetic: '/ za.an.ɡaˈʐɔ.va.ɲɛ /',
      hints: {
        pl: 'Silne poświęcenie się sprawie, projektowi lub osobie',
        en: 'Commitment — strong dedication to a cause or project',
        de: 'Engagement — starke Hingabe an eine Sache oder Person',
      },
    },
    {
      id: 11,
      word: 'Odpowiedzialność',
      difficulty: 2,
      tags: ['business', 'everyday'],
      phonetic: '/ ɔt.pɔ.vjɛd͡ʑalˈnɔɕt͡ɕ /',
      hints: {
        pl: 'Obowiązek ponoszenia skutków i konsekwencji swoich działań',
        en: "Responsibility — duty to bear the consequences of one's actions",
        de: 'Verantwortung — Pflicht, die Folgen des eigenen Handelns zu tragen',
      },
    },
    {
      id: 12,
      word: 'Przedsiębiorstwo',
      difficulty: 3,
      tags: ['business'],
      phonetic: '/ pʂɛd.ɕɛˈbjɔrs.tvɔ /',
      hints: {
        pl: 'Firma lub podmiot prowadzący zorganizowaną działalność gospodarczą',
        en: 'Enterprise — firm conducting organised business activity',
        de: 'Unternehmen — Firma, die organisierte Geschäftstätigkeit betreibt',
      },
    },
    {
      id: 13,
      word: 'Trzcina',
      difficulty: 2,
      phonetic: '/ ˈtʂt͡ɕi.na /',
      hints: {
        pl: 'Wysoka roślina wodna z długą, pustą w środku łodygą',
        en: 'Reed — tall aquatic plant with a long hollow stem',
        de: 'Schilf — hohe Wasserpflanze mit langem, hohlem Stängel',
      },
    },
    {
      id: 14,
      word: 'Wnioskodawca',
      difficulty: 2,
      phonetic: '/ vɲɔs.kɔˈdaf.tsa /',
      hints: {
        pl: 'Osoba oficjalnie składająca wniosek lub petycję do urzędu',
        en: 'Applicant — person officially submitting a petition or application',
        de: 'Antragsteller — Person, die offiziell einen Antrag einreicht',
      },
    },
    {
      id: 15,
      word: 'Współpracownik',
      difficulty: 2,
      phonetic: '/ fspuw.praˈtsɔv.ɲik /',
      hints: {
        pl: 'Osoba, z którą pracujemy w tym samym zespole lub projekcie',
        en: 'Colleague — person we work with in the same team or project',
        de: 'Kollege — Person, mit der wir im selben Team arbeiten',
      },
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: GRAPHEME
  // 15 spelling rules most commonly confused by dyslexic adults.
  // ─────────────────────────────────────────────────────────────────────────────
  graphemes: [
    {
      id: 1,
      difficulty: 1,
      focus: 'ó wymienne na o',
      questions: {
        pl: 'Które słowo ma ó wymieniające się na o w innej formie?',
        en: "Which word's 'ó' alternates with 'o' in another grammatical form?",
        de: "Bei welchem Wort wechselt 'ó' zu 'o' in einer anderen Form?",
      },
      options: [
        { text: 'Stół', isCorrect: true, icon: '🪑' },
        { text: 'Góra', isCorrect: false, icon: '⛰️' },
      ],
    },
    {
      id: 2,
      difficulty: 2,
      focus: 'ó niewymienne (wyjątek)',
      questions: {
        pl: 'Które ó NIGDY nie wymienia się na o ani e w żadnej formie?',
        en: "Which 'ó' NEVER changes to 'o' or 'e' in any grammatical form?",
        de: "Welches 'ó' wechselt in KEINER Form zu 'o' oder 'e'?",
      },
      options: [
        { text: 'Córka', isCorrect: true, icon: '👩' },
        { text: 'Wróg', isCorrect: false, icon: '👤' },
      ],
    },
    {
      id: 3,
      focus: 'rz po spółgłosce p',
      difficulty: 1,
      questions: {
        pl: 'Po spółgłosce p zawsze piszemy rz (nie ż). Które słowo jest poprawne?',
        en: "After consonant 'p' we always write 'rz'. Which spelling is correct?",
        de: "Nach dem Konsonanten 'p' schreibt man immer 'rz'. Welche Schreibweise ist korrekt?",
      },
      options: [
        { text: 'Przemoc', isCorrect: true, icon: '⚠️' },
        { text: 'Pżemoc', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 4,
      difficulty: 1,
      focus: 'rz po spółgłosce b',
      questions: {
        pl: 'Po spółgłosce b zawsze piszemy rz. Które słowo jest poprawne?',
        en: "After consonant 'b' we always write 'rz'. Which is correct?",
        de: "Nach dem Konsonanten 'b' schreibt man immer 'rz'. Welches ist korrekt?",
      },
      options: [
        { text: 'Brzuch', isCorrect: true, icon: '🧍' },
        { text: 'Bżuch', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 5,
      difficulty: 2,
      focus: 'ż wymienne na g',
      questions: {
        pl: 'Które ż wymienia się na g w innej formie wyrazu? (droższy ← drogi)',
        en: "Which 'ż' alternates with 'g' in a related word form?",
        de: "Welches 'ż' wechselt mit 'g' in einer verwandten Wortform?",
      },
      options: [
        { text: 'Droższy', isCorrect: true, icon: '💸' },
        { text: 'Żółw', isCorrect: false, icon: '🐢' },
      ],
    },
    {
      id: 6,
      difficulty: 2,
      focus: 'h w zapożyczeniach (hierarchia, historia, humor)',
      questions: {
        pl: 'Które słowo obcego pochodzenia piszemy przez h (nie ch)?',
        en: "Which word of foreign origin is written with 'h' (not 'ch')?",
        de: "Welches Fremdwort schreibt man mit 'h' (nicht 'ch')?",
      },
      options: [
        { text: 'Hierarchia', isCorrect: true, icon: '📊' },
        { text: 'Chmura', isCorrect: false, icon: '☁️' },
      ],
    },
    {
      id: 7,
      difficulty: 1,
      focus: 'nie z czasownikiem — piszemy osobno',
      questions: {
        pl: 'Nie z czasownikiem piszemy zawsze oddzielnie. Które jest poprawne?',
        en: "'Nie' before a verb is always written as a separate word. Which is correct?",
        de: "'Nie' vor einem Verb schreibt man immer getrennt. Welches ist korrekt?",
      },
      options: [
        { text: 'Nie pracuję', isCorrect: true, icon: '🚫' },
        { text: 'Niepracuję', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 8,
      difficulty: 1,
      focus: 'nie z przymiotnikiem — piszemy razem',
      questions: {
        pl: 'Nie z przymiotnikiem piszemy łącznie. Które jest poprawne?',
        en: "'Nie' before an adjective is written as one word. Which is correct?",
        de: "'Nie' vor einem Adjektiv schreibt man zusammen. Welches ist korrekt?",
      },
      options: [
        { text: 'Niesprawiedliwy', isCorrect: true, icon: '⚖️' },
        { text: 'Nie sprawiedliwy', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 9,
      difficulty: 2,
      focus: '-bym / -byś / -by z osobową końcówką — razem z czasownikiem',
      questions: {
        pl: 'Partykułę by z końcówką osobową piszemy razem z czasownikiem. Które jest poprawne?',
        en: "The particle 'by' with a personal ending is written together with the verb. Which is correct?",
        de: "Das Partikel 'by' mit persönlicher Endung schreibt man zusammen mit dem Verb.",
      },
      options: [
        { text: 'Chciałbym', isCorrect: true, icon: '💬' },
        { text: 'Chciał bym', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 10,
      difficulty: 1,
      focus: 'ą przed b i p (nie on / om)',
      questions: {
        pl: 'Nosówkę tylną przed spółgłoską b piszemy jako ą (nie on). Które jest poprawne?',
        en: "The back nasal vowel before 'b' is written as 'ą' (not 'on'). Which is correct?",
        de: "Der hintere Nasal vor 'b' wird als 'ą' (nicht 'on') geschrieben.",
      },
      options: [
        { text: 'Ząb', isCorrect: true, icon: '🦷' },
        { text: 'Zonb', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 11,
      difficulty: 3,
      focus: 'wziąć — częsty wyjątek (nie wziąść!)',
      questions: {
        pl: 'Jedyna poprawna forma bezokolicznika tego czasownika to:',
        en: 'The only correct infinitive form of this verb is:',
        de: 'Die einzig richtige Infinitivform dieses Verbs ist:',
      },
      options: [
        { text: 'Wziąć', isCorrect: true, icon: '🤲' },
        { text: 'Wziąść', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 12,
      difficulty: 2,
      focus: 'żółty — potrójna pułapka (ż + ó + ł)',
      questions: {
        pl: 'Kolor słonecznika i cytryny. Która pisownia jest poprawna?',
        en: 'The color of sunflowers and lemons. Which spelling is correct?',
        de: 'Die Farbe von Sonnenblumen und Zitronen. Welche Schreibweise ist korrekt?',
      },
      options: [
        { text: 'Żółty', isCorrect: true, icon: '🟡' },
        { text: 'Żułty', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 13,
      difficulty: 1,
      focus: 'już — ż po j (wyjątek od reguły rz po spółgłosce)',
      questions: {
        pl: 'Po j piszemy wyjątkowo ż (nie rz). Które słowo jest poprawne?',
        en: "After 'j' we exceptionally write 'ż' (not 'rz'). Which is correct?",
        de: "Nach 'j' schreibt man ausnahmsweise 'ż' (nicht 'rz'). Welches ist korrekt?",
      },
      options: [
        { text: 'Już', isCorrect: true, icon: '⏰' },
        { text: 'Jurz', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 14,
      difficulty: 2,
      focus: 'h w słowach rodzimych',
      questions: {
        pl: 'Które rodzime słowo polskie piszemy przez h (nie ch)?',
        en: "Which native Polish word is spelled with 'h' (not 'ch')?",
        de: "Welches einheimische polnische Wort schreibt man mit 'h' (nicht 'ch')?",
      },
      options: [
        { text: 'Hałas', isCorrect: true, icon: '🔊' },
        { text: 'Chałas', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 15,
      difficulty: 2,
      focus: 'może (modalny) vs morze (akwen) — para homofoniczna',
      questions: {
        pl: 'Które słowo oznacza jest w stanie / potrafi (czasownik modalny)?',
        en: "Which word means 'is able to / can' (modal verb)?",
        de: "Welches Wort bedeutet 'ist in der Lage / kann' (Modalverb)?",
      },
      options: [
        { text: 'Może', isCorrect: true, icon: '🤔' },
        { text: 'Morze', isCorrect: false, icon: '🌊' },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: SYLLABLES
  // Adult vocabulary words — professional, administrative, everyday.
  // ─────────────────────────────────────────────────────────────────────────────
  syllables: [
    {
      id: 1,
      difficulty: 2,
      word: 'Bezpieczeństwo',
      segments: ['Bez', 'pie', 'czeń', 'stwo'],
      icon: '🛡️',
    },
    {
      id: 2,
      difficulty: 3,
      tags: ['business'],
      word: 'Odpowiedzialność',
      segments: ['Od', 'po', 'wie', 'dzial', 'ność'],
      icon: '⚖️',
    },
    {
      id: 3,
      difficulty: 3,
      tags: ['business'],
      word: 'Przedsiębiorstwo',
      segments: ['Przed', 'się', 'bior', 'stwo'],
      icon: '🏢',
    },
    {
      id: 4,
      difficulty: 2,
      word: 'Wynagrodzenie',
      segments: ['Wy', 'na', 'gro', 'dze', 'nie'],
      icon: '💰',
    },
    {
      id: 5,
      difficulty: 2,
      word: 'Zaangażowanie',
      segments: ['Za', 'an', 'ga', 'żo', 'wa', 'nie'],
      icon: '💪',
    },
    {
      id: 6,
      difficulty: 2,
      word: 'Współpracownik',
      segments: ['Współ', 'pra', 'cow', 'nik'],
      icon: '🤝',
    },
    {
      id: 7,
      difficulty: 2,
      word: 'Przedstawiciel',
      segments: ['Przed', 'sta', 'wi', 'ciel'],
      icon: '👔',
    },
    {
      id: 8,
      difficulty: 1,
      word: 'Rozwiązanie',
      segments: ['Roz', 'wią', 'za', 'nie'],
      icon: '💡',
    },
    {
      id: 9,
      difficulty: 3,
      word: 'Rzeczpospolita',
      segments: ['Rzecz', 'pos', 'po', 'li', 'ta'],
      icon: '🇵🇱',
    },
    {
      id: 10,
      difficulty: 2,
      word: 'Wnioskodawca',
      segments: ['Wnio', 'sko', 'daw', 'ca'],
      icon: '📋',
    },
    {
      id: 11,
      difficulty: 1,
      tags: ['business'],
      word: 'Bezrobocie',
      segments: ['Bez', 'ro', 'bo', 'cie'],
      icon: '📉',
    },
    {
      id: 12,
      difficulty: 1,
      word: 'Tymczasowy',
      segments: ['Tym', 'cza', 'so', 'wy'],
      icon: '⏳',
    },
    {
      id: 13,
      difficulty: 2,
      word: 'Nieprawidłowość',
      segments: ['Nie', 'pra', 'wi', 'dło', 'wość'],
      icon: '🚫',
    },
    {
      id: 14,
      difficulty: 2,
      word: 'Przystosowanie',
      segments: ['Przy', 'sto', 'so', 'wa', 'nie'],
      icon: '🔄',
    },
    {
      id: 15,
      difficulty: 2,
      word: 'Odpowiedzialny',
      segments: ['Od', 'po', 'wie', 'dzial', 'ny'],
      icon: '✅',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: WORTBILD (word image / scrabble)
  // Words with difficult spelling — non-alternating or ambiguous spelling.
  // ─────────────────────────────────────────────────────────────────────────────
  scrabble: [
    { id: 1, difficulty: 1, word: 'ŻÓŁW', scrambled: ['Ż', 'Ó', 'Ł', 'W'], image: '🐢' },
    {
      id: 2,
      difficulty: 3,
      word: 'CHRZĄSZCZ',
      scrambled: ['C', 'H', 'R', 'Z', 'Ą', 'S', 'Z', 'C', 'Z'],
      image: '🪲',
    },
    {
      id: 3,
      difficulty: 2,
      word: 'PRZYSZŁOŚĆ',
      scrambled: ['P', 'R', 'Z', 'Y', 'S', 'Z', 'Ł', 'O', 'Ś', 'Ć'],
      image: '🚀',
    },
    {
      id: 4,
      difficulty: 2,
      word: 'WŁAŚCICIEL',
      scrambled: ['W', 'Ł', 'A', 'Ś', 'C', 'I', 'C', 'I', 'E', 'L'],
      image: '👔',
    },
    {
      id: 5,
      difficulty: 2,
      word: 'HIERARCHIA',
      scrambled: ['H', 'I', 'E', 'R', 'A', 'R', 'C', 'H', 'I', 'A'],
      image: '📊',
    },
    {
      id: 6,
      difficulty: 3,
      tags: ['business'],
      word: 'WYNAGRODZENIE',
      scrambled: [
        'W',
        'Y',
        'N',
        'A',
        'G',
        'R',
        'O',
        'D',
        'Z',
        'E',
        'N',
        'I',
        'E',
      ],
      image: '💰',
    },
    {
      id: 7,
      difficulty: 3,
      word: 'ZAANGAŻOWANIE',
      scrambled: [
        'Z',
        'A',
        'A',
        'N',
        'G',
        'A',
        'Ż',
        'O',
        'W',
        'A',
        'N',
        'I',
        'E',
      ],
      image: '💪',
    },
    {
      id: 8,
      difficulty: 3,
      word: 'BEZPIECZEŃSTWO',
      scrambled: [
        'B',
        'E',
        'Z',
        'P',
        'I',
        'E',
        'C',
        'Z',
        'E',
        'Ń',
        'S',
        'T',
        'W',
        'O',
      ],
      image: '🛡️',
    },
    {
      id: 9,
      difficulty: 1,
      word: 'ŹRÓDŁO',
      scrambled: ['Ź', 'R', 'Ó', 'D', 'Ł', 'O'],
      image: '🌿',
    },
    {
      id: 10,
      difficulty: 1,
      word: 'PRZESTRZEŃ',
      scrambled: ['P', 'R', 'Z', 'E', 'S', 'T', 'R', 'Z', 'E', 'Ń'],
      image: '🌌',
    },
    {
      id: 11,
      difficulty: 2,
      word: 'WNIOSKODAWCA',
      scrambled: ['W', 'N', 'I', 'O', 'S', 'K', 'O', 'D', 'A', 'W', 'C', 'A'],
      image: '📋',
    },
    {
      id: 12,
      difficulty: 2,
      word: 'WSPÓŁPRACA',
      scrambled: ['W', 'S', 'P', 'Ó', 'Ł', 'P', 'R', 'A', 'C', 'A'],
      image: '🤝',
    },
    {
      id: 13,
      difficulty: 1,
      word: 'TYMCZASOWY',
      scrambled: ['T', 'Y', 'M', 'C', 'Z', 'A', 'S', 'O', 'W', 'Y'],
      image: '⏳',
    },
    {
      id: 14,
      difficulty: 2,
      tags: ['medicine'],
      word: 'PSYCHOLOG',
      scrambled: ['P', 'S', 'Y', 'C', 'H', 'O', 'L', 'O', 'G'],
      image: '🧠',
    },
    {
      id: 15,
      difficulty: 3,
      word: 'ODPOWIEDZIALNY',
      scrambled: [
        'O',
        'D',
        'P',
        'O',
        'W',
        'I',
        'E',
        'D',
        'Z',
        'I',
        'A',
        'L',
        'N',
        'Y',
      ],
      image: '✅',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: CONTEXT
  // 15 sentences with adult vocabulary — professional, administrative, everyday.
  // Tested traps: homophones, the nie- rule, -bym, nasal vowels, ó/u, rz/ż.
  // ─────────────────────────────────────────────────────────────────────────────
  context: [
    {
      id: 1,
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Dyrektor',
      sentence_part2: 'zatwierdzić wniosek do końca tygodnia.',
      options: [
        { text: 'może', isCorrect: true },
        { text: 'morze', isCorrect: false },
      ],
      hints: {
        pl: "Czasownik modalny (móc coś zrobić), pisany przez 'ż'",
        en: 'can / is able to — modal verb (not the sea!)',
      },
    },
    {
      id: 2,
      difficulty: 2,
      tags: ['everyday'],
      sentence_part1: 'Latem wybieram się na urlop nad',
      sentence_part2: 'Śródziemne.',
      options: [
        { text: 'morze', isCorrect: true },
        { text: 'może', isCorrect: false },
      ],
      hints: {
        pl: "Akwen wodny (np. Bałtyckie), pisany przez 'rz'",
        en: 'the sea — a body of salt water',
      },
    },
    {
      id: 3,
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Pracownik',
      sentence_part2: 'opuszczać stanowiska bez zgody przełożonego.',
      options: [
        { text: 'nie powinien', isCorrect: true },
        { text: 'niepowinien', isCorrect: false },
      ],
      hints: {
        pl: "Partykułę 'nie' z czasownikami piszemy zawsze oddzielnie",
        en: "'nie' before a verb — always separate words",
      },
    },
    {
      id: 4,
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Podpisana ugoda była całkowicie',
      sentence_part2: '.',
      options: [
        { text: 'nieodwołalna', isCorrect: true },
        { text: 'nie odwołalna', isCorrect: false },
      ],
      hints: {
        pl: "Partykułę 'nie' z przymiotnikami piszemy łącznie",
        en: "'nie' + adjective — written as one word",
      },
    },
    {
      id: 5,
      difficulty: 3,
      tags: ['everyday', 'business'],
      sentence_part1: 'Proszę',
      sentence_part2: 'oryginały dokumentów na podpisanie umowy.',
      options: [
        { text: 'wziąć', isCorrect: true },
        { text: 'wziąść', isCorrect: false },
      ],
      hints: {
        pl: "Poprawny bezokolicznik to 'wziąć', forma z 'ść' jest błędna",
        en: "to take — 'wziąść' is an extremely common mistake",
      },
    },
    {
      id: 6,
      difficulty: 2,
      sentence_part1: 'Gdybym wiedziała o tym wcześniej,',
      sentence_part2: 'przesłać materiały na czas.',
      options: [
        { text: 'zdążyłabym', isCorrect: true },
        { text: 'zdążyła bym', isCorrect: false },
      ],
      hints: {
        pl: "Cząstkę '-bym' dopisujemy łącznie do formy czasownika",
        en: 'Conditional -bym attaches directly to the verb form',
      },
    },
    {
      id: 7,
      difficulty: 1,
      sentence_part1: 'Proszę omówić wszystkie techniczne',
      sentence_part2: 'projektu przed wdrożeniem.',
      options: [
        { text: 'szczegóły', isCorrect: true },
        { text: 'szczeguly', isCorrect: false },
      ],
      hints: {
        pl: "Pisownia przez 'ó', wymienia się na 'o' w słowie 'szczegół'",
        en: 'details — szczegół (ó) → szczegóły, never szczeguly',
      },
    },
    {
      id: 8,
      difficulty: 2,
      sentence_part1: 'Audyt wykrył poważną',
      sentence_part2: 'w dokumentacji finansowej spółki.',
      options: [
        { text: 'nieprawidłowość', isCorrect: true },
        { text: 'nie prawidłowość', isCorrect: false },
      ],
      hints: {
        pl: "Partykułę 'nie' z rzeczownikami piszemy łącznie jako jedno słowo",
        en: "'nie' + noun — these compound together as one word",
      },
    },
    {
      id: 9,
      difficulty: 2,
      sentence_part1: 'Nowy menedżer wykazał się ogromnym',
      sentence_part2: 'w każdy realizowany projekt.',
      options: [
        { text: 'zaangażowaniem', isCorrect: true },
        { text: 'zaangarzowaniem', isCorrect: false },
      ],
      hints: {
        pl: "Pisownia przez 'ż', słowo pochodzi od 'angaż'",
        en: 'commitment — ż (not rz) here; zaangażować ← angaż',
      },
    },
    {
      id: 10,
      difficulty: 1,
      sentence_part1: 'Umowa wchodzi w',
      sentence_part2: 'z dniem pierwszego marca.',
      options: [
        { text: 'życie', isCorrect: true },
        { text: 'żyście', isCorrect: false },
      ],
      hints: {
        pl: "Poprawna pisownia to 'życie' (bez 'ś' w środku)",
        en: "into force / life — ż at the start, no 'ś'",
      },
    },
    {
      id: 11,
      difficulty: 1,
      tags: ['medicine'],
      sentence_part1: 'Wyniki badań laboratoryjnych będą dostępne',
      sentence_part2: '.',
      options: [
        { text: 'wkrótce', isCorrect: true },
        { text: 'wkrutce', isCorrect: false },
      ],
      hints: {
        pl: "Słowo wywodzi się od 'krótki', zawsze piszemy przez 'ó'",
        en: "soon — ó is non-alternating here (not 'wkrutce')",
      },
    },
    {
      id: 12,
      difficulty: 1,
      sentence_part1: 'W tej kwestii mam',
      sentence_part2: 'i oczekuję zmiany decyzji.',
      options: [
        { text: 'rację', isCorrect: true },
        { text: 'racie', isCorrect: false },
      ],
      hints: {
        pl: "To biernik słowa 'racja', zawsze kończy się na '-ę'",
        en: "I am right — rację is accusative singular of 'racja', ends in -ę",
      },
    },
    {
      id: 13,
      difficulty: 2,
      sentence_part1: 'Projekt wymaga intensywnej',
      sentence_part2: 'całego działu przez kolejny kwartał.',
      options: [
        { text: 'współpracy', isCorrect: true },
        { text: 'wspułpracy', isCorrect: false },
      ],
      hints: {
        pl: "Przedrostek 'współ-' zawsze piszemy przez 'ó'",
        en: 'cooperation — współ- prefix has ó (from wspólny, never wspułny)',
      },
    },
    {
      id: 14,
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Prosimy o staranne',
      sentence_part2: 'formularza zgłoszeniowego online.',
      options: [
        { text: 'wypełnienie', isCorrect: true },
        { text: 'wypełnianie', isCorrect: false },
      ],
      hints: {
        pl: 'Chodzi o jednorazową, dokonaną czynność (wypełnienie), a nie trwający proces',
        en: 'completion (one-off action from perfective verb) vs ongoing process',
      },
    },
    {
      id: 15,
      difficulty: 1,
      sentence_part1: 'Firma',
      sentence_part2: 'wczoraj gruntowną analizę rynku.',
      options: [
        { text: 'przeprowadziła', isCorrect: true },
        { text: 'pżeprowadziła', isCorrect: false },
      ],
      hints: {
        pl: "Po spółgłosce 'p' zawsze piszemy 'rz' (przedrostek prze-)",
        en: "rz after 'p' — przeprowadzić has prze- prefix, always rz not ż",
      },
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: CLOCK
  // 15 tasks on reading an analog clock.
  // hourRotation and minuteRotation = degrees clockwise from 12:00.
  // ─────────────────────────────────────────────────────────────────────────────
  clock: [
    {
      id: 1,
      difficulty: 1,
      timeAnalog: 'Kwadrans po trzeciej',
      isNight: false,
      hourRotation: 98,
      minuteRotation: 90,
      options: [
        { text: '03:15', isCorrect: true },
        { text: '15:15', isCorrect: true },
        { text: '03:45', isCorrect: false },
        { text: '15:45', isCorrect: false },
      ],
    },
    {
      id: 2,
      difficulty: 1,
      timeAnalog: 'Wpół do siódmej wieczorem',
      isNight: true,
      hourRotation: 195,
      minuteRotation: 180,
      options: [
        { text: '18:30', isCorrect: true },
        { text: '06:30', isCorrect: false },
        { text: '07:30', isCorrect: false },
        { text: '19:30', isCorrect: false },
      ],
    },
    {
      id: 3,
      difficulty: 1,
      timeAnalog: 'Za dziesięć dziesiąta rano',
      isNight: false,
      hourRotation: 295,
      minuteRotation: 300,
      options: [
        { text: '09:50', isCorrect: true },
        { text: '21:50', isCorrect: false },
        { text: '10:10', isCorrect: false },
        { text: '10:50', isCorrect: false },
      ],
    },
    {
      id: 4,
      difficulty: 1,
      timeAnalog: 'Południe',
      isNight: false,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        { text: '12:00', isCorrect: true },
        { text: '00:00', isCorrect: false },
        { text: '12:30', isCorrect: false },
        { text: '06:00', isCorrect: false },
      ],
    },
    {
      id: 5,
      difficulty: 1,
      timeAnalog: 'Północ',
      isNight: true,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        { text: '00:00', isCorrect: true },
        { text: '12:00', isCorrect: false },
        { text: '23:59', isCorrect: false },
        { text: '01:00', isCorrect: false },
      ],
    },
    {
      id: 6,
      difficulty: 2,
      timeAnalog: 'Wpół do pierwszej po południu',
      isNight: false,
      hourRotation: 15,
      minuteRotation: 180,
      options: [
        { text: '12:30', isCorrect: true },
        { text: '00:30', isCorrect: false },
        { text: '01:30', isCorrect: false },
        { text: '11:30', isCorrect: false },
      ],
    },
    {
      id: 7,
      difficulty: 2,
      timeAnalog: 'Za kwadrans dziewiąta wieczorem',
      isNight: true,
      hourRotation: 262,
      minuteRotation: 270,
      options: [
        { text: '20:45', isCorrect: true },
        { text: '08:45', isCorrect: false },
        { text: '09:45', isCorrect: false },
        { text: '21:15', isCorrect: false },
      ],
    },
    {
      id: 8,
      difficulty: 1,
      timeAnalog: 'Dwadzieścia po czwartej po południu',
      isNight: false,
      hourRotation: 130,
      minuteRotation: 120,
      options: [
        { text: '16:20', isCorrect: true },
        { text: '04:20', isCorrect: false },
        { text: '04:40', isCorrect: false },
        { text: '05:20', isCorrect: false },
      ],
    },
    {
      id: 9,
      difficulty: 2,
      timeAnalog: 'Pięć po wpół do dwunastej w nocy',
      isNight: true,
      hourRotation: 347,
      minuteRotation: 210,
      options: [
        { text: '23:35', isCorrect: true },
        { text: '11:35', isCorrect: false },
        { text: '11:25', isCorrect: false },
        { text: '00:35', isCorrect: false },
      ],
    },
    {
      id: 10,
      difficulty: 1,
      timeAnalog: 'Szósta wieczorem',
      isNight: true,
      hourRotation: 180,
      minuteRotation: 0,
      options: [
        { text: '18:00', isCorrect: true },
        { text: '06:00', isCorrect: false },
        { text: '19:00', isCorrect: false },
        { text: '06:18', isCorrect: false },
      ],
    },
    {
      id: 11,
      difficulty: 2,
      timeAnalog: 'Za pięć wpół do dziesiątej wieczorem',
      isNight: true,
      hourRotation: 283,
      minuteRotation: 150,
      options: [
        { text: '21:25', isCorrect: true },
        { text: '09:25', isCorrect: false },
        { text: '09:35', isCorrect: false },
        { text: '21:35', isCorrect: false },
      ],
    },
    {
      id: 12,
      difficulty: 1,
      timeAnalog: 'Kwadrans po jedenastej rano',
      isNight: false,
      hourRotation: 338,
      minuteRotation: 90,
      options: [
        { text: '11:15', isCorrect: true },
        { text: '23:15', isCorrect: false },
        { text: '10:45', isCorrect: false },
        { text: '11:45', isCorrect: false },
      ],
    },
    {
      id: 13,
      difficulty: 1,
      timeAnalog: 'Za dziesięć piąta rano',
      isNight: false,
      hourRotation: 145,
      minuteRotation: 300,
      options: [
        { text: '04:50', isCorrect: true },
        { text: '16:50', isCorrect: false },
        { text: '05:10', isCorrect: false },
        { text: '04:40', isCorrect: false },
      ],
    },
    {
      id: 14,
      difficulty: 1,
      timeAnalog: 'Wpół do dziewiątej rano',
      isNight: false,
      hourRotation: 255,
      minuteRotation: 180,
      options: [
        { text: '08:30', isCorrect: true },
        { text: '20:30', isCorrect: false },
        { text: '09:30', isCorrect: false },
        { text: '07:30', isCorrect: false },
      ],
    },
    {
      id: 15,
      difficulty: 1,
      timeAnalog: 'Dwadzieścia pięć po pierwszej w nocy',
      isNight: true,
      hourRotation: 43,
      minuteRotation: 150,
      options: [
        { text: '01:25', isCorrect: true },
        { text: '13:25', isCorrect: false },
        { text: '01:35', isCorrect: false },
        { text: '12:25', isCorrect: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: SEQUENCES
  // Chronological, procedural, and auditory ordering — adult vocabulary.
  // ─────────────────────────────────────────────────────────────────────────────
  sequences: [
    // Working memory
    {
      id: 'mem_span_1',
      difficulty: 1,
      instruction: 'Ułóż elementy od końca!',
      displayItems: ['📋', '💰', '✅'],
      correct: ['✅', '💰', '📋'],
      scrambled: ['📋', '💰', '✅'],
      displayTime: 3000,
    },

    // Chronology and semantics
    {
      id: 1,
      difficulty: 1,
      instruction: 'Ułóż dni robocze tygodnia po kolei',
      scrambled: ['Środa', 'Poniedziałek', 'Czwartek', 'Wtorek'],
      correct: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek'],
    },

    {
      id: 2,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Etapy kariery zawodowej — od najniższego',
      scrambled: ['Kierownik', 'Stażysta', 'Dyrektor', 'Specjalista'],
      correct: ['Stażysta', 'Specjalista', 'Kierownik', 'Dyrektor'],
    },

    {
      id: 3,
      difficulty: 1,
      instruction: 'Ułóż miesiące I kwartału po kolei',
      scrambled: ['Marzec', 'Styczeń', 'Luty'],
      correct: ['Styczeń', 'Luty', 'Marzec'],
    },

    {
      id: 4,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Etapy rekrutacji pracownika',
      scrambled: [
        'Podpisanie umowy',
        'Złożenie CV',
        'Rozmowa kwalifikacyjna',
        'Oferta pracy',
      ],
      correct: [
        'Złożenie CV',
        'Rozmowa kwalifikacyjna',
        'Oferta pracy',
        'Podpisanie umowy',
      ],
    },

    {
      id: 5,
      difficulty: 1,
      instruction: 'Ułóż od najmniejszej do największej kwoty',
      scrambled: ['1 000 000 zł', '1 000 zł', '1 000 000 000 zł', '100 zł'],
      correct: ['100 zł', '1 000 zł', '1 000 000 zł', '1 000 000 000 zł'],
    },

    {
      id: 6,
      difficulty: 2,
      tags: ['business', 'everyday'],
      instruction: 'Proces uzyskania kredytu hipotecznego',
      scrambled: [
        'Spłata rat',
        'Decyzja banku',
        'Złożenie wniosku',
        'Podpisanie umowy',
      ],
      correct: [
        'Złożenie wniosku',
        'Decyzja banku',
        'Podpisanie umowy',
        'Spłata rat',
      ],
    },

    {
      id: 7,
      difficulty: 1,
      instruction: 'Jednostki czasu od najkrótszej do najdłuższej',
      scrambled: ['Tydzień', 'Sekunda', 'Rok', 'Godzina'],
      correct: ['Sekunda', 'Godzina', 'Tydzień', 'Rok'],
    },

    {
      id: 8,
      difficulty: 1,
      instruction: 'Ułóż zdanie w poprawnej kolejności',
      scrambled: [
        'analizę.',
        'przeprowadziła',
        'Firma',
        'gruntowną',
        'wczoraj',
      ],
      correct: ['Firma', 'wczoraj', 'przeprowadziła', 'gruntowną', 'analizę.'],
    },

    {
      id: 9,
      difficulty: 2,
      instruction: 'Etapy projektu (metodyka PM)',
      scrambled: ['Wdrożenie', 'Planowanie', 'Zamknięcie', 'Inicjacja'],
      correct: ['Inicjacja', 'Planowanie', 'Wdrożenie', 'Zamknięcie'],
    },

    {
      id: 10,
      difficulty: 1,
      instruction: 'Ułóż alfabetycznie wyrazy zawodowe',
      scrambled: ['Wynagrodzenie', 'Urlop', 'Umowa', 'Zarząd'],
      correct: ['Umowa', 'Urlop', 'Wynagrodzenie', 'Zarząd'],
    },

    // Auditory sequences (audioPrompt)
    {
      id: 11,
      difficulty: 3,
      instruction: 'Posłuchaj i ułóż cyfry w podanej kolejności',
      audioPrompt: 'Siedem. Dwa. Pięć. Jeden.',
      scrambled: ['1', '2', '7', '5'],
      correct: ['7', '2', '5', '1'],
    },

    {
      id: 12,
      difficulty: 3,
      instruction: 'Posłuchaj i ułóż usłyszane słowa',
      audioPrompt: 'Faktura, przelew, budżet, raport.',
      scrambled: ['Budżet', 'Faktura', 'Raport', 'Przelew'],
      correct: ['Faktura', 'Przelew', 'Budżet', 'Raport'],
    },

    {
      id: 13,
      difficulty: 3,
      instruction: 'Posłuchaj instrukcji i ułóż kroki',
      audioPrompt:
        'Najpierw wypełnij formularz, potem go wydrukuj, a na końcu złóż w sekretariacie.',
      scrambled: ['Złóż w sekretariacie', 'Wypełnij formularz', 'Wydrukuj'],
      correct: ['Wypełnij formularz', 'Wydrukuj', 'Złóż w sekretariacie'],
    },

    {
      id: 14,
      difficulty: 3,
      instruction: 'Posłuchaj i ułóż przeliterowane litery',
      audioPrompt: 'W. N. I. O. S. E. K.',
      scrambled: ['I', 'N', 'O', 'W', 'K', 'E', 'S'],
      correct: ['W', 'N', 'I', 'O', 'S', 'E', 'K'],
    },

    {
      id: 15,
      difficulty: 2,
      instruction: 'Epoki historyczne Polski — od najstarszej',
      scrambled: [
        'Dwudziestolecie Międzywojenne',
        'Średniowiecze',
        'PRL',
        'Rzeczpospolita Szlachecka',
      ],
      correct: [
        'Średniowiecze',
        'Rzeczpospolita Szlachecka',
        'Dwudziestolecie Międzywojenne',
        'PRL',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: TRACKING (spatial orientation)
  // Lateralization, distinguishing b/d/p/q, up/down, visual categories.
  // ─────────────────────────────────────────────────────────────────────────────
  tracking: [
    {
      id: 1,
      difficulty: 1,
      instruction: 'Gdzie jest brzuszek tej litery?',
      items: [
        { symbol: 'b', target: 'right' },
        { symbol: 'd', target: 'left' },
        { symbol: 'd', target: 'left' },
        { symbol: 'b', target: 'right' },
        { symbol: 'd', target: 'left' },
      ],
      options: [
        { label: 'Lewa ⬅️', value: 'left' },
        { label: 'Prawa ➡️', value: 'right' },
      ],
    },
    {
      id: 2,
      difficulty: 1,
      instruction: 'W którą stronę pokazuje strzałka?',
      items: [
        { symbol: '→', target: 'right' },
        { symbol: '←', target: 'left' },
        { symbol: '→', target: 'right' },
        { symbol: '→', target: 'right' },
        { symbol: '←', target: 'left' },
      ],
      options: [
        { label: 'W lewo ⬅️', value: 'left' },
        { label: 'W prawo ➡️', value: 'right' },
      ],
    },
    {
      id: 3,
      difficulty: 1,
      instruction: 'Gdzie jest brzuszek tej litery?',
      items: [
        { symbol: 'p', target: 'right' },
        { symbol: 'q', target: 'left' },
        { symbol: 'p', target: 'right' },
        { symbol: 'q', target: 'left' },
        { symbol: 'q', target: 'left' },
      ],
      options: [
        { label: 'Lewa ⬅️', value: 'left' },
        { label: 'Prawa ➡️', value: 'right' },
      ],
    },
    {
      id: 4,
      difficulty: 1,
      instruction: 'W którą stronę skierowany jest palec?',
      items: [
        { symbol: '👈', target: 'left' },
        { symbol: '👉', target: 'right' },
        { symbol: '👈', target: 'left' },
        { symbol: '👈', target: 'left' },
        { symbol: '👉', target: 'right' },
      ],
      options: [
        { label: 'Lewa ⬅️', value: 'left' },
        { label: 'Prawa ➡️', value: 'right' },
      ],
    },
    {
      id: 5,
      difficulty: 1,
      instruction: 'Przeczytaj słowo i wskaż odpowiedni kierunek',
      items: [
        { symbol: 'PRAWA', target: 'right' },
        { symbol: 'LEWA', target: 'left' },
        { symbol: 'LEWA', target: 'left' },
        { symbol: 'PRAWA', target: 'right' },
        { symbol: 'LEWA', target: 'left' },
      ],
      options: [
        { label: 'Lewa ⬅️', value: 'left' },
        { label: 'Prawa ➡️', value: 'right' },
      ],
    },
    {
      id: 6,
      difficulty: 1,
      instruction: 'W którą stronę wskazuje trójkąt?',
      items: [
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
        { symbol: '▷', target: 'right' },
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
      ],
      options: [
        { label: 'W lewo ⬅️', value: 'left' },
        { label: 'W prawo ➡️', value: 'right' },
      ],
    },
    {
      id: 7,
      difficulty: 1,
      instruction: 'Kciuk w górę czy w dół?',
      items: [
        { symbol: '👍', target: 'up' },
        { symbol: '👎', target: 'down' },
        { symbol: '👍', target: 'up' },
        { symbol: '👍', target: 'up' },
        { symbol: '👎', target: 'down' },
      ],
      options: [
        { label: 'Góra ⬆️', value: 'up' },
        { label: 'Dół ⬇️', value: 'down' },
      ],
    },
    {
      id: 8,
      difficulty: 1,
      instruction: 'Gdzie są otwarte te nawiasy kwadratowe?',
      items: [
        { symbol: '[', target: 'right' },
        { symbol: ']', target: 'left' },
        { symbol: '[', target: 'right' },
        { symbol: ']', target: 'left' },
        { symbol: ']', target: 'left' },
      ],
      options: [
        { label: 'W lewo ⬅️', value: 'left' },
        { label: 'W prawo ➡️', value: 'right' },
      ],
    },
    {
      id: 9,
      difficulty: 1,
      instruction: 'W którą stronę wskazuje strzałka pionowa?',
      items: [
        { symbol: '↑', target: 'up' },
        { symbol: '↓', target: 'down' },
        { symbol: '↑', target: 'up' },
        { symbol: '↑', target: 'up' },
        { symbol: '↓', target: 'down' },
      ],
      options: [
        { label: 'Góra ⬆️', value: 'up' },
        { label: 'Dół ⬇️', value: 'down' },
      ],
    },
    {
      id: 10,
      difficulty: 1,
      instruction: 'W którą stronę pochylona jest kreska?',
      items: [
        { symbol: '/', target: 'right' },
        { symbol: '\\', target: 'left' },
        { symbol: '/', target: 'right' },
        { symbol: '\\', target: 'left' },
        { symbol: '/', target: 'right' },
      ],
      options: [
        { label: 'W lewo (\\) ⬅️', value: 'left' },
        { label: 'W prawo (/) ➡️', value: 'right' },
      ],
    },
    {
      id: 11,
      difficulty: 1,
      instruction: 'Duże czy małe litery?',
      items: [
        { symbol: 'A', target: 'up' },
        { symbol: 'a', target: 'down' },
        { symbol: 'B', target: 'up' },
        { symbol: 'b', target: 'down' },
        { symbol: 'A', target: 'up' },
      ],
      options: [
        { label: 'Duża 🔠', value: 'up' },
        { label: 'Mała 🔡', value: 'down' },
      ],
    },
    {
      id: 12,
      difficulty: 1,
      instruction: 'Liczba parzysta czy nieparzysta?',
      items: [
        { symbol: '4', target: 'left' },
        { symbol: '7', target: 'right' },
        { symbol: '2', target: 'left' },
        { symbol: '9', target: 'right' },
        { symbol: '6', target: 'left' },
      ],
      options: [
        { label: 'Parzysta ⬅️', value: 'left' },
        { label: 'Nieparzysta ➡️', value: 'right' },
      ],
    },
    {
      id: 13,
      difficulty: 1,
      instruction: 'Samogłoska czy spółgłoska?',
      items: [
        { symbol: 'E', target: 'up' },
        { symbol: 'K', target: 'down' },
        { symbol: 'A', target: 'up' },
        { symbol: 'R', target: 'down' },
        { symbol: 'I', target: 'up' },
      ],
      options: [
        { label: 'Samogłoska ⬆️', value: 'up' },
        { label: 'Spółgłoska ⬇️', value: 'down' },
      ],
    },
    {
      id: 14,
      difficulty: 1,
      instruction: 'Litera polska z ogonkiem / kreską czy zwykła?',
      items: [
        { symbol: 'ą', target: 'right' },
        { symbol: 'a', target: 'left' },
        { symbol: 'ę', target: 'right' },
        { symbol: 'e', target: 'left' },
        { symbol: 'ó', target: 'right' },
      ],
      options: [
        { label: 'Zwykła ⬅️', value: 'left' },
        { label: 'Z ogonkiem/kreską ➡️', value: 'right' },
      ],
    },
    {
      id: 15,
      difficulty: 1,
      instruction: 'Cyfra arabska czy rzymska?',
      items: [
        { symbol: 'V', target: 'right' },
        { symbol: '5', target: 'left' },
        { symbol: 'X', target: 'right' },
        { symbol: '10', target: 'left' },
        { symbol: 'I', target: 'right' },
      ],
      options: [
        { label: 'Arabska ⬅️', value: 'left' },
        { label: 'Rzymska ➡️', value: 'right' },
      ],
    },
  ],
};
