// hooks/useGenerationTimer.js - Timer for tracking generation time
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook for tracking generation time with estimated remaining time
 * @param {boolean} isGenerating - Whether generation is in progress
 * @param {number} estimatedTime - Estimated total time in seconds (default: 20)
 * @returns {Object} { elapsedTime, getEstimatedTimeText, reset }
 */
export function useGenerationTimer(isGenerating, estimatedTime = 20) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isGenerating) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGenerating]);

  const getEstimatedTimeText = useCallback(() => {
    const remaining = Math.max(0, estimatedTime - elapsedTime);
    if (elapsedTime < 5) return "Initializing...";
    if (remaining > 0) return `~${remaining}s remaining`;
    return "Almost done...";
  }, [elapsedTime, estimatedTime]);

  const reset = useCallback(() => {
    setElapsedTime(0);
  }, []);

  return {
    elapsedTime,
    getEstimatedTimeText,
    reset,
  };
}

export default useGenerationTimer;
