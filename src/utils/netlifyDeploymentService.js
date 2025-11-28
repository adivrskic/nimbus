// utils/netlifyDeploymentService.js
import JSZip from 'jszip';
import { renderTemplate } from './templateSystem';

/**
 * Netlify Deployment Service
 * Handles direct deployment to Netlify using their API
 */

class NetlifyDeploymentService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.apiBase = 'https://api.netlify.com/api/v1';
  }

  /**
   * Deploy a site to Netlify
   * @param {Object} options - Deployment options
   * @returns {Promise<Object>} Deployment result
   */
  async deploy(options) {
    const {
      templateId,
      customization,
      siteName,
      customDomain,
      theme = 'minimal',
      colorMode = 'auto'
    } = options;

    try {
      // Step 1: Generate the site files
      const files = await this.generateSiteFiles(templateId, customization, theme, colorMode);
      
      // Step 2: Create or get the site
      const site = await this.createOrGetSite(siteName, customDomain);
      
      // Step 3: Deploy the files
      const deployment = await this.deployFiles(site.id, files);
      
      return {
        success: true,
        siteId: site.id,
        deployId: deployment.id,
        url: `https://${site.default_domain || siteName + '.netlify.app'}`,
        adminUrl: `https://app.netlify.com/sites/${site.name}`,
        site,
        deployment
      };
    } catch (error) {
      console.error('Netlify deployment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate all files needed for the site
   */
  async generateSiteFiles(templateId, customization, theme, colorMode) {
    const files = new Map();
    
    // Generate main HTML
    const html = renderTemplate(templateId, customization, theme, colorMode);
    files.set('index.html', html);
    
    // Add robots.txt
    files.set('robots.txt', `User-agent: *
Disallow: 
Sitemap: /sitemap.xml`);
    
    // Add basic sitemap
    files.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${customization.domain || 'example.com'}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`);
    
    // Add _headers file for security headers
    files.set('_headers', `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer-when-downgrade`);
    
    // Add _redirects file if custom domain is set
    if (customization.customDomain) {
      files.set('_redirects', `# Redirect default Netlify subdomain to custom domain
https://*.netlify.app/* https://${customization.customDomain}/:splat 301!`);
    }
    
    return files;
  }

  /**
   * Create a new site or get existing one
   */
  async createOrGetSite(siteName, customDomain) {
    // First, try to get existing site
    try {
      const response = await fetch(`${this.apiBase}/sites?name=${siteName}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      const sites = await response.json();
      if (sites.length > 0) {
        return sites[0];
      }
    } catch (error) {
      // Site doesn't exist, continue to create
    }
    
    // Create new site
    const createResponse = await fetch(`${this.apiBase}/sites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: siteName,
        custom_domain: customDomain || undefined,
        processing_settings: {
          html: {
            pretty_urls: true
          }
        }
      })
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Failed to create site: ${error}`);
    }
    
    return await createResponse.json();
  }

  /**
   * Deploy files to a Netlify site
   */
  async deployFiles(siteId, files) {
    // Create a zip file with all the files
    const zipBlob = await this.createZip(files);
    
    // Deploy the zip file
    const response = await fetch(`${this.apiBase}/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/zip'
      },
      body: zipBlob
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to deploy: ${error}`);
    }
    
    const deployment = await response.json();
    
    // Wait for deployment to be ready
    await this.waitForDeployment(deployment.id);
    
    return deployment;
  }

  /**
   * Create a zip file from the files map
   */
  async createZip(files) {
    const zip = new JSZip();
    
    for (const [path, content] of files) {
      zip.file(path, content);
    }
    
    return await zip.generateAsync({ type: 'blob' });
  }

  /**
   * Wait for deployment to be ready
   */
  async waitForDeployment(deployId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.apiBase}/deploys/${deployId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      const deploy = await response.json();
      
      if (deploy.state === 'ready') {
        return deploy;
      }
      
      if (deploy.state === 'error') {
        throw new Error(`Deployment failed: ${deploy.error_message}`);
      }
      
      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Deployment timeout');
  }

  /**
   * Update site with custom domain
   */
  async updateSiteCustomDomain(siteId, customDomain) {
    const response = await fetch(`${this.apiBase}/sites/${siteId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        custom_domain: customDomain
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update custom domain: ${error}`);
    }
    
    return await response.json();
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deployId) {
    const response = await fetch(`${this.apiBase}/deploys/${deployId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get deployment status');
    }
    
    return await response.json();
  }

  /**
   * List all sites for the account
   */
  async listSites() {
    const response = await fetch(`${this.apiBase}/sites`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to list sites');
    }
    
    return await response.json();
  }

  /**
   * Delete a site
   */
  async deleteSite(siteId) {
    const response = await fetch(`${this.apiBase}/sites/${siteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete site');
    }
    
    return true;
  }
}

// Export a factory function to create instances
export function createNetlifyDeploymentService(accessToken) {
  return new NetlifyDeploymentService(accessToken);
}

// Export the class for testing
export default NetlifyDeploymentService;