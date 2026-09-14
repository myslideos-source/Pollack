import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets, so the Supabase session cookie stays fresh
     * across the whole site — but the actual /admin redirect logic only fires on /admin/*
     * (see updateSession). Excludes Next internals and common static file extensions.
     */
    "/((?!_next/static|_next/image|favicon|apple-touch-icon|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico|mp4|mov)$).*)",
  ],
};
