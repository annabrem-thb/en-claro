// Mobile browsers only let AudioContext.resume() and the first
// speechSynthesis.speak() call actually produce sound when they're
// triggered directly, synchronously, inside a real user-gesture event
// handler (tap/click/key press). Every exercise in this app times its tone
// playback and narration through setSafeTimeout — a plain `setTimeout` under
// the hood — so even a `playTone()` call fired "from" a button's onClick
// arrives too late once it's gone through that deferral, and on strict
// mobile engines it's silently dropped rather than played. Melodies and
// rhythm patterns that auto-play the instant an exercise mounts are the
// worst case: there's been no gesture at all yet, so they're silent every
// time.
//
// The fix is to unlock both audio APIs exactly once, here, on the very
// first tap/click/key press anywhere in the app (installed in main.jsx,
// before anything else can intercept it) — once genuinely unlocked by a
// direct gesture, every later *deferred* call keeps working normally for
// the rest of the session, which is how this app actually plays sound.

let sharedAudioCtx = null;

export function getSharedAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedAudioCtx) sharedAudioCtx = new AudioContextClass();
  return sharedAudioCtx;
}

let unlocked = false;

export function installAudioUnlock() {
  if (typeof document === 'undefined') return;

  const unlock = () => {
    if (unlocked) return;
    unlocked = true;

    const ctx = getSharedAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
      const warmUp = new SpeechSynthesisUtterance(' ');
      warmUp.volume = 0;
      window.speechSynthesis.speak(warmUp);
    }

    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('keydown', unlock);
  };

  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('touchstart', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
}
