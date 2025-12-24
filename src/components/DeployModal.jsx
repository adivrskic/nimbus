import { useState } from "react";
import {
  X,
  Rocket,
  Globe,
  Check,
  ExternalLink,
  Copy,
  Loader2,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useModalAnimation from "../hooks/useModalAnimation";
import "./DeployModal.scss";

const DEPLOY_PRICE = 3; // $3 per deployment

function DeployModal({ isOpen, onClose, projectName, html }) {
  const { user } = useAuth();
  const { isVisible, isAnimating, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );

  const [subdomain, setSubdomain] = useState(
    projectName
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30) || ""
  );
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [subdomainError, setSubdomainError] = useState(null);

  const validateSubdomain = (value) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(cleaned);

    if (cleaned.length < 3) {
      setSubdomainError("Subdomain must be at least 3 characters");
    } else if (cleaned.length > 30) {
      setSubdomainError("Subdomain must be 30 characters or less");
    } else if (cleaned.startsWith("-") || cleaned.endsWith("-")) {
      setSubdomainError("Subdomain cannot start or end with a hyphen");
    } else {
      setSubdomainError(null);
    }
  };

  const handleDeploy = async () => {
    if (!subdomain || subdomainError) return;

    setIsDeploying(true);
    setError(null);

    try {
      // Check subdomain availability
      const checkResponse = await fetch(
        `/api/deploy/check-subdomain?subdomain=${subdomain}`
      );
      const checkData = await checkResponse.json();

      if (!checkData.available) {
        setError("This subdomain is already taken. Please choose another.");
        setIsDeploying(false);
        return;
      }

      // Create Stripe checkout for deployment
      const response = await fetch("/api/deploy/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          subdomain,
          html,
          projectName,
          userId: user?.id,
          price: DEPLOY_PRICE * 100, // cents
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      // For demo purposes, simulate successful deployment
      // In production, redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Demo mode - simulate deployment
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setDeployedUrl(`https://${subdomain}.nimbus.site`);
      }
    } catch (err) {
      console.error("Deploy error:", err);
      setError("Failed to deploy. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  const copyToClipboard = () => {
    if (deployedUrl) {
      navigator.clipboard.writeText(deployedUrl);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`modal-overlay ${isAnimating ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`deploy-modal ${isAnimating ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={closeModal}>
          <X size={20} />
        </button>

        {deployedUrl ? (
          // Success state
          <div className="deploy-modal__success">
            <div className="success-icon">
              <Check size={32} />
            </div>
            <h2>Your site is live! 🎉</h2>
            <p>Your website has been deployed successfully.</p>

            <div className="deployed-url">
              <Globe size={18} />
              <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
                {deployedUrl}
              </a>
              <button onClick={copyToClipboard} title="Copy URL">
                <Copy size={16} />
              </button>
            </div>

            <div className="success-actions">
              <a
                href={deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={18} />
                Visit Site
              </a>
              <button className="btn btn-secondary" onClick={closeModal}>
                Done
              </button>
            </div>
          </div>
        ) : (
          // Configuration state
          <>
            <div className="deploy-modal__header">
              <div className="deploy-icon">
                <Rocket size={28} />
              </div>
              <h2>Deploy Your Website</h2>
              <p>Your site will be live in seconds</p>
            </div>

            <div className="deploy-modal__content">
              <div className="subdomain-input">
                <label>Choose your subdomain</label>
                <div className="subdomain-field">
                  <span className="prefix">https://</span>
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => validateSubdomain(e.target.value)}
                    placeholder="my-awesome-site"
                    maxLength={30}
                  />
                  <span className="suffix">.nimbus.site</span>
                </div>
                {subdomainError && (
                  <span className="subdomain-error">{subdomainError}</span>
                )}
                <span className="subdomain-hint">
                  Letters, numbers, and hyphens only. 3-30 characters.
                </span>
              </div>

              <div className="deploy-features">
                <div className="feature">
                  <Shield size={18} />
                  <span>Free SSL certificate</span>
                </div>
                <div className="feature">
                  <Zap size={18} />
                  <span>Global CDN</span>
                </div>
                <div className="feature">
                  <Sparkles size={18} />
                  <span>Instant deployment</span>
                </div>
              </div>

              {error && <div className="deploy-modal__error">{error}</div>}
            </div>

            <div className="deploy-modal__footer">
              <div className="price-info">
                <span>One-time deployment fee</span>
                <span className="price">${DEPLOY_PRICE}</span>
              </div>

              <button
                className="btn btn-primary deploy-btn"
                onClick={handleDeploy}
                disabled={isDeploying || !subdomain || !!subdomainError}
              >
                {isDeploying ? (
                  <>
                    <Loader2 size={18} className="spinning" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket size={18} />
                    Deploy for ${DEPLOY_PRICE}
                  </>
                )}
              </button>

              <p className="secure-note">🔒 Secure payment via Stripe</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeployModal;
