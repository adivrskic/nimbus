import { useState, useEffect } from "react";
import {
  X,
  Rocket,
  Check,
  Copy,
  Loader2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Globe,
  Zap,
  Settings,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import useModalAnimation from "../hooks/useModalAnimation";
import "./DeployModal.scss";

const DEPLOY_PRICE = 5;

function DeployModal({
  isOpen,
  onClose,
  projectName,
  html,
  projectId,
  prompt,
  customization,
  onOpenDomainSetup, // callback to open CustomDomainModal after deploy
}) {
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1: choose mode, 2: subdomain (quick), 3: custom domain, 4: deploying, 5: success
  const [deployMode, setDeployMode] = useState(null); // 'quick' or 'custom'
  const [subdomain, setSubdomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [processing, setProcessing] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState(null);
  const [deployedUrl, setDeployedUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deployedProject, setDeployedProject] = useState(null);
  const [validatingDomain, setValidatingDomain] = useState(false);
  const [domainValidation, setDomainValidation] = useState(null);

  // Initialize subdomain from project name
  useEffect(() => {
    if (isOpen && projectName) {
      const cleaned = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 30);
      setSubdomain(cleaned || "my-site");
    }
  }, [isOpen, projectName]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setDeployMode(null);
      setError(null);
      setDeployedUrl(null);
      setProcessing(false);
      setDeploying(false);
      setDeployedProject(null);
      setCustomDomain("");
      setDomainValidation(null);
    }
  }, [isOpen]);

  // Check for success return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const deployedSubdomain = params.get("subdomain");

    if (sessionId && deployedSubdomain) {
      setDeployedUrl(`https://nimbus-${deployedSubdomain}.vercel.app`);
      setStep(5);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const validateSubdomain = () => {
    if (subdomain.length < 3) return "Min 3 characters";
    if (subdomain.length > 30) return "Max 30 characters";
    if (!/^[a-z0-9-]+$/.test(subdomain))
      return "Letters, numbers, hyphens only";
    if (subdomain.startsWith("-") || subdomain.endsWith("-"))
      return "Can't start/end with hyphen";
    return null;
  };

  const validateDomainFormat = (domain) => {
    if (!domain) return "Domain is required";
    if (!domain.includes(".")) return "Invalid domain format";
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
    if (!domainRegex.test(domain)) return "Invalid domain format";
    return null;
  };

  const checkDomainAvailability = async () => {
    const formatError = validateDomainFormat(customDomain);
    if (formatError) {
      setDomainValidation({ canUse: false, error: formatError });
      return;
    }

    setValidatingDomain(true);
    setDomainValidation(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "validate-domain",
        {
          body: { domain: customDomain },
        }
      );

      if (error) throw error;

      setDomainValidation(data);
    } catch (err) {
      setDomainValidation({ canUse: false, error: err.message });
    } finally {
      setValidatingDomain(false);
    }
  };

  const handleQuickDeploy = async () => {
    if (validateSubdomain()) return;

    setProcessing(true);
    setError(null);

    try {
      let currentProjectId = projectId;

      // If no projectId, save the project first
      if (!currentProjectId) {
        const projectData = {
          user_id: user.id,
          name: projectName || `Project ${new Date().toLocaleDateString()}`,
          html_content: html,
          template_type: customization?.template || "landing",
          style_preset: customization?.style || "modern",
          customization: {
            ...customization,
            prompt: prompt,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: savedProject, error: saveError } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (saveError)
          throw new Error("Failed to save project: " + saveError.message);
        currentProjectId = savedProject.id;
      }

      // Create checkout session
      const { data, error: invokeError } = await supabase.functions.invoke(
        "create-deployment-checkout",
        {
          body: {
            projectId: currentProjectId,
            siteName: projectName || subdomain,
            subdomain: subdomain,
            successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}&subdomain=${subdomain}`,
            cancelUrl: window.location.href,
          },
        }
      );

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Deploy error:", err);
      setError(err.message || "Failed to start checkout");
      setProcessing(false);
    }
  };

  const handleDeployWithDomain = async () => {
    if (validateSubdomain()) return;
    if (!domainValidation?.canUse) {
      setError("Please validate your domain first");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      let currentProjectId = projectId;

      // If no projectId, save the project first
      if (!currentProjectId) {
        const projectData = {
          user_id: user.id,
          name: projectName || `Project ${new Date().toLocaleDateString()}`,
          html_content: html,
          template_type: customization?.template || "landing",
          style_preset: customization?.style || "modern",
          customization: {
            ...customization,
            prompt: prompt,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: savedProject, error: saveError } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (saveError)
          throw new Error("Failed to save project: " + saveError.message);
        currentProjectId = savedProject.id;
      }

      // Update project with custom domain info
      await supabase
        .from("projects")
        .update({
          custom_domain: customDomain,
          domain_status: "pending",
        })
        .eq("id", currentProjectId);

      // Create checkout session with custom domain metadata
      const { data, error: invokeError } = await supabase.functions.invoke(
        "create-deployment-checkout",
        {
          body: {
            projectId: currentProjectId,
            siteName: projectName || subdomain,
            subdomain: subdomain,
            customDomain: customDomain,
            successUrl: `${
              window.location.origin
            }/?session_id={CHECKOUT_SESSION_ID}&subdomain=${subdomain}&custom_domain=${encodeURIComponent(
              customDomain
            )}`,
            cancelUrl: window.location.href,
          },
        }
      );

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Deploy error:", err);
      setError(err.message || "Failed to start checkout");
      setProcessing(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetupDomain = () => {
    closeModal();
    if (onOpenDomainSetup && deployedProject) {
      onOpenDomainSetup(deployedProject);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`deploy-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`deploy-content ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step 1: Choose deployment mode */}
        {step === 1 && (
          <>
            <div className="deploy-header">
              <span className="deploy-title">
                <Rocket size={16} />
                Deploy Your Site
              </span>
              <button className="deploy-close" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <div className="deploy-mode-options">
              <button
                className={`deploy-mode-card ${
                  deployMode === "quick" ? "selected" : ""
                }`}
                onClick={() => {
                  setDeployMode("quick");
                  setStep(2);
                }}
              >
                <div className="deploy-mode-icon">
                  <Zap size={20} />
                </div>
                <div className="deploy-mode-info">
                  <strong>Quick Deploy</strong>
                  <span>Get live instantly on nimbus-*.vercel.app</span>
                  <span className="deploy-mode-note">
                    Add custom domain later
                  </span>
                </div>
                <ChevronRight size={16} />
              </button>

              <button
                className={`deploy-mode-card ${
                  deployMode === "custom" ? "selected" : ""
                }`}
                onClick={() => {
                  setDeployMode("custom");
                  setStep(3);
                }}
              >
                <div className="deploy-mode-icon">
                  <Globe size={20} />
                </div>
                <div className="deploy-mode-info">
                  <strong>Custom Domain</strong>
                  <span>Deploy with your own domain</span>
                  <span className="deploy-mode-note">yourdomain.com</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="deploy-price-info">
              <span>
                One-time deployment fee: <strong>${DEPLOY_PRICE}/mo</strong>
              </span>
            </div>
          </>
        )}

        {/* Step 2: Quick deploy - subdomain only */}
        {step === 2 && (
          <>
            <div className="deploy-header">
              <span className="deploy-title">
                <Zap size={16} />
                Quick Deploy
              </span>
              <button className="deploy-close" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <div className="deploy-field">
              <label>Site URL</label>
              <div className="deploy-input-group">
                <span className="deploy-input-prefix">nimbus-</span>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="my-site"
                  maxLength={30}
                  disabled={processing}
                />
                <span className="deploy-input-suffix">.vercel.app</span>
              </div>
              {subdomain && validateSubdomain() && (
                <span className="deploy-field-error">
                  {validateSubdomain()}
                </span>
              )}
            </div>

            <div className="deploy-summary">
              <div className="deploy-summary-row">
                <span>One-time deployment</span>
                <strong>${DEPLOY_PRICE}/mo</strong>
              </div>
            </div>

            <div className="deploy-features">
              <span>✓ Free SSL</span>
              <span>✓ Global CDN</span>
              <span>✓ Custom domain later</span>
            </div>

            {error && (
              <div className="deploy-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="deploy-nav">
              <button
                className="deploy-btn-secondary"
                onClick={() => setStep(1)}
                disabled={processing}
              >
                Back
              </button>
              <button
                className="deploy-btn-primary"
                onClick={handleQuickDeploy}
                disabled={processing || validateSubdomain()}
              >
                {processing ? (
                  <>
                    <Loader2 size={14} className="spinning" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Rocket size={14} />
                    Deploy ${DEPLOY_PRICE}/mo
                  </>
                )}
              </button>
            </div>

            <p className="deploy-secure-note">🔒 Secure checkout via Stripe</p>
          </>
        )}

        {/* Step 3: Custom domain setup */}
        {step === 3 && (
          <>
            <div className="deploy-header">
              <span className="deploy-title">
                <Globe size={16} />
                Custom Domain
              </span>
              <button className="deploy-close" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <div className="deploy-field">
              <label>Your Domain</label>
              <div className="deploy-input-group deploy-input-group--domain">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value.toLowerCase().trim());
                    setDomainValidation(null);
                  }}
                  placeholder="example.com"
                  disabled={processing || validatingDomain}
                />
                <button
                  className="deploy-validate-btn"
                  onClick={checkDomainAvailability}
                  disabled={!customDomain || validatingDomain}
                >
                  {validatingDomain ? (
                    <Loader2 size={14} className="spinning" />
                  ) : (
                    "Check"
                  )}
                </button>
              </div>
              {domainValidation && (
                <span
                  className={`deploy-field-${
                    domainValidation.canUse ? "success" : "error"
                  }`}
                >
                  {domainValidation.canUse
                    ? "✓ Domain available"
                    : domainValidation.error || "Domain not available"}
                </span>
              )}
            </div>

            <div className="deploy-field">
              <label>Subdomain (fallback)</label>
              <div className="deploy-input-group">
                <span className="deploy-input-prefix">nimbus-</span>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="my-site"
                  maxLength={30}
                  disabled={processing}
                />
                <span className="deploy-input-suffix">.vercel.app</span>
              </div>
              {subdomain && validateSubdomain() && (
                <span className="deploy-field-error">
                  {validateSubdomain()}
                </span>
              )}
              <span className="deploy-field-hint">
                Your site will also be accessible here while DNS propagates
              </span>
            </div>

            <div className="deploy-summary">
              <div className="deploy-summary-row">
                <span>One-time deployment</span>
                <strong>${DEPLOY_PRICE}/mo</strong>
              </div>
            </div>

            <div className="deploy-features">
              <span>✓ Free SSL</span>
              <span>✓ Global CDN</span>
              <span>✓ DNS setup guide</span>
            </div>

            {error && (
              <div className="deploy-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="deploy-nav">
              <button
                className="deploy-btn-secondary"
                onClick={() => setStep(1)}
                disabled={processing}
              >
                Back
              </button>
              <button
                className="deploy-btn-primary"
                onClick={handleDeployWithDomain}
                disabled={
                  processing || validateSubdomain() || !domainValidation?.canUse
                }
              >
                {processing ? (
                  <>
                    <Loader2 size={14} className="spinning" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Rocket size={14} />
                    Deploy ${DEPLOY_PRICE}/mo
                  </>
                )}
              </button>
            </div>

            <p className="deploy-secure-note">🔒 Secure checkout via Stripe</p>
          </>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <>
            <div className="deploy-header">
              <span className="deploy-title deploy-title--success">
                <Check size={16} />
                Live!
              </span>
              <button className="deploy-close" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <div className="deploy-success">
              <div className="deploy-url-box">
                <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
                  {deployedUrl?.replace("https://", "")}
                </a>
                <button onClick={copyUrl} className="deploy-copy-btn">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="deploy-success-note">Your site is live!</p>
            </div>

            <div className="deploy-success-actions">
              <button
                className="deploy-action-card"
                onClick={handleSetupDomain}
              >
                <Globe size={18} />
                <div>
                  <strong>Add Custom Domain</strong>
                  <span>Connect yourdomain.com</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="deploy-nav">
              <button className="deploy-btn-secondary" onClick={closeModal}>
                Done
              </button>
              <a
                href={deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="deploy-btn-primary"
              >
                <ExternalLink size={14} />
                Visit Site
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeployModal;
