// utils/tokenCalculator.js
// Dynamic token cost calculation based on prompt complexity and customization

/**
 * Calculate the token cost for generating a website
 * @param {string} prompt - The user's description
 * @param {Object} customization - Customization options
 * @param {boolean} isRefinement - Whether this is a refinement of existing content
 * @returns {{ cost: number, breakdown: Object, estimate: string }}
 */
export function calculateTokenCost(
  prompt,
  customization = {},
  isRefinement = false
) {
  const breakdown = {};
  const multipliers = {};

  // Base cost - fixed cost for any generation
  if (isRefinement) {
    breakdown.base = 5;
    breakdown.refinementDiscount = -2; // Show discount for refinement
  } else {
    breakdown.base = 8;
  }

  // Prompt complexity (word count and specificity)
  const wordCount = prompt
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  let promptComplexity = 0;
  if (wordCount === 0) {
    promptComplexity = 0;
  } else if (wordCount <= 10) {
    promptComplexity = 1;
    multipliers.prompt = 1.1;
  } else if (wordCount <= 50) {
    promptComplexity = 2;
    multipliers.prompt = 1.3;
  } else if (wordCount <= 150) {
    promptComplexity = 3;
    multipliers.prompt = 1.5;
  } else {
    promptComplexity = 4;
    multipliers.prompt = 1.8;
  }
  breakdown.promptComplexity = promptComplexity;

  // Check for specific keywords that indicate complexity
  const complexityKeywords = [
    "ecommerce",
    "shop",
    "store",
    "cart",
    "checkout",
    "payment",
    "saas",
    "dashboard",
    "admin",
    "user",
    "login",
    "blog",
    "articles",
    "posts",
    "comments",
    "portfolio",
    "gallery",
    "filter",
    "sort",
    "restaurant",
    "menu",
    "booking",
    "reservation",
    "real estate",
    "property",
    "listing",
    "booking",
    "calendar",
    "appointment",
  ];

  const hasComplexKeywords = complexityKeywords.some((keyword) =>
    prompt.toLowerCase().includes(keyword)
  );
  if (hasComplexKeywords) {
    breakdown.specialFeatures = 2;
    multipliers.keywords = 1.2;
  }

  // Template complexity
  const templateMultipliers = {
    landing: 1.0,
    business: 1.2,
    portfolio: 1.3,
    saas: 1.5,
    blog: 1.4,
    store: 1.8,
    ecommerce: 1.8, // Added - same as store
    event: 1.1,
    restaurant: 1.3,
    agency: 1.2,
    personal: 1.0,
  };
  const templateType = customization.templateType || "landing";
  const templateMult = templateMultipliers[templateType] || 1.0; // Fallback to 1.0
  breakdown.templateComplexity = Math.round((templateMult - 1) * 10);
  multipliers.template = templateMult;

  // Target audience complexity
  const audienceMultipliers = {
    general: 1.0,
    business: 1.3,
    tech: 1.2,
    creative: 1.1,
    luxury: 1.4,
    young: 1.1,
    parents: 1.2,
    enterprise: 1.5,
  };
  const audience = customization.targetAudience || "general";
  const audienceMult = audienceMultipliers[audience] || 1.0; // Fallback
  breakdown.audienceComplexity = Math.round((audienceMult - 1) * 10);
  multipliers.audience = audienceMult;

  // Sections complexity - each section adds complexity
  const selectedSections = customization.selectedSections || [];
  const baseSections = 3; // Hero, features, contact are base
  const extraSections = Math.max(0, selectedSections.length - baseSections);
  breakdown.sections = extraSections * 0.8;
  multipliers.sections = 1 + extraSections * 0.05;

  // Layout complexity
  const layoutMultipliers = {
    "single-page": 1.0,
    "multi-page": 1.4,
    "card-grid": 1.2,
    asymmetrical: 1.5,
    "blog-style": 1.1,
  };
  const layout = customization.layout || "single-page";
  const layoutMult = layoutMultipliers[layout] || 1.0; // Fallback
  breakdown.layoutComplexity = Math.round((layoutMult - 1) * 10);
  multipliers.layout = layoutMult;

  // Image style complexity
  const imageMultipliers = {
    placeholder: 1.0,
    abstract: 1.1,
    photography: 1.2,
    illustrations: 1.3,
    minimal: 1.0,
    none: 0.9,
  };
  const imageStyle = customization.imageStyle || "placeholder";
  const imageMult = imageMultipliers[imageStyle] || 1.0; // Fallback
  breakdown.imageStyle = Math.round((imageMult - 1) * 10);
  multipliers.images = imageMult;

  // Framework complexity
  const frameworkMultipliers = {
    plain: 1.0,
    tailwind: 1.3,
    bootstrap: 1.2,
    material: 1.4,
    bulma: 1.2,
  };
  const framework = customization.framework || "plain";
  const frameworkMult = frameworkMultipliers[framework] || 1.0; // Fallback
  breakdown.frameworkComplexity = Math.round((frameworkMult - 1) * 10);
  multipliers.framework = frameworkMult;

  // Color palette complexity
  const paletteMultipliers = {
    ocean: 1.0,
    earth: 1.0,
    forest: 1.0,
    sunset: 1.0,
    grape: 1.0,
    rose: 1.0,
    slate: 1.0,
    midnight: 1.0, // Added
    lavender: 1.0, // Added
    monochrome: 1.0, // Added
    custom: 1.5,
  };
  const colorPalette = customization.colorPalette || "ocean";
  const paletteMult = paletteMultipliers[colorPalette] || 1.0; // Fallback
  breakdown.colorPalette = Math.round((paletteMult - 1) * 10);
  multipliers.colors = paletteMult;

  // Advanced features - each adds complexity
  const advancedOptions = customization.advancedOptions || [];
  const advancedFeatureCosts = {
    semantic: 0.5,
    optimized: 0.7,
    accessible: 1.0,
    "dark-toggle": 1.2,
    responsive: 0.8,
    performance: 0.9,
  };

  breakdown.advancedFeatures = 0;
  advancedOptions.forEach((option) => {
    if (advancedFeatureCosts[option]) {
      breakdown.advancedFeatures += advancedFeatureCosts[option];
    }
  });
  multipliers.advanced = 1 + advancedOptions.length * 0.08;

  // Dark mode complexity
  if (customization.darkMode) {
    breakdown.darkMode = 1;
    multipliers.darkMode = 1.1;
  }

  // Style complexity
  const styleMultipliers = {
    minimal: 1.0,
    modern: 1.1,
    elegant: 1.3,
    bold: 1.2,
    playful: 1.2, // Added
    tech: 1.2,
    creative: 1.4,
    organic: 1.3,
    corporate: 1.1,
  };
  const stylePreset = customization.stylePreset || "modern";
  const styleMult = styleMultipliers[stylePreset] || 1.1; // Fallback to modern
  breakdown.styleComplexity = Math.round((styleMult - 1) * 10);
  multipliers.style = styleMult;

  // Custom colors add cost
  if (customization.colorScheme === "custom" || customization.customColors) {
    breakdown.customColors = 2;
    multipliers.customColors = 1.25;
  }

  // Calculate base sum from breakdown
  const breakdownSum = Object.values(breakdown).reduce(
    (sum, cost) => sum + cost,
    0
  );

  // Calculate total with multipliers
  let totalMultiplier = 1;
  Object.values(multipliers).forEach((mult) => {
    totalMultiplier *= mult;
  });

  // Calculate final cost with multiplier
  let finalCost = breakdownSum * totalMultiplier;

  // Apply minimum and maximum bounds
  finalCost = Math.max(5, Math.ceil(finalCost));
  finalCost = Math.min(finalCost, isRefinement ? 25 : 50);

  // Generate estimate description
  let estimate = "";
  if (finalCost <= 8) {
    estimate = "Simple";
  } else if (finalCost <= 15) {
    estimate = "Standard";
  } else if (finalCost <= 25) {
    estimate = "Complex";
  } else {
    estimate = "Premium";
  }

  // Calculate base token without multipliers for display
  const baseTokens = breakdownSum;

  return {
    cost: finalCost,
    breakdown: {
      ...breakdown,
      baseTokens,
      totalMultiplier: parseFloat(totalMultiplier.toFixed(2)),
      multipliers,
    },
    estimate,
    wordCount,
    complexity: {
      level: estimate.toLowerCase(),
      score: Math.min(finalCost / 50, 1), // 0 to 1 score
    },
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
    refinementDiscount: "Refinement discount",
    promptComplexity: "Prompt complexity",
    specialFeatures: "Special features",
    templateComplexity: "Template type",
    audienceComplexity: "Target audience",
    sections: "Additional sections",
    layoutComplexity: "Layout complexity",
    imageStyle: "Image style",
    frameworkComplexity: "Framework",
    colorPalette: "Color palette",
    advancedFeatures: "Advanced features",
    darkMode: "Dark mode",
    styleComplexity: "Style complexity",
    customColors: "Custom colors",
  };

  const display = Object.entries(breakdown)
    .filter(
      ([key, cost]) =>
        key !== "baseTokens" &&
        key !== "totalMultiplier" &&
        key !== "multipliers" &&
        cost !== 0
    )
    .map(([key, cost]) => ({
      label: labels[key] || key,
      cost: Math.abs(cost),
      type: cost > 0 ? "addition" : "discount",
      value: cost,
    }));

  // Sort: discounts first, then additions
  display.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "discount" ? -1 : 1;
    }
    return b.cost - a.cost;
  });

  return display;
}

