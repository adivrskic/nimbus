// utils/downloadZip.js
import JSZip from "jszip";

/**
 * Generate and download a ZIP file with HTML and README
 * @param {string} htmlContent - The generated HTML
 * @param {string} projectName - Name for the project
 */
export async function downloadZip(htmlContent, projectName = "website") {
  if (!htmlContent) return;

  const zip = new JSZip();

  // Add index.html
  zip.file("index.html", htmlContent);

  // Add README with deployment instructions
  const readme = generateReadme(projectName);
  zip.file("README.md", readme);

  // Generate and download
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFilename(projectName)}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename for download
 */
function sanitizeFilename(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "website"
  );
}

/**
 * Generate README content with deployment instructions
 */
function generateReadme(projectName) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `# ${projectName}

Generated on ${date}

## Quick Start

### View Locally
Simply open \`index.html\` in your web browser. No server required!

## Deploy Your Website

### Option 1: Netlify (Easiest - Drag & Drop)
1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Drag and drop this entire folder onto the Netlify dashboard
3. Your site is live! You'll get a URL like \`your-site.netlify.app\`

### Option 2: Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Install Vercel CLI: \`npm i -g vercel\`
3. Run \`vercel\` in this folder
4. Follow the prompts - your site will be live in seconds

### Option 3: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload these files to the repository
3. Go to Settings → Pages
4. Select "main" branch and save
5. Your site will be at \`username.github.io/repo-name\`

### Option 4: Cloudflare Pages
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub or upload directly
3. Your site gets global CDN distribution for free

### Option 5: Traditional Hosting
Upload all files to any web host via FTP:
- Hostinger
- Bluehost
- GoDaddy
- Any hosting provider

## File Structure

\`\`\`
├── index.html    # Your complete website
└── README.md     # This file
\`\`\`

## Customization Tips

### Change Colors
Look for CSS variables at the top of the \`<style>\` section:
\`\`\`css
:root {
  --primary-color: #...;
  --background: #...;
}
\`\`\`

### Edit Content
All text content is in the HTML. Search for the text you want to change and edit directly.

### Add More Pages
1. Duplicate \`index.html\`
2. Rename to \`about.html\`, \`contact.html\`, etc.
3. Update the content
4. Link pages using: \`<a href="about.html">About</a>\`

## Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ No external dependencies
- ✅ Fast loading
- ✅ SEO-friendly HTML structure
- ✅ Modern CSS with inline styles

## Need a Custom Domain?

After deploying, you can connect a custom domain:

1. **Buy a domain** from Namecheap, Google Domains, Cloudflare, etc.
2. **Point DNS** to your hosting provider
3. **Enable HTTPS** (usually automatic with Netlify/Vercel/Cloudflare)

Most hosting providers have guides for connecting custom domains.

---

Built with Nimbus ✨
`;
}

export default downloadZip;
