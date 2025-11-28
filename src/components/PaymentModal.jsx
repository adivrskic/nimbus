import { useState, useEffect } from 'react';
import { X, CreditCard, Check, Loader, AlertCircle, Globe } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import './PaymentModal.scss';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentForm({ templateId, customization, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  
  // Generate default site name
  useEffect(() => {
    const timestamp = Date.now();
    const defaultName = `site-${timestamp}`;
    setSiteName(defaultName);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Step 1: Create payment intent on the backend
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            templateId,
            customization,
            siteName,
            customDomain,
            amount: 900, // $9.00 in cents
            currency: 'usd'
          }
        }
      );

      if (paymentError) throw paymentError;

      // Step 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: user.email,
            },
          },
        }
      );

      if (stripeError) {
        throw stripeError;
      }

      // Step 3: Deploy to Netlify (handled by edge function)
      const { data: deployData, error: deployError } = await supabase.functions.invoke(
        'deploy-to-netlify',
        {
          body: {
            paymentIntentId: paymentIntent.id,
            templateId,
            customization,
            siteName,
            customDomain
          }
        }
      );

      if (deployError) throw deployError;

      // Success!
      onSuccess({
        url: deployData.url,
        siteName: deployData.siteName,
        deploymentId: deployData.deploymentId
      });

    } catch (err) {
      console.error('Payment/Deployment error:', err);
      setError(err.message || 'An error occurred during payment or deployment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="deployment-config">
        <h3>Deployment Configuration</h3>
        
        <div className="form-group">
          <label>Site Name</label>
          <div className="input-with-suffix">
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="my-awesome-site"
              required
              disabled={processing}
            />
            <span className="suffix">.netlify.app</span>
          </div>
          <span className="form-hint">
            Your site will be available at: https://{siteName || 'your-site'}.netlify.app
          </span>
        </div>

        <div className="form-group">
          <label>Custom Domain (Optional)</label>
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="www.yourdomain.com"
            disabled={processing}
          />
          <span className="form-hint">
            You can connect your own domain after deployment
          </span>
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment Information</h3>
        
        <div className="price-summary">
          <div className="price-row">
            <span>One-time deployment</span>
            <span className="price">$9.00</span>
          </div>
          <div className="price-row small">
            <span>Includes hosting for 1 year</span>
          </div>
        </div>

        <div className="form-group">
          <label>Card Details</label>
          <div className="card-element-wrapper">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn--primary btn-payment"
          disabled={!stripe || processing}
        >
          {processing ? (
            <>
              <Loader className="spinning" size={20} />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Deploy Site for $9
            </>
          )}
        </button>

        <p className="payment-terms">
          By completing this purchase, you agree to our terms of service. 
          Your payment is secure and processed by Stripe.
        </p>
      </div>
    </form>
  );
}

function DeploymentSuccess({ deployment, onClose }) {
  return (
    <div className="deployment-success">
      <div className="success-icon">
        <Check size={48} />
      </div>
      
      <h2>Your Website is Live!</h2>
      <p>Your website has been successfully deployed to Netlify</p>
      
      <div className="deployment-details">
        <div className="detail-row">
          <Globe size={20} />
          <div>
            <label>Site URL</label>
            <a 
              href={deployment.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="deployed-url"
            >
              {deployment.url}
            </a>
          </div>
        </div>
        
        <div className="detail-row">
          <label>Site Name</label>
          <span>{deployment.siteName}</span>
        </div>
        
        <div className="detail-row">
          <label>Deployment ID</label>
          <span className="mono">{deployment.deploymentId}</span>
        </div>
      </div>

      <div className="success-actions">
        <button className="btn btn--secondary" onClick={onClose}>
          Continue Building
        </button>
        <a 
          href={deployment.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn--primary"
        >
          Visit Your Site →
        </a>
      </div>

      <div className="next-steps">
        <h4>Next Steps</h4>
        <ul>
          <li>Share your site with friends and clients</li>
          <li>Connect a custom domain in Netlify dashboard</li>
          <li>Set up analytics to track visitors</li>
          <li>Enable form submissions if needed</li>
        </ul>
      </div>
    </div>
  );
}

export default function PaymentModal({ isOpen, onClose, templateId, customization }) {
  const [deployment, setDeployment] = useState(null);

  const handleSuccess = (deploymentData) => {
    setDeployment(deploymentData);
  };

  const handleClose = () => {
    setDeployment(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop modal-backdrop--visible" onClick={handleClose} />
      <div className="payment-modal payment-modal--visible">
        <div className="payment-modal__header">
          <button className="payment-modal__close" onClick={handleClose}>
            <X size={24} />
          </button>
          <div>
            <h2 className="payment-modal__title">
              {deployment ? 'Deployment Successful!' : 'Deploy Your Website'}
            </h2>
            <p className="payment-modal__subtitle">
              {deployment 
                ? 'Your website is now live and accessible worldwide' 
                : 'Complete your purchase to deploy your website instantly'}
            </p>
          </div>
        </div>

        <div className="payment-modal__content">
          <Elements stripe={stripePromise}>
            {!deployment ? (
              <PaymentForm 
                templateId={templateId}
                customization={customization}
                onSuccess={handleSuccess}
                onClose={handleClose}
              />
            ) : (
              <DeploymentSuccess 
                deployment={deployment}
                onClose={handleClose}
              />
            )}
          </Elements>
        </div>
      </div>
    </>
  );
}