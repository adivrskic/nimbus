import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, ArrowUp, Zap } from "lucide-react";
import { EXAMPLE_PROMPTS } from "../configs";
import { track } from "../lib/analytics";
import "./SearchBar.scss";

function SearchBar({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isGenerating = false,
  placeholder = "Describe the website you want to generate...",
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = parseInt(
      getComputedStyle(textarea).getPropertyValue("max-height")
    );

    if (scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "scroll";
    } else {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowExamples(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled || isGenerating) return;
    track("generate-submit", { prompt_length: value.length });
    onSubmit(value.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      setShowExamples(false);
      textareaRef.current?.blur();
    }
  };

  const handleExampleClick = (example) => {
    track("example-prompt-click", { example });
    onChange(example);
    setShowExamples(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!value.trim()) {
      setShowExamples(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowExamples(false), 200);
  };

  const canSubmit = value.trim() && !disabled && !isGenerating;

  return (
    <div ref={containerRef} className="search-bar">
      <form onSubmit={handleSubmit} className="search-bar__form">
        <div
          className={`search-bar__input-wrapper ${
            isFocused ? "search-bar__input-wrapper--focused" : ""
          } ${isGenerating ? "search-bar__input-wrapper--generating" : ""}`}
        >
          <div className="search-bar__icon">
            {isGenerating ? (
              <Zap size={20} className="search-bar__generating-icon" />
            ) : (
              <Sparkles size={20} />
            )}
          </div>
          <label htmlFor="search-input" className="search-bar__label">
            Website description
          </label>
          <textarea
            id="search-input"
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="search-bar__input"
            rows="1"
            disabled={disabled || isGenerating}
            spellCheck="true"
            autoComplete="off"
            aria-label="Describe the website you want to generate"
          />
          <button
            type="submit"
            className={`search-bar__submit ${
              canSubmit ? "search-bar__submit--active" : ""
            }`}
            disabled={!canSubmit}
            aria-label="Generate website"
          >
            {isGenerating ? (
              <div className="search-bar__spinner" />
            ) : (
              <ArrowUp size={16} />
            )}
          </button>
        </div>
      </form>

      {showExamples && (
        <div className="search-bar__examples">
          <div className="search-bar__examples-header">
            <span>Try an example</span>
          </div>
          <div className="search-bar__examples-list">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                type="button"
                className="search-bar__example"
                onClick={() => handleExampleClick(example)}
              >
                <Sparkles size={14} />
                <span>{example}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;