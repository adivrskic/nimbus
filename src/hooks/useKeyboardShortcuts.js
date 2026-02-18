import { useEffect, useCallback } from "react";

export function useKeyboardShortcuts(shortcuts, options = {}) {
  const { enabled = true, ignoreInputs = ["INPUT", "TEXTAREA"] } = options;

  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;

      if (ignoreInputs.includes(document.activeElement?.tagName)) {
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

export function useEscapeKey(onEscape, enabled = true) {
  useKeyboardShortcuts(
    {
      Escape: onEscape,
    },
    { enabled }
  );
}

export default useKeyboardShortcuts;
