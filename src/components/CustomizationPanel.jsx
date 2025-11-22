import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Eye, EyeOff, X, Upload, Image } from 'lucide-react';
import { getAllThemes } from '../styles/themes';
import { useTheme } from '../contexts/ThemeContext';
import './CustomizationPanel.scss';

function CustomizationPanel({ fields, customization, onChange, onImageUpload }) {
  const [visibleFields, setVisibleFields] = useState({});
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const themes = getAllThemes();
  const { setStyleTheme, toggleTheme } = useTheme();

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
          <div className="field__header">
            <label className="field__label">
              <span className="field__required">Choose your design style</span>
            </label>
          </div>
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
                    <Image size={32} />
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
      <div className="customization-panel__content">
        {Object.entries(fields).map(([key, field]) => 
          renderField(key, field, customization[key], key)
        )}
      </div>
    </div>
  );
}

export default CustomizationPanel;