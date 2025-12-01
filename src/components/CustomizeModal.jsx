import { useState, useEffect } from "react";
import { X, Download, ExternalLink, Eye, Save } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import CustomizationPanel from "./CustomizationPanel";
import LivePreview from "./LivePreview";
import { generateZip } from "../utils/generateZip";
import { renderTemplate, getTemplate } from "../utils/templateSystem";
import { getAllThemes } from "../styles/themes";
import PaymentModal from "./PaymentModal";
import NotificationModal from "./NotificationModal";
import SaveDraftModal from "./SaveDraftModal";
import "./CustomizeModal.scss";

const defaultTheme = "minimal";

// Helper function to extract customizable fields from template
function getTemplateFields(template) {
  console.log("template: ", template);
  if (!template || !template.fields) return {};

  const customizable = {};

  // Convert template fields to customization format
  Object.entries(template.fields).forEach(([key, field]) => {
    customizable[key] = {
      type: field.type,
      label: field.label,
      default: field.default || "",
      required: field.required || false,
      ...(field.options && { options: field.options }),
      ...(field.fields && { fields: field.fields }),
      ...(field.min && { min: field.min }),
      ...(field.max && { max: field.max }),
      ...(field.accept && { accept: field.accept }),
      ...(field.itemLabel && { itemLabel: field.itemLabel }),
    };
  });

  // Add theme selector (will be synced with global state)
  customizable.theme = {
    type: "theme-selector",
    default: template.defaultTheme || "minimal",
    label: "Design Style",
    supportedThemes: template.supportedThemes,
  };

  // Add color mode selector (local to preview only, doesn't affect global)
  // customizable.colorMode = {
  //   type: 'select',
  //   options: ['Light', 'Dark', 'Auto'],
  //   default: 'Auto',
  //   label: 'Preview Color Mode'
  // };

  // Add optional accent color override
  // customizable.accentOverride = {
  //   type: 'color',
  //   default: '',
  //   label: 'Custom Accent (Optional)',
  //   optional: true
  // };

  return customizable;
}

