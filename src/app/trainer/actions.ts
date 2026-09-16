"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireTrainerOrAdmin } from "@/lib/auth";
import { inviteMemberSchema } from "@/lib/validation/auth";

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

/** Admin-only: invites a new member or trainer account (mirrors admin/actions/users.ts's
 *  inviteUserAction for the CMS staff roles — same auth-then-profile-row pattern, just for the
 *  portal's own roles instead). */
export async function inviteMemberAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData,
): Promise<{ error?: string; success?: string }> {
  const profile = await requireTrainerOrAdmin();
  if (profile.role !== "admin") return { error: "Nur Administratoren können Mitglieder oder Trainer einladen." };

  const parsed = inviteMemberSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const { email, fullName, role } = parsed.data;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "Diese Aktion erfordert den Supabase Service-Role-Key in der Serverumgebung." };
  }

  const origin = await getOrigin();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo: `${origin}/reset-password`,
  });
  if (error || !data.user) {
    return { error: "Einladung konnte nicht versendet werden. Ist die E-Mail-Adresse bereits vergeben?" };
  }

  const supabase = await createClient();
  const { error: profileError } = await supabase.from("profiles").insert({ id: data.user.id, email, full_name: fullName, role });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: "Profil konnte nicht angelegt werden. Die Einladung wurde zurückgenommen." };
  }

  await logAudit(profile.id, "member.invited", data.user.id, `${role === "trainer" ? "Trainer" : "Mitglied"} eingeladen: ${fullName} (${email})`);
  revalidatePath("/trainer/mitglieder");
  return { success: `Einladung an ${email} wurde versendet.` };
}

async function logAudit(actorId: string, action: string, entityId: string | undefined, summary: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({ actor_id: actorId, action, entity_type: "training_plan", entity_id: entityId, summary });
}

/** Approves a pending plan via the SECURITY DEFINER RPC — see approve_training_plan() in the
 *  0008 migration for why authorization is checked there, not just here. */
export async function approveTrainingPlanAction(planId: string, memberId: string): Promise<{ error?: string }> {
  await requireTrainerOrAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("approve_training_plan", { p_plan_id: planId });
  if (error || !data) return { error: "Plan konnte nicht freigegeben werden." };

  revalidatePath(`/trainer/mitglieder/${memberId}`);
  revalidatePath("/trainer");
  return {};
}

const exerciseUpdateSchema = z.object({
  id: z.string().uuid(),
  sets: z.coerce.number().int().min(1).max(10),
  reps: z.string().trim().min(1),
  restSeconds: z.coerce.number().int().min(15).max(600),
  targetWeightKg: z.union([z.coerce.number().min(0).max(500), z.literal("")]).optional(),
  trainerNote: z.string().trim().optional(),
});

/** Trainer edits one exercise within a plan day (sets/reps/rest/weight/note) — used both while
 *  a plan is still pending review and to fine-tune an already-active plan. */
