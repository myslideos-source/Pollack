import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Server-side Supabase client for Server Components, Server Actions, and Route Handlers.
 * Reads/writes the user's session via cookies and still uses only the anon key — every query
 * this client makes is subject to RLS exactly as if the browser had made it. This is the
 * client admin pages and server actions should use for anything a signed-in user is allowed
 * to do; never use the service-role client for that.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component (not a Server Action/Route Handler) — cookies
            // can't be written there. Harmless as long as middleware also refreshes the
            // session, which it does (see middleware.ts).
          }
        },
      },
    },
  );
}
