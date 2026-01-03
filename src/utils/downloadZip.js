// utils/downloadZip.js - With multi-page support
import JSZip from "jszip";

/**
 * Generate and download a ZIP file with HTML and README
 * @param {string} htmlContent - The generated HTML (for single page)
 * @param {string} projectName - Name for the project
 * @param {Object} files - Optional files object for multi-page sites { "index.html": "...", "about.html": "..." }
 */
export async function downloadZip(
  htmlContent,
  projectName = "website",
  files = null
) {
  if (!htmlContent && !files) return;

  const zip = new JSZip();
  const isMultiPage = files && Object.keys(files).length > 1;

  if (isMultiPage) {
    // Add all HTML files for multi-page sites
    Object.entries(files).forEach(([filename, content]) => {
      zip.file(filename, content);
    });
  } else if (files && files["index.html"]) {
    // Single file in files object
    zip.file("index.html", files["index.html"]);
  } else {
    // Single HTML string
    zip.file("index.html", htmlContent);
  }

  // Add README with deployment instructions
  const fileList = isMultiPage ? Object.keys(files) : ["index.html"];
  const readme = generateReadme(projectName, fileList, isMultiPage);
  zip.file("README.md", readme);

  // Create images folder with a placeholder
  const imagesFolder = zip.folder("images");
  imagesFolder.file(".gitkeep", "# Place your images here\n");

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
function generateReadme(
  projectName,
  fileList = ["index.html"],
  isMultiPage = false
) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fileStructure = fileList.map((f) => `├── ${f}`).join("\n");

  return `# ${projectName}

Generated on ${date}

## Quick Start

### View Locally
${
  isMultiPage
    ? "Open `index.html` in your web browser. Navigate between pages using the site's navigation."
    : "Simply open `index.html` in your web browser. No server required!"
}

${
  isMultiPage
    ? `
### Local Development Server (Optional)
For best results with multi-page navigation, use a local server:

**Using Python:**
\`\`\`bash
python -m http.server 8000
\`\`\`

**Using Node.js:**
\`\`\`bash
npx serve .
\`\`\`

Then open \`http://localhost:8000\` in your browser.
`
    : ""
}

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
${fileStructure}
├── images/         # Add your images here
└── README.md       # This file
\`\`\`

${
  isMultiPage
    ? `
## Pages

This is a multi-page website with the following pages:
${fileList.map((f) => `- **${f}** - ${getPageDescription(f)}`).join("\n")}
`
    : ""
}

## Customization Tips

### Replace Placeholder Images
The website uses placeholder images from picsum.photos. Replace them with your own:

1. Add your images to the \`images/\` folder
2. Update the \`src\` attributes in the HTML files:
   \`\`\`html
   <!-- Before -->
   <img src="https://picsum.photos/800/600" alt="...">
   
   <!-- After -->
   <img src="images/your-image.jpg" alt="...">
   \`\`\`

### Change Colors
Look for inline style attributes with color values:
\`\`\`html
style="background: #667eea;"
style="color: #1a1a2e;"
\`\`\`

### Edit Content
All text content is in the HTML files. Search for the text you want to change and edit directly.

## Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ No external dependencies (except fonts)
- ✅ Fast loading with inline styles
- ✅ SEO-friendly HTML structure
- ✅ Accessible navigation
${isMultiPage ? "- ✅ Consistent navigation across pages" : ""}

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

/**
 * Get description for a page based on filename
 */
function getPageDescription(filename) {
  const descriptions = {
    "index.html": "Home page",
    "about.html": "About page",
    "services.html": "Services page",
    "contact.html": "Contact page",
    "products.html": "Products listing",
    "product-detail.html": "Product detail template",
    "cart.html": "Shopping cart",
    "blog.html": "Blog listing",
    "post.html": "Blog post template",
    "dashboard.html": "Dashboard",
    "settings.html": "Settings page",
    "getting-started.html": "Getting started guide",
    "api-reference.html": "API reference",
    "examples.html": "Examples page",
  };
  return descriptions[filename] || "Page";
}

export default downloadZip;
