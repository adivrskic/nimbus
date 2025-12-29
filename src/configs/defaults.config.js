// configs/defaults.config.js - Default values and example prompts

export const EXAMPLE_PROMPTS = [
  "A modern portfolio site for a photographer with a dark theme...",
  "Landing page for an AI startup with gradient backgrounds...",
  "Restaurant website with online menu and reservation form...",
  "Personal blog with minimalist design and reading progress...",
  "SaaS dashboard landing page with pricing comparison...",
  "Creative agency site with bold typography and animations...",
];

export const DEFAULT_PERSISTENT_OPTIONS = {
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedIn: "",
    github: "",
    dribbble: "",
  },
  contactInfo: {
    email: "",
    phone: "",
    address: "",
    contactFormEndpoint: "",
  },
  branding: {
    logoUrl: "",
    faviconUrl: "",
    brandName: "",
    tagline: "",
  },
  images: [], // Array of image URLs or objects
  links: {
    termsOfService: "",
    privacyPolicy: "",
    pricingPage: "",
    blog: "",
  },
};

/**
 * Initialize selections with default values based on OPTIONS
 * @param {Object} OPTIONS - The OPTIONS configuration object
 * @returns {Object} Initial selections state
 */
export const getInitialSelections = (OPTIONS) => {
  const initial = {};
  Object.entries(OPTIONS).forEach(([key, opt]) => {
    if (opt.multi) {
      initial[key] = [];
    } else if (opt.isColorPicker) {
      // Initialize with default values
      initial[key] = {};
      opt.fields.forEach((field) => {
        initial[key][field.key] = field.default;
      });
    } else {
      initial[key] = null;
    }
  });
  return initial;
};

export default {
  EXAMPLE_PROMPTS,
  DEFAULT_PERSISTENT_OPTIONS,
  getInitialSelections,
};
