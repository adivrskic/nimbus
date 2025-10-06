// Deployment configuration
const DEPLOYMENT_PROVIDERS = {
  netlify: {
    name: 'Netlify',
    apiEndpoint: 'https://api.netlify.com/api/v1',
    color: '#00C7B7',
    icon: 'netlify',
    requiresAuth: true
  },
  vercel: {
    name: 'Vercel',
    apiEndpoint: 'https://api.vercel.com',
    color: '#000000',
    icon: 'vercel',
    requiresAuth: true
  },
  github: {
    name: 'GitHub Pages',
    color: '#181717',
    icon: 'github',
    requiresAuth: true,
    info: 'Deploys to your GitHub repository'
  }
};

// Generate deployment files
export function generateDeploymentFiles(templateId, customization, images) {
  const { generateHTML } = require('./templateRenderer');
  
  const files = {
    'index.html': generateHTML(templateId, customization, images)
  };
  
  // Add images if any
  if (Object.keys(images).length > 0) {
    Object.entries(images).forEach(([key, imageData]) => {
      if (imageData?.file && imageData?.name) {
        files[`images/${imageData.name}`] = imageData.file;
      } else if (Array.isArray(imageData)) {
        imageData.forEach(img => {
          if (img.file && img.name) {
            files[`images/${img.name}`] = img.file;
          }
        });
      }
    });
  }
  
  return files;
}

// Netlify deployment
export async function deployToNetlify(files, siteName, accessToken) {
  const formData = new FormData();
  
  // Create a zip-like structure for Netlify
  const fileEntries = Object.entries(files);
  
  for (const [path, content] of fileEntries) {
    if (content instanceof Blob) {
      formData.append(path, content, path);
    } else {
      formData.append(path, new Blob([content], { type: 'text/html' }), path);
    }
  }
  
  try {
    const response = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Deployment failed');
    }
    
    const data = await response.json();
    return {
      success: true,
      url: data.ssl_url || data.url,
      siteId: data.id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Vercel deployment
export async function deployToVercel(files, projectName, accessToken) {
  const filesList = Object.entries(files).map(([path, content]) => ({
    file: path,
    data: content instanceof Blob 
      ? content 
      : new Blob([content], { type: path.endsWith('.html') ? 'text/html' : 'application/octet-stream' })
  }));
  
  try {
    // Create deployment
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        files: await Promise.all(
          filesList.map(async ({ file, data }) => ({
            file,
            data: data instanceof Blob ? await blobToBase64(data) : btoa(data)
          }))
        ),
        projectSettings: {
          framework: null
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Deployment failed');
    }
    
    const data = await response.json();
    return {
      success: true,
      url: `https://${data.url}`,
      deploymentId: data.id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper to convert Blob to Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// GitHub Pages deployment (requires GitHub API)
export async function deployToGitHub(files, repoName, accessToken) {
  // This is more complex as it requires creating a repo and pushing files
  // For MVP, we can guide users to manual upload or use GitHub's API
  
  try {
    // 1. Create repository
    const repoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Deployed with Nimbus',
        auto_init: true
      })
    });
    
    if (!repoResponse.ok && repoResponse.status !== 422) { // 422 = repo already exists
      throw new Error('Failed to create repository');
    }
    
    const repo = await repoResponse.json();
    
    // 2. Upload files via GitHub API
    for (const [path, content] of Object.entries(files)) {
      const fileContent = content instanceof Blob 
        ? await blobToBase64(content)
        : btoa(content);
      
      await fetch(`https://api.github.com/repos/${repo.full_name}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add ${path}`,
          content: fileContent
        })
      });
    }
    
    // 3. Enable GitHub Pages
    await fetch(`https://api.github.com/repos/${repo.full_name}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        source: {
          branch: 'main',
          path: '/'
        }
      })
    });
    
    return {
      success: true,
      url: `https://${repo.owner.login}.github.io/${repo.name}`,
      repoUrl: repo.html_url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}