# Bundle size: code-splitting Settings/Survey/Garden

## Before

Every top-level screen (Settings, Profile, Survey, Garden, and every
exercise component) was statically imported into the same chunk as the app
shell, so `recharts` (only used by the now-removed Profile's NASA-TLX radar
chart) and `lottie-react` (only used by the Garden's visitor animations)
loaded for every user on first paint, regardless of whether they ever opened
those screens.

```
dist/assets/index-*.js   1,289.20 kB │ gzip: 351.07 kB
```

## Change

`SettingsModal`, `ProfileModal`, `VirtualGarden`, and `SurveyComponent` were
loaded via `React.lazy()` + `Suspense` in `App.jsx`, each showing the
existing `SkeletonLoader` while its chunk downloads (these were exactly the
screens the app renders as full-screen replacements or a modal, not
something composited alongside other content — so a brief skeleton in place
of the whole screen was the correct fallback, not a partial flash of missing
content).

The Profile screen (and `recharts`, its only consumer) was later removed
from the app entirely, rather than just kept lazy — see the "After Profile
removal" numbers below. `SettingsModal`, `VirtualGarden`, and
`SurveyComponent` are still lazy-loaded the same way.

## After (original code-splitting change)

```
dist/assets/index-*.js            467.70 kB │ gzip: 143.28 kB   (initial bundle)
dist/assets/ProfileModal-*.js     326.23 kB │ gzip:  96.33 kB   (recharts, on-demand)
dist/assets/VirtualGarden-*.js    328.73 kB │ gzip:  85.06 kB   (lottie-react, on-demand)
dist/assets/SettingsModal-*.js      9.42 kB │ gzip:   2.82 kB
dist/assets/SurveyComponent-*.js    7.33 kB │ gzip:   2.61 kB
```

**Initial JS payload: −821.5 kB raw (−63.7%), −207.8 kB gzip (−59.2%).**

`recharts` and `lottie-react` — the two heaviest dependencies in the whole
app — no longer shipped to a user who only ever did exercises.

## After Profile removal

```
dist/assets/index-*.js            469.76 kB │ gzip: 145.30 kB   (initial bundle)
dist/assets/VirtualGarden-*.js    328.73 kB │ gzip:  85.06 kB   (lottie-react, on-demand)
dist/assets/SettingsModal-*.js     10.76 kB │ gzip:   3.11 kB
dist/assets/SurveyComponent-*.js    7.41 kB │ gzip:   2.66 kB
```

No `ProfileModal-*.js` chunk at all anymore — `recharts` (326.23 kB /
96.33 kB gzip) is gone from the dependency tree entirely, not just deferred,
since Profile was its only consumer (removed from `package.json` too).

## Reproducing this

```bash
npm run build            # current bundle, see the per-chunk sizes in the output
npm run build:analyze    # same build + dist/stats.html (rollup-plugin-visualizer treemap)
```

`build:analyze` sets `ANALYZE=true`, which is the only thing gating the
visualizer plugin in `vite.config.js` — it's an inspection tool, not
something every CI build should pay to generate.