export async function updatePlanExerciseAction(memberId: string, formData: FormData): Promise<{ error?: string }> {
  await requireTrainerOrAdmin();
  const parsed = exerciseUpdateSchema.safeParse({
    id: formData.get("id"),
    sets: formData.get("sets"),
    reps: formData.get("reps"),
    restSeconds: formData.get("restSeconds"),
    targetWeightKg: formData.get("targetWeightKg") ?? "",
    trainerNote: formData.get("trainerNote") || undefined,
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("training_plan_exercises")
    .update({
      sets: d.sets,
      reps: d.reps,
      rest_seconds: d.restSeconds,
      target_weight_kg: d.targetWeightKg === "" || d.targetWeightKg === undefined ? null : d.targetWeightKg,
      trainer_note: d.trainerNote ?? null,
    })
    .eq("id", d.id);
  if (error) return { error: "Übung konnte nicht gespeichert werden." };

  revalidatePath(`/trainer/mitglieder/${memberId}`);
  return {};
}

const dayCoverSchema = z.object({
  id: z.string().uuid(),
  coverMediaId: z.union([z.string().uuid(), z.literal("")]).optional(),
  coverAlt: z.string().trim().optional(),
});

/** Trainer sets or clears a training day's cover photo (the image shown in the member's "today"
 *  hero and the admin "Aktiver Plan der Woche" card) — picked from the media library via
 *  MediaPicker, same pattern as the achievements custom icon. Clearing it falls back to the
 *  local category default (see defaultCoverForTitle) rather than leaving the hero without a photo. */
export async function updatePlanDayCoverAction(memberId: string, formData: FormData): Promise<{ error?: string }> {
  await requireTrainerOrAdmin();
  const parsed = dayCoverSchema.safeParse({
    id: formData.get("id"),
    coverMediaId: formData.get("coverMediaId") ?? "",
    coverAlt: formData.get("coverAlt") || undefined,
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("training_plan_days")
    .update({ cover_media_id: d.coverMediaId === "" || d.coverMediaId === undefined ? null : d.coverMediaId, cover_alt: d.coverAlt ?? null })
    .eq("id", d.id);
  if (error) return { error: "Titelbild konnte nicht gespeichert werden." };

  revalidatePath(`/trainer/mitglieder/${memberId}`);
  revalidatePath("/mitglied");
  revalidatePath("/admin");
  return {};
}

const changeExerciseSchema = z.object({ id: z.string().uuid(), exerciseId: z.string().uuid() });

/** Swaps which catalog exercise a plan row points at (e.g. replacing an exercise a member can't do). */
export async function swapPlanExerciseAction(memberId: string, formData: FormData): Promise<{ error?: string }> {
  await requireTrainerOrAdmin();
  const parsed = changeExerciseSchema.safeParse({ id: formData.get("id"), exerciseId: formData.get("exerciseId") });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("training_plan_exercises")
    .update({ exercise_id: parsed.data.exerciseId })
    .eq("id", parsed.data.id);
  if (error) return { error: "Übung konnte nicht ausgetauscht werden." };

  revalidatePath(`/trainer/mitglieder/${memberId}`);
  return {};
}

const resolveChangeRequestSchema = z.object({
  requestId: z.string().uuid(),
  resolutionNote: z.string().trim().optional(),
});

export async function resolveChangeRequestAction(memberId: string, formData: FormData): Promise<{ error?: string }> {
  const profile = await requireTrainerOrAdmin();
  const parsed = resolveChangeRequestSchema.safeParse({
    requestId: formData.get("requestId"),
    resolutionNote: formData.get("resolutionNote") || undefined,
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("plan_change_requests")
    .update({ status: "resolved", resolved_by: profile.id, resolved_at: new Date().toISOString(), resolution_note: parsed.data.resolutionNote ?? null })
    .eq("id", parsed.data.requestId);
  if (error) return { error: "Anfrage konnte nicht abgeschlossen werden." };

  revalidatePath(`/trainer/mitglieder/${memberId}`);
  revalidatePath("/trainer");
  return {};
}

const assignTrainerSchema = z.object({ memberId: z.string().uuid(), trainerId: z.string().uuid() });

/** Admin-only (enforced via requireTrainerOrAdmin + an explicit admin check here, since a
 *  trainer must not be able to reassign members to a different trainer). */
export async function assignTrainerAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireTrainerOrAdmin();
  if (profile.role !== "admin") return { error: "Nur Administratoren können Trainer zuweisen." };
  const parsed = assignTrainerSchema.safeParse({ memberId: formData.get("memberId"), trainerId: formData.get("trainerId") });
  if (!parsed.success) return { error: "Ungültige Eingabe." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("member_profiles")
    .update({ assigned_trainer_id: parsed.data.trainerId })
    .eq("id", parsed.data.memberId);
  if (error) return { error: "Trainer konnte nicht zugewiesen werden." };

  await supabase.from("trainer_assignments").insert({
    member_id: parsed.data.memberId,
    trainer_id: parsed.data.trainerId,
    assigned_by: profile.id,
  });
  await logAudit(profile.id, "member.trainer_assigned", parsed.data.memberId, "Trainer zugewiesen");

  revalidatePath("/trainer/mitglieder");
  revalidatePath(`/trainer/mitglieder/${parsed.data.memberId}`);
  return {};
}
