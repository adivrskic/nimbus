import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import CustomizationPanel from './CustomizationPanel';
import LivePreview from './LivePreview';
import { generateZip } from '../utils/generateZip';
import { renderTemplate, getTemplate } from '../utils/templateSystem';
import { getAllThemes } from '../styles/themes';
import PaymentModal from './PaymentModal';
import './CustomizeModal.scss';

const defaultTheme = 'minimal';

// Helper function to extract customizable fields from template
function getTemplateFields(template) {
  console.log('template: ', template);
  if (!template || !template.fields) return {};
  
  const customizable = {};
  
  // Convert template fields to customization format
  Object.entries(template.fields).forEach(([key, field]) => {
    customizable[key] = {
      type: field.type,
      label: field.label,
      default: field.default || '',
      required: field.required || false,
      ...(field.options && { options: field.options }),
      ...(field.fields && { fields: field.fields }),
      ...(field.min && { min: field.min }),
      ...(field.max && { max: field.max }),
      ...(field.accept && { accept: field.accept }),
      ...(field.itemLabel && { itemLabel: field.itemLabel })
    };
  });
  
  // Add theme selector (will be synced with global state)
  customizable.theme = {
    type: 'theme-selector',
    default: template.defaultTheme || 'minimal',
    label: 'Design Style',
    supportedThemes: template.supportedThemes
  };
  
  // Add color mode selector (local to preview only, doesn't affect global)
  // customizable.colorMode = {
  //   type: 'select',
  //   options: ['Light', 'Dark', 'Auto'],
  //   default: 'Auto',
  //   label: 'Preview Color Mode'
  // };
  
  // Add optional accent color override
  customizable.accentOverride = {
    type: 'color',
    default: '',
    label: 'Custom Accent (Optional)',
    optional: true
  };
  
  return customizable;
}

function CustomizeModal({ templateId, isOpen, onClose }) {
  const template = getTemplate(templateId);
  const themes = getAllThemes();
  const { theme: globalTheme, selectedStyleTheme, setStyleTheme } = useTheme();
  console.log(globalTheme, selectedStyleTheme)
  
  // Build template config from template system
  const templateConfig = template ? {
    id: template.id,
    name: template.name,
    category: template.category,
    customizable: getTemplateFields(template)
  } : null;
  
  const [customization, setCustomization] = useState(() => {
    const saved = localStorage.getItem(`template_${templateId}`);
    if (saved) {
      const data = JSON.parse(saved);
      // Migration for old data
      if (data.customization) {
        if (!data.customization.theme) {
          data.customization.theme = selectedStyleTheme;
        }
        if (data.customization.darkMode) {
          data.customization.colorMode = data.customization.darkMode;
          delete data.customization.darkMode;
        }
        return data.customization;
      }
      return data;
    }
    
    // Initialize with defaults from template and ThemeContext
    const defaults = {};
    if (templateConfig && templateConfig.customizable) {
      Object.entries(templateConfig.customizable).forEach(([key, config]) => {
        if (key === 'theme') {
          // Initialize with global selected style theme
          defaults[key] = selectedStyleTheme;
        } else if (key === 'colorMode') {
          // Default to Auto for preview
          defaults[key] = 'Auto';
        } else {
          defaults[key] = config.default;
        }
      });
    }
    return defaults;
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});

  // Initialize customization theme from global state when modal opens
  useEffect(() => {
    if (isOpen && selectedStyleTheme && customization.theme !== selectedStyleTheme) {
      setCustomization(prev => ({
        ...prev,
        theme: selectedStyleTheme
      }));
    }
  }, [isOpen, selectedStyleTheme]);

  // Save to localStorage
  useEffect(() => {
    if (customization && templateId) {
      localStorage.setItem(`template_${templateId}`, JSON.stringify({
        templateId,
        customization,
        theme: customization.theme || 'minimal',
        timestamp: Date.now()
      }));
    }
  }, [customization, templateId]);

  const handleCustomizationChange = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If theme is changed in customization panel, update global state
    if (field === 'theme') {
      setStyleTheme(value);
    }
  };

  const handlePreviewNewTab = () => {
    const effectiveColorMode = customization.colorMode?.toLowerCase() === 'auto'
      ? globalTheme
      : (customization.colorMode?.toLowerCase() || globalTheme);

    const html = renderTemplate(
      templateId,
      customization,
      customization.theme || 'minimal',
      effectiveColorMode
    );

    const previewWindow = window.open('', '_blank');
    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
  };


  const handleImageUpload = (fieldPath, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setUploadedImages(prev => ({
        ...prev,
        [fieldPath]: imageData
      }));
      handleCustomizationChange(fieldPath, imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    try {
      const blob = await generateZip(
        templateId, 
        customization, 
        customization.theme || 'minimal',
        customization.colorMode || 'auto'
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateId}-website.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate download:', error);
      alert('Failed to generate download. Please try again.');
    }
  };

  const handleDeploy = () => {
    setIsPaymentModalOpen(true);
  };

  if (!isOpen || !templateConfig) return null;

  return (
    <>
      <div className="modal-backdrop modal-backdrop--visible" onClick={onClose} />
      <div className="customize-modal customize-modal--visible">
        <div className="customize-modal__header">
          <div className="customize-modal__header-left">
            <button className="customize-modal__close" onClick={onClose}>
              <X size={24} />
            </button>
            <div>
              <h2 className="customize-modal__title">{templateConfig.name}</h2>
              <p className="customize-modal__subtitle">Customize your template and see changes in real-time</p>
            </div>
          </div>
          <div className="customize-modal__actions">
            <button className="btn btn-secondary" onClick={handlePreviewNewTab}>
              <Eye size={20} />
              Preview
            </button>
            <button className="btn btn-secondary" onClick={handleDownload}>
              <Download size={20} />
              Download
            </button>
            <button className="btn btn-primary" onClick={handleDeploy}>
              <ExternalLink size={20} />
              Deploy
            </button>
          </div>
        </div>

        <div className="customize-modal__content">
          <CustomizationPanel
            fields={templateConfig.customizable}
            customization={customization}
            onChange={handleCustomizationChange}
            onImageUpload={handleImageUpload}
            themes={themes}
          />
          <LivePreview
            templateId={templateId}
            customization={customization}
            images={uploadedImages}
          />
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        templateId={templateId}
        customization={customization}
      />
    </>
  );
}

export default CustomizeModal;