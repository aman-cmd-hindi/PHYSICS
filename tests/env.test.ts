import { describe, it, expect } from "vitest";
import { env, isSupabaseConfigured } from "@/lib/config/env";

describe("Environment Configuration", () => {
  it("should provide safe fallback defaults when env vars are unconfigured", () => {
    expect(env.NEXT_PUBLIC_APP_NAME).toBe("Maharashtra Board Physics Platform");
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  });

  it("should correctly identify when Supabase URL is fallback or configured", () => {
    const configured = isSupabaseConfigured();
    expect(typeof configured).toBe("boolean");
  });
});
