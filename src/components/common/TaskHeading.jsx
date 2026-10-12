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
    if (focusOnMount) ref.current?.focus({ preventScroll: true });
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
