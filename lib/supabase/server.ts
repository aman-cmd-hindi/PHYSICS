import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/config/env";

export async function createClient() {
  const cookieStore = await cookies();

  const url = isSupabaseConfigured()
    ? env.NEXT_PUBLIC_SUPABASE_URL
    : "https://placeholder-project.supabase.co";
  const anonKey = isSupabaseConfigured()
    ? env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : "placeholder-anon-key";

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components cannot always set cookies directly
        }
      },
    },
  });
}
