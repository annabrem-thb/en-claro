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

/**
 * Globalny komponent Tooltip bazujący na Floating UI.
 * Zapewnia 100% responsywności (nigdy nie wychodzi poza ekran)
 * oraz pełną dostępność WCAG (obsługa klawiatury, czytniki ekranu).
 */
export default function Tooltip({ 
  children, 
  content, 
  placement = 'top', 
  wrapperClass = '',
  isHighContrast = false 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    // Automatycznie aktualizuje pozycję podczas scrollowania lub zmiany rozmiaru okna
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8), // Odstęp 8px od elementu
      flip({ fallbackAxisSideDirection: 'start' }), // Odwróć, jeśli brakuje miejsca
      shift({ padding: 8 }), // Przesuń wzdłuż osi, aby nie wyjść poza ekran (padding 8px od krawędzi)
    ],
  });

  // Integracja z obsługą zdarzeń (myszka, klawiatura, dotyk)
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([ hover, focus, dismiss, role ]);

  return (
    <>
      {/* Element wyzwalający Tooltip (np. przycisk, ikona) */}
      <div ref={refs.setReference} {...getReferenceProps()} className={`${wrapperClass || 'inline-flex'} cursor-help`}>
        {children}
      </div>

      {/* Portal renderuje Tooltip na samym końcu tagu <body>, omijając problemy z overflow/z-index */}
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