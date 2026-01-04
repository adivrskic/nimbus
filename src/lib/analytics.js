import { supabase } from "./supabaseClient";

export async function track(event, data = {}) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("events").insert({
      user_id: user?.id || null,
      event,
      data,
    });
  } catch (e) {
    console.error("Analytics error:", e);
  }
}

// Usage examples:
// track('generate', { prompt: 'landing page for bakery' })
// track('enhance', { prompt: 'make it blue' })
// track('download')
// track('save')
// track('deploy')
