import { useState } from 'react';

import { STUDY_EXERCISE_PILLARS } from '../data/exerciseTypes.js';
import { useSafeTimeouts } from '../hooks/useSafeTimeouts.js';
import { useUserSettingsContext } from '../hooks/useUserSettingsContext.js';

import BionicText from './common/BionicText.jsx';

// One switch row for a single exercise type. Visually mirrors SettingsModal's
// SettingToggle (same track/thumb shape) so this tab feels like the rest of
// Settings rather than a bolted-on module — but unlike SettingToggle, the
// clickable <button> itself is a square hit area (56x56 in Motor Mode), with
// the elongated track/thumb rendered as a purely decorative nested <span>.
// A switch is inherently wider than tall, so simply resizing the visible
// track to "56 tall" would look wrong and still leave the *actual* tappable
// box short of 56 in one dimension — padding the real button out to a
// square around it is the standard fix (Material Design, Apple HIG use the
// same pattern for compact controls).
function ExerciseSwitchRow({
  label,
  checked,
  onChange,
  bionic,
  isHighContrast,
  bigTargets,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl p-2 transition-colors ${checked ? (isHighContrast ? 'bg-white/10' : 'bg-slate-50') : ''}`}
    >
      <span
        className={`min-w-0 flex-1 text-sm font-medium ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
      >
        <BionicText text={label} enabled={bionic} />
      </span>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`flex shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 ${
          bigTargets ? 'h-14 w-14' : 'h-9 w-9'
        }`}
      >
        <span
          aria-hidden="true"
          className={`relative inline-block shrink-0 rounded-full transition-colors ${
            bigTargets ? 'h-8 w-14' : 'h-6 w-11'
          } ${checked ? 'bg-emerald-500' : isHighContrast ? 'bg-white/30' : 'bg-slate-200'}`}
        >
          <span
            className={`absolute top-1/2 inline-block -translate-y-1/2 transform rounded-full bg-white transition-transform ${
              bigTargets ? 'h-6 w-6' : 'h-4 w-4'
            } ${checked ? (bigTargets ? 'translate-x-7' : 'translate-x-6') : 'translate-x-1'}`}
          />
        </span>
      </button>
    </div>
  );
}

export default function ExerciseToggleManager({
  t,
  speak,
  bigTargets = false,
}) {
  const { settings, updateSetting } = useUserSettingsContext();
  const {
    bionicReading,
    contrast: isHighContrast,
    activeExercises = {},
  } = settings;
  const { setSafeTimeout, clearAllTimeouts } = useSafeTimeouts();
  const [warning, setWarning] = useState(null);

  const isActive = (key) => activeExercises[key] !== false;

  const showWarning = (message) => {
    clearAllTimeouts();
    setWarning(message);
    setSafeTimeout(() => setWarning(null), 4000);
  };

  // Guards the "at least one active exercise per pillar" rule: a pillar
  // whose task pool goes empty has nothing left to render (goNext/goPrev in
  // useExerciseSession.js both no-op on an empty pool), effectively
  // breaking that pillar's tab rather than degrading gracefully — unlike
  // the difficulty filter, there's no fallback tier to fall back to once
  // every *type* in a pillar is off.
  const applyChange = (pillarKeys, nextMapForPillar) => {
    // Must check against the *merged* state, not just the proposed partial
    // diff: `nextMapForPillar` usually only contains the one key being
    // toggled, so checking it in isolation treats every other key in the
    // pillar as "still active" even when it was already off — silently
    // defeating this whole safety check for anyone who already had more
    // than one exercise disabled.
    const merged = { ...activeExercises, ...nextMapForPillar };
    const remainingActive = pillarKeys.filter((k) => merged[k] !== false);
    if (remainingActive.length === 0) {
      showWarning(
        t(
          'exerciseManager.lastActiveWarning',
          'At least one exercise must stay active in each pillar.',
        ),
      );
      return false;
    }
    updateSetting('activeExercises', merged);
    return true;
  };

  const toggleOne = (pillarKeys, key, label) => {
    const next = !isActive(key);
    const applied = applyChange(pillarKeys, { [key]: next });
    // Only announce when the toggle actually took effect — not when the
    // "last active exercise in this pillar" guard above blocked it, since
    // the switch's on-screen/aria-checked state didn't actually change.
    if (applied && settings.voiceAssistant && speak) {
      speak(`${label}, ${next ? t('optionOn') : t('optionOff')}`);
    }
  };

  const setAll = (pillarKeys, value) => {
    if (!value) {
      // "Deselect all" would always trip the safety fallback (0 remaining),
      // so it intentionally keeps the first exercise in the pillar active
      // instead of being a no-op — still lets a user narrow a pillar down
      // to a single type in one tap, which is the realistic use case.
      const nextMap = Object.fromEntries(
        pillarKeys.map((k, i) => [k, i === 0]),
      );
      applyChange(pillarKeys, nextMap);
      showWarning(
        t(
          'exerciseManager.lastActiveWarning',
          'At least one exercise must stay active in each pillar.',
        ),
      );
      return;
    }
    applyChange(
      pillarKeys,
      Object.fromEntries(pillarKeys.map((k) => [k, true])),
    );
  };

  return (
    <div className="space-y-6">
      <p
        className={`px-1 text-xs ${isHighContrast ? 'text-white/60' : 'text-slate-500'}`}
      >
        <BionicText
          text={t(
            'exerciseManager.intro',
            'Turn off exercise types you find redundant or have already mastered — they will no longer be selected for this pillar.',
          )}
          enabled={bionicReading}
        />
      </p>

      {Object.entries(STUDY_EXERCISE_PILLARS).map(
        ([pillarKey, exerciseKeys], index) => (
          <section
            key={pillarKey}
            aria-labelledby={`exmgr-pillar-${pillarKey}`}
            className={
              index > 0
                ? `border-t pt-6 ${isHighContrast ? 'border-white/20' : 'border-slate-200'}`
                : ''
            }
          >
            <div className="mb-2 flex items-center justify-between gap-2 px-1">
              <h3
                id={`exmgr-pillar-${pillarKey}`}
                className={`text-sm font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
              >
                <BionicText
                  text={t(`pillars.${pillarKey}`, pillarKey)}
                  enabled={bionicReading}
                />
              </h3>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => setAll(exerciseKeys, true)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${isHighContrast ? 'text-white/70 hover:bg-white/10' : 'text-indigo-600 hover:bg-indigo-50'}`}
                >
                  <BionicText
                    text={t('exerciseManager.selectAll', 'Select all')}
                    enabled={bionicReading}
                  />
                </button>
                <button
                  onClick={() => setAll(exerciseKeys, false)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${isHighContrast ? 'text-white/70 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <BionicText
                    text={t('exerciseManager.deselectAll', 'Deselect all')}
                    enabled={bionicReading}
                  />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {exerciseKeys.map((key) => {
                const label = t(`exerciseManager.types.${key}`, key);
                return (
                  <ExerciseSwitchRow
                    key={key}
                    label={label}
                    checked={isActive(key)}
                    onChange={() => toggleOne(exerciseKeys, key, label)}
                    bionic={bionicReading}
                    isHighContrast={isHighContrast}
                    bigTargets={bigTargets}
                  />
                );
              })}
            </div>
          </section>
        ),
      )}

      {warning && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-xl border p-3 text-center text-xs font-medium ${isHighContrast ? 'border-white/40 bg-black text-white' : 'border-amber-200 bg-amber-50 text-amber-800'}`}
        >
          {warning}
        </p>
      )}
    </div>
  );
}
