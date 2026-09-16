import "server-only";
import { createClient } from "@/lib/supabase/server";
import { weekdayLabel, todayWeekday } from "@/lib/member/weekday";
import { resolveMedia } from "@/lib/content/media";
import { defaultCoverForTitle } from "@/lib/member/training-cover";

export { weekdayLabel, todayWeekday };

export type MemberProfile = {
  id: string;
  fullName: string;
  goal: string | null;
  birthYear: number | null;
  heightCm: number | null;
  weightKg: number | null;
  experienceLevel: string | null;
  trainingDaysPerWeek: number | null;
  sessionDurationMin: number | null;
  focusAreas: string[];
  healthNotes: string | null;
  excludedExercises: string[];
  preferences: string | null;
  intensityPreference: string | null;
  assignedTrainerId: string | null;
  assignedTrainerName: string | null;
  onboardingCompletedAt: string | null;
  nextAnalysisDate: string | null;
};

const WEEKDAY_JS_INDEX: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

export async function loadMemberProfile(memberId: string): Promise<MemberProfile | null> {
  const supabase = await createClient();
  const [{ data: profile }, { data: member }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", memberId).single(),
    supabase.from("member_profiles").select("*").eq("id", memberId).maybeSingle(),
  ]);
  if (!profile || !member) return null;

  let trainerName: string | null = null;
  if (member.assigned_trainer_id) {
    const { data: trainer } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", member.assigned_trainer_id)
      .maybeSingle();
    trainerName = trainer?.full_name ?? null;
  }

  return {
    id: memberId,
    fullName: profile.full_name,
    goal: member.goal,
    birthYear: member.birth_year,
    heightCm: member.height_cm,
    weightKg: member.weight_kg,
    experienceLevel: member.experience_level,
    trainingDaysPerWeek: member.training_days_per_week,
    sessionDurationMin: member.session_duration_min,
    focusAreas: member.focus_areas ?? [],
    healthNotes: member.health_notes,
    excludedExercises: member.excluded_exercises ?? [],
    preferences: member.preferences,
    intensityPreference: member.intensity_preference,
    assignedTrainerId: member.assigned_trainer_id,
    assignedTrainerName: trainerName,
    onboardingCompletedAt: member.onboarding_completed_at,
    nextAnalysisDate: member.next_analysis_date,
  };
}

export type PlanExercise = {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroup: string | null;
  description: string | null;
  imageSrc: string | null;
  imageFocalX: number;
  imageFocalY: number;
  sets: number;
  reps: string;
  restSeconds: number;
  targetWeightKg: number | null;
  trainerNote: string | null;
  sortOrder: number;
  alternativeExerciseId: string | null;
  alternativeExerciseName: string | null;
};

export type PlanDay = {
  id: string;
  weekday: string;
  title: string;
  sortOrder: number;
  exercises: PlanExercise[];
  coverImageSrc: string;
  coverImageAlt: string;
  coverImageFocalX: number;
  coverImageFocalY: number;
  hasCustomCover: boolean;
};

export type ActivePlan = {
  id: string;
  status: string;
  version: number;
  notes: string | null;
  reviewedAt: string | null;
  reviewedByName: string | null;
  days: PlanDay[];
};

