import { supabase } from "../lib/supabaseClient";
import { parseMultiPageHtml } from "./parseMultiPage";

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

  let fullHtml = "";
  let parsedFiles = null;

  let currentPhase = "head";

  const detectPhase = (content) => {
    if (content.includes("</body>")) currentPhase = "complete";
    else if (content.includes("<body")) currentPhase = "body";
    return currentPhase;
  };

  const updateFiles = () => {
    const files = parseMultiPageHtml(fullHtml);
    if (files) {
      parsedFiles = files;
    }
    return parsedFiles;
  };

  return {
    async *chunks() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullHtml += chunk;

          const phase = detectPhase(fullHtml);

          const files = updateFiles();

          if (onChunk) onChunk(chunk);
          if (onProgress) onProgress({ phase, content: fullHtml, files });

          yield chunk;
        }
      } finally {
        reader.releaseLock();
      }
    },

    getFullHtml() {
      return fullHtml;
    },

    getFiles() {
      updateFiles();
      return parsedFiles;
    },

    isMultiPage() {
      updateFiles();
      return parsedFiles !== null && Object.keys(parsedFiles).length > 1;
    },

    reset() {
      fullHtml = "";
      parsedFiles = null;
      currentPhase = "head";
    },
  };
}

export default generateWebsiteStream;
