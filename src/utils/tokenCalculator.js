// utils/tokenCalculator.js
// Dynamic token cost calculation - MUST MATCH edge function exactly

export function calculateTokenCost(
  prompt,
  selections = {},
  isRefinement = false
) {
  const breakdown = {};

  // Base cost
  breakdown.base = isRefinement ? 3 : 5;

  // Prompt complexity (word count)
  const wordCount = prompt
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

  // Sections
  const sectionCount = (selections.sections || []).length;
  breakdown.sections =
    sectionCount > 6 ? Math.floor((sectionCount - 6) * 0.5) : 0;

  // Style
  const styleCosts = {
    Minimal: 0,
    Modern: 0,
    Elegant: 1,
    Bold: 1,
    Tech: 1,
    Playful: 1,
    Neumorphic: 1,
    Brutalist: 1,
    Editorial: 1,
    Luxury: 2,
  };
  breakdown.style = styleCosts[selections.style] ?? 0;

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

  // Density
  const densityCosts = {
    Spacious: 0,
    Balanced: 0,
    Compact: 1,
  };
  breakdown.density = densityCosts[selections.density] ?? 0;

  // Corners
  const cornerCosts = {
    Sharp: 0,
    Subtle: 0,
    Rounded: 0,
    Pill: 1,
    Fluid: 1,
  };
  breakdown.corners = cornerCosts[selections.corners] ?? 0;

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

  // Animation (new scale)
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

  // Custom colors
  if (selections.palette === "Custom") {
    breakdown.customColors = 1;
  }

  // Dark mode
  if (selections.mode === "Dark") {
    breakdown.darkMode = 1;
  }

  // Accessibility
  const accessibilityCosts = {
    Basic: 0,
    Standard: 0,
    Enhanced: 1,
  };
  breakdown.accessibility = accessibilityCosts[selections.accessibility] ?? 0;

  // Creativity
  const creativityCosts = {
    Conservative: 0,
    Balanced: 0,
    Experimental: 1,
  };
  breakdown.creativity = creativityCosts[selections.creativity] ?? 0;

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

  // NOTE: tone, font, copyLength, cta, goal, industry, audience,
  // socialProof, stickyElements, hierarchy, persistent
  // are intentionally NOT charged here (cost 0).

  const totalCost = Object.values(breakdown).reduce(
    (sum, cost) => sum + (cost || 0),
    0
  );

  let finalCost = Math.max(5, totalCost);
  finalCost = Math.min(finalCost, isRefinement ? 15 : 35);

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

export function getBreakdownDisplay(breakdown) {
  const labels = {
    base: "Base generation",
    promptComplexity: "Prompt detail",
    template: "Template type",
    sections: "Extra sections",
    style: "Design style",
    layout: "Layout type",
    density: "Content density",
    corners: "Corner style",
    framework: "CSS framework",
    animation: "Animations",
    interaction: "Interactivity",
    customColors: "Custom colors",
    darkMode: "Dark mode",
    images: "Image style",
    accessibility: "Accessibility",
    creativity: "AI creativity",
    inspiration: "Design inspiration",
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
  checkTokenBalance,
  formatTokenCost,
};
