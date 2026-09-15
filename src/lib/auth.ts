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

/** For any /admin page reachable by both staff roles. Redirects to the shared login if not
 *  signed in, or away to the right area if signed in as a mitglied/trainer — role must be
 *  checked here, not just presence of a profile, now that non-staff roles exist too. */
export async function requireStaff(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/admin");
  if (profile.role !== "admin" && profile.role !== "redakteur") redirect(`${roleHomePath(profile.role)}?error=forbidden`);
  return profile;
}

/** For admin-only pages (Benutzerverwaltung, Einstellungen). Redirects Redakteure to the dashboard. */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireStaff();
  if (profile.role !== "admin") redirect("/admin?error=forbidden");
  return profile;
}

/** For any /mitglied page. Redirects to the shared login if not signed in, or if signed in as
 *  a different role — a trainer/admin browsing their own account should use /trainer or /admin. */
export async function requireMember(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/mitglied");
  if (profile.role !== "mitglied") redirect(`${roleHomePath(profile.role)}?error=forbidden`);
  return profile;
}

/** For any /trainer page. Admins may also access the trainer area (they see every member). */
export async function requireTrainerOrAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/trainer");
  if (profile.role !== "trainer" && profile.role !== "admin") redirect(`${roleHomePath(profile.role)}?error=forbidden`);
  return profile;
}

/** Where a freshly signed-in user should land, based on their role. */
export function roleHomePath(role: string): string {
  switch (role) {
    case "admin":
    case "redakteur":
      return "/admin";
    case "trainer":
      return "/trainer";
    case "mitglied":
      return "/mitglied/training";
    default:
      return "/";
  }
}
