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
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import useModalAnimation from "../hooks/useModalAnimation";
import "./CustomDomainRegistrationModal.scss";

export default function CustomDomainRegistrationModal({
  isOpen,
  onClose,
  site, // The site object to configure domain for
}) {
  const { shouldRender, isVisible } = useModalAnimation(isOpen, 300);
  const [step, setStep] = useState(1); // 1: Domain Input, 2: DNS Setup, 3: Success
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
  });
  const [copied, setCopied] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isOpen && site?.custom_domain) {
      setDomain(site.custom_domain);
      // If site already has a domain, skip to setup
      setStep(2);
    }
  }, [isOpen, site]);

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

  const configureDomain = async () => {
    if (!domain || !site) return;

    setConfiguration({
      loading: true,
      success: false,
      error: null,
      dnsRecords: [],
      verificationRecord: null,
      domainConfigured: false,
      domainVerified: false,
    });

    try {
      const { data, error } = await supabase.functions.invoke(
        "configure-domain",
        {
          body: {
            domain: domain,
            deploymentId: site.vercel_deployment_id,
            siteName: site.site_name,
            projectId: site.vercel_project_id,
            retry: false,
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
        });

        // Update site in database
        const { error: updateError } = await supabase
          .from("sites")
          .update({
            custom_domain: domain,
            domain_status: data.domainVerified ? "active" : "pending_setup",
            updated_at: new Date().toISOString(),
          })
          .eq("id", site.id);

        if (updateError) {
          console.error("Failed to update site:", updateError);
        }

        setStep(3);
      } else {
        setConfiguration({
          loading: false,
          success: false,
          error: data.error || "Configuration failed",
          dnsRecords: data.dnsRecords || [],
          verificationRecord: data.verificationRecord || null,
          domainConfigured: false,
          domainVerified: false,
        });
      }
    } catch (err) {
      setConfiguration({
        loading: false,
        success: false,
        error: err.message || "Configuration failed",
        dnsRecords: [],
        verificationRecord: null,
        domainConfigured: false,
        domainVerified: false,
      });
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => {
      setCopied({ ...copied, [key]: false });
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setDomain("");
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
    });
    onClose();
  };

  if (!shouldRender) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="domain-input-step">
            <div className="step-header">
              <Globe size={32} />
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
                    onChange={(e) =>
                      setDomain(e.target.value.toLowerCase().trim())
                    }
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
                  </div>
                )}

                {validation.error && (
                  <div className="validation-message error">
                    <AlertCircle size={16} />
                    <div className="error-details">
                      <span>{validation.error}</span>
                      {validation.details && (
                        <button
                          type="button"
                          className="btn-text"
                          onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                          {showAdvanced ? "Hide details" : "Show details"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {validation.details && showAdvanced && (
                  <div className="advanced-error-details">
                    <pre>{JSON.stringify(validation.details, null, 2)}</pre>
                  </div>
                )}
              </div>

              <div className="domain-tips">
                <div className="tip">
                  <Info size={16} />
                  <div>
                    <strong>Requirements:</strong>
                    <ul>
                      <li>You must own the domain at a registrar</li>
                      <li>
                        Domain must not be in use by another Vercel project
                      </li>
                      <li>SSL certificate will be automatically provisioned</li>
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
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="dns-setup-step">
            <div className="step-header">
              <Settings size={32} />
              <div>
                <h3>Configure DNS Records</h3>
                <p>Add these records at your domain registrar</p>
              </div>
            </div>

            {configuration.error && (
              <div className="configuration-error">
                <AlertTriangle size={20} />
                <div>
                  <h4>Configuration Error</h4>
                  <p>{configuration.error}</p>
                  {configuration.error.includes("already in use") && (
                    <div className="error-solution">
                      <p>
                        <strong>To fix this:</strong>
                      </p>
                      <ol>
                        <li>
                          Go to{" "}
                          <a
                            href="https://vercel.com/dashboard/domains"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Vercel Domains
                          </a>
                        </li>
                        <li>Remove the domain from any existing projects</li>
                        <li>Click "Retry Configuration" below</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                        <span className="record-type-badge">{record.type}</span>
                        <span className="record-host">
                          {record.host === "@"
                            ? domain
                            : `${record.host}.${domain}`}
                        </span>
                        {record.required && (
                          <span className="required-badge">Required</span>
                        )}
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
                        <span className="record-ttl">TTL: {record.ttl}</span>
                        {record.description && (
                          <span className="record-description">
                            {record.description}
                          </span>
                        )}
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

              {configuration.verificationRecord && (
                <div className="verification-record">
                  <h5>
                    <Key size={16} />
                    Verification TXT Record (Required)
                  </h5>
                  <div className="verification-card">
                    <div className="verification-details">
                      <div className="detail">
                        <span className="label">Type:</span>
                        <span className="value">
                          {configuration.verificationRecord.type}
                        </span>
                      </div>
                      <div className="detail">
                        <span className="label">Host:</span>
                        <span className="value">
                          {configuration.verificationRecord.host}
                        </span>
                      </div>
                      <div className="detail">
                        <span className="label">Value:</span>
                        <code className="value">
                          {configuration.verificationRecord.value}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              configuration.verificationRecord.value,
                              "verification"
                            )
                          }
                          className="copy-btn"
                        >
                          {copied.verification ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="verification-note">
                      Add this TXT record to verify domain ownership. Wait 5-10
                      minutes after adding before proceeding.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="registrar-guides">
              <h5>Registrar Guides</h5>
              <div className="guide-links">
                <a
                  href="https://www.godaddy.com/help/add-an-a-record-19238"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GoDaddy
                </a>
                <a
                  href="https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-do-i-add-a-record-for-my-domain/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Namecheap
                </a>
                <a
                  href="https://support.google.com/domains/answer/3251147"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Domains
                </a>
                <a
                  href="https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cloudflare
                </a>
              </div>
            </div>

            <div className="step-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setStep(1)}
                disabled={configuration.loading}
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={configureDomain}
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
          </div>
        );

      case 3:
        return (
          <div className="success-step">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h3>Domain Configuration Started!</h3>
            <p className="success-message">
              {configuration.domainVerified
                ? `Your domain ${domain} has been successfully configured and is now active!`
                : `Domain ${domain} has been added to your site. DNS changes may take up to 48 hours to propagate.`}
            </p>

            <div className="domain-status">
              <div className="status-item">
                <span className="status-label">Domain:</span>
                <span className="status-value">{domain}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Status:</span>
                <span
                  className={`status-badge ${
                    configuration.domainVerified ? "verified" : "pending"
                  }`}
                >
                  {configuration.domainVerified ? "Verified" : "Pending DNS"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Site URL:</span>
                <a
                  href={`https://${site?.site_name}.vercel.app`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="status-value link"
                >
                  {site?.site_name}.vercel.app
                </a>
              </div>
            </div>

            {!configuration.domainVerified && (
              <div className="next-steps">
                <h5>Next Steps:</h5>
                <ol>
                  <li>DNS records have been added to Vercel</li>
                  <li>Add the same records at your domain registrar</li>
                  <li>Wait for DNS propagation (1-48 hours)</li>
                  <li>SSL certificate will auto-provision</li>
                </ol>
                <p className="note">
                  Your site remains accessible at{" "}
                  <strong>{site?.site_name}.vercel.app</strong> during setup.
                </p>
              </div>
            )}

            <div className="success-actions">
              <button className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
              <a
                href={`https://${site?.site_name}.vercel.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={16} />
                Visit Site
              </a>
              {!configuration.domainVerified && (
                <button className="btn btn-outline" onClick={() => setStep(2)}>
                  <Settings size={16} />
                  View DNS Setup
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`customize-modal-backdrop modal-backdrop ${
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
              <X size={24} />
            </button>
            <div className="header-text">
              <h2>Custom Domain Setup</h2>
              <p>Connect your own domain to your site</p>
            </div>
          </div>
        </div>

        <div className="modal-content">{renderStep()}</div>
      </div>
    </>
  );
}
