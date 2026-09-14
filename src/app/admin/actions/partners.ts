"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

async function logAudit(actorId: string, action: string, entityType: string, entityId: string | undefined, summary: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({ actor_id: actorId, action, entity_type: entityType, entity_id: entityId, summary });
}

const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Name erforderlich."),
  description: z.string().trim().optional(),
  linkUrl: z.string().trim().optional(),
  logoMediaId: z.string().uuid().optional(),
  visible: z.coerce.boolean().optional(),
});

export async function savePartnerAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const profile = await requireStaff();
  const parsed = partnerSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    linkUrl: formData.get("linkUrl") || undefined,
    logoMediaId: formData.get("logoMediaId") || undefined,
    visible: formData.get("visible") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const payload = {
    name: d.name,
    description: d.description ?? null,
    link_url: d.linkUrl ?? null,
    logo_media_id: d.logoMediaId ?? null,
    visible: d.visible ?? true,
  };

  if (d.id) {
    const { error } = await supabase.from("partners").update(payload).eq("id", d.id);
    if (error) return { error: "Partner konnte nicht gespeichert werden." };
    await logAudit(profile.id, "partner.updated", "partner", d.id, `Partner aktualisiert: ${d.name}`);
    revalidatePath("/admin/partner");
    revalidatePath("/admin/medien");
    revalidatePath("/", "layout");
    return { id: d.id };
  }

  const { data: maxRow } = await supabase.from("partners").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase
    .from("partners")
    .insert({ ...payload, sort_order: (maxRow?.sort_order ?? -1) + 1 })
    .select("id")
    .single();
  if (error) return { error: "Partner konnte nicht angelegt werden." };
  await logAudit(profile.id, "partner.created", "partner", data.id, `Partner angelegt: ${d.name}`);
  revalidatePath("/admin/partner");
  revalidatePath("/admin/medien");
  revalidatePath("/", "layout");
  return { id: data.id };
}

export async function deletePartnerAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const id = formData.get("id");
  if (typeof id !== "string") return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: item } = await supabase.from("partners").select("name").eq("id", id).single();
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) return { error: "Partner konnte nicht gelöscht werden." };
  await logAudit(profile.id, "partner.deleted", "partner", id, `Partner gelöscht: ${item?.name ?? ""}`);
  revalidatePath("/admin/partner");
  revalidatePath("/admin/medien");
  revalidatePath("/", "layout");
  return {};
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Name erforderlich."),
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  partnerId: z.string().uuid().optional(),
  imageMediaId: z.string().uuid().optional(),
  recommended: z.coerce.boolean().optional(),
  availableInStore: z.coerce.boolean().optional(),
  visible: z.coerce.boolean().optional(),
});

export async function saveProductAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const profile = await requireStaff();
  const parsed = productSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    category: formData.get("category") || undefined,
    description: formData.get("description") || undefined,
    partnerId: formData.get("partnerId") || undefined,
    imageMediaId: formData.get("imageMediaId") || undefined,
    recommended: formData.get("recommended") === "on",
    availableInStore: formData.get("availableInStore") === "on",
    visible: formData.get("visible") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const payload = {
    name: d.name,
    category: d.category ?? null,
    description: d.description ?? null,
    partner_id: d.partnerId ?? null,
    image_media_id: d.imageMediaId ?? null,
    recommended: d.recommended ?? false,
    available_in_store: d.availableInStore ?? false,
    visible: d.visible ?? true,
  };

  if (d.id) {
    const { error } = await supabase.from("products").update(payload).eq("id", d.id);
    if (error) return { error: "Produkt konnte nicht gespeichert werden." };
    await logAudit(profile.id, "product.updated", "product", d.id, `Produkt aktualisiert: ${d.name}`);
    revalidatePath("/admin/partner");
    revalidatePath("/admin/medien");
    revalidatePath("/", "layout");
    return { id: d.id };
  }

  const { data: maxRow } = await supabase.from("products").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase
    .from("products")
    .insert({ ...payload, sort_order: (maxRow?.sort_order ?? -1) + 1 })
    .select("id")
    .single();
  if (error) return { error: "Produkt konnte nicht angelegt werden." };
  await logAudit(profile.id, "product.created", "product", data.id, `Produkt angelegt: ${d.name}`);
  revalidatePath("/admin/partner");
  revalidatePath("/admin/medien");
  revalidatePath("/", "layout");
  return { id: data.id };
}

export async function deleteProductAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const id = formData.get("id");
  if (typeof id !== "string") return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: item } = await supabase.from("products").select("name").eq("id", id).single();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: "Produkt konnte nicht gelöscht werden." };
  await logAudit(profile.id, "product.deleted", "product", id, `Produkt gelöscht: ${item?.name ?? ""}`);
  revalidatePath("/admin/partner");
  revalidatePath("/admin/medien");
  revalidatePath("/", "layout");
  return {};
}
