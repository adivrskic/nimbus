import { useState } from "react";
import { X, Settings, ChevronLeft, Check, RotateCcw } from "lucide-react";
import { OPTIONS } from "../../configs/options.config";
import {
  CATEGORY_GROUPS,
  getFilteredCategories,
} from "../../configs/categories.config";
import useModalAnimation from "../../hooks/useModalAnimation";

import "../../styles/modals.scss";

const BRAND_FIELDS = {
  identity: {
    label: "Identity",
    category: "branding",
    fields: [
      {
        key: "brandName",
        category: "branding",
        label: "Brand Name",
        placeholder: "e.g., Acme Inc",
      },
      {
        key: "tagline",
        category: "branding",
        label: "Tagline",
        placeholder: "e.g., Innovation delivered",
      },
    ],
  },
  business: {
    label: "Business",
    category: "business",
    fields: [
      {
        key: "description",
        category: "business",
        label: "Description",
        placeholder: "Brief description of your business",
        full: true,
      },
      {
        key: "location",
        category: "business",
        label: "Location",
        placeholder: "e.g., San Francisco, CA",
      },
      {
        key: "yearEstablished",
        category: "business",
        label: "Year Est.",
        placeholder: "e.g., 2020",
        small: true,
      },
    ],
  },
  contact: {
    label: "Contact",
    category: "contactInfo",
    fields: [
      {
        key: "email",
        category: "contactInfo",
        label: "Email",
        placeholder: "contact@example.com",
      },
      {
        key: "phone",
        category: "contactInfo",
        label: "Phone",
        placeholder: "+1 (555) 123-4567",
      },
      {
        key: "address",
        category: "contactInfo",
        label: "Address",
        placeholder: "123 Main St, City, State",
        full: true,
      },
    ],
  },
  social: {
    label: "Social",
    category: "socialMedia",
    fields: [
      {
        key: "twitter",
        category: "socialMedia",
        label: "Twitter",
        placeholder: "https://twitter.com/...",
      },
      {
        key: "instagram",
        category: "socialMedia",
        label: "Instagram",
        placeholder: "https://instagram.com/...",
      },
      {
        key: "linkedIn",
        category: "socialMedia",
        label: "LinkedIn",
        placeholder: "https://linkedin.com/...",
      },
      {
        key: "facebook",
        category: "socialMedia",
        label: "Facebook",
        placeholder: "https://facebook.com/...",
      },
    ],
  },
  content: {
    label: "Content",
    category: "content",
    fields: [
      {
        key: "primaryCta",
        category: "content",
        label: "Primary CTA",
        placeholder: "e.g., Get Started",
      },
      {
        key: "copyrightText",
        category: "content",
        label: "Copyright",
        placeholder: "e.g., © 2025 Company",
      },
    ],
  },
};

const FILTER_KEYS = ["", "layout", "visual", "content", "technical"];

