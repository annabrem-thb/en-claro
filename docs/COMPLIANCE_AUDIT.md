# Thesis Constraint Compliance Audit — EnClaro

> Date: 2026-08-31. Read-only audit, no code changed. Findings come from four
> independent code reads (not from `docs/DEVELOPMENT_PROMPT.md`'s own status
> claims, several of which are shown below to be stale). Every claim below is
> anchored to a `file:line`; verify by opening that line if in doubt.
>
> This complements `docs/DEVELOPMENT_PROMPT.md` (design rationale/sourcing)
> and `docs/AUDIT_PROMPT.md` (technical QA) — this file audits the app
> against the *thesis's own non-negotiable constraints*, i.e. whether the
> methodological premise of the A/B study (the two variants differ in
> exactly one dimension) still holds.

## Executive summary

Ten findings materially matter. The first three threaten the study's
methodological validity directly (the two variants differ in more than
"presence of gamification," or the gamification module itself violates its
own design spec); the rest are guideline/accessibility compliance gaps.

1. **`isGamified` leaks into exercise-session flow control**, not just
   rendering — the two study arms hit different modals on different score
   cadences. This is the most serious finding.
2. **The gamification state is a multi-currency resource-management system**
   (points/coins/competencePoints/rewards + a reward-choice flow), not the
   spec's single monotonic `growthValue`.
3. **Two independent streak mechanics exist and both can break** (a
   per-session streak and a calendar-day streak), contradicting "no
   competition, ever."
4. Exclamation-mark, emoji-heavy praise strings are shipped throughout the
   German locale ("Neuer Baum! 🎉", "Sie sind nicht zu stoppen!").
5. **OpenDyslexic is shipped and user-selectable** — the spec explicitly
   bans this.
6. The six required design tokens don't exist under their spec names or
   values, and none have a continuous, spec-range slider — only on/off
   accessibility toggles with fixed values.
7. Only 2 of 17 exercise components map cleanly to the guideline's Ü1–Ü5;
   **4 are squarely in the "recommended against" grade-A bucket**
   (Spatial/tracking, RhythmTap, RhythmMemory, MelodyMemory).
8. **No set-A/set-B content split exists** — nothing prevents a participant
   from seeing the same item twice across sessions.
9. Feedback strings are generic praise/consolation, never naming a rule —
   the data model has `focus`/`hint` rule fields, but no component renders
   them (violates the Ü4/Ü5 feedback requirement).
10. The "max 5 interactive elements during task processing" and "progress UI
    hidden during task processing" requirements are both violated by
    default settings (`zenMode` is off by default).

---

## Section 2 — Non-negotiable constraints

### 2.1 No competition, ever — **VIOLATED**
- `src/hooks/useExerciseSession.js:281-283` — a per-session `currentStreak`
  increments on success and gates escalating messages at `>=3`
  (`translation.json:76-81`, e.g. `"{{count}} in Folge! 🔥"`,
  `"{{count}} Treffer-Serie! 🚀"`). It doesn't reset on error, only on tab
  switch (`App.jsx:405`).
- `src/components/VirtualGarden.jsx:174-198` separately computes a
  **calendar-day streak** (`calcCurrentStreak`) that resets to 1 on any
  gapped day, feeding "monument" visuals via
  `effectiveStreak = Math.max(maxStreak, streak)` (line 335). This one *does*
  break in the classic sense the constraint prohibits.
- No leaderboard/ranking/percentile/cross-user comparison found anywhere.

### 2.2 No time pressure — **MET**
No countdown, elapsed-time, or "speed" feedback is shown to the user.
Internal `Date.now()`/`performance.now()` uses (`useCognitiveLoad.js:36-41`,
`useSafeTimeouts.js`, `useLocalWhisper.js:223-233`) are session-duration
wellbeing nudges or debounce bookkeeping, never surfaced as a number/timer.

### 2.3 No error punishment — **MET**
No point deduction, lives, or lost progress on error
(`ExerciseContainer.jsx:68-89`, `GraphemeExercise.jsx:219`). The shared
feedback banner (`App.jsx:799-813`) is neutrally styled regardless of
correctness; `LookCoverWriteCheck.jsx:195-204` explicitly pairs color with
an icon. All tasks remain retryable via Skip/Next (`App.jsx:872-884`).

### 2.4 No child-media design language — **VIOLATED**
- `translation.json:63-68` — `successMsg: ["Großartig!", "Ausgezeichnet!",
  "Wunderbar!", "Super!", ...]`
- `translation.json:76-81` — streak messages with 🔥🚀🌟💪
- `translation.json:658-659` — `"newTreeTitle": "Neuer Baum! 🎉"` /
  `"newTreeMsg": "Fantastisch! ..."`, rendered in `NewTreeToast.jsx:29-35`
