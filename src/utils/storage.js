// utils/storage.js - Add storage quota management
export const storage = {
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      // Check size (rough estimate: 1 char ≈ 2 bytes)
      const sizeInMB = (serialized.length * 2) / (1024 * 1024);
      
      if (sizeInMB > 4) { // Warn if approaching 5MB limit
        console.warn(`Large storage item: ${sizeInMB.toFixed(2)}MB`);
      }
      
      localStorage.setItem(key, serialized);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // Clear old customizations
        this.cleanup();
        // Try again
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch {
          alert('Storage full. Please download your work and refresh.');
        }
      }
      return false;
    }
  },
  
  cleanup() {
    const keys = Object.keys(localStorage);
    const customizationKeys = keys.filter(k => k.startsWith('template_customization_'));
    // Keep only last 5 customizations
    if (customizationKeys.length > 5) {
      customizationKeys.slice(0, -5).forEach(k => localStorage.removeItem(k));
    }
  }
};