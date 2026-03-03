export const CATEGORIES = [
  "template",
  "navigation",
  "layout",
  "sections",
  "contentFlow",
  "hierarchy",
  "density",

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

  "font",
  "typographyScale",
  "headingStyle",

  "tone",
  "copyLength",
  "brandPersonality",
  "microCopy",
  "cta",
  "goal",
  "industry",
  "audience",

  "animation",
  "interaction",
  "scrollBehavior",
  "loadingStyle",

  "spacingScale",
  "borderWidth",

  "images",
  "mediaHandling",
  "codeBlockStyle",

  "accessibility",
  "seoLevel",
  "performanceLevel",
  "responsiveApproach",
  "mobileMenu",

  "darkModeToggle",
  "cookieBanner",
  "socialSharing",
  "stickyElements",

  "creativity",

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
