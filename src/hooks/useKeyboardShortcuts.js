// hooks/useKeyboardShortcuts.js - Keyboard shortcut handler
import { useEffect, useCallback } from "react";

/**
 * Hook for handling keyboard shortcuts
 * @param {Object} shortcuts - Map of key to handler functions
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether shortcuts are enabled
 * @param {string[]} options.ignoreInputs - Element types to ignore (default: ['INPUT', 'TEXTAREA'])
 */
export function useKeyboardShortcuts(shortcuts, options = {}) {
  const { enabled = true, ignoreInputs = ["INPUT", "TEXTAREA"] } = options;

  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;

      // Ignore if user is typing in an input/textarea
      if (ignoreInputs.includes(document.activeElement?.tagName)) {
        // Only allow Escape key when in inputs
        if (e.key !== "Escape") return;
      }

      const handler = shortcuts[e.key];
      if (handler) {
        handler(e);
      }
    },
    [shortcuts, enabled, ignoreInputs]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Hook specifically for Escape key handling
 * @param {Function} onEscape - Handler to call when Escape is pressed
 * @param {boolean} enabled - Whether the handler is enabled
 */
export function useEscapeKey(onEscape, enabled = true) {
  useKeyboardShortcuts(
    {
      Escape: onEscape,
    },
    { enabled }
  );
}

export default useKeyboardShortcuts;
