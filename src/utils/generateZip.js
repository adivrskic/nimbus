import JSZip from 'jszip';
import { renderTemplate } from '../utils/templateSystem';

export async function generateZip(templateId, customization, theme = 'minimal', colorMode = 'auto') {
  const zip = new JSZip();
  
  // Normalize colorMode to lowercase
  const normalizedColorMode = (colorMode || 'auto').toLowerCase();
  
  // Generate HTML with new theme system
  const html = renderTemplate(templateId, customization, theme, normalizedColorMode);
  
  // Add main HTML file
  zip.file('index.html', html);
  
  // Add README with deployment instructions
  const readme = generateReadme(templateId, customization, theme);
  zip.file('README.md', readme);
  
  // Generate the zip file
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

function generateReadme(templateId, customization, theme) {
  return `# ${customization.name || 'Your'} Website

## Template Details
- Template: ${templateId}
- Style Theme: ${theme}
- Generated: ${new Date().toLocaleDateString()}

## Quick Start

### View Locally
1. Open \`index.html\` in your web browser
2. **No server required** - works directly from your computer

### Deploy Online
Upload all files to your web hosting service

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
- ${theme} design style with optimized typography and spacing
- CSS variables for easy customization
- Light/Dark mode support

### Theme Details

This template uses the **${theme}** style theme which features:
- Professional typography optimized for readability
- Consistent spacing and layout system
- Smooth animations and transitions
- Fully responsive design

### Need Help?

- Check the HTML comments for guidance
- Modify CSS variables at the top of the \`<style>\` section to change colors
- Search for text content to make edits
- The template is fully self-contained - no external dependencies needed

---

Generated with â¤ï¸ by Nimbus Template Builder
`;
}