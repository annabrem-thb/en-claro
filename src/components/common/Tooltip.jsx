import { useState } from 'react';

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';

export default function Tooltip({
  children,
  content,
  placement = 'top',
  wrapperClass = '',
  isHighContrast = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ fallbackAxisSideDirection: 'start' }),
      shift({ padding: 8 }),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      {}
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`${wrapperClass || 'inline-flex'} cursor-help`}
      >
        {children}
      </div>

      {}
      {isOpen && (
        <FloatingPortal>
          <div
            // See Dialog.jsx's identical comment: refs.setFloating is
            // @floating-ui/react's documented ref-callback, not a `.current`
            // read — a false positive of the react-hooks/refs heuristic.
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={`animate-in fade-in pointer-events-none z-100 max-w-xs rounded-xl px-3 py-2 text-xs font-medium wrap-break-word hyphens-auto shadow-lg transition-opacity duration-200 ${
              isHighContrast
                ? 'border border-black bg-white text-black'
                : 'bg-slate-800 text-white'
            }`}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