- `translation.json:94-98` — `voice.streak: ["... Sie sind nicht zu
  stoppen!", "Unglaublich! ...", "Fantastisch! ..."]`

This is not mascots/cartoons/confetti-animation per se, but is squarely the
"exclamation-mark praise" pattern the constraint names as prohibited.

### 2.5 No colour-tinted backgrounds / colour-overlay filters, no reduced contrast — **MET**
No Irlen/overlay/tint reading-aid feature exists. `useThemeCSSVariables.js`'s
named cosmetic themes (Natur/Musik/Kunst/Space/Ocean) and a colorblind-safe
palette (`COLORBLIND_PALETTE`, lines 12-17) are branding/colorblind
accommodations, not background-hue "reading aids."

### 2.6 No user account — **MET**
No login/registration/password. All app state is `localStorage`/IndexedDB.
`SurveyComponent.tsx` posts to a Netlify function for research consent/NASA-
TLX data — it does not gate app access (`App.jsx:960-989` has a close button
that resumes exercises regardless of completion).

---

## Section 3–4 — Design tokens & WCAG 2.2

### Token names/values — **VIOLATED**
None of the six spec tokens (`--font-size-exercise`, `--font-size-ui`,
`--line-height`, `--letter-spacing`, `--word-spacing`,
`--paragraph-spacing`, `--measure`) exist anywhere in the codebase. The app
uses an unrelated, lower-default scheme instead:
`--dyn-font-size: 16px` (index.css:32, drops to **14px** ≥768px, index.css:62),
`--dyn-line-height: 1.5` (index.css:29),
`--dyn-letter-spacing`/`--dyn-word-spacing: normal` (index.css:30-31).
No `--paragraph-spacing` or `--measure` (66ch line-length cap) concept exists
at all. `--responsive-scale` is capped at `min(scale, 1.3)` (index.css:36),
in tension with the required headroom for 1.4.4/1.4.12.

### Font stack — **VIOLATED**
Default stack is a correct system sans-serif (index.css:28), but
`a11y.css:6-12` swaps to `'OpenDyslexic', Helvetica, ...` under a `lrs`
toggle, and `fonts.css:1-48` ships 4 OpenDyslexic `@font-face` woff2 files
present in `public/fonts/`. The spec bans exactly this by name.

### Settings UI adjustability — **VIOLATED**
No slider/range exists for any of the six tokens. `useUserSettings.js:48`
defines `textScale: 100` wired to `--user-text-scale` (line 104), but no UI
component reads or sets it — dead state. `SettingsModal.jsx` (lines 191-212)
only exposes boolean toggles with fixed values (`vision`→115% zoom,
`spacing`→fixed 0.15em/0.35em/line-height 2, `lrs`→fixed 1.75/0.2em/0.08em),
none reaching the spec's stated maxima (32px/28px/2.2/0.24em/0.32em/3.0em),
and nothing for paragraph-spacing or measure. Persistence itself works
(`localStorage['cfg_settings']`) but persists booleans, not adjustable
scalars.

### Text alignment — **MET**
No `text-align: justify` anywhere; `index.css:110` forces `text-align: left
!important` on `body`.

### Contrast (1.4.3) — **VIOLATED**
`contrastChecker.js:55-69` computes both 4.5:1 and 7:1, but the actual gate
(`warnIfInsufficientContrast`, line 86) only fires below **4.5:1**, never
enforcing the spec's 7:1. Both entry points are `PROD`-gated off
(lines 80, 111) — dev-console-only, not run in CI/tests, and its only call
site (`useThemeCSSVariables.js:61`) checks theme-accent-vs-background, not
actual body-text pairs.

### Focus indicators (2.4.11) — **MET**, clipping **UNCLEAR**
Global `*:focus-visible` ring (index.css:125-128, boosted under high
contrast, a11y.css:29-32); every `focus:outline-none` found is paired with a
`focus-visible:ring-4` replacement (no bare removal). Some ancestor
containers use `overflow-hidden`/`overflow-y-auto` (App.jsx:650,
SettingsModal.jsx tab panel) that could clip a ring on an edge element —
needs a runtime check, not resolvable statically.

### Target size (2.5.8) — **MOSTLY MET**
Answer tiles 48×48 (GraphemeExercise.jsx:150); motor-accessibility mode
forces 56×56 (a11y.css:41-49); default nav buttons only reach 56px when
`bigTargets` is on, otherwise just `p-2` with no explicit min-height
(BottomNav.jsx:36). `SettingsModal.jsx:567` close button is 32×32 — clears
the 24×24 floor but misses the preferred 44×44.

### Consistent Help / settings position (3.2.6) — **MET**
Gear button (`SidebarNav.jsx:357-396`, `BottomNav.jsx:164-177`) is mounted
unconditionally outside the tab-content conditional (App.jsx:624-667,921),
so it's in the same slot across all regular views.

