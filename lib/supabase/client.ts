import { createBrowserClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/config/env";
import { Database } from "./database.types";

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Return mock-friendly browser client configuration
    return createBrowserClient<Database>(
      "https://placeholder-project.supabase.co",
      "placeholder-anon-key"
    );
  }

  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
