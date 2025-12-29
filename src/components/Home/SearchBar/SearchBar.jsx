// components/Home/SearchBar/SearchBar.jsx - Main search input component
import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Settings, Sparkles, HelpCircle } from "lucide-react";
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
    },
    ref
  ) => {
    console.log(tokenCost);
    return (
      <motion.div
        className={`search-bar ${isExpanded ? "search-bar--expanded" : ""}`}
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
            onBlur={onBlur}
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
        </div>
        <div className="search-bar__right">
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
              >
                <Coins size={14} />
                <span className="search-bar__btn-text">-{tokenCost}</span>
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            className={`search-bar__help-btn ${
              isExpanded ? "search-bar__help-btn--expanded" : ""
            }`}
            onClick={onHelpClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Get Help"
          >
            <HelpCircle size={18} />
            <span className="search-bar__btn-text">Help</span>
          </motion.button>
          <motion.button
            className={`search-bar__gear-btn ${showOptions ? "active" : ""} ${
              isExpanded ? "search-bar__gear-btn--expanded" : ""
            }`}
            onClick={onOptionsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={18} />
            <span className="search-bar__btn-text">Options</span>
          </motion.button>
          <motion.button
            className={`search-bar__submit ${
              isExpanded ? "search-bar__submit--expanded" : ""
            }`}
            onClick={onGenerate}
            disabled={isGenerating || !value.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <Sparkles size={16} />
            )}
            <span className="search-bar__btn-text">Generate</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
