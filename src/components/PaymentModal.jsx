import { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Check,
  Loader,
  AlertCircle,
  Globe,
  Shield,
  Zap,
  Lock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Server,
  Cloud,
  Upload,
  Users,
  BarChart,
  Link,
  Copy,
  Eye,
  EyeOff,
  Edit,
  Settings,
  Key,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import useModalAnimation from "../hooks/useModalAnimation";
import "./PaymentModal.scss";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Cloud, sky, and space related terms for site name generation
const NIMBUS_TERMS = [
  // Cloud types & formations
  "cirrus",
  "stratus",
  "cumulus",
  "alto",
  "cirro",
  "mammatus",
  "lenticular",
  "contrail",
  "virga",
  "pileus",
  "arcus",
  "volutus",
  "floccus",
  "castellanus",
  "stratocumulus",
  "cumulonimbus",
  "altostratus",
  "cirrostratus",
  // ... (keep your existing terms)
];

const generateAlphanumeric = (length = 6) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateNimbusSiteName = () => {
  const term = NIMBUS_TERMS[Math.floor(Math.random() * NIMBUS_TERMS.length)];
  const suffix = generateAlphanumeric(6);
  return `nimbus-${term}-${suffix}`;
};

// Step Indicator Component
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Site Details", icon: <Globe size={16} /> },
    { number: 2, label: "Domain", icon: <Link size={16} /> },
    { number: 3, label: "Payment", icon: <CreditCard size={16} /> },
  ];

  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`step-item ${
            step.number === currentStep ? "active" : ""
          } ${step.number < currentStep ? "completed" : ""}`}
        >
          <div className="step-circle">
            {step.number < currentStep ? <Check size={16} /> : step.icon}
          </div>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

