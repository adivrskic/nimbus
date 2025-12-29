// utils/promptBuilder.js - Build full generation prompt from selections
import { OPTIONS } from "../configs/options.config";

/**
 * Get the prompt text for a selection key
 * @param {string} key - The option key
 * @param {Object} selections - Current selections state
 * @returns {string|null} The prompt text or null
 */
const getPromptText = (key, selections) => {
  const opt = OPTIONS[key];
  if (!opt) return null;

  if (opt.multi) {
    if (!selections[key] || selections[key].length === 0) return null;
    return selections[key]
      .map((val) => {
        const choice = opt.choices.find((c) => c.value === val);
        return choice?.prompt || val;
      })
      .join(", ");
  }

  if (selections[key] === null || selections[key] === undefined) return null;
  const choice = opt.choices?.find((c) => c.value === selections[key]);
  return choice?.prompt || selections[key];
};

/**
 * Create a labeled line for the prompt
 * @param {string} label - The label
 * @param {string} key - The option key
 * @param {Object} selections - Current selections state
 * @returns {string|null} Formatted line or null
 */
const addLine = (label, key, selections) => {
  const text = getPromptText(key, selections);
  return text ? `- ${label}: ${text}` : null;
};

/**
 * Build the full prompt from user input and selections
 * @param {string} userPrompt - User's description input
 * @param {Object} selections - Current selections state
 * @param {Object} persistentOptions - Brand/contact info
 * @returns {string} Complete prompt for AI generation
 */
export function buildFullPrompt(userPrompt, selections, persistentOptions = {}) {
  const s = selections;

  const templateText = getPromptText("template", selections);
  const templateLine = templateText ? `a ${templateText}` : "a";

  const designSpecs = [
    addLine("Style", "style", s),
    addLine("Colors", "palette", s),
    s.palette === "Custom" && s.customColors
      ? `- Custom Colors: primary ${s.customColors.primary}, secondary ${s.customColors.secondary}, accent ${s.customColors.accent}, background ${s.customColors.background}, text ${s.customColors.text}`
      : null,
    addLine("Mode", "mode", s),
    addLine("Typography", "font", s),
    addLine("Corners", "corners", s),
    addLine("Spacing", "density", s),
    addLine("Layout", "layout", s),
    addLine("Inspiration", "inspiration", s),
  ].filter(Boolean);

  const contentSpecs = [
    addLine("Brand Voice", "tone", s),
    addLine("Copy Length", "copyLength", s),
    addLine("CTA Style", "cta", s),
    addLine("Primary Goal", "goal", s),
    addLine("Industry", "industry", s),
    addLine("Target Audience", "audience", s),
  ].filter(Boolean);

  const sectionsText =
    s.sections && s.sections.length > 0
      ? s.sections
          .map(
            (sec) =>
              `- ${
                OPTIONS.sections.choices.find((c) => c.value === sec)?.prompt ||
                sec
              }`
          )
          .join("\n")
      : null;

  const stickyText =
    s.stickyElements && s.stickyElements.length > 0
      ? s.stickyElements
          .map(
            (el) =>
              `- ${
                OPTIONS.stickyElements.choices.find((c) => c.value === el)
                  ?.prompt || el
              }`
          )
          .join("\n")
      : null;

  const visualSpecs = [
    addLine("Images", "images", s),
    addLine("Animations", "animation", s),
    addLine("Social Proof", "socialProof", s),
  ].filter(Boolean);

  const techSpecs = [
    addLine("CSS", "framework", s),
    addLine("Accessibility", "accessibility", s),
  ].filter(Boolean);

  const creativityText = getPromptText("creativity", selections);

  let promptParts = [
    `Create ${templateLine} website.`,
    "",
    `USER DESCRIPTION: ${userPrompt}`,
  ];

  // Add persistent content if available
  const persistentParts = buildPersistentContentParts(persistentOptions);
  if (persistentParts.length > 0) {
    promptParts.push("", "PERSISTENT CONTENT:", ...persistentParts);
  }

  // Continue with existing specs
  if (designSpecs.length > 0)
    promptParts.push("", "DESIGN SPECIFICATIONS:", ...designSpecs);
  if (contentSpecs.length > 0)
    promptParts.push("", "CONTENT & BRAND:", ...contentSpecs);
  if (sectionsText)
    promptParts.push("", "PAGE SECTIONS (in this order):", sectionsText);
  if (visualSpecs.length > 0)
    promptParts.push("", "VISUAL ELEMENTS:", ...visualSpecs);
  if (stickyText) promptParts.push("", "UI ELEMENTS:", stickyText);
  if (techSpecs.length > 0) promptParts.push("", "TECHNICAL:", ...techSpecs);
  if (creativityText)
    promptParts.push(
      "",
      "CREATIVE DIRECTION:",
      `- Creativity Level: ${creativityText}`
    );

  promptParts.push(
    "",
    `REQUIREMENTS:
1. Return a complete, production-ready HTML file with embedded CSS and JavaScript
2. Must be fully responsive (mobile, tablet, desktop)
3. Use semantic HTML5 elements
4. Include proper meta tags
5. Apply the design specifications consistently
6. Make it visually polished and professional

Return ONLY the HTML code, no explanations.`
  );

  return promptParts.join("\n");
}