function OptionsModal({
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
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );

  const [activeTab, setActiveTab] = useState("design");
  const [activeOption, setActiveOption] = useState(null);
  const [filter, setFilter] = useState("layout");

  if (!shouldRender) return null;

  const filteredKeys = getFilteredCategories(filter || null);
  const selectedCount = filteredKeys.filter((key) => hasSelection(key)).length;
  const totalSelected = getFilteredCategories(null).filter((key) =>
    hasSelection(key)
  ).length;

  const activeOptConfig = activeOption ? OPTIONS[activeOption] : null;

  const getPersistentValue = (category, field) => {
    return persistentOptions?.[category]?.[field] || "";
  };

  return (
    <div
      className={`modal-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`modal-content modal-content--options ${
          isVisible ? "active" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="options-header">
          <div className="options-header__left">
            <div className="modal-title">
              <Settings size={16} />
              <span>Customize</span>
            </div>
          </div>
          <button
            className="modal-close"
            onClick={closeModal}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="options-filters">
          {["design", "brand"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveOption(null);
              }}
              className={`options-filter ${activeTab === tab ? "active" : ""}`}
              style={
                activeTab === tab
                  ? {
                      background: "var(--color-accent)",
                      color: "var(--color-background)",
                    }
                  : {}
              }
            >
              {tab === "design" ? "Design" : "Brand & Business"}
              {tab === "design" && totalSelected > 0 && (
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    background:
                      activeTab === tab
                        ? "rgba(255,255,255,0.2)"
                        : "var(--color-accent-light)",
                    padding: "1px 6px",
                    borderRadius: 999,
                    marginLeft: 6,
                  }}
                >
                  {totalSelected}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* ======== DESIGN TAB — Category Grid ======== */}
          {activeTab === "design" && !activeOption && (
            <>
              {/* Sub-filters */}
              <div className="options-filters">
                {FILTER_KEYS.map((f) => (
                  <button
                    key={f || "all"}
                    onClick={() => setFilter(f)}
                    className={`options-filter ${filter === f ? "active" : ""}`}
                  >
                    {f || "All"}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div
                className="options-grid"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  alignContent: "start",
                }}
              >
                {filteredKeys.map((key) => {
                  const opt = OPTIONS[key];
                  if (!opt) return null;
                  const isActive = hasSelection(key);
                  const displayVal = getDisplayValue(key);
                  const Icon = opt.icon;

                  return (
                    <button
                      key={key}
                      className={`options-card ${
                        isActive ? "options-card--active" : ""
                      }`}
                      onClick={() => setActiveOption(key)}
                    >
                      <div className="options-card__icon">
                        {Icon && <Icon size={14} />}
                      </div>
                      <div className="options-card__info">
                        <div className="options-card__label">{opt.label}</div>
                        {isActive && displayVal && (
                          <div className="options-card__value">
                            {displayVal}
                          </div>
                        )}
                      </div>
                      <span className="options-card__arrow">›</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ======== DESIGN TAB — Drill-down choices ======== */}
          {activeTab === "design" && activeOption && activeOptConfig && (
            <div className="options-choices">
              <div className="options-choices__header">
                <button
                  className="options-back"
                  onClick={() =>
                    setActiveOption(
                      activeOption === "customColors" ? "palette" : null
                    )
                  }
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="options-choices__title">
                  <span>{activeOptConfig.label}</span>
                  <div className="options-choices__subtitle">
                    {activeOptConfig.subtitle || "Choose one option"}
                  </div>
                </div>
                {hasSelection(activeOption) && (
                  <button
                    className="options-reset"
                    onClick={() => {
                      onReset(activeOption);
                      // Keep palette and customColors in sync
                      if (activeOption === "customColors") {
                        onReset("palette");
                        setActiveOption(null);
                      } else if (
                        activeOption === "palette" &&
                        selections.palette === "Custom"
                      ) {
                        onReset("customColors");
                      }
                    }}
                  >
                    <RotateCcw size={12} style={{ marginRight: 4 }} />
                    Reset
                  </button>
                )}
              </div>

              {/* Color picker options */}
              {activeOptConfig.isColorPicker && (
                <div className="options-custom-colors">
                  {activeOptConfig.fields.map((field) => (
                    <div className="options-color-field" key={field.key}>
                      <span>{field.label}</span>
                      <div className="options-color-picker">
                        <input
                          type="color"
                          value={
                            selections[activeOption]?.[field.key] ||
                            field.default
                          }
                          onChange={(e) =>
                            onSelect(activeOption, {
                              ...selections[activeOption],
                              [field.key]: e.target.value,
                            })
                          }
                        />
                        <span>
                          {selections[activeOption]?.[field.key] ||
                            field.default}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Regular choices */}
              {!activeOptConfig.isColorPicker && activeOptConfig.choices && (
                <div className="options-choices__grid">
                  {activeOptConfig.choices.map((choice) => {
                    const value =
                      typeof choice === "string" ? choice : choice.value;
                    const isSelected = activeOptConfig.multi
                      ? selections[activeOption]?.includes(value)
                      : selections[activeOption] === value;

                    return (
                      <button
                        key={value}
                        className={`options-choice ${
                          isSelected ? "options-choice--active" : ""
                        }`}
                        onClick={() => {
                          onSelect(activeOption, value);
                          // Auto-open custom color picker when "Custom" palette is selected
                          if (
                            activeOption === "palette" &&
                            value === "Custom"
                          ) {
                            setActiveOption("customColors");
                          }
                        }}
                      >
                        {/* Color swatches for palette choices */}
                        {choice.colors && (
                          <div className="options-choice__colors">
                            {choice.colors.map((c, i) => (
                              <span key={i} style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        )}
                        <span>{value}</span>
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======== BRAND TAB ======== */}
          {activeTab === "brand" && (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 28,
                paddingRight: 4,
              }}
              className="modal-body"
            >
              {Object.entries(BRAND_FIELDS).map(([sectionKey, section]) => (
                <div className="options-section__group" key={sectionKey}>
                  <div className="options-section__group-title">
                    {section.label}
                  </div>

                  <div className="options-section__row options-section__row--grid">
                    {section.fields.map((field) => (
                      <div
                        key={field.key}
                        className={`options-input-wrapper ${
                          field.full ? "options-input-wrapper--full" : ""
                        } ${field.small ? "options-input-wrapper--small" : ""}`}
                      >
                        <label className="options-input-label">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          className={`options-input ${
                            getPersistentValue(field.category, field.key)
                              ? "options-input--filled"
                              : ""
                          }`}
                          placeholder={field.placeholder}
                          value={getPersistentValue(field.category, field.key)}
                          onChange={(e) =>
                            onPersistentChange(
                              field.category,
                              field.key,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OptionsModal;
