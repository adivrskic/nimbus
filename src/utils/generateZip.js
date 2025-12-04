// utils/generateZip.js
import JSZip from "jszip";
import { renderTemplate } from "../utils/templateSystem";
import {
  extractImageUrls,
  fetchImageAsBlob,
  convertUrlsToRelativePaths,
  isImageUrl,
} from "../utils/imageUtils";

/**
 * Generate a ZIP file with the template HTML and all images
 * @param {string} templateId - Template ID
 * @param {Object} customization - Customization data
 * @param {string} theme - Theme ID
 * @param {string} colorMode - Color mode (auto/light/dark)
 * @param {Object} options - Additional options
 * @returns {Promise<Blob>} - ZIP file blob
 */
export async function generateZip(
  templateId,
  customization,
  theme = "minimal",
  colorMode = "auto",
  options = {}
) {
  const {
    includeImages = true,
    onProgress = null,
    maxImageSize = 5 * 1024 * 1024, // 5MB
  } = options;

  const zip = new JSZip();
  const imagesFolder = zip.folder("images");

  const normalizedColorMode = (colorMode || "auto").toLowerCase();

  // Track URL to local path mapping for HTML replacement
  const urlToPathMap = new Map();
  const failedImages = [];

  // Extract and download images if enabled
  if (includeImages) {
    const imageUrls = extractImageUrls(customization);
    const totalImages = imageUrls.length;

    if (onProgress) {
      onProgress({ phase: "images", current: 0, total: totalImages });
    }

    for (let i = 0; i < imageUrls.length; i++) {
      const { fieldPath, url } = imageUrls[i];

      try {
        // Skip if not a valid image URL or if it's a data URL
        if (!url || url.startsWith("data:") || !isImageUrl(url)) {
          continue;
        }

        const imageData = await fetchImageAsBlob(url);

        if (imageData && imageData.blob.size <= maxImageSize) {
          // Generate filename from URL or field path
          const filename = generateImageFilename(url, fieldPath, i);
          const localPath = `images/${filename}`;

          // Add to ZIP
          imagesFolder.file(filename, imageData.blob);

          // Map URL to local path for HTML replacement
          urlToPathMap.set(url, localPath);
        } else if (imageData && imageData.blob.size > maxImageSize) {
          failedImages.push({ url, reason: "File too large" });
        }
      } catch (error) {
        console.warn(`Failed to fetch image: ${url}`, error);
        failedImages.push({ url, reason: error.message });
      }

      if (onProgress) {
        onProgress({ phase: "images", current: i + 1, total: totalImages });
      }
    }
  }

  if (onProgress) {
    onProgress({ phase: "html", current: 0, total: 1 });
  }

  // Create modified customization with local paths for images that were downloaded
  let modifiedCustomization = customization;
  if (urlToPathMap.size > 0) {
    modifiedCustomization = convertUrlsToRelativePaths(
      customization,
      urlToPathMap
    );
  }

  // Generate HTML with modified image paths
  let html = renderTemplate(
    templateId,
    modifiedCustomization,
    theme,
    normalizedColorMode
  );

  // Also replace URLs directly in the HTML (for any hardcoded URLs)
  for (const [originalUrl, localPath] of urlToPathMap) {
    html = html.replace(new RegExp(escapeRegExp(originalUrl), "g"), localPath);
  }

  zip.file("index.html", html);

  if (onProgress) {
    onProgress({ phase: "html", current: 1, total: 1 });
  }

  // Generate README
  const readme = generateReadme(templateId, customization, theme, {
    imageCount: urlToPathMap.size,
    failedImages,
  });
  zip.file("README.md", readme);

  // Generate manifest for reference
  const manifest = {
    templateId,
    theme,
    colorMode: normalizedColorMode,
    generatedAt: new Date().toISOString(),
    images: {
      included: urlToPathMap.size,
      failed: failedImages.length,
      failedUrls: failedImages,
    },
  };
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  if (onProgress) {
    onProgress({ phase: "complete", current: 1, total: 1 });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}

/**
 * Generate a filename for an image
 * @param {string} url - Original URL
 * @param {string} fieldPath - Field path in customization
 * @param {number} index - Index for uniqueness
 * @returns {string} - Generated filename
 */
function generateImageFilename(url, fieldPath, index) {
  // Try to extract extension from URL
  const urlPath = new URL(url).pathname;
  const urlExt = urlPath.split(".").pop()?.toLowerCase();
  const validExts = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const ext = validExts.includes(urlExt) ? urlExt : "jpg";

  // Create clean filename from field path
  const cleanPath = fieldPath
    .replace(/[\[\]\.]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return `${cleanPath}_${index}.${ext}`;
}

/**
 * Escape special regex characters
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Generate README content
 * @param {string} templateId - Template ID
 * @param {Object} customization - Customization data
 * @param {string} theme - Theme ID
 * @param {Object} imageInfo - Image download info
 * @returns {string} - README content
 */
function generateReadme(templateId, customization, theme, imageInfo = {}) {
  const { imageCount = 0, failedImages = [] } = imageInfo;

  let imageSection = "";
  if (imageCount > 0) {
    imageSection = `
### Images

This package includes ${imageCount} image(s) in the \`images/\` folder. The HTML has been updated to reference these local images.
`;
  }

  if (failedImages.length > 0) {
    imageSection += `
**Note:** ${
      failedImages.length
    } image(s) could not be downloaded and will still reference their original URLs:
${failedImages.map((img) => `- ${img.url} (${img.reason})`).join("\n")}

These images may not display if the external URLs become unavailable.
`;
  }

  return `# ${
    customization.name || customization.photographerName || "Your"
  } Website

## Template Details
- Template: ${templateId}
- Style Theme: ${theme}
- Generated: ${new Date().toLocaleDateString()}
${imageSection}
## Quick Start

### View Locally
1. Open \`index.html\` in your web browser
2. **No server required** - works directly from your computer

### File Structure
\`\`\`
├── index.html      # Your website
├── images/         # Downloaded images
├── manifest.json   # Build information
└── README.md       # This file
\`\`\`

### Deploy Online
Upload all files (including the images folder) to your web hosting service

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

Generated with ❤️ by Nimbus Template Builder
`;
}

export default generateZip;
