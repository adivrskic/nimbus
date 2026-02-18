import { useState, useEffect, useRef, useCallback } from "react";

export function useTypewriter({
  prompts = [],
  enabled = true,
  typingSpeed = 10,
  erasingSpeed = 20,
  pauseDuration = 1000,
}) {
  const [text, setText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef(null);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setText("");
    setPromptIndex(0);
    setCharIndex(0);
    setIsTyping(true);
  }, []);

  useEffect(() => {
    if (!enabled || prompts.length === 0) {
      setText("");
      return;
    }

    const currentPrompt = prompts[promptIndex];

    const typeCharacter = () => {
      if (isTyping) {
        if (charIndex < currentPrompt.length) {
          setText(currentPrompt.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
          timeoutRef.current = setTimeout(
            typeCharacter,
            typingSpeed + Math.random() * 20
          );
        } else {
          timeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            typeCharacter();
          }, pauseDuration);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
          setText(currentPrompt.slice(0, charIndex - 1));
          timeoutRef.current = setTimeout(typeCharacter, erasingSpeed);
        } else {
          timeoutRef.current = setTimeout(() => {
            setPromptIndex((prev) => (prev + 1) % prompts.length);
            setIsTyping(true);
            timeoutRef.current = setTimeout(typeCharacter, pauseDuration);
          }, pauseDuration);
        }
      }
    };

    timeoutRef.current = setTimeout(typeCharacter, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    enabled,
    prompts,
    promptIndex,
    charIndex,
    isTyping,
    typingSpeed,
    erasingSpeed,
    pauseDuration,
  ]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    text,
    isTyping,
    currentIndex: promptIndex,
    reset,
  };
}

export default useTypewriter;