/**
 * Calculate cost for specific edit type
 * @param {string} changeType - Type of change
 * @param {Object} options - Additional options
 * @returns {number}
 */
export function calculateEditCost(changeType, options = {}) {
  const baseCosts = {
    color: 2,
    font: 1,
    style: 3,
    layout: 5,
    content: 4,
    sections: 3,
    images: 2,
    framework: 6,
    responsive: 4,
    accessibility: 3,
    performance: 4,
    seo: 2,
  };

  let cost = baseCosts[changeType] || 2;

  // Apply multipliers based on complexity
  if (options.isMajorChange) cost *= 1.5;
  if (options.affectsResponsiveness) cost *= 1.3;
  if (options.requiresNewSections) cost += 2;

  return Math.ceil(Math.max(1, cost));
}

/**
 * Estimate tokens needed for a session
 * @param {Object} options
 * @returns {{ min: number, max: number, typical: number, breakdown: Object }}
 */
export function estimateSessionTokens(options = {}) {
  const {
    generations = 1,
    refinements = 2,
    colorEdits = 3,
    layoutEdits = 1,
    contentEdits = 4,
    complexity = "standard", // 'simple', 'standard', 'complex'
  } = options;

  const complexityMultipliers = {
    simple: 0.7,
    standard: 1,
    complex: 1.5,
  };

  const multiplier = complexityMultipliers[complexity] || 1;

  // Base estimates per operation
  const baseGeneration = 15;
  const baseRefinement = 8;
  const baseColorEdit = 2;
  const baseLayoutEdit = 5;
  const baseContentEdit = 4;

  // Calculate min, max, typical
  const min = Math.ceil(
    (generations * baseGeneration * 0.6 +
      refinements * baseRefinement * 0.5 +
      colorEdits * baseColorEdit * 0.5 +
      layoutEdits * baseLayoutEdit * 0.5 +
      contentEdits * baseContentEdit * 0.5) *
      multiplier
  );

  const max = Math.ceil(
    (generations * baseGeneration * 1.5 +
      refinements * baseRefinement * 1.5 +
      colorEdits * baseColorEdit * 2 +
      layoutEdits * baseLayoutEdit * 2 +
      contentEdits * baseContentEdit * 2) *
      multiplier
  );

  const typical = Math.ceil(
    (generations * baseGeneration +
      refinements * baseRefinement +
      colorEdits * baseColorEdit +
      layoutEdits * baseLayoutEdit +
      contentEdits * baseContentEdit) *
      multiplier
  );

  const breakdown = {
    generations: Math.ceil(generations * baseGeneration * multiplier),
    refinements: Math.ceil(refinements * baseRefinement * multiplier),
    colorEdits: Math.ceil(colorEdits * baseColorEdit * multiplier),
    layoutEdits: Math.ceil(layoutEdits * baseLayoutEdit * multiplier),
    contentEdits: Math.ceil(contentEdits * baseContentEdit * multiplier),
    complexityMultiplier: multiplier,
  };

  return {
    min,
    max,
    typical,
    breakdown,
  };
}

