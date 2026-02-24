import {
  BASE_COST,
  REFINEMENT_MIN,
  REFINEMENT_MAX,
  GENERATION_MIN,
  GENERATION_MAX,
  COST_MAPS,
  CONDITIONAL_KEYS,
  BREAKDOWN_LABELS,
} from "./tokenCosts";

export function calculateTokenCost(
  prompt = "",
  selections = {},
  isRefinement = false
) {
  const breakdown = {};

  // Base cost
  breakdown.base = BASE_COST;

  // Prompt complexity
  const safePrompt = typeof prompt === "string" ? prompt : String(prompt ?? "");
  const wordCount = safePrompt
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  if (wordCount <= 10) breakdown.promptComplexity = 0;
  else if (wordCount <= 50) breakdown.promptComplexity = 2;
  else if (wordCount <= 150) breakdown.promptComplexity = 3;
  else breakdown.promptComplexity = 5;

  // Refinements use simplified cost
  if (isRefinement) {
    const totalCost = breakdown.base + breakdown.promptComplexity;
    const finalCost = Math.min(
      Math.max(REFINEMENT_MIN, totalCost),
      REFINEMENT_MAX
    );

    let estimate = "";
    if (finalCost <= 7) estimate = "Simple";
    else if (finalCost <= 12) estimate = "Standard";
    else estimate = "Complex";

    return { cost: finalCost, breakdown, estimate, wordCount };
  }

  // Look up cost for each option from the shared cost maps
  for (const [key, costMap] of Object.entries(COST_MAPS)) {
    const isConditional = CONDITIONAL_KEYS.includes(key);

    if (isConditional) {
      // Only add cost if the selection is explicitly set
      if (selections[key]) {
        breakdown[key] = costMap[selections[key]] ?? 0;
      }
    } else {
      breakdown[key] = costMap[selections[key]] ?? 0;
    }
  }

  // Special cases not covered by simple map lookups

  // Custom colors
  if (selections.palette === "Custom") {
    breakdown.customColors = 2;
  }
  // Dark mode
  if (selections.mode === "Dark") {
    breakdown.darkMode = 2;
  }
  // Section count
  const sectionCount = (selections.sections || []).length;
  breakdown.sections =
    sectionCount > 4 ? Math.ceil((sectionCount - 4) * 0.75) : 0;
  // Sticky elements
  const stickyCount = (selections.stickyElements || []).length;
  breakdown.stickyElements = stickyCount > 0 ? Math.min(stickyCount * 1, 3) : 0;

  // Calculate total
  const totalCost = Object.values(breakdown).reduce(
    (sum, cost) => sum + (cost || 0),
    0
  );
  const finalCost = Math.min(
    Math.max(GENERATION_MIN, totalCost),
    GENERATION_MAX
  );

  let estimate = "";
  if (finalCost <= 12) estimate = "Simple";
  else if (finalCost <= 22) estimate = "Standard";
  else if (finalCost <= 35) estimate = "Complex";
  else estimate = "Premium";

  return { cost: finalCost, breakdown, estimate, wordCount };
}

export function getBreakdownDisplay(breakdown) {
  return Object.entries(breakdown)
    .filter(([, cost]) => cost !== 0 && cost !== undefined)
    .map(([key, cost]) => ({
      label: BREAKDOWN_LABELS[key] || key,
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
