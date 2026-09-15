"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { roleHomePath } from "@/lib/auth";
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation/auth";

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export type AuthActionState = { error?: string } | null;

/**
 * Shared sign-in for the member portal and trainer area — unlike the CMS's own
 * admin/actions/auth.ts (which always sends staff to /admin), this looks up the signed-in
 * profile's role and redirects to /mitglied, /trainer, or /admin accordingly, so one login
 * page works for every role.
 */
export async function signInSharedAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return { error: "E-Mail-Adresse oder Passwort ist falsch." };
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
  if (!profile) {
    await supabase.auth.signOut();
    return { error: "Zu diesem Konto existiert kein Profil. Bitte an den Sportpark wenden." };
  }

  const next = formData.get("next");
  const target = typeof next === "string" && next.startsWith("/") ? next : roleHomePath(profile.role);
  redirect(target);
}

/**
 * Signs in as the seeded demo account for the given portal role. Reads the demo credentials
 * from server-only env vars (DEMO_MEMBER_EMAIL/PASSWORD, DEMO_TRAINER_EMAIL/PASSWORD) — never
 * hardcoded in source, and unset by default, so this fails with a clear message until an admin
 * sets them.
 */
export async function demoSignInAction(role: "mitglied" | "trainer"): Promise<void> {
  const email = role === "mitglied" ? process.env.DEMO_MEMBER_EMAIL : process.env.DEMO_TRAINER_EMAIL;
  const password = role === "mitglied" ? process.env.DEMO_MEMBER_PASSWORD : process.env.DEMO_TRAINER_PASSWORD;
  if (!email || !password) {
    redirect("/login?error=demo_not_configured");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=demo_not_configured");
  }

  redirect(role === "mitglied" ? "/mitglied/training" : "/trainer");
}

export async function signOutSharedAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordResetSharedAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  // Never reveal whether the address exists — same response either way.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  return { error: undefined };
}

export async function resetPasswordSharedAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error || !userData.user) {
    return { error: "Passwort konnte nicht geändert werden. Bitte den Link erneut anfordern." };
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).single();
  redirect(profile ? roleHomePath(profile.role) : "/login");
}
