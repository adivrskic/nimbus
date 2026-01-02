import { supabase } from "../lib/supabaseClient";

/**
 * Generates a website via streaming from the edge function
 * With inline styles, no normalization needed - content is styled as it streams
 *
 * @param {Object} params
 * @param {string} params.prompt - The generation prompt
 * @param {Object} params.customization - Customization options (may include isRefinement, previousHtml)
 * @param {AbortSignal} params.signal - AbortController signal for cancellation
 * @param {Function} params.onChunk - Optional callback for each chunk (raw)
 * @param {Function} params.onProgress - Optional callback with { phase, content } for UI updates
 * @returns {Promise<{ chunks: AsyncGenerator, getFullHtml: Function }>}
 */
export async function generateWebsiteStream({
  prompt,
  customization = {},
  signal,
  onChunk,
  onProgress,
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Extract refinement params from customization if present
  const { isRefinement, previousHtml, ...restCustomization } = customization;

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-website`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        customization: restCustomization,
        isRefinement: isRefinement || false,
        previousHtml: previousHtml || null,
        stream: true,
      }),
      signal,
    }
  );

  if (!response.ok || !response.body) {
    throw new Error(`HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  // Accumulator for full HTML
  let fullHtml = "";

  // Phase detection - simplified since styles are inline
  let currentPhase = "head";

  const detectPhase = (content) => {
    if (content.includes("</body>")) currentPhase = "complete";
    else if (content.includes("<body")) currentPhase = "body";
    return currentPhase;
  };

  return {
    /**
     * Async generator that yields chunks as they arrive
     */
    async *chunks() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullHtml += chunk;

          // Detect phase for progress reporting
          const phase = detectPhase(fullHtml);

          // Call optional callbacks
          if (onChunk) onChunk(chunk);
          if (onProgress) onProgress({ phase, content: fullHtml });

          yield chunk;
        }
      } finally {
        reader.releaseLock();
      }
    },

    /**
     * Get the full accumulated HTML (call after streaming completes)
     * With inline styles, no normalization needed
     */
    getFullHtml() {
      return fullHtml;
    },

    /**
     * Reset the accumulator (useful if reusing the stream object)
     */
    reset() {
      fullHtml = "";
      currentPhase = "head";
    },
  };
}

export default generateWebsiteStream;