// Step 1: Site Details Configuration
const SiteDetailsStep = ({ siteName, setSiteName, onNext }) => {
  // Generate initial site name on mount if not already set
  useEffect(() => {
    if (!siteName) {
      setSiteName(generateNimbusSiteName());
    }
  }, []);

  const isSiteNameValid =
    siteName && siteName.length >= 3 && /^[a-z0-9-]+$/.test(siteName);

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-icon-wrapper">
          <Globe size={32} />
        </div>
        <div className="step-header-content">
          <h3>Create Your Website</h3>
          <p>Choose a unique name for your site</p>
        </div>
      </div>

      <div className="step-content">
        {/* Site Name Section */}
        <div className="config-section">
          <h4>Site Name</h4>
          <div className="site-name-input">
            <div className="input-field">
              <input
                type="text"
                value={siteName}
                onChange={(e) =>
                  setSiteName(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                  )
                }
                placeholder="nimbus-aurora-x7k2m9"
                className="site-name-input-field"
              />
              <div className="url-preview">
                <span className="preview-text">Your site will be:</span>
                <span className="preview-url">
                  https://{siteName || "nimbus-site-name"}.vercel.app
                </span>
              </div>
            </div>

            <div className="input-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSiteName(generateNimbusSiteName())}
              >
                <RefreshCw size={16} />
                Generate New Name
              </button>
            </div>

            <div className="input-tips">
              <div className="tip">
                <CheckCircle size={16} />
                <span>Use lowercase letters, numbers, and hyphens</span>
              </div>
            </div>
          </div>
        </div>

        <div className="step-actions">
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!isSiteNameValid}
          >
            Continue to Domain Setup
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 2: Domain Setup with Automated Configuration
// Step 2: Enhanced Domain Setup with Better Flow
const DomainSetupStep = ({
  onNext,
  onBack,
  siteName,
  useCustomDomain,
  setUseCustomDomain,
  customDomain,
  setCustomDomain,
  setDomainCredentials,
}) => {
  const [domainValidation, setDomainValidation] = useState({
    loading: false,
    available: null,
    error: null,
  });
  const [registrarDetected, setRegistrarDetected] = useState(null);
  const [apiCredentials, setApiCredentials] = useState({
    cloudflare: { apiToken: "", email: "" },
    godaddy: { apiKey: "", apiSecret: "" },
    namecheap: { apiUser: "", apiKey: "", username: "" },
  });
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [autoConfigPossible, setAutoConfigPossible] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [emailForDNS, setEmailForDNS] = useState("");

  // Detect registrar when domain changes
  useEffect(() => {
    if (useCustomDomain && customDomain && customDomain.includes(".")) {
      detectRegistrar(customDomain);
      const timer = setTimeout(() => validateDomain(customDomain), 500);
      return () => clearTimeout(timer);
    }
  }, [customDomain, useCustomDomain]);

  const detectRegistrar = async (domain) => {
    try {
      // This is a simulated detection - in real implementation, you might use WHOIS lookup
      const commonRegistrars = {
        "godaddy.com": "GoDaddy",
        "namecheap.com": "Namecheap",
        "cloudflare.com": "Cloudflare",
        "google.com": "Google Domains",
        "vercel.app": "Vercel Domains",
      };

      const domainTLD = domain.split(".").slice(-2).join(".");
      const registrar = commonRegistrars[domainTLD] || "Your Domain Provider";
      setRegistrarDetected(registrar);

      // Check if this registrar supports auto-configuration
      const supportedRegistrars = [
        "cloudflare",
        "godaddy",
        "namecheap",
        "vercel",
      ];
      const isSupported = supportedRegistrars.some((r) =>
        registrar.toLowerCase().includes(r)
      );
      setAutoConfigPossible(isSupported);

      if (isSupported) {
        setShowCredentialForm(true);
      }
    } catch (err) {
      console.log("Registrar detection failed");
    }
  };

  const validateDomain = async (domain) => {
    if (!domain) return;

    setDomainValidation({ loading: true, available: null, error: null });

    try {
      const { data, error } = await supabase.functions.invoke(
        "validate-domain",
        {
          body: { domain },
        }
      );

      if (error) throw error;

      setDomainValidation({
        loading: false,
        available: data.available,
        error: data.available ? null : "Domain is already in use or invalid",
      });
    } catch (err) {
      setDomainValidation({
        loading: false,
        available: false,
        error: err.message,
      });
    }
  };

  const handleCredentialsChange = (registrar, field, value) => {
    setApiCredentials((prev) => ({
      ...prev,
      [registrar]: {
        ...prev[registrar],
        [field]: value,
      },
    }));
  };

  const saveCredentials = () => {
    setDomainCredentials({
      registrar: registrarDetected,
      credentials:
        apiCredentials[registrarDetected.toLowerCase().replace(/ /g, "")],
      email: emailForDNS || null,
    });
    setShowCredentialForm(false);
  };

  const isCustomDomainValid =
    !useCustomDomain ||
    (customDomain &&
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(
        customDomain
      ) &&
      !domainValidation.error);

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-icon-wrapper">
          <Globe size={32} />
        </div>
        <div className="step-header-content">
          <h3>Connect Your Domain</h3>
          <p>Choose how you want your site to be accessed</p>
        </div>
      </div>

      <div className="step-content">
        {/* Option Selection */}
        <div className="option-selector">
          <div
            className="option-card"
            onClick={() => setUseCustomDomain(false)}
          >
            <div
              className={`option-toggle ${!useCustomDomain ? "active" : ""}`}
            >
              {!useCustomDomain && <Check size={16} />}
            </div>
            <div className="option-content">
              <div className="option-header">
                <h4>Use Free Vercel Domain</h4>
                <span className="option-badge">Quickest Setup</span>
              </div>
              <p>Your site will be available at:</p>
              <div className="option-preview">
                <code>https://{siteName}.vercel.app</code>
              </div>
              <ul className="option-features">
                <li>
                  <Check size={12} /> Automatic SSL certificate
                </li>
                <li>
                  <Check size={12} /> Global CDN included
                </li>
                <li>
                  <Check size={12} /> Zero configuration needed
                </li>
              </ul>
            </div>
          </div>

          <div className="option-card" onClick={() => setUseCustomDomain(true)}>
            <div className={`option-toggle ${useCustomDomain ? "active" : ""}`}>
              {useCustomDomain && <Check size={16} />}
            </div>
            <div className="option-content">
              <div className="option-header">
                <h4>Use Custom Domain</h4>
                <span className="option-badge">Professional</span>
              </div>
              <p>Use your own domain name (like yourbusiness.com)</p>
              {useCustomDomain && (
                <div className="domain-input-container">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase();
                      setCustomDomain(value);
                    }}
                    placeholder="yourdomain.com"
                    className="domain-input"
                  />
                  <div className="domain-input-hint">
                    Enter without http:// or www
                  </div>
                </div>
              )}
              <ul className="option-features">
                <li>
                  <Check size={12} /> Branded web address
                </li>
                <li>
                  <Check size={12} /> Automatic SSL certificate
                </li>
                <li>
                  <Check size={12} /> Email forwarding support
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Custom Domain Details */}
        {useCustomDomain && (
          <div className="custom-domain-details">
            {customDomain && (
              <>
                {/* Domain Status */}
                <div className="status-card">
                  <div className="status-header">
                    <h4>Domain Status</h4>
                    {domainValidation.loading && (
                      <div className="status-badge loading">
                        <Loader size={12} /> Checking...
                      </div>
                    )}
                    {domainValidation.available && (
                      <div className="status-badge success">
                        <Check size={12} /> Available
                      </div>
                    )}
                    {domainValidation.error && (
                      <div className="status-badge error">
                        <AlertCircle size={12} /> {domainValidation.error}
                      </div>
                    )}
                  </div>
                  <div className="status-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => validateDomain(customDomain)}
                      disabled={domainValidation.loading}
                    >
                      <RefreshCw size={14} />
                      Check Availability
                    </button>
                  </div>
                </div>

                {/* Registrar Detection */}
                {registrarDetected && (
                  <div className="registrar-info">
                    <h4>Your Domain Provider</h4>
                    <div className="registrar-card">
                      <div className="registrar-icon">
                        <Globe size={20} />
                      </div>
                      <div className="registrar-details">
                        <strong>{registrarDetected}</strong>
                        {autoConfigPossible ? (
                          <p className="text-success">
                            <Zap size={12} /> Auto-configuration available
                          </p>
                        ) : (
                          <p>Manual setup required</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Configuration Method */}
                <div className="config-method">
                  <h4>How would you like to configure DNS?</h4>
                  <div className="method-options">
                    <div
                      className={`method-option ${
                        autoConfigPossible ? "selected" : ""
                      }`}
                      onClick={() => setShowCredentialForm(autoConfigPossible)}
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
                        {!autoConfigPossible && (
                          <span className="method-note">
                            Not available for this provider
                          </span>
                        )}
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
                        <p>
                          We'll provide DNS records for you to add manually in
                          your domain provider's control panel
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Credentials Form */}
                {showCredentialForm && autoConfigPossible && (
                  <div className="api-credentials-form">
                    <h4>Connect to {registrarDetected}</h4>
                    <div className="form-description">
                      <p>
                        We need your API credentials to configure DNS
                        automatically. These are stored securely and only used
                        for DNS management.
                      </p>
                      <div className="credentials-info">
                        <ExternalLink size={12} />
                        <a
                          href={`https://docs.nimbus.com/${registrarDetected
                            .toLowerCase()
                            .replace(/ /g, "-")}-setup`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View {registrarDetected} setup guide
                        </a>
                      </div>
                    </div>

                    {/* Form fields based on registrar */}
                    {registrarDetected.toLowerCase().includes("cloudflare") && (
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
                          <div className="form-hint">
                            Email for your Cloudflare account
                          </div>
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
                          <div className="form-hint">
                            Create a token with <code>Zone:DNS:Edit</code>{" "}
                            permission
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Advanced Options */}
                    <div className="advanced-options">
                      <button
                        type="button"
                        className="advanced-toggle"
                        onClick={() =>
                          setShowAdvancedOptions(!showAdvancedOptions)
                        }
                      >
                        {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
                        <ChevronRight
                          size={16}
                          className={showAdvancedOptions ? "rotated" : ""}
                        />
                      </button>

                      {showAdvancedOptions && (
                        <div className="advanced-content">
                          <div className="form-group">
                            <label>Notification Email</label>
                            <input
                              type="email"
                              value={emailForDNS}
                              onChange={(e) => setEmailForDNS(e.target.value)}
                              placeholder="Optional - for DNS change notifications"
                            />
                            <div className="form-hint">
                              We'll email you when DNS changes are made
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-actions">
                      <button
                        className="btn btn-primary"
                        onClick={saveCredentials}
                        disabled={
                          !apiCredentials[
                            registrarDetected.toLowerCase().replace(/ /g, "")
                          ]?.email
                        }
                      >
                        <Check size={16} />
                        Save & Continue
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => setShowCredentialForm(false)}
                      >
                        Skip to Manual Setup
                      </button>
                    </div>
                  </div>
                )}

                {/* Setup Summary */}
                {!showCredentialForm && (
                  <div className="setup-summary">
                    <h4>What to Expect</h4>
                    <div className="setup-steps">
                      <div className="setup-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <strong>DNS Configuration</strong>
                          <p>You'll add DNS records at your domain provider</p>
                        </div>
                      </div>
                      <div className="setup-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <strong>Propagation</strong>
                          <p>
                            DNS changes take 5-60 minutes to propagate worldwide
                          </p>
                        </div>
                      </div>
                      <div className="setup-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                          <strong>Auto SSL</strong>
                          <p>
                            SSL certificate issues automatically once DNS is set
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="step-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            <ChevronLeft size={20} />
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={
              useCustomDomain && (!isCustomDomainValid || !customDomain)
            }
          >
            Continue to Payment
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Payment - Updated with Automated Domain Configuration
const PaymentStep = ({
  siteName,
  useCustomDomain,
  customDomain,
  domainCredentials,
  templateId,
  customization,
  htmlContent,
  onSuccess,
  onBack,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState({
    step: "initial",
    message: "Ready to deploy",
  });

  const updateProgress = (step, message) => {
    setDeploymentProgress({ step, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    try {
      updateProgress("payment", "Processing payment...");

      // 1. Create Stripe customer
      const { data: customerData, error: customerError } =
        await supabase.functions.invoke("create-stripe-customer", {
          body: {
            email: user.email,
            name: user.user_metadata?.full_name || "Customer",
          },
        });

      if (customerError) throw new Error(customerError.message);

      // 2. Set up payment method
      const cardElement = elements.getElement(CardElement);
      const { error: setupError, setupIntent } = await stripe.confirmCardSetup(
        customerData.clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (setupError) throw setupError;
      const paymentMethodId = setupIntent.payment_method;

      // 3. Create subscription
      updateProgress("subscription", "Creating subscription...");

      const { data: subscriptionData, error: subscriptionError } =
        await supabase.functions.invoke("create-subscription", {
          body: {
            customerId: customerData.customerId,
            paymentMethodId: paymentMethodId,
            siteName: siteName,
            templateId: templateId,
            customization: customization,
            customDomain: useCustomDomain ? customDomain : null,
          },
        });

      if (subscriptionError) throw new Error(subscriptionError.message);

      // 4. Deploy to Vercel WITH automated domain configuration
      updateProgress("deployment", "Deploying site to Vercel...");

      const cleanHtmlContent = htmlContent
        .replace(/[\0-\x1F\x7F]/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

      const deploymentBody = {
        siteName: siteName,
        htmlContent: cleanHtmlContent,
        templateId: templateId,
        customization: customization,
        stripeSubscriptionId: subscriptionData.subscriptionId,
        stripeCustomerId: customerData.customerId,
        customDomain: useCustomDomain ? customDomain : null,
        autoConfigureDomain: useCustomDomain,
        domainCredentials: useCustomDomain ? domainCredentials : null,
      };

      const { data: deployData, error: deployError } =
        await supabase.functions.invoke("deploy-to-vercel-automated", {
          body: deploymentBody,
        });

      if (deployError) throw new Error(deployError.message);

      updateProgress("domain", "Configuring domain and SSL...");

      // 5. Save to database
      const { error: dbError } = await supabase.from("sites").insert({
        user_id: user.id,
        site_name: siteName,
        slug: siteName,
        template_id: templateId,
        customization: customization,
        deployment_url: deployData.url || `https://${siteName}.vercel.app`,
        deployment_provider: "vercel",
        deployment_status: "deployed",
        deployed_at: new Date().toISOString(),
        billing_status: "active",
        price_per_month_cents: 500,
        stripe_subscription_id: subscriptionData.subscriptionId,
        stripe_customer_id: customerData.customerId,
        current_period_end: subscriptionData.currentPeriodEnd,
        custom_domain: customDomain || null,
        domain_status: customDomain
          ? deployData.domainConfigured
            ? "active"
            : "pending_setup"
          : "none",
        vercel_deployment_id: deployData.deploymentId,
        vercel_project_id: deployData.projectId,
        domain_credentials: useCustomDomain ? domainCredentials : null,
      });

      if (dbError) console.error("Database error:", dbError);

      // 6. Start domain verification polling if needed
      if (useCustomDomain && customDomain && !deployData.domainVerified) {
        startDomainVerificationPolling(
          customDomain,
          deployData.deploymentId,
          siteName
        );
      }

      updateProgress("complete", "Deployment complete!");

      onSuccess({
        url: deployData.url || `https://${siteName}.vercel.app`,
        siteName: deployData.siteName || siteName,
        customDomain: customDomain || null,
        useCustomDomain: useCustomDomain,
        deploymentId: deployData.deploymentId,
        dnsRecords: deployData.dnsRecords,
        templateId: templateId,
        customization: customization,
        vercelProjectId: deployData.projectId,
        domainConfigured: deployData.domainConfigured || false,
        domainVerified: deployData.domainVerified || false,
        autoConfigured: deployData.autoConfigured || false,
        registrar: deployData.registrar,
        deploymentStatus: "complete",
      });
    } catch (err) {
      setError(err.message || "An error occurred during deployment");
      updateProgress("error", "Deployment failed");
    } finally {
      setProcessing(false);
    }
  };

  const startDomainVerificationPolling = (domain, deploymentId, siteName) => {
    // This will run in the background
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await supabase.functions.invoke(
          "check-domain-verification",
          {
            body: { domain, deploymentId },
          }
        );

        if (data?.verified) {
          clearInterval(pollInterval);
          // Update database
          await supabase
            .from("sites")
            .update({ domain_status: "active" })
            .eq("site_name", siteName);
        }
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 30000); // Check every 30 seconds

    // Stop after 24 hours
    setTimeout(() => clearInterval(pollInterval), 24 * 60 * 60 * 1000);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-icon-wrapper">
          <CreditCard size={32} />
        </div>
        <div className="step-header-content">
          <h3>Payment & Deployment</h3>
          <p>Complete payment to deploy your site instantly</p>
        </div>
      </div>

      <div className="step-content">
        {/* Deployment Progress */}
        {processing && (
          <div className="deployment-progress">
            <div className="progress-header">
              <Loader size={16} className="spinning" />
              <span>{deploymentProgress.message}</span>
            </div>
            <div className="progress-steps">
              {[
                { key: "payment", label: "Payment" },
                { key: "subscription", label: "Subscription" },
                { key: "deployment", label: "Deployment" },
                { key: "domain", label: "Domain Setup" },
                { key: "complete", label: "Complete" },
              ].map((step) => (
                <div
                  key={step.key}
                  className={`progress-step ${
                    deploymentProgress.step === step.key ? "active" : ""
                  } ${
                    ["complete", "error"].includes(deploymentProgress.step)
                      ? "complete"
                      : ""
                  }`}
                >
                  <div className="step-dot" />
                  <span className="step-label">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-summary-card">
          <h4>Order Summary</h4>
          <div className="summary-items">
            <div className="summary-item">
              <span>Vercel Hosting</span>
              <span>$5/month</span>
            </div>
            <div className="summary-item">
              <span>Site Name</span>
              <span>{siteName}.vercel.app</span>
            </div>
            {useCustomDomain && customDomain && (
              <>
                <div className="summary-item">
                  <span>Custom Domain</span>
                  <span>{customDomain}</span>
                </div>
                <div className="summary-item">
                  <span>Automated DNS Setup</span>
                  <span>Included</span>
                </div>
                <div className="summary-item">
                  <span>SSL Certificate</span>
                  <span>Included</span>
                </div>
              </>
            )}
            <div className="summary-total">
              <span>Monthly Total</span>
              <span className="total-price">$5.00</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="payment-section">
            <label className="payment-label">Card Details</label>
            <div className="card-element-container">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "var(--color-text-primary)",
                      "::placeholder": { color: "var(--color-text-tertiary)" },
                    },
                  },
                }}
                onChange={(e) => setCardComplete(e.complete)}
              />
            </div>
          </div>

          <div className="payment-security">
            <Lock size={16} />
            <span>Your payment is secure and encrypted</span>
          </div>

          {error && (
            <div className="payment-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="guarantee-card">
            <CheckCircle size={20} />
            <div>
              <strong>30-Day Money-Back Guarantee</strong>
              <p>If you're not satisfied, we'll refund your first month.</p>
            </div>
          </div>
        </form>

        <div className="step-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
            disabled={processing}
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!stripe || processing || !cardComplete}
            onClick={handleSubmit}
          >
            {processing ? (
              <>
                <Loader className="spinning" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Check size={20} />
                <span>Deploy My Website Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 4: Success - Updated for Automated Domain Configuration
const SuccessStep = ({ deployment, onClose, onEditSite }) => {
  const [copied, setCopied] = useState(false);
  const [showDnsDetails, setShowDnsDetails] = useState(false);
  const [copyStatus, setCopyStatus] = useState({});
  const [domainStatus, setDomainStatus] = useState(
    deployment.domainVerified ? "active" : "pending"
  );

  // Start polling for domain verification if not already verified
  useEffect(() => {
    if (deployment.useCustomDomain && !deployment.domainVerified) {
      const pollInterval = setInterval(async () => {
        try {
          const { data } = await supabase.functions.invoke(
            "check-domain-verification",
            {
              body: {
                domain: deployment.customDomain,
                deploymentId: deployment.deploymentId,
              },
            }
          );

          if (data?.verified) {
            clearInterval(pollInterval);
            setDomainStatus("active");
          }
        } catch (err) {
          console.log("Polling error:", err);
        }
      }, 30000);

      return () => clearInterval(pollInterval);
    }
  }, [deployment]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [type]: true });
    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [type]: false });
    }, 2000);
  };

  const copyAllRecords = () => {
    const records = deployment.dnsRecords
      ?.map((r) => `${r.host} ${r.ttl} IN ${r.type} ${r.value}`)
      .join("\n");
    if (records) {
      navigator.clipboard.writeText(records);
      setCopyStatus({ ...copyStatus, all: true });
      setTimeout(() => setCopyStatus({ ...copyStatus, all: false }), 2000);
    }
  };

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-header">
          <div className="success-icon">
            <CheckCircle size={48} className="text-success" />
          </div>
          <h2>
            {domainStatus === "active"
              ? "Your Website is Live! 🎉"
              : "Deployment Complete!"}
          </h2>
          <p className="success-subtitle">
            {domainStatus === "active"
              ? "Your website has been successfully deployed and is now accessible online"
              : "Your site is deployed. Domain setup is in progress."}
          </p>
        </div>

        <div className="url-grid">
          <div className="url-card">
            <div className="url-header">
              <Cloud size={20} />
              <span>Vercel URL</span>
            </div>
            <div className="url-display">
              <a
                href={`https://${deployment.siteName}.vercel.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="site-url"
              >
                https://{deployment.siteName}.vercel.app
              </a>
              <button
                onClick={() =>
                  copyToClipboard(
                    `https://${deployment.siteName}.vercel.app`,
                    "vercel"
                  )
                }
                className="btn btn-secondary copy-btn"
              >
                {copyStatus.vercel ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {deployment.useCustomDomain && deployment.customDomain && (
            <div className="url-card domain-card">
              <div className="url-header">
                <Globe size={20} />
                <span>Custom Domain</span>
                <span
                  className={`status-badge ${
                    domainStatus === "active"
                      ? "active"
                      : deployment.autoConfigured
                      ? "configuring"
                      : "pending"
                  }`}
                >
                  {domainStatus === "active"
                    ? "Active"
                    : deployment.autoConfigured
                    ? "Auto-configuring..."
                    : "Setup Required"}
                </span>
              </div>
              <div className="url-display">
                <a
                  href={`https://${deployment.customDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-url"
                  style={{
                    opacity: domainStatus === "active" ? 1 : 0.7,
                    cursor: domainStatus === "active" ? "pointer" : "default",
                  }}
                >
                  https://{deployment.customDomain}
                </a>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `https://${deployment.customDomain}`,
                      "custom"
                    )
                  }
                  className="btn btn-secondary copy-btn"
                >
                  {copyStatus.custom ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {domainStatus !== "active" && !deployment.autoConfigured && (
                <div className="domain-setup-section">
                  <button
                    className="btn btn-outline setup-toggle"
                    onClick={() => setShowDnsDetails(!showDnsDetails)}
                  >
                    {showDnsDetails ? (
                      <>
                        <EyeOff size={16} />
                        Hide DNS Instructions
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Show DNS Instructions
                      </>
                    )}
                  </button>

                  {showDnsDetails && (
                    <div className="dns-setup-instructions">
                      <h4>DNS Configuration Required</h4>
                      <p>
                        Add these DNS records at your domain registrar to
                        activate your domain:
                      </p>

                      <div className="dns-records-header">
                        <h5>Required DNS Records</h5>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={copyAllRecords}
                        >
                          {copyStatus.all ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          Copy All Records
                        </button>
                      </div>

                      <div className="dns-records-grid">
                        {deployment.dnsRecords?.map((record, index) => (
                          <div key={index} className="dns-record-card">
                            <div className="record-header">
                              <span className="record-type-badge">
                                {record.type}
                              </span>
                              <span className="record-host">
                                {record.host === "@"
                                  ? deployment.customDomain
                                  : `${record.host}.${deployment.customDomain}`}
                              </span>
                            </div>
                            <div className="record-value">
                              <code>{record.value}</code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    record.value,
                                    `record-${index}`
                                  )
                                }
                                className="copy-btn"
                              >
                                {copyStatus[`record-${index}`] ? (
                                  <Check size={14} />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {deployment.autoConfigured && domainStatus !== "active" && (
                <div className="auto-config-progress">
                  <div className="progress-message">
                    <Loader size={16} className="spinning" />
                    <span>
                      Automatically configuring DNS with {deployment.registrar}
                      ... This may take a few minutes.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="deployment-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Deployment ID</span>
              <code className="detail-value">{deployment.deploymentId}</code>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value status active">
                ✓ {deployment.deploymentStatus}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Domain Setup</span>
              <span className="detail-value">
                {deployment.autoConfigured
                  ? "Automated"
                  : deployment.useCustomDomain
                  ? "Manual"
                  : "Not Required"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Template</span>
              <span className="detail-value">
                {deployment.templateId || "Standard"}
              </span>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            <ChevronLeft size={20} />
            Build Another Site
          </button>
          <button className="btn btn-outline" onClick={onEditSite}>
            <Edit size={20} />
            Edit This Site
          </button>
          <a
            href={`https://${deployment.siteName}.vercel.app`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <ExternalLink size={20} />
            Visit Your Site
          </a>
          {deployment.useCustomDomain && domainStatus !== "active" && (
            <a href="/dashboard/settings/domains" className="btn btn-outline">
              <Settings size={20} />
              Domain Settings
            </a>
          )}
        </div>

        <div className="next-steps">
          <h4>Next Steps</h4>
          <div className="steps-grid">
            {deployment.useCustomDomain && domainStatus !== "active" ? (
              <>
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>Wait for DNS</strong>
                    <p>
                      {deployment.autoConfigured
                        ? "DNS is being automatically configured"
                        : "Add the DNS records at your registrar"}
                    </p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>SSL Provisioning</strong>
                    <p>SSL certificate will auto-provision once DNS resolves</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Access Your Site</strong>
                    <p>Your site will be available at your custom domain</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>Edit Content</strong>
                    <p>Update your site content anytime from the dashboard</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>Add Features</strong>
                    <p>Upgrade your plan for additional features</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Share Your Site</strong>
                    <p>Share your new website with your audience</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Payment Modal Component
export default function PaymentModal({
  isOpen,
  onClose,
  templateId,
  customization,
  htmlContent,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [siteName, setSiteName] = useState("");
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [domainCredentials, setDomainCredentials] = useState(null);
  const [deployment, setDeployment] = useState(null);
  const { shouldRender, isVisible } = useModalAnimation(isOpen, 400);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSiteName(generateNimbusSiteName());
      setUseCustomDomain(false);
      setCustomDomain("");
      setDomainCredentials(null);
      setDeployment(null);
    }
  }, [isOpen]);

  const handleSuccess = (deploymentData) => {
    setDeployment(deploymentData);
    setCurrentStep(4);
    window.dispatchEvent(new CustomEvent("deployment-success"));
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSiteName("");
    setUseCustomDomain(false);
    setCustomDomain("");
    setDomainCredentials(null);
    setDeployment(null);
    onClose();
  };

  const handleEditSite = () => {
    if (!deployment) return;
    handleClose();
    window.dispatchEvent(
      new CustomEvent("open-customize-with-site", {
        detail: {
          templateId: deployment.templateId,
          isDeployedSite: true,
          siteData: {
            templateId: deployment.templateId,
            customization: deployment.customization,
            siteName: deployment.siteName,
            vercelProjectId: deployment.vercelProjectId,
          },
        },
      })
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SiteDetailsStep
            siteName={siteName}
            setSiteName={setSiteName}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <DomainSetupStep
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            siteName={siteName}
            useCustomDomain={useCustomDomain}
            setUseCustomDomain={setUseCustomDomain}
            customDomain={customDomain}
            setCustomDomain={setCustomDomain}
            setDomainCredentials={setDomainCredentials}
          />
        );
      case 3:
        return (
          <Elements stripe={stripePromise}>
            <PaymentStep
              siteName={siteName}
              useCustomDomain={useCustomDomain}
              customDomain={customDomain}
              domainCredentials={domainCredentials}
              templateId={templateId}
              customization={customization}
              htmlContent={htmlContent}
              onSuccess={handleSuccess}
              onBack={() => setCurrentStep(2)}
            />
          </Elements>
        );
      case 4:
        return (
          deployment && (
            <SuccessStep
              deployment={deployment}
              onClose={handleClose}
              onEditSite={handleEditSite}
            />
          )
        );
      default:
        return null;
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`modal-backdrop ${
          isVisible ? "modal-backdrop--visible" : ""
        }`}
        onClick={handleClose}
      />
      <div
        className={`payment-modal-overhaul ${
          isVisible ? "payment-modal-overhaul--visible" : ""
        }`}
      >
        <div className="modal-header">
          <div className="header-content">
            <button className="modal-close" onClick={handleClose}>
              <X size={24} />
            </button>
            <div className="header-text">
              <h2>Deploy Your Website</h2>
              <p>Get your website online in minutes</p>
            </div>
          </div>
        </div>

        {currentStep < 4 && (
          <div className="step-indicator-container">
            <StepIndicator currentStep={currentStep} />
          </div>
        )}

        <div className="modal-content">
          <div className="modal-main">{renderStep()}</div>

          <div className="modal-sidebar">
            <div className="sidebar-card why-deploy">
              <div className="sidebar-card-header">
                <h3>Automated Domain Setup</h3>
                <p>We handle the technical setup for you</p>
              </div>

              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Zap size={24} />
                  </div>
                  <div className="benefit-content">
                    <h4>Instant Deployment</h4>
                    <p>Site goes live immediately after payment</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Globe size={24} />
                  </div>
                  <div className="benefit-content">
                    <h4>Automated DNS</h4>
                    <p>Automatic DNS configuration for supported registrars</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Shield size={24} />
                  </div>
                  <div className="benefit-content">
                    <h4>Auto SSL</h4>
                    <p>HTTPS certificates provisioned automatically</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Key size={24} />
                  </div>
                  <div className="benefit-content">
                    <h4>API Integration</h4>
                    <p>Connect with Cloudflare, GoDaddy, Namecheap APIs</p>
                  </div>
                </div>
              </div>

              <div className="registrar-list">
                <h4>Supported Registrars</h4>
                <div className="registrar-badges">
                  <span className="registrar-badge">Cloudflare</span>
                  <span className="registrar-badge">Vercel</span>
                  <span className="registrar-badge">GoDaddy</span>
                  <span className="registrar-badge">Namecheap</span>
                  <span className="registrar-badge">Google Domains</span>
                </div>
                <p className="registrar-note">
                  Other registrars: Manual DNS instructions provided
                </p>
              </div>

              <div className="pricing-section">
                <div className="pricing-display">
                  <span className="price-amount">$5</span>
                  <span className="price-period">/month</span>
                </div>
                <div className="pricing-badge">No Setup Fee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