function CustomizeModal({ templateId, isOpen, onClose }) {
  const template = getTemplate(templateId);
  const themes = getAllThemes();
  const { theme: globalTheme, selectedStyleTheme, setStyleTheme } = useTheme();
  const { user, isAuthenticated, supabase } = useAuth();
  console.log(globalTheme, selectedStyleTheme);
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [mobileView, setMobileView] = useState("editor"); // 'editor' | 'preview'
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  // Build template config from template system
  const templateConfig = template
    ? {
        id: template.id,
        name: template.name,
        category: template.category,
        customizable: getTemplateFields(template),
      }
    : null;

  const [customization, setCustomization] = useState(() => {
    // First, get defaults from template
    const defaults = {};
    if (templateConfig && templateConfig.customizable) {
      Object.entries(templateConfig.customizable).forEach(([key, config]) => {
        if (key === "theme") {
          // Initialize with global selected style theme
          defaults[key] = selectedStyleTheme;
        } else if (key === "colorMode") {
          // Default to Auto for preview
          defaults[key] = "Auto";
        } else {
          defaults[key] = config.default;
        }
      });
    }

    // Then, try to load saved data
    const saved = localStorage.getItem(`template_${templateId}`);
    if (saved) {
      const data = JSON.parse(saved);
      // Migration for old data
      let savedCustomization = data.customization || data;

      if (savedCustomization.darkMode) {
        savedCustomization.colorMode = savedCustomization.darkMode;
        delete savedCustomization.darkMode;
      }
      if (!savedCustomization.theme) {
        savedCustomization.theme = selectedStyleTheme;
      }

      // IMPORTANT: Merge saved data with defaults to ensure new fields appear
      // Defaults come first, then override with saved values
      return { ...defaults, ...savedCustomization };
    }

    // No saved data, return defaults
    return defaults;
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});

  // Add this useEffect after your existing useEffects (around line ~120)
  useEffect(() => {
    // Check if we're editing a draft from localStorage
    const editDraftData = localStorage.getItem("editDraft");
    const isEditing = localStorage.getItem("isEditingDraft");

    if (isOpen && isEditing && editDraftData) {
      try {
        const draft = JSON.parse(editDraftData);

        console.log("Loading draft for editing:", draft);

        // Update customization with draft data
        setCustomization({
          ...customization, // Keep any existing defaults
          ...draft.customization,
          theme: draft.theme || selectedStyleTheme,
          colorMode: draft.colorMode || "Auto",
        });

        setEditingDraftId(draft.id);
        setIsEditingDraft(true);

        // Clear the localStorage flags
        localStorage.removeItem("editDraft");
        localStorage.removeItem("isEditingDraft");

        // Show notification
        setNotification({
          isOpen: true,
          message: `Loaded draft: "${draft.draftName || draft.templateId}"`,
          type: "success",
        });
      } catch (error) {
        console.error("Error loading draft data:", error);
        localStorage.removeItem("editDraft");
        localStorage.removeItem("isEditingDraft");
      }
    }
  }, [isOpen]);

  // Initialize customization theme from global state when modal opens
  useEffect(() => {
    if (
      isOpen &&
      selectedStyleTheme &&
      customization.theme !== selectedStyleTheme
    ) {
      setCustomization((prev) => ({
        ...prev,
        theme: selectedStyleTheme,
      }));
    }
  }, [isOpen, selectedStyleTheme]);

  // Save to localStorage
  useEffect(() => {
    if (customization && templateId) {
      localStorage.setItem(
        `template_${templateId}`,
        JSON.stringify({
          templateId,
          customization,
          theme: customization.theme || "minimal",
          timestamp: Date.now(),
        })
      );
    }
  }, [customization, templateId]);

  const handleCustomizationChange = (field, value) => {
    setCustomization((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If theme is changed in customization panel, update global state
    if (field === "theme") {
      setStyleTheme(value);
    }
  };

  const handlePreviewNewTab = () => {
    const effectiveColorMode =
      customization.colorMode?.toLowerCase() === "auto"
        ? globalTheme
        : customization.colorMode?.toLowerCase() || globalTheme;

    const html = renderTemplate(
      templateId,
      customization,
      customization.theme || "minimal",
      effectiveColorMode
    );

    const previewWindow = window.open("", "_blank");
    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      localStorage.removeItem("editDraft");
      localStorage.removeItem("isEditingDraft");
    };
  }, []);

  const handleImageUpload = (fieldPath, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setUploadedImages((prev) => ({
        ...prev,
        [fieldPath]: imageData,
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
        customization.theme || "minimal",
        customization.colorMode || "auto"
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateId}-website.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate download:", error);
      setNotification({
        isOpen: true,
        message: "Failed to generate download. Please try again.",
        type: "error",
      });
    }
  };

  const handleSaveDraft = async () => {
    if (!isAuthenticated) {
      setNotification({
        isOpen: true,
        message: "Please sign in to save drafts",
        type: "error",
      });
      return;
    }

    // Open the save draft modal
    setIsSaveDraftModalOpen(true);
  };

  // Replace the existing handleSaveDraftConfirm function (around line ~190)
  const handleSaveDraftConfirm = async (draftName) => {
    setIsSavingDraft(true);
    setDraftSaved(false);

    try {
      let result;

      if (isEditingDraft && editingDraftId) {
        // Update existing draft
        const { data, error } = await supabase
          .from("template_drafts")
          .update({
            draft_name: draftName,
            customization: customization,
            theme: customization.theme || "minimal",
            color_mode: customization.colorMode || "auto",
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingDraftId)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from("template_drafts")
          .insert({
            user_id: user.id,
            template_id: templateId,
            draft_name: draftName,
            customization: customization,
            theme: customization.theme || "minimal",
            color_mode: customization.colorMode || "auto",
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setDraftSaved(true);
      setIsSaveDraftModalOpen(false);
      setIsEditingDraft(false);
      setEditingDraftId(null);

      setTimeout(() => setDraftSaved(false), 3000);
      setNotification({
        isOpen: true,
        message: isEditingDraft
          ? "Draft updated successfully!"
          : "Draft saved successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to save draft:", error);
      setNotification({
        isOpen: true,
        message: error.message || "Failed to save draft. Please try again.",
        type: "error",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleDeploy = () => {
    setIsPaymentModalOpen(true);
  };

  if (!isOpen || !templateConfig) return null;

  return (
    <>
      <div
        className="modal-backdrop modal-backdrop--visible"
        onClick={onClose}
      />
      <div className="customize-modal customize-modal--visible">
        <div className="customize-modal__header">
          <div className="customize-modal__header-left">
            <button className="customize-modal__close" onClick={onClose}>
              <X size={24} />
            </button>
            <div>
              <h2 className="customize-modal__title">{templateConfig.name}</h2>
              <p className="customize-modal__subtitle">
                Customize your template and see changes in real-time
              </p>
            </div>
          </div>
          <div className="customize-modal__actions">
            <button
              className={`btn btn-secondary ${draftSaved ? "btn-success" : ""}`}
              onClick={handleSaveDraft}
              disabled={!isAuthenticated || isSavingDraft}
              title={
                !isAuthenticated
                  ? "Sign in to save drafts"
                  : isEditingDraft
                  ? "Update draft"
                  : "Save as draft"
              }
            >
              <Save size={20} />
              <span className="btn-text">
                {isSavingDraft
                  ? "Saving..."
                  : draftSaved
                  ? "Saved!"
                  : isEditingDraft
                  ? "Update Draft"
                  : "Save Draft"}
              </span>
            </button>
            <button className="btn btn-secondary" onClick={handlePreviewNewTab}>
              <Eye size={20} />
              <span className="btn-text">Preview</span>
            </button>
            <button className="btn btn-secondary" onClick={handleDownload}>
              <Download size={20} />
              <span className="btn-text">Download</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={handleDeploy}
              disabled={!isAuthenticated}
              title={
                !isAuthenticated ? "Sign in to deploy" : "Deploy your site"
              }
            >
              <ExternalLink size={20} />
              <span className="btn-text">Deploy</span>
            </button>
          </div>
        </div>

        {/* Mobile Editor/Preview Switch */}
        <div className="customize-modal__mobile-tabs">
          <button
            className={mobileView === "editor" ? "active" : ""}
            onClick={() => setMobileView("editor")}
          >
            Editor
          </button>
          <button
            className={mobileView === "preview" ? "active" : ""}
            onClick={() => setMobileView("preview")}
          >
            Preview
          </button>
        </div>

        {/* Mobile Toggle Bar */}
        {/* <div className="customize-modal__mobile-toggle">
          <button
            className={mobileView === 'editor' ? 'active' : ''}
            onClick={() => setMobileView('editor')}
          >
            Editor
          </button>
          <button
            className={mobileView === 'preview' ? 'active' : ''}
            onClick={() => setMobileView('preview')}
          >
            Preview
          </button>
        </div> */}

        <div className={`customize-modal__content mobile-${mobileView}`}>
          <div className="customize-modal__panel">
            <CustomizationPanel
              fields={templateConfig.customizable}
              customization={customization}
              onChange={handleCustomizationChange}
              onImageUpload={handleImageUpload}
              themes={themes}
            />
          </div>

          <div className="customize-modal__preview">
            <LivePreview
              templateId={templateId}
              customization={customization}
              images={uploadedImages}
            />
          </div>
        </div>
      </div>

      {/* Generate HTML to send to deployment */}
      {(() => {
        const effectiveColorMode =
          customization.colorMode?.toLowerCase() === "auto"
            ? globalTheme
            : customization.colorMode?.toLowerCase() || globalTheme;

        var htmlContent = renderTemplate(
          templateId,
          customization,
          customization.theme || "minimal",
          effectiveColorMode
        );

        return (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            templateId={templateId}
            customization={customization}
            htmlContent={htmlContent} // <-- IMPORTANT
          />
        );
      })()}

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        message={notification.message}
        type={notification.type}
      />
      <SaveDraftModal
        isOpen={isSaveDraftModalOpen}
        onClose={() => setIsSaveDraftModalOpen(false)}
        onSave={handleSaveDraftConfirm}
        defaultName={
          isEditingDraft
            ? localStorage.getItem("editDraftName") || template?.name
            : template?.name
        }
        isSaving={isSavingDraft}
        isEditing={isEditingDraft}
      />
    </>
  );
}

export default CustomizeModal;
