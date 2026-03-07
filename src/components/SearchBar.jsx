import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { EXAMPLE_PROMPTS } from "../configs";
import { track } from "../lib/analytics";
import "./SearchBar.scss";

function SearchBar({
  value,
  onChange,
  onGenerate,
  isGenerating = false,
  disabled = false,
  placeholder = "Describe the website you want to build...",
}) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || isGenerating || disabled) return;
    track("generate-submit", { prompt: value.trim() });
    onGenerate();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleExampleClick = (prompt) => {
    track("example-prompt-click", { prompt });
    onChange(prompt);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const canSubmit = value.trim() && !isGenerating && !disabled;

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-bar__form">
        <div
          className={`search-bar__input-wrapper ${
            isFocused ? "search-bar__input-wrapper--focused" : ""
          }`}
        >
          <label htmlFor="website-description" className="sr-only">
            Describe the website you want to build
          </label>
          <textarea
            id="website-description"
            ref={textareaRef}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onInput={adjustHeight}
            className="search-bar__input "
            rows="1"
            disabled={disabled}
            style={{ resize: "none", overflow: "hidden" }}
          />
          <button
            type="submit"
            className={`search-bar__submit ${
              canSubmit ? "search-bar__submit--active" : ""
            }`}
            disabled={!canSubmit}
            aria-label={isGenerating ? "Generating..." : "Generate website"}
          >
            {isGenerating ? (
              <RefreshCw className="search-bar__submit-icon search-bar__submit-icon--spinning" />
            ) : (
              <ArrowRight className="search-bar__submit-icon" />
            )}
          </button>
        </div>
      </form>

      <div className="search-bar__examples">
        <div className="search-bar__examples-label">
          <Sparkles className="search-bar__examples-icon" />
          <span>Try these prompts</span>
        </div>
        <div className="search-bar__examples-grid">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              className="search-bar__example"
              onClick={() => handleExampleClick(prompt)}
              disabled={disabled}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;