---

## Section 5 — Exercise content vs. clinical guideline

Full mapping (17 components read):

| Component | What it does | Classification |
|---|---|---|
| SyllableExercise | Place cut-marks to divide a word into syllables | **Ü2** ✅ |
| ScrabbleExercise | Assemble scrambled letters into a word | **Ü3** ✅ |
| GraphemeExercise | MC spelling choice (ie/ei, dass/das) | Ü4-adjacent, but rule name (`data.focus`) never rendered |
| ContextExercise | Cloze sentence, pick correct word | Ü5-adjacent, but rule (`data.hint`) never rendered |
| SequenceExercise | Reorder scrambled words into a sentence | Ü5-adjacent, no rule reference |
| VisualCategorization | Sort tiles into buckets | Mixed: some ie/ei sorting (Ü4-like), some plain grammar |
| PhonemeExercise | Type full word from a *semantic definition* clue | Other — not phoneme↔grapheme matching |
| ClockExercise | Read analog clock, pick digital time | Other — numeracy, no grapheme content |
| DictationExercise | Type word/phrase heard | Other — literal transcription |
| LookCoverWriteCheck | Memorize word, hide, type, compare | Other — whole-word visual memory |
| ReadAloudExercise | Read displayed text aloud, speech-checked | Other — oral fluency |
| ReadingComprehensionExercise | Read passage, answer MC question | Other — comprehension quiz |
| **SpatialExercise** | b/d belly-side, arrow-direction discrimination | **Recommended against** — visual reversal training, no grapheme link |
| **RhythmTapExercise** | Tap once per syllable heard | **Recommended against** — auditory tapping, no written segmentation |
| **RhythmMemoryExercise** | Simon-says tap-pattern reproduction | **Recommended against** — pure auditory/attention |
| **MelodyMemoryExercise** | Simon-says pitch-sequence reproduction | **Recommended against** — pure auditory memory |
| MemorySpanExercise | Reproduce a sequence in order | Other — verbal working-memory span, no grapheme link |

**4 of 17 are squarely in the guideline's grade-A "recommend against"
bucket.** None map cleanly to Ü1 (explicit sound↔grapheme matching in both
directions). Additionally, several `EXERCISE_PILLARS` DB arrays
(`auditory`, `vocabulary`, `mirrorImage`, `oddOneOut`, `logicalReasoning`)
carry no dedicated component at all — they're silently rendered through
`GraphemeExercise`'s generic MC UI regardless of the pillar's semantic name
(`vocabulary_de.js`, sampled entries confirm `type: 'grapheme'`).

**MemorySpanExercise** is confirmed live (routed via `ExerciseContainer.jsx:
16,35`, pillar-listed in `exerciseTypes.js:37`) — knip's dead-code flag on
it is stale.

**Set A / Set B split — VIOLATED.** No `setA`/`setB`/`variantA`/`variantB`
fields exist in `vocabulary_de.js`, and `useExerciseSession.js` tracks no
seen/excluded-id state across sessions beyond a history *log*. Content is a
single flat pool — nothing currently prevents a participant from seeing the
same item twice.

---

## Section 6 — Gamification architecture

### Isolation behind one interface — **VIOLATED (critical)**
Rendering-only uses of `isGamified` are fine (`App.jsx:711,728,733,748,778`,
nav components, `ProgressPill.jsx:17`). But
**`useExerciseSession.js:295-300` and `:338-364`** branch exercise-session
*flow control* on `isGamified`: the gamified path shows `LevelUpModal` every
5 points; the non-gamified path instead shows a feedback survey every 10
points, on a different timeout schedule
(`setSafeTimeout(...,1000)` vs. the survey's own timing). **The two study
arms are interrupted by different modals on different cadences** — this is
exactly the kind of extraneous variable the study design says must not
exist.

### State model — **VIOLATED**
Spec requires one monotonic `growthValue`, independent of answer quality,
that never decreases, with no choices/resource-management. Actual state
(`useGamificationState.js:29-116`): `points`, `coins`, `competencePoints`,
`rewards`/`unlockedRewards`, and a **reward-selection flow**
(`chooseNextReward`/`unlockSelectedReward`) — four parallel currencies plus
a choice mechanic, which is explicitly the "no resource management, no
choices" mechanic the spec forbids. Daily quests
(`useGamificationState.js:38-45`) reset every calendar day.

The garden's own mapping rule (`VirtualGarden.jsx:40`,
`POINTS_PER_LEVEL = 5`, fixed non-progressive threshold) is actually
consistent with the spec in isolation — the problem is what feeds it.

