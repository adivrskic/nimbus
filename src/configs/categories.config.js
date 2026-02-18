export const CATEGORIES = [
  // Structure & Layout
  "template",
  "navigation",
  "layout",
  "sections",
  "contentFlow",
  "hierarchy",
  "density",

  // Visual Style
  "style",
  "inspiration",
  "palette",
  "customColors",
  "mode",
  "gradientStyle",
  "backgroundPattern",
  "corners",
  "shadowStyle",
  "hoverEffects",
  "emojis",

  // Typography
  "font",
  "typographyScale",
  "headingStyle",

  // Content & Copy
  "tone",
  "copyLength",
  "brandPersonality",
  "microCopy",
  "cta",
  "goal",
  "industry",
  "audience",

  // Effects & Motion
  "animation",
  "interaction",
  "scrollBehavior",
  "loadingStyle",

  // Spacing & Borders
  "spacingScale",
  "borderWidth",

  // Media
  "images",
  "mediaHandling",
  "codeBlockStyle",

  // Technical
  "accessibility",
  "seoLevel",
  "performanceLevel",
  "responsiveApproach",
  "mobileMenu",

  // Features
  "darkModeToggle",
  "cookieBanner",
  "socialSharing",
  "stickyElements",

  // AI Controls
  "creativity",

  // Persistent / Brand Assets
  "persistent",
];

export const CATEGORY_GROUPS = {
  layout: [
    "template",
    "navigation",
    "layout",
    "sections",
    "contentFlow",
    "hierarchy",
    "density",
    "heroStyle",
    "footerStyle",
  ],
  visual: [
    "style",
    "inspiration",
    "palette",
    "mode",
    "gradientStyle",
    "backgroundPattern",
    "corners",
    "hoverEffects",
    "animation",
    "emojis",
  ],
  content: [
    "tone",
    "copyLength",
    "brandPersonality",
    "microCopy",
    "cta",
    "goal",
    "industry",
    "audience",
    "socialProof",
  ],
  technical: [
    "accessibility",
    "seoLevel",
    "performanceLevel",
    "responsiveApproach",
    "mobileMenu",
    "darkModeToggle",
    "cookieBanner",
  ],
};

export const getFilteredCategories = (filter) => {
  const baseCategories = CATEGORIES.filter(
    (cat) => cat !== "persistent" && cat !== "customColors"
  );

  if (!filter) return baseCategories;

  return baseCategories.filter((cat) => CATEGORY_GROUPS[filter]?.includes(cat));
};

export default CATEGORIES;
