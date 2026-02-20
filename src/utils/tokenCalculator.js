export function calculateTokenCost(
  prompt = "",
  selections = {},
  isRefinement = false
) {
  const breakdown = {};

  // ============================================
  // BASE COST (raised from 10 → 12)
  // ============================================
  breakdown.base = 12;

  // ============================================
  // PROMPT COMPLEXITY (raised brackets)
  // ============================================
  const safePrompt = typeof prompt === "string" ? prompt : String(prompt ?? "");
  const wordCount = safePrompt
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  if (wordCount <= 10) {
    breakdown.promptComplexity = 0;
  } else if (wordCount <= 50) {
    breakdown.promptComplexity = 2;
  } else if (wordCount <= 150) {
    breakdown.promptComplexity = 3;
  } else {
    breakdown.promptComplexity = 5;
  }

  if (isRefinement) {
    const totalCost = breakdown.base + breakdown.promptComplexity;
    const finalCost = Math.min(Math.max(5, totalCost), 20);

    let estimate = "";
    if (finalCost <= 7) estimate = "Simple";
    else if (finalCost <= 12) estimate = "Standard";
    else estimate = "Complex";

    return {
      cost: finalCost,
      breakdown,
      estimate,
      wordCount,
    };
  }

  // ============================================
  // TEMPLATE TYPE (raised across the board)
  // ============================================
  const templateCosts = {
    "Landing Page": 0,
    "Marketing Site": 3,
    "Multi Page": 5,
    Portfolio: 3,
    SaaS: 5,
    Blog: 4,
    "E-commerce": 7,
    Documentation: 4,
    "Web App": 6,
  };
  breakdown.template = templateCosts[selections.template] ?? 0;

  // ============================================
  // NAVIGATION (bumped non-trivial options)
  // ============================================
  const navigationCosts = {
    Standard: 0,
    "Centered Logo": 2,
    Hamburger: 1,
    Sidebar: 3,
    "Mega Menu": 4,
    Floating: 2,
    Transparent: 2,
    Minimal: 0,
    "Bottom Nav": 2,
    Split: 1,
    Tabbed: 2,
    Breadcrumb: 1,
    "Vertical Dots": 2,
    "Command Palette": 3,
    "No Navigation": 0,
  };
  breakdown.navigation = navigationCosts[selections.navigation] ?? 0;

  // ============================================
  // LAYOUT (bumped complex layouts)
  // ============================================
  const layoutCosts = {
    "Vertical Stack": 0,
    "Single Page": 0,
    "Card Grid": 2,
    "Split Screen": 2,
    Asymmetric: 3,
    Centered: 0,
    Editorial: 2,
    Dashboard: 3,
    Masonry: 3,
    "Hero-Focused": 1,
  };
  breakdown.layout = layoutCosts[selections.layout] ?? 0;

  // ============================================
  // SECTIONS (lowered threshold, raised multiplier)
  // ============================================
  const sectionCount = (selections.sections || []).length;
  breakdown.sections =
    sectionCount > 4 ? Math.ceil((sectionCount - 4) * 0.75) : 0;

  // ============================================
  // CONTENT FLOW (raised from all-1 to varied)
  // ============================================
  const contentFlowCosts = {
    Linear: 1,
    "Hub & Spoke": 2,
    "Z Pattern": 2,
    "F Pattern": 2,
    "Inverted Pyramid": 2,
    "Story Arc": 2,
    "Problem-Solution": 2,
    "Feature Led": 1,
    "Benefit Led": 1,
  };
  breakdown.contentFlow = contentFlowCosts[selections.contentFlow] ?? 0;

  // ============================================
  // HIERARCHY (added cost to non-default)
  // ============================================
  const hierarchyCosts = { Strong: 1, Balanced: 0, Flat: 1 };
  breakdown.hierarchy = hierarchyCosts[selections.hierarchy] ?? 0;

  // ============================================
  // DENSITY (raised Compact)
  // ============================================
  const densityCosts = { Spacious: 1, Balanced: 0, Compact: 2 };
  breakdown.density = densityCosts[selections.density] ?? 0;

  // ============================================
  // STYLE (raised all by 1)
  // ============================================
  const styleCosts = {
    Minimal: 2,
    Modern: 2,
    Elegant: 2,
    Bold: 2,
    Tech: 2,
    Playful: 2,
    Neumorphic: 3,
    Brutalist: 2,
    Editorial: 2,
    Luxury: 3,
  };
  breakdown.style = styleCosts[selections.style] ?? 0;

  // ============================================
  // INSPIRATION (raised all by 1)
  // ============================================
  const inspirationCosts = {
    "Modern Startup": 2,
    Apple: 3,
    Stripe: 2,
    Editorial: 2,
    Brutalist: 2,
    Neubrutalism: 2,
    Dashboard: 2,
    Playful: 2,
    Futuristic: 2,
    Corporate: 2,
    Monochrome: 2,
    "Surprise Me": 1,
    Notion: 2,
    Figma: 2,
    Linear: 2,
    Framer: 2,
    Dropbox: 2,
    Spotify: 2,
    "Figma Community": 2,
    "Dribbble Shot": 2,
    Awwwards: 3,
    "SaaS B2B": 2,
    Portfolio: 2,
    Ecommerce: 2,
  };
  if (selections.inspiration) {
    breakdown.inspiration = inspirationCosts[selections.inspiration] ?? 0;
  }

  // ============================================
  // COLORS
  // ============================================
  if (selections.palette === "Custom") {
    breakdown.customColors = 2;
  }

  if (selections.mode === "Dark") {
    breakdown.darkMode = 2;
  }

  // ============================================
  // GRADIENT STYLE (raised complex ones)
  // ============================================
  const gradientStyleCosts = {
    None: 0,
    Subtle: 1,
    Background: 2,
    Text: 2,
    Buttons: 2,
    Cards: 2,
    Mesh: 3,
    Radial: 2,
    Conic: 2,
    Animated: 3,
    Aurora: 3,
    Noise: 2,
  };
  breakdown.gradientStyle = gradientStyleCosts[selections.gradientStyle] ?? 0;

  // ============================================
  // BACKGROUND PATTERN (raised across the board)
  // ============================================
  const backgroundPatternCosts = {
    None: 0,
    Dots: 1,
    Grid: 1,
    Lines: 1,
    Waves: 2,
    Geometric: 3,
    Noise: 2,
    "Gradient Mesh": 3,
    Blobs: 3,
    Topography: 3,
    Circuit: 3,
    Isometric: 3,
    Paper: 2,
    Fabric: 2,
    Marble: 2,
    Abstract: 3,
    "Photo Overlay": 2,
  };
  breakdown.backgroundPattern =
    backgroundPatternCosts[selections.backgroundPattern] ?? 0;

  // ============================================
  // CORNERS (raised Pill and Fluid)
  // ============================================
  const cornerCosts = { Sharp: 0, Subtle: 0, Rounded: 1, Pill: 2, Fluid: 2 };
  breakdown.corners = cornerCosts[selections.corners] ?? 0;

  // ============================================
  // SHADOW STYLE (raised complex ones)
  // ============================================
  const shadowStyleCosts = {
    None: 0,
    Subtle: 1,
    Medium: 1,
    Heavy: 2,
    Colored: 2,
    Hard: 2,
    Layered: 2,
    Inset: 2,
    Long: 2,
    Glow: 2,
    Neumorphic: 3,
    Brutalist: 2,
  };
  breakdown.shadowStyle = shadowStyleCosts[selections.shadowStyle] ?? 0;

  // ============================================
  // HOVER EFFECTS (raised all by 1)
  // ============================================
  const hoverEffectsCosts = {
    None: 0,
    Subtle: 1,
    Scale: 2,
    Lift: 2,
    Glow: 2,
    "Color Shift": 2,
    Underline: 2,
    Fill: 2,
    Tilt: 3,
    Reveal: 2,
    Magnetic: 3,
    Morphing: 3,
  };
  breakdown.hoverEffects = hoverEffectsCosts[selections.hoverEffects] ?? 0;

  // ============================================
  // TYPOGRAPHY (raised)
  // ============================================
  const typographyScaleCosts = {
    Compact: 1,
    Default: 0,
    Large: 1,
    Dramatic: 2,
    Fluid: 2,
    Modular: 2,
  };
  breakdown.typographyScale =
    typographyScaleCosts[selections.typographyScale] ?? 0;

  const headingStyleCosts = {
    Simple: 0,
    Bold: 1,
    Light: 1,
    Uppercase: 1,
    Underlined: 2,
    Highlighted: 2,
    Gradient: 2,
    Outlined: 2,
  };
  breakdown.headingStyle = headingStyleCosts[selections.headingStyle] ?? 0;

  // ============================================
  // HERO STYLE (raised complex ones significantly)
  // ============================================
  const heroStyleCosts = {
    Centered: 0,
    Split: 2,
    "Full Screen": 2,
    "Video Background": 3,
    Animated: 3,
    Gradient: 2,
    Minimal: 0,
    "Product Showcase": 2,
    Stats: 2,
    Testimonial: 2,
    Interactive: 4,
    Parallax: 3,
    "3D": 4,
    Carousel: 3,
    "Search Focused": 2,
    "Card Stack": 3,
    Asymmetric: 3,
    "Bento Grid": 3,
  };
  breakdown.heroStyle = heroStyleCosts[selections.heroStyle] ?? 0;

  // ============================================
  // BUTTON STYLE (raised)
  // ============================================
  const buttonStyleCosts = {
    Solid: 0,
    Outline: 1,
    Gradient: 2,
    Pill: 1,
    Sharp: 0,
    Rounded: 1,
    "Icon + Text": 2,
    Animated: 3,
    "3D/Elevated": 2,
    Underline: 1,
    Glow: 2,
    Neubrutalist: 2,
    Glass: 2,
    Split: 2,
    "Loading States": 2,
  };
  breakdown.buttonStyle = buttonStyleCosts[selections.buttonStyle] ?? 0;

  // ============================================
  // CARD STYLE (raised)
  // ============================================
  const cardStyleCosts = {
    Flat: 0,
    Elevated: 1,
    Bordered: 1,
    Glass: 3,
    Gradient: 2,
    Outlined: 1,
    "Hover Lift": 2,
    "Image Heavy": 3,
    Compact: 0,
    Expanded: 2,
    Asymmetric: 2,
    Stacked: 2,
    Neumorphic: 3,
    Brutalist: 2,
    Interactive: 3,
  };
  breakdown.cardStyle = cardStyleCosts[selections.cardStyle] ?? 0;

  // ============================================
  // FORM STYLE (raised)
  // ============================================
  const formStyleCosts = {
    Standard: 0,
    Underline: 1,
    Filled: 1,
    "Floating Label": 2,
    Outlined: 1,
    Minimal: 0,
    Inline: 1,
    Card: 2,
    Stepped: 3,
    Conversational: 3,
    "Inline Validation": 2,
    Large: 1,
    Compact: 1,
    Searchable: 2,
    "Date Picker": 2,
  };
  breakdown.formStyle = formStyleCosts[selections.formStyle] ?? 0;

  // ============================================
  // ICON STYLE (raised)
  // ============================================
  const iconStyleCosts = {
    Line: 0,
    Solid: 0,
    "Duo-tone": 2,
    Outlined: 0,
    Colored: 2,
    Gradient: 2,
    "3D": 3,
    "Hand-drawn": 2,
    Minimal: 0,
    Detailed: 2,
    Animated: 3,
    Emoji: 0,
    "Custom Illustrations": 3,
    Phosphor: 2,
    Heroicons: 2,
    Lucide: 2,
    Feather: 2,
  };
  breakdown.iconStyle = iconStyleCosts[selections.iconStyle] ?? 0;

  // ============================================
  // BADGE STYLE (raised)
  // ============================================
  const badgeStyleCosts = {
    Pill: 0,
    Rounded: 1,
    Square: 0,
    Outlined: 1,
    Filled: 1,
    Dot: 0,
    Gradient: 2,
  };
  breakdown.badgeStyle = badgeStyleCosts[selections.badgeStyle] ?? 0;

  // ============================================
  // AVATAR STYLE
  // ============================================
  const avatarStyleCosts = {
    Circle: 0,
    Rounded: 0,
    Square: 0,
    Initials: 1,
    Bordered: 1,
    Stacked: 2,
    "With Status": 2,
  };
  breakdown.avatarStyle = avatarStyleCosts[selections.avatarStyle] ?? 0;

  // ============================================
  // TAB STYLE
  // ============================================
  const tabStyleCosts = {
    Underline: 0,
    Pill: 1,
    Boxed: 1,
    Button: 1,
    Minimal: 0,
    Vertical: 2,
  };
  breakdown.tabStyle = tabStyleCosts[selections.tabStyle] ?? 0;

  // ============================================
  // ACCORDION STYLE (raised)
  // ============================================
  const accordionStyleCosts = {
    Simple: 0,
    Bordered: 1,
    Card: 2,
    Flush: 0,
    Icon: 1,
    Animated: 2,
  };
  breakdown.accordionStyle =
    accordionStyleCosts[selections.accordionStyle] ?? 0;

  // ============================================
  // CAROUSEL STYLE (raised)
  // ============================================
  const carouselStyleCosts = {
    None: 0,
    Simple: 2,
    Dots: 2,
    Thumbnails: 3,
    "Center Mode": 2,
    "Auto Play": 2,
    Fade: 2,
    "Multi Item": 2,
  };
  breakdown.carouselStyle = carouselStyleCosts[selections.carouselStyle] ?? 0;

  // ============================================
  // NOTIFICATION STYLE (raised)
  // ============================================
  const notificationStyleCosts = {
    Toast: 2,
    Banner: 1,
    Inline: 0,
    Modal: 2,
    "Slide In": 2,
    Floating: 2,
  };
  breakdown.notificationStyle =
    notificationStyleCosts[selections.notificationStyle] ?? 0;

  // ============================================
  // PROGRESS STYLE (raised)
  // ============================================
  const progressStyleCosts = {
    Bar: 1,
    Circle: 2,
    Steps: 2,
    Dots: 1,
    Number: 0,
    Percentage: 1,
  };
  breakdown.progressStyle = progressStyleCosts[selections.progressStyle] ?? 0;

  // ============================================
  // TABLE STYLE (raised)
  // ============================================
  const tableStyleCosts = {
    Simple: 0,
    Striped: 1,
    Bordered: 1,
    Borderless: 0,
    Cards: 2,
    Compact: 1,
    Sortable: 2,
  };
  breakdown.tableStyle = tableStyleCosts[selections.tableStyle] ?? 0;

  // ============================================
  // LIST STYLE (raised)
  // ============================================
  const listStyleCosts = {
    Standard: 0,
    Check: 1,
    Arrow: 1,
    Number: 0,
    Icon: 2,
    Card: 2,
    Timeline: 3,
  };
  breakdown.listStyle = listStyleCosts[selections.listStyle] ?? 0;

  // ============================================
  // EMPTY STATES (raised)
  // ============================================
  const emptyStatesCosts = {
    Simple: 0,
    Illustrated: 2,
    Actionable: 1,
    Minimal: 0,
    Animated: 2,
  };
  breakdown.emptyStates = emptyStatesCosts[selections.emptyStates] ?? 0;

  // ============================================
  // TESTIMONIAL STYLE (raised)
  // ============================================
  const testimonialStyleCosts = {
    Cards: 1,
    Carousel: 2,
    Grid: 2,
    "Single Featured": 1,
    Masonry: 3,
    Video: 3,
    "Tweet Style": 2,
    "With Logos": 3,
    Marquee: 2,
  };
  breakdown.testimonialStyle =
    testimonialStyleCosts[selections.testimonialStyle] ?? 0;

  // ============================================
  // PRICING STYLE (raised)
  // ============================================
  const pricingStyleCosts = {
    Cards: 1,
    Table: 1,
    Comparison: 2,
    Toggle: 2,
    Tiered: 2,
    Highlighted: 2,
    Minimal: 0,
  };
  breakdown.pricingStyle = pricingStyleCosts[selections.pricingStyle] ?? 0;

  // ============================================
  // STATS STYLE (raised)
  // ============================================
  const statsStyleCosts = {
    Simple: 0,
    Cards: 1,
    Counters: 2,
    Progress: 2,
    Charts: 3,
    Icons: 1,
    Grid: 1,
  };
  breakdown.statsStyle = statsStyleCosts[selections.statsStyle] ?? 0;

  // ============================================
  // TEAM STYLE (raised)
  // ============================================
  const teamStyleCosts = {
    Grid: 1,
    Carousel: 2,
    Featured: 2,
    "Hover Reveal": 2,
    "Social Links": 2,
    Minimal: 0,
  };
  breakdown.teamStyle = teamStyleCosts[selections.teamStyle] ?? 0;

  // ============================================
  // FAQ STYLE (raised)
  // ============================================
  const faqStyleCosts = {
    Accordion: 1,
    Cards: 2,
    "Two Column": 2,
    Categorized: 2,
    Search: 2,
    Minimal: 1,
  };
  breakdown.faqStyle = faqStyleCosts[selections.faqStyle] ?? 0;

  // ============================================
  // CONTACT STYLE (raised)
  // ============================================
  const contactStyleCosts = {
    "Form Only": 1,
    "Form + Info": 2,
    Split: 2,
    "Map + Form": 2,
    Calendly: 3,
    Cards: 2,
    Minimal: 0,
  };
  breakdown.contactStyle = contactStyleCosts[selections.contactStyle] ?? 0;

  // ============================================
  // FOOTER STYLE (raised)
  // ============================================
  const footerStyleCosts = {
    Simple: 0,
    Minimal: 0,
    Standard: 1,
    Fat: 2,
    Mega: 2,
    CTA: 3,
    Newsletter: 3,
    Dark: 1,
  };
  breakdown.footerStyle = footerStyleCosts[selections.footerStyle] ?? 0;

  // ============================================
  // CTA SECTION STYLE (raised)
  // ============================================
  const ctaSectionStyleCosts = {
    Centered: 0,
    Split: 2,
    "Full Width": 2,
    Card: 2,
    Gradient: 2,
    "Image Background": 2,
    Floating: 2,
    Newsletter: 2,
  };
  breakdown.ctaSectionStyle =
    ctaSectionStyleCosts[selections.ctaSectionStyle] ?? 0;

  // ============================================
  // EFFECTS & MOTION (raised significantly)
  // ============================================
  const animationCosts = {
    None: 0,
    Minimal: 1,
    Subtle: 2,
    Moderate: 3,
    Expressive: 4,
    Immersive: 5,
    "Performance-First": 1,
  };
  breakdown.animation = animationCosts[selections.animation] ?? 0;

  const interactionCosts = {
    Static: 0,
    Interactive: 2,
    "App-Like": 3,
  };
  breakdown.interaction = interactionCosts[selections.interaction] ?? 0;

  const scrollBehaviorCosts = {
    Standard: 0,
    Smooth: 1,
    Snap: 2,
    Parallax: 3,
    Reveal: 2,
    Progress: 2,
    Sticky: 2,
  };
  breakdown.scrollBehavior =
    scrollBehaviorCosts[selections.scrollBehavior] ?? 0;

  const loadingStyleCosts = {
    None: 0,
    Spinner: 1,
    Skeleton: 2,
    "Progress Bar": 2,
    Dots: 1,
    Pulse: 2,
  };
  breakdown.loadingStyle = loadingStyleCosts[selections.loadingStyle] ?? 0;

  // ============================================
  // SPACING & BORDERS (raised)
  // ============================================
  const spacingScaleCosts = {
    Tight: 1,
    Default: 0,
    Relaxed: 1,
    Dramatic: 2,
  };
  breakdown.spacingScale = spacingScaleCosts[selections.spacingScale] ?? 0;

  const dividerStyleCosts = {
    None: 0,
    Line: 0,
    Wave: 2,
    Angle: 2,
    Curve: 2,
    Mountain: 2,
    "Gradient Fade": 2,
    "Color Block": 2,
    Zigzag: 2,
    "Torn Paper": 3,
    Dots: 1,
    Space: 0,
  };
  breakdown.dividerStyle = dividerStyleCosts[selections.dividerStyle] ?? 0;

  // ============================================
  // BORDER WIDTH (NEW - was partially missing)
  // ============================================
  const borderWidthCosts = {
    None: 0,
    Hairline: 0,
    Thin: 0,
    Medium: 1,
    Thick: 1,
    Heavy: 2,
  };
  breakdown.borderWidth = borderWidthCosts[selections.borderWidth] ?? 0;

  // ============================================
  // MEDIA (raised)
  // ============================================
  const imageCosts = {
    Photography: 1,
    Stock: 1,
    "Product Screenshots": 2,
    Illustrations: 2,
    Abstract: 3,
    "3D Graphics": 3,
    "AI Generated": 3,
    "Icons Only": 1,
    "Text Only": 0,
  };
  breakdown.images = imageCosts[selections.images] ?? 0;

  const mediaHandlingCosts = {
    Standard: 0,
    "Lazy Load": 2,
    "Blur Up": 2,
    Lightbox: 2,
    Masonry: 2,
    "Video Modal": 2,
    "Responsive Images": 3,
  };
  breakdown.mediaHandling = mediaHandlingCosts[selections.mediaHandling] ?? 0;

  const codeBlockStyleCosts = {
    None: 0,
    Simple: 0,
    Highlighted: 2,
    Dark: 1,
    Light: 1,
    "Line Numbers": 2,
    "Copy Button": 2,
    Terminal: 2,
  };
  breakdown.codeBlockStyle =
    codeBlockStyleCosts[selections.codeBlockStyle] ?? 0;

  // ============================================
  // TECHNICAL (raised)
  // ============================================
  const frameworkCosts = {
    "Vanilla CSS": 0,
    "Tailwind Classes": 3,
    "Tailwind + Extracted Components": 4,
    "CSS Modules": 3,
    "BEM CSS": 2,
    "Design Tokens": 3,
  };
  breakdown.framework = frameworkCosts[selections.framework] ?? 0;

  const accessibilityCosts = { Basic: 0, Standard: 1, Enhanced: 2 };
  breakdown.accessibility = accessibilityCosts[selections.accessibility] ?? 0;

  const seoLevelCosts = { Basic: 0, Standard: 1, Advanced: 2 };
  breakdown.seoLevel = seoLevelCosts[selections.seoLevel] ?? 0;

  const performanceLevelCosts = { Standard: 0, Optimized: 2, "Ultra Light": 2 };
  breakdown.performanceLevel =
    performanceLevelCosts[selections.performanceLevel] ?? 0;

  const mobileMenuCosts = {
    "Hamburger Slide": 0,
    "Full Screen": 2,
    "Bottom Sheet": 2,
    "Bottom Nav": 2,
    Dropdown: 1,
  };
  breakdown.mobileMenu = mobileMenuCosts[selections.mobileMenu] ?? 0;

  // ============================================
  // FEATURES (raised)
  // ============================================
  const darkModeToggleCosts = { None: 0, Header: 2, Footer: 2, System: 2 };
  breakdown.darkModeToggle =
    darkModeToggleCosts[selections.darkModeToggle] ?? 0;

  const cookieBannerCosts = {
    None: 0,
    Simple: 1,
    "Bottom Bar": 2,
    Corner: 2,
    Minimal: 1,
  };
  breakdown.cookieBanner = cookieBannerCosts[selections.cookieBanner] ?? 0;

  const socialSharingCosts = {
    None: 0,
    Buttons: 2,
    Links: 1,
    Follow: 2,
    "Open Graph": 2,
  };
  breakdown.socialSharing = socialSharingCosts[selections.socialSharing] ?? 0;

  const stickyCount = (selections.stickyElements || []).length;
  breakdown.stickyElements = stickyCount > 0 ? Math.min(stickyCount * 1, 3) : 0;

  const errorPageStyleCosts = {
    Simple: 0,
    Illustrated: 2,
    Animated: 3,
    Playful: 2,
    Minimal: 0,
    Search: 2,
  };
  breakdown.errorPageStyle =
    errorPageStyleCosts[selections.errorPageStyle] ?? 0;

  // ============================================
  // AI CONTROLS (raised Experimental)
  // ============================================
  const creativityCosts = { Conservative: 0, Balanced: 0, Experimental: 2 };
  breakdown.creativity = creativityCosts[selections.creativity] ?? 0;

  // ============================================
  // NEW: CONTENT & BRAND OPTIONS (previously missing)
  // ============================================
  const toneCosts = {
    Professional: 1,
    Friendly: 1,
    Authoritative: 1,
    Conversational: 1,
    Inspirational: 2,
    Direct: 1,
  };
  if (selections.tone) {
    breakdown.tone = toneCosts[selections.tone] ?? 0;
  }

  const copyLengthCosts = {
    Minimal: 0,
    Medium: 1,
    Detailed: 3,
  };
  if (selections.copyLength) {
    breakdown.copyLength = copyLengthCosts[selections.copyLength] ?? 0;
  }

  const ctaCosts = {
    Subtle: 1,
    Standard: 1,
    Urgent: 2,
  };
  if (selections.cta) {
    breakdown.cta = ctaCosts[selections.cta] ?? 0;
  }

  const goalCosts = {
    "Lead Generation": 1,
    Sales: 2,
    Bookings: 2,
    "Email Signup": 1,
    "Brand Awareness": 1,
    Information: 1,
  };
  if (selections.goal) {
    breakdown.goal = goalCosts[selections.goal] ?? 0;
  }

  const industryCosts = {
    Technology: 1,
    SaaS: 1,
    Healthcare: 2,
    Finance: 2,
    "Real Estate": 1,
    Education: 1,
    "E-commerce": 2,
    Agency: 1,
    Marketing: 1,
    "Food & Beverage": 1,
    "Fitness & Wellness": 1,
    Creative: 1,
    Nonprofit: 1,
    Legal: 2,
    Construction: 1,
    Hospitality: 1,
    Manufacturing: 1,
  };
  if (selections.industry) {
    breakdown.industry = industryCosts[selections.industry] ?? 0;
  }

  const audienceCosts = {
    "General Consumers": 1,
    "B2B Buyers": 1,
    Developers: 2,
    Founders: 1,
    Executives: 2,
    "Enterprise Buyers": 2,
    SMBs: 1,
    Creatives: 1,
    Students: 1,
    Educators: 1,
    Recruiters: 1,
    Agencies: 1,
    "Young Adults": 1,
    "Non-Technical": 1,
  };
  if (selections.audience) {
    breakdown.audience = audienceCosts[selections.audience] ?? 0;
  }

  const socialProofCosts = {
    None: 0,
    Testimonials: 1,
    Logos: 1,
    Stats: 1,
    Reviews: 2,
  };
  if (selections.socialProof) {
    breakdown.socialProof = socialProofCosts[selections.socialProof] ?? 0;
  }

  const brandPersonalityCosts = {
    Professional: 1,
    Friendly: 1,
    Bold: 1,
    Playful: 2,
    Sophisticated: 2,
    Innovative: 2,
    Trustworthy: 1,
    Energetic: 2,
    Calm: 1,
    Warm: 1,
  };
  if (selections.brandPersonality) {
    breakdown.brandPersonality =
      brandPersonalityCosts[selections.brandPersonality] ?? 0;
  }

  const microCopyCosts = {
    Formal: 1,
    Casual: 1,
    Minimal: 0,
    Helpful: 1,
    Playful: 2,
    Technical: 1,
  };
  if (selections.microCopy) {
    breakdown.microCopy = microCopyCosts[selections.microCopy] ?? 0;
  }

  const responsiveApproachCosts = {
    "Mobile First": 0,
    "Desktop First": 0,
    Fluid: 1,
  };
  if (selections.responsiveApproach) {
    breakdown.responsiveApproach =
      responsiveApproachCosts[selections.responsiveApproach] ?? 0;
  }

  const emojisCosts = {
    Use: 1,
    "Don't Use": 0,
  };
  if (selections.emojis) {
    breakdown.emojis = emojisCosts[selections.emojis] ?? 0;
  }

  // ============================================
  // CALCULATE TOTAL (raised cap from 35 → 50)
  // ============================================
  const totalCost = Object.values(breakdown).reduce(
    (sum, cost) => sum + (cost || 0),
    0
  );

  const finalCost = Math.min(Math.max(8, totalCost), 50);

  let estimate = "";
  if (finalCost <= 12) estimate = "Simple";
  else if (finalCost <= 22) estimate = "Standard";
  else if (finalCost <= 35) estimate = "Complex";
  else estimate = "Premium";

  return {
    cost: finalCost,
    breakdown,
    estimate,
    wordCount,
  };
}

