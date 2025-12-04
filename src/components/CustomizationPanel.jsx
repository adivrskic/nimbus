import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  X,
  Upload,
  Image as ImageIcon,
  Palette,
  User,
  FileText,
  Star,
  Briefcase,
  BarChart3,
  MessageSquare,
  Users,
  DollarSign,
  Megaphone,
  Mail,
  Share2,
  Layout,
  Check,
  Minus,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Phone,
  Hash,
  Type,
  List,
  CheckSquare,
} from "lucide-react";
import { getAllThemes } from "../styles/themes";
import { useTheme } from "../contexts/ThemeContext";
import ImageUploadField from "./ImageUploadField";
import "./CustomizationPanel.scss";

function CustomizationPanel({
  fields,
  customization,
  onChange,
  onImageUpload,
  siteId,
}) {
  const [visibleFields, setVisibleFields] = useState({});
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const sectionRefs = useRef({});
  const contentRef = useRef(null);
  const themes = getAllThemes();
  const { setStyleTheme, toggleTheme } = useTheme();

  // Icon mapping for sections
  const sectionIcons = {
    "Design Style": Palette,
    "Basic Info": User,
    "Images & Media": ImageIcon,
    Content: FileText,
    Features: Star,
    Portfolio: Briefcase,
    Statistics: BarChart3,
    Testimonials: MessageSquare,
    Team: Users,
    Pricing: DollarSign,
    "Call to Action": Megaphone,
    "Contact Info": Mail,
    "Social Links": Share2,
    General: Layout,
    Date: Calendar,
    Time: Clock,
    Location: MapPin,
    Website: Globe,
    Phone: Phone,
    Number: Hash,
    Text: Type,
    List: List,
    Checkbox: CheckSquare,
  };

  // Automatically categorize fields into sections
  const categorizeField = (key, field) => {
    // Check if field explicitly defines a section
    if (field.section) return field.section;

    // Theme selector gets its own section
    if (field.type === "theme-selector") return "Design Style";

    // Color mode selector
    if (key === "colorMode") return "Design Style";

    // Images and visual content
    if (
      field.type === "image" ||
      key.includes("image") ||
      key.includes("photo") ||
      key.includes("logo")
    ) {
      return "Images & Media";
    }

    // Group fields for structured content
    if (field.type === "group") {
      // Categorize based on the label or key
      if (key.includes("feature") || key.includes("service")) return "Features";
      if (
        key.includes("project") ||
        key.includes("work") ||
        key.includes("portfolio")
      )
        return "Portfolio";
      if (key.includes("testimonial") || key.includes("review"))
        return "Testimonials";
      if (
        key.includes("team") ||
        key.includes("member") ||
        key.includes("instructor")
      )
        return "Team";
      if (key.includes("pricing") || key.includes("plan")) return "Pricing";
      if (key.includes("stat") || key.includes("metric")) return "Statistics";
      if (key.includes("social") || key.includes("link")) return "Social Links";
      if (key.includes("curriculum") || key.includes("module"))
        return "Content";
      return "Content";
    }

    // Contact and social
    if (
      key.includes("email") ||
      key.includes("phone") ||
      key.includes("contact") ||
      key.includes("address")
    ) {
      return "Contact Info";
    }

    if (
      key.includes("social") ||
      key.includes("twitter") ||
      key.includes("linkedin")
    ) {
      return "Social Links";
    }

    // Main content fields
    if (
      key.includes("title") ||
      key.includes("headline") ||
      key.includes("name") ||
      key.includes("tagline") ||
      key.includes("bio") ||
      key.includes("description") ||
      key.includes("about")
    ) {
      return "Basic Info";
    }

    // CTA and buttons
    if (key.includes("cta") || key.includes("button")) {
      return "Call to Action";
    }

    // Date and time fields
    if (key.includes("date") || key.includes("time")) {
      return "Date";
    }

    // Number fields
    if (field.type === "number") {
      return "Number";
    }

    // Checkbox fields
    if (field.type === "checkbox") {
      return "Checkbox";
    }

    // Default section
    return "Basic Info";
  };

  // Group fields into sections with smart categorization
  const sections = Object.entries(fields).reduce((acc, [key, field]) => {
    const section = categorizeField(key, field);
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push({ key, field });
    return acc;
  }, {});

  // Define a preferred order for sections
  const sectionOrder = [
    "Design Style",
    "Basic Info",
    "Images & Media",
    "Content",
    "Features",
    "Portfolio",
    "Statistics",
    "Testimonials",
    "Team",
    "Pricing",
    "Call to Action",
    "Contact Info",
    "Social Links",
    "Date",
    "Number",
    "Checkbox",
  ];

  // Sort sections by preferred order
  const orderedSections = {};
  sectionOrder.forEach((sectionName) => {
    if (sections[sectionName]) {
      orderedSections[sectionName] = sections[sectionName];
    }
  });
  // Add any remaining sections not in the preferred order
  Object.keys(sections).forEach((sectionName) => {
    if (!orderedSections[sectionName]) {
      orderedSections[sectionName] = sections[sectionName];
    }
  });

  const sectionKeys = Object.keys(orderedSections);

  useEffect(() => {
    if (sectionKeys.length > 0 && !activeSection) {
      setActiveSection(sectionKeys[0]);
    }
  }, [sectionKeys, activeSection]);

  // Initialize default values
  useEffect(() => {
    const newCustomization = { ...customization };
    let hasChanges = false;

    Object.entries(fields).forEach(([key, field]) => {
      // If field doesn't exist in customization but has a default, set it
      if (customization[key] === undefined && field.default !== undefined) {
        newCustomization[key] = field.default;
        hasChanges = true;
      }

      // For group fields, ensure each item has all required sub-fields
      if (field.type === "group") {
        const groupValue = newCustomization[key] || field.default || [];
        const newGroupValue = [...groupValue];

        groupValue.forEach((item, index) => {
          Object.entries(field.fields).forEach(([subKey, subField]) => {
            if (item[subKey] === undefined && subField.default !== undefined) {
              newGroupValue[index] = {
                ...newGroupValue[index],
                [subKey]: subField.default,
              };
              hasChanges = true;
            }
          });
        });

        if (hasChanges) {
          newCustomization[key] = newGroupValue;
        }
      }
    });

    if (hasChanges) {
      // Note: We can't call onChange directly in useEffect without causing infinite loop
      // This should be handled by the parent component
      console.log("Setting default values:", newCustomization);
    }
  }, [fields]); // Run only when fields change

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollTop = contentRef.current.scrollTop;
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      const offset = 170; // Offset for sticky header

      // Check if we're at the bottom of the scroll container
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

      if (isAtBottom) {
        // If at bottom, activate the last section
        setActiveSection(sectionKeys[sectionKeys.length - 1]);
        return;
      }

      for (let i = sectionKeys.length - 1; i >= 0; i--) {
        const sectionKey = sectionKeys[i];
        const sectionElement = sectionRefs.current[sectionKey];

        if (sectionElement) {
          const sectionTop = sectionElement.offsetTop - offset;
          if (scrollTop >= sectionTop) {
            setActiveSection(sectionKey);
            break;
          }
        }
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => content.removeEventListener("scroll", handleScroll);
    }
  }, [sectionKeys]);

  const scrollToSection = (sectionKey) => {
    const sectionElement = sectionRefs.current[sectionKey];
    if (sectionElement && contentRef.current) {
      const offset = 170; // Account for sticky tabs
      const elementPosition = sectionElement.offsetTop;
      contentRef.current.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const handleThemeChange = (path, themeId) => {
    onChange(path, themeId);
    setStyleTheme(themeId); // Update global state
  };

  const handleColorModeChange = (path, colorMode) => {
    onChange(path, colorMode);
  };

  const toggleFieldVisibility = (fieldKey) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));

    // Reset to default if hiding
    if (!visibleFields[fieldKey]) {
      onChange(fieldKey, fields[fieldKey].default);
    }
  };

  const toggleGroupCollapse = (groupKey, index) => {
    const key = `${groupKey}_${index}`;
    setCollapsedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFileUpload = (fieldPath, event) => {
    const file = event.target.files[0];
    if (file && onImageUpload) {
      onImageUpload(fieldPath, file);
    }
  };

  const renderField = (key, field, value, path = key) => {
    const isHidden = visibleFields[key] === false;

    // Special handling for theme selector
    if (field.type === "theme-selector") {
      return (
        <div key={key} className="field field--theme-selector">
          <div className="theme-selector-grid">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-option ${value === theme.id ? "active" : ""}`}
                onClick={() => handleThemeChange(path, theme.id)}
              >
                <div className="theme-info">
                  <span className="theme-name">{theme.name}</span>
                  <span className="theme-description">{theme.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Special handling for color mode selector
    if (key === "colorMode") {
      return (
        <div key={key} className="field field--color-mode">
          <div className="field__header">
            <label className="field__label">
              {field.label || "Color Mode"}
              {field.optional && (
                <span className="field__optional">Optional</span>
              )}
            </label>
          </div>
          <div className="color-mode-selector">
            {["Auto", "Light", "Dark"].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`color-mode-option ${
                  value === mode ? "active" : ""
                }`}
                onClick={() => handleColorModeChange(path, mode)}
              >
                <div className="color-mode-icon">
                  {mode === "Light" ? "☀️" : mode === "Dark" ? "🌙" : "⚙️"}
                </div>
                <span className="color-mode-label">{mode}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (field.type === "group") {
      const groupValue = value || field.default || [];

      return (
        <div
          key={key}
          className={`field field--group ${isHidden ? "field--hidden" : ""}`}
        >
          <div className="field__header">
            <label className="field__label">
              {field.label}
              {groupValue.length > 0 && (
                <span className="field__group-count">{groupValue.length}</span>
              )}
            </label>
            <div className="field__actions">
              {field.optional && (
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => toggleFieldVisibility(key)}
                  title={isHidden ? "Show field" : "Hide field"}
                >
                  {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              )}
            </div>
          </div>

          {!isHidden && (
            <>
              <div className="field__group">
                {groupValue.map((item, index) => {
                  const isCollapsed = collapsedGroups[`${key}_${index}`];

                  return (
                    <div key={index} className="field__group-item">
                      <div className="field__group-item-header">
                        <button
                          type="button"
                          className="field__group-item-toggle"
                          onClick={() => toggleGroupCollapse(key, index)}
                        >
                          {isCollapsed ? (
                            <ChevronRight size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                          <span className="field__group-item-title">
                            {field.itemLabel} {index + 1}
                            {item[Object.keys(field.fields)[0]] &&
                              `: ${item[Object.keys(field.fields)[0]]}`}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="field__group-item-remove"
                          onClick={() => {
                            const newValue = [...groupValue];
                            newValue.splice(index, 1);
                            onChange(path, newValue);
                          }}
                          disabled={field.min && groupValue.length <= field.min}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {!isCollapsed && (
                        <div className="field__group-item-fields">
                          {Object.entries(field.fields).map(
                            ([fieldKey, fieldConfig]) => {
                              const fieldPath = `${path}[${index}].${fieldKey}`;
                              const fieldValue =
                                item[fieldKey] !== undefined
                                  ? item[fieldKey]
                                  : fieldConfig.default !== undefined
                                  ? fieldConfig.default
                                  : fieldConfig.type === "repeatable"
                                  ? []
                                  : "";

                              return (
                                <div
                                  key={fieldKey}
                                  className="field__group-field"
                                >
                                  <label className="field__group-field-label">
                                    {fieldConfig.label}
                                    {fieldConfig.required && (
                                      <span className="field__required">*</span>
                                    )}
                                  </label>
                                  {renderFieldInput(
                                    fieldConfig,
                                    fieldValue,
                                    (newValue) => {
                                      const newGroupValue = [...groupValue];
                                      newGroupValue[index] = {
                                        ...newGroupValue[index],
                                        [fieldKey]: newValue,
                                      };
                                      onChange(path, newGroupValue);
                                    },
                                    fieldPath
                                  )}
                                  {fieldConfig.hint && (
                                    <p className="field__hint">
                                      {fieldConfig.hint}
                                    </p>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {(!field.max || groupValue.length < field.max) && (
                <button
                  type="button"
                  className="field__group-add"
                  onClick={() => {
                    const newItem = {};
                    Object.entries(field.fields).forEach(
                      ([fieldKey, fieldConfig]) => {
                        if (fieldConfig.type === "repeatable") {
                          newItem[fieldKey] = fieldConfig.default || [];
                        } else {
                          newItem[fieldKey] =
                            fieldConfig.default !== undefined
                              ? fieldConfig.default
                              : "";
                        }
                      }
                    );
                    onChange(path, [...groupValue, newItem]);
                  }}
                >
                  <Plus size={16} />
                  Add {field.itemLabel || "Item"}
                </button>
              )}
            </>
          )}
        </div>
      );
    }

    if (field.type === "repeatable") {
      const repeatableValue = value || field.default || [""];

      return (
        <div key={key} className={`field ${isHidden ? "field--hidden" : ""}`}>
          <div className="field__header">
            <label className="field__label">
              {field.label}
              {field.optional && (
                <span className="field__optional">Optional</span>
              )}
            </label>
            {field.optional && (
              <button
                type="button"
                className="field__toggle"
                onClick={() => toggleFieldVisibility(key)}
                title={isHidden ? "Show field" : "Hide field"}
              >
                {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            )}
          </div>

          {!isHidden && (
            <>
              <div className="field__repeatable">
                {repeatableValue.map((item, index) => (
                  <div key={index} className="field__repeatable-item">
                    <input
                      type="text"
                      className="field__input"
                      value={item}
                      onChange={(e) => {
                        const newValue = [...repeatableValue];
                        newValue[index] = e.target.value;
                        onChange(path, newValue);
                      }}
                      placeholder={field.placeholder}
                    />
                    {repeatableValue.length > 1 && (
                      <button
                        type="button"
                        className="field__repeatable-remove"
                        onClick={() => {
                          const newValue = [...repeatableValue];
                          newValue.splice(index, 1);
                          onChange(path, newValue);
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="field__repeatable-add"
                onClick={() => {
                  onChange(path, [...repeatableValue, ""]);
                }}
              >
                <Plus size={16} />
                Add {field.label}
              </button>
            </>
          )}
        </div>
      );
    }

    return (
      <div key={key} className={`field ${isHidden ? "field--hidden" : ""}`}>
        <div className="field__header">
          <label className="field__label">
            {field.label}
            {field.required && <span className="field__required">*</span>}
            {field.optional && !field.required && (
              <span className="field__optional">Optional</span>
            )}
          </label>
          {field.optional && (
            <button
              type="button"
              className="field__toggle"
              onClick={() => toggleFieldVisibility(key)}
              title={isHidden ? "Show field" : "Hide field"}
            >
              {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          )}
        </div>
        {!isHidden && (
          <>
            {renderFieldInput(
              field,
              value,
              (newValue) => onChange(path, newValue),
              path
            )}
            {field.hint && <p className="field__hint">{field.hint}</p>}
          </>
        )}
      </div>
    );
  };

  const renderFieldInput = (field, value, onFieldChange, path) => {
    // Handle undefined values by using defaults
    const fieldValue = value !== undefined ? value : field.default || "";

    switch (field.type) {
      case "text":
      case "email":
      case "url":
      case "tel":
        return (
          <input
            type={field.type}
            className="field__input"
            value={fieldValue}
            onChange={(e) => onFieldChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
          />
        );

      case "textarea":
        return (
          <textarea
            className="field__textarea"
            value={fieldValue}
            onChange={(e) => onFieldChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            required={field.required}
            disabled={field.disabled}
          />
        );

      case "select":
        return (
          <select
            className="field__select"
            value={fieldValue}
            onChange={(e) => onFieldChange(e.target.value)}
            required={field.required}
            disabled={field.disabled}
          >
            {field.options.map((option) => {
              // Handle both string options and object options
              const optionValue =
                typeof option === "object" ? option.value : option;
              const optionLabel =
                typeof option === "object" ? option.label : option;

              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
        );

      case "number":
        return (
          <div className="field__number-wrapper">
            <input
              type="number"
              className="field__input field__number"
              value={fieldValue}
              onChange={(e) => onFieldChange(parseFloat(e.target.value))}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step || 1}
              required={field.required}
              disabled={field.disabled}
            />
            {field.unit && <span className="field__unit">{field.unit}</span>}
          </div>
        );

      case "checkbox":
        return (
          <div className="field__checkbox-wrapper">
            <label className="field__checkbox-label">
              <input
                type="checkbox"
                className="field__checkbox"
                checked={fieldValue}
                onChange={(e) => onFieldChange(e.target.checked)}
                disabled={field.disabled}
              />
              <span className="field__checkbox-custom">
                <Check size={12} />
              </span>
              <span className="field__checkbox-text">
                {field.checkboxLabel || field.label}
              </span>
            </label>
          </div>
        );

      case "color":
        return (
          <div className="field__color-wrapper">
            <input
              type="color"
              className="field__color-input"
              value={fieldValue}
              onChange={(e) => onFieldChange(e.target.value)}
              disabled={field.disabled}
            />
            <input
              type="text"
              className="field__input field__color-text"
              value={fieldValue}
              onChange={(e) => onFieldChange(e.target.value)}
              placeholder="#000000"
              disabled={field.disabled}
            />
          </div>
        );

      case "image":
        return (
          <ImageUploadField
            value={fieldValue}
            onChange={onFieldChange}
            fieldPath={path}
            siteId={siteId} // Pass this as a prop to CustomizationPanel
            label={field.label}
            hint={field.hint}
            accept={field.accept}
            multiple={field.multiple || false}
            showUrlInput={true}
            disabled={field.disabled}
          />
        );

      case "date":
      case "time":
      case "datetime-local":
        return (
          <input
            type={field.type}
            className="field__input"
            value={fieldValue}
            onChange={(e) => onFieldChange(e.target.value)}
            required={field.required}
            disabled={field.disabled}
          />
        );

      case "radio":
        return (
          <div className="field__radio-group">
            {field.options.map((option) => {
              const optionValue =
                typeof option === "object" ? option.value : option;
              const optionLabel =
                typeof option === "object" ? option.label : option;

              return (
                <label key={optionValue} className="field__radio-label">
                  <input
                    type="radio"
                    className="field__radio"
                    name={path}
                    value={optionValue}
                    checked={fieldValue === optionValue}
                    onChange={(e) => onFieldChange(e.target.value)}
                    disabled={field.disabled}
                  />
                  <span className="field__radio-custom"></span>
                  <span className="field__radio-text">{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case "range":
        return (
          <div className="field__range-wrapper">
            <input
              type="range"
              className="field__range"
              value={fieldValue}
              onChange={(e) => onFieldChange(parseFloat(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step || 1}
              required={field.required}
              disabled={field.disabled}
            />
            <span className="field__range-value">{fieldValue}</span>
          </div>
        );

      case "repeatable":
        // Handle repeatable fields (e.g., skills within a category, achievements within a job)
        const repeatableItems = Array.isArray(fieldValue)
          ? fieldValue
          : field.default || [];
        // Ensure at least one empty item for new repeatables
        const itemsToRender =
          repeatableItems.length > 0 ? repeatableItems : [""];

        return (
          <div className="field__repeatable">
            {itemsToRender.map((item, index) => (
              <div key={index} className="field__repeatable-item">
                <input
                  type="text"
                  className="field__input"
                  value={item || ""}
                  onChange={(e) => {
                    const newValue = [...itemsToRender];
                    newValue[index] = e.target.value;
                    onFieldChange(newValue);
                  }}
                  placeholder={
                    field.placeholder ||
                    `${field.itemLabel || "Item"} ${index + 1}`
                  }
                />
                {itemsToRender.length > 1 && (
                  <button
                    type="button"
                    className="field__repeatable-remove"
                    onClick={() => {
                      const newValue = [...itemsToRender];
                      newValue.splice(index, 1);
                      onFieldChange(newValue);
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {(!field.max || itemsToRender.length < field.max) && (
              <button
                type="button"
                className="field__repeatable-add"
                onClick={() => {
                  onFieldChange([...itemsToRender, ""]);
                }}
              >
                <Plus size={16} />
                Add {field.itemLabel || field.label || "Item"}
              </button>
            )}
          </div>
        );

      default:
        console.warn(`Unsupported field type: ${field.type}`);
        return null;
    }
  };

  return (
    <div className="customization-panel">
      <div className="customization-panel__tabs">
        {sectionKeys.map((sectionKey) => {
          const IconComponent = sectionIcons[sectionKey] || Layout;
          return (
            <button
              key={sectionKey}
              className={`customization-panel__tab ${
                activeSection === sectionKey ? "active" : ""
              }`}
              onClick={() => scrollToSection(sectionKey)}
              title={sectionKey}
            >
              <IconComponent size={20} />
            </button>
          );
        })}
      </div>

      <div className="customization-panel__content" ref={contentRef}>
        {sectionKeys.map((sectionKey) => (
          <div
            key={sectionKey}
            className="customization-panel__section"
            ref={(el) => (sectionRefs.current[sectionKey] = el)}
          >
            <h3 className="customization-panel__section-title">{sectionKey}</h3>
            {orderedSections[sectionKey].map(({ key, field }) =>
              renderField(key, field, customization[key], key)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomizationPanel;
