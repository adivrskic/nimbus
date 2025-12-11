import { useState, useEffect } from "react";
import {
  X,
  Globe,
  Check,
  AlertCircle,
  Loader,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertTriangle,
  Info,
  Key,
  Settings,
  ChevronRight,
  ChevronLeft,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import useModalAnimation from "../hooks/useModalAnimation";
import "./CustomDomainRegistrationModal.scss";

export default function CustomDomainRegistrationModal({
  isOpen,
  onClose,
  site,
}) {
  const { shouldRender, isVisible } = useModalAnimation(isOpen, 300);
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState("");
  const [validation, setValidation] = useState({
    loading: false,
    available: null,
    canUse: null,
    error: null,
    warning: null,
    userConfirmedOwnership: false,
  });
  const [configuration, setConfiguration] = useState({
    loading: false,
    success: false,
    error: null,
    dnsRecords: [],
    verificationRecord: null,
    domainConfigured: false,
    domainVerified: false,
    autoConfigureAttempted: false,
    autoConfigureStatus: null, // 'pending', 'success', 'failed'
  });
  const [copied, setCopied] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCheckingAutoConfigure, setIsCheckingAutoConfigure] = useState(false);
  const [registrarDetected, setRegistrarDetected] = useState(null);
  const [autoConfigSupported, setAutoConfigSupported] = useState(true);
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [apiCredentials, setApiCredentials] = useState({
    cloudflare: { apiToken: "", email: "" },
    vercel: { apiToken: "" },
    godaddy: { apiKey: "", apiSecret: "" },
    namecheap: { apiUser: "", apiKey: "" },
    googledomains: { username: "", password: "" },
  });

  const supportedProviders = [
    "Cloudflare",
    "Vercel",
    "GoDaddy",
    "Namecheap",
    "Google Domains",
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDomain(site?.custom_domain || "");
      setValidation({
        loading: false,
        available: null,
        canUse: null,
        error: null,
        warning: null,
        userConfirmedOwnership: false,
      });
      setConfiguration({
        loading: false,
        success: false,
        error: null,
        dnsRecords: [],
        verificationRecord: null,
        domainConfigured: false,
        domainVerified: false,
        autoConfigureAttempted: false,
        autoConfigureStatus: null,
      });
      setShowAdvanced(false);
      setCopied({});
      setRegistrarDetected(null);
      setAutoConfigSupported(true);
      setShowCredentialForm(false);
      setApiCredentials({
        cloudflare: { apiToken: "", email: "" },
        vercel: { apiToken: "" },
        godaddy: { apiKey: "", apiSecret: "" },
        namecheap: { apiUser: "", apiKey: "" },
        googledomains: { username: "", password: "" },
      });

      if (site?.custom_domain) {
        setDomain(site.custom_domain);
        setStep(2);
      }
    }
  }, [isOpen, site]);

  // Handle credentials change
  const handleCredentialsChange = (registrar, field, value) => {
    setApiCredentials((prev) => ({
      ...prev,
      [registrar]: {
        ...prev[registrar],
        [field]: value,
      },
    }));
  };

  const validateDomain = async () => {
    if (!domain) return;

    setValidation({
      loading: true,
      available: null,
      canUse: null,
      error: null,
      warning: null,
      userConfirmedOwnership: false,
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
        available: data.available,
        canUse: data.canUse,
        error: data.error || null,
        warning: data.warning || null,
        validationStatus: data.validationStatus,
        userConfirmedOwnership: false,
      });

      // If provider was detected, set it and auto-select automatic setup
      if (data.detectedProvider) {
        setRegistrarDetected(data.detectedProvider);
        // Squarespace doesn't have a public DNS API, so default to manual
        const providersWithAutoConfig = [
          "Cloudflare",
          "Vercel",
          "GoDaddy",
          "Namecheap",
          "Google Domains",
        ];
        if (providersWithAutoConfig.includes(data.detectedProvider)) {
          setAutoConfigSupported(true);
          setShowCredentialForm(true); // Auto-select automatic setup
        } else {
          // Provider detected but no auto-config (e.g., Squarespace)
          setAutoConfigSupported(false);
          setShowCredentialForm(false); // Default to manual setup
        }
      } else {
        setRegistrarDetected(null);
        setAutoConfigSupported(true);
        setShowCredentialForm(false); // Default to manual setup
      }

      // Move to step 2 if domain can be used
      if (data.canUse) {
        setStep(2);
      }
    } catch (err) {
      setValidation({
        loading: false,
        available: false,
        canUse: false,
        error: err.message,
        warning: null,
        userConfirmedOwnership: false,
      });
    }
  };

  const confirmOwnership = () => {
    setValidation((prev) => ({
      ...prev,
      userConfirmedOwnership: true,
    }));
    setStep(2);
  };

  // Automated domain configuration with auto-DNS setup
  const configureDomainAutomated = async () => {
    if (!domain || !site) return;

    setConfiguration((prev) => ({
      ...prev,
      loading: true,
      autoConfigureAttempted: true,
      autoConfigureStatus: "pending",
    }));

    try {
      // First, try auto-configuration if supported
      if (autoConfigSupported && registrarDetected) {
        const { data: autoData, error: autoError } =
          await supabase.functions.invoke("configure-domain-automated", {
            body: {
              domain: domain,
              deploymentId: site.vercel_deployment_id,
              siteName: site.site_name,
              projectId: site.vercel_project_id,
              registrar: registrarDetected,
              attemptAutoDns: true,
            },
          });

        if (autoError) {
          console.log(
            "Auto-configuration failed, falling back to manual:",
            autoError
          );
          // Fall back to manual configuration
          await configureDomainManual();
        } else if (autoData.success) {
          // Auto-configuration succeeded!
          handleAutoConfigSuccess(autoData);
          return;
        }
      } else {
        // Proceed with manual configuration
        await configureDomainManual();
      }
    } catch (err) {
      setConfiguration((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Configuration failed",
        autoConfigureStatus: "failed",
      }));
    }
  };

  const configureDomainManual = async () => {
    const { data, error } = await supabase.functions.invoke(
      "configure-domain",
      {
        body: {
          domain: domain,
          deploymentId: site.vercel_deployment_id,
          siteName: site.site_name,
          projectId: site.vercel_project_id,
        },
      }
    );

    if (error) throw error;

    if (data.success) {
      setConfiguration({
        loading: false,
        success: true,
        error: null,
        dnsRecords: data.dnsRecords || [],
        verificationRecord: data.verificationRecord || null,
        domainConfigured: data.domainConfigured,
        domainVerified: data.domainVerified,
        autoConfigureAttempted: true,
        autoConfigureStatus: data.domainConfigured ? "partial" : "manual",
      });

      // Update site in database
      await updateSiteDomainStatus(data.domainVerified);

      // Start polling for DNS verification
      if (!data.domainVerified) {
        startDnsVerificationPolling();
      } else {
        setStep(3);
      }
    } else {
      throw new Error(data.error || "Configuration failed");
    }
  };

  const handleAutoConfigSuccess = async (data) => {
    setConfiguration({
      loading: false,
      success: true,
      error: null,
      dnsRecords: data.dnsRecords || [],
      verificationRecord: data.verificationRecord || null,
      domainConfigured: data.domainConfigured,
      domainVerified: data.domainVerified,
      autoConfigureAttempted: true,
      autoConfigureStatus: data.fullyAutomated ? "success" : "partial",
    });

    await updateSiteDomainStatus(data.domainVerified);

    if (data.domainVerified) {
      setStep(3);
    } else if (data.domainConfigured) {
      // Start polling for auto-configured domains
      startDnsVerificationPolling();
      setStep(3); // Go to success step with polling
    }
  };

  const updateSiteDomainStatus = async (isVerified) => {
    const { error: updateError } = await supabase
      .from("sites")
      .update({
        custom_domain: domain,
        domain_status: isVerified ? "active" : "pending_setup",
        updated_at: new Date().toISOString(),
      })
      .eq("id", site.id);

    if (updateError) {
      console.error("Failed to update site:", updateError);
    }
  };

  const startDnsVerificationPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "check-domain-verification",
          {
            body: { domain, deploymentId: site.vercel_deployment_id },
          }
        );

        if (!error && data?.verified) {
          clearInterval(pollInterval);
          setConfiguration((prev) => ({
            ...prev,
            domainVerified: true,
          }));
          await updateSiteDomainStatus(true);

          // Update UI to show success
          setTimeout(() => {
            setStep(3);
          }, 1000);
        }
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 15000); // Check every 15 seconds

    // Clear after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 600000);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => {
      setCopied({ ...copied, [key]: false });
    }, 2000);
  };

  const handleClose = () => {
    onClose();
  };

  const attemptAutoDnsSetup = async () => {
    setIsCheckingAutoConfigure(true);
    try {
      const { data } = await supabase.functions.invoke("check-dns-status", {
        body: { domain },
      });

      if (data?.canAutoSetup) {
        // Show option to auto-setup
        setConfiguration((prev) => ({
          ...prev,
          autoConfigureAvailable: true,
        }));
      }
    } catch (err) {
      console.log("Auto DNS check failed");
    } finally {
      setIsCheckingAutoConfigure(false);
    }
  };

  if (!shouldRender) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="domain-input-step">
            <div className="step-header">
              <div className="step-icon">
                <Globe size={24} />
              </div>
              <div>
                <h3>Add Custom Domain</h3>
                <p>Connect your own domain to {site?.site_name}.vercel.app</p>
              </div>
            </div>

            <div className="domain-form">
              <div className="form-group">
                <label htmlFor="domain">Enter your domain</label>
                <div className="domain-input-with-check">
                  <input
                    id="domain"
                    type="text"
                    value={domain}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().trim();
                      setDomain(value);
                      // Reset validation when domain changes
                      setValidation({
                        loading: false,
                        available: null,
                        canUse: null,
                        error: null,
                        warning: null,
                        userConfirmedOwnership: false,
                      });
                    }}
                    placeholder="example.com"
                    className="domain-input"
                    disabled={validation.loading}
                  />
                  <button
                    type="button"
                    className="btn btn-check"
                    onClick={validateDomain}
                    disabled={
                      !domain || !domain.includes(".") || validation.loading
                    }
                  >
                    {validation.loading ? (
                      <Loader size={16} className="spinning" />
                    ) : (
                      "Check"
                    )}
                  </button>
                </div>

                {/* Inline validation feedback */}
                {validation.loading && (
                  <div className="validation-feedback loading">
                    <Loader size={14} className="spinning" />
                    <span>Checking domain...</span>
                  </div>
                )}

                {validation.canUse &&
                  validation.available &&
                  !validation.warning && (
                    <div className="validation-feedback success">
                      <CheckCircle size={14} />
                      <span>Domain is available!</span>
                    </div>
                  )}

                {validation.canUse &&
                  validation.warning &&
                  !validation.userConfirmedOwnership && (
                    <div className="validation-feedback warning">
                      <AlertTriangle size={14} />
                      <div className="warning-content">
                        <span>{validation.warning}</span>
                        <button
                          type="button"
                          className="btn-link"
                          onClick={confirmOwnership}
                        >
                          I own this domain
                        </button>
                      </div>
                    </div>
                  )}

                {validation.canUse && validation.userConfirmedOwnership && (
                  <div className="validation-feedback success">
                    <CheckCircle size={14} />
                    <span>Ownership confirmed - ready to configure</span>
                  </div>
                )}

                {validation.error && !validation.canUse && (
                  <div className="validation-feedback error">
                    <AlertCircle size={14} />
                    <span>{validation.error}</span>
                  </div>
                )}

                {/* Show detected provider */}
                {supportedProviders.includes(registrarDetected) &&
                  (validation.canUse || validation.userConfirmedOwnership) && (
                    <div className="detected-provider">
                      <CheckCircle size={14} />
                      <span>
                        Detected: <strong>{registrarDetected}</strong> -
                        Automatic setup available
                      </span>
                    </div>
                  )}
              </div>

              <div className="domain-tips">
                <div className="tip">
                  <Info size={16} />
                  <div>
                    <strong>Supported Providers for Auto-Setup:</strong>
                    <span className="provider-list">
                      Cloudflare, Vercel, GoDaddy, Namecheap, Google Domains
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={
                  !validation.canUse && !validation.userConfirmedOwnership
                }
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="dns-setup-step">
            <div className="step-header">
              <div className="step-icon">
                <Settings size={24} />
              </div>
              <div>
                <h3>Configure DNS Records</h3>
                <p>Choose how you'd like to set up your domain</p>
              </div>
            </div>

            {/* Configuration Method Selection */}
            <div className="config-method">
              <h4>How would you like to configure DNS?</h4>

              {/* Show detected provider */}
              {supportedProviders.includes(registrarDetected) && (
                <div className="detected-provider">
                  <CheckCircle size={16} />
                  <span>
                    Detected: <strong>{registrarDetected}</strong>
                  </span>
                </div>
              )}

              <div className="method-options">
                <div
                  className={`method-option ${
                    showCredentialForm ? "selected" : ""
                  }`}
                  onClick={() => setShowCredentialForm(true)}
                >
                  <div className="method-icon">
                    <Zap size={24} />
                  </div>
                  <div className="method-content">
                    <h5>Automatic Setup</h5>
                    <p>
                      We'll configure DNS records automatically using your
                      domain provider's API
                    </p>
                  </div>
                </div>
                <div
                  className={`method-option ${
                    !showCredentialForm ? "selected" : ""
                  }`}
                  onClick={() => setShowCredentialForm(false)}
                >
                  <div className="method-icon">
                    <Settings size={24} />
                  </div>
                  <div className="method-content">
                    <h5>Manual Setup</h5>
                    <p>We'll provide DNS records for you to add manually</p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="config-disclaimer">
                <Info size={14} />
                <span>
                  You can skip this step and configure DNS later from your site
                  settings.
                </span>
              </div>
            </div>

            {/* Automatic Setup Form */}
            {showCredentialForm && (
              <div className="api-credentials-form">
                <h4>Automatic DNS Configuration</h4>
                <div className="form-description">
                  <p>
                    Select your domain provider and enter your API credentials.
                  </p>
                </div>

                {/* Security Disclaimer */}
                <div className="security-disclaimer">
                  <Shield size={16} />
                  <div>
                    <strong>Your credentials are secure</strong>
                    <p>
                      Your API token is used once to configure DNS records and
                      is immediately discarded. We never store your credentials.
                    </p>
                  </div>
                </div>

                {/* Provider Selector */}
                <div className="provider-selector">
                  <label>Select your domain provider:</label>
                  <div className="provider-options">
                    {supportedProviders.map((provider) => (
                      <button
                        key={provider}
                        type="button"
                        className={`provider-option ${
                          registrarDetected === provider ? "selected" : ""
                        }`}
                        onClick={() => setRegistrarDetected(provider)}
                      >
                        <span className="provider-name">{provider}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Provider-specific forms */}
                {!supportedProviders.includes(registrarDetected) && (
                  <div className="provider-select-prompt">
                    <p>
                      Select your domain provider above to see setup
                      instructions.
                    </p>
                    <p className="provider-note">
                      Don't see your provider? Choose{" "}
                      <strong>Manual Setup</strong> instead.
                    </p>
                  </div>
                )}

                {/* Cloudflare */}
                {registrarDetected === "Cloudflare" && (
                  <>
                    <div className="setup-guide">
                      <h5>How to get your Cloudflare API Token:</h5>
                      <ol className="guide-steps">
                        <li>
                          Log in to your{" "}
                          <a
                            href="https://dash.cloudflare.com"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Cloudflare Dashboard
                          </a>
                        </li>
                        <li>
                          Click on your profile icon (top right) →{" "}
                          <strong>My Profile</strong>
                        </li>
                        <li>
                          Go to <strong>API Tokens</strong> tab
                        </li>
                        <li>
                          Click <strong>Create Token</strong>
                        </li>
                        <li>
                          Use the <strong>Edit zone DNS</strong> template
                        </li>
                        <li>Under Zone Resources, select your domain</li>
                        <li>
                          Click <strong>Continue to summary</strong> →{" "}
                          <strong>Create Token</strong>
                        </li>
                        <li>
                          Copy the token (you won't be able to see it again!)
                        </li>
                      </ol>
                    </div>
                    <div className="form-fields">
                      <div className="form-group">
                        <label>Cloudflare Email</label>
                        <input
                          type="email"
                          value={apiCredentials.cloudflare.email}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "cloudflare",
                              "email",
                              e.target.value
                            )
                          }
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>API Token</label>
                        <input
                          type="password"
                          value={apiCredentials.cloudflare.apiToken}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "cloudflare",
                              "apiToken",
                              e.target.value
                            )
                          }
                          placeholder="••••••••••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Vercel */}
                {registrarDetected === "Vercel" && (
                  <>
                    <div className="setup-guide">
                      <h5>How to get your Vercel API Token:</h5>
                      <ol className="guide-steps">
                        <li>
                          Go to your{" "}
                          <a
                            href="https://vercel.com/account/tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Vercel Account Settings
                          </a>
                        </li>
                        <li>
                          Scroll to <strong>Tokens</strong> section
                        </li>
                        <li>
                          Click <strong>Create</strong>
                        </li>
                        <li>
                          Give it a name and set scope to{" "}
                          <strong>Full Account</strong>
                        </li>
                        <li>Copy the token</li>
                      </ol>
                    </div>
                    <div className="form-fields">
                      <div className="form-group">
                        <label>Vercel API Token</label>
                        <input
                          type="password"
                          value={apiCredentials.vercel?.apiToken || ""}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "vercel",
                              "apiToken",
                              e.target.value
                            )
                          }
                          placeholder="••••••••••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* GoDaddy */}
                {registrarDetected === "GoDaddy" && (
                  <>
                    <div className="setup-guide">
                      <h5>How to get your GoDaddy API Key:</h5>
                      <ol className="guide-steps">
                        <li>
                          Go to{" "}
                          <a
                            href="https://developer.godaddy.com/keys"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GoDaddy Developer Portal
                          </a>
                        </li>
                        <li>Sign in with your GoDaddy account</li>
                        <li>
                          Click <strong>Create New API Key</strong>
                        </li>
                        <li>
                          Set Environment to <strong>Production</strong>
                        </li>
                        <li>
                          Copy both the <strong>Key</strong> and{" "}
                          <strong>Secret</strong>
                        </li>
                      </ol>
                    </div>
                    <div className="form-fields">
                      <div className="form-group">
                        <label>API Key</label>
                        <input
                          type="text"
                          value={apiCredentials.godaddy?.apiKey || ""}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "godaddy",
                              "apiKey",
                              e.target.value
                            )
                          }
                          placeholder="Your GoDaddy API Key"
                        />
                      </div>
                      <div className="form-group">
                        <label>API Secret</label>
                        <input
                          type="password"
                          value={apiCredentials.godaddy?.apiSecret || ""}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "godaddy",
                              "apiSecret",
                              e.target.value
                            )
                          }
                          placeholder="••••••••••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Namecheap */}
                {registrarDetected === "Namecheap" && (
                  <>
                    <div className="setup-guide">
                      <h5>How to get your Namecheap API Key:</h5>
                      <ol className="guide-steps">
                        <li>
                          Log in to{" "}
                          <a
                            href="https://www.namecheap.com"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Namecheap
                          </a>
                        </li>
                        <li>
                          Go to <strong>Profile</strong> →{" "}
                          <strong>Tools</strong>
                        </li>
                        <li>
                          Scroll to <strong>Namecheap API Access</strong>
                        </li>
                        <li>
                          Click <strong>Manage</strong>
                        </li>
                        <li>Copy your API Key and whitelist your IP</li>
                      </ol>
                      <div className="guide-note">
                        <AlertCircle size={14} />
                        <span>
                          Note: Namecheap requires a minimum account balance to
                          enable API access.
                        </span>
                      </div>
                    </div>
                    <div className="form-fields">
                      <div className="form-group">
                        <label>API Username</label>
                        <input
                          type="text"
                          value={apiCredentials.namecheap?.apiUser || ""}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "namecheap",
                              "apiUser",
                              e.target.value
                            )
                          }
                          placeholder="Your Namecheap username"
                        />
                      </div>
                      <div className="form-group">
                        <label>API Key</label>
                        <input
                          type="password"
                          value={apiCredentials.namecheap?.apiKey || ""}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "namecheap",
                              "apiKey",
                              e.target.value
                            )
                          }
                          placeholder="••••••••••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Google Domains */}
                {registrarDetected === "Google Domains" && (
                  <>
                    <div className="setup-guide">
                      <h5>How to get your Google Domains credentials:</h5>
                      <ol className="guide-steps">
                        <li>
                          Go to{" "}
                          <a
                            href="https://domains.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Google Domains
                          </a>
                        </li>
                        <li>Select your domain</li>
                        <li>
                          Go to <strong>DNS</strong> →{" "}
                          <strong>Show advanced settings</strong>
                        </li>
                        <li>
                          Under <strong>Dynamic DNS</strong>, create credentials
                        </li>
                        <li>
                          Copy the <strong>Username</strong> and{" "}
                          <strong>Password</strong>
                        </li>
                      </ol>
                      <div className="guide-note">
                        <AlertCircle size={14} />
                        <span>
                          Note: Google Domains was acquired by Squarespace. If
                          migrated, use Manual Setup.
                        </span>
                      </div>
                    </div>
                    <div className="form-fields">
                      <div className="form-group">
                        <label>API Username</label>
                        <input
                          type="text"
                          value={apiCredentials.googledomains?.username || ""}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "googledomains",
                              "username",
                              e.target.value
                            )
                          }
                          placeholder="Your Google Domains username"
                        />
                      </div>
                      <div className="form-group">
                        <label>API Password</label>
                        <input
                          type="password"
                          value={apiCredentials.googledomains?.password || ""}
                          onChange={(e) =>
                            handleCredentialsChange(
                              "googledomains",
                              "password",
                              e.target.value
                            )
                          }
                          placeholder="••••••••••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Save button */}
                {supportedProviders.includes(registrarDetected) && (
                  <div className="form-actions">
                    <button
                      className="btn btn-primary"
                      onClick={configureDomainAutomated}
                      disabled={
                        configuration.loading ||
                        (registrarDetected === "Cloudflare" &&
                          (!apiCredentials.cloudflare?.email ||
                            !apiCredentials.cloudflare?.apiToken)) ||
                        (registrarDetected === "Vercel" &&
                          !apiCredentials.vercel?.apiToken) ||
                        (registrarDetected === "GoDaddy" &&
                          (!apiCredentials.godaddy?.apiKey ||
                            !apiCredentials.godaddy?.apiSecret)) ||
                        (registrarDetected === "Namecheap" &&
                          (!apiCredentials.namecheap?.apiUser ||
                            !apiCredentials.namecheap?.apiKey)) ||
                        (registrarDetected === "Google Domains" &&
                          (!apiCredentials.googledomains?.username ||
                            !apiCredentials.googledomains?.password))
                      }
                    >
                      {configuration.loading ? (
                        <>
                          <Loader size={16} className="spinning" />
                          Configuring...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Configure Domain
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Manual Setup Guide */}
            {!showCredentialForm && (
              <div className="manual-setup-guide">
                <h4>Manual DNS Configuration</h4>
                <p className="guide-intro">
                  Add these DNS records at your domain provider to connect{" "}
                  <strong>{domain}</strong> to your site.
                </p>

                <div className="dns-records-preview">
                  <h5>DNS Records to Add</h5>
                  <div className="dns-record-item">
                    <div className="record-badge">A Record</div>
                    <div className="record-details">
                      <div className="record-row">
                        <span className="record-label">Host/Name:</span>
                        <code className="record-value-code">@</code>
                        <span className="record-hint">(or leave blank)</span>
                      </div>
                      <div className="record-row">
                        <span className="record-label">Value/Points to:</span>
                        <code className="record-value-code">76.76.21.21</code>
                        <button
                          className="btn-copy-inline"
                          onClick={() =>
                            copyToClipboard("76.76.21.21", "a-record")
                          }
                        >
                          {copied["a-record"] ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                      <div className="record-row">
                        <span className="record-label">TTL:</span>
                        <code className="record-value-code">3600</code>
                        <span className="record-hint">(or Auto)</span>
                      </div>
                    </div>
                  </div>
                  <div className="dns-record-item">
                    <div className="record-badge">CNAME Record</div>
                    <div className="record-details">
                      <div className="record-row">
                        <span className="record-label">Host/Name:</span>
                        <code className="record-value-code">www</code>
                      </div>
                      <div className="record-row">
                        <span className="record-label">Value/Points to:</span>
                        <code className="record-value-code">
                          cname.vercel-dns.com
                        </code>
                        <button
                          className="btn-copy-inline"
                          onClick={() =>
                            copyToClipboard(
                              "cname.vercel-dns.com",
                              "cname-record"
                            )
                          }
                        >
                          {copied["cname-record"] ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                      <div className="record-row">
                        <span className="record-label">TTL:</span>
                        <code className="record-value-code">3600</code>
                        <span className="record-hint">(or Auto)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={configureDomainAutomated}
                    disabled={configuration.loading}
                  >
                    {configuration.loading ? (
                      <>
                        <Loader size={16} className="spinning" />
                        Configuring...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        I've Added the Records
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="step-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setStep(1)}
                disabled={configuration.loading}
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button className="btn btn-outline" onClick={handleClose}>
                Skip for Now
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="success-step">
            <div className="success-icon">
              <Check size={32} />
            </div>
            <h3>
              {configuration.domainVerified
                ? "Domain Successfully Configured!"
                : "Domain Configuration Started!"}
            </h3>

            <div className="domain-status">
              <div className="status-item">
                <span className="status-label">Domain</span>
                <span className="status-value">{domain}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Status</span>
                <span
                  className={`status-badge ${
                    configuration.domainVerified ? "verified" : "pending"
                  }`}
                >
                  {configuration.domainVerified ? "Active" : "Configuring..."}
                </span>
              </div>
              {configuration.autoConfigureStatus && (
                <div className="status-item">
                  <span className="status-label">Setup Mode</span>
                  <span className="status-value">
                    {configuration.autoConfigureStatus === "success"
                      ? "Fully Automated"
                      : configuration.autoConfigureStatus === "partial"
                      ? "Semi-Automated"
                      : "Manual"}
                  </span>
                </div>
              )}
            </div>

            {!configuration.domainVerified && (
              <div className="verification-progress">
                <div className="progress-header">
                  <Loader size={16} className="spinning" />
                  <span>Waiting for DNS propagation...</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" />
                </div>
                <p className="progress-note">
                  This usually takes 1-5 minutes. We'll update automatically
                  when complete.
                </p>
              </div>
            )}

            <div className="success-actions">
              <button className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
              <a
                href={`https://${
                  configuration.domainVerified ? domain : site?.site_name
                }.vercel.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={16} />
                Visit Site
              </a>
              {!configuration.domainVerified && (
                <button
                  className="btn btn-outline"
                  onClick={startDnsVerificationPolling}
                >
                  <RefreshCw size={16} />
                  Check Now
                </button>
              )}
            </div>

            {configuration.domainVerified && (
              <div className="setup-complete">
                <div className="complete-card">
                  <Check size={20} />
                  <div>
                    <h5>Setup Complete</h5>
                    <p>
                      Your domain is now live with automatic SSL and global CDN.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`cdrm-modal-backdrop modal-backdrop ${
          isVisible ? "modal-backdrop--visible" : ""
        }`}
        onClick={handleClose}
      />
      <div
        className={`custom-domain-modal ${
          isVisible ? "custom-domain-modal--visible" : ""
        }`}
      >
        <div className="modal-header">
          <div className="header-content">
            <button className="modal-close" onClick={handleClose}>
              <X size={20} />
            </button>
            <div className="header-text">
              <h2>Custom Domain Setup</h2>
              <p>
                {autoConfigSupported
                  ? "Automated domain configuration"
                  : "Connect your own domain to your site"}
              </p>
            </div>
          </div>
          <div className="step-indicator">
            <div
              className={`step-dot ${step >= 1 ? "active" : ""} ${
                step > 1 ? "completed" : ""
              }`}
            >
              {step > 1 ? <Check size={12} /> : "1"}
            </div>
            <div className="step-line" />
            <div
              className={`step-dot ${step >= 2 ? "active" : ""} ${
                step > 2 ? "completed" : ""
              }`}
            >
              {step > 2 ? <Check size={12} /> : "2"}
            </div>
            <div className="step-line" />
            <div className={`step-dot ${step >= 3 ? "active" : ""}`}>3</div>
          </div>
        </div>

        <div className="modal-content">{renderStep()}</div>
      </div>
    </>
  );
}
