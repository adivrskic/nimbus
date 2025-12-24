import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to handle modal open/close animations properly.
 * This ensures the modal stays in the DOM during the exit animation.
 *
 * Supports two calling patterns:
 * 1. useModalAnimation(isOpen, onClose, duration) - with close callback
 * 2. useModalAnimation(isOpen, duration) - just timing, use onClose prop directly
 *
 * @param {boolean} isOpen - Whether the modal should be open
 * @param {function|number} onCloseOrDuration - Either onClose callback or duration in ms
 * @param {number} durationArg - Animation duration in ms (default 300)
 * @returns {object} - { shouldRender, isVisible, isAnimating, closeModal }
 */
export function useModalAnimation(
  isOpen,
  onCloseOrDuration,
  durationArg = 300
) {
  // Handle both calling patterns
  const onClose =
    typeof onCloseOrDuration === "function" ? onCloseOrDuration : null;
  const duration =
    typeof onCloseOrDuration === "number" ? onCloseOrDuration : durationArg;

  // Whether the modal should be rendered in DOM
  const [shouldRender, setShouldRender] = useState(isOpen);
  // Whether the modal is in visible/animated state (for CSS classes)
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

  // Close modal with animation
  const closeModal = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return {
    // Use shouldRender for the early return check (whether to mount the component)
    shouldRender,
    // Use isVisible for CSS classes (whether to apply the visible/active state)
    isVisible,
    // isAnimating is true during mount/unmount transitions
    isAnimating: shouldRender && !isVisible,
    // closeModal function to trigger close (only works if onClose was passed)
    closeModal,
  };
}

export default useModalAnimation;
