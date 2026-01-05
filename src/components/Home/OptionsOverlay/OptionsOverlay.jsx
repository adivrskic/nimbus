// components/Home/OptionsOverlay/OptionsOverlay.jsx - Optimized with local state
import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Settings,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { OPTIONS, getFilteredCategories } from "../../../configs";

import "./OptionsOverlay.scss";

// ============================================
// VALIDATORS
// ============================================
const validators = {
  email: (v) => {
    if (!v) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Invalid email";
  },
  phone: (v) => {
    if (!v) return null;
    const digits = v.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15 ? null : "Invalid phone";
  },
  url: (v) => {
    if (!v) return null;
    try {
      const url = new URL(v);
      return ["http:", "https:"].includes(url.protocol) ? null : "Invalid URL";
    } catch {
      return "Invalid URL";
    }
  },
  year: (v) => {
    if (!v) return null;
    const year = parseInt(v, 10);
    const now = new Date().getFullYear();
    return year >= 1800 && year <= now ? null : `Must be 1800-${now}`;
  },
  maxLen: (max) => (v) => v && v.length > max ? `Max ${max} chars` : null,
  minLen: (min) => (v) => v && v.length < min ? `Min ${min} chars` : null,
  brandName: (v) => {
    if (!v) return null;
    if (v.length < 2) return "Min 2 chars";
    if (v.length > 50) return "Max 50 chars";
    return null;
  },
};

// Field config: [validator, inputType, label, placeholder, inputFilter]
const FIELDS = {
  "branding.brandName": [
    validators.brandName,
    "text",
    "Brand Name",
    "e.g., Acme Inc",
  ],
  "branding.tagline": [
    validators.maxLen(100),
    "text",
    "Tagline",
    "e.g., Innovation delivered",
  ],
  "business.description": [
    validators.maxLen(300),
    "text",
    "Description",
    "Brief description of your business",
  ],
  "business.location": [
    validators.maxLen(100),
    "text",
    "Location",
    "e.g., San Francisco, CA",
  ],
  "business.yearEstablished": [
    validators.year,
    "text",
    "Year Est.",
    "e.g., 2020",
    /^[0-9]*$/,
  ],
  "contactInfo.email": [
    validators.email,
    "email",
    "Email",
    "contact@example.com",
  ],
  "contactInfo.phone": [
    validators.phone,
    "tel",
    "Phone",
    "+1 (555) 123-4567",
    /^[0-9+\-\s()]*$/,
  ],
  "contactInfo.address": [
    validators.maxLen(200),
    "text",
    "Address",
    "123 Main St, City, State",
  ],
  "socialMedia.twitter": [
    validators.url,
    "url",
    "Twitter",
    "https://twitter.com/...",
  ],
  "socialMedia.instagram": [
    validators.url,
    "url",
    "Instagram",
    "https://instagram.com/...",
  ],
  "socialMedia.linkedIn": [
    validators.url,
    "url",
    "LinkedIn",
    "https://linkedin.com/...",
  ],
  "socialMedia.facebook": [
    validators.url,
    "url",
    "Facebook",
    "https://facebook.com/...",
  ],
  "content.primaryCta": [
    validators.maxLen(30),
    "text",
    "Primary CTA",
    "e.g., Get Started",
  ],
  "content.copyrightText": [
    validators.maxLen(100),
    "text",
    "Copyright",
    "e.g., Â© 2025 Company",
  ],
};

