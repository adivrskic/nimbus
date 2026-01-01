import { supabase } from "../lib/supabaseClient";

/**
 * Normalizes streamed HTML by moving styles from body to head
 * This is called after streaming completes to produce clean final HTML
 */
function normalizeStreamedHtml(html) {
  // Extract styles block using markers
  const styleMatch = html.match(
    /<!--\s*STYLES_START\s*-->([\s\S]*?)<!--\s*STYLES_END\s*-->/i
  );

  if (!styleMatch) {
    // No markers found, check for style tag in body and move it
    const bodyStyleMatch = html.match(
      /(<body[^>]*>[\s\S]*?)(<style[\s\S]*?<\/style>)([\s\S]*<\/body>)/i
    );

    if (bodyStyleMatch) {
      const [, beforeStyle, styleTag, afterStyle] = bodyStyleMatch;
      // Move style to head
      return html
        .replace(styleTag, "")
        .replace("</head>", `${styleTag}\n</head>`);
    }

    return html;
  }

  const styleBlock = styleMatch[1].trim();

  // Remove style block and markers from body
  let normalized = html.replace(
    /<!--\s*STYLES_START\s*-->[\s\S]*?<!--\s*STYLES_END\s*-->/i,
    ""
  );

  // Insert styles into head (before </head>)
  normalized = normalized.replace("</head>", `${styleBlock}\n</head>`);

  // Clean up any extra whitespace
  normalized = normalized.replace(/\n\s*\n\s*\n/g, "\n\n");

  return normalized;
}

/**
 * Generates a website via streaming from the edge function
 * @param {Object} params
 * @param {string} params.prompt - The generation prompt
 * @param {Object} params.customization - Customization options (may include isRefinement, previousHtml)
 * @param {AbortSignal} params.signal - AbortController signal for cancellation
 * @param {Function} params.onChunk - Optional callback for each chunk (raw)
 * @param {Function} params.onProgress - Optional callback with { phase, content } for UI updates
 * @returns {Promise<{ chunks: AsyncGenerator, getFullHtml: Function, getNormalizedHtml: Function }>}
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

  // Phase detection for progress callbacks
  let currentPhase = "head";

  const detectPhase = (content) => {
    if (content.includes("<body")) currentPhase = "body";
    if (content.includes("STYLES_START") || content.includes("<style"))
      currentPhase = "styles";
    if (content.includes("<script")) currentPhase = "scripts";
    if (content.includes("</body>")) currentPhase = "complete";
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
     */
    getFullHtml() {
      return fullHtml;
    },

    /**
     * Get normalized HTML with styles moved to head (call after streaming completes)
     */
    getNormalizedHtml() {
      return normalizeStreamedHtml(fullHtml);
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

/**
 * Helper to create a minimal shell for displaying body content during streaming
 * Use this when you want to show content before styles arrive
 */
export function createStreamingShell(bodyContent, options = {}) {
  const { darkMode = false, fontFamily = "system-ui, sans-serif" } = options;

  const bgColor = darkMode ? "#0a0a0a" : "#fafafa";
  const textColor = darkMode ? "#e5e5e5" : "#171717";
  const cardBg = darkMode ? "#171717" : "#ffffff";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading...</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${fontFamily};
      background: ${bgColor};
      color: ${textColor};
      line-height: 1.6;
      min-height: 100vh;
    }
    section, header, footer, nav, main, article, aside {
      padding: 20px;
      margin: 10px;
      background: ${cardBg};
      border-radius: 8px;
    }
    img { max-width: 100%; height: auto; background: #ddd; }
    h1, h2, h3, h4, h5, h6 { margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    a { color: inherit; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

export default generateWebsiteStream;
