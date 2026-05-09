import { useEffect } from 'react';

/**
 * Advanced ContentProtection component
 * Prevents: copy, paste, cut, right-click, text selection,
 * keyboard shortcuts (Ctrl+C, Ctrl+Shift+I, F12, etc.),
 * and drag-and-drop.
 */
export function ContentProtection() {
  useEffect(() => {
    // 1. Defeat Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Defeat Copy/Paste
    const handleCopyCutPaste = (e: ClipboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return true; 
      }
      e.preventDefault();
      
      // Clear clipboard to punish the copy attempt
      navigator.clipboard?.writeText('').catch(() => {});
      return false;
    };

    // 3. Defeat Dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 4. Defeat Keyboard Shortcuts (F12, Ctrl+Shift+I, etc)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow normal typing in input fields
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return true;
      }

      const isDevToolsCombo = 
        (e.key === 'F12') || // F12
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) || // Ctrl+Shift+I/J/C
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) || // Cmd+Alt+I (Mac)
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.key === 'P' || e.key === 'p')) || // Ctrl+U/S/P
        (e.metaKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.key === 'P' || e.key === 'p'));   // Cmd+U/S/P

      if (isDevToolsCombo) {
        e.preventDefault();
        return false;
      }
    };

    // 5. Anti-Debugging / Anti-Devtools Interval loop (A nasty trick that pauses the debugger if devtools is open)
    const antiDebugLoop = setInterval(() => {
      const isWindowOrWorker = typeof window !== 'undefined';
      if (isWindowOrWorker) {
          (function() {
              try {
                  const x = new Function("debugger;");
                  x();
              } catch(e) {}
          })();
      }
    }, 500);

    // Register all brutal protections
    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('copy', handleCopyCutPaste, { capture: true });
    document.addEventListener('cut', handleCopyCutPaste, { capture: true });
    document.addEventListener('paste', handleCopyCutPaste, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    // Hardcore text selection prevention via CSS injection
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -khtml-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      input, textarea {
        -webkit-user-select: auto !important;
        -khtml-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
      }
      img {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(antiDebugLoop);
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      document.removeEventListener('copy', handleCopyCutPaste, { capture: true });
      document.removeEventListener('cut', handleCopyCutPaste, { capture: true });
      document.removeEventListener('paste', handleCopyCutPaste, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      if (document.head.contains(style)) {
          document.head.removeChild(style);
      }
    };
  }, []);

  return null;
}
