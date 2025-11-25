import { useState, useRef, useEffect } from 'react';
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
  Layout
} from 'lucide-react';
import { getAllThemes } from '../styles/themes';
import { useTheme } from '../contexts/ThemeContext';
import './CustomizationPanel.scss';

function CustomizationPanel({ fields, customization, onChange, onImageUpload }) {
  const [visibleFields, setVisibleFields] = useState({});
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const sectionRefs = useRef({});
  const contentRef = useRef(null);
  const themes = getAllThemes();
  const { setStyleTheme, toggleTheme } = useTheme();

  // Icon mapping for sections
  const sectionIcons = {
    'Design Style': Palette,
    'Basic Info': User,
    'Images & Media': ImageIcon,
    'Content': FileText,
    'Features': Star,
    'Portfolio': Briefcase,
    'Statistics': BarChart3,
    'Testimonials': MessageSquare,
    'Team': Users,
    'Pricing': DollarSign,
    'Call to Action': Megaphone,
    'Contact Info': Mail,
    'Social Links': Share2,
    'General': Layout
  };

  // Automatically categorize fields into sections
  const categorizeField = (key, field) => {
    // Check if field explicitly defines a section
    if (field.section) return field.section;
    
    // Theme selector gets its own section
    if (field.type === 'theme-selector') return 'Design Style';
    
    // Color mode selector
    if (key === 'colorMode') return 'Design Style';
    
    // Images and visual content
    if (field.type === 'image' || key.includes('image') || key.includes('photo') || key.includes('logo')) {
      return 'Images & Media';
    }
    
    // Group fields for structured content
    if (field.type === 'group') {
      // Categorize based on the label or key
      if (key.includes('feature') || key.includes('service')) return 'Features';
      if (key.includes('project') || key.includes('work') || key.includes('portfolio')) return 'Portfolio';
      if (key.includes('testimonial') || key.includes('review')) return 'Testimonials';
      if (key.includes('team') || key.includes('member') || key.includes('instructor')) return 'Team';
      if (key.includes('pricing') || key.includes('plan')) return 'Pricing';
      if (key.includes('stat') || key.includes('metric')) return 'Statistics';
      if (key.includes('social') || key.includes('link')) return 'Social Links';
      if (key.includes('curriculum') || key.includes('module')) return 'Content';
      return 'Content';
    }
    
    // Contact and social
    if (key.includes('email') || key.includes('phone') || key.includes('contact') || key.includes('address')) {
      return 'Contact Info';
    }
    
    if (key.includes('social') || key.includes('twitter') || key.includes('linkedin')) {
      return 'Social Links';
    }
    
    // Main content fields
    if (key.includes('title') || key.includes('headline') || key.includes('name') || 
        key.includes('tagline') || key.includes('bio') || key.includes('description') ||
        key.includes('about')) {
      return 'Basic Info';
    }
    
    // CTA and buttons
    if (key.includes('cta') || key.includes('button')) {
      return 'Call to Action';
    }
    
    // Default section
    return 'Basic Info';
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
    'Design Style',
    'Basic Info',
    'Images & Media',
    'Content',
    'Features',
    'Portfolio',
    'Statistics',
    'Testimonials',
    'Team',
    'Pricing',
    'Call to Action',
    'Contact Info',
    'Social Links'
  ];

  // Sort sections by preferred order
  const orderedSections = {};
  sectionOrder.forEach(sectionName => {
    if (sections[sectionName]) {
      orderedSections[sectionName] = sections[sectionName];
    }
  });
  // Add any remaining sections not in the preferred order
  Object.keys(sections).forEach(sectionName => {
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

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollTop = contentRef.current.scrollTop;
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      const offset = 100; // Offset for sticky header

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
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, [sectionKeys]);

  const scrollToSection = (sectionKey) => {
    const sectionElement = sectionRefs.current[sectionKey];
    if (sectionElement && contentRef.current) {
      const offset = 60; // Account for sticky tabs
      const elementPosition = sectionElement.offsetTop;
      contentRef.current.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const handleThemeChange = (path, themeId) => {
    console.log(themeId);
    onChange(path, themeId);
    setStyleTheme(themeId); // Update global state
  };

  const handleColorModeChange = (path, colorMode) => {
    onChange(path, colorMode);
    // Optionally update global theme if colorMode is changed
    // This is more complex as colorMode uses "Light"/"Dark"/"Auto" while global uses "light"/"dark"
    // For now, we'll just update the customization
  };

  const toggleFieldVisibility = (fieldKey) => {
    setVisibleFields(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
    
    // Reset to default if hiding
    if (!visibleFields[fieldKey]) {
      onChange(fieldKey, fields[fieldKey].default);
    }
  };

  const toggleGroupCollapse = (groupKey, index) => {
    const key = `${groupKey}_${index}`;
    setCollapsedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
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
    if (field.type === 'theme-selector') {
      return (
        <div key={key} className="field field--theme-selector">
          {/* <div className="field__header">
            <label className="field__label">
              <span className="field__required">Choose your design style</span>
            </label>
          </div> */}
          <div className="theme-selector-grid">
            {themes.map(theme => (
              <button
                key={theme.id}
                type="button"
                className={`theme-option ${value === theme.id ? 'active' : ''}`}
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
    
    if (field.type === 'group') {
      const groupValue = value || field.default || [];
      
      return (
        <div key={key} className={`field field--group ${isHidden ? 'field--hidden' : ''}`}>
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
                  title={isHidden ? 'Show field' : 'Hide field'}
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
                          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                          <span className="field__group-item-title">
                            {field.itemLabel} {index + 1}
                            {item[Object.keys(field.fields)[0]] && `: ${item[Object.keys(field.fields)[0]]}`}
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
                          {Object.entries(field.fields).map(([fieldKey, fieldConfig]) => {
                            const fieldPath = `${path}[${index}].${fieldKey}`;
                            const fieldValue = item[fieldKey] || fieldConfig.default;
                            
                            return (
                              <div key={fieldKey} className="field__group-field">
                                <label className="field__group-field-label">
                                  {fieldConfig.label}
                                </label>
                                {renderFieldInput(fieldConfig, fieldValue, (newValue) => {
                                  const newGroupValue = [...groupValue];
                                  newGroupValue[index] = {
                                    ...newGroupValue[index],
                                    [fieldKey]: newValue
                                  };
                                  onChange(path, newGroupValue);
                                }, fieldPath)}
                              </div>
                            );
                          })}
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
                    Object.entries(field.fields).forEach(([fieldKey, fieldConfig]) => {
                      newItem[fieldKey] = fieldConfig.default || '';
                    });
                    onChange(path, [...groupValue, newItem]);
                  }}
                >
                  <Plus size={16} />
                  Add {field.itemLabel || 'Item'}
                </button>
              )}
            </>
          )}
        </div>
      );
    }

    if (field.type === 'repeatable') {
      const repeatableValue = value || field.default || [''];
      
      return (
        <div key={key} className={`field ${isHidden ? 'field--hidden' : ''}`}>
          <div className="field__header">
            <label className="field__label">
              {field.label}
              {field.optional && <span className="field__optional">Optional</span>}
            </label>
            {field.optional && (
              <button
                type="button"
                className="field__toggle"
                onClick={() => toggleFieldVisibility(key)}
                title={isHidden ? 'Show field' : 'Hide field'}
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
                  onChange(path, [...repeatableValue, '']);
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
      <div key={key} className={`field ${isHidden ? 'field--hidden' : ''}`}>
        <div className="field__header">
          <label className="field__label">
            {field.label}
            {field.optional && <span className="field__optional">Optional</span>}
          </label>
          {field.optional && (
            <button
              type="button"
              className="field__toggle"
              onClick={() => toggleFieldVisibility(key)}
              title={isHidden ? 'Show field' : 'Hide field'}
            >
              {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          )}
        </div>
        {!isHidden && renderFieldInput(field, value, (newValue) => onChange(path, newValue), path)}
      </div>
    );
  };

  const renderFieldInput = (field, value, onFieldChange, path) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'tel':
        return (
          <input
            type={field.type}
            className="field__input"
            value={value || ''}
            onChange={(e) => onFieldChange(e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <textarea
            className="field__textarea"
            value={value || ''}
            onChange={(e) => onFieldChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
          />
        );

      case 'select':
        return (
          <select
            className="field__select"
            value={value || field.default}
            onChange={(e) => onFieldChange(e.target.value)}
          >
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="field__color-wrapper">
            <input
              type="color"
              className="field__color-input"
              value={value || field.default}
              onChange={(e) => onFieldChange(e.target.value)}
            />
            <input
              type="text"
              className="field__input field__color-text"
              value={value || field.default}
              onChange={(e) => onFieldChange(e.target.value)}
              placeholder="#000000"
            />
          </div>
        );

      case 'image':
        return (
          <div className="field__image">
            <input
              type="file"
              accept="image/*"
              className="field__image-input"
              id={`image-${path}`}
              onChange={(e) => handleFileUpload(path, e)}
            />
            <label htmlFor={`image-${path}`} className="field__image-label">
              <div className="field__image-preview">
                {value ? (
                  <img src={value} alt="Preview" />
                ) : (
                  <div className="field__image-placeholder">
                    <ImageIcon size={32} />
                    <span>Click to upload image</span>
                  </div>
                )}
              </div>
            </label>
            {value && (
              <button
                type="button"
                className="field__image-remove"
                onClick={() => onFieldChange('')}
              >
                <Trash2 size={16} />
                Remove Image
              </button>
            )}
          </div>
        );

      default:
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
              className={`customization-panel__tab ${activeSection === sectionKey ? 'active' : ''}`}
              onClick={() => scrollToSection(sectionKey)}
              title={sectionKey}
            >
              <IconComponent size={20} />
              {/* <span className="customization-panel__tab-label">{sectionKey}</span> */}
            </button>
          );
        })}
      </div>
      
      <div className="customization-panel__content" ref={contentRef}>
        {sectionKeys.map((sectionKey) => (
          <div
            key={sectionKey}
            className="customization-panel__section"
            ref={(el) => sectionRefs.current[sectionKey] = el}
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