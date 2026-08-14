// Shared by useExerciseVoice.jsx (decides which engine startListening uses)
// and VoiceFallbackBanner.jsx (decides whether to tell the user up front
// that this browser needs a one-time download) — kept in one place so both
// stay in sync on what "this browser can do voice input" actually means.

// Only Chromium browsers implement this — everywhere else (Firefox, Safari,
// ...) falls back to the local-Whisper engine (useLocalWhisper.js). Read
// live rather than memoized: it reflects the browser's own capabilities,
// which don't change over a page's lifetime.
export function hasNativeSpeechRecognition() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// getUserMedia + AudioContext are what useLocalWhisper actually needs to
// capture audio at all — without both, there's no fallback to offer either,
// so the mic stays a real dead end (same 'unsupported' messaging as today)
// rather than silently trying and failing partway through.
export function hasLocalFallbackSupport() {
  return !!(
    navigator.mediaDevices?.getUserMedia &&
    (window.AudioContext || window.webkitAudioContext)
  );
}
