import { useEffect, useRef } from 'react';

// The heading that names the current task. It is the one place focus lands
// when a task appears (ExerciseContainer is remounted per task), so a screen
// reader announces the task instead of leaving focus on <body>. Answer
// options reference it via aria-labelledby (see useTaskA11y). In zen mode the
// visible heading is hidden, but it stays in the DOM as sr-only so the task
// is still announced.
export default function TaskHeading({
  as: Tag = 'h3',
  id,
  zenMode = false,
  focusOnMount = true,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!focusOnMount) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    // A single focus() in the mount effect can be dropped (seen with Firefox
    // under load) while the task container is still animating in or the
    // previous task's focused element is being torn down. Retry for a few
    // frames, but only while nothing else holds focus (document.body): if a
    // control has deliberately taken it, it must not be stolen back.
    let frames = 0;
    let rafId;
    const tryFocus = () => {
      el.focus({ preventScroll: true });
      if (document.activeElement === el) return;
      const nothingFocused =
        !document.activeElement || document.activeElement === document.body;
      if (nothingFocused && frames++ < 10) {
        rafId = requestAnimationFrame(tryFocus);
      }
    };
    tryFocus();
    return () => cancelAnimationFrame(rafId);
  }, [focusOnMount]);

  return (
    <Tag
      ref={ref}
      id={id}
      tabIndex={-1}
      className={`${zenMode ? 'sr-only' : className} outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
