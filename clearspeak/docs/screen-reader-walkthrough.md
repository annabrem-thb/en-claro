# Manual Screen-Reader Walkthrough Protocol

## Purpose

The automated axe-core suite (`tests-playwright/accessibility.spec.js`) checks
what a static/computed analysis can catch: missing accessible names, invalid
ARIA relationships, contrast ratios, focus-trap wiring. It cannot tell you
whether the app actually makes sense **navigated by ear** — reading order,
announcement timing, whether an `aria-live` region fires too often or too
quietly, whether focus lands somewhere sensible after an action. That
requires a human running a real screen reader against the real app.

This document is a protocol for the thesis author (or another sighted or
non-sighted tester) to run manually, plus a findings table to fill in as
primary-evidence material for the thesis's accessibility chapter. It is not
something that can be executed by an automated agent — a screen reader
walkthrough requires listening to and judging spoken output.

## Setup

Run the full protocol twice, once per platform pairing (they surface
different issues — NVDA/Firefox is stricter about live-region timing;
VoiceOver/Safari is stricter about heading/landmark navigation):

| Platform | Screen reader             | Browser | Notes                                                                                  |
| -------- | ------------------------- | ------- | -------------------------------------------------------------------------------------- |
| Windows  | NVDA (free, nvaccess.org) | Firefox | Use browse mode (default) and focus mode (forced automatically on form fields/dialogs) |
| macOS    | VoiceOver (Cmd+F5)        | Safari  | Use VO+Right/Left to navigate, VO+Space to activate                                    |

Start the dev server (`npm run dev` in `clearspeak/`) and open
`http://localhost:5173/` with the screen reader already running, so the very
first announcement is captured too.

## Test scenario: one full exercise session

Work through every step below in order. For each step, note what you
**expected** to hear and what you **actually** heard, then rate it using the
severity scale:

- **Blocker** — task cannot be completed non-visually at all.
- **Major** — completable, but confusing, mislabeled, or requires guessing.
- **Minor** — works, but is clunky, verbose, or slightly out of order.
- **Pass** — matches or exceeds expectations.

| #   | Step                                                                                                                                 | What to check                                                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Fresh load, intro screen                                                                                                             | Is the app's purpose announced (heading/landmark)? Is "Study only" vs. the gamified start option distinguishable by label alone?                                                                                                                                       |
| 2   | Toggle 2–3 comfort options (font, spacing, bionic reading) on the intro screen                                                       | Does each toggle announce its new state (pressed/checked) immediately, not just visually?                                                                                                                                                                              |
| 3   | Start the app, land on a pillar (Literacy)                                                                                           | Is the sidebar nav's current pillar announced as selected (`aria-current` or similar)? Does focus move to the exercise content, or is it left on the button that was just clicked?                                                                                     |
| 4   | Answer 2–3 exercises correctly                                                                                                       | Is the success feedback (`role="status"`/`aria-live="polite"` streak/success message in `App.jsx`) announced without needing to manually navigate to it? Does it interrupt whatever you were doing, or wait politely?                                                  |
| 5   | Answer one exercise incorrectly                                                                                                      | Same check for the error feedback (`role="alert"`/`aria-live="assertive"` in `ExerciseContainer.jsx`) — assertive regions should interrupt; confirm it actually does, and isn't read twice.                                                                            |
| 6   | Keep going until the Cognitive Energy indicator changes state (or inspect `CognitiveEnergyIndicator.jsx`'s `role="status"` directly) | Is the energy-level change announced, and is the wording meaningful out of context ("Energia Poznawcza: red" — does "red" alone make sense read aloud, or does it need a text label)?                                                                                  |
| 7   | Let the break-reminder dialog appear (or trigger via several wrong answers)                                                          | Does focus move into the dialog automatically? Is the dialog's purpose clear from the first thing announced? Does Escape close it and return focus to where you were?                                                                                                  |
| 8   | Open Settings (`#/settings`)                                                                                                         | Are the tabs (`role="tablist"`) announced with their count/position ("tab 1 of 4")? Does arrow-key navigation between tabs work, or only Tab? Is the active tab's panel announced when it changes?                                                                     |
| 9   | Open Profile (`#/profile`)                                                                                                           | Is the exported-data / stats content structured with headings, or read as one undifferentiated block?                                                                                                                                                                  |
| 10  | Reach 10 points to trigger the Feedback (NASA-TLX/SUS) survey                                                                        | Is the dialog's title announced on open (`aria-labelledby="survey-title"`)? Are the SUS radio groups' group labels read before each set of 5 options, or only the individual option numbers ("1 of 5") with no context?                                                |
| 11  | Fill in and submit the survey                                                                                                        | Is the submit result (success/error) announced (`aria-live`/`role="alert"`)?                                                                                                                                                                                           |
| 12  | Exit back to the sidebar, visit the Garden view (if gamified mode is on)                                                             | Is the `aria-live="polite"` region in `VirtualGarden.jsx` announcing state changes at a reasonable pace, or is it noisy?                                                                                                                                               |
| 13  | Throughout — general                                                                                                                 | Does every icon-only button (🔊, 🎤, 🛑) have a spoken label distinct from its neighbors? Does the reading ruler / bionic reading toggle change anything a screen reader user would notice (it shouldn't need to — confirm it doesn't add noise for non-visual users)? |

## Findings table (fill in per run)

| #   | Step | Expected | Observed | Severity | Notes / fix needed |
| --- | ---- | -------- | -------- | -------- | ------------------ |
| 1   |      |          |          |          |                    |
| 2   |      |          |          |          |                    |
| 3   |      |          |          |          |                    |
| ... |      |          |          |          |                    |

## Reporting

For the thesis, summarize as: total steps run, pass/minor/major/blocker
counts per platform, and 2–3 representative quotes of confusing announcements
(if any) to illustrate concretely what a non-visual user would have
experienced. Cross-reference any blocker/major finding with the
corresponding axe-core result (or lack thereof) to make the point that
automated and manual testing catch different things.
