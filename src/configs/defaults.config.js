export const EXAMPLE_PROMPTS = [
  "A modern portfolio site for a photographer with a dark theme...",
  "Landing page for an AI startup with gradient backgrounds...",
  "Restaurant website with online menu and reservation form...",
  "Personal blog with minimalist design and reading progress...",
  "SaaS dashboard landing page with pricing comparison...",
  "Creative agency site with bold typography and animations...",
];

export const DEFAULT_PERSISTENT_OPTIONS = {
  // Brand identity
  branding: {
    brandName: "",
    tagline: "",
    logoUrl: "",
    faviconUrl: "",
  },

  // Business information (NEW)
  business: {
    description: "", // Short description of what they do
    location: "", // City, region, or "Remote"
    yearEstablished: "", // e.g., "2015" - adds credibility
  },

  // Contact information
  contactInfo: {
    email: "",
    phone: "",
    address: "",
    contactFormEndpoint: "",
  },

  // Social media links
  socialMedia: {
    twitter: "",
    instagram: "",
    linkedIn: "",
    facebook: "",
    github: "",
    youtube: "",
    tiktok: "",
  },

  // Content preferences (NEW)
  content: {
    primaryCta: "", // e.g., "Get Started", "Book Now", "Contact Us"
    copyrightText: "", // e.g., "© 2024 Company Name"
  },

  // Important links
  links: {
    termsOfService: "",
    privacyPolicy: "",
    pricingPage: "",
    blog: "",
  },

  // User-provided images
  images: [],
};

export const getInitialSelections = (OPTIONS) => {
  const initial = {};
  Object.entries(OPTIONS).forEach(([key, opt]) => {
    if (opt.multi) {
      initial[key] = [];
    } else if (opt.isColorPicker) {
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
