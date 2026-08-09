import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './components/App.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Dynamic import (not a static one gated by an `if`) so Vite's tree-shaking
// drops this module — and its axe-core dependency — from the production
// bundle entirely, rather than merely skipping it at runtime. `import.meta.env.DEV`
// is statically replaced with `false` in production builds, and Vite/Rollup
// eliminate the resulting dead `if` branch, including the dynamic import
// inside it.
if (import.meta.env.DEV) {
  import('./utils/devAccessibilityAuditor.js').then(
    ({ startDevAccessibilityAuditor }) => startDevAccessibilityAuditor(),
  );
}
