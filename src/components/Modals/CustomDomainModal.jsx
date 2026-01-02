import { useState, useEffect, useRef } from "react";
import {
  X,
  Globe,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertTriangle,
  Info,
  Settings,
  ChevronRight,
  ChevronLeft,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useModalAnimation from "../../hooks/useModalAnimation";
import "./CustomDomainModal.scss";

const SUPPORTED_PROVIDERS = [
  "Cloudflare",
  "Vercel",
  "GoDaddy",
  "Namecheap",
  "Google Domains",
];

export default function CustomDomainModal({ isOpen, onClose, project }) {
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );
  const pollIntervalRef = useRef(null);

  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState("");
  const [validation, setValidation] = useState({
    loading: false,
    canUse: null,
    error: null,
    warning: null,
    confirmedOwnership: false,
  });
  const [config, setConfig] = useState({
    loading: false,
    error: null,
    verified: false,
  });
  const [provider, setProvider] = useState(null);
  const [setupMode, setSetupMode] = useState("manual"); // 'manual' | 'auto'
  const [credentials, setCredentials] = useState({
    cloudflare: { email: "", apiToken: "" },
    vercel: { apiToken: "" },
    godaddy: { apiKey: "", apiSecret: "" },
    namecheap: { apiUser: "", apiKey: "" },
    googledomains: { username: "", password: "" },
  });
  const [copied, setCopied] = useState({});

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      if (project?.custom_domain) {
        setDomain(project.custom_domain);
        setStep(project.domain_status === "active" ? 3 : 2);
        if (project.domain_status === "active") {
          setConfig({ loading: false, error: null, verified: true });
        }
      } else {
        setStep(1);
        setDomain("");
      }
      setValidation({
        loading: false,
        canUse: null,
        error: null,
        warning: null,
        confirmedOwnership: false,
      });
      setProvider(null);
      setSetupMode("manual");
      setCopied({});
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, project]);

  const handleCredentialChange = (prov, field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [prov]: { ...prev[prov], [field]: value },
    }));
  };

  const copyValue = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied({ [key]: true });
    setTimeout(() => setCopied({}), 2000);
  };

  const validateDomain = async () => {
    if (!domain || !domain.includes(".")) return;

    setValidation({
      loading: true,
      canUse: null,
      error: null,
      warning: null,
      confirmedOwnership: false,
    });

    try {
      const { data, error } = await supabase.functions.invoke(
        "validate-domain",
        {
          body: { domain },
        }
      );

      if (error) throw error;

      setValidation({
        loading: false,
        canUse: data.canUse,
        error: data.error || null,
        warning: data.warning || null,
        confirmedOwnership: false,
      });

      if (data.detectedProvider) {
        setProvider(data.detectedProvider);
        if (SUPPORTED_PROVIDERS.includes(data.detectedProvider)) {
          setSetupMode("auto");
        }
      }

      if (data.canUse) {
        setStep(2);
      }
    } catch (err) {
      setValidation({
        loading: false,
        canUse: false,
        error: err.message,
        warning: null,
        confirmedOwnership: false,
      });
    }
  };

  const confirmOwnership = () => {
    setValidation((prev) => ({ ...prev, confirmedOwnership: true }));
    setStep(2);
  };

  const configureDomain = async () => {
    if (!domain || !project) return;

    setConfig({ loading: true, error: null, verified: false });

    try {
      const { data, error } = await supabase.functions.invoke(
        "configure-domain",
        {
          body: {
            domain,
            deploymentId: project.vercel_deployment_id,
            siteName: project.subdomain,
            projectId: project.vercel_project_id,
          },
        }
      );

      if (error) throw error;

      // Update project in database
      await supabase
        .from("projects")
        .update({
          custom_domain: domain,
          domain_status: data.domainVerified ? "active" : "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id);

      setConfig({
        loading: false,
        error: null,
        verified: data.domainVerified || false,
      });

      setStep(3);

      // Start polling if not verified
      if (!data.domainVerified) {
        startPolling();
      }
    } catch (err) {
      setConfig({ loading: false, error: err.message, verified: false });
    }
  };

  const startPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const { data } = await supabase.functions.invoke(
          "check-domain-verification",
          {
            body: {
              domain,
              deploymentId: project.vercel_deployment_id,
              siteName: project.subdomain,
            },
          }
        );

        if (data?.verified) {
          clearInterval(pollIntervalRef.current);
          setConfig((prev) => ({ ...prev, verified: true }));

          await supabase
            .from("projects")
            .update({ domain_status: "active" })
            .eq("id", project.id);
        }
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 15000);

    // Stop after 10 minutes
    setTimeout(() => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }, 600000);
  };

  const checkNow = () => {
    startPolling();
  };

  if (!shouldRender) return null;

  const renderProviderGuide = () => {
    const provKey = provider?.toLowerCase().replace(/ /g, "");

    const guides = {
      cloudflare: {
        title: "Cloudflare API Token",
        steps: [
          <>
            Log in to{" "}
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare Dashboard
            </a>
          </>,
          "Click profile icon → My Profile",
          "Go to API Tokens tab",
          "Click Create Token",
          "Use Edit zone DNS template",
          "Select your domain under Zone Resources",
          "Click Continue to summary → Create Token",
          "Copy the token (won't be shown again!)",
        ],
        fields: [
          {
            key: "email",
            label: "Cloudflare Email",
            type: "email",
            placeholder: "you@example.com",
          },
          {
            key: "apiToken",
            label: "API Token",
            type: "password",
            placeholder: "••••••••••••",
          },
        ],
      },
      vercel: {
        title: "Vercel API Token",
        steps: [
          <>
            Go to{" "}
            <a
              href="https://vercel.com/account/tokens"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel Account Settings
            </a>
          </>,
          "Scroll to Tokens section",
          "Click Create",
          "Set scope to Full Account",
          "Copy the token",
        ],
        fields: [
          {
            key: "apiToken",
            label: "API Token",
            type: "password",
            placeholder: "••••••••••••",
          },
        ],
      },
      godaddy: {
        title: "GoDaddy API Key",
        steps: [
          <>
            Go to{" "}
            <a
              href="https://developer.godaddy.com/keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              GoDaddy Developer Portal
            </a>
          </>,
          "Sign in with your account",
          "Click Create New API Key",
          "Set Environment to Production",
          "Copy both Key and Secret",
        ],
        fields: [
          {
            key: "apiKey",
            label: "API Key",
            type: "text",
            placeholder: "Your API Key",
          },
          {
            key: "apiSecret",
            label: "API Secret",
            type: "password",
            placeholder: "••••••••••••",
          },
        ],
      },
      namecheap: {
        title: "Namecheap API Key",
        steps: [
          <>
            Log in to{" "}
            <a
              href="https://www.namecheap.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Namecheap
            </a>
          </>,
          "Go to Profile → Tools",
          "Scroll to Namecheap API Access",
          "Click Manage",
          "Copy your API Key and whitelist your IP",
        ],
        note: "Namecheap requires a minimum account balance for API access.",
        fields: [
          {
            key: "apiUser",
            label: "API Username",
            type: "text",
            placeholder: "Your username",
          },
          {
            key: "apiKey",
            label: "API Key",
            type: "password",
            placeholder: "••••••••••••",
          },
        ],
      },
      googledomains: {
        title: "Google Domains Credentials",
        steps: [
          <>
            Go to{" "}
            <a
              href="https://domains.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Domains
            </a>
          </>,
          "Select your domain",
          "Go to DNS → Show advanced settings",
          "Under Dynamic DNS, create credentials",
          "Copy Username and Password",
        ],
        note: "Google Domains was acquired by Squarespace. If migrated, use Manual Setup.",
        fields: [
          {
            key: "username",
            label: "Username",
            type: "text",
            placeholder: "Your username",
          },
          {
            key: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••••••••",
          },
        ],
      },
    };

    const guide = guides[provKey];
    if (!guide) return null;

    return (
      <div className="cdm-guide">
        <h4>How to get your {guide.title}:</h4>
        <ol>
          {guide.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {guide.note && (
          <div className="cdm-guide-note">
            <AlertCircle size={12} />
            <span>{guide.note}</span>
          </div>
        )}
        <div className="cdm-fields">
          {guide.fields.map((field) => (
            <div key={field.key} className="cdm-field">
              <label>{field.label}</label>
              <input
                type={field.type}
                value={credentials[provKey]?.[field.key] || ""}
                onChange={(e) =>
                  handleCredentialChange(provKey, field.key, e.target.value)
                }
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const canConfigureAuto = () => {
    const provKey = provider?.toLowerCase().replace(/ /g, "");
    const creds = credentials[provKey];
    if (!creds) return false;

    switch (provider) {
      case "Cloudflare":
        return creds.email && creds.apiToken;
      case "Vercel":
        return creds.apiToken;
      case "GoDaddy":
        return creds.apiKey && creds.apiSecret;
      case "Namecheap":
        return creds.apiUser && creds.apiKey;
      case "Google Domains":
        return creds.username && creds.password;
      default:
        return false;
    }
  };

  return (
    <div
      className={`cdm-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`cdm-content ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step 1: Enter Domain */}
        {step === 1 && (
          <>
            <div className="cdm-header">
              <span className="cdm-title">
                <Globe size={16} />
                Custom Domain
              </span>
              <button className="cdm-close" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <div className="cdm-section">
              <p className="cdm-desc">
                Connect your domain to{" "}
                <strong>{project?.subdomain}.vercel.app</strong>
              </p>

              <div className="cdm-field">
                <label>Your Domain</label>
                <div className="cdm-input-row">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value.toLowerCase().trim());
                      setValidation({
                        loading: false,
                        canUse: null,
                        error: null,
                        warning: null,
                        confirmedOwnership: false,
                      });
                    }}
                    placeholder="example.com"
                    disabled={validation.loading}
                  />
                  <button
                    className="cdm-btn-check"
                    onClick={validateDomain}
                    disabled={
                      !domain || !domain.includes(".") || validation.loading
                    }
                  >
                    {validation.loading ? (
                      <Loader2 size={14} className="spinning" />
                    ) : (
                      "Check"
                    )}
                  </button>
                </div>
              </div>

              {/* Validation feedback */}
              {validation.canUse && !validation.warning && (
                <div className="cdm-feedback success">
                  <CheckCircle size={14} />
                  <span>Domain available!</span>
                </div>
              )}

              {validation.warning && !validation.confirmedOwnership && (
                <div className="cdm-feedback warning">
                  <AlertTriangle size={14} />
                  <div>
                    <span>{validation.warning}</span>
                    <button className="cdm-link" onClick={confirmOwnership}>
                      I own this domain
                    </button>
                  </div>
                </div>
              )}

              {validation.confirmedOwnership && (
                <div className="cdm-feedback success">
                  <CheckCircle size={14} />
                  <span>Ownership confirmed</span>
                </div>
              )}

              {validation.error && !validation.canUse && (
                <div className="cdm-feedback error">
                  <AlertCircle size={14} />
                  <span>{validation.error}</span>
                </div>
              )}

              {/* Detected provider */}
              {provider &&
                SUPPORTED_PROVIDERS.includes(provider) &&
                (validation.canUse || validation.confirmedOwnership) && (
                  <div className="cdm-feedback info">
                    <Zap size={14} />
                    <span>
                      Detected: <strong>{provider}</strong> — Auto-setup
                      available
                    </span>
                  </div>
                )}
            </div>

            <div className="cdm-info">
              <Info size={14} />
              <span>
                Supported for auto-setup: Cloudflare, Vercel, GoDaddy,
                Namecheap, Google Domains
              </span>
            </div>

            <div className="cdm-nav">
              <button className="cdm-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="cdm-btn-primary"
                onClick={() => setStep(2)}
                disabled={!validation.canUse && !validation.confirmedOwnership}
              >
                Continue
                <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Configure DNS */}
        {step === 2 && (
          <>
            <div className="cdm-header">
              <span className="cdm-title">
                <Settings size={16} />
                Configure DNS
              </span>
              <button className="cdm-close" onClick={() => setStep(1)}>
                <ChevronLeft size={16} />
              </button>
            </div>

            <div className="cdm-section">
              <p className="cdm-desc">
                Setting up <strong>{domain}</strong>
              </p>

              {/* Method selection */}
              <div className="cdm-methods">
                <button
                  className={`cdm-method ${
                    setupMode === "auto" ? "active" : ""
                  }`}
                  onClick={() => setSetupMode("auto")}
                >
                  <Zap size={16} />
                  <span>Automatic</span>
                </button>
                <button
                  className={`cdm-method ${
                    setupMode === "manual" ? "active" : ""
                  }`}
                  onClick={() => setSetupMode("manual")}
                >
                  <Settings size={16} />
                  <span>Manual</span>
                </button>
              </div>

              {/* Detected provider badge */}
              {provider && SUPPORTED_PROVIDERS.includes(provider) && (
                <div className="cdm-provider-badge">
                  <CheckCircle size={12} />
                  <span>Detected: {provider}</span>
                </div>
              )}
            </div>

            {/* Automatic setup */}
            {setupMode === "auto" && (
              <div className="cdm-auto-section">
                {/* Security note */}
                <div className="cdm-security">
                  <Shield size={14} />
                  <div>
                    <strong>Your credentials are secure</strong>
                    <p>
                      Used once to configure DNS, then immediately discarded.
                      Never stored.
                    </p>
                  </div>
                </div>

                {/* Provider selector */}
                <div className="cdm-providers">
                  <label>Select provider:</label>
                  <div className="cdm-provider-list">
                    {SUPPORTED_PROVIDERS.map((p) => (
                      <button
                        key={p}
                        className={`cdm-provider-btn ${
                          provider === p ? "active" : ""
                        }`}
                        onClick={() => setProvider(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Provider guide */}
                {SUPPORTED_PROVIDERS.includes(provider) ? (
                  renderProviderGuide()
                ) : (
                  <div className="cdm-select-prompt">
                    <p>
                      Select your domain provider above for setup instructions.
                    </p>
                    <p className="cdm-muted">
                      Don't see your provider? Use Manual setup.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Manual setup */}
            {setupMode === "manual" && (
              <div className="cdm-manual-section">
                <p className="cdm-manual-intro">
                  Add these DNS records at your domain provider:
                </p>

                <div className="cdm-dns-records">
                  <div className="cdm-dns-record">
                    <span className="cdm-dns-type">A</span>
                    <div className="cdm-dns-details">
                      <div className="cdm-dns-row">
                        <span>Host:</span>
                        <code>@</code>
                        <span className="cdm-muted">(or blank)</span>
                      </div>
                      <div className="cdm-dns-row">
                        <span>Value:</span>
                        <code>76.76.21.21</code>
                        <button onClick={() => copyValue("a", "76.76.21.21")}>
                          {copied.a ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="cdm-dns-row">
                        <span>TTL:</span>
                        <code>3600</code>
                        <span className="cdm-muted">(or Auto)</span>
                      </div>
                    </div>
                  </div>

                  <div className="cdm-dns-record">
                    <span className="cdm-dns-type">CNAME</span>
                    <div className="cdm-dns-details">
                      <div className="cdm-dns-row">
                        <span>Host:</span>
                        <code>www</code>
                      </div>
                      <div className="cdm-dns-row">
                        <span>Value:</span>
                        <code>cname.vercel-dns.com</code>
                        <button
                          onClick={() =>
                            copyValue("cname", "cname.vercel-dns.com")
                          }
                        >
                          {copied.cname ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                      <div className="cdm-dns-row">
                        <span>TTL:</span>
                        <code>3600</code>
                        <span className="cdm-muted">(or Auto)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="cdm-dns-note">
                  DNS changes take 5-60 minutes to propagate worldwide.
                </p>
              </div>
            )}

            {config.error && (
              <div className="cdm-feedback error">
                <AlertCircle size={14} />
                <span>{config.error}</span>
              </div>
            )}

            <div className="cdm-nav">
              <button
                className="cdm-btn-secondary"
                onClick={() => setStep(1)}
                disabled={config.loading}
              >
                <ChevronLeft size={14} />
                Back
              </button>
              <button className="cdm-btn-secondary" onClick={closeModal}>
                Skip for Now
              </button>
              <button
                className="cdm-btn-primary"
                onClick={configureDomain}
                disabled={
                  config.loading ||
                  (setupMode === "auto" && !canConfigureAuto())
                }
              >
                {config.loading ? (
                  <>
                    <Loader2 size={14} className="spinning" />
                    Configuring...
                  </>
                ) : setupMode === "manual" ? (
                  <>
                    <Check size={14} />
                    I've Added Records
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    Configure Automatically
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Step 3: Success / Status */}
        {step === 3 && (
          <>
            <div className="cdm-header">
              <span
                className={`cdm-title ${
                  config.verified ? "cdm-title--success" : ""
                }`}
              >
                {config.verified ? <Check size={16} /> : <Globe size={16} />}
                {config.verified ? "Domain Active" : "Configuring..."}
              </span>
              <button className="cdm-close" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <div className="cdm-status-section">
              <div className="cdm-status-row">
                <span>Domain</span>
                <strong>{domain}</strong>
              </div>
              <div className="cdm-status-row">
                <span>Status</span>
                <span
                  className={`cdm-status-badge ${
                    config.verified ? "active" : "pending"
                  }`}
                >
                  {config.verified ? "Active" : "Pending"}
                </span>
              </div>
            </div>

            {!config.verified && (
              <div className="cdm-progress">
                <div className="cdm-progress-header">
                  <Loader2 size={14} className="spinning" />
                  <span>Waiting for DNS propagation...</span>
                </div>
                <div className="cdm-progress-bar">
                  <div className="cdm-progress-fill" />
                </div>
                <p className="cdm-progress-note">
                  Usually takes 1-5 minutes. We'll update automatically.
                </p>
              </div>
            )}

            {config.verified && (
              <div className="cdm-complete">
                <Check size={16} />
                <div>
                  <strong>Setup Complete</strong>
                  <p>Your domain is live with automatic SSL and global CDN.</p>
                </div>
              </div>
            )}

            <div className="cdm-nav">
              <button className="cdm-btn-secondary" onClick={closeModal}>
                Close
              </button>
              {!config.verified && (
                <button className="cdm-btn-secondary" onClick={checkNow}>
                  <RefreshCw size={14} />
                  Check Now
                </button>
              )}
              <a
                href={`https://${
                  config.verified ? domain : project?.subdomain + ".vercel.app"
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="cdm-btn-primary"
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
