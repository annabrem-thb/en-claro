export const wordDatabasePL = {
  phonemes: [
    {
      id: 1,
      word: 'Chrząszcz',
      difficulty: 3,
      phonetic: '/ xʂɔ̃ʂt͡ʂ /',
      hints: {
        pl: 'Drobny owad z twardymi pokrywami skrzydeł',
        en: 'Beetle — famous Polish tongue twister',
        de: 'Käfer — bekannter polnischer Zungenbrecher',
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
  ],

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
        { text: 'Krój', isCorrect: false, icon: '✂️' },
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
        pl: 'Które ż wymienia się na g w innej formie wyrazu?',
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
  ],

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
  ],

  scrabble: [
    { id: 1, difficulty: 1, word: 'ŻÓŁW', scrambled: ['Ż', 'Ó', 'Ł', 'W'], distractors: ['U', 'R'], image: '🐢' },
    {
      id: 2,
      difficulty: 3,
      word: 'CHRZĄSZCZ',
      scrambled: ['C', 'H', 'R', 'Z', 'Ą', 'S', 'Z', 'C', 'Z'],
      distractors: ['Ś', 'Ć'],
      image: '🪲',
    },
    {
      id: 3,
      difficulty: 2,
      word: 'PRZYSZŁOŚĆ',
      scrambled: ['P', 'R', 'Z', 'Y', 'S', 'Z', 'Ł', 'O', 'Ś', 'Ć'],
      distractors: ['S', 'C'],
      image: '🚀',
    },
    {
      id: 4,
      difficulty: 2,
      word: 'DYREKTOR',
      scrambled: ['D', 'Y', 'R', 'E', 'K', 'T', 'O', 'R'],
      distractors: ['P', 'W'],
      image: '👔',
    },
    {
      id: 5,
      difficulty: 2,
      word: 'HIERARCHIA',
      scrambled: ['H', 'I', 'E', 'R', 'A', 'R', 'C', 'H', 'I', 'A'],
      distractors: ['C', 'J'],
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
      distractors: ['R', 'Z'],
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
      distractors: ['S', 'Z'],
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
      distractors: ['N', 'Ś'],
      image: '🛡️',
    },
    {
      id: 9,
      difficulty: 1,
      word: 'ŹRÓDŁO',
      scrambled: ['Ź', 'R', 'Ó', 'D', 'Ł', 'O'],
      distractors: ['Z', 'U'],
      image: '🌿',
    },
    {
      id: 10,
      difficulty: 1,
      word: 'PRZESTRZEŃ',
      scrambled: ['P', 'R', 'Z', 'E', 'S', 'T', 'R', 'Z', 'E', 'Ń'],
      distractors: ['S', 'Z'],
      image: '🌌',
    },
  ],

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
        pl: "Morze to wielki zbiornik wodny",
        en: "Sea - large body of water",
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
  ],

  clock: [
    {
      id: 1,
      difficulty: 1,
      timeAnalog: 'Kwadrans po trzeciej w nocy',
      isNight: true,
      hourRotation: 98,
      minuteRotation: 90,
      options: [
        { text: '03:15', isCorrect: true },
        { text: '15:15', isCorrect: false },
        { text: '03:03', isCorrect: false },
        { text: '04:15', isCorrect: false },
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
        { text: '18:06', isCorrect: false },
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
        { text: '10:50', isCorrect: false },
        { text: '09:10', isCorrect: false },
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
        { text: '00:12', isCorrect: false },
        { text: '23:59', isCorrect: false },
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
        { text: '13:30', isCorrect: false },
        { text: '06:00', isCorrect: false },
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
        { text: '21:45', isCorrect: false },
        { text: '09:40', isCorrect: false },
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
        { text: '16:04', isCorrect: false },
        { text: '20:16', isCorrect: false },
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
        { text: '00:35', isCorrect: false },
        { text: '19:55', isCorrect: false },
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
        { text: '12:30', isCorrect: false },
      ],
    },
    {
      id: 11,
      difficulty: 2,
      timeAnalog: 'Za kwadrans ósma rano',
      isNight: false,
      hourRotation: 232,
      minuteRotation: 270,
      options: [
        { text: '07:45', isCorrect: true },
        { text: '19:45', isCorrect: false },
        { text: '08:45', isCorrect: false },
        { text: '07:09', isCorrect: false },
      ],
    },
    {
      id: 12,
      difficulty: 2,
      timeAnalog: 'Dwadzieścia po drugiej po południu',
      isNight: false,
      hourRotation: 70,
      minuteRotation: 120,
      options: [
        { text: '14:20', isCorrect: true },
        { text: '02:20', isCorrect: false },
        { text: '14:04', isCorrect: false },
        { text: '14:40', isCorrect: false },
      ],
    },
    {
      id: 13,
      difficulty: 3,
      timeAnalog: 'Pięć po jedenastej w nocy',
      isNight: true,
      hourRotation: 332,
      minuteRotation: 30,
      options: [
        { text: '23:05', isCorrect: true },
        { text: '11:05', isCorrect: false },
        { text: '23:01', isCorrect: false },
        { text: '05:11', isCorrect: false },
      ],
    },
    {
      id: 14,
      difficulty: 1,
      timeAnalog: 'Kwadrans po dziewiątej rano',
      isNight: false,
      hourRotation: 278,
      minuteRotation: 90,
      options: [
        { text: '09:15', isCorrect: true },
        { text: '21:15', isCorrect: false },
        { text: '09:03', isCorrect: false },
        { text: '03:45', isCorrect: false },
      ],
    },
    {
      id: 15,
      difficulty: 2,
      timeAnalog: 'Za dziesięć dziewiąta wieczorem',
      isNight: true,
      hourRotation: 265,
      minuteRotation: 300,
      options: [
        { text: '20:50', isCorrect: true },
        { text: '08:50', isCorrect: false },
        { text: '21:50', isCorrect: false },
        { text: '20:10', isCorrect: false },
      ],
    },
  ],

  sequences: [
    {
      id: 'mem_span_1',
      difficulty: 1,
      instruction: 'Ułóż elementy od końca!',
      displayItems: ['📋', '💰', '✅'],
      correct: ['✅', '💰', '📋'],
      scrambled: ['📋', '💰', '✅', '❌', '🛡️'],
      displayTime: 3000,
    },

    {
      id: 1,
      difficulty: 1,
      instruction: 'Ułóż dni robocze tygodnia po kolei',
      scrambled: ['Środa', 'Poniedziałek', 'Czwartek', 'Wtorek'],
      distractors: ['Sobota', 'Niedziela'],
      correct: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek'],
    },

    {
      id: 2,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Etapy kariery zawodowej — od najniższego',
      scrambled: ['Kierownik', 'Stażysta', 'Dyrektor', 'Specjalista'],
      distractors: ['Emeryt'],
      correct: ['Stażysta', 'Specjalista', 'Kierownik', 'Dyrektor'],
    },

    {
      id: 3,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Ułóż miesiące czwartego kwartału po kolei',
      scrambled: ['Grudzień', 'Październik', 'Listopad'],
      correct: ['Październik', 'Listopad', 'Grudzień'],
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
      distractors: ['jutro', 'pżeprowadziła'],
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
      distractors: ['Faktura'],
      correct: ['Umowa', 'Urlop', 'Wynagrodzenie', 'Zarząd'],
    },
  ],

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
  ],

  lcwc: [
    { id: 1, lcwc: true, difficulty: 1, word: 'Harmonogram' },
    { id: 2, lcwc: true, difficulty: 2, word: 'Zarządzanie' },
    { id: 3, lcwc: true, difficulty: 3, word: 'Przedsięwzięcie' },
    { id: 4, lcwc: true, difficulty: 2, word: 'Dofinansowanie' },
    { id: 5, lcwc: true, difficulty: 1, word: 'Inwestycja' },
    { id: 6, lcwc: true, difficulty: 2, word: 'Zobowiązanie' },
    { id: 7, lcwc: true, difficulty: 3, word: 'Urzeczywistnienie' },
    { id: 8, lcwc: true, difficulty: 2, word: 'Konsekwencja' },
    { id: 9, lcwc: true, difficulty: 2, word: 'Doświadczenie' },
    { id: 10, lcwc: true, difficulty: 2, word: 'Zarządzenie' },
  ],

  categorization: [
    {
      id: 1,
      difficulty: 1,
      tags: ['business'],
      instruction: 'Przyporządkuj słowa do odpowiednich działów',
      buckets: [
        { id: 'hr', label: 'Kadry (HR)', icon: '👥' },
        { id: 'fin', label: 'Finanse', icon: '💰' }
      ],
      items: [
        { id: 'i1', word: 'Budżet', bucketId: 'fin' },
        { id: 'i2', word: 'Rekrutacja', bucketId: 'hr' },
        { id: 'i3', word: 'Faktura', bucketId: 'fin' },
        { id: 'i4', word: 'Urlopy', bucketId: 'hr' }
      ]
    },
    {
      id: 2,
      difficulty: 2,
      instruction: 'Pogrupuj słowa według zasady ortograficznej',
      buckets: [
        { id: 'rz', label: 'Pisownia przez rz', icon: '📝' },
        { id: 'z', label: 'Pisownia przez ż', icon: '📝' }
      ],
      items: [
        { id: 'i1', word: 'Przedszkole', bucketId: 'rz' },
        { id: 'i2', word: 'Każdy', bucketId: 'z' },
        { id: 'i3', word: 'Wydarzenie', bucketId: 'rz' },
        { id: 'i4', word: 'Młodzież', bucketId: 'z' }
      ]
    },
    {
      id: 3,
      difficulty: 2,
      instruction: 'Przyporządkuj słowa do odpowiedniej części mowy',
      buckets: [
        { id: 'rz', label: 'Rzeczownik (Kto/Co?)', icon: '📦' },
        { id: 'cz', label: 'Czasownik (Co robi?)', icon: '🏃' }
      ],
      items: [
        { id: 'i1', word: 'Spotkanie', bucketId: 'rz' },
        { id: 'i2', word: 'Rozmawiać', bucketId: 'cz' },
        { id: 'i3', word: 'Decyzja', bucketId: 'rz' },
        { id: 'i4', word: 'Analizować', bucketId: 'cz' }
      ]
    },
    {
      id: 4,
      difficulty: 2,
      instruction: 'Podział słów na pisane przez "h" i "ch"',
      buckets: [
        { id: 'h', label: 'Samo H', icon: '📝' },
        { id: 'ch', label: 'Dwuznak CH', icon: '📝' }
      ],
      items: [
        { id: 'i1', word: 'Hałas', bucketId: 'h' },
        { id: 'i2', word: 'Chmura', bucketId: 'ch' },
        { id: 'i3', word: 'Harmonogram', bucketId: 'h' },
        { id: 'i4', word: 'Charakter', bucketId: 'ch' }
      ]
    },
    { id: 5, difficulty: 2, instruction: 'Przyporządkuj słowa do odpowiedniej reguły', buckets: [{ id: 'wym', label: 'ó wymienne', icon: '🔄' }, { id: 'niewym', label: 'ó niewymienne', icon: '❌' }], items: [{ id: 'i1', word: 'Stół', bucketId: 'wym' }, { id: 'i2', word: 'Córka', bucketId: 'niewym' }, { id: 'i3', word: 'Lód', bucketId: 'wym' }, { id: 'i4', word: 'Góra', bucketId: 'niewym' }] },
    { id: 6, difficulty: 2, instruction: 'Rzeczownik czy Przymiotnik?', buckets: [{ id: 'rzecz', label: 'Rzeczownik', icon: '📦' }, { id: 'przym', label: 'Przymiotnik', icon: '✨' }], items: [{ id: 'i1', word: 'Praca', bucketId: 'rzecz' }, { id: 'i2', word: 'Pracowity', bucketId: 'przym' }, { id: 'i3', word: 'Zysk', bucketId: 'rzecz' }, { id: 'i4', word: 'Zyskowny', bucketId: 'przym' }] },
    { id: 7, difficulty: 1, instruction: 'Dni robocze vs Weekend', buckets: [{ id: 'rob', label: 'Dni robocze', icon: '💼' }, { id: 'week', label: 'Weekend', icon: '🌴' }], items: [{ id: 'i1', word: 'Wtorek', bucketId: 'rob' }, { id: 'i2', word: 'Sobota', bucketId: 'week' }, { id: 'i3', word: 'Piątek', bucketId: 'rob' }, { id: 'i4', word: 'Niedziela', bucketId: 'week' }] },
    { id: 8, difficulty: 2, instruction: 'Pisownia z ch vs h', buckets: [{ id: 'ch', label: 'Przez CH', icon: '📝' }, { id: 'h', label: 'Przez H', icon: '📝' }], items: [{ id: 'i1', word: 'Chmura', bucketId: 'ch' }, { id: 'i2', word: 'Hałas', bucketId: 'h' }, { id: 'i3', word: 'Chleb', bucketId: 'ch' }, { id: 'i4', word: 'Hierarchia', bucketId: 'h' }] },
    { id: 9, difficulty: 2, instruction: 'Medycyna vs Prawo', buckets: [{ id: 'med', label: 'Medycyna', icon: '🏥' }, { id: 'prawo', label: 'Prawo', icon: '⚖️' }], items: [{ id: 'i1', word: 'Recepta', bucketId: 'med' }, { id: 'i2', word: 'Pozew', bucketId: 'prawo' }, { id: 'i3', word: 'Diagnoza', bucketId: 'med' }, { id: 'i4', word: 'Apelacja', bucketId: 'prawo' }] },
    { id: 10, difficulty: 1, instruction: 'Czas przeszły vs przyszły', buckets: [{ id: 'past', label: 'Przeszłość', icon: '⏪' }, { id: 'future', label: 'Przyszłość', icon: '⏩' }], items: [{ id: 'i1', word: 'Wczoraj', bucketId: 'past' }, { id: 'i2', word: 'Jutro', bucketId: 'future' }, { id: 'i3', word: 'Przedtem', bucketId: 'past' }, { id: 'i4', word: 'Pojutrze', bucketId: 'future' }] }
  ],

  dictation: [
    {
      id: 1,
      dictation: true,
      difficulty: 1,
      audioPrompt: 'Biuro jest dzisiaj zamknięte.',
      correct: 'Biuro jest dzisiaj zamknięte'
    },
    {
      id: 2,
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Harmonogram projektu został zaktualizowany.',
      correct: 'Harmonogram projektu został zaktualizowany'
    },
    {
      id: 3,
      dictation: true,
      difficulty: 3,
      audioPrompt: 'Przedsiębiorstwo przynosi ogromne zyski.',
      correct: 'Przedsiębiorstwo przynosi ogromne zyski'
    }
    ,{
      id: 4,
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Mój brat kupił nowy komputer.',
      correct: 'Mój brat kupił nowy komputer'
    },
    { id: 5, dictation: true, difficulty: 2, audioPrompt: 'Wziął kredyt na nowe mieszkanie.', correct: 'Wziął kredyt na nowe mieszkanie' },
    { id: 6, dictation: true, difficulty: 3, audioPrompt: 'Rząd podjął ostateczną decyzję.', correct: 'Rząd podjął ostateczną decyzję' },
    { id: 7, dictation: true, difficulty: 2, audioPrompt: 'Zdobyliśmy cenne doświadczenie zawodowe.', correct: 'Zdobyliśmy cenne doświadczenie zawodowe' },
    { id: 8, dictation: true, difficulty: 1, audioPrompt: 'Wkrótce rozpoczniemy nowy projekt.', correct: 'Wkrótce rozpoczniemy nowy projekt' },
    { id: 9, dictation: true, difficulty: 3, audioPrompt: 'Zaangażowanie zespołu przyniosło wspaniałe efekty.', correct: 'Zaangażowanie zespołu przyniosło wspaniałe efekty' },
    { id: 10, dictation: true, difficulty: 2, audioPrompt: 'Proszę o dokładne wypełnienie formularza.', correct: 'Proszę o dokładne wypełnienie formularza' }
  ],

  diagnostic: [
    { id: 'pl_diag_1', pillar: 'Literacy', difficulty: 3, focus: 'Diagnostyka: Pisownia rz/ż', questions: { pl: 'Które słowo jest napisane błędnie?' }, options: [{ text: 'Przepraszam', isCorrect: false }, { text: 'Porządek', isCorrect: false }, { text: 'Wydażenie', isCorrect: true }, { text: 'Marzenie', isCorrect: false }] },
    { id: 'pl_diag_2', pillar: 'Literacy', difficulty: 2, focus: 'Diagnostyka: Homofony', questions: { pl: 'Wybierz poprawne słowo: "Z chęcią ___ tę propozycję."' }, options: [{ text: 'przyjmę', isCorrect: true }, { text: 'przymne', isCorrect: false }, { text: 'pżyjmę', isCorrect: false }, { text: 'przymię', isCorrect: false }] },
    { id: 'pl_diag_3', pillar: 'Literacy', difficulty: 3, focus: 'Diagnostyka: Ó/U', questions: { pl: 'Które słowo posiada "ó" niewymienne?' }, options: [{ text: 'Wóz', isCorrect: false }, { text: 'Córka', isCorrect: true }, { text: 'Stół', isCorrect: false }, { text: 'Rów', isCorrect: false }] },
    { id: 'pl_diag_4', pillar: 'Literacy', difficulty: 2, focus: 'Diagnostyka: Podział na sylaby', questions: { pl: 'Ile sylab ma słowo "Zaangażowanie"?' }, options: [{ text: '4', isCorrect: false }, { text: '5', isCorrect: false }, { text: '6', isCorrect: true }, { text: '7', isCorrect: false }] },
    { id: 'pl_diag_5', pillar: 'Visual', difficulty: 2, focus: 'Diagnostyka: Dyskryminacja wzrokowa', questions: { pl: 'Wskaż literę, która nie pasuje do wzoru:\n\n p p q p p' }, options: [{ text: 'Pierwsza', isCorrect: false }, { text: 'Druga', isCorrect: false }, { text: 'Trzecia', isCorrect: true }, { text: 'Czwarta', isCorrect: false }] },
    { id: 'pl_diag_6', pillar: 'Visual', difficulty: 3, focus: 'Diagnostyka: Odbicia lustrzane', questions: { pl: 'Który ciąg cyfr różni się od 5469?' }, options: [{ text: '5469', isCorrect: false }, { text: '5469', isCorrect: false }, { text: '5496', isCorrect: true }, { text: '5469', isCorrect: false }] },
    { id: 'pl_diag_7', pillar: 'Visual', difficulty: 2, focus: 'Diagnostyka: Orientacja w czasie', questions: { pl: 'Jeżeli spotkanie zaczyna się o 14:00 i trwa 90 minut, o której się kończy?' }, options: [{ text: '15:00', isCorrect: false }, { text: '15:30', isCorrect: true }, { text: '16:00', isCorrect: false }, { text: '14:90', isCorrect: false }] },
    { id: 'pl_diag_8', pillar: 'Cognitive', difficulty: 3, focus: 'Diagnostyka: Pamięć sekwencyjna', questions: { pl: 'Który miesiąc następuje bezpośrednio po sierpniu?' }, options: [{ text: 'Lipiec', isCorrect: false }, { text: 'Październik', isCorrect: false }, { text: 'Wrzesień', isCorrect: true }, { text: 'Listopad', isCorrect: false }] },
    { id: 'pl_diag_9', pillar: 'Cognitive', difficulty: 2, focus: 'Diagnostyka: Kategoryzacja', questions: { pl: 'Które słowo NIE należy do grupy zawodów?' }, options: [{ text: 'Nauczyciel', isCorrect: false }, { text: 'Lekarz', isCorrect: false }, { text: 'Biblioteka', isCorrect: true }, { text: 'Inżynier', isCorrect: false }] },
    { id: 'pl_diag_10', pillar: 'Cognitive', difficulty: 3, focus: 'Diagnostyka: Pamięć logiczna', questions: { pl: 'Jeśli Jan jest wyższy od Piotra, a Piotr jest wyższy od Michała, to kto jest najniższy?' }, options: [{ text: 'Jan', isCorrect: false }, { text: 'Piotr', isCorrect: false }, { text: 'Michał', isCorrect: true }, { text: 'Wszyscy są równi', isCorrect: false }] }
  ]
};
