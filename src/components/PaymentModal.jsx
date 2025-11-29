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
import "./PaymentModal.scss";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1d1d1f",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      "::placeholder": {
        color: "#a1a1a6",
      },
    },
  },
};

function PaymentForm({ templateId, customization, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [siteName, setSiteName] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    const timestamp = Date.now();
    setSiteName(`site-${timestamp}`);
  }, []);

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) setError(event.error.message);
    else setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke(
        "create-payment-intent",
        {
          body: {
            templateId,
            customization,
            siteName,
            customDomain,
            amount: 500,
            currency: "usd",
          },
        }
      );

      const paymentData = response.data;

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(paymentData.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { email: user.email },
          },
        });

      if (stripeError) throw stripeError;

      const { data: deployData, error: deployError } =
        await supabase.functions.invoke("deploy-to-netlify", {
          body: {
            paymentIntentId: paymentIntent.id,
            templateId,
            customization,
            siteName,
            customDomain,
          },
        });

      if (deployError) throw deployError;

      onSuccess({
        url: deployData.url,
        siteName: deployData.siteName,
        deploymentId: deployData.deploymentId,
      });
    } catch (err) {
      console.error("Payment/Deployment error:", err);
      setError(err.message || "An error occurred during payment or deployment");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-section">
        <div className="section-header">
          <Globe size={20} />
          <h3>Site Configuration</h3>
        </div>

        <div className="form-group">
          <label htmlFor="siteName">Site Name</label>
          <div className="input-with-suffix">
            <input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) =>
                setSiteName(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                )
              }
              placeholder="my-awesome-site"
              pattern="[a-z0-9-]+"
              required
              disabled={processing}
            />
            <span className="url-suffix">.netlify.app</span>
          </div>
          <p className="field-hint">
            Your site will be live at:{" "}
            <strong>https://{siteName || "your-site"}.netlify.app</strong>
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="customDomain">
            Custom Domain <span className="optional-badge">Optional</span>
          </label>
          <input
            id="customDomain"
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="www.yourdomain.com"
            disabled={processing}
          />
          <p className="field-hint">
            Connect your own domain after deployment through Netlify's dashboard
          </p>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <Lock size={20} />
          <h3>Payment Details</h3>
        </div>

        <div className="form-group">
          <label htmlFor="card-element">Card Information</label>
          <div className="card-element-container">
            <CardElement
              id="card-element"
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
          <p className="field-hint secure-hint">
            <Lock size={12} /> Your payment info is secure and encrypted
          </p>
        </div>

        <div className="test-mode-notice">
          <AlertCircle size={16} />
          <div>
            <strong>Test Mode</strong>
            <p>Use card number: 4242 4242 4242 4242</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary submit-button"
          disabled={!stripe || processing || !cardComplete || !siteName}
        >
          {processing ? (
            <>
              <Loader className="spinning" size={20} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} /> <span>Deploy Site - $5/month</span>
            </>
          )}
        </button>

        <p className="terms-text">
          By completing your purchase, you agree to our Terms of Service and
          Privacy Policy. You'll be charged $5 monthly. Cancel anytime from your
          dashboard.
        </p>
      </div>
    </form>
  );
}

function DeploymentSuccess({ deployment, onClose }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(deployment.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="deployment-success">
      <div className="success-animation">
        <div className="success-icon-wrapper">
          <Check size={48} />
        </div>
      </div>

      <h2 className="success-title">Your Website is Live! 🎉</h2>
      <p className="success-subtitle">
        Your website has been successfully deployed and is accessible worldwide
      </p>

      <div className="deployment-info">
        <div className="url-display">
          <Globe size={20} />
          <a
            href={deployment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="deployment-url"
          >
            {deployment.url}
          </a>
          <button
            onClick={copyUrl}
            className="btn btn-secondary copy-button"
            title="Copy URL"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="deployment-details">
          <div className="detail-item">
            <span className="detail-label">Site Name:</span>
            <span className="detail-value">{deployment.siteName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Deployment ID:</span>
            <span className="detail-value mono">{deployment.deploymentId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Billing:</span>
            <span className="detail-value">$5/month (cancel anytime)</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={onClose}>
          Continue Building
        </button>
        <a
          href={deployment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Visit Your Site →
        </a>
      </div>

      <div className="next-steps-card">
        <h3>What's Next?</h3>
        <ul>
          <li>Share your new website with friends and clients</li>
          <li>Connect a custom domain through Netlify dashboard</li>
          <li>Set up analytics to track your visitors</li>
          <li>Manage your subscription in your account settings</li>
        </ul>
      </div>
    </div>
  );
}

export default function PaymentModal({
  isOpen,
  onClose,
  templateId,
  customization,
}) {
  const [deployment, setDeployment] = useState(null);

  const handleSuccess = (deploymentData) => setDeployment(deploymentData);
  const handleClose = () => {
    setDeployment(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop modal-backdrop--visible"
        onClick={handleClose}
      />
      <div className="payment-modal payment-modal--visible">
        <div className="payment-modal__header">
          <div className="payment-modal__header-left">
            <button className="payment-modal__close" onClick={handleClose}>
              <X size={24} />
            </button>
            <div>
              <h2 className="payment-modal__title">
                {deployment ? "Success!" : "Deploy Your Website"}
              </h2>
              <p className="payment-modal__subtitle">
                {deployment
                  ? "Your website is now live on the internet"
                  : "Get your website online in seconds with secure hosting"}
              </p>
            </div>
          </div>
        </div>

        <div className="payment-modal__content">
          {/* Left Column - Form */}
          <div className="payment-left">
            {!deployment ? (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  templateId={templateId}
                  customization={customization}
                  onSuccess={handleSuccess}
                  onClose={handleClose}
                />
              </Elements>
            ) : (
              <DeploymentSuccess
                deployment={deployment}
                onClose={handleClose}
              />
            )}
          </div>

          {/* Right Column - Features & Benefits */}
          <div className="payment-right">
            <div className="features-column">
              <div className="features-header">
                <h3>Why Deploy With Us?</h3>
                <p>Professional hosting made simple</p>
              </div>

              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <Zap size={24} />
                  </div>
                  <div className="feature-content">
                    <h4>Lightning Fast</h4>
                    <p>
                      Your site goes live in seconds with our instant deployment
                    </p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <Globe size={24} />
                  </div>
                  <div className="feature-content">
                    <h4>Global CDN</h4>
                    <p>Loads instantly for visitors worldwide</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <Shield size={24} />
                  </div>
                  <div className="feature-content">
                    <h4>Secure & Protected</h4>
                    <p>Free SSL certificates and DDoS protection included</p>
                  </div>
                </div>
              </div>

              <div className="pricing-highlight">
                <div className="price-tag">
                  <span className="price">$5</span>
                  <span className="period">/month</span>
                </div>
                <ul className="pricing-features">
                  <li>
                    <Check size={16} /> Unlimited bandwidth
                  </li>
                  <li>
                    <Check size={16} /> Custom domain support
                  </li>
                  <li>
                    <Check size={16} /> Cancel anytime
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
