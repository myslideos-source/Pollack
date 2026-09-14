import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Service-role Supabase client — bypasses RLS entirely. The `server-only` import makes any
 * accidental import from client code a build error, and every caller must additionally be a
 * Server Action or Route Handler that has already verified the requesting user is an admin
 * (RLS does not protect anything reached through this client).
 *
 * Used for exactly two things that Postgres RLS structurally cannot express: inviting a new
 * admin/editor user (auth.admin.inviteUserByEmail) and deleting a user's auth account
 * (auth.admin.deleteUser). Every other admin operation goes through the normal RLS-governed
 * server client in server.ts.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ist nicht gesetzt. Siehe SUPABASE_SETUP.md — ohne diesen " +
        "Wert können keine neuen Admin-Nutzer eingeladen oder gelöscht werden.",
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
