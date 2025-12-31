// components/Home/OptionsOverlay/OptionsOverlay.jsx - Main customization modal
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Settings,
  ChevronDown,
} from "lucide-react";
import {
  INTRO_LABELS,
  OPTIONS,
  CATEGORIES,
  CATEGORY_GROUPS,
  getFilteredCategories,
} from "../../../configs";

import "./OptionsOverlay.scss";

// Track if intro has been shown (persists across component remounts)
let hasShownIntro = false;

function OptionsOverlay({
  isOpen,
  onClose,
  selections,
  onSelect,
  onReset,
  hasSelection,
  getDisplayValue,
  persistentOptions,
  onPersistentChange,
}) {
  const [activeOption, setActiveOption] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(hasShownIntro);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [slideDirection, setSlideDirection] = useState(1);

  // State for collapsible sections on mobile
  const [isBrandExpanded, setIsBrandExpanded] = useState(true);
  const [isDesignExpanded, setIsDesignExpanded] = useState(true);

  // Intro animation on first open only
  useEffect(() => {
    if (isOpen) {
      if (!hasShownIntro) {
        setShowIntro(true);
        setIntroComplete(false);
        const timer = setTimeout(() => {
          setShowIntro(false);
          setIntroComplete(true);
          hasShownIntro = true;
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Skip intro on subsequent opens
        setIntroComplete(true);
      }
    } else {
      setShowIntro(false);
      setCategoryFilter("");
      setActiveOption(null);
      // Reset collapsible sections when closing
      setIsBrandExpanded(true);
      setIsDesignExpanded(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const goToCategories = () => {
    setSlideDirection(-1);
    setActiveOption(null);
  };

  const selectCategory = (id) => {
    setSlideDirection(1);
    setActiveOption(id);
  };

  const handleSelect = (optionKey, value) => {
    onSelect(optionKey, value);

    const opt = OPTIONS[optionKey];

    // Special handling for palette selection
    if (optionKey === "palette" && value === "Custom") {
      return; // Stay on the palette section for custom colors
    }

    // Close overlay after single selection (not multi)
    if (!opt.multi) {
      setTimeout(() => {
        setSlideDirection(-1);
        setActiveOption(null);
      }, 120);
    }
  };

  const filteredCategories = getFilteredCategories(categoryFilter);
  const selectedCount = Object.keys(selections).filter((k) =>
    hasSelection(k)
  ).length;

  const introLabels = INTRO_LABELS;

  // Repeat for visual effect
  const allIntroLabels = [
    ...introLabels,
    ...introLabels,
    ...introLabels,
    ...introLabels,
  ];

  return (
    <motion.div
      className="options-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="options-intro"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="options-intro__pills"
              initial={{ scale: 1, rotate: -45, opacity: 1 }}
            >
              {allIntroLabels.map((label, i) => (
                <motion.div
                  key={`${label}-${i}`}
                  className="options-intro__pill"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 0.5 }}
                >
                  {label}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - only show after intro completes */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            className="options-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.98, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="options-header">
              <div className="options-header__left">
                <span className="options-title">
                  <Settings />
                  <span>Customize</span>
                  <span className="options-subtitle">
                    {activeOption
                      ? OPTIONS[activeOption]?.label
                      : `${selectedCount} options set`}
                  </span>
                </span>
              </div>
              <button className="options-close" onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="options-filters">
              {[
                "",
                "layout",
                "visual",
                "content",
                "components",
                "technical",
              ].map((filter) => (
                <button
                  key={filter || "all"}
                  className={`options-filter ${
                    categoryFilter === filter ? "active" : ""
                  }`}
                  onClick={() => setCategoryFilter(filter)}
                >
                  {filter || "All"}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="options-body">
              {/* Left: Brand Info */}
              <div className="options-brand">
                <div
                  className="options-brand__header"
                  onClick={() => setIsBrandExpanded(!isBrandExpanded)}
                >
                  <div className="options-brand__title">Brand & Contact</div>
                  <button
                    className={`options-brand__toggle ${
                      !isBrandExpanded ? "collapsed" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div
                  className={`options-brand__content ${
                    isBrandExpanded ? "expanded" : "collapsed"
                  }`}
                >
                  <div className="options-brand__row">
                    <input
                      type="text"
                      value={persistentOptions.branding.brandName}
                      onChange={(e) =>
                        onPersistentChange(
                          "branding",
                          "brandName",
                          e.target.value
                        )
                      }
                      placeholder="Brand name"
                      className="options-input"
                    />
                    <input
                      type="text"
                      value={persistentOptions.branding.tagline}
                      onChange={(e) =>
                        onPersistentChange(
                          "branding",
                          "tagline",
                          e.target.value
                        )
                      }
                      placeholder="Tagline"
                      className="options-input"
                    />
                  </div>

                  <div className="options-brand__row">
                    <input
                      type="email"
                      value={persistentOptions.contactInfo.email}
                      onChange={(e) =>
                        onPersistentChange(
                          "contactInfo",
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="Email"
                      className="options-input"
                    />
                    <input
                      type="tel"
                      value={persistentOptions.contactInfo.phone}
                      onChange={(e) =>
                        onPersistentChange(
                          "contactInfo",
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="Phone"
                      className="options-input"
                    />
                  </div>

                  <div className="options-brand__title">Social</div>
                  <div className="options-brand__social">
                    {Object.entries(persistentOptions.socialMedia)
                      .slice(0, 4)
                      .map(([platform, url]) => (
                        <input
                          key={platform}
                          type="url"
                          value={url}
                          onChange={(e) =>
                            onPersistentChange(
                              "socialMedia",
                              platform,
                              e.target.value
                            )
                          }
                          placeholder={platform}
                          className="options-input"
                        />
                      ))}
                  </div>
                </div>
              </div>

              {/* Right: Design Options */}
              <div className="options-design">
                <div
                  className="options-design__header"
                  onClick={() => setIsDesignExpanded(!isDesignExpanded)}
                >
                  <div className="options-design__title">Design Options</div>
                  <button
                    className={`options-design__toggle ${
                      !isDesignExpanded ? "collapsed" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div
                  className={`options-design__content ${
                    isDesignExpanded ? "expanded" : "collapsed"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {!activeOption ? (
                      <motion.div
                        key="grid"
                        className="options-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {filteredCategories.map((catKey) => {
                          const opt = OPTIONS[catKey];
                          if (!opt) return null;
                          const Icon = opt?.icon;
                          const isSelected = hasSelection(catKey);
                          const displayVal = getDisplayValue(catKey);

                          return (
                            <motion.button
                              key={catKey}
                              className={`options-card ${
                                isSelected ? "options-card--active" : ""
                              }`}
                              onClick={() => selectCategory(catKey)}
                            >
                              <div className="options-card__icon">
                                {Icon && <Icon size={14} />}
                              </div>
                              <div className="options-card__info">
                                <span className="options-card__label">
                                  {opt?.label}
                                </span>
                                {isSelected && displayVal && (
                                  <span className="options-card__value">
                                    {displayVal}
                                  </span>
                                )}
                              </div>
                              <ChevronRight
                                size={12}
                                className="options-card__arrow"
                              />
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="choices"
                        className="options-choices"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="options-choices__header">
                          <button
                            className="options-back"
                            onClick={goToCategories}
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <div className="options-choices__title">
                            <span>{OPTIONS[activeOption]?.label}</span>
                            <span className="options-choices__subtitle">
                              {OPTIONS[activeOption]?.subtitle}
                            </span>
                          </div>
                          {hasSelection(activeOption) && (
                            <button
                              className="options-reset"
                              onClick={() => onReset(activeOption)}
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        <div className="options-choices__grid">
                          {OPTIONS[activeOption]?.choices?.map((choice) => {
                            const isMulti = OPTIONS[activeOption].multi;
                            const isActive = isMulti
                              ? selections[activeOption]?.includes(choice.value)
                              : selections[activeOption] === choice.value;

                            return (
                              <button
                                key={choice.value}
                                className={`options-choice ${
                                  isActive ? "options-choice--active" : ""
                                }`}
                                onClick={() =>
                                  handleSelect(activeOption, choice.value)
                                }
                              >
                                {choice.colors && (
                                  <div className="options-choice__colors">
                                    {choice.colors.map((color, i) => (
                                      <span
                                        key={i}
                                        style={{ background: color }}
                                      />
                                    ))}
                                  </div>
                                )}
                                <span>{choice.value}</span>
                                {isActive && <Check size={12} />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom Colors Editor */}
                        {activeOption === "palette" &&
                          selections.palette === "Custom" && (
                            <div className="options-custom-colors">
                              {OPTIONS.customColors.fields.map((field) => (
                                <div
                                  key={field.key}
                                  className="options-color-field"
                                >
                                  <span>{field.label}</span>
                                  <div className="options-color-picker">
                                    <input
                                      type="color"
                                      value={
                                        selections.customColors?.[field.key] ||
                                        field.default
                                      }
                                      onChange={(e) => {
                                        onSelect("customColors", {
                                          ...selections.customColors,
                                          [field.key]: e.target.value,
                                        });
                                      }}
                                    />
                                    <span>
                                      {selections.customColors?.[field.key] ||
                                        field.default}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        {OPTIONS[activeOption]?.multi && (
                          <button
                            className="options-done"
                            onClick={goToCategories}
                          >
                            Done ({selections[activeOption]?.length || 0})
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default OptionsOverlay;
