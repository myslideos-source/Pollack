"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

const statusSchema = z.object({
  appointmentId: z.string().uuid(),
  status: z.enum(["geplant", "bestaetigt", "abgeschlossen", "abgesagt"]),
});

export async function updateAppointmentStatusAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = statusSchema.safeParse({
    appointmentId: formData.get("appointmentId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.appointmentId);
  if (error) return { error: "Status konnte nicht geändert werden." };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "appointment.status_changed",
    entity_type: "appointment",
    entity_id: parsed.data.appointmentId,
    summary: `Termin-Status geändert zu „${parsed.data.status}".`,
  });

  revalidatePath("/admin/termine");
  revalidatePath("/admin");
  return {};
}

const createSchema = z.object({
  title: z.string().trim().min(1),
  appointmentType: z.enum(["probetraining", "beratung", "rueckruf", "sonstiges"]),
  startsAt: z.string().min(1),
  notes: z.string().trim().max(2000).optional(),
});

export async function createStandaloneAppointmentAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireStaff();
  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    appointmentType: formData.get("appointmentType"),
    startsAt: formData.get("startsAt"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return { error: "Bitte alle Pflichtfelder ausfüllen." };

  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    title: parsed.data.title,
    appointment_type: parsed.data.appointmentType,
    starts_at: new Date(parsed.data.startsAt).toISOString(),
    notes: parsed.data.notes ?? null,
    created_by: profile.id,
  });
  if (error) return { error: "Termin konnte nicht angelegt werden." };

  revalidatePath("/admin/termine");
  revalidatePath("/admin");
  return {};
}