// ============================================
// OPTIMIZED INPUT COMPONENT (memoized, local state)
// ============================================
const OptimizedInput = memo(function OptimizedInput({
  fieldKey,
  initialValue,
  onCommit,
  className = "",
}) {
  const config = FIELDS[fieldKey];
  if (!config) return null;

  const [validator, type, label, placeholder, inputFilter] = config;
  const [value, setValue] = useState(initialValue || "");
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  // Sync with parent when initialValue changes (e.g., modal reopens)
  useEffect(() => {
    setValue(initialValue || "");
    setError(null);
    setTouched(false);
  }, [initialValue]);

  const handleChange = (e) => {
    let newValue = e.target.value;

    // Apply input filter if exists (for phone, year)
    if (inputFilter && newValue && !inputFilter.test(newValue)) {
      return; // Reject invalid characters
    }

    setValue(newValue);

    // Clear error while typing if it was showing
    if (touched && error) {
      setError(validator(newValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validator(value);
    setError(validationError);

    // Only commit to parent on blur (not on every keystroke)
    onCommit(fieldKey, value);
  };

  return (
    <div
      className={`options-input-wrapper ${
        error ? "has-error" : ""
      } ${className}`}
    >
      <label className="options-input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`options-input ${error ? "options-input--error" : ""}`}
      />
      {error && (
        <div className="options-input-error">
          <AlertCircle size={10} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

// ============================================
// MAIN COMPONENT
// ============================================
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
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isBrandExpanded, setIsBrandExpanded] = useState(true);
  const [isDesignExpanded, setIsDesignExpanded] = useState(true);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCategoryFilter("");
      setActiveOption(null);
      setIsBrandExpanded(true);
      setIsDesignExpanded(true);
    }
  }, [isOpen]);

  // Commit handler - updates parent state
  const handleCommit = (fieldKey, value) => {
    const [category, field] = fieldKey.split(".");
    onPersistentChange(category, field, value);
  };

  // Get initial value for a field
  const getInitialValue = (fieldKey) => {
    const [category, field] = fieldKey.split(".");
    return persistentOptions[category]?.[field] || "";
  };

  if (!isOpen) return null;

  const goToCategories = () => setActiveOption(null);
  const selectCategory = (id) => setActiveOption(id);

  const handleSelect = (optionKey, value) => {
    onSelect(optionKey, value);
    if (optionKey === "palette" && value === "Custom") return;
    const opt = OPTIONS[optionKey];
    if (!opt.multi) {
      setTimeout(() => setActiveOption(null), 120);
    }
  };

  const filteredCategories = getFilteredCategories(categoryFilter);
  const selectedCount = Object.keys(selections).filter((k) =>
    hasSelection(k)
  ).length;

  return (
    <motion.div
      className="options-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="options-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
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

        <div className="options-filters">
          {["", "layout", "visual", "content", "components", "technical"].map(
            (filter) => (
              <button
                key={filter || "all"}
                className={`options-filter ${
                  categoryFilter === filter ? "active" : ""
                }`}
                onClick={() => setCategoryFilter(filter)}
              >
                {filter || "All"}
              </button>
            )
          )}
        </div>

        <div className="options-body">
          {/* Design Options Section */}
          <div className="options-section">
            <div
              className="options-section__header"
              onClick={() => setIsDesignExpanded(!isDesignExpanded)}
            >
              <div className="options-section__title">Design Options</div>
              <button
                className={`options-section__toggle ${
                  !isDesignExpanded ? "collapsed" : ""
                }`}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <div
              className={`options-section__content ${
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
                      <button className="options-back" onClick={goToCategories}>
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
                                  <span key={i} style={{ background: color }} />
                                ))}
                              </div>
                            )}
                            <span>{choice.value}</span>
                            {isActive && <Check size={12} />}
                          </button>
                        );
                      })}
                    </div>

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
                      <button className="options-done" onClick={goToCategories}>
                        Done ({selections[activeOption]?.length || 0})
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Brand & Business Section */}
          <div className="options-section">
            <div
              className="options-section__header"
              onClick={() => setIsBrandExpanded(!isBrandExpanded)}
            >
              <div className="options-section__title">Brand & Business</div>
              <button
                className={`options-section__toggle ${
                  !isBrandExpanded ? "collapsed" : ""
                }`}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <div
              className={`options-section__content ${
                isBrandExpanded ? "expanded" : "collapsed"
              }`}
            >
              {/* Identity */}
              <div className="options-section__group">
                <div className="options-section__group-title">Identity</div>
                <div className="options-section__row">
                  <OptimizedInput
                    fieldKey="branding.brandName"
                    initialValue={getInitialValue("branding.brandName")}
                    onCommit={handleCommit}
                  />
                  <OptimizedInput
                    fieldKey="branding.tagline"
                    initialValue={getInitialValue("branding.tagline")}
                    onCommit={handleCommit}
                  />
                </div>
                <div className="options-section__row">
                  <OptimizedInput
                    fieldKey="business.description"
                    initialValue={getInitialValue("business.description")}
                    onCommit={handleCommit}
                    className="options-input-wrapper--full"
                  />
                </div>
                <div className="options-section__row">
                  <OptimizedInput
                    fieldKey="business.location"
                    initialValue={getInitialValue("business.location")}
                    onCommit={handleCommit}
                  />
                  <OptimizedInput
                    fieldKey="business.yearEstablished"
                    initialValue={getInitialValue("business.yearEstablished")}
                    onCommit={handleCommit}
                    className="options-input-wrapper--small"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="options-section__group">
                <div className="options-section__group-title">Contact</div>
                <div className="options-section__row">
                  <OptimizedInput
                    fieldKey="contactInfo.email"
                    initialValue={getInitialValue("contactInfo.email")}
                    onCommit={handleCommit}
                  />
                  <OptimizedInput
                    fieldKey="contactInfo.phone"
                    initialValue={getInitialValue("contactInfo.phone")}
                    onCommit={handleCommit}
                  />
                </div>
                <div className="options-section__row">
                  <OptimizedInput
                    fieldKey="contactInfo.address"
                    initialValue={getInitialValue("contactInfo.address")}
                    onCommit={handleCommit}
                    className="options-input-wrapper--full"
                  />
                </div>
              </div>

              {/* Social */}
              <div className="options-section__group">
                <div className="options-section__group-title">Social</div>
                <div className="options-section__row options-section__row--grid">
                  {["twitter", "instagram", "linkedIn", "facebook"].map(
                    (platform) => (
                      <OptimizedInput
                        key={platform}
                        fieldKey={`socialMedia.${platform}`}
                        initialValue={getInitialValue(
                          `socialMedia.${platform}`
                        )}
                        onCommit={handleCommit}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="options-section__group">
                <div className="options-section__group-title">Content</div>
                <div className="options-section__row">
                  <OptimizedInput
                    fieldKey="content.primaryCta"
                    initialValue={getInitialValue("content.primaryCta")}
                    onCommit={handleCommit}
                  />
                  <OptimizedInput
                    fieldKey="content.copyrightText"
                    initialValue={getInitialValue("content.copyrightText")}
                    onCommit={handleCommit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default OptionsOverlay;
