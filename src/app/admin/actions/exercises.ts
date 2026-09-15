"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

async function logAudit(actorId: string, action: string, entityId: string | undefined, summary: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({ actor_id: actorId, action, entity_type: "exercise", entity_id: entityId, summary });
}

const exerciseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Name erforderlich."),
  muscleGroup: z.string().trim().optional(),
  description: z.string().trim().optional(),
  defaultSets: z.coerce.number().int().min(1).max(10),
  defaultReps: z.string().trim().min(1),
  imageMediaId: z.string().uuid().optional(),
});

/**
 * Exercise-catalog CRUD lives in the CMS admin (requireStaff), not the trainer area — curating
 * the shared library of exercises is an editorial task like the rest of the site's content,
 * while assigning them into a specific member's plan is what the trainer area is for.
 */
export async function saveExerciseAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const profile = await requireStaff();
  const parsed = exerciseSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    muscleGroup: formData.get("muscleGroup") || undefined,
    description: formData.get("description") || undefined,
    defaultSets: formData.get("defaultSets"),
    defaultReps: formData.get("defaultReps"),
    imageMediaId: formData.get("imageMediaId") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const payload = {
    name: d.name,
    muscle_group: d.muscleGroup ?? null,
    description: d.description ?? null,
    default_sets: d.defaultSets,
    default_reps: d.defaultReps,
    image_media_id: d.imageMediaId ?? null,
  };

  if (d.id) {
    const { error } = await supabase.from("exercises").update(payload).eq("id", d.id);
    if (error) return { error: "Übung konnte nicht gespeichert werden." };
    await logAudit(profile.id, "exercise.updated", d.id, `Übung aktualisiert: ${d.name}`);
    revalidatePath("/admin/uebungen");
    return { id: d.id };
  }

  const { data, error } = await supabase.from("exercises").insert(payload).select("id").single();
  if (error) return { error: "Übung konnte nicht angelegt werden." };
  await logAudit(profile.id, "exercise.created", data.id, `Übung angelegt: ${d.name}`);
  revalidatePath("/admin/uebungen");
  return { id: data.id };
}

export async function deleteExerciseAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const id = formData.get("id");
  if (typeof id !== "string") return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: item } = await supabase.from("exercises").select("name").eq("id", id).single();
  const { error } = await supabase.from("exercises").delete().eq("id", id);
  if (error) return { error: "Übung wird noch in Trainingsplänen verwendet und kann nicht gelöscht werden." };
  await logAudit(profile.id, "exercise.deleted", id, `Übung gelöscht: ${item?.name ?? ""}`);
  revalidatePath("/admin/uebungen");
  return {};
}
