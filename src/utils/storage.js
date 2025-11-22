// storage.js
export function saveCustomization(templateId, customization, theme = 'minimal') {
  const data = {
    templateId,
    customization,
    theme,
    colorMode: customization.colorMode || 'auto',
    timestamp: Date.now()
  };
  localStorage.setItem(`template_${templateId}`, JSON.stringify(data));
}

export function loadCustomization(templateId) {
  const stored = localStorage.getItem(`template_${templateId}`);
  if (!stored) return null;
  
  const data = JSON.parse(stored);
  
  // Migration for old data structure
  if (!data.theme) {
    data.theme = 'minimal';
    data.colorMode = data.customization?.darkMode || 'auto';
    if (data.customization?.darkMode) {
      delete data.customization.darkMode;
    }
    if (data.customization?.accentColor) {
      data.customization.accentOverride = data.customization.accentColor;
      delete data.customization.accentColor;
    }
  }
  
  return data;
}

export function getAllSavedCustomizations() {
  const saved = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('template_')) {
      const data = JSON.parse(localStorage.getItem(key));
      saved.push(data);
    }
  }
  return saved.sort((a, b) => b.timestamp - a.timestamp);
}

export function deleteCustomization(templateId) {
  localStorage.removeItem(`template_${templateId}`);
}