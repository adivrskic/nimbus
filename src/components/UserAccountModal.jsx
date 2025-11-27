// src/components/UserAccountModal.jsx
import { useState, useEffect } from 'react';
import { 
  X, User, Mail, Lock, CreditCard, Globe, 
  Loader, CheckCircle, AlertCircle, ExternalLink,
  Trash2, Eye, FileText, Edit
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { renderTemplate } from '../utils/templateSystem';
import ConfirmModal from './ConfirmModal';
import NotificationModal from './NotificationModal';
import PaymentModal from './PaymentModal';
import './UserAccountModal.scss';

function UserAccountModal({ isOpen, onClose }) {
  const { user, profile, updateProfile, updateEmail, updatePassword, supabase } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'sites', 'drafts', 'billing', 'security'
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sites, setSites] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: 'success' });
  const [deployModal, setDeployModal] = useState({ isOpen: false, draft: null });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    billing_email: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadUserData();
    }
  }, [isOpen, user]);

  const loadUserData = async () => {
    if (!user) return;

    // Set profile form
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        billing_email: profile.billing_email || ''
      });
    }

    // Load sites
    await loadSites();
    
    // Load drafts
    await loadDrafts();
    
    // Load billing summary
    await loadBillingSummary();
  };

  const loadSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error('Error loading sites:', error);
    }
  };

  const loadDrafts = async () => {
    try {
      const { data, error } = await supabase
        .from('template_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const loadBillingSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('user_billing_summary')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setBillingSummary(data);
    } catch (error) {
      console.error('Error loading billing summary:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await updateProfile(profileForm);
      
      if (result.success) {
        setNotification({
          isOpen: true,
          message: 'Profile updated successfully',
          type: 'success'
        });
      } else {
        setNotification({
          isOpen: true,
          message: result.error || 'Failed to update profile',
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        isOpen: true,
        message: error.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        isOpen: true,
        message: 'Passwords do not match',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setNotification({
        isOpen: true,
        message: 'Password must be at least 8 characters',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await updatePassword(passwordForm.newPassword);
      
      if (result.success) {
        setNotification({
          isOpen: true,
          message: 'Password updated successfully',
          type: 'success'
        });
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      } else {
        setNotification({
          isOpen: true,
          message: result.error || 'Failed to update password',
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        isOpen: true,
        message: error.message || 'Failed to update password',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSite = async (siteId, siteName) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Site?',
      message: `Are you sure you want to cancel "${siteName}"? It will remain active until the end of your billing period.`,
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const { error } = await supabase
            .from('sites')
            .update({ 
              cancelled_at: new Date().toISOString(),
              billing_status: 'cancelled'
            })
            .eq('id', siteId);

          if (error) throw error;

          setNotification({
            isOpen: true,
            message: 'Site cancelled successfully',
            type: 'success'
          });
          await loadSites();
          await loadBillingSummary();
        } catch (error) {
          setNotification({
            isOpen: true,
            message: error.message || 'Failed to cancel site',
            type: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleDeleteDraft = async (draftId, draftName) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Draft?',
      message: `Are you sure you want to delete "${draftName}"? This action cannot be undone.`,
      onConfirm: async () => {
        setIsLoading(true);
        try {
          console.log('Deleting draft:', draftId, 'for user:', user.id);
          
          const { error } = await supabase
            .from('template_drafts')
            .delete()
            .eq('id', draftId)
            .eq('user_id', user.id);

          console.log('Delete result:', { error });

          if (error) {
            console.error('Delete error details:', error);
            throw error;
          }

          console.log('Draft deleted successfully');
          setNotification({
            isOpen: true,
            message: 'Draft deleted successfully',
            type: 'success'
          });
          await loadDrafts();
        } catch (error) {
          console.error('Delete error:', error);
          setNotification({
            isOpen: true,
            message: error.message || 'Failed to delete draft',
            type: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleDeployDraft = (draft) => {
    setDeployModal({
      isOpen: true,
      draft: draft
    });
  };

  const handlePreviewDraft = (draft) => {
    const effectiveColorMode = draft.color_mode?.toLowerCase() === 'auto'
      ? (document.documentElement.getAttribute('data-theme') || 'light')
      : (draft.color_mode?.toLowerCase() || 'light');

    const html = renderTemplate(
      draft.template_id,
      draft.customization,
      draft.theme || 'minimal',
      effectiveColorMode
    );

    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  };

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClose = () => {
    setActiveTab('profile');
    setSuccessMessage('');
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop modal-backdrop--visible" onClick={handleClose} />
      <div className="account-modal">
        <button className="account-modal__close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="account-modal__header">
          <h2>Account Settings</h2>
          <p>{user?.email}</p>
        </div>

        <div className="account-modal__content">
          {/* Tabs */}
          <div className="account-tabs">
            <button
              className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              Profile
            </button>
            <button
              className={`account-tab ${activeTab === 'sites' ? 'active' : ''}`}
              onClick={() => setActiveTab('sites')}
            >
              <Globe size={18} />
              My Sites
            </button>
            <button
              className={`account-tab ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              <FileText size={18} />
              Drafts
            </button>
            <button
              className={`account-tab ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard size={18} />
              Billing
            </button>
            <button
              className={`account-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={18} />
              Security
            </button>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="message message--success">
              <CheckCircle size={18} />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="message message--error">
              <AlertCircle size={18} />
              {errorMessage}
            </div>
          )}

          {/* Tab Content */}
          <div className="account-tab-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="account-form">
                <div className="form-section">
                  <h3>Personal Information</h3>
                  
                  <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                    />
                    <span className="form-hint">
                      Email cannot be changed at this time
                    </span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      id="full_name"
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="billing_email">Billing Email (Optional)</label>
                    <input
                      id="billing_email"
                      type="email"
                      value={profileForm.billing_email}
                      onChange={(e) => setProfileForm({ ...profileForm, billing_email: e.target.value })}
                      placeholder="billing@company.com"
                    />
                    <span className="form-hint">
                      If different from your account email
                    </span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="spinning" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            )}

            {/* Sites Tab */}
            {activeTab === 'sites' && (
              <div className="sites-list">
                <div className="sites-header">
                  <h3>Your Deployed Sites</h3>
                  <span className="sites-count">{sites.length} sites</span>
                </div>

                {sites.length === 0 ? (
                  <div className="empty-state">
                    <Globe size={48} />
                    <h4>No sites yet</h4>
                    <p>Deploy your first site to get started</p>
                  </div>
                ) : (
                  <div className="sites-grid">
                    {sites.map(site => (
                      <div key={site.id} className="site-card">
                        <div className="site-card__header">
                          <div>
                            <h4>{site.site_name}</h4>
                            <span className={`status-badge status-badge--${site.status}`}>
                              {site.status}
                            </span>
                          </div>
                          {site.deployment_url && (
                            <a 
                              href={site.deployment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-icon"
                              title="View site"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>

                        <div className="site-card__info">
                          <div className="info-row">
                            <span className="info-label">Template:</span>
                            <span className="info-value">{site.template_id}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Status:</span>
                            <span className={`billing-status billing-status--${site.billing_status}`}>
                              {site.billing_status}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Monthly:</span>
                            <span className="info-value">
                              {formatCurrency(site.price_per_month_cents)}
                            </span>
                          </div>
                          {site.current_period_end && (
                            <div className="info-row">
                              <span className="info-label">Renews:</span>
                              <span className="info-value">
                                {formatDate(site.current_period_end)}
                              </span>
                            </div>
                          )}
                        </div>

                        {site.billing_status === 'active' && !site.cancelled_at && (
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleCancelSite(site.id, site.site_name)}
                            disabled={isLoading}
                          >
                            <Trash2 size={16} />
                            Cancel Subscription
                          </button>
                        )}

                        {site.cancelled_at && (
                          <div className="cancellation-notice">
                            Cancels on {formatDate(site.current_period_end)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Drafts Tab */}
            {activeTab === 'drafts' && (
              <div className="drafts-list">
                <div className="drafts-header">
                  <h3>Saved Template Drafts</h3>
                  <span className="drafts-count">{drafts.length} drafts</span>
                </div>

                {drafts.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={48} />
                    <h4>No drafts yet</h4>
                    <p>Save template configurations from the customize modal to access them later</p>
                  </div>
                ) : (
                  <div className="drafts-grid">
                    {drafts.map(draft => (
                      <div key={draft.id} className="draft-card">
                        <div className="draft-card__header">
                          <div>
                            <h4>{draft.draft_name}</h4>
                            <span className="draft-template">{draft.template_id}</span>
                          </div>
                        </div>

                        <div className="draft-card__info">
                          <div className="info-row">
                            <span className="info-label">Theme:</span>
                            <span className="info-value">{draft.theme}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Created:</span>
                            <span className="info-value">
                              {formatDate(draft.created_at)}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Updated:</span>
                            <span className="info-value">
                              {formatDate(draft.updated_at)}
                            </span>
                          </div>
                        </div>

                        <div className="draft-card__actions">
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handlePreviewDraft(draft)}
                            disabled={isLoading}
                            title="Preview draft"
                          >
                            <Eye size={16} />
                            <span className="btn-text">Preview</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleDeployDraft(draft)}
                            disabled={isLoading}
                            title="Deploy draft"
                          >
                            <ExternalLink size={16} />
                            <span className="btn-text">Deploy</span>
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleDeleteDraft(draft.id, draft.draft_name)}
                            disabled={isLoading}
                            title="Delete draft"
                          >
                            <Trash2 size={16} />
                            <span className="btn-text">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="billing-section">
                <div className="billing-summary">
                  <h3>Billing Summary</h3>
                  
                  {billingSummary && (
                    <div className="summary-cards">
                      <div className="summary-card">
                        <span className="summary-label">Active Sites</span>
                        <span className="summary-value">
                          {billingSummary.active_sites}
                        </span>
                      </div>
                      <div className="summary-card">
                        <span className="summary-label">Total Monthly</span>
                        <span className="summary-value">
                          {formatCurrency(billingSummary.total_monthly_cost_cents)}
                        </span>
                      </div>
                      {billingSummary.trial_sites > 0 && (
                        <div className="summary-card">
                          <span className="summary-label">Trial Sites</span>
                          <span className="summary-value">
                            {billingSummary.trial_sites}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="billing-info">
                    <p>
                      <strong>Pricing:</strong> ${(500 / 100).toFixed(2)} per site per month
                    </p>
                    <p>
                      Each site is billed separately. You can cancel anytime and the site will remain active until the end of your billing period.
                    </p>
                  </div>
                </div>

                {profile?.stripe_customer_id && (
                  <div className="stripe-portal">
                    <h3>Payment Methods</h3>
                    <p>Manage your payment methods and view invoices through Stripe.</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        // TODO: Create Stripe Customer Portal session
                        alert('Stripe Customer Portal integration coming soon');
                      }}
                    >
                      <ExternalLink size={18} />
                      Manage Billing
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate} className="account-form">
                <div className="form-section">
                  <h3>Change Password</h3>

                  <div className="form-field">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <span className="form-hint">
                      Must be at least 8 characters
                    </span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading || !passwordForm.newPassword || !passwordForm.confirmPassword}
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="spinning" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
      />

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        message={notification.message}
        type={notification.type}
      />

      {deployModal.isOpen && deployModal.draft && (
        <PaymentModal
          isOpen={deployModal.isOpen}
          onClose={() => setDeployModal({ isOpen: false, draft: null })}
          templateId={deployModal.draft.template_id}
          customization={deployModal.draft.customization}
        />
      )}
    </>
  );
}

export default UserAccountModal;