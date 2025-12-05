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

  // Sky & atmosphere
  "aurora",
  "zenith",
  "horizon",
  "twilight",
  "dusk",
  "dawn",
  "haze",
  "mist",
  "fog",
  "ether",
  "aether",
  "ozone",
  "troposphere",
  "mesosphere",
  "ionosphere",
  "exosphere",
  "thermosphere",
  "stratosphere",
  "skyline",
  "firmament",

  // Space & cosmos
  "nebula",
  "nova",
  "supernova",
  "quasar",
  "pulsar",
  "cosmos",
  "galaxy",
  "stellar",
  "astral",
  "celestial",
  "lunar",
  "solar",
  "orbital",
  "cosmic",
  "comet",
  "meteor",
  "asteroid",
  "eclipse",
  "equinox",
  "solstice",

  // Stars & constellations
  "polaris",
  "vega",
  "sirius",
  "rigel",
  "altair",
  "deneb",
  "antares",
  "spica",
  "betelgeuse",
  "proxima",
  "arcturus",
  "capella",
  "aldebaran",
  "castor",
  "orion",
  "lyra",
  "cygnus",
  "draco",
  "phoenix",
  "hydra",
  "andromeda",

  // Planets & moons
  "titan",
  "europa",
  "callisto",
  "ganymede",
  "triton",
  "phobos",
  "deimos",
  "charon",
  "io",
  "enceladus",
  "rhea",
  "dione",
  "tethys",
  "iapetus",

  // Weather & wind
  "zephyr",
  "breeze",
  "gale",
  "tempest",
  "cyclone",
  "vortex",
  "updraft",
  "jetstream",
  "trade",
  "monsoon",
  "squall",
  "chinook",
  "sirocco",
  "mistral",
  "harmattan",
  "bora",
  "foehn",
  "levanter",
  "tramontane",
  "pampero",

  // Light & color phenomena
  "prism",
  "spectrum",
  "halo",
  "corona",
  "rainbow",
  "sundog",
  "glory",
  "airglow",
  "zodiacal",
  "gegenschein",
  "earthshine",
  "albedo",
  "luminance",

  // Abstract & poetic
  "drift",
  "float",
  "wisp",
  "billow",
  "plume",
  "swirl",
  "cascade",
  "flow",
  "glide",
  "soar",
  "ascend",
  "hover",
  "loft",
  "waft",
  "eddy",
  "current",
  "stream",
  "ribbon",
  "veil",
  "shroud",
  "mantle",
  "canopy",
  "dome",
  "vault",

  // Mythological sky references
  "aether",
  "olympus",
  "elysium",
  "empyrean",
  "avalon",
  "asgard",
  "helios",
  "selene",
  "eos",
  "nyx",
  "hemera",
  "uranus",
  "caelus",
  "nut",
  "shu",

  // Scientific & technical
  "photon",
  "ion",
  "plasma",
  "flux",
  "radiant",
  "spectral",
  "thermal",
  "kinetic",
  "dynamic",
  "static",
  "gradient",
  "vector",
  "scalar",
  "tensor",

  // Additional evocative terms
  "apex",
  "vertex",
  "summit",
  "peak",
  "crest",
  "ridge",
  "tier",
  "stratum",
  "layer",
  "band",
  "zone",
  "sphere",
  "field",
  "realm",
  "domain",
  "expanse",
];

/**
 * Generates a random alphanumeric string of specified length
 * Uses lowercase letters and numbers for URL-friendliness
 */
const generateAlphanumeric = (length = 6) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a site name in the format: nimbus-xxx-abc123
 * where xxx is a cloud/sky/space term and abc123 is a 6-char alphanumeric
 */
const generateNimbusSiteName = () => {
  const term = NIMBUS_TERMS[Math.floor(Math.random() * NIMBUS_TERMS.length)];
  const suffix = generateAlphanumeric(6);
  return `nimbus-${term}-${suffix}`;
};

