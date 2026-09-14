"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { WEEKDAYS } from "@/lib/opening-hours";

async function logAudit(actorId: string, action: string, entityId: string | undefined, summary: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({ actor_id: actorId, action, entity_type: "opening_hours", entity_id: entityId, summary });
}

const weekdaySchema = z.object({
  weekday: z.enum(WEEKDAYS.map((w) => w.value) as [string, ...string[]]),
  closed: z.coerce.boolean().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

export async function saveWeekdayHoursAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = weekdaySchema.safeParse({
    weekday: formData.get("weekday"),
    closed: formData.get("closed") === "on",
    openTime: formData.get("openTime") || undefined,
    closeTime: formData.get("closeTime") || undefined,
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };
  const d = parsed.data;
  const sortOrder = WEEKDAYS.findIndex((w) => w.value === d.weekday);

  const supabase = await createClient();
  const { error } = await supabase.from("opening_hours").upsert(
    {
      weekday: d.weekday,
      closed: d.closed ?? false,
      open_time: d.closed ? null : d.openTime || null,
      close_time: d.closed ? null : d.closeTime || null,
      sort_order: sortOrder,
    },
    { onConflict: "weekday" },
  );
  if (error) return { error: "Öffnungszeiten konnten nicht gespeichert werden." };

  await logAudit(profile.id, "opening_hours.updated", undefined, `Öffnungszeiten aktualisiert: ${WEEKDAYS.find((w) => w.value === d.weekday)?.label}`);
  revalidatePath("/admin/oeffnungszeiten");
  revalidatePath("/");
  return {};
}

const specialSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().min(1, "Bezeichnung erforderlich."),
  dateFrom: z.string().min(1, "Datum erforderlich."),
  dateTo: z.string().optional(),
  closed: z.coerce.boolean().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  note: z.string().trim().optional(),
});

export async function saveSpecialHoursAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const profile = await requireStaff();
  const parsed = specialSchema.safeParse({
    id: formData.get("id") || undefined,
    label: formData.get("label"),
    dateFrom: formData.get("dateFrom"),
    dateTo: formData.get("dateTo") || undefined,
    closed: formData.get("closed") === "on",
    openTime: formData.get("openTime") || undefined,
    closeTime: formData.get("closeTime") || undefined,
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const payload = {
    label: d.label,
    date_from: d.dateFrom,
    date_to: d.dateTo || null,
    closed: d.closed ?? false,
    open_time: d.closed ? null : d.openTime || null,
    close_time: d.closed ? null : d.closeTime || null,
    note: d.note ?? null,
  };

  if (d.id) {
    const { error } = await supabase.from("special_opening_hours").update(payload).eq("id", d.id);
    if (error) return { error: "Eintrag konnte nicht gespeichert werden." };
    await logAudit(profile.id, "special_opening_hours.updated", d.id, `Sonderöffnungszeit aktualisiert: ${d.label}`);
    revalidatePath("/admin/oeffnungszeiten");
    revalidatePath("/");
    return { id: d.id };
  }

  const { data, error } = await supabase.from("special_opening_hours").insert(payload).select("id").single();
  if (error) return { error: "Eintrag konnte nicht angelegt werden." };
  await logAudit(profile.id, "special_opening_hours.created", data.id, `Sonderöffnungszeit angelegt: ${d.label}`);
  revalidatePath("/admin/oeffnungszeiten");
  revalidatePath("/");
  return { id: data.id };
}

export async function deleteSpecialHoursAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const id = formData.get("id");
  if (typeof id !== "string") return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: item } = await supabase.from("special_opening_hours").select("label").eq("id", id).single();
  const { error } = await supabase.from("special_opening_hours").delete().eq("id", id);
  if (error) return { error: "Eintrag konnte nicht gelöscht werden." };
  await logAudit(profile.id, "special_opening_hours.deleted", id, `Sonderöffnungszeit gelöscht: ${item?.label ?? ""}`);
  revalidatePath("/admin/oeffnungszeiten");
  revalidatePath("/");
  return {};
}
