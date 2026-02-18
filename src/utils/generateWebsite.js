import { supabase } from "../lib/supabaseClient";
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
          persistentOptions,
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
