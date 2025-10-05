import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import './CustomizationPanel.scss';

function CustomizationPanel({ 
  config, 
  values, 
  onChange, 
  images, 
  onImageChange,
  expandedGroups = {},
  onExpandedGroupsChange = () => {}
}) {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleGroup = (groupKey, index) => {
    const key = `${groupKey}-${index}`;
    onExpandedGroupsChange(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    const field = config[fieldName];
    const isStyleField = field?.type === 'color' || 
                         fieldName === 'darkMode' || 
                         fieldName === 'accentColor' ||
                         fieldName.toLowerCase().includes('font') ||
                         fieldName.toLowerCase().includes('color');
    
    const updates = {
      ...values,
      [fieldName]: value
    };

    // Track style modifications
    if (isStyleField) {
      updates.__userModifiedStyles = {
        ...values.__userModifiedStyles,
        [fieldName]: true
      };
    }

    onChange(updates);
  };

  const handleGroupFieldChange = (groupKey, index, fieldKey, value) => {
    const currentGroup = values[groupKey] || [];
    const updatedGroup = [...currentGroup];
    updatedGroup[index] = {
      ...updatedGroup[index],
      [fieldKey]: value
    };

    onChange({
      ...values,
      [groupKey]: updatedGroup
    });
  };

  const handleRepeatableChange = (fieldName, index, value) => {
    const currentArray = values[fieldName] || [];
    const updatedArray = [...currentArray];
    updatedArray[index] = value;

    onChange({
      ...values,
      [fieldName]: updatedArray
    });
  };

  const addRepeatableItem = (fieldName) => {
    const field = config[fieldName];
    const currentArray = values[fieldName] || [];
    
    if (field.max && currentArray.length >= field.max) return;

    onChange({
      ...values,
      [fieldName]: [...currentArray, '']
    });
  };

  const removeRepeatableItem = (fieldName, index) => {
    const field = config[fieldName];
    const currentArray = values[fieldName] || [];
    
    if (field.min && currentArray.length <= field.min) return;

    const updatedArray = currentArray.filter((_, i) => i !== index);
    
    onChange({
      ...values,
      [fieldName]: updatedArray
    });
  };

  const addGroupItem = (groupKey) => {
    const field = config[groupKey];
    const currentGroup = values[groupKey] || [];
    
    if (field.max && currentGroup.length >= field.max) return;

    const newItem = {};
    Object.keys(field.fields).forEach(key => {
      const fieldConfig = field.fields[key];
      newItem[key] = fieldConfig.default || '';
    });

    onChange({
      ...values,
      [groupKey]: [...currentGroup, newItem]
    });
  };

  const removeGroupItem = (groupKey, index) => {
    const field = config[groupKey];
    const currentGroup = values[groupKey] || [];
    
    if (field.min && currentGroup.length <= field.min) return;

    const updatedGroup = currentGroup.filter((_, i) => i !== index);
    
    onChange({
      ...values,
      [groupKey]: updatedGroup
    });
  };

  const toggleVisibility = (fieldPath) => {
    const currentVisibility = values.__visibility || {};
    
    onChange({
      ...values,
      __visibility: {
        ...currentVisibility,
        [fieldPath]: !currentVisibility[fieldPath]
      }
    });
  };

  const handleImageUpload = (fieldName, file) => {
    if (!file) return;
    
    // Compress images before storing
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 1920;
        const maxHeight = 1920;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          onImageChange(fieldName, {
            name: file.name,
            url: canvas.toDataURL('image/jpeg', 0.85),
            file: blob
          });
        }, 'image/jpeg', 0.85);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (fieldName) => {
    onImageChange(fieldName, null);
  };

  const handleMultipleImageUpload = (fieldName, files) => {
    const currentImages = images[fieldName] || [];
    const field = config[fieldName];
    
    // Check max limit
    const remainingSlots = field.max ? field.max - currentImages.length : Infinity;
    const filesToProcess = files.slice(0, remainingSlots);
    
    let processedCount = 0;
    const newImages = [];
    
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          name: file.name,
          url: reader.result,
          file: file
        });
        
        processedCount++;
        if (processedCount === filesToProcess.length) {
          onImageChange(fieldName, [...currentImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMultipleImageRemove = (fieldName, index) => {
    const currentImages = images[fieldName] || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    onImageChange(fieldName, updatedImages.length > 0 ? updatedImages : null);
  };

  const renderField = (key, field) => {
    const value = values[key] ?? field.default;
    const isVisible = values.__visibility?.[key] !== false;
    
    const isStyleField = field.type === 'color' || 
                         key === 'darkMode' || 
                         key === 'accentColor' ||
                         key.toLowerCase().includes('font') ||
                         key.toLowerCase().includes('color');
    const isUserModified = values.__userModifiedStyles?.[key];

    // Single image upload
    if (field.type === 'image') {
      const currentImage = images[key];
      
      return (
        <div key={key} className="field" data-field={key}>
          <div className="field__header">
            <label className="field__label">{field.label}</label>
          </div>
          
          <div className="field__image">
            <input
              type="file"
              id={`image-${key}`}
              className="field__image-input"
              accept={field.accept || 'image/*'}
              onChange={(e) => handleImageUpload(key, e.target.files[0])}
            />
            
            <label htmlFor={`image-${key}`} className="field__image-label">
              <div className="field__image-preview">
                {currentImage ? (
                  <img src={currentImage.url} alt={field.label} />
                ) : (
                  <div className="field__image-placeholder">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>Click to upload image</span>
                  </div>
                )}
              </div>
            </label>
            
            {currentImage && (
              <div className="field__image-actions">
                <div className="field__image-info">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {currentImage.name}
                </div>
                <button
                  className="field__image-remove"
                  onClick={() => handleImageRemove(key)}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Multiple images upload
    if (field.type === 'images') {
      const currentImages = images[key] || [];
      
      return (
        <div key={key} className="field" data-field={key}>
          <div className="field__header">
            <label className="field__label">
              {field.label}
            </label>
          </div>
          
          <div className="field__images-grid">
            {currentImages.map((img, index) => (
              <div key={index} className="field__image-item">
                <img src={img.url} alt={`${field.label} ${index + 1}`} />
                <button
                  className="field__image-item-remove"
                  onClick={() => handleMultipleImageRemove(key, index)}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
            
            {(!field.max || currentImages.length < field.max) && (
              <label className="field__image-add" htmlFor={`images-${key}`}>
                <input
                  type="file"
                  id={`images-${key}`}
                  className="field__image-input"
                  accept={field.accept || 'image/*'}
                  multiple
                  onChange={(e) => handleMultipleImageUpload(key, Array.from(e.target.files))}
                />
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Add Images</span>
              </label>
            )}
          </div>
          
          {field.max && (
            <div className="field__image-limit">
              {currentImages.length} / {field.max} images
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'group') {
      const groupItems = values[key] || field.default || [];
      
      return (
        <div key={key} className="field field--group">
          <div className="field__header">
            <label className="field__label">
              {field.label}
            </label>
          </div>

          <div className="field__group">
            {groupItems.map((item, index) => {
              const isExpanded = expandedGroups[`${key}-${index}`];
              const itemPath = `${key}.${index}`;
              const itemVisible = values.__visibility?.[itemPath] !== false;

              return (
                <div key={index} className="field__group-item">
                  <div className="field__group-item-header">
                    <button
                      className="field__group-item-toggle"
                      onClick={() => toggleGroup(key, index)}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className={`field__group-item-arrow ${!isExpanded ? 'collapsed' : ''}`}
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="field__group-item-title">
                        {field.itemLabel || 'Item'} {index + 1}
                      </span>
                    </button>
                    
                    <div className="field__actions">
                      {field.hideable !== false && (
                        <button
                          className="field__action"
                          onClick={() => toggleVisibility(itemPath)}
                          title={itemVisible ? 'Hide' : 'Show'}
                        >
                          {itemVisible ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 3C4.5 3 1.73 5.11 1 8c.73 2.89 3.5 5 7 5s6.27-2.11 7-5c-.73-2.89-3.5-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
                              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M3 3l10 10M8 5.5A2.5 2.5 0 0110.5 8M6.5 8A2.5 2.5 0 018 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          )}
                        </button>
                      )}
                      
                      <button
                        className="field__group-item-remove"
                        onClick={() => removeGroupItem(key, index)}
                        disabled={field.min && groupItems.length <= field.min}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                {isExpanded && (
                  <div className="field__group-item-fields">
                    {Object.entries(field.fields).map(([fieldKey, fieldConfig]) => (
                      <div key={fieldKey} className="field__group-field">
                        <label className="field__group-field-label">{fieldConfig.label}</label>
                        
                        {/* Handle image type in group fields */}
                        {fieldConfig.type === 'image' ? (
                          <div className="field__group-image">
                            <input
                              type="file"
                              id={`group-image-${key}-${index}-${fieldKey}`}
                              className="field__image-input"
                              accept={fieldConfig.accept || 'image/*'}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  // Store in images object with a special key for group items
                                  const imageKey = `${key}.${index}.${fieldKey}`;
                                  onImageChange(imageKey, {
                                    name: file.name,
                                    url: reader.result,
                                    file: file
                                  });
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                            
                            <label htmlFor={`group-image-${key}-${index}-${fieldKey}`} className="field__image-label">
                              {(() => {
                                const imageKey = `${key}.${index}.${fieldKey}`;
                                const currentImage = images[imageKey];
                                
                                return (
                                  <div className="field__group-image-preview">
                                    {currentImage ? (
                                      <img src={currentImage.url} alt={fieldConfig.label} />
                                    ) : (
                                      <div className="field__image-placeholder">
                                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span>Upload image</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </label>
                            
                            {(() => {
                              const imageKey = `${key}.${index}.${fieldKey}`;
                              const currentImage = images[imageKey];
                              
                              return currentImage ? (
                                <button
                                  className="field__group-image-remove"
                                  onClick={() => onImageChange(imageKey, null)}
                                >
                                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                  </svg>
                                  Remove
                                </button>
                              ) : null;
                            })()}
                          </div>
                        ) : fieldConfig.type === 'select' ? (
                          <select
                            className="field__select"
                            value={item[fieldKey] ?? fieldConfig.default}
                            onChange={(e) => handleGroupFieldChange(key, index, fieldKey, e.target.value)}
                          >
                            {fieldConfig.options.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : fieldConfig.type === 'textarea' ? (
                          <textarea
                            className="field__textarea"
                            value={item[fieldKey] ?? fieldConfig.default}
                            onChange={(e) => handleGroupFieldChange(key, index, fieldKey, e.target.value)}
                            rows={3}
                          />
                        ) : (
                          <input
                            type="text"
                            className="field__input"
                            value={item[fieldKey] ?? fieldConfig.default}
                            onChange={(e) => handleGroupFieldChange(key, index, fieldKey, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                </div>
              );
            })}
          </div>

          <button
            className="field__group-add"
            onClick={() => addGroupItem(key)}
            disabled={field.max && groupItems.length >= field.max}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add {field.itemLabel || 'Item'}
          </button>
        </div>
      );
    }

    if (field.type === 'repeatable') {
      const items = values[key] || field.default || [];
      
      return (
        <div key={key} className="field">
          <div className="field__header">
            <label className="field__label">{field.label}</label>
          </div>

          <div className="field__repeatable">
            {items.map((item, index) => {
              const itemPath = `${key}.${index}`;
              const itemVisible = values.__visibility?.[itemPath] !== false;

              return (
                <div key={index} className="field__repeatable-item">
                  <div className="field__repeatable-number">{index + 1}</div>
                  <input
                    type="text"
                    className="field__input"
                    value={item}
                    onChange={(e) => handleRepeatableChange(key, index, e.target.value)}
                  />
                  <div className="field__actions">
                    {field.hideable !== false && (
                      <button
                        className="field__action"
                        onClick={() => toggleVisibility(itemPath)}
                        title={itemVisible ? 'Hide' : 'Show'}
                      >
                        {itemVisible ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3C4.5 3 1.73 5.11 1 8c.73 2.89 3.5 5 7 5s6.27-2.11 7-5c-.73-2.89-3.5-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 3l10 10M8 5.5A2.5 2.5 0 0110.5 8M6.5 8A2.5 2.5 0 018 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                      </button>
                    )}
                    <button
                      className="field__repeatable-remove"
                      onClick={() => removeRepeatableItem(key, index)}
                      disabled={field.min && items.length <= field.min}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="field__repeatable-add"
            onClick={() => addRepeatableItem(key)}
            disabled={field.max && items.length >= field.max}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add {field.itemLabel || 'Item'}
          </button>
        </div>
      );
    }

    return (
      <div key={key} className="field" data-field={key}>
        <div className="field__header">
          <label className="field__label">
            {field.label}
            {isStyleField && isUserModified && (
              <span className="style-modified-badge" title="Custom style applied">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </label>
        </div>
        
        {field.type === 'text' && (
          <input
            type="text"
            className="field__input"
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
          />
        )}
        
        {field.type === 'textarea' && (
          <textarea
            className="field__textarea"
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            rows={4}
          />
        )}
        
        {field.type === 'color' && (
          <div className="field__color-wrapper">
            <input
              type="color"
              className="field__color-input"
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
            />
            <input
              type="text"
              className="field__color-text field__input"
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              placeholder="#000000"
            />
          </div>
        )}
        
        {field.type === 'select' && (
          <select
            className="field__select"
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
          >
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className={`customization-panel ${isPanelExpanded ? 'customization-panel--expanded' : ''}`}>
      {isMobile && (
        <div className="customization-panel__toggle" onClick={() => setIsPanelExpanded(!isPanelExpanded)}>
          <div className="customization-panel__toggle-content">
            <div className="customization-panel__toggle-text">
              {isPanelExpanded ? 'Close Panel' : 'Customize Template'}
            </div>
            <div className="customization-panel__toggle-hint">
              {isPanelExpanded ? 'Tap to see full preview' : 'Tap to edit fields'}
            </div>
          </div>
          <div className="customization-panel__toggle-icon">
            <ChevronUp size={18} />
          </div>
        </div>
      )}
      
      <div className="customization-panel__content">
        {Object.entries(config).map(([key, field]) => renderField(key, field))}
      </div>
    </div>
  );
}

export default CustomizationPanel;