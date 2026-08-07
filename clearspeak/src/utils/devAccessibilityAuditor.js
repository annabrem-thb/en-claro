// Development-only runtime accessibility auditor.
//
// `@axe-core/react` (the "official" React integration for this) explicitly
// does not support React 18+ (see its own README: "This package does not
// support React 18 and above"), and this app runs React 19 — wiring it in
// would either no-op silently or throw, not just be a performance
// footgun. This uses the underlying `axe-core` engine directly instead,
// driven by a debounced MutationObserver on the DOM (framework-agnostic,
// so it has no React-version coupling at all) to get the same end result:
// automatic accessibility violations logged to the browser console as the
// app renders, during development only.
export function startDevAccessibilityAuditor({ debounceMs = 1000 } = {}) {
  if (import.meta.env.PROD) return;

  let axeModulePromise = null;
  let debounceTimer = null;
  let isRunning = false;

  const runAudit = async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      if (!axeModulePromise) axeModulePromise = import('axe-core');
      const axe = (await axeModulePromise).default ?? (await axeModulePromise);
      const results = await axe.run(document, {
        // Mirrors the tags already used by the Playwright E2E suite
        // (tests-playwright/accessibility.spec.js) so dev-console findings
        // and CI findings are directly comparable.
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });
      if (results.violations.length === 0) return;
      console.groupCollapsed(
        `%caccessibility: ${results.violations.length} issue(s) found`,
        'color: #b91c1c; font-weight: bold;',
      );
      for (const violation of results.violations) {
        console.warn(
          `[${violation.impact}] ${violation.id}: ${violation.help}\n${violation.helpUrl}`,
          violation.nodes.map((n) => n.target.join(' ')),
        );
      }
      console.groupEnd();
    } catch (err) {
      console.error('Dev accessibility auditor failed to run:', err);
    } finally {
      isRunning = false;
    }
  };

  const scheduleAudit = () => {
    clearTimeout(debounceTimer);
    // Debounced so a single burst of React re-renders (many DOM mutations
    // in quick succession) triggers exactly one audit pass afterward,
    // instead of one per mutation batch.
    debounceTimer = setTimeout(runAudit, debounceMs);
  };

  const observer = new MutationObserver(scheduleAudit);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  scheduleAudit(); // initial pass once the app shell has mounted
  return () => {
    observer.disconnect();
    clearTimeout(debounceTimer);
  };
}