export function getBreakdownDisplay(breakdown) {
  const labels = {
    base: "Base generation",
    promptComplexity: "Prompt detail",
    template: "Template type",
    navigation: "Navigation style",
    layout: "Layout type",
    sections: "Extra sections",
    contentFlow: "Content flow",
    hierarchy: "Visual hierarchy",
    density: "Content density",
    style: "Design style",
    inspiration: "Design inspiration",
    customColors: "Custom colors",
    darkMode: "Dark mode",
    gradientStyle: "Gradient usage",
    backgroundPattern: "Background pattern",
    corners: "Corner style",
    shadowStyle: "Shadow style",
    hoverEffects: "Hover effects",
    typographyScale: "Type scale",
    headingStyle: "Heading style",
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
    testimonialStyle: "Testimonial style",
    pricingStyle: "Pricing style",
    statsStyle: "Stats display",
    teamStyle: "Team section",
    faqStyle: "FAQ style",
    contactStyle: "Contact style",
    footerStyle: "Footer style",
    ctaSectionStyle: "CTA section",
    animation: "Animations",
    interaction: "Interactivity",
    scrollBehavior: "Scroll behavior",
    loadingStyle: "Loading states",
    spacingScale: "Spacing scale",
    dividerStyle: "Section dividers",
    borderWidth: "Border width",
    images: "Image style",
    mediaHandling: "Media handling",
    codeBlockStyle: "Code blocks",
    framework: "CSS framework",
    accessibility: "Accessibility",
    seoLevel: "SEO focus",
    performanceLevel: "Performance",
    mobileMenu: "Mobile menu",
    darkModeToggle: "Dark mode toggle",
    cookieBanner: "Cookie banner",
    socialSharing: "Social sharing",
    stickyElements: "Sticky UI",
    errorPageStyle: "Error pages",
    creativity: "AI creativity",
    // NEW labels for previously missing options
    tone: "Tone of voice",
    copyLength: "Copy length",
    cta: "CTA approach",
    goal: "Primary goal",
    industry: "Industry",
    audience: "Target audience",
    socialProof: "Social proof",
    brandPersonality: "Brand personality",
    microCopy: "Micro copy",
    responsiveApproach: "Responsive approach",
    emojis: "Emojis",
  };

  return Object.entries(breakdown)
    .filter(([, cost]) => cost !== 0 && cost !== undefined)
    .map(([key, cost]) => ({
      label: labels[key] || key,
      cost: Math.abs(cost),
      type: cost < 0 ? "discount" : "addition",
    }))
    .sort((a, b) => {
      if (a.label === "Base generation") return -1;
      if (b.label === "Base generation") return 1;
      return b.cost - a.cost;
    });
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

export function getTokenBreakdown(
  selections,
  prompt = "",
  isRefinement = false
) {
  const { breakdown } = calculateTokenCost(prompt, selections, isRefinement);
  return getBreakdownDisplay(breakdown);
}

export default {
  calculateTokenCost,
  getBreakdownDisplay,
  getTokenBreakdown,
  checkTokenBalance,
  formatTokenCost,
};
