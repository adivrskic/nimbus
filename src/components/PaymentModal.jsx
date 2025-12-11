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
  FileText,
  Mail,
  Info,
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
import CustomizeModal from "./CustomizeModal";
import CustomDomainRegistrationModal from "./CustomDomainRegistrationModal";
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
    canUse: null,
    error: null,
    warning: null,
    userConfirmedOwnership: false,
  });
  const [registrarDetected, setRegistrarDetected] = useState(null);
  const [apiCredentials, setApiCredentials] = useState({
    cloudflare: { apiToken: "", email: "" },
    vercel: { apiToken: "" },
    godaddy: { apiKey: "", apiSecret: "" },
    namecheap: { apiUser: "", apiKey: "", username: "" },
    googledomains: { username: "", password: "" },
  });
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [autoConfigPossible, setAutoConfigPossible] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [emailForDNS, setEmailForDNS] = useState("");

  const validateDomain = async (domain) => {
    if (!domain) return;

    setDomainValidation({
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

      setDomainValidation({
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
          setAutoConfigPossible(true);
          setShowCredentialForm(true); // Auto-select automatic setup
        } else {
          // Provider detected but no auto-config (e.g., Squarespace)
          setAutoConfigPossible(false);
          setShowCredentialForm(false); // Default to manual setup
        }
      } else {
        setRegistrarDetected("Your Domain Provider");
        setAutoConfigPossible(true);
        setShowCredentialForm(false); // Default to manual setup if no provider detected
      }
    } catch (err) {
      setDomainValidation({
        loading: false,
        available: false,
        canUse: false,
        error: err.message,
        warning: null,
        userConfirmedOwnership: false,
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

  // Domain is valid if:
  // 1. Not using custom domain, OR
  // 2. Using custom domain AND domain format is valid AND (domain is available OR user confirmed ownership)
  const isCustomDomainValid =
    !useCustomDomain ||
    (customDomain &&
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(
        customDomain
      ) &&
      (domainValidation.available === true ||
        domainValidation.userConfirmedOwnership === true));

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
                  <div className="domain-input-with-check">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase();
                        setCustomDomain(value);
                        // Reset validation when input changes
                        setDomainValidation({
                          loading: false,
                          available: null,
                          error: null,
                          canUse: null,
                          warning: null,
                        });
                      }}
                      placeholder="yourdomain.com"
                      className="domain-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-check-availability"
                      onClick={(e) => {
                        e.stopPropagation();
                        validateDomain(customDomain);
                      }}
                      disabled={!customDomain || domainValidation.loading}
                    >
                      {domainValidation.loading ? (
                        <>
                          <Loader size={14} className="spinning" />
                          Checking...
                        </>
                      ) : (
                        "Check"
                      )}
                    </button>
                  </div>
                  <div className="domain-input-hint">
                    Enter without http:// or www
                  </div>
                  {/* Inline validation feedback */}
                  {domainValidation.available === true &&
                    !domainValidation.warning && (
                      <div className="validation-feedback success">
                        <Check size={14} />
                        <span>Domain is available for use!</span>
                      </div>
                    )}
                  {domainValidation.canUse === true &&
                    domainValidation.warning && (
                      <div className="validation-feedback warning">
                        <AlertCircle size={14} />
                        <span>{domainValidation.warning}</span>
                      </div>
                    )}
                  {domainValidation.available === false &&
                    domainValidation.canUse === false && (
                      <div className="validation-feedback error">
                        <AlertCircle size={14} />
                        <span>{domainValidation.error}</span>
                      </div>
                    )}
                  {domainValidation.available === false &&
                    domainValidation.canUse === true && (
                      <div className="validation-feedback warning">
                        <AlertCircle size={14} />
                        <div className="warning-content">
                          <span>{domainValidation.error}</span>
                          <button
                            type="button"
                            className="btn btn-link btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // User confirms they own it
                              setDomainValidation({
                                loading: false,
                                available: true,
                                canUse: true,
                                error: null,
                                warning: null,
                                userConfirmedOwnership: true,
                              });
                            }}
                          >
                            I own this domain - continue anyway
                          </button>
                        </div>
                      </div>
                    )}
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
            {customDomain &&
              (domainValidation.available ||
                domainValidation.userConfirmedOwnership) && (
                <>
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

                    {/* Show detected provider - with auto-config */}
                    {[
                      "Cloudflare",
                      "Vercel",
                      "GoDaddy",
                      "Namecheap",
                      "Google Domains",
                    ].includes(registrarDetected) && (
                      <div className="detected-provider">
                        <CheckCircle size={16} />
                        <span>
                          Detected: <strong>{registrarDetected}</strong>
                        </span>
                      </div>
                    )}

                    {/* Show detected provider - without auto-config (e.g., Squarespace) */}
                    {registrarDetected &&
                      ![
                        "Cloudflare",
                        "Vercel",
                        "GoDaddy",
                        "Namecheap",
                        "Google Domains",
                        "Your Domain Provider",
                      ].includes(registrarDetected) && (
                        <div className="detected-provider detected-provider--manual">
                          <Info size={16} />
                          <span>
                            Detected: <strong>{registrarDetected}</strong> —
                            Manual setup required (no API available)
                          </span>
                        </div>
                      )}

                    <div className="method-options">
                      <div
                        className={`method-option ${
                          showCredentialForm && autoConfigPossible
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          autoConfigPossible && setShowCredentialForm(true)
                        }
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

                    {/* Disclaimer */}
                    <div className="config-disclaimer">
                      <Info size={14} />
                      <span>
                        You can skip DNS configuration for now and set it up
                        later from your account settings. Your site will be
                        deployed immediately after payment.
                      </span>
                    </div>
                  </div>

                  {/* API Credentials Form */}
                  {showCredentialForm && autoConfigPossible && (
                    <div className="api-credentials-form">
                      <h4>Automatic DNS Configuration</h4>
                      <div className="form-description">
                        <p>
                          Select your domain provider and enter your API
                          credentials. We'll configure DNS records
                          automatically.
                        </p>
                      </div>

                      {/* Security Disclaimer */}
                      <div className="security-disclaimer">
                        <Shield size={16} />
                        <div>
                          <strong>Your credentials are secure</strong>
                          <p>
                            Your API token is used once to configure DNS records
                            and is immediately discarded. We never store your
                            credentials.
                          </p>
                        </div>
                      </div>

                      {/* Provider Selector */}
                      <div className="provider-selector">
                        <label>Select your domain provider:</label>
                        <div className="provider-options">
                          <button
                            type="button"
                            className={`provider-option ${
                              registrarDetected === "Cloudflare"
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => setRegistrarDetected("Cloudflare")}
                          >
                            <span className="provider-name">Cloudflare</span>
                          </button>
                          <button
                            type="button"
                            className={`provider-option ${
                              registrarDetected === "Vercel" ? "selected" : ""
                            }`}
                            onClick={() => setRegistrarDetected("Vercel")}
                          >
                            <span className="provider-name">Vercel</span>
                          </button>
                          <button
                            type="button"
                            className={`provider-option ${
                              registrarDetected === "GoDaddy" ? "selected" : ""
                            }`}
                            onClick={() => setRegistrarDetected("GoDaddy")}
                          >
                            <span className="provider-name">GoDaddy</span>
                          </button>
                          <button
                            type="button"
                            className={`provider-option ${
                              registrarDetected === "Namecheap"
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => setRegistrarDetected("Namecheap")}
                          >
                            <span className="provider-name">Namecheap</span>
                          </button>
                          <button
                            type="button"
                            className={`provider-option ${
                              registrarDetected === "Google Domains"
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              setRegistrarDetected("Google Domains")
                            }
                          >
                            <span className="provider-name">
                              Google Domains
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Show message if no supported provider selected */}
                      {![
                        "Cloudflare",
                        "Vercel",
                        "GoDaddy",
                        "Namecheap",
                        "Google Domains",
                      ].includes(registrarDetected) && (
                        <div className="provider-select-prompt">
                          <p>
                            Select your domain provider above to see setup
                            instructions and enter your API credentials.
                          </p>
                          <p className="provider-note">
                            Don't see your provider? Choose{" "}
                            <strong>Manual Setup</strong> instead to configure
                            DNS records yourself.
                          </p>
                        </div>
                      )}

                      {/* Inline Setup Guide for Cloudflare */}
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
                                Copy the token (you won't be able to see it
                                again!)
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
                                Paste your API token with{" "}
                                <code>Zone:DNS:Edit</code> permission
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Inline Setup Guide for GoDaddy */}
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

                      {/* Inline Setup Guide for Namecheap */}
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
                                Click <strong>Manage</strong> (API access must
                                be enabled on your account)
                              </li>
                              <li>Copy your API Key</li>
                              <li>
                                Add your current IP address to the whitelist
                              </li>
                            </ol>
                            <div className="guide-note">
                              <AlertCircle size={14} />
                              <span>
                                Note: Namecheap requires a minimum account
                                balance or purchase history to enable API
                                access.
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

                      {/* Inline Setup Guide for Vercel */}
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
                              <li>Give it a name (e.g., "DNS Management")</li>
                              <li>
                                Set scope to <strong>Full Account</strong>
                              </li>
                              <li>Copy the token (you won't see it again!)</li>
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
                              <div className="form-hint">
                                Your Vercel API token with full account access
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Inline Setup Guide for Google Domains */}
                      {registrarDetected === "Google Domains" && (
                        <>
                          <div className="setup-guide">
                            <h5>How to get your Google Domains API access:</h5>
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
                                Under <strong>Dynamic DNS</strong>, create
                                credentials
                              </li>
                              <li>
                                Copy the <strong>Username</strong> and{" "}
                                <strong>Password</strong>
                              </li>
                            </ol>
                            <div className="guide-note">
                              <AlertCircle size={14} />
                              <span>
                                Note: Google Domains was acquired by
                                Squarespace. If your domain was migrated, use
                                Manual Setup instead.
                              </span>
                            </div>
                          </div>
                          <div className="form-fields">
                            <div className="form-group">
                              <label>API Username</label>
                              <input
                                type="text"
                                value={
                                  apiCredentials.googledomains?.username || ""
                                }
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
                                value={
                                  apiCredentials.googledomains?.password || ""
                                }
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

                      {/* Show Save button only when a provider is selected and has form fields */}
                      {[
                        "Cloudflare",
                        "Vercel",
                        "GoDaddy",
                        "Namecheap",
                        "Google Domains",
                      ].includes(registrarDetected) && (
                        <div className="form-actions">
                          <button
                            className="btn btn-primary"
                            onClick={saveCredentials}
                            disabled={
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
                            <Check size={16} />
                            Save & Continue
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
                        After deployment, you'll need to add these DNS records
                        at your domain provider. Here's exactly what you'll need
                        to do:
                      </p>

                      <div className="dns-records-preview">
                        <h5>DNS Records to Add</h5>
                        <div className="dns-record-item">
                          <div className="record-badge">A Record</div>
                          <div className="record-details">
                            <div className="record-row">
                              <span className="record-label">Host/Name:</span>
                              <code className="record-value-code">@</code>
                              <span className="record-hint">
                                (or leave blank)
                              </span>
                            </div>
                            <div className="record-row">
                              <span className="record-label">
                                Value/Points to:
                              </span>
                              <code className="record-value-code">
                                76.76.21.21
                              </code>
                              <button
                                type="button"
                                className="btn-copy-inline"
                                onClick={() => {
                                  navigator.clipboard.writeText("76.76.21.21");
                                }}
                              >
                                <Copy size={12} />
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
                              <span className="record-label">
                                Value/Points to:
                              </span>
                              <code className="record-value-code">
                                cname.vercel-dns.com
                              </code>
                              <button
                                type="button"
                                className="btn-copy-inline"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    "cname.vercel-dns.com"
                                  );
                                }}
                              >
                                <Copy size={12} />
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

                      <div className="setup-timeline">
                        <h5>What Happens Next</h5>
                        <div className="timeline-steps">
                          <div className="timeline-step">
                            <div className="timeline-icon">
                              <CreditCard size={16} />
                            </div>
                            <div className="timeline-content">
                              <strong>Complete Payment</strong>
                              <p>Your site will be deployed immediately</p>
                            </div>
                          </div>
                          <div className="timeline-step">
                            <div className="timeline-icon">
                              <Settings size={16} />
                            </div>
                            <div className="timeline-content">
                              <strong>Add DNS Records</strong>
                              <p>
                                Log into your domain provider and add the
                                records above
                              </p>
                            </div>
                          </div>
                          <div className="timeline-step">
                            <div className="timeline-icon">
                              <RefreshCw size={16} />
                            </div>
                            <div className="timeline-content">
                              <strong>Wait for Propagation</strong>
                              <p>
                                DNS changes take 5-60 minutes to propagate
                                worldwide
                              </p>
                            </div>
                          </div>
                          <div className="timeline-step">
                            <div className="timeline-icon">
                              <Shield size={16} />
                            </div>
                            <div className="timeline-content">
                              <strong>SSL Auto-Provisioned</strong>
                              <p>
                                HTTPS certificate is issued automatically once
                                DNS is verified
                              </p>
                            </div>
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
// Step 3: Enhanced Payment Step
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
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Update progress
  const updateProgress = (step, message) => {
    setDeploymentProgress({ step, message });
  };

  // Poll for domain verification status
  const startDomainVerificationPolling = (domain, deploymentId, siteName) => {
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await supabase.functions.invoke(
          "check-domain-verification",
          {
            body: { domain, deploymentId, siteName },
          }
        );

        if (data?.verified) {
          clearInterval(pollInterval);
          // Update site record with verified status
          await supabase
            .from("sites")
            .update({ domain_status: "active" })
            .eq("site_name", siteName);
        }
      } catch (err) {
        console.log("Domain verification polling error:", err);
      }
    }, 30000); // Poll every 30 seconds

    // Stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 600000);
  };

  // Handle submission
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
        await supabase.functions.invoke("deploy-to-vercel", {
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
        // Note: domain_credentials intentionally NOT stored for security
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

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-icon-wrapper">
          <CreditCard size={32} />
        </div>
        <div className="step-header-content">
          <h3>Review & Payment</h3>
          <p>Complete your purchase to deploy your website</p>
        </div>
      </div>

      <div className="step-content">
        {/* Deployment Preview */}
        <div className="deployment-preview">
          <h4>Deployment Summary</h4>
          <div className="preview-card">
            <div className="preview-header">
              <Server size={20} />
              <div>
                <strong>{siteName}</strong>
                <div className="preview-url">
                  {useCustomDomain ? customDomain : `${siteName}.vercel.app`}
                </div>
              </div>
            </div>
            <div className="preview-details">
              <div className="detail-row">
                <span>Hosting Provider</span>
                <span>Vercel</span>
              </div>
              <div className="detail-row">
                <span>Configuration</span>
                <span>
                  {useCustomDomain ? "Custom Domain" : "Vercel Domain"}
                </span>
              </div>
              <div className="detail-row">
                <span>SSL Certificate</span>
                <span className="status-success">Auto-provisioned</span>
              </div>
              <div className="detail-row">
                <span>CDN</span>
                <span className="status-success">Global Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="cost-breakdown">
          <h4>Monthly Subscription</h4>
          <div className="cost-items">
            <div className="cost-item">
              <div className="cost-description">
                <strong>Vercel Hosting</strong>
                <p>Includes 100GB bandwidth, SSL, CDN</p>
              </div>
              <div className="cost-amount">$5.00</div>
            </div>
            {useCustomDomain && (
              <div className="cost-item">
                <div className="cost-description">
                  <strong>Custom Domain Support</strong>
                  <p>DNS management & auto-SSL</p>
                </div>
                <div className="cost-amount">$0.00</div>
              </div>
            )}
            <div className="cost-item total">
              <div className="cost-description">
                <strong>Total per month</strong>
                <p>Billed monthly, cancel anytime</p>
              </div>
              <div className="cost-amount total-amount">$5.00</div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="process-info">
          <h4>What Happens After Payment</h4>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-icon">
                <Cloud size={20} />
              </div>
              <div className="step-content">
                <strong>Instant Deployment</strong>
                <p>Your site deploys to Vercel's global network in seconds</p>
              </div>
            </div>
            {useCustomDomain && (
              <div className="process-step">
                <div className="step-icon">
                  <Globe size={20} />
                </div>
                <div className="step-content">
                  <strong>Domain Configuration</strong>
                  {domainCredentials ? (
                    <p>
                      DNS automatically configured via{" "}
                      {domainCredentials.registrar} API
                    </p>
                  ) : (
                    <p>
                      You'll receive DNS records to add at your domain provider
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="process-step">
              <div className="step-icon">
                <Shield size={20} />
              </div>
              <div className="step-content">
                <strong>SSL Provisioning</strong>
                <p>HTTPS certificate automatically issued and configured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="payment-section">
            <div className="section-header">
              <h4>Payment Method</h4>
              <button
                type="button"
                className="btn-link"
                onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              >
                {showPaymentDetails ? "Hide" : "Show"} Details
              </button>
            </div>

            {showPaymentDetails && (
              <div className="payment-details">
                <div className="detail-card">
                  <div className="detail">
                    <span>Billing Cycle</span>
                    <span>Monthly</span>
                  </div>
                  <div className="detail">
                    <span>Next Billing Date</span>
                    <span>30 days from now</span>
                  </div>
                  <div className="detail">
                    <span>Cancel Anytime</span>
                    <span className="status-success">Yes</span>
                  </div>
                </div>
              </div>
            )}

            <div className="card-input-section">
              <label>Card Information</label>
              <div className="card-element-wrapper">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "var(--color-text-primary)",
                        "::placeholder": {
                          color: "var(--color-text-tertiary)",
                        },
                      },
                    },
                    hidePostalCode: true,
                  }}
                  onChange={(e) => setCardComplete(e.complete)}
                />
              </div>
              <div className="card-hint">
                <Lock size={12} />
                <span>Your payment is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Guarantee & Support */}
          <div className="assurance-section">
            <div className="assurance-card">
              <div className="assurance-icon">
                <Shield size={24} />
              </div>
              <div className="assurance-content">
                <h5>30-Day Money-Back Guarantee</h5>
                <p>If you're not satisfied, we'll refund your first month.</p>
              </div>
            </div>
            <div className="assurance-card">
              <div className="assurance-icon">
                <Users size={24} />
              </div>
              <div className="assurance-content">
                <h5>24/7 Support</h5>
                <p>Get help anytime via chat or email.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="payment-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Navigation */}
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
              className="btn btn-primary btn-large"
              disabled={!stripe || processing || !cardComplete}
            >
              {processing ? (
                <>
                  <Loader className="spinning" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Deploy My Website - $5/month</span>
                </>
              )}
            </button>
          </div>

          <div className="payment-note">
            <p>
              By clicking "Deploy My Website", you agree to our{" "}
              <a href="/terms">Terms of Service</a> and authorize monthly
              charges of $5 until canceled.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Step 4: Success - Updated for Automated Domain Configuration
// Step 4: Enhanced Success Step
const SuccessStep = ({
  deployment,
  onClose,
  onEditSite,
  onOpenDomainSettings,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDnsDetails, setShowDnsDetails] = useState(false);
  const [copyStatus, setCopyStatus] = useState({});
  const [domainStatus, setDomainStatus] = useState(
    deployment.domainVerified ? "active" : "pending"
  );
  const [countdown, setCountdown] = useState(30);

  // Start polling for domain verification
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

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 30));
      }, 1000);

      return () => {
        clearInterval(pollInterval);
        clearInterval(countdownInterval);
      };
    }
  }, [deployment]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [type]: true });
    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [type]: false });
    }, 2000);
  };

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-header">
          <h2>Website Deployed Successfully!</h2>
          <p className="success-subtitle">
            Your website is now live and accessible online
          </p>
        </div>

        {/* URLs */}
        <div className="url-section">
          <div className="url-card primary">
            <div className="url-header">
              <div className="url-badge">
                <Cloud size={16} />
                <span>Primary URL</span>
              </div>
              <a
                href={`https://${deployment.siteName}.vercel.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <ExternalLink size={14} />
                Visit
              </a>
            </div>
            <div className="url-value">
              <code>https://{deployment.siteName}.vercel.app</code>
              <button
                onClick={() =>
                  copyToClipboard(
                    `https://${deployment.siteName}.vercel.app`,
                    "vercel"
                  )
                }
                className="btn btn-icon"
              >
                {copyStatus.vercel ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div className="url-status active">
              <CheckCircle size={12} />
              <span>Active & accessible</span>
            </div>
          </div>

          {deployment.useCustomDomain && deployment.customDomain && (
            <div className="url-card custom">
              <div className="url-header">
                <div className="url-badge">
                  <Globe size={16} />
                  <span>Custom Domain</span>
                </div>
                <span className={`status-badge ${domainStatus}`}>
                  {domainStatus === "active" ? "Active" : "Setting Up..."}
                </span>
              </div>
              <div className="url-value">
                <code>https://{deployment.customDomain}</code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `https://${deployment.customDomain}`,
                      "custom"
                    )
                  }
                  className="btn btn-icon"
                >
                  {copyStatus.custom ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {domainStatus !== "active" && (
                <div className="domain-setup">
                  <div className="setup-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {deployment.autoConfigured ? (
                        <>
                          <Zap size={12} />
                          <span>Auto-configuring DNS... ({countdown}s)</span>
                        </>
                      ) : (
                        <>
                          <Settings size={12} />
                          <span>Manual setup required</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!deployment.autoConfigured && (
                    <div className="setup-instructions">
                      <button
                        className="btn btn-outline btn-block"
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
                        <div className="dns-instructions">
                          <h4>How to Configure Your Domain</h4>
                          <div className="instruction-steps">
                            <div className="instruction-step">
                              <div className="step-number">1</div>
                              <div className="step-content">
                                <strong>Log into your domain provider</strong>
                                <p>
                                  Go to{" "}
                                  {deployment.registrar ||
                                    "your domain provider"}
                                  's DNS management
                                </p>
                              </div>
                            </div>
                            <div className="instruction-step">
                              <div className="step-number">2</div>
                              <div className="step-content">
                                <strong>Add DNS records</strong>
                                <p>Add the following records:</p>
                                <div className="dns-records">
                                  {deployment.dnsRecords?.map(
                                    (record, index) => (
                                      <div key={index} className="dns-record">
                                        <div className="record-info">
                                          <span className="record-type">
                                            {record.type}
                                          </span>
                                          <span className="record-host">
                                            {record.host}
                                          </span>
                                          <span className="record-value">
                                            {record.value}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() =>
                                            copyToClipboard(
                                              record.value,
                                              `record-${index}`
                                            )
                                          }
                                          className="btn btn-icon btn-sm"
                                        >
                                          {copyStatus[`record-${index}`] ? (
                                            <Check size={12} />
                                          ) : (
                                            <Copy size={12} />
                                          )}
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="instruction-step">
                              <div className="step-number">3</div>
                              <div className="step-content">
                                <strong>Wait for propagation</strong>
                                <p>
                                  DNS changes take 5-60 minutes to propagate
                                  worldwide
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="next-steps-section">
          <h3>What's Next?</h3>
          <div className="next-steps-grid">
            <div className="next-step-card">
              <div className="step-icon">
                <Edit size={24} />
              </div>
              <div className="step-content">
                <h4>Edit Your Site</h4>
                <p>Customize content, colors, and layout</p>
                <button onClick={onEditSite} className="btn btn-outline">
                  Open Editor
                </button>
              </div>
            </div>
            <div className="next-step-card">
              <div className="step-icon">
                <Settings size={24} />
              </div>
              <div className="step-content">
                <h4>Site Settings</h4>
                <p>Manage domain, SEO, and integrations</p>
                <button
                  onClick={onOpenDomainSettings}
                  className="btn btn-outline"
                >
                  Go to Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="support-section">
          <h3>Need Help?</h3>
          <div className="support-options">
            <a href="/docs/getting-started" className="support-option">
              <div className="option-icon">
                <FileText size={20} />
              </div>
              <div className="option-content">
                <strong>Read Documentation</strong>
                <p>Step-by-step guides and tutorials</p>
              </div>
            </a>
            <a href="mailto:support@nimbus.com" className="support-option">
              <div className="option-icon">
                <Mail size={20} />
              </div>
              <div className="option-content">
                <strong>Email Support</strong>
                <p>Get help from our team</p>
              </div>
            </a>
          </div>
        </div>

        {/* Actions */}
        {/* <div className="success-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            <ChevronLeft size={20} />
            Back to Dashboard
          </button>
          <button className="btn btn-primary" onClick={onEditSite}>
            <Edit size={20} />
            Customize Site
          </button>
          <a
            href={`https://${deployment.siteName}.vercel.app`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            <ExternalLink size={20} />
            Visit Live Site
          </a>
        </div> */}
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
  // Add these new state variables
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [activeSiteForEditing, setActiveSiteForEditing] = useState(null);

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

    setActiveSiteForEditing({
      id: deployment.deploymentId, // or any unique identifier
      site_name: deployment.siteName,
      custom_domain: deployment.customDomain,
      vercel_project_id: deployment.vercelProjectId,
      vercel_deployment_id: deployment.deploymentId,
      // Add any other site data you need
    });

    setIsCustomizeModalOpen(true);
  };

  const handleOpenDomainModal = () => {
    if (!deployment) return;

    setActiveSiteForEditing({
      id: deployment.deploymentId,
      site_name: deployment.siteName,
      custom_domain: deployment.customDomain,
      vercel_project_id: deployment.vercelProjectId,
      vercel_deployment_id: deployment.deploymentId,
      domain_status: deployment.domainVerified ? "active" : "pending_setup",
    });

    setIsDomainModalOpen(true);
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
              onOpenDomainSettings={handleOpenDomainModal} // Add this prop
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
      <CustomizeModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        templateId={deployment?.templateId}
        customization={deployment?.customization}
        isDeployedSite={true}
        siteData={activeSiteForEditing}
      />

      <CustomDomainRegistrationModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        site={activeSiteForEditing}
      />
    </>
  );
}
