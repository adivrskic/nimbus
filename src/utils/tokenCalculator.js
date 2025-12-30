// utils/tokenCalculator.js
// Dynamic token cost calculation - MUST MATCH edge function exactly

export function calculateTokenCost(
  prompt = "",
  selections = {},
  isRefinement = false
) {
  const breakdown = {};

  // Base cost - same for both initial and refinement
  breakdown.base = 5;

  const safePrompt = typeof prompt === "string" ? prompt : String(prompt ?? "");

  // Prompt complexity (word count)
  const wordCount = safePrompt
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  if (wordCount <= 10) {
    breakdown.promptComplexity = 0;
  } else if (wordCount <= 50) {
    breakdown.promptComplexity = 1;
  } else if (wordCount <= 150) {
    breakdown.promptComplexity = 2;
  } else {
    breakdown.promptComplexity = 3;
  }

  // For refinements, only base + prompt complexity apply
  if (isRefinement) {
    const totalCost = breakdown.base + breakdown.promptComplexity;
    const finalCost = Math.min(Math.max(5, totalCost), 15);

    let estimate = "";
    if (finalCost <= 6) estimate = "Simple";
    else if (finalCost <= 10) estimate = "Standard";
    else estimate = "Complex";

    return {
      cost: finalCost,
      breakdown,
      estimate,
      wordCount,
    };
  }

  // ============================================
  // STRUCTURE & LAYOUT (only for initial generation)
  // ============================================

  // Template
  const templateCosts = {
    "Landing Page": 0,
    "Marketing Site": 2,
    "Multi Page": 3,
    Portfolio: 2,
    SaaS: 4,
    Blog: 3,
    "E-commerce": 5,
    Documentation: 3,
    "Web App": 4,
  };
  breakdown.template = templateCosts[selections.template] ?? 0;

  // Navigation
  const navigationCosts = {
    Standard: 0,
    "Centered Logo": 1,
    Hamburger: 1,
    Sidebar: 2,
    "Mega Menu": 3,
    Floating: 1,
    Transparent: 1,
    Minimal: 0,
    "Bottom Nav": 1,
    Split: 0,
    Tabbed: 1,
    Breadcrumb: 1,
    "Vertical Dots": 1,
    "Command Palette": 2,
    "No Navigation": 0,
  };
  breakdown.navigation = navigationCosts[selections.navigation] ?? 0;

  // Layout
  const layoutCosts = {
    "Vertical Stack": 0,
    "Single Page": 0,
    "Card Grid": 1,
    "Split Screen": 1,
    Asymmetric: 2,
    Centered: 0,
    Editorial: 1,
    Dashboard: 2,
    Masonry: 2,
    "Hero-Focused": 0,
  };
  breakdown.layout = layoutCosts[selections.layout] ?? 0;

  // Sections
  const sectionCount = (selections.sections || []).length;
  breakdown.sections =
    sectionCount > 6 ? Math.floor((sectionCount - 6) * 0.5) : 0;

  // Content Flow
  const contentFlowCosts = {
    Linear: 0,
    "Hub & Spoke": 1,
    "Z Pattern": 1,
    "F Pattern": 0,
    "Inverted Pyramid": 0,
    "Story Arc": 1,
    "Problem-Solution": 0,
    "Feature Led": 0,
    "Benefit Led": 0,
  };
  breakdown.contentFlow = contentFlowCosts[selections.contentFlow] ?? 0;

  // Visual Hierarchy
  const hierarchyCosts = {
    Strong: 0,
    Balanced: 0,
    Flat: 0,
  };
  breakdown.hierarchy = hierarchyCosts[selections.hierarchy] ?? 0;

  // Density
  const densityCosts = {
    Spacious: 0,
    Balanced: 0,
    Compact: 1,
  };
  breakdown.density = densityCosts[selections.density] ?? 0;

  // ============================================
  // VISUAL STYLE
  // ============================================

  // Style
  const styleCosts = {
    Minimal: 0,
    Modern: 0,
    Elegant: 1,
    Bold: 1,
    Tech: 1,
    Playful: 1,
    Neumorphic: 2,
    Brutalist: 1,
    Editorial: 1,
    Luxury: 2,
  };
  breakdown.style = styleCosts[selections.style] ?? 0;

  // Inspiration
  const inspirationCosts = {
    "Modern Startup": 0,
    Apple: 1,
    Stripe: 1,
    Editorial: 0,
    Brutalist: 1,
    Neubrutalism: 1,
    Dashboard: 1,
    Playful: 0,
    Futuristic: 1,
    Corporate: 0,
    Monochrome: 0,
    "Surprise Me": 1,
    Notion: 1,
    Figma: 1,
    Linear: 1,
    Framer: 1,
    Dropbox: 0,
    Spotify: 1,
    "Figma Community": 0,
    "Dribbble Shot": 1,
    Awwwards: 2,
    "SaaS B2B": 1,
    Portfolio: 0,
    Ecommerce: 1,
  };
  if (selections.inspiration) {
    breakdown.inspiration = inspirationCosts[selections.inspiration] ?? 0;
  }

  // Custom colors
  if (selections.palette === "Custom") {
    breakdown.customColors = 1;
  }

  // Dark mode
  if (selections.mode === "Dark") {
    breakdown.darkMode = 1;
  }

  // Gradient Style
  const gradientStyleCosts = {
    None: 0,
    Subtle: 0,
    Background: 1,
    Text: 1,
    Buttons: 1,
    Cards: 1,
    Mesh: 2,
    Radial: 1,
    Conic: 1,
    Animated: 2,
    Aurora: 2,
    Noise: 1,
  };
  breakdown.gradientStyle = gradientStyleCosts[selections.gradientStyle] ?? 0;

  // Background Pattern
  const backgroundPatternCosts = {
    None: 0,
    Dots: 1,
    Grid: 1,
    Lines: 1,
    Waves: 1,
    Geometric: 2,
    Noise: 1,
    "Gradient Mesh": 2,
    Blobs: 2,
    Topography: 2,
    Circuit: 2,
    Isometric: 2,
    Paper: 1,
    Fabric: 1,
    Marble: 1,
    Abstract: 2,
    "Photo Overlay": 1,
  };
  breakdown.backgroundPattern =
    backgroundPatternCosts[selections.backgroundPattern] ?? 0;

  // Corners
  const cornerCosts = {
    Sharp: 0,
    Subtle: 0,
    Rounded: 0,
    Pill: 1,
    Fluid: 1,
  };
  breakdown.corners = cornerCosts[selections.corners] ?? 0;

  // Shadow Style
  const shadowStyleCosts = {
    None: 0,
    Subtle: 0,
    Medium: 0,
    Heavy: 1,
    Colored: 1,
    Hard: 0,
    Layered: 1,
    Inset: 1,
    Long: 1,
    Glow: 1,
    Neumorphic: 2,
    Brutalist: 1,
  };
  breakdown.shadowStyle = shadowStyleCosts[selections.shadowStyle] ?? 0;

  // Hover Effects
  const hoverEffectsCosts = {
    None: 0,
    Subtle: 0,
    Scale: 0,
    Lift: 1,
    Glow: 1,
    "Color Shift": 1,
    Underline: 0,
    Fill: 1,
    Tilt: 2,
    Reveal: 1,
    Magnetic: 2,
    Morphing: 2,
  };
  breakdown.hoverEffects = hoverEffectsCosts[selections.hoverEffects] ?? 0;

  // ============================================
  // TYPOGRAPHY
  // ============================================

  // Font (no cost - just a preference)
  // Font costs are 0 for all options

  // Typography Scale
  const typographyScaleCosts = {
    Compact: 0,
    Default: 0,
    Large: 0,
    Dramatic: 1,
    Fluid: 1,
    Modular: 1,
  };
  breakdown.typographyScale =
    typographyScaleCosts[selections.typographyScale] ?? 0;

  // Heading Style
  const headingStyleCosts = {
    Simple: 0,
    Bold: 0,
    Light: 0,
    Uppercase: 0,
    Underlined: 1,
    Highlighted: 1,
    Gradient: 1,
    Outlined: 1,
  };
  breakdown.headingStyle = headingStyleCosts[selections.headingStyle] ?? 0;

  // ============================================
  // COMPONENTS
  // ============================================

  // Hero Style
  const heroStyleCosts = {
    Centered: 0,
    Split: 1,
    "Full Screen": 1,
    "Video Background": 2,
    Animated: 2,
    Gradient: 1,
    Minimal: 0,
    "Product Showcase": 1,
    Stats: 1,
    Testimonial: 1,
    Interactive: 3,
    Parallax: 2,
    "3D": 3,
    Carousel: 2,
    "Search Focused": 1,
    "Card Stack": 2,
    Asymmetric: 2,
    "Bento Grid": 2,
  };
  breakdown.heroStyle = heroStyleCosts[selections.heroStyle] ?? 0;

  // Button Style
  const buttonStyleCosts = {
    Solid: 0,
    Outline: 0,
    Gradient: 1,
    Pill: 0,
    Sharp: 0,
    Rounded: 0,
    "Icon + Text": 0,
    Animated: 1,
    "3D/Elevated": 1,
    Underline: 0,
    Glow: 1,
    Neubrutalist: 1,
    Glass: 1,
    Split: 1,
    "Loading States": 1,
  };
  breakdown.buttonStyle = buttonStyleCosts[selections.buttonStyle] ?? 0;

  // Card Style
  const cardStyleCosts = {
    Flat: 0,
    Elevated: 0,
    Bordered: 0,
    Glass: 2,
    Gradient: 1,
    Outlined: 0,
    "Hover Lift": 1,
    "Image Heavy": 0,
    Compact: 0,
    Expanded: 0,
    Asymmetric: 1,
    Stacked: 1,
    Neumorphic: 2,
    Brutalist: 1,
    Interactive: 2,
  };
  breakdown.cardStyle = cardStyleCosts[selections.cardStyle] ?? 0;

  // Form Style
  const formStyleCosts = {
    Standard: 0,
    Underline: 0,
    Filled: 0,
    "Floating Label": 1,
    Outlined: 0,
    Minimal: 0,
    Inline: 0,
    Card: 0,
    Stepped: 2,
    Conversational: 2,
    "Inline Validation": 1,
    Large: 0,
    Compact: 0,
    Searchable: 1,
    "Date Picker": 1,
  };
  breakdown.formStyle = formStyleCosts[selections.formStyle] ?? 0;

  // Icon Style
  const iconStyleCosts = {
    Line: 0,
    Solid: 0,
    "Duo-tone": 1,
    Outlined: 0,
    Colored: 1,
    Gradient: 1,
    "3D": 2,
    "Hand-drawn": 1,
    Minimal: 0,
    Detailed: 1,
    Animated: 2,
    Emoji: 0,
    "Custom Illustrations": 2,
    Phosphor: 0,
    Heroicons: 0,
    Lucide: 0,
    Feather: 0,
  };
  breakdown.iconStyle = iconStyleCosts[selections.iconStyle] ?? 0;

  // Badge Style
  const badgeStyleCosts = {
    Pill: 0,
    Rounded: 0,
    Square: 0,
    Outlined: 0,
    Filled: 0,
    Dot: 0,
    Gradient: 1,
  };
  breakdown.badgeStyle = badgeStyleCosts[selections.badgeStyle] ?? 0;

  // Avatar Style
  const avatarStyleCosts = {
    Circle: 0,
    Rounded: 0,
    Square: 0,
    Initials: 0,
    Bordered: 0,
    Stacked: 1,
    "With Status": 1,
  };
  breakdown.avatarStyle = avatarStyleCosts[selections.avatarStyle] ?? 0;

  // Tab Style
  const tabStyleCosts = {
    Underline: 0,
    Pill: 0,
    Boxed: 0,
    Button: 0,
    Minimal: 0,
    Vertical: 1,
  };
  breakdown.tabStyle = tabStyleCosts[selections.tabStyle] ?? 0;

  // Accordion Style
  const accordionStyleCosts = {
    Simple: 0,
    Bordered: 0,
    Card: 0,
    Flush: 0,
    Icon: 0,
    Animated: 1,
  };
  breakdown.accordionStyle =
    accordionStyleCosts[selections.accordionStyle] ?? 0;

  // Carousel Style
  const carouselStyleCosts = {
    None: 0,
    Simple: 1,
    Dots: 1,
    Thumbnails: 2,
    "Center Mode": 1,
    "Auto Play": 1,
    Fade: 1,
    "Multi Item": 1,
  };
  breakdown.carouselStyle = carouselStyleCosts[selections.carouselStyle] ?? 0;

  // Notification Style
  const notificationStyleCosts = {
    Toast: 1,
    Banner: 0,
    Inline: 0,
    Modal: 1,
    "Slide In": 1,
    Floating: 1,
  };
  breakdown.notificationStyle =
    notificationStyleCosts[selections.notificationStyle] ?? 0;

  // Progress Style
  const progressStyleCosts = {
    Bar: 0,
    Circle: 1,
    Steps: 1,
    Dots: 0,
    Number: 0,
    Percentage: 0,
  };
  breakdown.progressStyle = progressStyleCosts[selections.progressStyle] ?? 0;

  // Table Style
  const tableStyleCosts = {
    Simple: 0,
    Striped: 0,
    Bordered: 0,
    Borderless: 0,
    Cards: 1,
    Compact: 0,
    Sortable: 1,
  };
  breakdown.tableStyle = tableStyleCosts[selections.tableStyle] ?? 0;

  // Link Style (no cost - just preference)
  // All link styles cost 0

  // List Style
  const listStyleCosts = {
    Standard: 0,
    Check: 0,
    Arrow: 0,
    Number: 0,
    Icon: 1,
    Card: 1,
    Timeline: 2,
  };
  breakdown.listStyle = listStyleCosts[selections.listStyle] ?? 0;

  // Empty States
  const emptyStatesCosts = {
    Simple: 0,
    Illustrated: 1,
    Actionable: 0,
    Minimal: 0,
    Animated: 1,
  };
  breakdown.emptyStates = emptyStatesCosts[selections.emptyStates] ?? 0;

  // ============================================
  // CONTENT BLOCKS
  // ============================================

  // Testimonial Style
  const testimonialStyleCosts = {
    Cards: 0,
    Carousel: 1,
    Grid: 0,
    "Single Featured": 0,
    Masonry: 1,
    Video: 2,
    "Tweet Style": 1,
    "With Logos": 0,
    Marquee: 1,
  };
  breakdown.testimonialStyle =
    testimonialStyleCosts[selections.testimonialStyle] ?? 0;

  // Pricing Style
  const pricingStyleCosts = {
    Cards: 0,
    Table: 0,
    Comparison: 1,
    Toggle: 1,
    Tiered: 0,
    Highlighted: 0,
    Minimal: 0,
  };
  breakdown.pricingStyle = pricingStyleCosts[selections.pricingStyle] ?? 0;

  // Stats Style
  const statsStyleCosts = {
    Simple: 0,
    Cards: 0,
    Counters: 1,
    Progress: 1,
    Charts: 2,
    Icons: 0,
    Grid: 0,
  };
  breakdown.statsStyle = statsStyleCosts[selections.statsStyle] ?? 0;

  // Team Style
  const teamStyleCosts = {
    Grid: 0,
    Carousel: 1,
    Featured: 0,
    "Hover Reveal": 1,
    "Social Links": 0,
    Minimal: 0,
  };
  breakdown.teamStyle = teamStyleCosts[selections.teamStyle] ?? 0;

  // FAQ Style
  const faqStyleCosts = {
    Accordion: 0,
    Cards: 0,
    "Two Column": 0,
    Categorized: 1,
    Search: 1,
    Minimal: 0,
  };
  breakdown.faqStyle = faqStyleCosts[selections.faqStyle] ?? 0;

  // Contact Style
  const contactStyleCosts = {
    "Form Only": 0,
    "Form + Info": 0,
    Split: 0,
    "Map + Form": 1,
    Calendly: 1,
    Cards: 0,
    Minimal: 0,
  };
  breakdown.contactStyle = contactStyleCosts[selections.contactStyle] ?? 0;

  // Footer Style
  const footerStyleCosts = {
    Simple: 0,
    Minimal: 0,
    Standard: 0,
    Fat: 1,
    Mega: 1,
    CTA: 0,
    Newsletter: 0,
    Dark: 0,
  };
  breakdown.footerStyle = footerStyleCosts[selections.footerStyle] ?? 0;

  // CTA Section Style
  const ctaSectionStyleCosts = {
    Centered: 0,
    Split: 1,
    "Full Width": 0,
    Card: 0,
    Gradient: 1,
    "Image Background": 1,
    Floating: 1,
    Newsletter: 0,
  };
  breakdown.ctaSectionStyle =
    ctaSectionStyleCosts[selections.ctaSectionStyle] ?? 0;

  // ============================================
  // EFFECTS & MOTION
  // ============================================

  // Animation
  const animationCosts = {
    None: 0,
    Minimal: 0,
    Subtle: 1,
    Moderate: 2,
    Expressive: 3,
    Immersive: 4,
    "Performance-First": 0,
  };
  breakdown.animation = animationCosts[selections.animation] ?? 0;

  // Interaction
  const interactionCosts = {
    Static: 0,
    Interactive: 1,
    "App-Like": 2,
  };
  breakdown.interaction = interactionCosts[selections.interaction] ?? 0;

  // Scroll Behavior
  const scrollBehaviorCosts = {
    Standard: 0,
    Smooth: 0,
    Snap: 1,
    Parallax: 2,
    Reveal: 1,
    Progress: 1,
    Sticky: 1,
  };
  breakdown.scrollBehavior =
    scrollBehaviorCosts[selections.scrollBehavior] ?? 0;

  // Loading Style
  const loadingStyleCosts = {
    None: 0,
    Spinner: 0,
    Skeleton: 1,
    "Progress Bar": 1,
    Dots: 0,
    Pulse: 0,
  };
  breakdown.loadingStyle = loadingStyleCosts[selections.loadingStyle] ?? 0;

  // ============================================
  // SPACING & BORDERS
  // ============================================

  // Spacing Scale
  const spacingScaleCosts = {
    Tight: 0,
    Default: 0,
    Relaxed: 0,
    Dramatic: 1,
  };
  breakdown.spacingScale = spacingScaleCosts[selections.spacingScale] ?? 0;

  // Divider Style
  const dividerStyleCosts = {
    None: 0,
    Line: 0,
    Wave: 1,
    Angle: 1,
    Curve: 1,
    Mountain: 1,
    "Gradient Fade": 1,
    "Color Block": 0,
    Zigzag: 1,
    "Torn Paper": 2,
    Dots: 0,
    Space: 0,
  };
  breakdown.dividerStyle = dividerStyleCosts[selections.dividerStyle] ?? 0;

  // Border Width (no cost - just preference)
  // All border widths cost 0

  // ============================================
  // MEDIA
  // ============================================

  // Images
  const imageCosts = {
    Photography: 1,
    Stock: 1,
    "Product Screenshots": 1,
    Illustrations: 1,
    Abstract: 0,
    "3D Graphics": 2,
    "AI Generated": 2,
    "Icons Only": 0,
    "Text Only": 0,
  };
  breakdown.images = imageCosts[selections.images] ?? 0;

  // Media Handling
  const mediaHandlingCosts = {
    Standard: 0,
    "Lazy Load": 0,
    "Blur Up": 1,
    Lightbox: 1,
    Masonry: 1,
    "Video Modal": 1,
    "Responsive Images": 0,
  };
  breakdown.mediaHandling = mediaHandlingCosts[selections.mediaHandling] ?? 0;

  // Code Block Style
  const codeBlockStyleCosts = {
    None: 0,
    Simple: 0,
    Highlighted: 1,
    Dark: 0,
    Light: 0,
    "Line Numbers": 0,
    "Copy Button": 1,
    Terminal: 1,
  };
  breakdown.codeBlockStyle =
    codeBlockStyleCosts[selections.codeBlockStyle] ?? 0;

  // ============================================
  // TECHNICAL
  // ============================================

  // Framework
  const frameworkCosts = {
    "Vanilla CSS": 0,
    "Tailwind Classes": 2,
    "Tailwind + Extracted Components": 3,
    "CSS Modules": 1,
    "BEM CSS": 1,
    "Design Tokens": 2,
  };
  breakdown.framework = frameworkCosts[selections.framework] ?? 0;

  // Accessibility
  const accessibilityCosts = {
    Basic: 0,
    Standard: 0,
    Enhanced: 1,
  };
  breakdown.accessibility = accessibilityCosts[selections.accessibility] ?? 0;

  // SEO Level
  const seoLevelCosts = {
    Basic: 0,
    Standard: 0,
    Advanced: 1,
  };
  breakdown.seoLevel = seoLevelCosts[selections.seoLevel] ?? 0;

  // Performance Level
  const performanceLevelCosts = {
    Standard: 0,
    Optimized: 1,
    "Ultra Light": 1,
  };
  breakdown.performanceLevel =
    performanceLevelCosts[selections.performanceLevel] ?? 0;

  // Responsive Approach (no cost - just preference)
  // All responsive approaches cost 0

  // Mobile Menu
  const mobileMenuCosts = {
    "Hamburger Slide": 0,
    "Full Screen": 1,
    "Bottom Sheet": 1,
    "Bottom Nav": 1,
    Dropdown: 0,
  };
  breakdown.mobileMenu = mobileMenuCosts[selections.mobileMenu] ?? 0;

  // ============================================
  // FEATURES
  // ============================================

  // Dark Mode Toggle
  const darkModeToggleCosts = {
    None: 0,
    Header: 1,
    Footer: 1,
    System: 1,
  };
  breakdown.darkModeToggle =
    darkModeToggleCosts[selections.darkModeToggle] ?? 0;

  // Cookie Banner
  const cookieBannerCosts = {
    None: 0,
    Simple: 0,
    "Bottom Bar": 0,
    Corner: 0,
    Minimal: 0,
  };
  breakdown.cookieBanner = cookieBannerCosts[selections.cookieBanner] ?? 0;

  // Social Sharing
  const socialSharingCosts = {
    None: 0,
    Buttons: 1,
    Links: 0,
    Follow: 0,
    "Open Graph": 0,
  };
  breakdown.socialSharing = socialSharingCosts[selections.socialSharing] ?? 0;

  // Sticky Elements
  const stickyCount = (selections.stickyElements || []).length;
  breakdown.stickyElements = stickyCount > 0 ? Math.min(stickyCount, 2) : 0;

  // Error Page Style
  const errorPageStyleCosts = {
    Simple: 0,
    Illustrated: 1,
    Animated: 2,
    Playful: 1,
    Minimal: 0,
    Search: 1,
  };
  breakdown.errorPageStyle =
    errorPageStyleCosts[selections.errorPageStyle] ?? 0;

  // ============================================
  // AI CONTROLS
  // ============================================

  // Creativity
  const creativityCosts = {
    Conservative: 0,
    Balanced: 0,
    Experimental: 1,
  };
  breakdown.creativity = creativityCosts[selections.creativity] ?? 0;

  // ============================================
  // CALCULATE TOTAL
  // ============================================

  // Filter out zero values and calculate total
  const totalCost = Object.values(breakdown).reduce(
    (sum, cost) => sum + (cost || 0),
    0
  );

  let finalCost = Math.max(5, totalCost);
  finalCost = Math.min(finalCost, 35);

  let estimate = "";
  if (finalCost <= 8) estimate = "Simple";
  else if (finalCost <= 15) estimate = "Standard";
  else if (finalCost <= 22) estimate = "Complex";
  else estimate = "Premium";

  return {
    cost: finalCost,
    breakdown,
    estimate,
    wordCount,
  };
}