### Temporal separation — **VIOLATED**
`VirtualGarden` itself only renders on its own tab (`App.jsx:667-703`) —
correct. But `ProgressPill` (a progress visualization) renders **inside the
active-task header** (`App.jsx:728-751`), gated only by `!settings.zenMode`,
and `zenMode` **defaults to false** (`useUserSettings.js:43`) — so by
default, progress UI is visible throughout task processing, not just
before/after.

---

## Section 7 — Other functional requirements

### Max 5 interactive elements during task processing — **VIOLATED**
With default settings, the active-task view simultaneously renders nav
(5-6 buttons), `CognitiveEnergyIndicator` (2 handlers), `ProgressPill` +
rewards badge, Skip/Next, plus the exercise's own controls (input, submit,
TTS, mic) — well past 5, and explicitly includes nav/settings/progress,
which the spec says must not render in this view.

### Information architecture (3 levels) — **does not match**
`IntroScreen` → directly into task-streaming (no distinct "exercise
selection" screen — picking a pillar via nav both selects the category and
starts streaming, `App.jsx:256-257,667-905`). Garden/Settings/Survey are
peer top-level destinations reachable at any time
(`useHashRoute.js:3,26-38`), not steps in an entry→selection→task chain.

### Resumable sessions — **PARTIAL**
Only a raw numeric index persists (`useExerciseSession.js:88-115`,
`localStorage['idx']`). `cycle` (the shuffle seed) is **not** persisted and
resets to 0 on reload, so after more than one full pass the restored index
can point at a different task than the one left off. No partial input is
ever saved. `src/utils/indexedDB.js` has no `session_state` store — only
completed-event logs.

### Offline-capable + installable — **MET**
`vite.config.js:20-70` — `VitePWA` manifest (`EnClaro`, `standalone`,
icons) with Workbox precaching app shell + exercise media; survey POSTs use
`NetworkOnly` + background-sync.

### Read-aloud button fixed position — **PARTIAL**
Consistently placed near the top of each exercise's own render tree in
practice (`PhonemeExercise.jsx:158-160`, `ContextExercise.jsx:215-217`,
others), but each component declares its own wrapper independently — no
shared layout slot enforces this structurally, so positional drift is
possible on future edits.

### Input assistance disabled where spelling is the task — **MET**
The three free-text inputs (`DictationExercise.jsx:152-153`,
`PhonemeExercise.jsx:228-229`, `LookCoverWriteCheck.jsx:132-133`) all set
`autoComplete="off"` and `spellCheck="false"`. All other exercises are
choice-based.

---

## Section 8 — Feedback design

- **Immediate** — MET (`useExerciseSession.js:317,412`, synchronous).
- **Retry-open** — MET (`disabled` only guards empty input, not post-error
  state).
- **No red/green-only** — MET (neutral banner styling, `App.jsx:804`).
- **Substantive, names the rule** — **VIOLATED.** Actual strings are
  generic: `translation.json:62-82` — `successMsg: ["Großartig!",
  "Ausgezeichnet!", ...]`, `errorMsg: ["Lassen Sie uns das gemeinsam
  analysieren.", "Versuchen wir es noch einmal.", "Fast richtig, schauen Sie
  noch einmal hin.", ...]`. No exercise data field or feedback string names
  the applicable orthographic/phonological rule, even though `focus`/`hint`
  fields carrying rule names exist in the vocabulary data and go unused.

---

## Prioritized punch list

**Threatens study validity — fix before any data collection:**
1. `isGamified` branching in `useExerciseSession.js`'s flow control (modal
   cadence differs between arms)
2. Multi-currency gamification model → single monotonic `growthValue`;
   remove the reward-choice flow entirely
3. Both streak mechanics (session-level and calendar-day)
4. Remove/replace the 4 grade-A-contraindicated exercise components, or
   explicitly justify keeping them against the guideline
5. Build the set-A/set-B content split

**Guideline/accessibility compliance gaps:**
6. Rename/rebuild the six design tokens to spec, add continuous sliders
   reaching the stated maxima, persist and apply them
7. Remove OpenDyslexic entirely
8. Fix contrast checker to gate at 7:1 and actually run somewhere enforced
9. Default `zenMode`-equivalent behavior so progress UI and >5 interactive
   elements don't appear during task processing by default
10. Add rule-naming to Ü4/Ü5-adjacent feedback (`focus`/`hint` fields
    already exist in data — just unused)

**Lower priority / verify only:**
11. Persist `cycle` for exact resume-position accuracy
12. Extract read-aloud button placement into one shared layout slot
13. Visually check focus-ring clipping in `overflow-hidden` containers
14. Correct `docs/DEVELOPMENT_PROMPT.md`'s stale "✅ Umgesetzt" claims
    (e.g. §2.1 gamification/reward status) so it isn't cited as evidence of
    compliance in the thesis text while no longer matching the code
