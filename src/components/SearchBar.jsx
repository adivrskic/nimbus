// components/Home/SearchBar/SearchBar.jsx - Main search input component
import { forwardRef, useRef, useCallback, useMemo } from "react";
import { Coins, Settings, Sparkles, HelpCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import "./SearchBar.scss";

const MIN_CHARS = 20;
const MAX_CHARS = 500;

const SearchBar = forwardRef(
  (
    {
      value,
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
      placeholder,
      typewriterText,
      showTypewriter,
      isExpanded,
      isGenerating,
      tokenCost,
      showTokenOverlay,
      onTokenClick,
      showOptions,
      onOptionsClick,
      onHelpClick,
      onGenerate,
      activeCategories = [],
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const hasActiveOptions = activeCategories.length > 0;
    const preventBlurRef = useRef(false);

    const showExpandedState = isExpanded && !isGenerating;

    const charCount = value.length;
    const isUnderMin = charCount > 0 && charCount < MIN_CHARS;
    const isOverMax = charCount > MAX_CHARS;
    const isValidLength = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
    const charsRemaining = MIN_CHARS - charCount;
    const charsOver = charCount - MAX_CHARS;

    const canSubmit = value.trim().length > 0 && isValidLength && !isGenerating;

    const showCharCounter = useMemo(() => {
      if (showExpandedState) return true;
      if (charCount > 0 && charCount < MIN_CHARS + 10) return true;
      if (charCount > MAX_CHARS - 100) return true;
      return false;
    }, [showExpandedState, charCount]);

    const handleBlur = useCallback(
      (e) => {
        if (preventBlurRef.current) {
          preventBlurRef.current = false;
          return;
        }
        if (containerRef.current?.contains(e.relatedTarget)) {
          return;
        }
        onBlur?.(e);
      },
      [onBlur]
    );

    const handleButtonMouseDown = useCallback((e) => {
      preventBlurRef.current = true;
    }, []);

    const handleChange = useCallback(
      (e) => {
        onChange?.(e);
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          if (!canSubmit) {
            e.preventDefault();
            return;
          }
        }
        onKeyDown?.(e);
      },
      [onKeyDown, canSubmit]
    );

    return (
      <div
        ref={containerRef}
        className={`search-bar ${
          showExpandedState ? "search-bar--expanded" : ""
        } ${isGenerating ? "search-bar--generating" : ""}`}
      >
        <div className="search-bar__input-wrapper">
          <textarea
            ref={ref}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={handleBlur}
            placeholder={showTypewriter ? "" : placeholder}
            className={`search-bar__input ${
              isOverMax ? "search-bar__input--error" : ""
            }`}
            rows={1}
          />
          {showTypewriter && (
            <div className="search-bar__typewriter-overlay">
              <span className="search-bar__typewriter-text">
                {typewriterText}
                <span className="search-bar__typewriter-cursor">|</span>
              </span>
            </div>
          )}

          {!showExpandedState && !showTypewriter && value && (
            <div className="search-bar__truncate-overlay">
              <span className="search-bar__truncate-text">{value}</span>
            </div>
          )}

          {showCharCounter && charCount > 0 && (
            <div
              className={`search-bar__char-counter ${
                isUnderMin ? "search-bar__char-counter--warning" : ""
              } ${isOverMax ? "search-bar__char-counter--error" : ""} ${
                isValidLength ? "search-bar__char-counter--valid" : ""
              }`}
            >
              {isUnderMin && (
                <span className="search-bar__char-message">
                  {charsRemaining} more character
                  {charsRemaining !== 1 ? "s" : ""} needed
                </span>
              )}
              {isOverMax && (
                <span className="search-bar__char-message">
                  {charsOver} character{charsOver !== 1 ? "s" : ""} over limit
                </span>
              )}
              <span className="search-bar__char-count">
                {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="search-bar__right">
          {(value.trim() || isExpanded) && (
            <button
              className={`search-bar__token-btn ${
                showTokenOverlay ? "active" : ""
              }`}
              onClick={onTokenClick}
              onMouseDown={handleButtonMouseDown}
            >
              <Coins size={14} />
              <span className="search-bar__btn-text">-{tokenCost}</span>
            </button>
          )}

          <button
            className={`search-bar__help-btn ${
              showExpandedState ? "search-bar__help-btn--expanded" : ""
            }`}
            onClick={onHelpClick}
            onMouseDown={handleButtonMouseDown}
            title="Get Help"
          >
            <HelpCircle size={18} />
            <span className="search-bar__btn-text">Help</span>
          </button>

          <button
            className={`search-bar__gear-btn ${showOptions ? "active" : ""} ${
              showExpandedState ? "search-bar__gear-btn--expanded" : ""
            }`}
            onClick={onOptionsClick}
            onMouseDown={handleButtonMouseDown}
          >
            <Settings size={18} />
            <span className="search-bar__btn-text">
              Customize{hasActiveOptions ? ` (${activeCategories.length})` : ""}
            </span>
          </button>

          <button
            className={`search-bar__submit ${
              showExpandedState ? "search-bar__submit--expanded" : ""
            }`}
            onClick={onGenerate}
            onMouseDown={handleButtonMouseDown}
            disabled={!canSubmit}
            title={
              isUnderMin
                ? `Need at least ${MIN_CHARS} characters`
                : isOverMax
                ? `Exceeds ${MAX_CHARS} character limit`
                : ""
            }
          >
            {isGenerating ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <Sparkles size={16} />
            )}
            <span className="search-bar__btn-text">
              {isGenerating ? "Generating" : "Generate"}
            </span>
          </button>
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { MIN_CHARS, MAX_CHARS };
export default SearchBar;
