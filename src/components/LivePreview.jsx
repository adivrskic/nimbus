import { useState, useEffect, useRef } from 'react';
import { Monitor, Tablet, Smartphone, Sun, Moon } from 'lucide-react';
import { renderTemplate } from '../utils/templateSystem';
import { useTheme } from '../contexts/ThemeContext';
import './LivePreview.scss';

function LivePreview({ templateId, customization, images }) {
  const { theme: globalTheme } = useTheme();
  const [viewMode, setViewMode] = useState('desktop');
  
  // Local color mode state - doesn't affect global theme
  const [localColorMode, setLocalColorMode] = useState(() => {
    if (customization?.colorMode) {
      return customization.colorMode.toLowerCase();
    }
    return 'auto';
  });
  
  const iframeRef = useRef(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (iframeRef.current?.dataset.blobUrl) {
        URL.revokeObjectURL(iframeRef.current.dataset.blobUrl);
      }
    };
  }, []);

  // Update local color mode when customization changes
  useEffect(() => {
    if (customization?.colorMode) {
      const normalized = customization.colorMode.toLowerCase();
      setLocalColorMode(normalized);
    }
  }, [customization?.colorMode]);

  // Render the template with the current settings
  useEffect(() => {
    if (!templateId || !customization) return;

    // Determine the actual color mode to use
    let effectiveColorMode = localColorMode;
    
    // If set to auto, use the global theme
    if (localColorMode === 'auto') {
      effectiveColorMode = globalTheme;
    }

    // Generate HTML with theme system
    const html = renderTemplate(
      templateId, 
      customization, 
      customization.theme || 'minimal',
      effectiveColorMode
    );

    // Update iframe content with proper UTF-8 encoding
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      
      // First try using srcdoc for better UTF-8 handling
      // srcdoc handles encoding better than blob URLs
      iframe.srcdoc = html;
      
      // Fallback: Create a blob with proper UTF-8 encoding
      // This is kept as backup but srcdoc should work better
      const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // Clean up previous URL if it exists
      if (iframe.dataset.blobUrl) {
        URL.revokeObjectURL(iframe.dataset.blobUrl);
      }
      
      // Store the URL for cleanup (even though we're using srcdoc)
      iframe.dataset.blobUrl = url;
    }
  }, [templateId, customization, images, localColorMode, globalTheme]);

  // Handle color mode toggle - only affects preview, not global state
  const handleColorModeChange = (mode) => {
    setLocalColorMode(mode);
  };

  // Get the actual display mode considering 'auto'
  const getDisplayMode = () => {
    if (localColorMode === 'auto') {
      return globalTheme;
    }
    return localColorMode;
  };

  return (
    <div className="live-preview">
      <div className="live-preview__toolbar">
        <div className="live-preview__controls">
          <button
            className={`live-preview__control ${viewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setViewMode('desktop')}
            title="Desktop view"
          >
            <Monitor size={20} />
          </button>
          <button
            className={`live-preview__control ${viewMode === 'tablet' ? 'active' : ''}`}
            onClick={() => setViewMode('tablet')}
            title="Tablet view"
          >
            <Tablet size={20} />
          </button>
          <button
            className={`live-preview__control ${viewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewMode('mobile')}
            title="Mobile view"
          >
            <Smartphone size={20} />
          </button>
        </div>
        
        {/* <div className="live-preview__controls">
          <button
            className={`live-preview__control ${getDisplayMode() === 'light' ? 'active' : ''}`}
            onClick={() => handleColorModeChange('light')}
            title="Light mode preview"
          >
            <Sun size={20} />
          </button>
          <button
            className={`live-preview__control ${getDisplayMode() === 'dark' ? 'active' : ''}`}
            onClick={() => handleColorModeChange('dark')}
            title="Dark mode preview"
          >
            <Moon size={20} />
          </button>
        </div> */}

        <div>
          <span className="live-preview__label">Preview: </span>
          <span className="live-preview__mode">{viewMode}</span>
        </div>
      </div>
      
      <div className="live-preview__content">
        <div className={`live-preview__frame-wrapper live-preview__frame-wrapper--${viewMode}`}>
          <iframe
            ref={iframeRef}
            className="live-preview__iframe"
            title="Template Preview"
          />
        </div>
      </div>
    </div>
  );
}

export default LivePreview;