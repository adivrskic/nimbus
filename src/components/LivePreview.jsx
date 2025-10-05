import { useEffect, useRef, useState } from 'react';
import { generateHTML } from '../utils/templateRenderer';
import './LivePreview.scss';

function LivePreview({ templateId, customization, images, onFieldClick }) {
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);
  const lastCustomizationRef = useRef(null);

  // Initialize iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIframeReady(true);
    };

    iframe.addEventListener('load', handleLoad);
    
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [templateId]); // Only re-run when template changes

  // Update iframe content
  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) {
      console.error('Cannot access iframe document');
      return;
    }

    const isMobile = window.innerWidth <= 1024;

    try {
      const html = generateHTML(templateId, customization, images);
      
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // Store current customization
      lastCustomizationRef.current = customization;

      // Apply interactivity after a short delay
      const timeoutId = setTimeout(() => {
        const visibility = customization.__visibility || {};
        
        // Hide elements based on visibility settings
        Object.entries(visibility).forEach(([key, isVisible]) => {
          if (!isVisible) {
            const elements = iframeDoc.querySelectorAll(`[data-editable="${key}"]`);
            elements.forEach(el => {
              const container = el.closest(
                '.contact-item, .skill-tag, .service-card, .feature-card, ' +
                '.stat, .stat-item, .project-card, .social-link, .social-item, ' +
                '.menu-item, .info-item, .contact-list, .skills-grid, .group-item, ' +
                '.pricing-card, .testimonial-content, .expertise-tag, .link-item, ' +
                '.service-card, .menu-category'
              );
              if (container) {
                container.style.display = 'none';
              } else {
                el.style.display = 'none';
              }
            });
          }
        });

        if (onFieldClick && !isMobile) {
          const editableElements = iframeDoc.querySelectorAll('[data-editable]');
          editableElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.style.transition = 'opacity 0.2s';
            
            element.addEventListener('mouseenter', () => {
              element.style.opacity = '0.7';
            });
            
            element.addEventListener('mouseleave', () => {
              element.style.opacity = '1';
            });
            
            element.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const fieldName = element.getAttribute('data-editable');
              
              // Handle group fields (e.g., "contactInfo.0.value")
              if (fieldName.includes('.')) {
                const parts = fieldName.split('.');
                const groupKey = parts[0];
                
                // Just pass to parent - it will handle the expansion
                onFieldClick(fieldName);
              } else {
                onFieldClick(fieldName);
              }
            });
          });
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  }, [templateId, customization, images, onFieldClick]);

  const [viewMode, setViewMode] = useState('desktop');

  return (
    <div className="live-preview">
      <div className="live-preview__toolbar">
        <div className="live-preview__controls">
          <button 
            className={`live-preview__control ${viewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setViewMode('desktop')}
            title="Desktop view"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 14V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button 
            className={`live-preview__control ${viewMode === 'tablet' ? 'active' : ''}`}
            onClick={() => setViewMode('tablet')}
            title="Tablet view"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="5" y="2" width="10" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="15.5" r="0.5" fill="currentColor"/>
            </svg>
          </button>
          <button 
            className={`live-preview__control ${viewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewMode('mobile')}
            title="Mobile view"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="6" y="2" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="15.5" r="0.5" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="live-preview__label">
          Live Preview · Click to edit · 
          <span className="live-preview__mode">
            {viewMode === 'desktop' && ' Desktop'}
            {viewMode === 'tablet' && ' Tablet'}
            {viewMode === 'mobile' && ' Mobile'}
          </span>
        </div>
      </div>
      
      <div className="live-preview__content">
        <div className={`live-preview__frame-wrapper live-preview__frame-wrapper--${viewMode}`}>
          <iframe
            ref={iframeRef}
            className="live-preview__iframe"
            title="Template Preview"
            sandbox="allow-scripts allow-same-origin"
            srcDoc="<!DOCTYPE html><html><head></head><body style='margin:0;padding:20px;font-family:sans-serif;'>Loading preview...</body></html>"
          />
        </div>
      </div>
    </div>
  );
}

export default LivePreview;