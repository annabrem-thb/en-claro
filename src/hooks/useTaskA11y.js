import { useId } from 'react';

// Stable ids that tie an exercise's answer controls to its task text:
// spread `groupProps` on the element wrapping the options and give the
// heading `headingId`. With `detail: true` the task text is a separate
// element from the heading (e.g. a sentence with a gap): give it `detailId`,
// and the group is then named by both.
export function useTaskA11y({ detail = false } = {}) {
  const headingId = useId();
  const detailId = useId();
  const groupProps = {
    role: 'group',
    'aria-labelledby': detail ? `${headingId} ${detailId}` : headingId,
  };
  return { headingId, detailId, groupProps };
}
