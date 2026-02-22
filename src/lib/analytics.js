import { supabase } from "./supabaseClient";

/**
 * Track an analytics event.
 * @param {string} event - Event name
 * @param {Object} data - Event data
 * @param {string|null} userId - Optional user ID. Pass from context to avoid
 *   an extra auth round-trip on every call. Falls back to null (anonymous).
 */
export async function track(event, data = {}, userId = null) {
  try {
    await supabase.from("events").insert({
      user_id: userId,
      event,
      data,
    });
  } catch (e) {
    // Silently swallow — analytics should never break the app
  }
}
