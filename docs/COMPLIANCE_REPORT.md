# Thesis Constraint Compliance Report — EnClaro

> Date: 2026-09-02. This closes out `docs/COMPLIANCE_AUDIT.md` (2026-08-31):
> every numbered finding and every item on that audit's "Prioritized punch
> list" is accounted for below, with the commit that addressed it, the
> evidence, and how to verify it yourself. Nothing here is asserted from
> memory — every "Resolved" row was re-run (lint, typecheck, `vitest run`,
> `playwright test`, a production `build`) as of this date.

## How to read this

Same table shape used at every stage of this work:
`| Ustalenie z audytu | Status | Dowód | Jak sprawdzić |`. "Dowód" cites the
commit and file; "Jak sprawdzić" is something you can personally do —
run a command, or reproduce an interaction — not just re-read the diff.

---

## Threatens study validity — fixed before any data collection

| Ustalenie z audytu | Status | Dowód | Jak sprawdzić |
|---|---|---|---|
| `isGamified` rozgałęział sterowanie sesją ćwiczeń (różne modały w różnych momentach dla obu wariantów badania) | Rozwiązane | `useExerciseSession.js` nie odwołuje się już do `isGamified` w ogóle — wszystkie użycia w `App.jsx` dotyczą wyłącznie renderowania (widoczność zakładki Ogród, wybór wizualizacji postępu) | `src/__tests__/productInvariants.test.js` — test `useExerciseSession.js never references isGamified`, zielony |
| Model gamifikacji to wieloma-walutowy system zasobów (punkty/monety/competencePoints/nagrody + wybór nagrody) zamiast jednej monotonicznej wartości | Rozwiązane (`e13ef2d`) | `useGamificationState.js` eksponuje dokładnie jedno pole liczbowe | `productInvariants.test.js` — `useGamificationState exposes exactly one numeric field`, zielony |
| Dwa niezależne mechanizmy passy (sesyjny + kalendarzowy), oba mogące się przerwać | Rozwiązane (`6f92428`) | streak i jego wizualizacje usunięte całkowicie z `useExerciseSession.js`/`VirtualGarden.jsx` | `grep -rn "currentStreak\|calcCurrentStreak" src/` — brak wyników |
| 4 komponenty ćwiczeń w kategorii "odradzane" wg wytycznej klinicznej (Spatial/tracking, RhythmTap, RhythmMemory, MelodyMemory) | Rozwiązane (`30c4ba7`) | `src/data/exerciseTypes.js` — `EXCLUDED_FROM_STUDY` wyklucza `tracking`/`rhythm`/`rhythmMemory`/`melodyMemory` z `STUDY_EXERCISE_TYPES`; komponenty zostają w kodzie (tryb Game), ale nie są oferowane w trybie badawczym | otwórz Ustawienia → Ćwiczenia w trybie "Tylko nauka" — te cztery nie są przełączalne/dostępne |
| Brak podziału treści na zestaw A/B — nic nie chroni przed powtórką tego samego zadania między sesjami | **Częściowo** (`2bcde47`) | `src/data/studySets.js` — mechanizm (`STUDY_SETS`, `belongsToActiveSet`) jest gotowy i podłączony w `useExerciseSession.js`, ale **żaden element w `vocabulary_*.js` nie ma jeszcze pola `set`** — to decyzja merytoryczna (które pozycje trafiają do A, które do B), nie zadanie kodowe | `grep -n "set:" src/data/vocabulary_de.js` — brak wyników; mechanizm jest no-opem, dopóki nie przypiszesz treści |

**Uwaga:** ostatni punkt wymaga Twojej decyzji merytorycznej (podział pozycji słownikowych), nie dalszej pracy programistycznej — infrastruktura czeka.

---

## Guideline/accessibility compliance gaps

| Ustalenie z audytu | Status | Dowód | Jak sprawdzić |
|---|---|---|---|
| Sześć tokenów projektowych nie istniało pod nazwami/wartościami ze specyfikacji; brak suwaków ciągłych | Rozwiązane (`2f01889`) | `useUserSettings.js:49-54` — `fontSizeExercise` (max 32), `fontSizeUi` (max 28), `lineHeight` (max 2.2), `letterSpacing` (max 0.24em), `wordSpacing` (max 0.32em), `paragraphSpacing` (max 3.0em) — dokładnie wartości ze specyfikacji; `index.css:45` — `--measure: 66ch` | `productInvariants.test.js` — `index.css declares ...` × 7, zielone; otwórz Ustawienia → suwaki reagują na żywo |
| OpenDyslexic wysyłany i wybieralny przez użytkownika | Rozwiązane (`3ca140f`) | `src/styles/fonts.css` i pliki `.woff2` usunięte; brak przełącznika czcionki gdziekolwiek | `productInvariants.test.js` — `no stylesheet under src/styles declares an OpenDyslexic @font-face`, zielony |
| Sprawdzanie kontrastu liczyło 7:1, ale bramka odpalała się tylko poniżej 4.5:1, tylko w konsoli deweloperskiej | Rozwiązane (`7646f52`) | `contrastChecker.js`'s `checkContrast()` używany w `src/__tests__/contrastCompliance.test.js` — realny test, nie warning | `npx vitest run src/__tests__/contrastCompliance.test.js` — 14/14 zielone |
| "Maks. 5 elementów interaktywnych" i "UI postępu ukryte podczas przetwarzania zadania" naruszane domyślnie (`zenMode` off) | Rozwiązane (`e4ac67e`) | `App.jsx` — `isProcessingTask` chowa nav/ustawienia/pasek postępu niezależnie od `zenMode`, zawsze | otwórz dowolne ćwiczenie na żywo — nav i pasek postępu znikają w trakcie pytania, wracają po odpowiedzi |
| Komunikaty zwrotne to generyczna pochwała/pocieszenie, nigdy nie nazywają reguły (mimo że pola `focus`/`hint` istnieją w danych) | Rozwiązane (`fce3e62`) | `useExerciseSession.js` — `feedback.correctWithRule`/`incorrectWithRule` z `currentTask.focus`, gdy dostępne | odpowiedz na zadanie typu grapheme na żywo — komunikat wymienia regułę ortograficzną |

