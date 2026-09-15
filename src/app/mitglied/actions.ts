"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireMember, requireTrainerOrAdmin } from "@/lib/auth";

const onboardingSchema = z.object({
  goal: z.string().trim().min(1),
  birthYear: z.coerce.number().int().min(1930).max(new Date().getFullYear() - 10),
  heightCm: z.coerce.number().int().min(120).max(230),
  weightKg: z.coerce.number().min(30).max(300),
  experienceLevel: z.enum(["einsteiger", "fortgeschritten", "erfahren"]),
  trainingDaysPerWeek: z.coerce.number().int().min(1).max(7),
  sessionDurationMin: z.coerce.number().int().min(15).max(150),
  focusAreas: z.array(z.string()).default([]),
  healthNotes: z.string().trim().optional(),
  excludedExercises: z.string().trim().optional(),
  preferences: z.string().trim().optional(),
  intensityPreference: z.enum(["locker", "moderat", "fordernd"]),
  consent: z.literal("on", { message: "Bitte der Verarbeitung deiner Gesundheitsangaben zustimmen." }),
});

export type OnboardingActionState = { error?: string } | null;

/**
 * Saves the onboarding questionnaire, records explicit consent (required before any of this —
 * goal, injuries, body data — is stored), and generates a rule-based draft plan from the best-
 * matching template. The draft always lands in status "pending_review": a trainer or admin
 * must approve it (see approveTrainingPlanAction in the trainer area) before the member ever
 * sees it as their active plan.
 */
