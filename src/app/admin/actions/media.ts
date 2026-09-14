"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

const createSchema = z.object({
  storageBucket: z.string().min(1),
  storagePath: z.string().min(1),
  fileType: z.enum(["image", "video"]),
  mimeType: z.string().min(1),
  fileSize: z.coerce.number().nonnegative(),
  title: z.string().trim().min(1),
  altText: z.string().trim().optional(),
  area: z.string().trim().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
});

export async function createMediaRecordAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const profile = await requireStaff();
  const parsed = createSchema.safeParse({
    storageBucket: formData.get("storageBucket"),
    storagePath: formData.get("storagePath"),
    fileType: formData.get("fileType"),
    mimeType: formData.get("mimeType"),
    fileSize: formData.get("fileSize"),
    title: formData.get("title"),
    altText: formData.get("altText") || undefined,
    area: formData.get("area") || undefined,
    width: formData.get("width") || undefined,
    height: formData.get("height") || undefined,
  });
  if (!parsed.success) return { error: "Ungültige Datei-Angaben." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .insert({
      storage_bucket: parsed.data.storageBucket,
      storage_path: parsed.data.storagePath,
      file_type: parsed.data.fileType,
      mime_type: parsed.data.mimeType,
      file_size: parsed.data.fileSize,
      title: parsed.data.title,
      alt_text: parsed.data.altText ?? null,
      area: parsed.data.area ?? null,
      width: parsed.data.width ?? null,
      height: parsed.data.height ?? null,
      uploaded_by: profile.id,
    })
    .select("id")
    .single();

  if (error) return { error: "Datei konnte nicht gespeichert werden." };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "media.uploaded",
    entity_type: "media",
    entity_id: data.id,
    summary: `Datei hochgeladen: ${parsed.data.title}`,
  });

  revalidatePath("/admin/medien");
  return { id: data.id };
}

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1),
  altText: z.string().trim().optional(),
  area: z.string().trim().optional(),
});

export async function updateMediaAction(formData: FormData): Promise<{ error?: string }> {
  await requireStaff();
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    altText: formData.get("altText") || undefined,
    area: formData.get("area") || undefined,
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("media")
    .update({ title: parsed.data.title, alt_text: parsed.data.altText ?? null, area: parsed.data.area ?? null })
    .eq("id", parsed.data.id);
  if (error) return { error: "Datei konnte nicht aktualisiert werden." };

  revalidatePath("/admin/medien");
  return {};
}

const cropSchema = z.object({
  id: z.string().uuid(),
  x: z.coerce.number().min(0).max(100),
  y: z.coerce.number().min(0).max(100),
});

/**
 * Sets a photo's focal point (object-position, as a 0–100% pair) so an object-cover crop keeps
 * the right part of the image in frame — e.g. a person's face — at every breakpoint it's shown
 * at. Stored on the media row itself (not per-usage) since the same photo should crop the same
 * way everywhere it's reused. Media isn't part of the draft/publish workflow — it's live as
 * soon as it's uploaded — so this busts the public site's cache immediately, not just on the
 * next publish.
 */
export async function updateMediaCropAction(formData: FormData): Promise<{ error?: string }> {
  await requireStaff();
  const parsed = cropSchema.safeParse({
    id: formData.get("id"),
    x: formData.get("x"),
    y: formData.get("y"),
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("media")
    .update({ crop: { x: Math.round(parsed.data.x), y: Math.round(parsed.data.y) } })
    .eq("id", parsed.data.id);
  if (error) return { error: "Bildausschnitt konnte nicht gespeichert werden." };

  revalidatePath("/admin/medien");
  revalidatePath("/", "layout");
  return {};
}

export async function deleteMediaAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const id = formData.get("id");
  if (typeof id !== "string") return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: item } = await supabase.from("media").select("storage_bucket, storage_path, title").eq("id", id).single();
  if (!item) return { error: "Datei nicht gefunden." };

  await supabase.storage.from(item.storage_bucket).remove([item.storage_path]);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { error: "Datei konnte nicht gelöscht werden." };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "media.deleted",
    entity_type: "media",
    summary: `Datei gelöscht: ${item.title}`,
  });

  revalidatePath("/admin/medien");
  return {};
}
