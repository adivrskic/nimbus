import { OPTIONS } from "../configs/options.config";

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

const getRandomItems = (arr, count = 1) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

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

const isMultiPage = (template) => {
  return [
    "Multi Page",
    "Documentation",
    "Blog",
    "E-commerce",
    "Web App",
  ].includes(template);
};

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

  let note = "";
  if (IMPLEMENTATION_NOTES[key]?.[value]) {
    note = ` (${IMPLEMENTATION_NOTES[key][value]})`;
  }

  return `- ${label}: ${text}${note}`;
};

export function buildFullPrompt(
  userPrompt,
  selections,
  persistentOptions = {}
) {
  const s = selections;
  const template = s.template || "Landing Page";
  const multiPage = isMultiPage(template);
  const pageStructure = MULTI_PAGE_STRUCTURES[template];

  const creativeBooster = getRandomItems(CREATIVE_BOOSTERS, 2);
  const layoutBooster = getRandomItems(LAYOUT_VARIATIONS, 1);
  const typographyBooster = getRandomItems(TYPOGRAPHY_VARIATIONS, 1);

  const templateText = getPromptText("template", selections);
  const templateLine = templateText ? `a ${templateText}` : "a";

  const structureSpecs = [
    addLine("Navigation", "navigation", s),
    addLine("Layout", "layout", s),
    addLine("Content Flow", "contentFlow", s),
    addLine("Visual Hierarchy", "hierarchy", s),
    addLine("Density/Spacing", "density", s),
  ].filter(Boolean);

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

  const typographySpecs = [
    addLine("Font Family", "font", s),
    addLine("Typography Scale", "typographyScale", s),
    addLine("Heading Style", "headingStyle", s),
  ].filter(Boolean);

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

  const effectsSpecs = [
    addLine("Animation Level", "animation", s),
    addLine("Interaction Style", "interaction", s),
    addLine("Scroll Behavior", "scrollBehavior", s),
    addLine("Loading Style", "loadingStyle", s),
  ].filter(Boolean);

  const spacingSpecs = [
    addLine("Spacing Scale", "spacingScale", s),
    addLine("Divider Style", "dividerStyle", s),
    addLine("Border Width", "borderWidth", s),
  ].filter(Boolean);

  const mediaSpecs = [
    addLine("Images", "images", s),
    addLine("Media Handling", "mediaHandling", s),
    addLine("Code Block Style", "codeBlockStyle", s),
  ].filter(Boolean);

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

  const techSpecs = [
    addLine("CSS Framework", "framework", s),
    addLine("Accessibility Level", "accessibility", s),
    addLine("SEO Level", "seoLevel", s),
    addLine("Performance Level", "performanceLevel", s),
    addLine("Mobile Menu Style", "mobileMenu", s),
    addLine("Responsive Approach", "responsiveApproach", s),
  ].filter(Boolean);

  const featureSpecs = [
    addLine("Dark Mode Toggle", "darkModeToggle", s),
    addLine("Cookie Banner", "cookieBanner", s),
    addLine("Social Sharing", "socialSharing", s),
  ].filter(Boolean);

  const creativityLevel = s.creativity || "Balanced";

  let promptParts = [];

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

  const persistentParts = buildPersistentContentParts(persistentOptions);
  if (persistentParts.length > 0) {
    promptParts.push("", "BRAND & CONTENT:", ...persistentParts);
  }

  promptParts.push(
    "",
    "🎨 CREATIVE DIRECTION (IMPORTANT):",
    ...creativeBooster.map((b) => `- ${b}`),
    ...layoutBooster.map((b) => `- ${b}`),
    ...typographyBooster.map((b) => `- ${b}`)
  );

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

  const functionalLinksRequirements = buildFunctionalLinksRequirements(
    persistentOptions,
    multiPage
  );

  if (multiPage) {
    promptParts.push(
      "",
      `OUTPUT REQUIREMENTS:
1. Return COMPLETE HTML files for each page with embedded CSS and JavaScript
2. Use consistent mobile responsive styling, navigation, and branding across ALL pages
3. Include working navigation links between pages
4. Each page must be fully responsive (mobile, tablet, desktop)
5. Use semantic HTML5 elements throughout
6. Include proper meta tags on each page
7. Make each page visually polished and production-ready
8. Separate each file with: <!-- ========== FILE: filename.html ========== -->

Use placeholder images from https://picsum.photos/[width]/[height]
Use Google Fonts for typography

${functionalLinksRequirements}

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

${functionalLinksRequirements}

Return ONLY the HTML code, no explanations.`
    );
  }

  return promptParts.join("\n");
}

