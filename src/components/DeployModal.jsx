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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import useModalAnimation from "../hooks/useModalAnimation";
import "./DeployModal.scss";

const DEPLOY_PRICE = 3;

function DeployModal({
  isOpen,
  onClose,
  projectName,
  html,
  projectId,
  prompt,
  customization,
}) {
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1: subdomain, 2: success
  const [subdomain, setSubdomain] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [deployedUrl, setDeployedUrl] = useState(null);
  const [copied, setCopied] = useState(false);

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
      setError(null);
      setDeployedUrl(null);
      setProcessing(false);
    }
  }, [isOpen]);

  // Check for success return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const deployedSubdomain = params.get("subdomain");

    if (sessionId && deployedSubdomain) {
      setDeployedUrl(`https://nimbus-${deployedSubdomain}.vercel.app`);
      setStep(2);
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

  const handleDeploy = async () => {
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

  const copyUrl = () => {
    navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {step === 1 && (
          <>
            <div className="deploy-header">
              <span className="deploy-title">
                <Rocket size={16} />
                Deploy
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
                <strong>${DEPLOY_PRICE}</strong>
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
                onClick={closeModal}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                className="deploy-btn-primary"
                onClick={handleDeploy}
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
                    Deploy ${DEPLOY_PRICE}
                  </>
                )}
              </button>
            </div>

            <p className="deploy-secure-note">🔒 Secure checkout via Stripe</p>
          </>
        )}

        {step === 2 && (
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
              <p className="deploy-success-note">
                Your site is live! Add a custom domain from your Projects.
              </p>
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
