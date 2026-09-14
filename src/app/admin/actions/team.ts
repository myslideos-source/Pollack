"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

async function logAudit(actorId: string, action: string, entityId: string | undefined, summary: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({ actor_id: actorId, action, entity_type: "team_member", entity_id: entityId, summary });
}

const teamSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Name erforderlich."),
  roleTitle: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  photoMediaId: z.string().uuid().optional(),
  contactEmail: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  focusAreas: z.string().optional(),
  qualifications: z.string().optional(),
  isOwner: z.coerce.boolean().optional(),
  visible: z.coerce.boolean().optional(),
});

function parseLines(value: string | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function saveTeamMemberAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const profile = await requireStaff();
  const parsed = teamSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    roleTitle: formData.get("roleTitle") || undefined,
    bio: formData.get("bio") || undefined,
    photoMediaId: formData.get("photoMediaId") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    contactPhone: formData.get("contactPhone") || undefined,
    focusAreas: formData.get("focusAreas") || undefined,
    qualifications: formData.get("qualifications") || undefined,
    isOwner: formData.get("isOwner") === "on",
    visible: formData.get("visible") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const payload = {
    name: d.name,
    role_title: d.roleTitle ?? null,
    bio: d.bio ?? null,
    photo_media_id: d.photoMediaId ?? null,
    contact_email: d.contactEmail ?? null,
    contact_phone: d.contactPhone ?? null,
    focus_areas: parseLines(d.focusAreas),
    qualifications: parseLines(d.qualifications),
    is_owner: d.isOwner ?? false,
    visible: d.visible ?? true,
  };

  if (d.id) {
    const { error } = await supabase.from("team_members").update(payload).eq("id", d.id);
    if (error) return { error: "Teammitglied konnte nicht gespeichert werden." };
    await logAudit(profile.id, "team_member.updated", d.id, `Teammitglied aktualisiert: ${d.name}`);
    revalidatePath("/admin/team");
    revalidatePath("/admin/medien");
    return { id: d.id };
  }

  const { data: maxRow } = await supabase.from("team_members").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase
    .from("team_members")
    .insert({ ...payload, sort_order: (maxRow?.sort_order ?? -1) + 1 })
    .select("id")
    .single();
  if (error) return { error: "Teammitglied konnte nicht angelegt werden." };
  await logAudit(profile.id, "team_member.created", data.id, `Teammitglied angelegt: ${d.name}`);
  revalidatePath("/admin/team");
  revalidatePath("/admin/medien");
  return { id: data.id };
}

export async function deleteTeamMemberAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const id = formData.get("id");
  if (typeof id !== "string") return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: item } = await supabase.from("team_members").select("name").eq("id", id).single();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) return { error: "Teammitglied konnte nicht gelöscht werden." };
  await logAudit(profile.id, "team_member.deleted", id, `Teammitglied gelöscht: ${item?.name ?? ""}`);
  revalidatePath("/admin/team");
  revalidatePath("/admin/medien");
  return {};
}
