import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/config/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isTutorRoute = pathname.startsWith("/tutor");

  // If Supabase is not configured in local offline mode:
  // Allow development navigation, but log security warning if privileged routes are accessed.
  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Server-side route authorization: /admin/** and /tutor/**
  if (isAdminRoute || isTutorRoute) {
    if (!user) {
      // 401 Unauthorized: Redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("error", "Unauthorized: Login required");
      return NextResponse.redirect(url, { status: 302 });
    }

    // Resolve user's actual database role server-side
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = profile?.role || "student";

    if (isAdminRoute) {
      const allowedAdminRoles = ["admin", "content_manager", "admin/content_manager"];
      if (!allowedAdminRoles.includes(userRole)) {
        // 403 Forbidden
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("error", "Forbidden: Admin privileges required");
        return NextResponse.redirect(url, { status: 302 });
      }
    }

    if (isTutorRoute) {
      const allowedTutorRoles = ["tutor", "admin", "content_manager", "admin/content_manager"];
      if (!allowedTutorRoles.includes(userRole)) {
        // 403 Forbidden
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("error", "Forbidden: Tutor privileges required");
        return NextResponse.redirect(url, { status: 302 });
      }
    }
  }

  return supabaseResponse;
}
