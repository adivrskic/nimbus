import { useState } from 'react';
import { X, CreditCard, Check, Loader } from 'lucide-react';
import { deployToNetlify } from '../utils/deploymentService';
import './PaymentModal.scss';

function PaymentModal({ isOpen, onClose, templateId, customization }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/25');
  const [cardCvc, setCardCvc] = useState('123');

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Deploy the site with theme support
    const result = await deployToNetlify(
      templateId,
      customization,
      customization.theme || 'minimal',
      customization.colorMode || 'auto',
      'demo-api-key'
    );
    
    if (result.success) {
      setSuccess(true);
      setDeployedUrl(result.url);
    }
    
    setProcessing(false);
  };

  const handleClose = () => {
    setSuccess(false);
    setDeployedUrl('');
    setProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop modal-backdrop--visible" onClick={handleClose} />
      <div className="payment-modal payment-modal--visible">
        <div className="payment-modal__header">
          <div className="payment-modal__header-left">
            <button className="payment-modal__close" onClick={handleClose}>
              <X size={24} />
            </button>
            <div>
              <h2 className="payment-modal__title">
                {success ? 'Deployment Successful!' : 'Deploy Your Website'}
              </h2>
              <p className="payment-modal__subtitle">
                {success 
                  ? 'Your website is now live and ready to share' 
                  : 'Complete your purchase to deploy your website instantly'}
              </p>
            </div>
          </div>
        </div>

        <div className="payment-modal__content">
          {!success ? (
            <>
              <div className="payment-info">
                <div className="price-amount">$9</div>
                <div className="price-period">one-time payment</div>
                <p className="payment-info__description">
                  Get your website live in seconds with professional hosting
                </p>
                <ul className="payment-info__features">
                  <li>
                    <Check size={16} />
                    Instant deployment to global CDN
                  </li>
                  <li>
                    <Check size={16} />
                    Free SSL certificate included
                  </li>
                  <li>
                    <Check size={16} />
                    Custom domain support
                  </li>
                  <li>
                    <Check size={16} />
                    99.99% uptime guarantee
                  </li>
                </ul>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    disabled={processing}
                  />
                  <span className="form-hint">Test mode: Use <strong>4242 4242 4242 4242</strong></span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      disabled={processing}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      disabled={processing}
                    />
                  </div>
                </div>

                <button 
                  className="btn btn--primary btn-payment"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader className="spinning" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Deploy for $9
                    </>
                  )}
                </button>

                <p className="payment-terms">
                  By completing this purchase, you agree to our terms of service and privacy policy.
                  This is a demo transaction and no real payment will be processed.
                </p>
              </div>
            </>
          ) : (
            <div className="deployment-success">
              <div className="success-icon">
                <Check size={40} />
              </div>
              <h3>Your website is live!</h3>
              <p>Your website has been successfully deployed and is now accessible worldwide.</p>
              
              <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="deployed-url">
                {deployedUrl}
              </a>
              
              <div className="success-actions">
                <button className="btn btn--secondary" onClick={handleClose}>
                  Close
                </button>
                <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                  Visit Site
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PaymentModal;