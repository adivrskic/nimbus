import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateHTML } from './templateRenderer';

export async function generateZip(templateId, customization, images = {}) {
  const zip = new JSZip();
  
  // Generate the HTML content with image URLs pointing to ./images/
  const htmlForDownload = generateHTMLForDownload(templateId, customization, images);
  
  // Add HTML file
  zip.file('index.html', htmlForDownload);
  
  // Create images folder and add uploaded images
  if (Object.keys(images).length > 0) {
    const imagesFolder = zip.folder('images');
    const imageList = [];
    
    for (const [key, imageData] of Object.entries(images)) {
      if (!imageData) continue;
      
      // Handle single image (including group item images like "projects.0.image")
      if (imageData.file && imageData.name) {
        imagesFolder.file(imageData.name, imageData.file);
        imageList.push(`- ${imageData.name} (${key})`);
      }
      // Handle multiple images array
      else if (Array.isArray(imageData)) {
        imageData.forEach((img, index) => {
          if (img.file && img.name) {
            imagesFolder.file(img.name, img.file);
            imageList.push(`- ${img.name} (${key}[${index}])`);
          }
        });
      }
    }
    
    // Add README for images
    if (imageList.length > 0) {
      imagesFolder.file('README.txt', `Image Files

The following images have been included in this folder:
${imageList.join('\n')}

These images are already referenced in your HTML file.
You can replace them with new images by keeping the same filenames.
`);
    }
  }
  
  // Add main README
  const readme = generateReadme(templateId, customization, images);
  zip.file('README.md', readme);
  
  // Generate the zip file
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Download
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${templateId}-${timestamp}.zip`;
  saveAs(blob, filename);
}

// New function to generate HTML with relative image paths for download
function generateHTMLForDownload(templateId, customization, images) {
  // Create a modified images object with relative paths
  const imagesForDownload = {};
  
  for (const [key, imageData] of Object.entries(images)) {
    if (!imageData) continue;
    
    // Handle single image (including group images)
    if (imageData.file && imageData.name) {
      imagesForDownload[key] = {
        ...imageData,
        url: `./images/${imageData.name}`
      };
    }
    // Handle multiple images
    else if (Array.isArray(imageData)) {
      imagesForDownload[key] = imageData.map(img => ({
        ...img,
        url: `./images/${img.name}`
      }));
    }
  }
  
  return generateHTML(templateId, customization, imagesForDownload);
}

function generateReadme(templateId, customization, images) {
  const templateNames = {
    'business-card': 'Modern Business Card',
    'profile': 'Personal Profile',
    'split-profile': 'Split Profile',
    'product-launch': 'Product Launch',
    'startup-hero': 'Startup Hero',
    'fine-dining': 'Fine Dining Menu',
    'casual-bistro': 'Casual Bistro Menu',
    'creative-portfolio': 'Creative Portfolio',
    'agency-showcase': 'Agency Showcase',
    'saas-product': 'SaaS Product',
    'consulting-firm': 'Consulting Firm',
    'photography-grid': 'Photography Grid',
    'photography-masonry': 'Photography Masonry'
  };

  const templateName = templateNames[templateId] || 'Template';
  const hasImages = Object.keys(images).length > 0;

  return `# ${templateName}

## Getting Started

This is your customized ${templateName} template, ready to deploy.

### What's Included

- \`index.html\` - Your fully customized webpage
${hasImages ? '- `images/` - Your uploaded images\n- `images/README.txt` - Information about image files' : ''}

### How to Use

1. **Open locally**: Double-click \`index.html\` to view in your browser
2. **Deploy online**: Upload all files to your web hosting service
3. **Edit content**: Open \`index.html\` in a text editor to make changes

### Deployment Options

**Free Hosting:**
- [Netlify](https://netlify.com) - Drag and drop deployment
- [Vercel](https://vercel.com) - Git-based deployment
- [GitHub Pages](https://pages.github.com) - Free hosting with GitHub
- [Cloudflare Pages](https://pages.cloudflare.com) - Fast global deployment

**Steps to deploy:**
1. Sign up for any of the services above
2. Upload your files or connect to a Git repository
3. Your site will be live in minutes!

### Customization

All content in the HTML can be edited by searching for the text you want to change. The template uses:
- Modern, responsive design that works on all devices
- System fonts for fast loading
- Clean, semantic HTML5
- CSS variables for easy color customization

### Theme Support

This template supports light/dark modes:
- **Light Mode**: Clean, bright appearance
- **Dark Mode**: Easy on the eyes in low light
- **Auto Mode**: Follows your system preferences

### Need Help?

- Check the HTML comments for guidance
- Modify CSS variables at the top of the \`<style>\` section to change colors
- Search for \`data-editable\` attributes to find editable content

---

Generated with ❤️ by Nimbus Template Builder
`;
}