async function loadPlanTree(planId: string): Promise<PlanDay[]> {
  const supabase = await createClient();
  const { data: days } = await supabase
    .from("training_plan_days")
    .select("id, weekday, title, sort_order, cover_media_id, cover_alt")
    .eq("plan_id", planId)
    .order("sort_order");
  if (!days || days.length === 0) return [];

  const coverByDayId = new Map<string, { src: string; alt: string; focalX: number; focalY: number; custom: boolean }>();
  await Promise.all(
    days.map(async (day) => {
      const resolved = day.cover_media_id ? await resolveMedia(day.cover_media_id) : null;
      const fallback = defaultCoverForTitle(day.title);
      coverByDayId.set(
        day.id,
        resolved
          ? { src: resolved.src, alt: day.cover_alt ?? fallback.alt, focalX: resolved.focalX, focalY: resolved.focalY, custom: true }
          : { src: fallback.src, alt: day.cover_alt ?? fallback.alt, focalX: fallback.focalX, focalY: fallback.focalY, custom: false },
      );
    }),
  );

  const { data: exercises } = await supabase
    .from("training_plan_exercises")
    .select(
      "id, plan_day_id, exercise_id, alternative_exercise_id, sets, reps, rest_seconds, target_weight_kg, trainer_note, sort_order",
    )
    .in(
      "plan_day_id",
      days.map((d) => d.id),
    )
    .order("sort_order");

  const exerciseIds = Array.from(
    new Set((exercises ?? []).flatMap((e) => [e.exercise_id, e.alternative_exercise_id].filter((v): v is string => Boolean(v)))),
  );
  const { data: exerciseDetails } =
    exerciseIds.length > 0
      ? await supabase
          .from("exercises")
          .select("id, name, muscle_group, description, image_media_id")
          .in("id", exerciseIds)
      : { data: [] as { id: string; name: string; muscle_group: string | null; description: string | null; image_media_id: string | null }[] };

  const byId = new Map((exerciseDetails ?? []).map((e) => [e.id, e]));

  const imageByExerciseId = new Map<string, { src: string; focalX: number; focalY: number }>();
  await Promise.all(
    (exerciseDetails ?? []).map(async (e) => {
      const resolved = await resolveMedia(e.image_media_id);
      if (resolved) imageByExerciseId.set(e.id, resolved);
    }),
  );

  return days.map((day) => {
    const cover = coverByDayId.get(day.id)!;
    return {
    id: day.id,
    weekday: day.weekday,
    title: day.title,
    sortOrder: day.sort_order,
    coverImageSrc: cover.src,
    coverImageAlt: cover.alt,
    coverImageFocalX: cover.focalX,
    coverImageFocalY: cover.focalY,
    hasCustomCover: cover.custom,
    exercises: (exercises ?? [])
      .filter((e) => e.plan_day_id === day.id)
      .map((e) => {
        const detail = byId.get(e.exercise_id);
        const alt = e.alternative_exercise_id ? byId.get(e.alternative_exercise_id) : null;
        const image = imageByExerciseId.get(e.exercise_id) ?? null;
        return {
          id: e.id,
          exerciseId: e.exercise_id,
          name: detail?.name ?? "Übung",
          muscleGroup: detail?.muscle_group ?? null,
          description: detail?.description ?? null,
          imageSrc: image?.src ?? null,
          imageFocalX: image?.focalX ?? 50,
          imageFocalY: image?.focalY ?? 50,
          sets: e.sets,
          reps: e.reps,
          restSeconds: e.rest_seconds,
          targetWeightKg: e.target_weight_kg,
          trainerNote: e.trainer_note,
          sortOrder: e.sort_order,
          alternativeExerciseId: e.alternative_exercise_id,
          alternativeExerciseName: alt?.name ?? null,
        };
      }),
    };
  });
}

export async function loadActivePlan(memberId: string): Promise<ActivePlan | null> {
  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("training_plans")
    .select("id, status, version, notes, reviewed_at, reviewed_by")
    .eq("member_id", memberId)
    .eq("status", "active")
    .maybeSingle();
  if (!plan) return null;

  let reviewedByName: string | null = null;
  if (plan.reviewed_by) {
    const { data: reviewer } = await supabase.from("profiles").select("full_name").eq("id", plan.reviewed_by).maybeSingle();
    reviewedByName = reviewer?.full_name ?? null;
  }

  const days = await loadPlanTree(plan.id);
  return {
    id: plan.id,
    status: plan.status,
    version: plan.version,
    notes: plan.notes,
    reviewedAt: plan.reviewed_at,
    reviewedByName,
    days,
  };
}

export async function loadPendingPlan(memberId: string): Promise<ActivePlan | null> {
  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("training_plans")
    .select("id, status, version, notes, reviewed_at, reviewed_by")
    .eq("member_id", memberId)
    .in("status", ["pending_review", "change_requested"])
    .order("created_at", { ascending: false })
    .maybeSingle();
  if (!plan) return null;
  const days = await loadPlanTree(plan.id);
  return { id: plan.id, status: plan.status, version: plan.version, notes: plan.notes, reviewedAt: plan.reviewed_at, reviewedByName: null, days };
}