/**
 * Format token cost for display
 * @param {number} cost
 * @returns {string}
 */
export function formatTokenCost(cost) {
  if (cost === 1) return "1 token";
  if (cost < 1) return `${cost.toFixed(1)} token`;
  return `${Math.ceil(cost)} tokens`;
}

/**
 * Check if user has enough tokens
 * @param {number} available - Available tokens
 * @param {number} required - Required tokens
 * @returns {{ sufficient: boolean, deficit: number, percentage: number }}
 */
export function checkTokenBalance(available, required) {
  const deficit = Math.max(0, required - available);
  const percentage = (available / required) * 100;

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
 * Get recommended package based on usage
 * @param {number} tokensNeeded
 * @param {string} usageType - 'one-time', 'monthly', 'frequent'
 * @returns {{ id: string, name: string, tokens: number, price: string, description: string }}
 */
export function getRecommendedPackage(tokensNeeded, usageType = "one-time") {
  const packages = {
    oneTime: [
      {
        id: "starter",
        name: "Starter Pack",
        tokens: 50,
        price: "$5",
        description: "For small projects",
      },
      {
        id: "creator",
        name: "Creator Pack",
        tokens: 150,
        price: "$12",
        description: "For portfolio sites",
      },
      {
        id: "pro",
        name: "Pro Pack",
        tokens: 400,
        price: "$25",
        description: "For business websites",
      },
      {
        id: "business",
        name: "Business Pack",
        tokens: 1000,
        price: "$50",
        description: "For complex projects",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        tokens: 2500,
        price: "$100",
        description: "For large-scale projects",
      },
    ],
    monthly: [
      {
        id: "basic-monthly",
        name: "Basic",
        tokens: 100,
        price: "$9/month",
        description: "For occasional use",
      },
      {
        id: "standard-monthly",
        name: "Standard",
        tokens: 300,
        price: "$24/month",
        description: "For regular creators",
      },
      {
        id: "pro-monthly",
        name: "Pro",
        tokens: 800,
        price: "$45/month",
        description: "For professionals",
      },
      {
        id: "team-monthly",
        name: "Team",
        tokens: 2000,
        price: "$90/month",
        description: "For teams and agencies",
      },
    ],
  };

  const packageList =
    usageType === "monthly" ? packages.monthly : packages.oneTime;

  // Find the smallest package that covers the need with at least 20% buffer
  const targetTokens = tokensNeeded * 1.2;

  for (const pkg of packageList) {
    if (pkg.tokens >= targetTokens) {
      return {
        ...pkg,
        coverage: Math.min(100, Math.round((pkg.tokens / tokensNeeded) * 100)),
        estimatedUses: Math.floor(pkg.tokens / tokensNeeded),
      };
    }
  }

  // Return largest if nothing else fits
  const largest = packageList[packageList.length - 1];
  return {
    ...largest,
    coverage: Math.min(100, Math.round((largest.tokens / tokensNeeded) * 100)),
    estimatedUses: Math.floor(largest.tokens / tokensNeeded),
  };
}

/**
 * Calculate savings for bulk packages
 * @param {number} tokenAmount
 * @param {number} price
 * @returns {{ pricePerToken: number, savingsPercentage: number }}
 */
export function calculatePackageSavings(tokenAmount, price) {
  // Remove $ sign and convert to number
  const priceNum = parseFloat(price.replace(/[^0-9.-]+/g, ""));
  const pricePerToken = priceNum / tokenAmount;

  // Compare to standard rate of $0.10 per token
  const standardPrice = tokenAmount * 0.1;
  const savings = standardPrice - priceNum;
  const savingsPercentage = Math.round((savings / standardPrice) * 100);

  return {
    pricePerToken: parseFloat(pricePerToken.toFixed(4)),
    savingsPercentage: Math.max(0, savingsPercentage),
    savingsAmount: parseFloat(savings.toFixed(2)),
  };
}

/**
 * Predict token usage based on user behavior
 * @param {Array} history - Array of previous token usage
 * @returns {{ dailyAverage: number, weeklyEstimate: number, monthlyEstimate: number }}
 */
export function predictTokenUsage(history = []) {
  if (history.length === 0) {
    return {
      dailyAverage: 15,
      weeklyEstimate: 105,
      monthlyEstimate: 450,
      confidence: "low",
    };
  }

  // Calculate average daily usage
  const totalTokens = history.reduce((sum, usage) => sum + usage.tokens, 0);
  const days = Math.max(1, history.length);
  const dailyAverage = Math.ceil(totalTokens / days);

  // Calculate trend (simple linear regression)
  const xValues = history.map((_, i) => i);
  const yValues = history.map((usage) => usage.tokens);

  const n = xValues.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const trend =
    slope > 0.5 ? "increasing" : slope < -0.5 ? "decreasing" : "stable";

  // Calculate estimates with trend adjustment
  const weeklyEstimate = Math.ceil(dailyAverage * 7 * (1 + slope * 0.5));
  const monthlyEstimate = Math.ceil(dailyAverage * 30 * (1 + slope * 0.3));

  // Calculate confidence based on data points
  const confidence =
    history.length >= 7 ? "high" : history.length >= 3 ? "medium" : "low";

  return {
    dailyAverage,
    weeklyEstimate,
    monthlyEstimate,
    trend,
    confidence,
    dataPoints: history.length,
  };
}

export default {
  calculateTokenCost,
  getBreakdownDisplay,
  calculateEditCost,
  estimateSessionTokens,
  formatTokenCost,
  checkTokenBalance,
  getRecommendedPackage,
  calculatePackageSavings,
  predictTokenUsage,
};
