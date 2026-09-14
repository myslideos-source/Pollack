"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { inquiryStatuses, inquiryStatusLabels, type InquiryStatus } from "@/lib/inquiry-labels";

async function logAudit(params: {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  summary: string;
  previousValue?: unknown;
  newValue?: unknown;
}) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    actor_id: params.actorId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    summary: params.summary,
    previous_value: params.previousValue as never,
    new_value: params.newValue as never,
  });
}

const statusSchema = z.object({
  inquiryId: z.string().uuid(),
  status: z.enum(inquiryStatuses),
});

export async function updateInquiryStatusAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = statusSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("inquiries")
    .select("status")
    .eq("id", parsed.data.inquiryId)
    .single();

  const { error } = await supabase
    .from("inquiries")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.inquiryId);

  if (error) return { error: "Status konnte nicht geändert werden." };

  await logAudit({
    actorId: profile.id,
    action: "inquiry.status_changed",
    entityType: "inquiry",
    entityId: parsed.data.inquiryId,
    summary: `Status geändert: ${inquiryStatusLabels[(before?.status as InquiryStatus) ?? "neu"]} → ${inquiryStatusLabels[parsed.data.status]}`,
  });

  revalidatePath("/admin/anfragen");
  revalidatePath("/admin");
  return {};
}

const noteSchema = z.object({
  inquiryId: z.string().uuid(),
  note: z.string().trim().min(1, "Notiz darf nicht leer sein.").max(2000),
});

export async function addInquiryNoteAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = noteSchema.safeParse({ inquiryId: formData.get("inquiryId"), note: formData.get("note") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiry_notes")
    .insert({ inquiry_id: parsed.data.inquiryId, author_id: profile.id, note: parsed.data.note });

  if (error) return { error: "Notiz konnte nicht gespeichert werden." };

  await logAudit({
    actorId: profile.id,
    action: "inquiry.note_added",
    entityType: "inquiry",
    entityId: parsed.data.inquiryId,
    summary: "Interne Notiz hinzugefügt.",
  });

  revalidatePath("/admin/anfragen");
  return {};
}

const callbackSchema = z.object({
  inquiryId: z.string().uuid(),
  callbackDate: z.string().min(1),
});

export async function setCallbackDateAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = callbackSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    callbackDate: formData.get("callbackDate"),
  });
  if (!parsed.success) return { error: "Ungültiges Datum." };

  const iso = new Date(parsed.data.callbackDate).toISOString();
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ callback_date: iso, status: "rueckruf_geplant" })
    .eq("id", parsed.data.inquiryId);

  if (error) return { error: "Rückrufdatum konnte nicht gespeichert werden." };

  await logAudit({
    actorId: profile.id,
    action: "inquiry.callback_scheduled",
    entityType: "inquiry",
    entityId: parsed.data.inquiryId,
    summary: `Rückruf geplant für ${new Date(iso).toLocaleString("de-DE")}.`,
  });

  revalidatePath("/admin/anfragen");
  return {};
}

const assignSchema = z.object({
  inquiryId: z.string().uuid(),
  assignedTo: z.string().uuid().nullable(),
});

export async function assignInquiryAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const raw = formData.get("assignedTo");
  const parsed = assignSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    assignedTo: raw && raw !== "" ? raw : null,
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ assigned_to: parsed.data.assignedTo })
    .eq("id", parsed.data.inquiryId);

  if (error) return { error: "Zuständigkeit konnte nicht gespeichert werden." };

  await logAudit({
    actorId: profile.id,
    action: "inquiry.assigned",
    entityType: "inquiry",
    entityId: parsed.data.inquiryId,
    summary: "Zuständige Person geändert.",
  });

  revalidatePath("/admin/anfragen");
  return {};
}

const idSchema = z.object({ inquiryId: z.string().uuid() });

export async function archiveInquiryAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = idSchema.safeParse({ inquiryId: formData.get("inquiryId") });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").update({ archived: true }).eq("id", parsed.data.inquiryId);
  if (error) return { error: "Anfrage konnte nicht archiviert werden." };

  await logAudit({
    actorId: profile.id,
    action: "inquiry.archived",
    entityType: "inquiry",
    entityId: parsed.data.inquiryId,
    summary: "Anfrage archiviert.",
  });

  revalidatePath("/admin/anfragen");
  return {};
}

export async function markSpamAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = idSchema.safeParse({ inquiryId: formData.get("inquiryId") });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").update({ status: "spam" }).eq("id", parsed.data.inquiryId);
  if (error) return { error: "Konnte nicht als Spam markiert werden." };

  await logAudit({
    actorId: profile.id,
    action: "inquiry.marked_spam",
    entityType: "inquiry",
    entityId: parsed.data.inquiryId,
    summary: "Als Spam markiert.",
  });

  revalidatePath("/admin/anfragen");
  return {};
}

/**
 * DSGVO-konforme Löschung: entfernt die Anfrage inkl. aller personenbezogenen Daten
 * unwiderruflich. Der Audit-Log-Eintrag hält absichtlich keine der gelöschten Angaben fest
 * (kein Name/E-Mail/Nachricht) — nur, dass und von wem gelöscht wurde.
 */
export async function deleteInquiryAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = idSchema.safeParse({ inquiryId: formData.get("inquiryId") });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", parsed.data.inquiryId);
  if (error) return { error: "Anfrage konnte nicht gelöscht werden." };

  await logAudit({
    actorId: profile.id,
    action: "inquiry.deleted",
    entityType: "inquiry",
    entityId: parsed.data.inquiryId,
    summary: "Anfrage DSGVO-konform gelöscht.",
  });

  revalidatePath("/admin/anfragen");
  revalidatePath("/admin");
  return {};
}

const appointmentSchema = z.object({
  inquiryId: z.string().uuid(),
  title: z.string().trim().min(1),
  startsAt: z.string().min(1),
  appointmentType: z.enum(["probetraining", "beratung", "rueckruf", "sonstiges"]),
});

export async function createAppointmentFromInquiryAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = appointmentSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    title: formData.get("title"),
    startsAt: formData.get("startsAt"),
    appointmentType: formData.get("appointmentType"),
  });
  if (!parsed.success) return { error: "Bitte alle Felder ausfüllen." };

  const supabase = await createClient();
  const { error: apptError } = await supabase.from("appointments").insert({
    inquiry_id: parsed.data.inquiryId,
    title: parsed.data.title,
    appointment_type: parsed.data.appointmentType,
    starts_at: new Date(parsed.data.startsAt).toISOString(),
    created_by: profile.id,
  });
  if (apptError) return { error: "Termin konnte nicht angelegt werden." };

  await supabase.from("inquiries").update({ status: "termin_vereinbart" }).eq("id", parsed.data.inquiryId);

  await logAudit({
    actorId: profile.id,
    action: "appointment.created",
    entityType: "inquiry",
    entityId: parsed.data.inquiryId,
    summary: `Termin angelegt: ${parsed.data.title}.`,
  });

  revalidatePath("/admin/anfragen");
  revalidatePath("/admin/termine");
  revalidatePath("/admin");
  return {};
}