/**
 * Format breakdown object for display
 * @param {Object} breakdown - The breakdown object from calculateTokenCost
 * @returns {Array} Formatted array of {label, cost, type} objects
 */
export function getBreakdownDisplay(breakdown) {
  const labels = {
    base: "Base generation",
    promptComplexity: "Prompt detail",
    // Structure & Layout
    template: "Template type",
    navigation: "Navigation style",
    layout: "Layout type",
    sections: "Extra sections",
    contentFlow: "Content flow",
    hierarchy: "Visual hierarchy",
    density: "Content density",
    // Visual Style
    style: "Design style",
    inspiration: "Design inspiration",
    customColors: "Custom colors",
    darkMode: "Dark mode",
    gradientStyle: "Gradient usage",
    backgroundPattern: "Background pattern",
    corners: "Corner style",
    shadowStyle: "Shadow style",
    hoverEffects: "Hover effects",
    // Typography
    typographyScale: "Type scale",
    headingStyle: "Heading style",
    // Components
    heroStyle: "Hero style",
    buttonStyle: "Button style",
    cardStyle: "Card style",
    formStyle: "Form style",
    iconStyle: "Icon style",
    badgeStyle: "Badge style",
    avatarStyle: "Avatar style",
    tabStyle: "Tab style",
    accordionStyle: "Accordion style",
    carouselStyle: "Carousel style",
    notificationStyle: "Notification style",
    progressStyle: "Progress style",
    tableStyle: "Table style",
    listStyle: "List style",
    emptyStates: "Empty states",
    // Content Blocks
    testimonialStyle: "Testimonial style",
    pricingStyle: "Pricing style",
    statsStyle: "Stats display",
    teamStyle: "Team section",
    faqStyle: "FAQ style",
    contactStyle: "Contact style",
    footerStyle: "Footer style",
    ctaSectionStyle: "CTA section",
    // Effects & Motion
    animation: "Animations",
    interaction: "Interactivity",
    scrollBehavior: "Scroll behavior",
    loadingStyle: "Loading states",
    // Spacing & Borders
    spacingScale: "Spacing scale",
    dividerStyle: "Section dividers",
    // Media
    images: "Image style",
    mediaHandling: "Media handling",
    codeBlockStyle: "Code blocks",
    // Technical
    framework: "CSS framework",
    accessibility: "Accessibility",
    seoLevel: "SEO focus",
    performanceLevel: "Performance",
    mobileMenu: "Mobile menu",
    // Features
    darkModeToggle: "Dark mode toggle",
    cookieBanner: "Cookie banner",
    socialSharing: "Social sharing",
    stickyElements: "Sticky UI",
    errorPageStyle: "Error pages",
    // AI
    creativity: "AI creativity",
  };

  const display = Object.entries(breakdown)
    .filter(([, cost]) => cost !== 0 && cost !== undefined)
    .map(([key, cost]) => ({
      label: labels[key] || key,
      cost: Math.abs(cost),
      type: cost < 0 ? "discount" : "addition",
    }));

  display.sort((a, b) => {
    if (a.label === "Base generation") return -1;
    if (b.label === "Base generation") return 1;
    return b.cost - a.cost;
  });

  return display;
}

/**
 * Convenience wrapper that calculates token cost and returns formatted breakdown
 * @param {Object} selections - The user's selections
 * @param {string} prompt - The user's prompt
 * @param {boolean} isRefinement - Whether this is a refinement/enhance request
 * @returns {Array} Formatted breakdown for display
 */
export function getTokenBreakdown(
  selections,
  prompt = "",
  isRefinement = false
) {
  const { breakdown } = calculateTokenCost(prompt, selections, isRefinement);
  return getBreakdownDisplay(breakdown);
}

export function checkTokenBalance(available, required) {
  const deficit = Math.max(0, required - available);
  const percentage = required > 0 ? (available / required) * 100 : 100;

  return {
    sufficient: available >= required,
    deficit,
    percentage: Math.min(100, Math.max(0, percentage)),
    status:
      available >= required
        ? "sufficient"
        : percentage > 75
        ? "close"
        : percentage > 50
        ? "moderate"
        : "insufficient",
  };
}

export function formatTokenCost(cost) {
  if (cost === 1) return "1 token";
  return `${Math.ceil(cost)} tokens`;
}

export default {
  calculateTokenCost,
  getBreakdownDisplay,
  getTokenBreakdown,
  checkTokenBalance,
  formatTokenCost,
};
