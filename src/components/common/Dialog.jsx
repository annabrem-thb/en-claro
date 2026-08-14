import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from '@floating-ui/react';

// Shared accessible modal wrapper for every dialog-role overlay in the app
// (Settings, Profile, Feedback, the cognitive-break prompt, the focus
// exercise view). Centralizing this in one place, on top of the
// @floating-ui/react dependency already used for the sidebar tooltip, gives
// every dialog three things none of them had before:
//   - a real focus trap while open (Tab can no longer escape into the page
//     behind the dialog),
//   - focus moving into the dialog on open and back to the triggering
//     element on close,
//   - Escape-to-close and click-outside-to-close, via useDismiss.
// `overlayClassName` styles the full-viewport backdrop (background, blur,
// alignment); `className` styles the dialog card itself. Both are passed
// straight through so each modal keeps its existing look.
export default function Dialog({
  open,
  onClose,
  labelledBy,
  label,
  overlayClassName,
  className,
  style,
  initialFocus,
  children,
}) {
  const { refs, context } = useFloating({
    open,
    onOpenChange: (nextOpen) => {
      if (!nextOpen) onClose();
    },
  });

  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!open) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay lockScroll className={overlayClassName}>
        <FloatingFocusManager context={context} initialFocus={initialFocus}>
          <div
            // `refs.setFloating` is @floating-ui/react's own documented
            // pattern (https://floating-ui.com/docs/react#refs) — a stable
            // ref *callback* function returned by useFloating(), not a
            // `.current` read. The new react-hooks/refs rule can't tell
            // `refs.setFloating` (a function) apart from `someRef.current`
            // (a mutable field read) from the property-access shape alone.
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-label={label}
            className={className}
            style={style}
            {...getFloatingProps()}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
