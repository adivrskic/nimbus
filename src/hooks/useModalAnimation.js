import { useState, useEffect, useCallback } from "react";

export function useModalAnimation(
  isOpen,
  onCloseOrDuration,
  durationArg = 300
) {
  const onClose =
    typeof onCloseOrDuration === "function" ? onCloseOrDuration : null;
  const duration =
    typeof onCloseOrDuration === "number" ? onCloseOrDuration : durationArg;

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
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

  const closeModal = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return {
    shouldRender,
    isVisible,
    isAnimating: shouldRender && !isVisible,
    closeModal,
  };
}

export default useModalAnimation;
