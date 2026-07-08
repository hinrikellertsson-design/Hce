import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient<Database> | null = null;

// Returns null when env vars are missing so pages can show a setup message
// instead of crashing during the build/deploy step before Supabase is wired up.
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient<Database>(url!, anonKey!, {
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }
  return client;
}