export type DashboardStats = {
  sessionsThisWeek: number;
  volumeThisWeekKg: number;
  streakDays: number;
  planCompletionPct: number | null;
};

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as week start
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function loadDashboardStats(memberId: string, plan: ActivePlan | null): Promise<DashboardStats> {
  const supabase = await createClient();
  const weekStart = startOfWeek(new Date());

  const { data: sessions } = await supabase
    .from("workout_sessions")
    .select("started_at, total_volume_kg")
    .eq("member_id", memberId)
    .not("completed_at", "is", null)
    .order("started_at", { ascending: false })
    .limit(90);

  const all = sessions ?? [];
  const thisWeek = all.filter((s) => new Date(s.started_at) >= weekStart);
  const sessionsThisWeek = thisWeek.length;
  const volumeThisWeekKg = thisWeek.reduce((sum, s) => sum + (s.total_volume_kg ?? 0), 0);

  let streakDays = 0;
  if (plan && plan.days.length > 0) {
    const scheduledDow = new Set(plan.days.map((d) => WEEKDAY_JS_INDEX[d.weekday]));
    const sessionDates = new Set(all.map((s) => new Date(s.started_at).toISOString().slice(0, 10)));
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const cursor = new Date(today);
    if (scheduledDow.has(cursor.getDay()) && !sessionDates.has(todayStr)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    for (let i = 0; i < 120; i++) {
      const dow = cursor.getDay();
      const dateStr = cursor.toISOString().slice(0, 10);
      if (scheduledDow.has(dow) && !sessionDates.has(dateStr)) break;
      streakDays++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  let planCompletionPct: number | null = null;
  if (plan && plan.days.length > 0) {
    const since = new Date();
    since.setDate(since.getDate() - 28);
    const recentSessions = all.filter((s) => new Date(s.started_at) >= since);
    const expected = plan.days.length * 4; // 4 weeks
    planCompletionPct = expected > 0 ? Math.min(100, Math.round((recentSessions.length / expected) * 100)) : null;
  }

  return { sessionsThisWeek, volumeThisWeekKg: Math.round(volumeThisWeekKg), streakDays, planCompletionPct };
}

export type LastSetInfo = { weightKg: number | null; reps: number | null };

/** For each plan exercise, the weight/reps logged in the most recent past session — shown in
 *  the active workout as "Gewicht der letzten Einheit" so a member knows what they lifted last time. */
export async function loadLastSetsForPlanExercises(
  memberId: string,
  planExerciseIds: string[],
): Promise<Map<string, LastSetInfo>> {
  const result = new Map<string, LastSetInfo>();
  if (planExerciseIds.length === 0) return result;

  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("workout_sessions")
    .select("id")
    .eq("member_id", memberId)
    .order("started_at", { ascending: false })
    .limit(20);
  const sessionIds = (sessions ?? []).map((s) => s.id);
  if (sessionIds.length === 0) return result;

  const { data: sets } = await supabase
    .from("workout_sets")
    .select("plan_exercise_id, weight_kg, reps, completed_at")
    .in("session_id", sessionIds)
    .in("plan_exercise_id", planExerciseIds)
    .order("completed_at", { ascending: false });

  for (const s of sets ?? []) {
    if (!s.plan_exercise_id || result.has(s.plan_exercise_id)) continue;
    result.set(s.plan_exercise_id, { weightKg: s.weight_kg, reps: s.reps });
  }
  return result;
}

export type ProgressData = {
  sessionCount: number;
  volumeSeries: { label: string; value: number }[];
  bodyWeightSeries: { label: string; value: number }[];
  strengthSeries: { label: string; value: number }[];
  strengthExerciseName: string | null;
  strengthDeltaKg: number | null;
  personalBests: { exerciseName: string; weightKg: number }[];
  streakDays: number;
  planCompletionPct: number | null;
};

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}

export async function loadProgressData(memberId: string, windowDays: number, plan: ActivePlan | null): Promise<ProgressData> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - windowDays);

  const { data: sessions } = await supabase
    .from("workout_sessions")
    .select("id, started_at, total_volume_kg")
    .eq("member_id", memberId)
    .not("completed_at", "is", null)
    .gte("started_at", since.toISOString())
    .order("started_at", { ascending: true });

  const sessionRows = sessions ?? [];
  const volumeSeries = sessionRows.map((s) => ({ label: shortDate(s.started_at), value: Math.round(s.total_volume_kg ?? 0) }));

  const { data: measurements } = await supabase
    .from("body_measurements")
    .select("measured_at, weight_kg")
    .eq("member_id", memberId)
    .gte("measured_at", since.toISOString().slice(0, 10))
    .order("measured_at", { ascending: true });
  const bodyWeightSeries = (measurements ?? [])
    .filter((m) => m.weight_kg != null)
    .map((m) => ({ label: shortDate(m.measured_at), value: m.weight_kg as number }));

  let strengthSeries: { label: string; value: number }[] = [];
  let strengthExerciseName: string | null = null;
  let strengthDeltaKg: number | null = null;

  const mainExerciseId = plan?.days.flatMap((d) => d.exercises).find((e) => e.name === "Bankdrücken")?.exerciseId
    ?? plan?.days.flatMap((d) => d.exercises)[0]?.exerciseId
    ?? null;

  if (mainExerciseId && sessionRows.length > 0) {
    const { data: planExRows } = await supabase.from("training_plan_exercises").select("id, exercise_id").eq("exercise_id", mainExerciseId);
    const planExIds = (planExRows ?? []).map((r) => r.id);
    if (planExIds.length > 0) {
      const { data: sets } = await supabase
        .from("workout_sets")
        .select("weight_kg, completed_at, session_id")
        .in("plan_exercise_id", planExIds)
        .in("session_id", sessionRows.map((s) => s.id))
        .order("completed_at", { ascending: true });
      const byDate = new Map<string, number>();
      for (const s of sets ?? []) {
        if (s.weight_kg == null) continue;
        const key = shortDate(s.completed_at);
        byDate.set(key, Math.max(byDate.get(key) ?? 0, s.weight_kg));
      }
      strengthSeries = Array.from(byDate, ([label, value]) => ({ label, value }));
      if (strengthSeries.length > 0) {
        const { data: ex } = await supabase.from("exercises").select("name").eq("id", mainExerciseId).maybeSingle();
        strengthExerciseName = ex?.name ?? null;
        strengthDeltaKg = Math.round((strengthSeries[strengthSeries.length - 1].value - strengthSeries[0].value) * 10) / 10;
      }
    }
  }

  const { data: allSetsForBests } = await supabase
    .from("workout_sets")
    .select("weight_kg, plan_exercise_id, session_id")
    .in("session_id", sessionRows.map((s) => s.id));
  const bestByPlanExercise = new Map<string, number>();
  for (const s of allSetsForBests ?? []) {
    if (!s.plan_exercise_id || s.weight_kg == null) continue;
    bestByPlanExercise.set(s.plan_exercise_id, Math.max(bestByPlanExercise.get(s.plan_exercise_id) ?? 0, s.weight_kg));
  }
  const planExerciseIds = Array.from(bestByPlanExercise.keys());
  let personalBests: { exerciseName: string; weightKg: number }[] = [];
  if (planExerciseIds.length > 0) {
    const { data: planExDetails } = await supabase
      .from("training_plan_exercises")
      .select("id, exercise_id")
      .in("id", planExerciseIds);
    const exerciseIds = Array.from(new Set((planExDetails ?? []).map((p) => p.exercise_id)));
    const { data: exerciseNames } = await supabase.from("exercises").select("id, name").in("id", exerciseIds);
    const nameById = new Map((exerciseNames ?? []).map((e) => [e.id, e.name]));
    personalBests = (planExDetails ?? [])
      .map((p) => ({ exerciseName: nameById.get(p.exercise_id) ?? "Übung", weightKg: bestByPlanExercise.get(p.id) ?? 0 }))
      .sort((a, b) => b.weightKg - a.weightKg)
      .slice(0, 5);
  }

  const stats = await loadDashboardStats(memberId, plan);

  return {
    sessionCount: sessionRows.length,
    volumeSeries,
    bodyWeightSeries,
    strengthSeries,
    strengthExerciseName,
    strengthDeltaKg,
    personalBests,
    streakDays: stats.streakDays,
    planCompletionPct: stats.planCompletionPct,
  };
}

export type CoachMessage = {
  id: string;
  senderRole: string;
  senderName: string;
  body: string;
  createdAt: string;
  readAt: string | null;
};

export async function loadUnreadMessageCount(memberId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("coach_messages")
    .select("id", { count: "exact", head: true })
    .eq("member_id", memberId)
    .eq("sender_role", "trainer")
    .is("read_at", null);
  return count ?? 0;
}

export async function loadLatestCoachMessage(memberId: string): Promise<CoachMessage | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coach_messages")
    .select("id, sender_id, sender_role, body, created_at, read_at")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  const { data: sender } = await supabase.from("profiles").select("full_name").eq("id", data.sender_id).maybeSingle();
  return {
    id: data.id,
    senderRole: data.sender_role,
    senderName: sender?.full_name ?? "Trainer",
    body: data.body,
    createdAt: data.created_at,
    readAt: data.read_at,
  };
}
