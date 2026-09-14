"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  notificationEmail: z.string().trim().min(1, "E-Mail-Adresse erforderlich.").email("Ungültige E-Mail-Adresse."),
});

export async function saveNotificationEmailAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireAdmin();
  const parsed = schema.safeParse({ notificationEmail: formData.get("notificationEmail") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert(
    { key: "notification_email", value: parsed.data.notificationEmail, updated_by: profile.id },
    { onConflict: "key" },
  );
  if (error) return { error: "Einstellung konnte nicht gespeichert werden." };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "settings.updated",
    entity_type: "site_settings",
    summary: `Benachrichtigungs-E-Mail geändert auf: ${parsed.data.notificationEmail}`,
  });

  revalidatePath("/admin/einstellungen");
  return {};
}
