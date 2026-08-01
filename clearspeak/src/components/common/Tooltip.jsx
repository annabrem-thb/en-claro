import React, { useState } from 'react';
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

export default function Tooltip(
  { 
    children, 
    content, 
    placement = 'top', 
    wrapperClass = '',
    isHighContrast = false 
  }
) {
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

  const { getReferenceProps, getFloatingProps } = useInteractions([ hover, focus, dismiss, role ]);

  return (
    <>
      {}
      <div ref={refs.setReference} {...getReferenceProps()} className={`${wrapperClass || 'inline-flex'} cursor-help`}>
        {children}
      </div>

      {}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={`z-[100] max-w-xs px-3 py-2 text-xs font-medium rounded-xl shadow-lg break-words hyphens-auto transition-opacity animate-in fade-in duration-200 pointer-events-none ${
              isHighContrast ? 'bg-white text-black border border-black' : 'bg-slate-800 text-white'
            }`}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}