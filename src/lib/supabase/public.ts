import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Stateless, anonymous Supabase client for public content reads — the live website_sections,
 * contact/hours, partners/products, offers, and media tables all already grant SELECT to the
 * `anon` role via RLS, so an anonymous visitor gets identical data whether or not the request
 * carries session cookies. Deliberately built with the plain @supabase/supabase-js client
 * instead of @supabase/ssr's createServerClient (see lib/supabase/server.ts), which always reads
 * next/headers' cookies() to forward the signed-in user's session — cookies()/headers() are
 * Next.js "Dynamic APIs": calling either one, whether or not a cookie is actually present, forces
 * that route to render dynamically on every request instead of being statically cached. Using
 * this client for public reads is what lets those pages be served from cache.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
