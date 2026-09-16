"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, requireTrainerOrAdmin } from "@/lib/auth";

async function logAudit(actorId: string, action: string, entityId: string | undefined, summary: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({ actor_id: actorId, action, entity_type: "achievement", entity_id: entityId, summary });
}

const CATEGORIES = [
  "einstieg",
  "regelmaessigkeit",
  "training",
  "fortschritt",
  "beweglichkeit_gesundheit",
  "kurse",
  "kampfkunst",
  "mitgliedschaft",
  "trainer",
  "geheim",
] as const;

const achievementSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Nur Kleinbuchstaben, Ziffern und Bindestriche."),
  title: z.string().trim().min(1, "Titel erforderlich."),
  description: z.string().trim().min(1, "Beschreibung erforderlich."),
  category: z.enum(CATEGORIES),
  iconKey: z.string().trim().min(1),
  customIconMediaId: z.string().uuid().optional(),
  metricType: z.string().trim().min(1),
  threshold: z.coerce.number().optional(),
  tier: z.enum(["bronze", "silber", "gold", "platin"]).optional(),
  parentAchievementId: z.string().uuid().optional(),
  isManual: z.literal("on").optional(),
  isSecret: z.literal("on").optional(),
  isActive: z.literal("on").optional(),
  sortOrder: z.coerce.number().int().default(0),
  shareText: z.string().trim().optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
});

/**
 * Full catalog CRUD — admin only ("Nur Administratoren verwalten globale Erfolge"). There is no
 * delete action on purpose: an achievement that members may have already been awarded is only
 * ever deactivated (is_active = false), never removed, so history stays intact.
 */
export async function saveAchievementAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const profile = await requireAdmin();
  const parsed = achievementSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    iconKey: formData.get("iconKey"),
    customIconMediaId: formData.get("customIconMediaId") || undefined,
    metricType: formData.get("metricType"),
    threshold: formData.get("threshold") || undefined,
    tier: formData.get("tier") || undefined,
    parentAchievementId: formData.get("parentAchievementId") || undefined,
    isManual: formData.get("isManual") || undefined,
    isSecret: formData.get("isSecret") || undefined,
    isActive: formData.get("isActive") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    shareText: formData.get("shareText") || undefined,
    validFrom: formData.get("validFrom") || undefined,
    validUntil: formData.get("validUntil") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const payload = {
    slug: d.slug,
    title: d.title,
    description: d.description,
    category: d.category,
    icon_key: d.iconKey,
    custom_icon_media_id: d.customIconMediaId ?? null,
    metric_type: d.metricType,
    threshold: d.threshold ?? null,
    tier: d.tier ?? null,
    parent_achievement_id: d.parentAchievementId ?? null,
    is_manual: Boolean(d.isManual),
    is_secret: Boolean(d.isSecret),
    is_active: Boolean(d.isActive),
    sort_order: d.sortOrder,
    share_text: d.shareText ?? null,
    valid_from: d.validFrom ? new Date(d.validFrom).toISOString() : null,
    valid_until: d.validUntil ? new Date(d.validUntil).toISOString() : null,
  };

  if (d.id) {
    const { error } = await supabase.from("achievements").update(payload).eq("id", d.id);
    if (error) return { error: error.message.includes("duplicate") ? "Dieser Slug wird bereits verwendet." : "Erfolg konnte nicht gespeichert werden." };
    await logAudit(profile.id, "achievement.updated", d.id, `Erfolg aktualisiert: ${d.title}`);
    revalidatePath("/admin/erfolge");
    return { id: d.id };
  }

  const { data, error } = await supabase.from("achievements").insert(payload).select("id").single();
  if (error) return { error: error.message.includes("duplicate") ? "Dieser Slug wird bereits verwendet." : "Erfolg konnte nicht angelegt werden." };
  await logAudit(profile.id, "achievement.created", data.id, `Erfolg angelegt: ${d.title}`);
  revalidatePath("/admin/erfolge");
  return { id: data.id };
}

export async function setAchievementActiveAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireAdmin();
  const id = formData.get("id");
  const active = formData.get("active") === "true";
  if (typeof id !== "string") return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: item } = await supabase.from("achievements").select("title").eq("id", id).single();
  const { error } = await supabase.from("achievements").update({ is_active: active }).eq("id", id);
  if (error) return { error: "Status konnte nicht geändert werden." };
  await logAudit(profile.id, active ? "achievement.activated" : "achievement.deactivated", id, `${active ? "Aktiviert" : "Deaktiviert"}: ${item?.title ?? ""}`);
  revalidatePath("/admin/erfolge");
  return {};
}

const awardSchema = z.object({
  memberId: z.string().uuid(),
  achievementSlug: z.string().trim().min(1),
  trainerMessage: z.string().trim().max(500).optional(),
  internalNote: z.string().trim().max(500).optional(),
});

/** Trainer/Admin hand-award a manual achievement (Trainer-Auszeichnung, Gürtelgrad, …) to one of
 *  their members. The DB function itself re-checks that the caller is that member's trainer or
 *  an admin — this is not the only gate. */
export async function awardAchievementAction(formData: FormData): Promise<{ error?: string }> {
  await requireTrainerOrAdmin();
  const parsed = awardSchema.safeParse({
    memberId: formData.get("memberId"),
    achievementSlug: formData.get("achievementSlug"),
    trainerMessage: formData.get("trainerMessage") || undefined,
    internalNote: formData.get("internalNote") || undefined,
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.rpc("award_manual_achievement", {
    p_member_id: d.memberId,
    p_achievement_slug: d.achievementSlug,
    p_trainer_message: d.trainerMessage,
    p_internal_note: d.internalNote,
  });
  if (error) return { error: "Erfolg konnte nicht vergeben werden." };
  revalidatePath(`/trainer/mitglieder/${d.memberId}`);
  return {};
}

const revokeSchema = z.object({
  memberAchievementId: z.string().uuid(),
  memberId: z.string().uuid(),
  reason: z.string().trim().min(1, "Bitte einen Grund angeben."),
});

export async function revokeAchievementAction(formData: FormData): Promise<{ error?: string }> {
  await requireTrainerOrAdmin();
  const parsed = revokeSchema.safeParse({
    memberAchievementId: formData.get("memberAchievementId"),
    memberId: formData.get("memberId"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.rpc("revoke_member_achievement", {
    p_member_achievement_id: d.memberAchievementId,
    p_reason: d.reason,
  });
  if (error) return { error: "Vergabe konnte nicht zurückgenommen werden." };
  revalidatePath(`/trainer/mitglieder/${d.memberId}`);
  return {};
}
