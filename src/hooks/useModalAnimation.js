import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to handle modal open/close animations properly.
 * This ensures the modal stays in the DOM during the exit animation.
 *
 * @param {boolean} isOpen - Whether the modal should be open
 * @param {number} duration - Animation duration in ms (default 300)
 * @returns {object} - { shouldRender, isAnimating, isVisible }
 */
export function useModalAnimation(isOpen, duration = 300) {
  // Whether the modal should be rendered in DOM
  const [shouldRender, setShouldRender] = useState(isOpen);
  // Whether the modal is in visible state (for CSS classes)
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isOpen) {
      // Opening: render immediately, then set visible after a frame
      setShouldRender(true);
      // Use requestAnimationFrame to ensure the element is in DOM before adding visible class
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      // Closing: set invisible first, then remove from DOM after animation
      setIsVisible(false);
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen, duration]);

  return {
    shouldRender,
    isVisible,
    isAnimating: shouldRender && !isVisible,
  };
}

export default useModalAnimation;
