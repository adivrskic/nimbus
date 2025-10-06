// src/components/PaymentModal.jsx
import { useState, useEffect } from 'react';
import { X, CreditCard, Check, Loader } from 'lucide-react';
import './PaymentModal.scss';

function PaymentModal({ isOpen, onClose, templateId, customization, images }) {
  const [siteName, setSiteName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Clean up state when modal fully closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setSiteName('');
        setDeploymentResult(null);
        setIsProcessing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleDeploy = async () => {
    if (!siteName) {
      alert('Please enter a site name');
      return;
    }

    setIsProcessing(true);

    // Simulate deployment delay
    setTimeout(() => {
      setDeploymentResult({
        success: true,
        url: `https://${siteName}.netlify.app`
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleReset = () => {
    setSiteName('');
    setDeploymentResult(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`modal-backdrop ${isAnimating ? 'modal-backdrop--visible' : ''}`}
        onClick={handleClose}
      />
      <div className={`payment-modal ${isAnimating ? 'payment-modal--visible' : ''}`}>
        <div className="payment-modal__header">
          <div className="payment-modal__header-left">
            <button 
              className="payment-modal__close"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div>
              <h1 className="payment-modal__title">Deploy Your Site</h1>
              <p className="payment-modal__subtitle">Get your site online in minutes</p>
            </div>
          </div>
        </div>

        <div className="payment-modal__content">
          {!deploymentResult ? (
            <>
              <div className="payment-info">
                <div className="payment-info__price">
                  <span className="price-amount">$5</span>
                  <span className="price-period">/ month</span>
                </div>
                <p className="payment-info__description">
                  Professional hosting with SSL certificate included
                </p>
                <ul className="payment-info__features">
                  <li>
                    <Check size={16} />
                    Hosted on Netlify with SSL
                  </li>
                  <li>
                    <Check size={16} />
                    Custom domain support
                  </li>
                  <li>
                    <Check size={16} />
                    Automatic updates
                  </li>
                  <li>
                    <Check size={16} />
                    Cancel anytime
                  </li>
                </ul>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="siteName">Site Name</label>
                  <input
                    id="siteName"
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="my-awesome-site"
                    disabled={isProcessing}
                  />
                  <span className="form-hint">
                    Your site will be available at: <strong>{siteName || 'your-site'}.netlify.app</strong>
                  </span>
                </div>

                <button
                  className="btn btn-primary btn-lg btn-payment"
                  onClick={handleDeploy}
                  disabled={isProcessing || !siteName}
                >
                  {isProcessing ? (
                    <>
                      <Loader size={18} className="spinning" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Pay $5 & Deploy
                    </>
                  )}
                </button>

                <p className="payment-terms">
                  By deploying, you agree to pay $5/month. Cancel anytime from your dashboard.
                </p>
              </div>
            </>
          ) : (
            <div className="deployment-success">
              <div className="success-icon">
                <Check size={48} />
              </div>
              <h3>Site Deployed Successfully!</h3>
              <p>Your site is now live at:</p>
              <a 
                href={deploymentResult.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="deployed-url"
              >
                {deploymentResult.url}
              </a>
              <div className="success-actions">
                <button className="btn btn-primary" onClick={handleClose}>
                  Done
                </button>
                <button className="btn btn-secondary" onClick={handleReset}>
                  Deploy Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PaymentModal;