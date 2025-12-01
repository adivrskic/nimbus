import { useState, useEffect, useCallback } from "react";
import {
  X,
  User,
  Mail,
  Lock,
  CreditCard,
  Globe,
  Loader,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Eye,
  FileText,
  Edit,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { renderTemplate } from "../utils/templateSystem";
import ConfirmModal from "./ConfirmModal";
import NotificationModal from "./NotificationModal";
import PaymentModal from "./PaymentModal";
import "./UserAccountModal.scss";

function UserAccountModal({ isOpen, onClose }) {
  const {
    user,
    profile,
    updateProfile,
    updateEmail,
    updatePassword,
    supabase,
    isAuthenticated,
  } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sites, setSites] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [deployModal, setDeployModal] = useState({
    isOpen: false,
    draft: null,
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    billing_email: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        billing_email: profile.billing_email || "",
      });
    }
  }, [profile]);

  // Close modal if user logs out
  useEffect(() => {
    if (!isAuthenticated && isOpen) {
      console.log("User logged out, closing account modal");
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  // Reset form states when modal closes
  useEffect(() => {
    if (!isOpen || !isAuthenticated) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [isOpen, isAuthenticated]);

  // Calculate billing summary whenever sites change
  useEffect(() => {
    calculateBillingSummary();
  }, [sites]);

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadUserData();
      loadStripeSubscriptions();
    }
  }, [isOpen, user]);

  // Listen for deployment success from PaymentModal
  useEffect(() => {
    const handleDeploymentSuccess = async () => {
      console.log("📡 Deployment success detected, refreshing sites...");
      if (isOpen && user) {
        await loadSites();
        await loadStripeSubscriptions();
        // Switch to sites tab to show the new site
        setActiveTab("sites");

        // Show success notification
        setNotification({
          isOpen: true,
          message:
            "Site deployed successfully! Your sites list has been updated.",
          type: "success",
        });
      }
    };

    // Listen for a custom event that PaymentModal can dispatch
    window.addEventListener("deployment-success", handleDeploymentSuccess);

    return () => {
      window.removeEventListener("deployment-success", handleDeploymentSuccess);
    };
  }, [isOpen, user]);

  const loadUserData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await Promise.all([loadSites(), loadDrafts()]);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSites = async () => {
    try {
      console.log("Loading sites for user:", user.id);
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Sites loaded:", data?.length || 0, "sites");
      setSites(data || []);
      return data || [];
    } catch (error) {
      console.error("Error loading sites:", error);
      setSites([]);
      return [];
    }
  };

  const loadDrafts = async () => {
    try {
      const { data, error } = await supabase
        .from("template_drafts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error("Error loading drafts:", error);
      setDrafts([]);
    }
  };

  // Load Stripe subscriptions
  const loadStripeSubscriptions = async () => {
    try {
      console.log("Loading Stripe subscriptions...");
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Stripe subscriptions loaded:", data?.length || 0);
      setSubscriptions(data || []);
      return data || [];
    } catch (error) {
      console.error("Error loading Stripe subscriptions:", error);
      setSubscriptions([]);
      return [];
    }
  };

  const calculateBillingSummary = useCallback(() => {
    console.log("Calculating billing summary for", sites.length, "sites");

    // Count active sites (not cancelled and billing_status is active)
    const activeSites = sites.filter(
      (site) => site.billing_status === "active" && !site.cancelled_at
    );

    // Count trial sites
    const trialSites = sites.filter((site) => site.billing_status === "trial");

    // Count cancelled but still active (until period ends)
    const cancelledButActive = sites.filter(
      (site) =>
        site.cancelled_at &&
        site.current_period_end &&
        new Date(site.current_period_end) > new Date()
    );

    // Calculate total monthly cost
    const activeSiteCost = activeSites.length * 500; // $5 each
    const cancelledSiteCost = cancelledButActive.length * 500;
    const totalMonthlyCostCents = activeSiteCost + cancelledSiteCost;

    const summary = {
      total_sites: sites.length,
      active_sites: activeSites.length,
      trial_sites: trialSites.length,
      cancelled_but_active: cancelledButActive.length,
      active_subscriptions: subscriptions.length,
      total_monthly_cost_cents: totalMonthlyCostCents,
      upcoming_monthly_cost_cents: activeSites.length * 500, // After cancelled sites expire
    };

    console.log("Billing summary:", summary);
    setBillingSummary(summary);
    return summary;
  }, [sites, subscriptions]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await updateProfile(profileForm);

      if (result.success) {
        setNotification({
          isOpen: true,
          message: "Profile updated successfully",
          type: "success",
        });
      } else {
        setNotification({
          isOpen: true,
          message: result.error || "Failed to update profile",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        isOpen: true,
        message: error.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (!passwordForm.currentPassword) {
        setNotification({
          isOpen: true,
          message: "Please enter your current password",
          type: "error",
        });
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setNotification({
          isOpen: true,
          message: "New passwords do not match",
          type: "error",
        });
        return;
      }

      if (passwordForm.newPassword.length < 8) {
        setNotification({
          isOpen: true,
          message: "Password must be at least 8 characters",
          type: "error",
        });
        return;
      }

      if (passwordForm.currentPassword === passwordForm.newPassword) {
        setNotification({
          isOpen: true,
          message: "New password must be different from current password",
          type: "error",
        });
        return;
      }

      console.log("Reauthenticating user...");
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword,
      });

      if (reauthError) {
        console.error("Reauthentication failed:", reauthError);
        setNotification({
          isOpen: true,
          message: "Current password is incorrect",
          type: "error",
        });
        return;
      }

      console.log("Reauthentication successful, updating password...");
      const result = await updatePassword(passwordForm.newPassword);

      if (result.success) {
        console.log("Password update completed successfully");
        setNotification({
          isOpen: true,
          message: "Password updated successfully",
          type: "success",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        console.error("Password update failed:", result.error);
        setNotification({
          isOpen: true,
          message: result.error || "Failed to update password",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Unexpected error in password update:", error);
      setNotification({
        isOpen: true,
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      console.log("Clearing loading state");
      setIsLoading(false);
    }
  };

  const handleCancelSite = async (siteId, siteName) => {
    setConfirmModal({
      isOpen: true,
      title: "Cancel Site Subscription?",
      message: `Are you sure you want to cancel the subscription for "${siteName}"? It will remain active until the end of your billing period.`,
      onConfirm: async () => {
        setIsLoading(true);
        try {
          // First, find the subscription for this site
          const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("site_id", siteId)
            .eq("user_id", user.id)
            .single();

          if (subError) {
            console.error("Error finding subscription:", subError);
            throw new Error("Could not find subscription for this site");
          }

          // Update site status
          const { error: siteError } = await supabase
            .from("sites")
            .update({
              billing_status: "cancelled",
              cancelled_at: new Date().toISOString(),
            })
            .eq("id", siteId)
            .eq("user_id", user.id);

          if (siteError) throw siteError;

          // Cancel the Stripe subscription via edge function
          const { error: stripeError } = await supabase.functions.invoke(
            "cancel-subscription",
            {
              body: {
                subscriptionId: subscription.stripe_subscription_id,
              },
            }
          );

          if (stripeError) {
            console.error("Stripe cancellation error:", stripeError);
            // Still mark as cancelled locally even if Stripe fails
            setNotification({
              isOpen: true,
              message:
                "Site marked as cancelled locally. Please contact support to cancel your Stripe subscription.",
              type: "warning",
            });
          } else {
            setNotification({
              isOpen: true,
              message: "Site subscription cancelled successfully",
              type: "success",
            });
          }

          // Refresh data
          await Promise.all([loadSites(), loadStripeSubscriptions()]);
        } catch (error) {
          console.error("Error cancelling site:", error);
          setNotification({
            isOpen: true,
            message: error.message || "Failed to cancel site subscription",
            type: "error",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleDeleteDraft = async (draftId, draftName) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Draft?",
      message: `Are you sure you want to delete "${draftName}"?`,
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const { error } = await supabase
            .from("template_drafts")
            .delete()
            .eq("id", draftId)
            .eq("user_id", user.id);

          if (error) throw error;

          setNotification({
            isOpen: true,
            message: "Draft deleted successfully",
            type: "success",
          });

          await loadDrafts();
        } catch (error) {
          setNotification({
            isOpen: true,
            message: error.message || "Failed to delete draft",
            type: "error",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleDeployDraft = (draft) => {
    setDeployModal({
      isOpen: true,
      draft: draft,
    });
  };

  const handlePreviewDraft = (draft) => {
    const effectiveColorMode =
      draft.color_mode?.toLowerCase() === "auto"
        ? document.documentElement.getAttribute("data-theme") || "light"
        : draft.color_mode?.toLowerCase() || "light";

    const html = renderTemplate(
      draft.template_id,
      draft.customization,
      draft.theme || "minimal",
      effectiveColorMode
    );

    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  };

  // Add this function after other handler functions (around line ~180)
  const handleEditDraft = (draft) => {
    console.log("Editing draft:", draft);

    // Store the draft data to pass to customizer
    localStorage.setItem(
      "editDraft",
      JSON.stringify({
        id: draft.id,
        templateId: draft.template_id,
        customization: draft.customization,
        theme: draft.theme || "minimal",
        colorMode: draft.color_mode || "auto",
        draftName: draft.draft_name,
      })
    );

    // Store as a flag to indicate we're editing a draft
    localStorage.setItem("isEditingDraft", "true");

    // Close the account modal
    onClose();

    // Open the customize modal for this template
    // You'll need to pass this up to the parent component
    // or use a global state management solution

    // Option A: If you have a global state or context for modal management
    window.dispatchEvent(
      new CustomEvent("open-customize-with-draft", {
        detail: {
          templateId: draft.template_id,
          draft: draft,
        },
      })
    );

    // Option B: If you can pass a callback from Home to UserAccountModal
    // This requires modifying how UserAccountModal is called in Header.jsx
  };

  const handleRefreshSites = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadSites(), loadStripeSubscriptions()]);
      setNotification({
        isOpen: true,
        message: "Sites and subscriptions refreshed",
        type: "success",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        message: "Failed to refresh data",
        type: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancelStripeSubscription = async (subscriptionId) => {
    setConfirmModal({
      isOpen: true,
      title: "Cancel Subscription?",
      message:
        "Are you sure you want to cancel this subscription? The site will remain active until the end of the billing period.",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const { error } = await supabase.functions.invoke(
            "cancel-subscription",
            {
              body: {
                subscriptionId: subscriptionId,
              },
            }
          );

          if (error) throw error;

          setNotification({
            isOpen: true,
            message: "Subscription cancelled successfully",
            type: "success",
          });

          await Promise.all([loadSites(), loadStripeSubscriptions()]);
        } catch (error) {
          console.error("Error cancelling subscription:", error);
          setNotification({
            isOpen: true,
            message: error.message || "Failed to cancel subscription",
            type: "error",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleClose = () => {
    setActiveTab("profile");
    setSuccessMessage("");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen || !isAuthenticated) return null;

  return (
    <>
      <div
        className="modal-backdrop modal-backdrop--visible"
        onClick={handleClose}
      />
      <div className="account-modal account-modal--visible">
        <div className="account-modal__header">
          <div className="account-modal__header-left">
            <button className="account-modal__close" onClick={handleClose}>
              <X size={24} />
            </button>
            <div>
              <h2 className="account-modal__title">Account Settings</h2>
              <p className="account-modal__subtitle">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="account-modal__content">
          {/* Tabs */}
          <div className="account-tabs">
            <button
              className={`account-tab ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              Profile
            </button>
            <button
              className={`account-tab ${activeTab === "sites" ? "active" : ""}`}
              onClick={() => setActiveTab("sites")}
            >
              <Globe size={18} />
              My Sites
            </button>
            <button
              className={`account-tab ${
                activeTab === "drafts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("drafts")}
            >
              <FileText size={18} />
              Drafts
            </button>
            <button
              className={`account-tab ${
                activeTab === "billing" ? "active" : ""
              }`}
              onClick={() => setActiveTab("billing")}
            >
              <CreditCard size={18} />
              Billing
            </button>
            <button
              className={`account-tab ${
                activeTab === "security" ? "active" : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              <Lock size={18} />
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="account-tab-content">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="account-form">
                <div className="form-section">
                  <h3>Personal Information</h3>

                  <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                    />
                    <span className="form-hint">
                      Email cannot be changed at this time
                    </span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      id="full_name"
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          full_name: e.target.value,
                        })
                      }
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="billing_email">
                      Billing Email (Optional)
                    </label>
                    <input
                      id="billing_email"
                      type="email"
                      value={profileForm.billing_email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          billing_email: e.target.value,
                        })
                      }
                      placeholder="billing@company.com"
                    />
                    <span className="form-hint">
                      If different from your account email
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="spinning" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            )}

            {/* Sites Tab */}
            {activeTab === "sites" && (
              <div className="sites-list">
                <div className="sites-header">
                  <div>
                    <h3>Your Deployed Sites</h3>
                    <span className="sites-count">{sites.length} sites</span>
                  </div>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={handleRefreshSites}
                    disabled={isRefreshing || isLoading}
                    title="Refresh sites list"
                  >
                    <RefreshCw
                      size={16}
                      className={isRefreshing ? "spinning" : ""}
                    />
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

                {sites.length === 0 ? (
                  <div className="empty-state">
                    <Globe size={48} />
                    <h4>No sites yet</h4>
                    <p>Deploy your first site to get started</p>
                  </div>
                ) : (
                  <div className="sites-grid">
                    {sites.map((site) => (
                      <div key={site.id} className="site-card">
                        <div className="site-card__header">
                          <div>
                            <h4>{site.site_name}</h4>
                            <span
                              className={`status-badge status-badge--${site.status}`}
                            >
                              {site.status}
                            </span>
                          </div>
                          {site.deployment_url && (
                            <a
                              href={site.deployment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-icon"
                              title="View site"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>

                        <div className="site-card__info">
                          <div className="info-row">
                            <span className="info-label">Template:</span>
                            <span className="info-value">
                              {site.template_id}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Status:</span>
                            <span
                              className={`billing-status billing-status--${site.billing_status}`}
                            >
                              {site.billing_status}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Monthly:</span>
                            <span className="info-value">
                              {formatCurrency(
                                site.price_per_month_cents || 500
                              )}
                            </span>
                          </div>
                          {site.current_period_end && (
                            <div className="info-row">
                              <span className="info-label">Renews:</span>
                              <span className="info-value">
                                {formatDate(site.current_period_end)}
                              </span>
                            </div>
                          )}
                        </div>

                        {site.billing_status === "active" &&
                          !site.cancelled_at && (
                            <button
                              className="btn btn-danger btn-small"
                              onClick={() =>
                                handleCancelSite(site.id, site.site_name)
                              }
                              disabled={isLoading}
                            >
                              <Trash2 size={16} />
                              Cancel Subscription
                            </button>
                          )}

                        {site.cancelled_at && (
                          <div className="cancellation-notice">
                            <AlertTriangle size={16} />
                            Cancels on {formatDate(site.current_period_end)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Drafts Tab */}
            {activeTab === "drafts" && (
              <div className="drafts-list">
                <div className="drafts-header">
                  <h3>Saved Template Drafts</h3>
                  <span className="drafts-count">{drafts.length} drafts</span>
                </div>

                {drafts.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={48} />
                    <h4>No drafts yet</h4>
                    <p>
                      Save template configurations from the customize modal to
                      access them later
                    </p>
                  </div>
                ) : (
                  <div className="drafts-grid">
                    {drafts.map((draft) => (
                      <div key={draft.id} className="draft-card">
                        <div className="draft-card__header">
                          <div>
                            <h4>{draft.draft_name}</h4>
                            <span className="draft-template">
                              {draft.template_id}
                            </span>
                          </div>
                        </div>

                        <div className="draft-card__info">
                          <div className="info-row">
                            <span className="info-label">Theme:</span>
                            <span className="info-value">{draft.theme}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Created:</span>
                            <span className="info-value">
                              {formatDate(draft.created_at)}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Updated:</span>
                            <span className="info-value">
                              {formatDate(draft.updated_at)}
                            </span>
                          </div>
                        </div>

                        <div className="draft-card__actions">
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleEditDraft(draft)}
                            disabled={isLoading}
                            title="Edit draft in customizer"
                          >
                            <Edit size={16} />
                            <span className="btn-text">Edit</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handlePreviewDraft(draft)}
                            disabled={isLoading}
                            title="Preview draft"
                          >
                            <Eye size={16} />
                            <span className="btn-text">Preview</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleDeployDraft(draft)}
                            disabled={isLoading}
                            title="Deploy draft"
                          >
                            <ExternalLink size={16} />
                            <span className="btn-text">Deploy</span>
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() =>
                              handleDeleteDraft(draft.id, draft.draft_name)
                            }
                            disabled={isLoading}
                            title="Delete draft"
                          >
                            <Trash2 size={16} />
                            <span className="btn-text">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="billing-section">
                <div className="billing-summary">
                  <div className="billing-header">
                    <h3>Billing Summary</h3>
                  </div>

                  {billingSummary && (
                    <>
                      <div className="summary-cards">
                        <div className="summary-card">
                          <span className="summary-label">Total Sites</span>
                          <span className="summary-value">
                            {billingSummary.total_sites}
                          </span>
                        </div>
                        <div className="summary-card">
                          <span className="summary-label">Current Monthly</span>
                          <span className="summary-value">
                            {formatCurrency(
                              billingSummary.total_monthly_cost_cents
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="billing-info">
                    <div className="info-card">
                      <Info size={20} />
                      <div>
                        <p>
                          <strong>Pricing:</strong> ${(500 / 100).toFixed(2)}{" "}
                          per site per month
                        </p>
                        <p>
                          Each active site is billed separately. Cancel anytime
                          - sites remain active until the end of the billing
                          period.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {profile?.stripe_customer_id && (
                  <div className="stripe-portal">
                    <h3>Payment Methods & Invoices</h3>
                    <p>
                      Manage your payment methods, update billing info, and view
                      invoices through Stripe Customer Portal.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          const { data, error } =
                            await supabase.functions.invoke(
                              "create-portal-session",
                              {
                                body: {
                                  userId: user.id,
                                  returnUrl: window.location.href,
                                },
                              }
                            );

                          if (error) {
                            throw new Error(
                              error.message || "Failed to create portal session"
                            );
                          }

                          if (data?.url) {
                            // Open Stripe Customer Portal in new tab
                            window.open(
                              data.url,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          } else {
                            throw new Error("No portal URL returned");
                          }
                        } catch (error) {
                          console.error(
                            "Error creating portal session:",
                            error
                          );
                          setNotification({
                            isOpen: true,
                            message:
                              error.message ||
                              "Failed to open billing portal. Please try again or contact support.",
                            type: "error",
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader size={18} className="spinning" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ExternalLink size={18} />
                          Manage Billing & Invoices
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordUpdate} className="account-form">
                <div className="form-section">
                  <h3>Change Password</h3>

                  <div className="form-field">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      disabled={isLoading}
                    />
                    <span className="form-hint">
                      Required for security verification
                    </span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                    />
                    <span className="form-hint">
                      Must be at least 8 characters
                    </span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    isLoading ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="spinning" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
      />

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        message={notification.message}
        type={notification.type}
      />

      {deployModal.isOpen && deployModal.draft && (
        <PaymentModal
          isOpen={deployModal.isOpen}
          onClose={() => {
            setDeployModal({ isOpen: false, draft: null });
            // Refresh data when PaymentModal closes
            if (user) {
              handleRefreshSites();
            }
          }}
          templateId={deployModal.draft.template_id}
          customization={deployModal.draft.customization}
          htmlContent={renderTemplate(
            deployModal.draft.template_id,
            deployModal.draft.customization,
            deployModal.draft.theme || "minimal",
            deployModal.draft.color_mode || "auto"
          )}
        />
      )}
    </>
  );
}

export default UserAccountModal;