export async function completeOnboardingAction(
  _prev: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const profile = await requireMember();
  const parsed = onboardingSchema.safeParse({
    goal: formData.get("goal"),
    birthYear: formData.get("birthYear"),
    heightCm: formData.get("heightCm"),
    weightKg: formData.get("weightKg"),
    experienceLevel: formData.get("experienceLevel"),
    trainingDaysPerWeek: formData.get("trainingDaysPerWeek"),
    sessionDurationMin: formData.get("sessionDurationMin"),
    focusAreas: formData.getAll("focusAreas"),
    healthNotes: formData.get("healthNotes") || undefined,
    excludedExercises: formData.get("excludedExercises") || undefined,
    preferences: formData.get("preferences") || undefined,
    intensityPreference: formData.get("intensityPreference"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Bitte alle Pflichtfelder ausfüllen." };
  }
  const d = parsed.data;
  const excludedExercises = (d.excludedExercises ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const supabase = await createClient();

  const { error: upsertError } = await supabase.from("member_profiles").upsert({
    id: profile.id,
    goal: d.goal,
    birth_year: d.birthYear,
    height_cm: d.heightCm,
    weight_kg: d.weightKg,
    experience_level: d.experienceLevel,
    training_days_per_week: d.trainingDaysPerWeek,
    session_duration_min: d.sessionDurationMin,
    focus_areas: d.focusAreas,
    health_notes: d.healthNotes ?? null,
    excluded_exercises: excludedExercises,
    preferences: d.preferences ?? null,
    intensity_preference: d.intensityPreference,
    onboarding_completed_at: new Date().toISOString(),
  });
  if (upsertError) return { error: "Deine Angaben konnten nicht gespeichert werden. Bitte erneut versuchen." };

  await supabase.from("health_consents").insert({ member_id: profile.id, event: "granted" });

  const { data: templates } = await supabase
    .from("training_plan_templates")
    .select("id, goal, level")
    .eq("level", d.experienceLevel);
  const template =
    (templates ?? []).find((t) => t.goal.toLowerCase() === d.goal.toLowerCase()) ?? (templates ?? [])[0] ?? null;

  if (template) {
    const { error: rpcError } = await supabase.rpc("generate_draft_plan", {
      p_member_id: profile.id,
      p_template_id: template.id,
    });
    if (rpcError) return { error: "Profil gespeichert, aber der Planentwurf konnte nicht erstellt werden." };
  }

  revalidatePath("/mitglied");
  revalidatePath("/mitglied/training");
  redirect("/mitglied/training");
}

const loggedSetSchema = z.object({
  planExerciseId: z.string().uuid(),
  setNumber: z.number().int().min(1),
  weightKg: z.number().min(0).max(500).nullable(),
  reps: z.number().int().min(0).max(200).nullable(),
  perceivedExertion: z.number().int().min(1).max(10).nullable(),
  note: z.string().trim().max(500).nullable(),
  painFlag: z.boolean(),
});

const finishWorkoutSchema = z.object({
  planId: z.string().uuid().nullable(),
  planDayId: z.string().uuid().nullable(),
  startedAt: z.string(),
  durationMin: z.number().int().min(0).max(600),
  feelingNote: z.string().trim().max(1000).nullable(),
  sets: z.array(loggedSetSchema),
});

export type FinishWorkoutInput = z.infer<typeof finishWorkoutSchema>;

/** Saves a completed (or partially completed — ending early still counts) training session. */
export async function finishWorkoutAction(input: FinishWorkoutInput): Promise<{ error?: string; sessionId?: string }> {
  const profile = await requireMember();
  const parsed = finishWorkoutSchema.safeParse(input);
  if (!parsed.success) return { error: "Training konnte nicht gespeichert werden." };
  const d = parsed.data;

  const totalVolumeKg = d.sets.reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.reps ?? 0), 0);

  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase
    .from("workout_sessions")
    .insert({
      member_id: profile.id,
      plan_id: d.planId,
      plan_day_id: d.planDayId,
      started_at: d.startedAt,
      completed_at: new Date().toISOString(),
      duration_min: d.durationMin,
      total_volume_kg: Math.round(totalVolumeKg * 10) / 10,
      feeling_note: d.feelingNote,
    })
    .select("id")
    .single();
  if (sessionError || !session) return { error: "Training konnte nicht gespeichert werden." };

  if (d.sets.length > 0) {
    const { error: setsError } = await supabase.from("workout_sets").insert(
      d.sets.map((s) => ({
        session_id: session.id,
        plan_exercise_id: s.planExerciseId,
        set_number: s.setNumber,
        weight_kg: s.weightKg,
        reps: s.reps,
        perceived_exertion: s.perceivedExertion,
        note: s.note,
        pain_flag: s.painFlag,
      })),
    );
    if (setsError) return { error: "Sätze konnten nicht gespeichert werden." };
  }

  revalidatePath("/mitglied");
  revalidatePath("/mitglied/fortschritt");
  return { sessionId: session.id };
}

const requestChangeSchema = z.object({ message: z.string().trim().min(5, "Bitte kurz beschreiben, was du dir wünschst.") });

/** A member asking their trainer to adjust the currently active plan. */
export async function requestPlanChangeAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const profile = await requireMember();
  const planId = formData.get("planId");
  const parsed = requestChangeSchema.safeParse({ message: formData.get("message") });
  if (typeof planId !== "string" || !parsed.success) {
    return { error: parsed.success ? "Ungültige Eingabe." : parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("plan_change_requests")
    .insert({ plan_id: planId, member_id: profile.id, message: parsed.data.message });
  if (error) return { error: "Anfrage konnte nicht gesendet werden." };

  revalidatePath("/mitglied/trainingsplan");
  return { success: true };
}

const sendMessageSchema = z.object({ body: z.string().trim().min(1).max(2000) });

export async function sendCoachMessageAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireMember();
  const parsed = sendMessageSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) return { error: "Nachricht darf nicht leer sein." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("coach_messages")
    .insert({ member_id: profile.id, sender_id: profile.id, sender_role: "member", body: parsed.data.body });
  if (error) return { error: "Nachricht konnte nicht gesendet werden." };

  revalidatePath("/mitglied/nachrichten");
  return {};
}

const bodyMeasurementSchema = z.object({
  weightKg: z.coerce.number().min(30).max(300).optional(),
  bodyFatPct: z.coerce.number().min(2).max(60).optional(),
  notes: z.string().trim().optional(),
});

export async function logBodyMeasurementAction(formData: FormData): Promise<{ error?: string }> {
  const profile = await requireMember();
  const parsed = bodyMeasurementSchema.safeParse({
    weightKg: formData.get("weightKg") || undefined,
    bodyFatPct: formData.get("bodyFatPct") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return { error: "Ungültige Eingabe." };
  if (parsed.data.weightKg === undefined && parsed.data.bodyFatPct === undefined) {
    return { error: "Bitte mindestens einen Wert eintragen." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("body_measurements").insert({
    member_id: profile.id,
    weight_kg: parsed.data.weightKg ?? null,
    body_fat_pct: parsed.data.bodyFatPct ?? null,
    notes: parsed.data.notes ?? null,
  });
  if (error) return { error: "Wert konnte nicht gespeichert werden." };
  revalidatePath("/mitglied/profil");
  revalidatePath("/mitglied/fortschritt");
  return {};
}

/** Revokes health-data consent (a new append-only event, never deletes the earlier "granted" row). */
export async function revokeHealthConsentAction(): Promise<{ error?: string }> {
  const profile = await requireMember();
  const supabase = await createClient();
  const { error } = await supabase.from("health_consents").insert({ member_id: profile.id, event: "revoked" });
  if (error) return { error: "Widerruf konnte nicht gespeichert werden." };
  revalidatePath("/mitglied/profil");
  return {};
}

/**
 * A member can't self-delete their account here (no account-deletion UI exists yet, and
 * destroying auth users needs the service-role client — an admin-only operation elsewhere in
 * this app). Instead this sends a real, visible request to their trainer, so it's an honest
 * "yes, this does something" action rather than a dead button.
 */
export async function requestAccountDeletionAction(): Promise<{ error?: string }> {
  const profile = await requireMember();
  const supabase = await createClient();
  const { error } = await supabase.from("coach_messages").insert({
    member_id: profile.id,
    sender_id: profile.id,
    sender_role: "member",
    body: "Ich möchte mein Konto und meine gespeicherten Daten löschen lassen. Bitte um Rückmeldung zum weiteren Vorgehen.",
  });
  if (error) return { error: "Anfrage konnte nicht gesendet werden." };
  revalidatePath("/mitglied/nachrichten");
  return {};
}

/** Trainer/admin reply in the same member thread — shared with sendCoachMessageAction's member side. */
export async function sendTrainerMessageAction(memberId: string, formData: FormData): Promise<{ error?: string }> {
  const profile = await requireTrainerOrAdmin();
  const parsed = sendMessageSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) return { error: "Nachricht darf nicht leer sein." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("coach_messages")
    .insert({ member_id: memberId, sender_id: profile.id, sender_role: "trainer", body: parsed.data.body });
  if (error) return { error: "Nachricht konnte nicht gesendet werden." };

  revalidatePath(`/trainer/mitglieder/${memberId}`);
  return {};
}
