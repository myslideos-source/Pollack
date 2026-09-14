"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { inviteUserSchema } from "@/lib/validation/auth";

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

async function logAudit(actorId: string, action: string, entityId: string | undefined, summary: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({ actor_id: actorId, action, entity_type: "user", entity_id: entityId, summary });
}

export async function inviteUserAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData,
): Promise<{ error?: string; success?: string }> {
  const profile = await requireAdmin();
  const parsed = inviteUserSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const { email, fullName, role } = parsed.data;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error:
        "Diese Aktion erfordert den Supabase Service-Role-Key (SUPABASE_SERVICE_ROLE_KEY) in der Serverumgebung. " +
        "Siehe SUPABASE_SETUP.md.",
    };
  }

  const origin = await getOrigin();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo: `${origin}/admin/reset-password`,
  });
  if (error || !data.user) {
    return { error: "Einladung konnte nicht versendet werden. Ist die E-Mail-Adresse bereits vergeben?" };
  }

  const supabase = await createClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, email, full_name: fullName, role });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: "Profil konnte nicht angelegt werden. Die Einladung wurde zurückgenommen." };
  }

  await logAudit(profile.id, "user.invited", data.user.id, `Nutzer eingeladen: ${fullName} (${email}, ${role})`);
  revalidatePath("/admin/benutzer");
  return { success: `Einladung an ${email} wurde versendet.` };
}

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "redakteur"]),
});

export async function updateUserRoleAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireAdmin();
  const parsed = roleSchema.safeParse({ userId: formData.get("userId"), role: formData.get("role") });
  if (!parsed.success) return { error: "Ungültige Eingabe." };
  if (parsed.data.userId === profile.id) return { error: "Die eigene Rolle kann nicht geändert werden." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role: parsed.data.role }).eq("id", parsed.data.userId);
  if (error) return { error: "Rolle konnte nicht geändert werden." };

  await logAudit(profile.id, "user.role_changed", parsed.data.userId, `Rolle geändert auf: ${parsed.data.role}`);
  revalidatePath("/admin/benutzer");
  return {};
}

export async function deleteUserAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireAdmin();
  const userId = formData.get("userId");
  if (typeof userId !== "string") return { error: "Ungültige Eingabe." };
  if (userId === profile.id) return { error: "Der eigene Account kann nicht gelöscht werden." };

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error:
        "Diese Aktion erfordert den Supabase Service-Role-Key (SUPABASE_SERVICE_ROLE_KEY) in der Serverumgebung. " +
        "Siehe SUPABASE_SETUP.md.",
    };
  }

  const supabase = await createClient();
  const { data: target } = await supabase.from("profiles").select("full_name, email").eq("id", userId).single();

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: "Nutzer konnte nicht gelöscht werden." };

  await logAudit(profile.id, "user.deleted", userId, `Nutzer gelöscht: ${target?.full_name ?? ""} (${target?.email ?? ""})`);
  revalidatePath("/admin/benutzer");
  return {};
}