---

## Lower priority / verify only

| Ustalenie z audytu | Status | Dowód | Jak sprawdzić |
|---|---|---|---|
| `cycle` (seed przetasowania) nie był persystowany — dokładność wznowienia sesji ucierpi po pełnym okrążeniu | Rozwiązane (`a2c1240`) | `useExerciseSession.js` — ten sam wzorzec co `currentIndex`: `localStorage['cycle']` | przeładuj stronę w trakcie sesji po pełnym okrążeniu puli — kolejność się nie powtarza |
| Przycisk "czytaj na głos" pozycjonowany niezależnie w każdym komponencie — brak wspólnego slotu strukturalnego | Rozwiązane (`a2c1240`) | nowy `src/components/common/ExerciseControlsRow.jsx`, używany w 17 komponentach ćwiczeń | czytelne w `git show a2c1240` |
| Wizualne przycinanie pierścienia fokusu w kontenerach `overflow-hidden` — wymagało sprawdzenia na żywo | Sprawdzone i naprawione (`a2c1240`) | Zbadano wszystkie kontenery scrollowalne/`overflow-hidden`; jeden realny przypadek znaleziony i naprawiony: `VisualCategorization.jsx:276` (siatka kategorii bez paddingu ucinała `focus-visible:ring-4` na skrajnych kafelkach) | Tab do skrajnego kafelka kategorii na klawiaturze — pierścień w pełni widoczny |
| Nieaktualne twierdzenia "✅ Umgesetzt" w `docs/DEVELOPMENT_PROMPT.md` (OpenDyslexic, stare numery linii, 13 zamiast 18 typów ćwiczeń) | Rozwiązane (`a2c1240`) | Sekcje 2.5/2.6 przepisane do stanu faktycznego kodu | czytelne w diffie `a2c1240` |

---

## Findings the audit already marked MET (unchanged, re-verified)

No time pressure · no error punishment · no colour-overlay reading aids ·
no user account · text alignment (no `justify`) · consistent Settings
position · offline-capable + installable · input assistance disabled on
free-text spelling inputs · immediate/retry-open/non-red-green feedback.
None of this session's changes touch these; the audit's evidence for them
still matches the current source.

## Noted but intentionally not touched (not on the audit's punch list)

- **Information architecture (3-level entry→selection→task flow):** the
  audit recorded this as "does not match" the spec's intended structure,
  but did not place it on the punch list — it's a navigation redesign
  decision, not a code defect, and nothing in this remediation pass
  changed it. Still: `IntroScreen` → task-streaming directly, with
  Garden/Settings/Survey as peer destinations reachable anytime.
- **Several `EXERCISE_PILLARS` DB keys (`auditory`, `vocabulary`,
  `mirrorImage`, `oddOneOut`, `logicalReasoning`) still route through
  `GraphemeExercise`'s generic multiple-choice UI** regardless of their
  pillar label, because their vocabulary entries carry `type: 'grapheme'`.
  This is a content-authoring characteristic, not a routing bug — routing
  is now strictly by each task's own `type` field (see
  `ExerciseContainer.jsx`'s `EXERCISE_COMPONENTS` map), so this only
  changes if those DB entries' `type` values change. Unrelated to and not
  fixed by adding `GraphemePhonemeMatchExercise` (which resolved the
  audit's separate "no explicit Ü1 sound↔grapheme matching exists" gap).

## Known test flake (not a regression)

`tests-playwright/responsiveness.spec.js`'s "nawigację między zakładkami na
ekranie mobilnym" test fails intermittently (roughly 1 in 4 runs) on both
current code and the pre-remediation baseline — confirmed by direct
`git stash` comparison. Root cause: a "Voice input on this browser"
fallback banner occasionally claims the screen during randomized exercise
selection in the mobile emulation profile, unrelated to anything this
remediation touched. The project's own `retries: 2` CI setting absorbs
this; it is not blocking.

---

## Verification run for this report

```
npm run lint        # clean
npx tsc --noEmit     # clean
npx vitest run       # 566/566
npm run build        # succeeds
npx playwright test  # all green except the known flake above
```

Every commit referenced above is on `thesis-compliance`; push status is
whatever you last confirmed with `git push`.
