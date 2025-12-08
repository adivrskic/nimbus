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
    error: null,
    details: null,
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
  const [autoConfigSupported, setAutoConfigSupported] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDomain(site?.custom_domain || "");
      setValidation({
        loading: false,
        available: null,
        error: null,
        details: null,
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
      setAutoConfigSupported(false);

      if (site?.custom_domain) {
        setDomain(site.custom_domain);
        // Check if we can auto-configure
        detectRegistrar(site.custom_domain);
        setStep(2);
      }
    }
  }, [isOpen, site]);

  // Function to detect registrar for potential auto-configuration
  const detectRegistrar = async (domain) => {
    try {
      const { data } = await supabase.functions.invoke("detect-registrar", {
        body: { domain },
      });

      if (data?.registrar) {
        setRegistrarDetected(data.registrar);
        // Check if this registrar supports auto-configuration
        const supportedRegistrars = [
          "cloudflare",
          "vercel",
          "go daddy",
          "namecheap",
          "google domains",
        ];
        const isSupported = supportedRegistrars.some((r) =>
          data.registrar.toLowerCase().includes(r)
        );
        setAutoConfigSupported(isSupported);
      }
    } catch (err) {
      console.log("Registrar detection failed, proceeding manually");
    }
  };

  const validateDomain = async () => {
    if (!domain) return;

    setValidation({
      loading: true,
      available: null,
      error: null,
      details: null,
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
        error: data.error || null,
        details: data.details,
      });

      if (data.available) {
        // Try to detect registrar for auto-configuration
        detectRegistrar(domain);
        setStep(2);
      }
    } catch (err) {
      setValidation({
        loading: false,
        available: false,
        error: err.message,
        details: null,
      });
    }
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
                <div className="domain-input-group">
                  <input
                    id="domain"
                    type="text"
                    value={domain}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().trim();
                      setDomain(value);
                      if (value.includes(".")) {
                        detectRegistrar(value);
                      }
                    }}
                    placeholder="example.com"
                    className="domain-input"
                    disabled={validation.loading}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={validateDomain}
                    disabled={!domain || validation.loading}
                  >
                    {validation.loading ? (
                      <>
                        <Loader size={16} className="spinning" />
                        Checking...
                      </>
                    ) : (
                      "Check Availability"
                    )}
                  </button>
                </div>

                {registrarDetected && (
                  <div className="registrar-detected">
                    <Info size={16} />
                    <span>
                      Detected: <strong>{registrarDetected}</strong>
                      {autoConfigSupported && " • Auto-configuration available"}
                    </span>
                  </div>
                )}

                {validation.loading && (
                  <div className="validation-message loading">
                    <Loader size={16} className="spinning" />
                    <span>Checking domain availability...</span>
                  </div>
                )}

                {validation.available && (
                  <div className="validation-message success">
                    <Check size={16} />
                    <span>Domain is available for use!</span>
                    {autoConfigSupported && (
                      <span className="auto-config-badge">
                        <Zap size={12} />
                        Auto-configuration available
                      </span>
                    )}
                  </div>
                )}

                {validation.error && (
                  <div className="validation-message error">
                    <AlertCircle size={16} />
                    <div className="error-details">
                      <span>{validation.error}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="domain-tips">
                <div className="tip">
                  <Info size={16} />
                  <div>
                    <strong>Automated Setup Available For:</strong>
                    <ul>
                      <li>Cloudflare (API token required)</li>
                      <li>Vercel Domains</li>
                      <li>GoDaddy (API key required)</li>
                      <li>Namecheap (API key required)</li>
                    </ul>
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
                disabled={!validation.available}
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
                <p>
                  {autoConfigSupported
                    ? "We'll attempt to automatically configure your domain"
                    : "Add these records at your domain registrar"}
                </p>
              </div>
            </div>

            {autoConfigSupported && (
              <div className="auto-config-card">
                <div className="auto-config-header">
                  <Zap size={20} />
                  <div>
                    <h4>Auto-Configuration Available</h4>
                    <p>
                      We can automatically configure DNS for {registrarDetected}
                    </p>
                  </div>
                </div>
                <div className="auto-config-options">
                  <button
                    className="btn btn-primary"
                    onClick={configureDomainAutomated}
                    disabled={configuration.loading}
                  >
                    {configuration.loading ? (
                      <>
                        <Loader size={16} className="spinning" />
                        Configuring Automatically...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Auto-Configure Domain
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      // Show manual configuration
                      setAutoConfigSupported(false);
                    }}
                  >
                    Configure Manually Instead
                  </button>
                </div>
              </div>
            )}

            {!autoConfigSupported && (
              <>
                <div className="dns-records-section">
                  <h4>Required DNS Records</h4>
                  <p className="section-description">
                    Add these records at your domain registrar to connect{" "}
                    <strong>{domain}</strong> to your site.
                  </p>

                  <div className="dns-records-grid">
                    {configuration.dnsRecords.length > 0 ? (
                      configuration.dnsRecords.map((record, index) => (
                        <div key={index} className="dns-record-card">
                          <div className="record-header">
                            <span className="record-type-badge">
                              {record.type}
                            </span>
                            <span className="record-host">
                              {record.host === "@"
                                ? domain
                                : `${record.host}.${domain}`}
                            </span>
                          </div>
                          <div className="record-value">
                            <code>{record.value}</code>
                            <button
                              onClick={() =>
                                copyToClipboard(record.value, `record-${index}`)
                              }
                              className="copy-btn"
                            >
                              {copied[`record-${index}`] ? (
                                <Check size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                          <div className="record-footer">
                            <span className="record-ttl">
                              TTL: {record.ttl}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="default-records">
                        <p>Add these records at your registrar:</p>
                        <div className="default-record">
                          <strong>A Record</strong>
                          <div>Host: @</div>
                          <div>Value: 76.76.21.21</div>
                          <div>TTL: 3600</div>
                        </div>
                        <div className="default-record">
                          <strong>CNAME Record</strong>
                          <div>Host: www</div>
                          <div>Value: cname.vercel-dns.com</div>
                          <div>TTL: 3600</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="step-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                    disabled={configuration.loading}
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={configureDomainAutomated}
                    disabled={configuration.loading}
                  >
                    {configuration.loading ? (
                      <>
                        <Loader size={16} className="spinning" />
                        Configuring Domain...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Configure Domain
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
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
