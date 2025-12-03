import { useState, useEffect } from "react";
import {
  X,
  Download,
  ExternalLink,
  Eye,
  Save,
  Upload,
  CheckCircle,
} from "lucide-react";
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
import RedeployModal from "./RedeployModal"; // We'll create this
import "./CustomizeModal.scss";

const defaultTheme = "minimal";

function getTemplateFields(template) {
  console.log("template: ", template);
  if (!template || !template.fields) return {};

  const customizable = {};

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

  customizable.theme = {
    type: "theme-selector",
    default: template.defaultTheme || "minimal",
    label: "Design Style",
    supportedThemes: template.supportedThemes,
  };

  return customizable;
}

function CustomizeModal({
  templateId,
  isOpen,
  onClose,
  editSiteData,
  editDraftData,
}) {
  const template = getTemplate(templateId);
  const themes = getAllThemes();
  const { theme: globalTheme, selectedStyleTheme, setStyleTheme } = useTheme();
  const { user, isAuthenticated, supabase } = useAuth();

  const [editingDraftId, setEditingDraftId] = useState(null);
  const [editingSiteId, setEditingSiteId] = useState(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isEditingDeployedSite, setIsEditingDeployedSite] = useState(false);
  const [mobileView, setMobileView] = useState("editor");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isRedeploying, setIsRedeploying] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [isRedeployModalOpen, setIsRedeployModalOpen] = useState(false);
  const [siteData, setSiteData] = useState(null);

  const templateConfig = template
    ? {
        id: template.id,
        name: template.name,
        category: template.category,
        customizable: getTemplateFields(template),
      }
    : null;

  const [customization, setCustomization] = useState(() => {
    const defaults = {};
    if (templateConfig && templateConfig.customizable) {
      Object.entries(templateConfig.customizable).forEach(([key, config]) => {
        if (key === "theme") {
          defaults[key] = selectedStyleTheme;
        } else if (key === "colorMode") {
          defaults[key] = "Auto";
        } else {
          defaults[key] = config.default;
        }
      });
    }

    const saved = localStorage.getItem(`template_${templateId}`);
    if (saved) {
      const data = JSON.parse(saved);
      let savedCustomization = data.customization || data;

      if (savedCustomization.darkMode) {
        savedCustomization.colorMode = savedCustomization.darkMode;
        delete savedCustomization.darkMode;
      }
      if (!savedCustomization.theme) {
        savedCustomization.theme = selectedStyleTheme;
      }

      return { ...defaults, ...savedCustomization };
    }

    return defaults;
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    console.log("🔍 CustomizeModal props:", { editSiteData, editDraftData });

    // Check if we're editing a deployed site
    if (editSiteData) {
      console.log("✅ Editing deployed site:", editSiteData.siteName);

      setIsEditingDeployedSite(true);
      setSiteData(editSiteData);

      // Load site customization
      setCustomization((prev) => ({
        ...prev,
        ...editSiteData.customization,
        theme: editSiteData.theme || selectedStyleTheme,
        colorMode: editSiteData.colorMode || "Auto",
      }));
    }

    // Check if we're editing a draft
    if (editDraftData) {
      console.log("📝 Editing draft:", editDraftData.draft_name);

      setIsEditingDraft(true);
      setEditingDraftId(editDraftData.id);

      setCustomization((prev) => ({
        ...prev,
        ...editDraftData.customization,
        theme: editDraftData.theme || selectedStyleTheme,
        colorMode: editDraftData.colorMode || "Auto",
      }));
    }
  }, [isOpen, editSiteData, editDraftData]);

  // Check if editing a draft
  // useEffect(() => {
  //   const editDraftData = localStorage.getItem("editDraft");
  //   const isEditing = localStorage.getItem("isEditingDraft");

  //   if (isOpen && isEditing && editDraftData && !isEditingDeployedSite) {
  //     try {
  //       const draft = JSON.parse(editDraftData);
  //       console.log("Loading draft for editing:", draft);

  //       setCustomization({
  //         ...customization,
  //         ...draft.customization,
  //         theme: draft.theme || selectedStyleTheme,
  //         colorMode: draft.colorMode || "Auto",
  //       });

  //       setEditingDraftId(draft.id);
  //       setIsEditingDraft(true);

  //       localStorage.removeItem("editDraft");
  //       localStorage.removeItem("isEditingDraft");

  //       setNotification({
  //         isOpen: true,
  //         message: `Loaded draft: "${draft.draftName || draft.templateId}"`,
  //         type: "success",
  //       });
  //     } catch (error) {
  //       console.error("Error loading draft data:", error);
  //       localStorage.removeItem("editDraft");
  //       localStorage.removeItem("isEditingDraft");
  //     }
  //   }
  // }, [isOpen]);

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
      localStorage.removeItem("editDraft");
      localStorage.removeItem("isEditingDraft");
      localStorage.removeItem("editSite");
      localStorage.removeItem("isEditingDeployedSite");
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

    setIsSaveDraftModalOpen(true);
  };

  const handleSaveDraftConfirm = async (draftName) => {
    setIsSavingDraft(true);
    setDraftSaved(false);

    try {
      let result;

      if (isEditingDraft && editingDraftId) {
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

  // NEW: Handle redeploying an existing site
  const handleRedeploySite = async () => {
    if (!isAuthenticated || !siteData) return;

    setIsRedeploying(true);
    try {
      const effectiveColorMode =
        customization.colorMode?.toLowerCase() === "auto"
          ? globalTheme
          : customization.colorMode?.toLowerCase() || globalTheme;

      const htmlContent = renderTemplate(
        templateId,
        customization,
        customization.theme || "minimal",
        effectiveColorMode
      );

      // Clean HTML content
      const cleanHtmlContent = htmlContent
        .replace(/[\0-\x1F\x7F]/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

      // Call redeploy function
      const { data, error } = await supabase.functions.invoke(
        "redeploy-to-vercel",
        {
          body: {
            siteId: siteData.id,
            siteName: siteData.siteName,
            htmlContent: cleanHtmlContent,
            templateId: templateId,
            customization: customization,
            vercelProjectId: siteData.vercelProjectId,
            stripeSubscriptionId: siteData.stripeSubscriptionId,
            stripeCustomerId: siteData.stripeCustomerId,
            customDomain: siteData.customDomain || null,
          },
        }
      );

      if (error) throw error;

      // Update site record in database
      const { error: updateError } = await supabase
        .from("sites")
        .update({
          customization: customization,
          theme: customization.theme || "minimal",
          updated_at: new Date().toISOString(),
          deployment_status: "deployed",
          deployed_at: new Date().toISOString(),
          last_redeployed_at: new Date().toISOString(),
        })
        .eq("id", siteData.id)
        .eq("user_id", user.id);

      if (updateError) {
        console.warn("Database update warning:", updateError);
        // Continue anyway since Vercel deployment succeeded
      }

      setNotification({
        isOpen: true,
        message: "Site redeployed successfully!",
        type: "success",
      });

      // Close modal after successful redeployment
      setTimeout(() => {
        onClose();
        // Trigger refresh in parent component
        window.dispatchEvent(new CustomEvent("site-redeployed"));
      }, 1500);
    } catch (error) {
      console.error("Error redeploying site:", error);
      setNotification({
        isOpen: true,
        message: error.message || "Failed to redeploy site. Please try again.",
        type: "error",
      });
    } finally {
      setIsRedeploying(false);
    }
  };

  const handleDeploy = () => {
    if (isEditingDeployedSite) {
      // For deployed sites, open redeploy confirmation
      setIsRedeployModalOpen(true);
    } else {
      // For new sites, open payment modal
      setIsPaymentModalOpen(true);
    }
  };

  const handleRedeployConfirm = () => {
    setIsRedeployModalOpen(false);
    handleRedeploySite();
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
              <h2 className="customize-modal__title">
                {isEditingDeployedSite
                  ? `Edit ${siteData?.siteName || "Site"}`
                  : templateConfig.name}
              </h2>
              <p className="customize-modal__subtitle">
                {isEditingDeployedSite
                  ? "Edit your deployed site and redeploy for free"
                  : "Customize your template and see changes in real-time"}
              </p>
            </div>
          </div>
          <div className="customize-modal__actions">
            {!isEditingDeployedSite && (
              <>
                <button
                  className={`btn btn-secondary ${
                    draftSaved ? "btn-success" : ""
                  }`}
                  onClick={handleSaveDraft}
                  disabled={!isAuthenticated || isSavingDraft}
                  title={
                    !isAuthenticated
                      ? "Sign in to save drafts"
                      : isEditingDraft
                      ? "Update draft"
                      : "Save draft"
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
                <button
                  className="btn btn-secondary"
                  onClick={handlePreviewNewTab}
                >
                  <Eye size={20} />
                  <span className="btn-text">Preview</span>
                </button>
                <button className="btn btn-secondary" onClick={handleDownload}>
                  <Download size={20} />
                  <span className="btn-text">Download</span>
                </button>
              </>
            )}
            <button
              className={`btn ${
                isEditingDeployedSite ? "btn-success" : "btn-primary"
              }`}
              onClick={handleDeploy}
              disabled={!isAuthenticated || isRedeploying}
              title={
                !isAuthenticated
                  ? "Sign in to deploy"
                  : isEditingDeployedSite
                  ? "Redeploy site for free"
                  : "Deploy your site"
              }
            >
              {isRedeploying ? (
                <span className="spinner" />
              ) : isEditingDeployedSite ? (
                <Upload size={20} />
              ) : (
                <ExternalLink size={20} />
              )}
              <span className="btn-text">
                {isRedeploying
                  ? "Redeploying..."
                  : isEditingDeployedSite
                  ? "Save & Redeploy"
                  : "Deploy"}
              </span>
            </button>
          </div>
        </div>

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
              isEditingDeployedSite={isEditingDeployedSite}
              siteName={siteData?.siteName}
            />
          </div>
        </div>
      </div>

      {/* Payment Modal for NEW deployments */}
      {!isEditingDeployedSite &&
        (() => {
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
              htmlContent={htmlContent}
            />
          );
        })()}

      {/* Redeploy Confirmation Modal */}
      {isEditingDeployedSite && (
        <RedeployModal
          isOpen={isRedeployModalOpen}
          onClose={() => setIsRedeployModalOpen(false)}
          onConfirm={handleRedeployConfirm}
          siteName={siteData?.siteName}
          isRedeploying={isRedeploying}
        />
      )}

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
