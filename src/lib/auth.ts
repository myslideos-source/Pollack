import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Profile = Tables<"profiles">;

/**
 * Reads the current session's user + profile (role) server-side. Returns null when signed
 * out — callers decide whether that's an error (requireStaff/requireAdmin) or a valid state
 * (e.g. the public site).
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return profile;
}

/** For any /admin page reachable by both roles. Redirects to login if not signed in. */
export async function requireStaff(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");
  return profile;
}

/** For admin-only pages (Benutzerverwaltung, Einstellungen). Redirects Redakteure to the dashboard. */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireStaff();
  if (profile.role !== "admin") redirect("/admin?error=forbidden");
  return profile;
}
