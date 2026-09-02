// Every exercise renders its read-aloud/voice-input controls in a small
// wrapper the same way — this just centralizes that wrapper (previously
// hand-rolled per exercise component, with className drift between them)
// so all of them share one definition.
export default function ExerciseControlsRow({
  className = 'mb-2 flex shrink-0 gap-4 sm:mb-4',
  children,
}) {
  return <div className={className}>{children}</div>;
}
