"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { OFFER_CATEGORIES } from "@/lib/offer-categories";

async function logAudit(actorId: string, action: string, entityId: string | undefined, summary: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({ actor_id: actorId, action, entity_type: "offer", entity_id: entityId, summary });
}

const offerSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1, "Titel erforderlich."),
  category: z.enum(OFFER_CATEGORIES),
  description: z.string().trim().optional(),
  priceCents: z.coerce.number().int().nonnegative().optional(),
  priceNote: z.string().trim().optional(),
  billingPeriod: z.string().trim().optional(),
  contractDuration: z.string().trim().optional(),
  features: z.string().optional(),
  highlighted: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

export async function saveOfferAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const profile = await requireStaff();
  const parsed = offerSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description") || undefined,
    priceCents: formData.get("priceCents") || undefined,
    priceNote: formData.get("priceNote") || undefined,
    billingPeriod: formData.get("billingPeriod") || undefined,
    contractDuration: formData.get("contractDuration") || undefined,
    features: formData.get("features") || undefined,
    highlighted: formData.get("highlighted") === "on",
    published: formData.get("published") === "on",
    validFrom: formData.get("validFrom") || undefined,
    validTo: formData.get("validTo") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const d = parsed.data;
  const features = (d.features ?? "")
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const payload = {
    title: d.title,
    category: d.category,
    description: d.description ?? null,
    price_cents: d.priceCents ?? null,
    price_note: d.priceNote ?? null,
    billing_period: d.billingPeriod ?? null,
    contract_duration: d.contractDuration ?? null,
    features,
    highlighted: d.highlighted ?? false,
    published: d.published ?? false,
    valid_from: d.validFrom ? new Date(d.validFrom).toISOString() : null,
    valid_to: d.validTo ? new Date(d.validTo).toISOString() : null,
  };

  if (d.id) {
    const { error } = await supabase.from("offers").update(payload).eq("id", d.id);
    if (error) return { error: "Angebot konnte nicht gespeichert werden." };
    await logAudit(profile.id, "offer.updated", d.id, `Angebot aktualisiert: ${d.title}`);
    revalidatePath("/admin/angebote");
    revalidatePath("/", "layout");
    return { id: d.id };
  }

  const { data: maxRow } = await supabase.from("offers").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase
    .from("offers")
    .insert({ ...payload, sort_order: (maxRow?.sort_order ?? -1) + 1 })
    .select("id")
    .single();
  if (error) return { error: "Angebot konnte nicht angelegt werden." };
  await logAudit(profile.id, "offer.created", data.id, `Angebot angelegt: ${d.title}`);
  revalidatePath("/admin/angebote");
  revalidatePath("/", "layout");
  return { id: data.id };
}

const idSchema = z.object({ id: z.string().uuid() });

export async function deleteOfferAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = idSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: item } = await supabase.from("offers").select("title").eq("id", parsed.data.id).single();
  const { error } = await supabase.from("offers").delete().eq("id", parsed.data.id);
  if (error) return { error: "Angebot konnte nicht gelöscht werden." };
  await logAudit(profile.id, "offer.deleted", parsed.data.id, `Angebot gelöscht: ${item?.title ?? ""}`);
  revalidatePath("/admin/angebote");
  revalidatePath("/", "layout");
  return {};
}

export async function togglePublishedOfferAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const id = formData.get("id");
  const published = formData.get("published") === "true";
  if (typeof id !== "string") return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase.from("offers").update({ published: !published }).eq("id", id);
  if (error) return { error: "Status konnte nicht geändert werden." };
  await logAudit(profile.id, "offer.publish_toggled", id, `Veröffentlichung ${!published ? "aktiviert" : "deaktiviert"}.`);
  revalidatePath("/admin/angebote");
  revalidatePath("/", "layout");
  return {};
}