function buildFunctionalLinksRequirements(persistentOptions, multiPage) {
  const requirements = ["", "⚠️ CRITICAL - ALL LINKS MUST BE FUNCTIONAL:"];

  if (multiPage) {
    requirements.push(
      "- Navigation: Use actual page filenames (about.html, services.html, contact.html, etc.)",
      "- All nav links must point to real pages in the site"
    );
  } else {
    requirements.push(
      "- Navigation: Use anchor links (#section-id) that scroll to the corresponding section",
      "- Every nav item MUST have a matching section with that ID",
      "- Add smooth scrolling behavior with scroll-behavior: smooth on html/body"
    );
  }

  const hasEmail = persistentOptions?.contactInfo?.email?.trim();
  const hasPhone = persistentOptions?.contactInfo?.phone?.trim();
  const hasFormEndpoint =
    persistentOptions?.contactInfo?.contactFormEndpoint?.trim();

  if (hasEmail || hasPhone || hasFormEndpoint) {
    requirements.push("", "Contact Links:");

    if (hasEmail) {
      requirements.push(
        `- Email: Use mailto:${persistentOptions.contactInfo.email} for ALL email links`,
        `- Display email as clickable link: <a href="mailto:${persistentOptions.contactInfo.email}">${persistentOptions.contactInfo.email}</a>`
      );
    } else {
      requirements.push(
        '- Email: If showing email, use mailto: protocol (e.g., <a href="mailto:contact@example.com">)'
      );
    }

    if (hasPhone) {
      const cleanPhone = persistentOptions.contactInfo.phone.replace(
        /[\s\-\(\)\.]/g,
        ""
      );
      requirements.push(
        `- Phone: Use tel:${cleanPhone} for ALL phone links`,
        `- Display phone as clickable link: <a href="tel:${cleanPhone}">${persistentOptions.contactInfo.phone}</a>`
      );
    } else {
      requirements.push(
        '- Phone: If showing phone, use tel: protocol (e.g., <a href="tel:+1234567890">)'
      );
    }

    if (hasFormEndpoint) {
      requirements.push(
        `- Form: Set form action="${persistentOptions.contactInfo.contactFormEndpoint}" method="POST"`,
        "- Include proper name attributes on all form inputs"
      );
    } else if (hasEmail) {
      requirements.push(
        `- Form: Use action="mailto:${persistentOptions.contactInfo.email}" method="POST" enctype="text/plain"`,
        '- Or use formsubmit.co: action="https://formsubmit.co/${persistentOptions.contactInfo.email}"'
      );
    }
  } else {
    requirements.push(
      "",
      "Contact Links (use proper protocols):",
      '- Email links: <a href="mailto:email@example.com">',
      '- Phone links: <a href="tel:+1234567890">',
      "- Forms: Include action attribute pointing to form handler or mailto:"
    );
  }

  const socialMedia = persistentOptions?.socialMedia;
  const hasSocialLinks =
    socialMedia && Object.values(socialMedia).some((url) => url?.trim());

  if (hasSocialLinks) {
    requirements.push("", "Social Media Links (USE THESE EXACT URLs):");

    const socialPlatforms = {
      twitter: "Twitter/X",
      facebook: "Facebook",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      tiktok: "TikTok",
      github: "GitHub",
      discord: "Discord",
      pinterest: "Pinterest",
      threads: "Threads",
    };

    Object.entries(socialMedia).forEach(([platform, url]) => {
      if (url?.trim()) {
        const platformName = socialPlatforms[platform] || platform;
        requirements.push(
          `- ${platformName}: <a href="${url}" target="_blank" rel="noopener noreferrer">`
        );
      }
    });

    requirements.push(
      '- All social links MUST open in new tab (target="_blank")',
      '- Include rel="noopener noreferrer" for security'
    );
  } else {
    requirements.push(
      "",
      "Social Media Links:",
      "- Use # as placeholder href if no real URL provided",
      '- Add target="_blank" rel="noopener noreferrer" for external links'
    );
  }

  const links = persistentOptions?.links;
  const hasOtherLinks =
    links && Object.values(links).some((url) => url?.trim());

  if (hasOtherLinks) {
    requirements.push("", "Additional Links (USE THESE EXACT URLs):");

    Object.entries(links).forEach(([linkType, url]) => {
      if (url?.trim()) {
        requirements.push(`- ${linkType}: href="${url}"`);
      }
    });
  }

  requirements.push(
    "",
    "General Link Rules:",
    "- NO dead links - every <a> tag must have a valid href",
    '- NO href="#" unless it\'s a placeholder with click handler',
    '- External links: target="_blank" rel="noopener noreferrer"',
    "- Internal links: Use relative paths or anchor IDs",
    "- Buttons that look like links should be actual <a> tags when navigating",
    "- CTA buttons should link to contact section (#contact) or contact page"
  );

  return requirements.join("\n");
}

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

  if (
    persistentOptions.branding?.brandName ||
    persistentOptions.branding?.tagline ||
    persistentOptions.branding?.logoUrl
  ) {
    persistentParts.push("Brand Identity:");
    if (persistentOptions.branding.brandName)
      persistentParts.push(
        `- Brand Name: "${persistentOptions.branding.brandName}" - use this exact name throughout`
      );
    if (persistentOptions.branding.tagline)
      persistentParts.push(
        `- Tagline: "${persistentOptions.branding.tagline}" - use in hero or header`
      );
    if (persistentOptions.branding.logoUrl)
      persistentParts.push(`- Logo URL: ${persistentOptions.branding.logoUrl}`);
  }

  if (
    persistentOptions.business?.description ||
    persistentOptions.business?.location ||
    persistentOptions.business?.yearEstablished
  ) {
    persistentParts.push("", "Business Information:");

    if (persistentOptions.business.description?.trim())
      persistentParts.push(
        `- Description: "${persistentOptions.business.description}" - use to inform copy and messaging`
      );
    if (persistentOptions.business.location?.trim())
      persistentParts.push(
        `- Location: ${persistentOptions.business.location} - can use in footer or contact section`
      );
    if (persistentOptions.business.yearEstablished?.trim())
      persistentParts.push(
        `- Established: ${persistentOptions.business.yearEstablished} - can use "Since ${persistentOptions.business.yearEstablished}" for credibility`
      );
  }

  if (persistentOptions.contactInfo) {
    const contactInfo = [];
    if (persistentOptions.contactInfo.email?.trim())
      contactInfo.push(
        `- Email: ${persistentOptions.contactInfo.email} (use mailto: link)`
      );
    if (persistentOptions.contactInfo.phone?.trim())
      contactInfo.push(
        `- Phone: ${persistentOptions.contactInfo.phone} (use tel: link)`
      );
    if (persistentOptions.contactInfo.address?.trim())
      contactInfo.push(`- Address: ${persistentOptions.contactInfo.address}`);
    if (persistentOptions.contactInfo.contactFormEndpoint?.trim())
      contactInfo.push(
        `- Form Endpoint: ${persistentOptions.contactInfo.contactFormEndpoint} (use as form action)`
      );

    if (contactInfo.length > 0) {
      persistentParts.push(
        "",
        "Contact (MAKE THESE CLICKABLE):",
        ...contactInfo
      );
    }
  }

  if (persistentOptions.socialMedia) {
    const socialLinks = Object.entries(persistentOptions.socialMedia)
      .filter(([_, url]) => url && url.trim())
      .map(([platform, url]) => `- ${platform}: ${url}`);

    if (socialLinks.length > 0) {
      persistentParts.push(
        "",
        "Social Media (USE THESE EXACT URLs):",
        ...socialLinks
      );
    }
  }

  if (
    persistentOptions.content?.primaryCta ||
    persistentOptions.content?.copyrightText
  ) {
    persistentParts.push("", "Content Preferences:");

    if (persistentOptions.content.primaryCta?.trim())
      persistentParts.push(
        `- Primary CTA: Use "${persistentOptions.content.primaryCta}" as the main call-to-action button text`
      );
    if (persistentOptions.content.copyrightText?.trim())
      persistentParts.push(
        `- Footer Copyright: ${persistentOptions.content.copyrightText}`
      );
  }

  if (persistentOptions.links) {
    const links = Object.entries(persistentOptions.links)
      .filter(([_, url]) => url && url.trim())
      .map(([linkType, url]) => `- ${linkType}: ${url}`);

    if (links.length > 0) {
      persistentParts.push("", "Links (USE THESE EXACT URLs):", ...links);
    }
  }

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

export function isMultiPageTemplate(template) {
  return isMultiPage(template);
}

export function getMultiPageStructure(template) {
  return MULTI_PAGE_STRUCTURES[template] || null;
}

export default buildFullPrompt;
