import { supabase } from "../lib/supabaseClient";

export async function generateWebsiteStream({
  prompt,
  customization = {},
  signal,
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("helloooo");

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-website`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, customization, stream: true }),
      signal,
    }
  );

  if (!response.ok || !response.body)
    throw new Error(`HTTP ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return {
    async *chunks() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          yield decoder.decode(value, { stream: true });
        }
      } finally {
        reader.releaseLock();
      }
    },
  };
}
