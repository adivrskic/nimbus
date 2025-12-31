// components/Home/SearchBar/SearchBar.jsx - Main search input component
import { forwardRef, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Settings,
  Sparkles,
  HelpCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import "./SearchBar.scss";

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
      // New props for pills
      activeCategories = [],
      onPillClick,
      onResetPill,
      hasMinimizedPreview = false, // New prop
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const hasActiveOptions = activeCategories.length > 0;
    const preventBlurRef = useRef(false);

    // Determine if we should show expanded state (not generating and user expanded)
    const showExpandedState = isExpanded && !isGenerating;

    // Handle blur - only minimize if clicking outside the search bar
    const handleBlur = useCallback(
      (e) => {
        // If we're preventing blur (clicking internal button), skip
        if (preventBlurRef.current) {
          preventBlurRef.current = false;
          return;
        }
        // Check if the related target (where focus is going) is within our container
        if (containerRef.current?.contains(e.relatedTarget)) {
          // Clicking within the search bar - don't minimize
          return;
        }
        // Clicking outside - call the original onBlur
        onBlur?.(e);
      },
      [onBlur]
    );

    // Prevent blur when clicking internal buttons
    const handleButtonMouseDown = useCallback((e) => {
      preventBlurRef.current = true;
    }, []);

    return (
      <motion.div
        ref={containerRef}
        className={`search-bar ${
          showExpandedState ? "search-bar--expanded" : ""
        } ${isGenerating ? "search-bar--generating" : ""} ${
          hasMinimizedPreview ? "has-minimized-preview" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="search-bar__input-wrapper">
          <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={handleBlur}
            placeholder={showTypewriter ? "" : placeholder}
            className="search-bar__input"
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

          {/* Expanded Pills - shown inside textarea when expanded */}
          <AnimatePresence>
            {showExpandedState && hasActiveOptions && (
              <motion.div
                className="search-bar__pills-expanded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {activeCategories.map(
                  ({ category, label, value, icon: Icon }) => (
                    <motion.div
                      key={category}
                      className="search-bar__pill"
                      onClick={() => onPillClick?.(category)}
                      onMouseDown={handleButtonMouseDown}
                      role="button"
                      tabIndex={0}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {Icon && <Icon size={12} />}
                      <span className="search-bar__pill-label">{label}:</span>
                      <span className="search-bar__pill-value">{value}</span>
                      <span
                        className="search-bar__pill-remove"
                        role="button"
                        tabIndex={-1}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleButtonMouseDown(e);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onResetPill?.(category);
                        }}
                      >
                        <X size={10} />
                      </span>
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="search-bar__right">
          {/* Collapsed Pills Count - shown when not expanded but has options */}
          <AnimatePresence>
            {!showExpandedState && hasActiveOptions && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ duration: 0.2 }}
                className="search-bar__options-count"
                onClick={onOptionsClick}
                onMouseDown={handleButtonMouseDown}
              >
                <SlidersHorizontal size={14} />
                <span>{activeCategories.length}</span>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(value.trim() || isExpanded) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ duration: 0.2 }}
                className={`search-bar__token-btn ${
                  showTokenOverlay ? "active" : ""
                }`}
                onClick={onTokenClick}
                onMouseDown={handleButtonMouseDown}
              >
                <Coins size={14} />
                <span className="search-bar__btn-text">-{tokenCost}</span>
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            className={`search-bar__help-btn ${
              showExpandedState ? "search-bar__help-btn--expanded" : ""
            }`}
            onClick={onHelpClick}
            onMouseDown={handleButtonMouseDown}
            title="Get Help"
          >
            <HelpCircle size={18} />
            <span className="search-bar__btn-text">Help</span>
          </motion.button>

          <motion.button
            className={`search-bar__gear-btn ${showOptions ? "active" : ""} ${
              showExpandedState ? "search-bar__gear-btn--expanded" : ""
            }`}
            onClick={onOptionsClick}
            onMouseDown={handleButtonMouseDown}
          >
            <Settings size={18} />
            <span className="search-bar__btn-text">Customize</span>
          </motion.button>

          <motion.button
            className={`search-bar__submit ${
              showExpandedState ? "search-bar__submit--expanded" : ""
            }`}
            onClick={onGenerate}
            onMouseDown={handleButtonMouseDown}
            disabled={isGenerating || !value.trim()}
          >
            {isGenerating ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <Sparkles size={16} />
            )}
            <span className="search-bar__btn-text">
              {isGenerating ? "Generating" : "Generate"}
            </span>
          </motion.button>
        </div>
      </motion.div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
