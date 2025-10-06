import { useState } from 'react';
import { X, ExternalLink, Check, Loader } from 'lucide-react';
import { 
  deployToNetlify, 
  deployToVercel, 
  deployToGitHub,
  generateDeploymentFiles 
} from '../utils/deploymentService';
import './DeploymentModal.scss';

function DeploymentModal({ isOpen, onClose, templateId, customization, images }) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);

  const providers = [
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'Deploy in seconds with automatic HTTPS',
      color: '#00C7B7',
      docsUrl: 'https://docs.netlify.com/cli/get-started/#obtain-a-token-in-the-netlify-ui'
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Fast global CDN with automatic deployments',
      color: '#000000',
      docsUrl: 'https://vercel.com/account/tokens'
    },
    {
      id: 'github',
      name: 'GitHub Pages',
      description: 'Free hosting directly from your repository',
      color: '#181717',
      docsUrl: 'https://github.com/settings/tokens'
    }
  ];

  const handleDeploy = async () => {
    if (!siteName || !accessToken) {
      alert('Please fill in all fields');
      return;
    }

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      const files = generateDeploymentFiles(templateId, customization, images);
      let result;

      switch (selectedProvider) {
        case 'netlify':
          result = await deployToNetlify(files, siteName, accessToken);
          break;
        case 'vercel':
          result = await deployToVercel(files, siteName, accessToken);
          break;
        case 'github':
          result = await deployToGitHub(files, siteName, accessToken);
          break;
        default:
          throw new Error('Invalid provider');
      }

      setDeploymentResult(result);
      
      // Save token to localStorage (encrypted in production!)
      if (result.success) {
        localStorage.setItem(`${selectedProvider}_token`, accessToken);
      }
    } catch (error) {
      setDeploymentResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleReset = () => {
    setSelectedProvider(null);
    setSiteName('');
    setAccessToken('');
    setDeploymentResult(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop modal-backdrop--visible" onClick={onClose} />
      <div className="deployment-modal">
        <div className="deployment-modal__header">
          <h2>Deploy Your Site</h2>
          <button className="deployment-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="deployment-modal__content">
          {!selectedProvider && !deploymentResult && (
            <div className="provider-selection">
              <p className="provider-selection__intro">
                Choose a hosting provider to deploy your site
              </p>
              
              <div className="provider-grid">
                {providers.map(provider => (
                  <button
                    key={provider.id}
                    className="provider-card"
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="provider-card__icon" style={{ background: provider.color }}>
                      {provider.name[0]}
                    </div>
                    <h3 className="provider-card__name">{provider.name}</h3>
                    <p className="provider-card__description">{provider.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedProvider && !deploymentResult && (
            <div className="deployment-form">
              <div className="deployment-form__header">
                <button className="btn-back" onClick={handleReset}>
                  ← Back
                </button>
                <h3>Deploy to {providers.find(p => p.id === selectedProvider)?.name}</h3>
              </div>

              <div className="form-group">
                <label htmlFor="siteName">Site Name</label>
                <input
                  id="siteName"
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="my-awesome-site"
                  disabled={isDeploying}
                />
                <span className="form-hint">
                  Choose a unique name for your site
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="accessToken">
                  Access Token
                  <a 
                    href={providers.find(p => p.id === selectedProvider)?.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="form-label-link"
                  >
                    How to get token <ExternalLink size={14} />
                  </a>
                </label>
                <input
                  id="accessToken"
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Enter your access token"
                  disabled={isDeploying}
                />
                <span className="form-hint">
                  Your token is stored locally and never sent to our servers
                </span>
              </div>

              <button 
                className="btn btn-primary btn-deploy"
                onClick={handleDeploy}
                disabled={isDeploying || !siteName || !accessToken}
              >
                {isDeploying ? (
                  <>
                    <Loader size={18} className="spinning" />
                    Deploying...
                  </>
                ) : (
                  <>Deploy Site</>
                )}
              </button>
            </div>
          )}

          {deploymentResult && (
            <div className={`deployment-result ${deploymentResult.success ? 'success' : 'error'}`}>
              {deploymentResult.success ? (
                <>
                  <div className="deployment-result__icon success">
                    <Check size={32} />
                  </div>
                  <h3>Deployment Successful!</h3>
                  <p>Your site is now live at:</p>
                  <a 
                    href={deploymentResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="deployment-result__url"
                  >
                    {deploymentResult.url}
                    <ExternalLink size={16} />
                  </a>
                  <div className="deployment-result__actions">
                    <button className="btn btn-primary" onClick={onClose}>
                      Done
                    </button>
                    <button className="btn btn-secondary" onClick={handleReset}>
                      Deploy Another
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="deployment-result__icon error">
                    <X size={32} />
                  </div>
                  <h3>Deployment Failed</h3>
                  <p className="deployment-result__error">{deploymentResult.error}</p>
                  <button className="btn btn-primary" onClick={handleReset}>
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DeploymentModal;