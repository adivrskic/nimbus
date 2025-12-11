import { useState, useEffect, useCallback } from "react";
import {
  X,
  Download,
  ExternalLink,
  Eye,
  Save,
  Upload,
  CheckCircle,
  LogIn,
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
import RedeployModal from "./RedeployModal";
import ConfirmModal from "./ConfirmModal";
import AuthModal from "./AuthModal";
import useModalAnimation from "../hooks/useModalAnimation";
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

  // Use the animation hook for smooth enter/exit transitions
  const { shouldRender, isVisible } = useModalAnimation(isOpen, 400);

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
  const [showSaveDraftConfirm, setShowSaveDraftConfirm] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [isRedeployModalOpen, setIsRedeployModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialCustomization, setInitialCustomization] = useState({});

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
      const newCustomization = {
        ...editSiteData.customization,
        theme: editSiteData.theme || selectedStyleTheme,
        colorMode: editSiteData.colorMode || "Auto",
      };

      setCustomization(newCustomization);
      setInitialCustomization(newCustomization);
      setHasUnsavedChanges(false);
    }

    // Check if we're editing a draft
    if (editDraftData) {
      console.log("📝 Editing draft:", editDraftData.draft_name);

      setIsEditingDraft(true);
      setEditingDraftId(editDraftData.id);

      const newCustomization = {
        ...editDraftData.customization,
        theme: editDraftData.theme || selectedStyleTheme,
        colorMode: editDraftData.colorMode || "Auto",
      };

      setCustomization(newCustomization);
      setInitialCustomization(newCustomization);
      setHasUnsavedChanges(false);
    }
  }, [isOpen, editSiteData, editDraftData]);

  useEffect(() => {
    if (isOpen && !editSiteData && !editDraftData) {
      setInitialCustomization({});
      setHasUnsavedChanges(false);
    }
  }, [isOpen, editSiteData, editDraftData]);

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
    const newCustomization = {
      ...customization,
      [field]: value,
    };

    setCustomization(newCustomization);

    // Check if the change is different from initial state
    if (isEditingDeployedSite || isEditingDraft) {
      const hasChanged =
        JSON.stringify(newCustomization) !==
        JSON.stringify(initialCustomization);
      setHasUnsavedChanges(hasChanged);
    }

    if (field === "theme") {
      setStyleTheme(value);
    }
  };

  // Helper function to compare current customization with initial
  const checkForChanges = useCallback(() => {
    if (!isEditingDeployedSite && !isEditingDraft) return false;

    return (
      JSON.stringify(customization) !== JSON.stringify(initialCustomization)
    );
  }, [
    customization,
    initialCustomization,
    isEditingDeployedSite,
    isEditingDraft,
  ]);

  // Update hasUnsavedChanges when customization changes
  useEffect(() => {
    if (isEditingDeployedSite || isEditingDraft) {
      const changed = checkForChanges();
      setHasUnsavedChanges(changed);
    }
  }, [customization, checkForChanges, isEditingDeployedSite, isEditingDraft]);

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

    setDraftName(
      isEditingDraft
        ? localStorage.getItem("editDraftName") || template?.name
        : template?.name
    );
    setShowSaveDraftConfirm(true);
  };

  const handleSaveDraftConfirm = async (name) => {
    if (!name?.trim()) {
      setNotification({
        isOpen: true,
        message: "Please enter a draft name",
        type: "error",
      });
      return;
    }

    setIsSavingDraft(true);

    try {
      let result;

      if (isEditingDraft && editingDraftId) {
        const { data, error } = await supabase
          .from("template_drafts")
          .update({
            draft_name: name.trim(),
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
            draft_name: name.trim(),
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
      setShowSaveDraftConfirm(false);
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

      const cleanHtmlContent = htmlContent
        .replace(/[\0-\x1F\x7F]/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

      console.log({
        siteId: siteData.id,
        siteName: siteData.siteName,
        htmlContent: cleanHtmlContent,
        templateId: templateId,
        customization: customization,
        vercelProjectId: siteData.vercelProjectId,
        stripeSubscriptionId: siteData.stripeSubscriptionId,
        stripeCustomerId: siteData.stripeCustomerId,
        customDomain: siteData.customDomain || null,
      });

      const { data, error } = await supabase.functions.invoke(
        "deploy-to-vercel",
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

      const { error: updateError } = await supabase
        .from("sites")
        .update({
          customization: customization,
          theme: customization.theme || "minimal",
          updated_at: new Date().toISOString(),
          deployment_status: "deployed",
          deployed_at: new Date().toISOString(),
          last_redeployed_at: new Date().toISOString(),
          redeployment_count: (siteData.redeployment_count || 0) + 1,
        })
        .eq("id", siteData.id)
        .eq("user_id", user.id);

      if (updateError) {
        console.warn("Database update warning:", updateError);
      }

      setNotification({
        isOpen: true,
        message: "Site redeployed successfully!",
        type: "success",
      });

      setTimeout(() => {
        onClose();
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
      setIsRedeployModalOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handleRedeployConfirm = () => {
    setIsRedeployModalOpen(false);
    handleRedeploySite();
  };

  // Don't render if not needed or no template config
  if (!shouldRender || !templateConfig) return null;

  return (
    <>
      <div
        className={`modal-backdrop ${
          isVisible ? "modal-backdrop--visible" : ""
        }`}
        onClick={onClose}
      />
      <div
        className={`customize-modal ${
          isVisible ? "customize-modal--visible" : ""
        }`}
      >
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
                !isAuthenticated
                  ? "btn-primary"
                  : isEditingDeployedSite
                  ? "btn-success"
                  : "btn-primary"
              }`}
              onClick={() => {
                if (!isAuthenticated) {
                  setIsAuthModalOpen(true);
                } else {
                  handleDeploy();
                }
              }}
              disabled={
                isRedeploying || (isEditingDeployedSite && !hasUnsavedChanges)
              }
              title={
                !isAuthenticated
                  ? "Sign in to deploy"
                  : isEditingDeployedSite
                  ? hasUnsavedChanges
                    ? "Redeploy site with your changes"
                    : "Make changes to enable redeploy"
                  : "Deploy your site"
              }
            >
              {isRedeploying ? (
                <span className="spinner" />
              ) : !isAuthenticated ? (
                <LogIn size={20} />
              ) : isEditingDeployedSite ? (
                <Upload size={20} />
              ) : (
                <ExternalLink size={20} />
              )}
              <span className="btn-text">
                {isRedeploying
                  ? "Redeploying..."
                  : !isAuthenticated
                  ? "Sign In to Deploy"
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
              siteId={siteData?.siteId || `draft-${Date.now()}`}
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

      <ConfirmModal
        isOpen={showSaveDraftConfirm}
        onClose={() => {
          setShowSaveDraftConfirm(false);
          setDraftName("");
        }}
        onConfirm={handleSaveDraftConfirm}
        title={isEditingDraft ? "Update Draft" : "Save Draft"}
        message={
          isEditingDraft
            ? "Enter a new name for your draft or keep the existing one."
            : "Give your draft a name to save it for later editing or deployment."
        }
        confirmText={isEditingDraft ? "Update Draft" : "Save Draft"}
        cancelText="Cancel"
        type={isEditingDraft ? "edit" : "save"}
        inputProps={{
          label: "Draft Name",
          defaultValue: draftName,
          placeholder: "Enter a name for this draft",
          isEditing: isEditingDraft,
          hint: isEditingDraft
            ? "Updating will overwrite the existing draft with your current changes."
            : undefined,
        }}
        isProcessing={isSavingDraft}
      />

      {/* Auth Modal for unauthenticated users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          setIsAuthModalOpen(false);
          handleDeploy();
        }}
      />
    </>
  );
}

export default CustomizeModal;
