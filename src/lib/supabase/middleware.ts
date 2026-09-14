import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

/**
 * Assigns the anonymous, random "sp_visitor" cookie used only to dedupe the admin dashboard's
 * weekly visitor count (see (site)/layout.tsx, which records one page_views row per request
 * against this id, and get_weekly_visitor_count(), which counts distinct ids). No PII, never
 * sent anywhere but this app, not set on /admin routes since staff visits shouldn't count.
 */
function ensureVisitorCookie(request: NextRequest, response: NextResponse): NextResponse {
  if (request.nextUrl.pathname.startsWith("/admin")) return response;
  if (request.cookies.get("sp_visitor")?.value) return response;
  response.cookies.set("sp_visitor", crypto.randomUUID(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

/**
 * Refreshes the Supabase session cookie on every request and enforces the /admin route guard.
 * Runs in middleware (the Edge runtime), so it never touches the service-role key — it only
 * checks whether a session exists and, for protected routes, whether that user has a staff
 * profile row. The real authorization boundary is still RLS on every table; this is the UX
 * layer that redirects unauthenticated visitors to the login page before they see admin UI.
 *
 * Runs on every route (see config.matcher in middleware.ts), so it must never throw: a missing
 * or misconfigured Supabase env var would otherwise crash the entire public site, not just
 * /admin. If Supabase can't be reached at all, public routes fail open (site stays up) while
 * /admin routes fail closed (redirect to login) — the safer default for a protected area.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isLoginRoute = pathname === "/admin/login";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[middleware] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY missing — see SUPABASE_SETUP.md");
    if (isAdminRoute) {
      const redirectUrl = new URL("/admin/login", request.url);
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return ensureVisitorCookie(request, NextResponse.next({ request }));
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isAdminRoute && !user) {
      const redirectUrl = new URL("/admin/login", request.url);
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (isLoginRoute && user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return ensureVisitorCookie(request, response);
  } catch (error) {
    console.error("[middleware] Supabase session refresh failed", error);
    if (isAdminRoute) {
      const redirectUrl = new URL("/admin/login", request.url);
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return ensureVisitorCookie(request, NextResponse.next({ request }));
  }
}
