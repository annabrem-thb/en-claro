# Full Application Audit Prompt

> Paste this prompt into a fresh Claude Code (or equivalent coding agent)
> session, in the root of this repository, to run a full health check of
> **EnClaro**. It complements `docs/DEVELOPMENT_PROMPT.md` (which governs
> *design* decisions against the thesis sources) — this prompt is purely a
> technical/QA sweep and does not need any thesis context to run.

---

## Prompt

You are auditing the EnClaro codebase (React 19 + Vite PWA, i18next with
`de`/`en`/`pl` locales under `src/locales/`, Vitest + Playwright test
suites). Go through the checks below in order. For each one, report concrete
findings with file paths and line numbers — do not summarize in vague terms
like "some issues found." If a check passes cleanly, say so explicitly
instead of omitting it, so the report is a complete record, not just a list
of complaints. Do not fix anything yet; produce a findings report first, then
ask which items to act on.

### 1. Dead code and unused assets

- Run `npm run lint:knip` and report every unused file, export, and
  dependency it flags. Knip has already caught real dead code in this repo
  before (e.g. `FeedbackCollector.jsx`, `MemorySpanExercise.jsx` — both since
  removed), so treat its output as a strong signal, not noise.
- Independently grep for any exercise/component file under
  `src/components/exercises/` that is never imported by
  `ExerciseContainer.jsx` or referenced by a vocabulary entry's `type` field —
  this is the specific pattern that made `MemorySpanExercise.jsx` invisible to
  a naive "is it imported anywhere" search in the past (it existed and even
  had tests, but was never wired into the routing that makes an exercise
  reachable by a real user).
- Check `public/` and `src/assets/` (or equivalent) for image/font files not
  referenced by any source file.
- Check `package.json` dependencies against actual usage (knip covers this,
  but double-check anything knip might miss due to dynamic imports, e.g. the
  `mespeak`/voice files loaded via `import()` in `src/workers/ttsWorker.js`).

### 2. Translation completeness — two tiers

**Tier 1 — key presence (already automated):** run `npm run check:locales`.
Report its output as-is.

**Tier 2 — value-level untranslated strings (NOT covered by the script
above):** `check-locales.mjs` only verifies that the same *keys* exist in
`de`/`en`/`pl` — it says nothing about whether the *values* were actually
translated. Write and run a one-off script (or do this by direct comparison)
that flattens all locale JSON files the same way `check-locales.mjs` does,
then for every key present in all three languages, flags it as suspicious if:

- the `en` and `pl` values are byte-identical, or
- the `en` and `de` values are byte-identical,

**excluding** legitimate exceptions: the brand name "EnClaro", pure numbers,
emoji-only strings, URLs, and other values that are genuinely the same across
languages by design (check a sample manually before assuming a flagged value
is a real bug). A known concrete example of this exact failure mode: a
"success"-type string used in the survey flow was found identical across
locales — meaning it was never translated even though `check-locales.mjs`
reported the file as complete. Find every other instance of this pattern
across `translation.json`, `common.json`, `errors.json`, `feedback.json`,
`survey.json`, and `profileDashboard.json` in all three languages.

### 3. Functional smoke test

- Start the dev server (`npm run dev`) and, for each of the exercise types
  listed in `docs/DEVELOPMENT_PROMPT.md` §2.6 (13 types across Literacy,
  Visual, Cognitive pillars), load it in **both** `isGamified` states and
  confirm: the instruction text renders, read-aloud (TTS) does not throw a
  console error, answering correctly and incorrectly both produce feedback,
  and the exercise can be completed and advances to the next one.
- Check the browser console for errors/warnings across the flows above —
  report every distinct warning, not just hard errors.
- Verify the PWA install flow: `beforeinstallprompt` handling in
  `src/components/SidebarNav.jsx`, and that the button correctly disappears
  after either an accepted or dismissed native prompt (this was a real bug,
  already fixed — confirm it stays fixed).
- Verify the survey flow end-to-end in dev: trigger `SurveyComponent.tsx`,
  fill it out, and confirm the payload shape sent to
  `netlify/functions/submit-survey/index.js` matches what the handler reads
  (see `docs/DEVELOPMENT_PROMPT.md` §3.4 for a field-name mismatch bug that
  was found and fixed here before — confirm no regression).

### 4. Automated test suites and build health

Run each of these and report pass/fail plus any skipped tests:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run test:e2e
npm run build
```

For `npm run build`, also note the output bundle sizes against
`docs/bundle-size.md` and flag any chunk that grew significantly without an
obvious corresponding feature addition.

### 5. Accessibility regression

Run the existing `tests-playwright/accessibility.spec.js` (axe-core, WCAG 2.1
A/AA) suite and report every violation, even ones that seem minor. Cross-check
new/changed UI since the last audit against
`docs/DEVELOPMENT_PROMPT.md` §2.7 (color must never be the only feedback
channel) — spot-check any exercise with colored correct/incorrect states for
a redundant icon or text cue.

### 6. Cross-check against the open items list

`docs/DEVELOPMENT_PROMPT.md` §6 ("Offene Punkte / nächste Schritte") lists
unresolved items. Re-verify each unchecked (`[ ]`) item's current status in
the actual codebase, since code may have moved on since that file was last
updated — report if any should now be marked resolved, and if any checked
(`[x]`) item has silently regressed.

### Output format

Structure the report as one section per numbered check above. Within each
section, list findings as `file:line — description`. End with a short
prioritized punch list: what's safe to auto-fix immediately (e.g. confirmed
dead code, confirmed untranslated strings) versus what needs a judgment call
before touching (e.g. anything touching the survey data pipeline, given the
past data-integrity incident documented in
`docs/DEVELOPMENT_PROMPT.md` §3.4).
