// utils/tokenCalculator.js
// Dynamic token cost calculation - MUST MATCH edge function exactly

/**
 * Calculate the token cost for generating a website
 * @param {string} prompt - The user's description
 * @param {Object} selections - Customization selections object
 * @param {boolean} isRefinement - Whether this is a refinement of existing content
 * @returns {{ cost: number, breakdown: Object, estimate: string }}
 */
export function calculateTokenCost(
  prompt,
  selections = {},
  isRefinement = false
) {
  const breakdown = {};

  // Base cost - reduced for better free tier experience
  if (isRefinement) {
    breakdown.base = 3;
  } else {
    breakdown.base = 5;
  }

  // Prompt complexity (word count) - simplified, lower costs
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

  // Template complexity - additive, not multiplicative
  const templateCosts = {
    "Landing Page": 0,
    "Business Site": 2,
    Portfolio: 2,
    "SaaS Product": 4,
    Blog: 3,
    "E-commerce": 5,
  };
  breakdown.template = templateCosts[selections.template] ?? 0;

  // Sections - only charge for many sections
  const sectionCount = (selections.sections || []).length;
  if (sectionCount > 6) {
    breakdown.sections = Math.floor((sectionCount - 6) * 0.5);
  } else {
    breakdown.sections = 0;
  }

  // Style complexity
  const styleCosts = {
    Minimal: 0,
    Modern: 0,
    Elegant: 1,
    Bold: 1,
    Tech: 1,
    Playful: 1,
  };
  breakdown.style = styleCosts[selections.style] ?? 0;

  // Layout complexity
  const layoutCosts = {
    "Single Page": 0,
    "Card Grid": 1,
    Asymmetric: 2,
    Centered: 0,
  };
  breakdown.layout = layoutCosts[selections.layout] ?? 0;

  // Framework
  const frameworkCosts = {
    "Vanilla CSS": 0,
    "Tailwind Classes": 2,
  };
  breakdown.framework = frameworkCosts[selections.framework] ?? 0;

  // Animation
  const animationCosts = {
    None: 0,
    Subtle: 0,
    Moderate: 1,
    Rich: 2,
  };
  breakdown.animation = animationCosts[selections.animation] ?? 0;

  // Custom colors
  if (selections.palette === "Custom") {
    breakdown.customColors = 1;
  }

  // Dark mode
  if (selections.mode === "Dark") {
    breakdown.darkMode = 1;
  }

  // Image style
  const imageCosts = {
    Placeholders: 0,
    Abstract: 0,
    Illustrations: 1,
    "Icons Only": 0,
    None: 0,
  };
  breakdown.images = imageCosts[selections.images] ?? 0;

  // Accessibility
  const accessibilityCosts = {
    Basic: 0,
    Standard: 0,
    Enhanced: 1,
  };
  breakdown.accessibility = accessibilityCosts[selections.accessibility] ?? 0;

  // Creativity level
  const creativityCosts = {
    Conservative: 0,
    Balanced: 0,
    Experimental: 1,
  };
  breakdown.creativity = creativityCosts[selections.creativity] ?? 0;

  // Calculate total - simple sum, no multipliers
  const totalCost = Object.values(breakdown).reduce(
    (sum, cost) => sum + (cost || 0),
    0
  );

  // Apply bounds
  let finalCost = Math.max(5, totalCost);
  finalCost = Math.min(finalCost, isRefinement ? 15 : 35);

  // Generate estimate description
  let estimate = "";
  if (finalCost <= 8) {
    estimate = "Simple";
  } else if (finalCost <= 15) {
    estimate = "Standard";
  } else if (finalCost <= 22) {
    estimate = "Complex";
  } else {
    estimate = "Premium";
  }

  return {
    cost: finalCost,
    breakdown,
    estimate,
    wordCount,
  };
}

/**
 * Get a breakdown description for display
 * @param {Object} breakdown - The breakdown object from calculateTokenCost
 * @returns {Array<{ label: string, cost: number, type: string }>}
 */
export function getBreakdownDisplay(breakdown) {
  const labels = {
    base: "Base generation",
    promptComplexity: "Prompt detail",
    template: "Template type",
    sections: "Extra sections",
    style: "Design style",
    layout: "Layout type",
    framework: "CSS framework",
    animation: "Animations",
    customColors: "Custom colors",
    darkMode: "Dark mode",
    images: "Image style",
    accessibility: "Accessibility",
    creativity: "AI creativity",
  };

  const display = Object.entries(breakdown)
    .filter(([, cost]) => cost !== 0 && cost !== undefined)
    .map(([key, cost]) => ({
      label: labels[key] || key,
      cost: Math.abs(cost),
      type: cost < 0 ? "discount" : "addition",
    }));

  // Sort: base first, then by cost descending
  display.sort((a, b) => {
    if (a.label === "Base generation") return -1;
    if (b.label === "Base generation") return 1;
    return b.cost - a.cost;
  });

  return display;
}

/**
 * Check if user has enough tokens
 * @param {number} available - Available tokens
 * @param {number} required - Required tokens
 * @returns {{ sufficient: boolean, deficit: number, percentage: number, status: string }}
 */
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

/**
 * Format token cost for display
 * @param {number} cost
 * @returns {string}
 */
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