// Step Indicator Component
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Site Details", icon: <Globe size={16} /> },
    { number: 2, label: "Hosting", icon: <Server size={16} /> },
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
const SiteDetailsStep = ({
  siteName,
  setSiteName,
  useCustomDomain,
  setUseCustomDomain,
  customDomain,
  setCustomDomain,
  onNext,
}) => {
  const [domainValidation, setDomainValidation] = useState({
    loading: false,
    available: null,
    error: null,
  });

  // Generate initial site name on mount if not already set
  useEffect(() => {
    if (!siteName) {
      setSiteName(generateNimbusSiteName());
    }
  }, []);

  // Validate domain
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

  useEffect(() => {
    if (useCustomDomain && customDomain) {
      const timer = setTimeout(() => validateDomain(customDomain), 500);
      return () => clearTimeout(timer);
    }
  }, [customDomain, useCustomDomain]);

  const isSiteNameValid =
    siteName && siteName.length >= 3 && /^[a-z0-9-]+$/.test(siteName);
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
          <h3>Configure Your Website</h3>
          <p>Set up your site name and domain preferences</p>
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
                <span className="preview-text">Default URL:</span>
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

        {/* Custom Domain Section */}
        <div className="config-section">
          <div className="section-header">
            <h4>Custom Domain</h4>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={useCustomDomain}
                onChange={(e) => {
                  setUseCustomDomain(e.target.checked);
                  if (!e.target.checked) {
                    setCustomDomain("");
                    setDomainValidation({
                      loading: false,
                      available: null,
                      error: null,
                    });
                  }
                }}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {useCustomDomain ? (
            <div className="custom-domain-section">
              <div className="domain-input-group">
                <div className="input-with-validation">
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
                  {domainValidation.loading && (
                    <div className="validation-indicator loading">
                      <Loader size={16} />
                    </div>
                  )}
                  {domainValidation.available && (
                    <div className="validation-indicator success">
                      <Check size={16} /> Available
                    </div>
                  )}
                  {domainValidation.error && (
                    <div className="validation-indicator error">
                      <AlertCircle size={16} /> {domainValidation.error}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => validateDomain(customDomain)}
                  disabled={domainValidation.loading}
                >
                  <RefreshCw size={16} />
                  Check Availability
                </button>
              </div>

              <div className="domain-note">
                <AlertCircle size={16} />
                <div>
                  <p>
                    <strong>Important:</strong> You need to:
                  </p>
                  <ol>
                    <li>
                      Own this domain at a registrar (GoDaddy, Namecheap, etc.)
                    </li>
                    <li>
                      Update DNS records after deployment (we'll provide
                      instructions)
                    </li>
                    <li>SSL certificate will be automatically provisioned</li>
                  </ol>
                </div>
              </div>

              <div className="domain-preview">
                <div className="preview-label">
                  Your site will be accessible at:
                </div>
                <div className="preview-urls">
                  <div className="preview-url-item">
                    <span>Primary:</span>
                    <code>https://{customDomain || "yourdomain.com"}</code>
                  </div>
                  <div className="preview-url-item">
                    <span>Vercel URL (backup):</span>
                    <code>https://{siteName}.vercel.app</code>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-domain-note">
              <p>
                You can always add a custom domain later from your dashboard.
                Your site will initially use{" "}
                <strong>{siteName}.vercel.app</strong>
              </p>
            </div>
          )}
        </div>

        <div className="step-actions">
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!isSiteNameValid || !isCustomDomainValid}
          >
            Continue to Hosting
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 2: Hosting Selection (Simplified)
const HostingStep = ({ onNext, onBack, useCustomDomain }) => {
  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-icon-wrapper">
          <Server size={32} />
        </div>
        <div className="step-header-content">
          <h3>Hosting Configuration</h3>
          <p>Review your hosting setup</p>
        </div>
      </div>

      <div className="step-content">
        <div className="hosting-summary">
          <div className="summary-card">
            <div className="summary-header">
              <Cloud size={24} />
              <div>
                <h4>Vercel Platform</h4>
                <p>Global edge network with automatic SSL</p>
              </div>
            </div>

            <div className="summary-features">
              <div className="feature-grid">
                <div className="feature-item">
                  <Zap size={18} />
                  <span>Instant global deployment</span>
                </div>
                <div className="feature-item">
                  <Shield size={18} />
                  <span>Automatic SSL certificates</span>
                </div>
                <div className="feature-item">
                  <Globe size={18} />
                  <span>Global CDN included</span>
                </div>
                <div className="feature-item">
                  <BarChart size={18} />
                  <span>Built-in analytics</span>
                </div>
                <div className="feature-item">
                  <Upload size={18} />
                  <span>Continuous deployment</span>
                </div>
                <div className="feature-item">
                  <Users size={18} />
                  <span>Team collaboration</span>
                </div>
              </div>
            </div>

            {useCustomDomain && (
              <div className="domain-config-note">
                <div className="note-header">
                  <Link size={18} />
                  <strong>Custom Domain Setup</strong>
                </div>
                <p>
                  After deployment, we'll provide DNS records to point your
                  domain to Vercel. SSL will be automatically configured.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="step-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            <ChevronLeft size={20} />
            Back
          </button>
          <button className="btn btn-primary" onClick={onNext}>
            Continue to Payment
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Payment
const PaymentStep = ({
  siteName,
  useCustomDomain,
  customDomain,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    try {
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

      // 4. Deploy to Vercel with domain configuration
      const cleanHtmlContent = htmlContent
        .replace(/[\0-\x1F\x7F]/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

      const { data: deployData, error: deployError } =
        await supabase.functions.invoke("deploy-to-vercel", {
          body: {
            siteName: siteName,
            htmlContent: cleanHtmlContent,
            templateId: templateId,
            customization: customization,
            stripeSubscriptionId: subscriptionData.subscriptionId,
            stripeCustomerId: customerData.customerId,
            customDomain: useCustomDomain ? customDomain : null,
            configureDomain: useCustomDomain,
          },
        });

      if (deployError) throw new Error(deployError.message);

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
        domain_status: customDomain ? "pending_setup" : "none",
        vercel_deployment_id: deployData.deploymentId,
        vercel_project_id: deployData.projectId,
      });

      if (dbError) console.error("Database error:", dbError);

      // 6. If custom domain, initiate domain configuration
      if (useCustomDomain && customDomain) {
        const { error: domainError } = await supabase.functions.invoke(
          "configure-domain",
          {
            body: {
              domain: customDomain,
              deploymentId: deployData.deploymentId,
              siteName: siteName,
            },
          }
        );

        if (domainError) {
          console.error("Domain configuration error:", domainError);
          // Continue anyway - user can configure domain manually
        }
      }

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
      });
    } catch (err) {
      setError(err.message || "An error occurred during payment");
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
          <h3>Payment Information</h3>
          <p>Enter your card details to deploy your site</p>
        </div>
      </div>

      <div className="step-content">
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
              <div className="summary-item">
                <span>Custom Domain Setup</span>
                <span>Included</span>
              </div>
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
                <span>Deploy My Website</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 4: Success - Updated with better DNS instructions
const SuccessStep = ({ deployment, onClose, onEditSite }) => {
  const [copied, setCopied] = useState(false);
  const [showDnsDetails, setShowDnsDetails] = useState(false);
  const [copyStatus, setCopyStatus] = useState({});
  const [domainError, setDomainError] = useState(
    deployment.domainError || null
  );
  const [isRetryingDomain, setIsRetryingDomain] = useState(false);

  // Function to retry domain configuration
  const retryDomainConfiguration = async () => {
    if (!deployment.customDomain || !deployment.deploymentId) return;

    setIsRetryingDomain(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "configure-domain",
        {
          body: {
            domain: deployment.customDomain,
            deploymentId: deployment.deploymentId,
            siteName: deployment.siteName,
            retry: true,
          },
        }
      );

      if (error) throw error;

      if (data.success) {
        setDomainError(null);
        // Update deployment data
        deployment.domainConfigured = data.domainConfigured;
        deployment.domainVerified = data.domainVerified;
        deployment.dnsRecords = data.dnsRecords;
        deployment.verificationRecord = data.verificationRecord;

        setNotification({
          isOpen: true,
          message: "Domain configuration retried successfully!",
          type: "success",
        });
      } else {
        setDomainError(data.error || "Domain configuration failed");
      }
    } catch (err) {
      setDomainError(err.message || "Failed to retry domain configuration");
    } finally {
      setIsRetryingDomain(false);
    }
  };

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

  // Default DNS records if not provided by backend
  const getDefaultDnsRecords = (domain, siteName) => {
    return [
      {
        type: "A",
        host: "@",
        value: "76.76.21.21", // Generic Vercel IP - should be dynamic based on deployment
        ttl: "3600",
        priority: null,
        description: "Root domain pointing to Vercel",
      },
      {
        type: "A",
        host: "@",
        value: "76.76.21.22", // Secondary IP
        ttl: "3600",
        priority: null,
        description: "Secondary root domain record",
      },
      {
        type: "CNAME",
        host: "www",
        value: "cname.vercel-dns.com",
        ttl: "3600",
        priority: null,
        description: "WWW subdomain",
      },
    ];
  };

  const dnsRecords =
    deployment.dnsRecords ||
    getDefaultDnsRecords(deployment.customDomain, deployment.siteName);

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-header">
          <div className="success-icon">
            <CheckCircle size={48} className="text-success" />
          </div>
          <h2>Your Website is Live! 🎉</h2>
          <p className="success-subtitle">
            Your website has been successfully deployed and is now accessible
            online
          </p>
        </div>

        <div className="url-grid">
          <div className="url-card">
            <div className="url-header">
              <Cloud size={20} />
              <span>Vercel URL (Always Works)</span>
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
          // Add error display section
          {domainError && (
            <div className="domain-error-card">
              <div className="error-header">
                <AlertTriangle size={20} className="error-icon" />
                <h4>Domain Configuration Issue</h4>
              </div>
              <div className="error-content">
                <p className="error-message">{domainError}</p>

                {domainError.includes("already in use") && (
                  <div className="error-solution">
                    <p>
                      <strong>Solution:</strong>
                    </p>
                    <ul>
                      <li>
                        This domain is already connected to another Vercel
                        project
                      </li>
                      <li>
                        Go to{" "}
                        <a
                          href="https://vercel.com/dashboard/domains"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vercel Domains
                        </a>{" "}
                        to manage your domains
                      </li>
                      <li>Remove the domain from the other project first</li>
                      <li>Then retry configuration</li>
                    </ul>
                  </div>
                )}

                {domainError.includes("verification") && (
                  <div className="error-solution">
                    <p>
                      <strong>Solution:</strong>
                    </p>
                    <ul>
                      <li>Add the verification TXT record shown below</li>
                      <li>Wait 5-10 minutes for DNS propagation</li>
                      <li>Click "Retry Domain Setup"</li>
                    </ul>
                  </div>
                )}

                <div className="error-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDnsDetails(true)}
                  >
                    <Eye size={16} />
                    Show Setup Instructions
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={retryDomainConfiguration}
                    disabled={isRetryingDomain}
                  >
                    {isRetryingDomain ? (
                      <>
                        <Loader size={16} className="spinning" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        Retry Domain Setup
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {deployment.customDomain && (
            <div className="url-card domain-card">
              <div className="url-header">
                <Globe size={20} />
                <span>Custom Domain</span>
                <span
                  className={`status-badge ${
                    showDnsDetails ? "warning" : "pending"
                  }`}
                >
                  {showDnsDetails ? "DNS Setup Needed" : "Setup Required"}
                </span>
              </div>
              <div className="url-display">
                <a
                  href={`https://${deployment.customDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-url"
                  onClick={(e) => {
                    // Prevent navigation until DNS is configured
                    if (!deployment.domainConfigured) {
                      e.preventDefault();
                      setShowDnsDetails(true);
                    }
                  }}
                  style={{
                    opacity: deployment.domainConfigured ? 1 : 0.7,
                    cursor: deployment.domainConfigured ? "pointer" : "default",
                  }}
                >
                  https://{deployment.customDomain}
                  {!deployment.domainConfigured && " (Pending DNS)"}
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

              <div className="domain-setup-section">
                <button
                  className="btn btn-outline setup-toggle"
                  onClick={() => setShowDnsDetails(!showDnsDetails)}
                >
                  {showDnsDetails ? (
                    <>
                      <EyeOff size={16} />
                      Hide Setup Instructions
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      Show DNS Setup Instructions
                    </>
                  )}
                </button>

                <div className="dns-setup-instructions">
                  <h4>🚀 DNS Configuration Required</h4>
                  <p className="instruction-intro">
                    To activate <strong>{deployment.customDomain}</strong>, add
                    these DNS records at your domain registrar:
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
                    // When rendering DNS instructions
                    {dnsRecords.map((record, index) => (
                      <div key={index} className="dns-record-card">
                        <div className="record-header">
                          <span className="record-type">{record.type}</span>
                          <span className="record-host">
                            {record.host === "@"
                              ? deployment.customDomain
                              : `${record.host}.${deployment.customDomain}`}
                          </span>
                          {record.description && (
                            <span className="record-description">
                              {record.description}
                            </span>
                          )}
                        </div>
                        <div className="record-value">
                          <code>{record.value}</code>
                        </div>
                        <div className="record-footer">
                          <span>TTL: {record.ttl}</span>
                          {record.required && (
                            <span className="required-badge">Required</span>
                          )}
                        </div>
                      </div>
                    ))}
                    // Add registrar-specific guidance
                    {deployment.registrarInfo && (
                      <div className="registrar-guide">
                        <h5>For {deployment.registrarInfo.registrar}:</h5>
                        <p>{deployment.registrarInfo.instructions}</p>
                        <a
                          href={deployment.registrarInfo.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Official {deployment.registrarInfo.registrar} guide
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="registrar-guides">
                    <h5>📝 Popular Registrar Guides</h5>
                    <div className="registrar-links">
                      <a
                        href="https://support.google.com/domains/answer/3251147"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="registrar-link"
                      >
                        Google Domains
                      </a>
                      <a
                        href="https://www.godaddy.com/help/add-an-a-record-19238"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="registrar-link"
                      >
                        GoDaddy
                      </a>
                      <a
                        href="https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-do-i-add-a-record-for-my-domain/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="registrar-link"
                      >
                        Namecheap
                      </a>
                      <a
                        href="https://help.cloudflare.com/hc/en-us/articles/360019093151-Managing-DNS-records-in-Cloudflare"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="registrar-link"
                      >
                        Cloudflare
                      </a>
                    </div>
                  </div>

                  <div className="dns-guide">
                    <div className="guide-icon">
                      <AlertCircle size={24} />
                    </div>
                    <div className="guide-content">
                      <strong>💡 Important Notes:</strong>
                      <ul>
                        <li>
                          DNS changes can take <strong>up to 48 hours</strong>{" "}
                          to propagate globally
                        </li>
                        <li>
                          Your site remains accessible at the Vercel URL during
                          setup
                        </li>
                        <li>
                          SSL certificate will be auto-provisioned once DNS is
                          configured
                        </li>
                        <li>
                          You may need to clear your browser cache after DNS
                          updates
                        </li>
                        <li>
                          If using Cloudflare, disable the proxy (orange cloud)
                          during initial setup
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="verification-section">
                    <h5>✅ Verify DNS Configuration</h5>
                    <p>
                      After adding the DNS records, you can check propagation:
                    </p>
                    <div className="verification-tools">
                      <a
                        href={`https://dnschecker.org/#A/${deployment.customDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                      >
                        Check DNS Propagation
                      </a>
                      <a
                        href={`https://www.ssllabs.com/ssltest/analyze.html?d=${deployment.customDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                      >
                        Test SSL Certificate
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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
              <span className="detail-value status active">✓ Active</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Billing</span>
              <span className="detail-value">$5/month</span>
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
          {deployment.customDomain && (
            <a
              href={`https://vercel.com/dashboard/domains`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <Settings size={20} />
              Domain Settings
            </a>
          )}
        </div>

        <div className="next-steps">
          <h4>📋 Next Steps</h4>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Configure DNS</strong>
                <p>
                  Add the DNS records at your registrar (if using custom domain)
                </p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Wait for Propagation</strong>
                <p>DNS changes take 1-48 hours to propagate worldwide</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Verify SSL</strong>
                <p>SSL certificate will auto-provision once DNS resolves</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <strong>Edit Content</strong>
                <p>Update your site content anytime from the dashboard</p>
              </div>
            </div>
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
  const [deployment, setDeployment] = useState(null);
  const { shouldRender, isVisible } = useModalAnimation(isOpen, 400);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      // Generate a new nimbus site name when modal opens
      setSiteName(generateNimbusSiteName());
      setUseCustomDomain(false);
      setCustomDomain("");
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
    setDeployment(null);
    onClose();
  };

  const handleEditSite = () => {
    if (!deployment) return;

    // Close the payment modal
    handleClose();

    // Dispatch event to open customize modal with site data (same as UserAccountModal)
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
            useCustomDomain={useCustomDomain}
            setUseCustomDomain={setUseCustomDomain}
            customDomain={customDomain}
            setCustomDomain={setCustomDomain}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <HostingStep
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            useCustomDomain={useCustomDomain}
          />
        );
      case 3:
        return (
          <Elements stripe={stripePromise}>
            <PaymentStep
              siteName={siteName}
              useCustomDomain={useCustomDomain}
              customDomain={customDomain}
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
                <h3>Why Choose Us?</h3>
                <p>Professional hosting for modern websites</p>
              </div>

              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Zap size={24} />
                  </div>
                  <div className="benefit-content">
                    <h4>Instant Global Edge</h4>
                    <p>Deploy to 35+ regions worldwide</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Shield size={24} />
                  </div>
                  <div className="benefit-content">
                    <h4>Automatic SSL</h4>
                    <p>Free HTTPS certificates for all domains</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Link size={24} />
                  </div>
                  <div className="benefit-content">
                    <h4>Easy Custom Domains</h4>
                    <p>Connect any domain in minutes</p>
                  </div>
                </div>
              </div>

              <div className="custom-domain-feature">
                <div className="feature-badge">
                  <Globe size={16} />
                  <span>Custom Domain Support</span>
                </div>
                <p>Bring your own domain or use our Vercel subdomain</p>
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
