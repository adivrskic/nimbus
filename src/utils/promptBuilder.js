// utils/promptBuilder.js - Build full generation prompt from selections
// This should produce prompts that align with the edge function's system prompt
import { OPTIONS } from "../configs/options.config";

/**
 * Creative variation prompts - randomly selected to encourage unique outputs
 */
const CREATIVE_BOOSTERS = [
  "Avoid generic layouts - create something memorable that stands out from typical templates.",
  "Add at least one unexpected design element that creates visual interest.",
  "Think like a senior designer at a top agency - every detail should feel intentional.",
  "Imagine this is for a design awards submission - make bold, confident choices.",
  "Create visual rhythm through varied section heights or unexpected spacing.",
  "Add personality through micro-details: unique hover states, clever transitions, subtle patterns.",
  "Break one design 'rule' intentionally for creative effect.",
  "Design as if this client is paying premium rates - every pixel should earn its place.",
];

const LAYOUT_VARIATIONS = [
  "Use varied section heights - not everything needs to be the same size.",
  "Consider asymmetric layouts where appropriate - perfect symmetry can feel sterile.",
  "Mix full-width and contained sections for visual rhythm.",
  "Vary the visual weight across sections - create peaks and valleys of intensity.",
];

const TYPOGRAPHY_VARIATIONS = [
  "Use font weight and size contrast to create clear hierarchy.",
  "Make headlines genuinely impactful - don't be afraid of large type.",
];

/**
 * Get random items from an array
 */
const getRandomItems = (arr, count = 1) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Multi-page template definitions
 */
const MULTI_PAGE_STRUCTURES = {
  "Multi Page": {
    pages: ["index.html", "about.html", "services.html", "contact.html"],
    note: "Create a cohesive multi-page site with consistent navigation. Each page should feel connected but serve its unique purpose.",
  },
  Documentation: {
    pages: [
      "index.html",
      "getting-started.html",
      "api-reference.html",
      "examples.html",
    ],
    note: "Create documentation with sidebar navigation that persists across pages, search functionality, and code examples.",
  },
  Blog: {
    pages: ["index.html", "post.html", "about.html"],
    note: "Create a blog with article listing on home, a detailed article template, and an about page.",
  },
  "E-commerce": {
    pages: ["index.html", "products.html", "product-detail.html", "cart.html"],
    note: "Create an e-commerce flow with product grids, filtering UI, detailed product pages, and a cart page.",
  },
  "Web App": {
    pages: ["index.html", "dashboard.html", "settings.html"],
    note: "Create an app-like interface with a landing page, dashboard with panels/widgets, and settings page.",
  },
};

/**
 * Check if template requires multi-page output
 */
const isMultiPage = (template) => {
  return [
    "Multi Page",
    "Documentation",
    "Blog",
    "E-commerce",
    "Web App",
  ].includes(template);
};

/**
 * Implementation notes for complex options
 */
const IMPLEMENTATION_NOTES = {
  heroStyle: {
    "Video Background": "Use CSS animated gradient or placeholder video",
    "3D": "Use CSS 3D transforms, not WebGL",
    Interactive: "Use hover effects and simple JS interactions",
    Parallax: "Use CSS transforms with scroll position",
  },
  contactStyle: {
    "Map + Form": "Use static map image or iframe placeholder",
    Calendly: "Style as 'Book a Call' button linking to booking URL",
  },
  formStyle: {
    Stepped: "Create multi-step form with JS to show/hide sections",
  },
  statsStyle: {
    Counters: "Use CSS counter animation or simple JS counting",
  },
  scrollBehavior: {
    Parallax: "Use CSS transform with scroll position",
    Snap: "Use CSS scroll-snap",
  },
};

/**
 * Get the prompt text for a selection key
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
 * Create a labeled line for the prompt with optional implementation note
 */
const addLine = (label, key, selections) => {
  const value = selections[key];
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "None"
  ) {
    return null;
  }

  const text = getPromptText(key, selections) || value;

  // Add implementation note if available
  let note = "";
  if (IMPLEMENTATION_NOTES[key]?.[value]) {
    note = ` (${IMPLEMENTATION_NOTES[key][value]})`;
  }

  return `- ${label}: ${text}${note}`;
};

/**
 * Build the full prompt from user input and selections
 */
