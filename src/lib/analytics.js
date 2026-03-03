import { supabase } from "./supabaseClient";

export async function track(event, data = {}, userId = null) {
  try {
    await supabase.from("events").insert({
      user_id: userId,
      event,
      data,
    });
  } catch (e) {
    console.error("Analytics error: ", e);
  }
}