/**
 * Build persistent content parts for the prompt
 * @param {Object} persistentOptions - Brand/contact info
 * @returns {string[]} Array of prompt parts
 */
function buildPersistentContentParts(persistentOptions) {
  if (!persistentOptions) return [];

  const hasPersistentContent = Object.values(persistentOptions).some(
    (section) =>
      typeof section === "object"
        ? Object.values(section).some(
            (value) =>
              value &&
              (Array.isArray(value)
                ? value.length > 0
                : typeof value === "string"
                ? value.trim().length > 0
                : false)
          )
        : Array.isArray(section)
        ? section.length > 0
        : section
  );

  if (!hasPersistentContent) return [];

  const persistentParts = [];

  // Branding
  if (
    persistentOptions.branding?.brandName ||
    persistentOptions.branding?.tagline ||
    persistentOptions.branding?.logoUrl
  ) {
    persistentParts.push("", "BRANDING:");
    if (persistentOptions.branding.brandName)
      persistentParts.push(
        `- Brand Name: ${persistentOptions.branding.brandName}`
      );
    if (persistentOptions.branding.tagline)
      persistentParts.push(`- Tagline: ${persistentOptions.branding.tagline}`);
    if (persistentOptions.branding.logoUrl)
      persistentParts.push(`- Logo URL: ${persistentOptions.branding.logoUrl}`);
  }

  // Social Media
  if (persistentOptions.socialMedia) {
    const socialLinks = Object.entries(persistentOptions.socialMedia)
      .filter(([_, url]) => url && url.trim())
      .map(([platform, url]) => `- ${platform}: ${url}`);

    if (socialLinks.length > 0) {
      persistentParts.push("", "SOCIAL MEDIA LINKS:", ...socialLinks);
    }
  }

  // Contact Info
  if (persistentOptions.contactInfo) {
    const contactInfo = [];
    if (persistentOptions.contactInfo.email?.trim())
      contactInfo.push(`- Email: ${persistentOptions.contactInfo.email}`);
    if (persistentOptions.contactInfo.phone?.trim())
      contactInfo.push(`- Phone: ${persistentOptions.contactInfo.phone}`);
    if (persistentOptions.contactInfo.contactFormEndpoint?.trim())
      contactInfo.push(
        `- Form Endpoint: ${persistentOptions.contactInfo.contactFormEndpoint}`
      );

    if (contactInfo.length > 0) {
      persistentParts.push("", "CONTACT INFORMATION:", ...contactInfo);
    }
  }

  // Important Links
  if (persistentOptions.links) {
    const links = Object.entries(persistentOptions.links)
      .filter(([_, url]) => url && url.trim())
      .map(([linkType, url]) => `- ${linkType}: ${url}`);

    if (links.length > 0) {
      persistentParts.push("", "IMPORTANT LINKS:", ...links);
    }
  }

  // Images
  if (persistentOptions.images?.length > 0) {
    persistentParts.push("", "IMAGES:");
    persistentOptions.images.forEach((img, i) => {
      persistentParts.push(`- Image ${i + 1}: ${img.alt || "Uploaded image"}`);
    });
  }

  return persistentParts;
}

export default buildFullPrompt;
