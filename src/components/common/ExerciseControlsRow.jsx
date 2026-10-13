// Every exercise renders its read-aloud/voice-input controls in a small
// wrapper the same way — this just centralizes that wrapper (previously
// hand-rolled per exercise component, with className drift between them)
// so all of them share one definition.
export default function ExerciseControlsRow({
  className = 'mb-2 flex shrink-0 gap-4 sm:mb-4',
  children,
}) {
  // flex-wrap: at the largest text size the 3rem+ round buttons no longer fit
  // side by side on a 320px screen, so they move to a second line instead of
  // being clipped by the exercise card.
  return (
    <div className={`${className} max-w-full flex-wrap justify-center`}>
      {children}
    </div>
  );
}
