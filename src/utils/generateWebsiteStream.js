// utils/generateWebsiteStream.js - With multi-page parsing support
import { supabase } from "../lib/supabaseClient";

/**
 * Parse multi-page HTML response with file markers
 * Handles both: <!-- FILE: name.html --> and <!-- ========== FILE: name.html ========== -->
 */
function parseMultiPageResponse(html) {
  if (!html) return null;

  const filePattern = /<!--\s*(?:=+\s*)?FILE:\s*(\S+\.html)\s*(?:=+\s*)?-->/gi;
  const parts = html.split(filePattern);

  if (parts.length <= 1) return null;

  const files = {};
  for (let i = 1; i < parts.length; i += 2) {
    const filename = parts[i]?.trim();
    const content = parts[i + 1]?.trim();
    if (filename && content) {
      // Clean up the content - remove any leading/trailing whitespace and ensure proper HTML
      let cleanContent = content.trim();

      // If content doesn't start with <!DOCTYPE or <html, it might be incomplete
      // But we still add it to allow incremental display during streaming
      files[filename] = cleanContent;
    }
  }

  return Object.keys(files).length > 0 ? files : null;
}

/**
 * Generates a website via streaming from the edge function
 * With inline styles, no normalization needed - content is styled as it streams
 *
 * @param {Object} params
 * @param {string} params.prompt - The generation prompt
 * @param {Object} params.customization - Customization options (may include isRefinement, previousHtml)
 * @param {Object} params.persistentOptions - Persistent options (brand, contact, business info)
 * @param {AbortSignal} params.signal - AbortController signal for cancellation
 * @param {Function} params.onChunk - Optional callback for each chunk (raw)
 * @param {Function} params.onProgress - Optional callback with { phase, content, files } for UI updates
 * @returns {Promise<{ chunks: AsyncGenerator, getFullHtml: Function, getFiles: Function }>}
 */
export async function generateWebsiteStream({
  prompt,
  customization = {},
  persistentOptions = {},
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
        persistentOptions,
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
  // Parsed files for multi-page sites
  let parsedFiles = null;

  // Phase detection - simplified since styles are inline
  let currentPhase = "head";

  const detectPhase = (content) => {
    if (content.includes("</body>")) currentPhase = "complete";
    else if (content.includes("<body")) currentPhase = "body";
    return currentPhase;
  };

  // Check for multi-page content and parse files
  const updateFiles = () => {
    const files = parseMultiPageResponse(fullHtml);
    if (files) {
      parsedFiles = files;
    }
    return parsedFiles;
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

          // Update parsed files
          const files = updateFiles();

          // Call optional callbacks
          if (onChunk) onChunk(chunk);
          if (onProgress) onProgress({ phase, content: fullHtml, files });

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
     * Get parsed files for multi-page sites
     * Returns null for single-page sites
     */
    getFiles() {
      // Final parse to ensure we have the complete files
      updateFiles();
      return parsedFiles;
    },

    /**
     * Check if this is a multi-page site
     */
    isMultiPage() {
      updateFiles();
      return parsedFiles !== null && Object.keys(parsedFiles).length > 1;
    },

    /**
     * Reset the accumulator (useful if reusing the stream object)
     */
    reset() {
      fullHtml = "";
      parsedFiles = null;
      currentPhase = "head";
    },
  };
}

export default generateWebsiteStream;
