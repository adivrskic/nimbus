// src/utils/siteHelpers.js
// Helper utilities for site management and billing

/**
 * Generate a URL-friendly slug from site name
 */
export const generateSlug = (name, userId = '') => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).slice(-4);
  return `${baseSlug}-${timestamp}`;
};

/**
 * Format currency from cents to dollars
 */
export const formatCurrency = (cents, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

/**
 * Check if site is in trial period
 */
export const isInTrial = (site) => {
  if (site.billing_status !== 'trial') return false;
  if (!site.trial_ends_at) return false;
  return new Date(site.trial_ends_at) > new Date();
};

/**
 * Check if site is cancelling at period end
 */
export const isCancelling = (site) => {
  if (!site.cancelled_at) return false;
  if (!site.current_period_end) return false;
  return new Date(site.current_period_end) > new Date();
};

/**
 * Get days remaining in billing period
 */
export const getDaysRemaining = (periodEndDate) => {
  const end = new Date(periodEndDate);
  const now = new Date();
  const diffInMs = end - now;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffInDays);
};

/**
 * Get billing status display info
 */
export const getBillingStatusInfo = (status) => {
  const statusMap = {
    active: {
      label: 'Active',
      color: '#22c55e',
      description: 'Subscription is active',
    },
    trial: {
      label: 'Trial',
      color: '#3b82f6',
      description: 'In trial period',
    },
    past_due: {
      label: 'Past Due',
      color: '#f59e0b',
      description: 'Payment failed',
    },
    cancelled: {
      label: 'Cancelled',
      color: '#6b7280',
      description: 'Subscription cancelled',
    },
    unpaid: {
      label: 'Unpaid',
      color: '#ef4444',
      description: 'Awaiting payment',
    },
  };
  
  return statusMap[status] || {
    label: status,
    color: '#6b7280',
    description: 'Unknown status',
  };
};

/**
 * Get deployment status display info
 */
export const getDeploymentStatusInfo = (status) => {
  const statusMap = {
    draft: {
      label: 'Draft',
      color: '#6b7280',
      description: 'Not deployed yet',
    },
    deploying: {
      label: 'Deploying',
      color: '#3b82f6',
      description: 'Deployment in progress',
    },
    deployed: {
      label: 'Live',
      color: '#22c55e',
      description: 'Successfully deployed',
    },
    failed: {
      label: 'Failed',
      color: '#ef4444',
      description: 'Deployment failed',
    },
    archived: {
      label: 'Archived',
      color: '#6b7280',
      description: 'Site archived',
    },
  };
  
  return statusMap[status] || {
    label: status,
    color: '#6b7280',
    description: 'Unknown status',
  };
};

/**
 * Calculate total monthly cost for multiple sites
 */
export const calculateTotalMonthlyCost = (sites) => {
  return sites
    .filter(site => ['active', 'past_due'].includes(site.billing_status))
    .reduce((total, site) => total + (site.price_per_month_cents || 0), 0);
};

/**
 * Group sites by billing status
 */
export const groupSitesByStatus = (sites) => {
  return sites.reduce((groups, site) => {
    const status = site.billing_status || 'unknown';
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(site);
    return groups;
  }, {});
};

/**
 * Sort sites by various criteria
 */
export const sortSites = (sites, criteria = 'newest') => {
  const sortFunctions = {
    newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
    oldest: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    name: (a, b) => a.site_name.localeCompare(b.site_name),
    status: (a, b) => a.billing_status.localeCompare(b.billing_status),
  };
  
  return [...sites].sort(sortFunctions[criteria] || sortFunctions.newest);
};

/**
 * Validate site name
 */
export const validateSiteName = (name) => {
  const errors = [];
  
  if (!name || !name.trim()) {
    errors.push('Site name is required');
  }
  
  if (name.length < 3) {
    errors.push('Site name must be at least 3 characters');
  }
  
  if (name.length > 50) {
    errors.push('Site name must be less than 50 characters');
  }
  
  if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
    errors.push('Site name can only contain letters, numbers, spaces, and hyphens');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate custom domain
 */
export const validateCustomDomain = (domain) => {
  const errors = [];
  
  if (!domain) {
    return { isValid: true, errors }; // Optional field
  }
  
  // Basic domain validation
  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
  
  if (!domainRegex.test(domain)) {
    errors.push('Please enter a valid domain (e.g., example.com)');
  }
  
  if (domain.startsWith('http://') || domain.startsWith('https://')) {
    errors.push('Domain should not include http:// or https://');
  }
  
  if (domain.includes('/')) {
    errors.push('Domain should not include paths');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get next billing date text
 */
export const getNextBillingText = (site) => {
  if (!site.current_period_end) return 'N/A';
  
  const daysRemaining = getDaysRemaining(site.current_period_end);
  
  if (site.cancelled_at) {
    return `Ends in ${daysRemaining} days`;
  }
  
  if (site.billing_status === 'trial') {
    return `Trial ends in ${daysRemaining} days`;
  }
  
  return `Renews in ${daysRemaining} days`;
};

/**
 * Check if user can deploy another site
 */
export const canDeployMoreSites = (currentSitesCount, maxSitesLimit) => {
  return currentSitesCount < maxSitesLimit;
};

/**
 * Get deployment provider info
 */
export const getProviderInfo = (provider) => {
  const providers = {
    netlify: {
      name: 'Netlify',
      icon: '🌐',
      color: '#00C7B7',
    },
    vercel: {
      name: 'Vercel',
      icon: '▲',
      color: '#000000',
    },
    github: {
      name: 'GitHub Pages',
      icon: '🐙',
      color: '#181717',
    },
    cloudflare: {
      name: 'Cloudflare Pages',
      icon: '☁️',
      color: '#F38020',
    },
  };
  
  return providers[provider] || {
    name: provider || 'Unknown',
    icon: '🌍',
    color: '#6b7280',
  };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate deployment URL preview
 */
export const generateDeploymentPreview = (slug, provider = 'netlify') => {
  const domains = {
    netlify: `${slug}.netlify.app`,
    vercel: `${slug}.vercel.app`,
    github: `${slug}.github.io`,
    cloudflare: `${slug}.pages.dev`,
  };
  
  return domains[provider] || `${slug}.example.com`;
};

/**
 * Parse error message from API
 */
export const parseErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  
  if (error?.message) return error.message;
  
  if (error?.error_description) return error.error_description;
  
  if (error?.msg) return error.msg;
  
  return 'An unexpected error occurred';
};

/**
 * Debounce function for search/input
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true };
    } catch (err) {
      document.body.removeChild(textArea);
      return { success: false, error: 'Failed to copy' };
    }
  }
};

/**
 * Open URL in new tab safely
 */
export const openInNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Check if URL is valid
 */
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate random color for avatar
 */
export const generateAvatarColor = (str) => {
  const colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
    '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export default {
  generateSlug,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  isInTrial,
  isCancelling,
  getDaysRemaining,
  getBillingStatusInfo,
  getDeploymentStatusInfo,
  calculateTotalMonthlyCost,
  groupSitesByStatus,
  sortSites,
  validateSiteName,
  validateCustomDomain,
  getNextBillingText,
  canDeployMoreSites,
  getProviderInfo,
  formatFileSize,
  truncateText,
  generateDeploymentPreview,
  parseErrorMessage,
  debounce,
  copyToClipboard,
  openInNewTab,
  isValidUrl,
  getInitials,
  generateAvatarColor,
};