export function buildFullPrompt(
  userPrompt,
  selections,
  persistentOptions = {}
) {
  const s = selections;
  const template = s.template || "Landing Page";
  const multiPage = isMultiPage(template);
  const pageStructure = MULTI_PAGE_STRUCTURES[template];

  // Get creative boosters for variation
  const creativeBooster = getRandomItems(CREATIVE_BOOSTERS, 2);
  const layoutBooster = getRandomItems(LAYOUT_VARIATIONS, 1);
  const typographyBooster = getRandomItems(TYPOGRAPHY_VARIATIONS, 1);

  const templateText = getPromptText("template", selections);
  const templateLine = templateText ? `a ${templateText}` : "a";

  // ============================================
  // STRUCTURE & LAYOUT
  // ============================================
  const structureSpecs = [
    addLine("Navigation", "navigation", s),
    addLine("Layout", "layout", s),
    addLine("Content Flow", "contentFlow", s),
    addLine("Visual Hierarchy", "hierarchy", s),
    addLine("Density/Spacing", "density", s),
  ].filter(Boolean);

  // ============================================
  // VISUAL STYLE
  // ============================================
  const visualStyleSpecs = [
    addLine("Style", "style", s),
    addLine("Inspiration", "inspiration", s),
    addLine("Colors", "palette", s),
    s.palette === "Custom" && s.customColors
      ? `- Custom Colors: primary ${s.customColors.primary}, secondary ${s.customColors.secondary}, accent ${s.customColors.accent}, background ${s.customColors.background}, text ${s.customColors.text}`
      : null,
    addLine("Mode", "mode", s),
    addLine("Gradient Style", "gradientStyle", s),
    addLine("Background Pattern", "backgroundPattern", s),
    addLine("Corners", "corners", s),
    addLine("Shadow Style", "shadowStyle", s),
    addLine("Hover Effects", "hoverEffects", s),
  ].filter(Boolean);

  // ============================================
  // TYPOGRAPHY
  // ============================================
  const typographySpecs = [
    addLine("Font Family", "font", s),
    addLine("Typography Scale", "typographyScale", s),
    addLine("Heading Style", "headingStyle", s),
  ].filter(Boolean);

  // ============================================
  // COMPONENTS
  // ============================================
  const componentSpecs = [
    addLine("Hero Style", "heroStyle", s),
    addLine("Button Style", "buttonStyle", s),
    addLine("Card Style", "cardStyle", s),
    addLine("Form Style", "formStyle", s),
    addLine("Icon Style", "iconStyle", s),
    addLine("Tab Style", "tabStyle", s),
    addLine("Accordion Style", "accordionStyle", s),
    addLine("Carousel Style", "carouselStyle", s),
  ].filter(Boolean);

  // ============================================
  // CONTENT BLOCKS
  // ============================================
  const contentBlockSpecs = [
    addLine("Testimonial Style", "testimonialStyle", s),
    addLine("Pricing Style", "pricingStyle", s),
    addLine("Stats Style", "statsStyle", s),
    addLine("Team Style", "teamStyle", s),
    addLine("FAQ Style", "faqStyle", s),
    addLine("Contact Style", "contactStyle", s),
    addLine("Footer Style", "footerStyle", s),
    addLine("CTA Section Style", "ctaSectionStyle", s),
  ].filter(Boolean);

  // ============================================
  // EFFECTS & MOTION
  // ============================================
  const effectsSpecs = [
    addLine("Animation Level", "animation", s),
    addLine("Interaction Style", "interaction", s),
    addLine("Scroll Behavior", "scrollBehavior", s),
    addLine("Loading Style", "loadingStyle", s),
  ].filter(Boolean);

  // ============================================
  // SPACING & BORDERS
  // ============================================
  const spacingSpecs = [
    addLine("Spacing Scale", "spacingScale", s),
    addLine("Divider Style", "dividerStyle", s),
    addLine("Border Width", "borderWidth", s),
  ].filter(Boolean);

  // ============================================
  // MEDIA
  // ============================================
  const mediaSpecs = [
    addLine("Images", "images", s),
    addLine("Media Handling", "mediaHandling", s),
    addLine("Code Block Style", "codeBlockStyle", s),
  ].filter(Boolean);

  // ============================================
  // CONTENT & BRAND
  // ============================================
  const contentSpecs = [
    addLine("Brand Voice/Tone", "tone", s),
    addLine("Brand Personality", "brandPersonality", s),
    addLine("Copy Length", "copyLength", s),
    addLine("Microcopy Style", "microCopy", s),
    addLine("CTA Style", "cta", s),
    addLine("Primary Goal", "goal", s),
    addLine("Industry", "industry", s),
    addLine("Target Audience", "audience", s),
    addLine("Social Proof", "socialProof", s),
  ].filter(Boolean);

  // ============================================
  // SECTIONS
  // ============================================
  const sectionsText =
    s.sections && s.sections.length > 0
      ? s.sections
          .map(
            (sec) =>
              `- ${
                OPTIONS.sections?.choices?.find((c) => c.value === sec)
                  ?.prompt || sec
              }`
          )
          .join("\n")
      : null;

  // ============================================
  // STICKY/UI ELEMENTS
  // ============================================
  const stickyText =
    s.stickyElements && s.stickyElements.length > 0
      ? s.stickyElements
          .map(
            (el) =>
              `- ${
                OPTIONS.stickyElements?.choices?.find((c) => c.value === el)
                  ?.prompt || el
              }`
          )
          .join("\n")
      : null;

  // ============================================
  // TECHNICAL
  // ============================================
  const techSpecs = [
    addLine("CSS Framework", "framework", s),
    addLine("Accessibility Level", "accessibility", s),
    addLine("SEO Level", "seoLevel", s),
    addLine("Performance Level", "performanceLevel", s),
    addLine("Mobile Menu Style", "mobileMenu", s),
    addLine("Responsive Approach", "responsiveApproach", s),
  ].filter(Boolean);

  // ============================================
  // FEATURES
  // ============================================
  const featureSpecs = [
    addLine("Dark Mode Toggle", "darkModeToggle", s),
    addLine("Cookie Banner", "cookieBanner", s),
    addLine("Social Sharing", "socialSharing", s),
  ].filter(Boolean);

  // ============================================
  // AI CONTROLS
  // ============================================
  const creativityLevel = s.creativity || "Balanced";

  // ============================================
  // BUILD PROMPT
  // ============================================
  let promptParts = [];

  // Multi-page vs single-page intro
  if (multiPage && pageStructure) {
    promptParts.push(
      `Create ${templateLine} website with MULTIPLE HTML FILES.`,
      "",
      `MULTI-PAGE STRUCTURE:`,
      pageStructure.note,
      "",
      `Pages to generate:`,
      ...pageStructure.pages.map((p) => `- ${p}`),
      "",
      `IMPORTANT: Generate ALL pages in your response, clearly separated with:`,
      `<!-- ========== FILE: filename.html ========== -->`,
      ""
    );
  } else {
    promptParts.push(`Create ${templateLine} website.`, "");
  }

  promptParts.push(`USER DESCRIPTION: ${userPrompt}`);

  // Add persistent content if available
  const persistentParts = buildPersistentContentParts(persistentOptions);
  if (persistentParts.length > 0) {
    promptParts.push("", "BRAND & CONTENT:", ...persistentParts);
  }

  // ============================================
  // CREATIVE DIRECTION (Key for unique outputs)
  // ============================================
  promptParts.push(
    "",
    "🎨 CREATIVE DIRECTION (IMPORTANT):",
    ...creativeBooster.map((b) => `- ${b}`),
    ...layoutBooster.map((b) => `- ${b}`),
    ...typographyBooster.map((b) => `- ${b}`)
  );

  // Creativity-level specific guidance
  if (creativityLevel === "Conservative") {
    promptParts.push(
      "- Stay within proven design patterns, but execute them exceptionally well.",
      "- Focus on polish and refinement over experimentation."
    );
  } else if (creativityLevel === "Experimental") {
    promptParts.push(
      "- Push boundaries - try unconventional layouts, unexpected color combinations, or unique interactions.",
      "- Take creative risks that make this site memorable and distinctive."
    );
  } else {
    promptParts.push(
      "- Balance proven patterns with moments of creative flair.",
      "- Add 2-3 unexpected touches that elevate the design above typical templates."
    );
  }

  // Add specification sections
  if (structureSpecs.length > 0) {
    promptParts.push("", "STRUCTURE & LAYOUT:", ...structureSpecs);
  }

  if (visualStyleSpecs.length > 0) {
    promptParts.push("", "VISUAL STYLE:", ...visualStyleSpecs);
  }

  if (typographySpecs.length > 0) {
    promptParts.push("", "TYPOGRAPHY:", ...typographySpecs);
  }

  if (componentSpecs.length > 0) {
    promptParts.push("", "COMPONENT STYLES:", ...componentSpecs);
  }

  if (contentBlockSpecs.length > 0) {
    promptParts.push("", "CONTENT BLOCK STYLES:", ...contentBlockSpecs);
  }

  if (effectsSpecs.length > 0) {
    promptParts.push("", "EFFECTS & MOTION:", ...effectsSpecs);
  }

  if (spacingSpecs.length > 0) {
    promptParts.push("", "SPACING & BORDERS:", ...spacingSpecs);
  }

  if (mediaSpecs.length > 0) {
    promptParts.push("", "MEDIA:", ...mediaSpecs);
  }

  if (contentSpecs.length > 0) {
    promptParts.push("", "CONTENT & BRAND:", ...contentSpecs);
  }

  if (sectionsText) {
    promptParts.push(
      "",
      "PAGE SECTIONS (include in this order):",
      sectionsText
    );
  }

  if (stickyText) {
    promptParts.push("", "STICKY UI ELEMENTS:", stickyText);
  }

  if (featureSpecs.length > 0) {
    promptParts.push("", "FEATURES TO INCLUDE:", ...featureSpecs);
  }

  if (techSpecs.length > 0) {
    promptParts.push("", "TECHNICAL REQUIREMENTS:", ...techSpecs);
  }

  // Final output requirements
  if (multiPage) {
    promptParts.push(
      "",
      `OUTPUT REQUIREMENTS:
1. Return COMPLETE HTML files for each page with embedded CSS and JavaScript
2. Use consistent styling, navigation, and branding across ALL pages
3. Include working navigation links between pages
4. Each page must be fully responsive (mobile, tablet, desktop)
5. Use semantic HTML5 elements throughout
6. Include proper meta tags on each page
7. Make each page visually polished and production-ready
8. Separate each file with: <!-- ========== FILE: filename.html ========== -->

Use placeholder images from https://picsum.photos/[width]/[height]
Use Google Fonts for typography

Return ONLY the HTML code for all pages, no explanations.`
    );
  } else {
    promptParts.push(
      "",
      `OUTPUT REQUIREMENTS:
1. Return a complete, production-ready HTML file with embedded CSS and JavaScript
2. Must be fully responsive (mobile, tablet, desktop)
3. Use semantic HTML5 elements
4. Include proper meta tags
5. Apply ALL design specifications consistently throughout
6. Make it visually polished, unique, and professional - NOT a generic template
7. Add thoughtful details: micro-interactions, subtle animations, refined spacing

Use placeholder images from https://picsum.photos/[width]/[height]
Use Google Fonts for typography

Return ONLY the HTML code, no explanations.`
    );
  }

  return promptParts.join("\n");
}

/**
 * Build persistent content parts for the prompt
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
      persistentParts.push("", "Social Media:", ...socialLinks);
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
      persistentParts.push("", "Contact:", ...contactInfo);
    }
  }

  // Important Links
  if (persistentOptions.links) {
    const links = Object.entries(persistentOptions.links)
      .filter(([_, url]) => url && url.trim())
      .map(([linkType, url]) => `- ${linkType}: ${url}`);

    if (links.length > 0) {
      persistentParts.push("", "Links:", ...links);
    }
  }

  // Images
  if (persistentOptions.images?.length > 0) {
    persistentParts.push("", "Provided Images:");
    persistentOptions.images.forEach((img, i) => {
      persistentParts.push(
        `- Image ${i + 1}: ${img.url || img.alt || "Uploaded image"}`
      );
    });
  }

  return persistentParts;
}

/**
 * Check if the current template selection requires multi-page output
 */
export function isMultiPageTemplate(template) {
  return isMultiPage(template);
}

/**
 * Get page structure for a multi-page template
 */
export function getMultiPageStructure(template) {
  return MULTI_PAGE_STRUCTURES[template] || null;
}

export default buildFullPrompt;
