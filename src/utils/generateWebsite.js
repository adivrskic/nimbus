// utils/generateWebsite.js - Updated to pass persistentOptions
import { supabase } from "../lib/supabaseClient";

/**
 * Calls the Supabase Edge Function to generate a website
 * @param {Object} params
 * @param {string} params.prompt - The generation prompt
 * @param {Object} params.selections - Customization options (design choices)
 * @param {Object} params.persistentOptions - Persistent options (brand, contact, business info)
 * @param {boolean} params.isRefinement - Whether this is a refinement/enhancement
 * @param {string} params.existingCode - Previous HTML for refinements
 * @returns {Promise<{code: string, tokensUsed: number, tokensRemaining: number}>}
 */
export async function generateWebsite({
  prompt,
  selections = {},
  persistentOptions = {},
  isRefinement = false,
  existingCode = null,
}) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "generate-website",
      {
        body: {
          prompt,
          customization: selections,
          persistentOptions, // NEW: Pass persistent options
          isRefinement,
          previousHtml: existingCode,
        },
      }
    );

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Generation failed");
    }

    if (!data.success) {
      // Handle specific error cases
      if (data.error === "Insufficient tokens") {
        const err = new Error("Insufficient tokens");
        err.code = "INSUFFICIENT_TOKENS";
        err.required = data.required;
        err.available = data.available;
        throw err;
      }
      throw new Error(data.error || "Generation failed");
    }

    return {
      code: data.html,
      tokensUsed: data.tokensUsed,
      tokensRemaining: data.tokensRemaining,
      breakdown: data.breakdown,
    };
  } catch (err) {
    console.error("generateWebsite error:", err);
    throw err;
  }
}

export default generateWebsite;
