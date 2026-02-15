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
