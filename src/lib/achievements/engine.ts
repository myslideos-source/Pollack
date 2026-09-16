import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { berlinHour, berlinCalendarDay, isoWeekday, longestWeekStreak, maxCountInOneWeek } from "@/lib/achievements/calendar";

type Client = SupabaseClient<Database>;

export type UnlockedAchievement = {
  slug: string;
  title: string;
  description: string;
  tier: string | null;
  iconKey: string;
  shareText: string | null;
};

const DAY_MS = 86_400_000;

async function unlock(supabase: Client, memberId: string, slug: string, progress: number, reached: boolean): Promise<boolean> {
  const { data, error } = await supabase.rpc("unlock_achievement", {
    p_member_id: memberId,
    p_achievement_slug: slug,
    p_progress: progress,
    p_unlock: reached,
  });
  if (error) {
    console.error(`[achievements] unlock_achievement(${slug})`, error.message);
    return false;
  }
  return data?.[0]?.unlocked_now ?? false;
}

/** Fetches display metadata for a batch of newly-unlocked slugs, in catalog sort order. */
async function resolveUnlocked(supabase: Client, slugs: string[]): Promise<UnlockedAchievement[]> {
  if (slugs.length === 0) return [];
  const { data } = await supabase
    .from("achievements")
    .select("slug, title, description, tier, icon_key, share_text, sort_order")
    .in("slug", slugs)
    .order("sort_order");
  return (data ?? []).map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    tier: a.tier,
    iconKey: a.icon_key,
    shareText: a.share_text,
  }));
}

type CompletedSession = { id: string; startedAt: string; completedAt: string; volumeKg: number };

async function loadCompletedSessions(supabase: Client, memberId: string): Promise<CompletedSession[]> {
  const { data } = await supabase
    .from("workout_sessions")
    .select("id, started_at, completed_at, total_volume_kg")
    .eq("member_id", memberId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: true });
  return (data ?? []).map((s) => ({
    id: s.id,
    startedAt: s.started_at,
    completedAt: s.completed_at!,
    volumeKg: s.total_volume_kg ?? 0,
  }));
}

/** Runs every achievement check that can be triggered by finishing a workout session. Called
 *  right after finishWorkoutAction persists the session — never on a session that was merely
 *  opened, since only completed_at (set on save) makes it count. */
export async function runWorkoutAchievementChecks(
  supabase: Client,
  memberId: string,
  params: { sessionId: string; planDayId: string | null; sets: { planExerciseId: string; weightKg: number | null; reps: number | null }[] },
): Promise<UnlockedAchievement[]> {
  const newlyUnlocked: string[] = [];
  const sessions = await loadCompletedSessions(supabase, memberId);
  const totalSessions = sessions.length;

  // Erster Schritt + Trainingsroutine (Bronze/Silber/Gold/Platin)
  const workoutMilestones: [string, number][] = [
    ["erster-schritt", 1],
    ["trainingsroutine-bronze", 10],
    ["trainingsroutine-silber", 25],
    ["trainingsroutine-gold", 50],
    ["trainingsroutine-platin", 100],
  ];
  for (const [slug, threshold] of workoutMilestones) {
    if (await unlock(supabase, memberId, slug, totalSessions, totalSessions >= threshold)) newlyUnlocked.push(slug);
  }

  // Voll durchgezogen — every planned exercise for the day was logged, no skip.
  if (params.planDayId) {
    const { count: plannedCount } = await supabase
      .from("training_plan_exercises")
      .select("id", { count: "exact", head: true })
      .eq("plan_day_id", params.planDayId);
    const loggedCount = new Set(params.sets.map((s) => s.planExerciseId)).size;
    const fullyDone = Boolean(plannedCount) && loggedCount >= (plannedCount ?? 0);
    if (await unlock(supabase, memberId, "voll-durchgezogen", fullyDone ? 1 : 0, fullyDone)) newlyUnlocked.push("voll-durchgezogen");
  }

  // Wochenstark — 3 sessions in one calendar week.
  const bestWeekCount = maxCountInOneWeek(sessions.map((s) => s.completedAt));
  if (await unlock(supabase, memberId, "wochenstark", bestWeekCount, bestWeekCount >= 3)) newlyUnlocked.push("wochenstark");

  // Im Rhythmus (4) / Fester Bestandteil (12) — longest run of consecutive weeks trained.
  const streak = longestWeekStreak(sessions.map((s) => s.completedAt));
  if (await unlock(supabase, memberId, "im-rhythmus", streak, streak >= 4)) newlyUnlocked.push("im-rhythmus");
  if (await unlock(supabase, memberId, "fester-bestandteil", streak, streak >= 12)) newlyUnlocked.push("fester-bestandteil");

  // Frühstarter — 10 sessions completed before 08:00 Berlin time.
  const earlyCount = sessions.filter((s) => berlinHour(s.completedAt) < 8).length;
  if (await unlock(supabase, memberId, "fruehstarter", earlyCount, earlyCount >= 10)) newlyUnlocked.push("fruehstarter");

  // Wochenend-Kämpfer — 10 sessions on Saturday/Sunday.
  const weekendCount = sessions.filter((s) => {
    const wd = isoWeekday(berlinCalendarDay(s.completedAt));
    return wd === 5 || wd === 6;
  }).length;
  if (await unlock(supabase, memberId, "wochenend-kaempfer", weekendCount, weekendCount >= 10)) newlyUnlocked.push("wochenend-kaempfer");

  // Comeback — this session follows a gap of 21+ days since the previous one.
  if (sessions.length >= 2) {
    const last = sessions[sessions.length - 1];
    const prev = sessions[sessions.length - 2];
    const gapDays = (new Date(last.completedAt).getTime() - new Date(prev.completedAt).getTime()) / DAY_MS;
    const isComeback = gapDays >= 21 && last.id === params.sessionId;
    if (isComeback && (await unlock(supabase, memberId, "comeback", 1, true))) newlyUnlocked.push("comeback");
  }

  // Kraftpaket — cumulative training volume across all sessions.
  const totalVolume = sessions.reduce((sum, s) => sum + s.volumeKg, 0);
  if (await unlock(supabase, memberId, "kraftpaket", totalVolume, totalVolume >= 50_000)) newlyUnlocked.push("kraftpaket");

  // Persönlicher Rekord / Beständig stärker — new all-time-best weight per exercise, logged
  // once per exercise+session via achievement_events so re-processing can never double-count.
  const prCount = await recordPersonalRecords(supabase, memberId, params.sessionId, params.sets);
  if (prCount > 0 && (await unlock(supabase, memberId, "persoenlicher-rekord", 1, true))) newlyUnlocked.push("persoenlicher-rekord");
  const { count: totalPrEvents } = await supabase
    .from("achievement_events")
    .select("id", { count: "exact", head: true })
    .eq("member_id", memberId)
    .eq("event_type", "personal_record");
  const prTotal = totalPrEvents ?? 0;
  if (await unlock(supabase, memberId, "bestaendig-staerker", prTotal, prTotal >= 5)) newlyUnlocked.push("bestaendig-staerker");

  newlyUnlocked.push(...(await checkMembershipDuration(supabase, memberId)));

  return resolveUnlocked(supabase, newlyUnlocked);
}

/** Compares each logged exercise's best set this session against the member's all-time best
 *  from every prior session, and records a one-time event for each genuine new record. Returns
 *  how many new records this session produced. */
async function recordPersonalRecords(
  supabase: Client,
  memberId: string,
  sessionId: string,
  sets: { planExerciseId: string; weightKg: number | null; reps: number | null }[],
): Promise<number> {
  const planExerciseIds = Array.from(new Set(sets.map((s) => s.planExerciseId)));
  if (planExerciseIds.length === 0) return 0;

  const { data: planExRows } = await supabase.from("training_plan_exercises").select("id, exercise_id").in("id", planExerciseIds);
  const exerciseIdByPlanEx = new Map((planExRows ?? []).map((r) => [r.id, r.exercise_id]));
  const exerciseIds = Array.from(new Set(exerciseIdByPlanEx.values()));
  if (exerciseIds.length === 0) return 0;

  const { data: allPlanExForExercises } = await supabase.from("training_plan_exercises").select("id, exercise_id").in("exercise_id", exerciseIds);
  const exerciseIdByAnyPlanEx = new Map((allPlanExForExercises ?? []).map((r) => [r.id, r.exercise_id]));

  const { data: priorSessions } = await supabase.from("workout_sessions").select("id").eq("member_id", memberId).neq("id", sessionId);
  const priorSessionIds = (priorSessions ?? []).map((s) => s.id);

  const priorBestByExercise = new Map<string, number>();
  if (priorSessionIds.length > 0) {
    const { data: priorSets } = await supabase
      .from("workout_sets")
      .select("weight_kg, plan_exercise_id")
      .in("session_id", priorSessionIds)
      .not("weight_kg", "is", null);
    for (const s of priorSets ?? []) {
      if (!s.plan_exercise_id || s.weight_kg == null) continue;
      const exId = exerciseIdByAnyPlanEx.get(s.plan_exercise_id);
      if (!exId) continue;
      priorBestByExercise.set(exId, Math.max(priorBestByExercise.get(exId) ?? 0, s.weight_kg));
    }
  }

  const sessionBestByExercise = new Map<string, number>();
  for (const s of sets) {
    if (s.weightKg == null) continue;
    const exId = exerciseIdByPlanEx.get(s.planExerciseId);
    if (!exId) continue;
    sessionBestByExercise.set(exId, Math.max(sessionBestByExercise.get(exId) ?? 0, s.weightKg));
  }

  let newRecords = 0;
  for (const [exId, best] of sessionBestByExercise) {
    const prior = priorBestByExercise.get(exId);
    if (prior == null || best <= prior) continue;
    const { error } = await supabase.from("achievement_events").insert({
      member_id: memberId,
      event_type: "personal_record",
      reference_id: exId,
      value: best,
      idempotency_key: `personal_record:${memberId}:${exId}:${sessionId}`,
      processed_at: new Date().toISOString(),
    });
    // A unique-violation here means this exact event was already recorded (safe to ignore);
    // any other error just means this one exercise's PB isn't counted this run.
    if (!error) newRecords += 1;
  }
  return newRecords;
}

/** Ein Jahr Sportpark / Teil der Familie — membership length isn't triggered by a single event,
 *  so it's re-checked opportunistically whenever the member does something. Uses profiles'
 *  account-creation date as the best available real proxy (see migration 0011 notes). */
async function checkMembershipDuration(supabase: Client, memberId: string): Promise<string[]> {
  const { data: profile } = await supabase.from("profiles").select("created_at").eq("id", memberId).maybeSingle();
  if (!profile) return [];
  const days = Math.floor((Date.now() - new Date(profile.created_at).getTime()) / DAY_MS);
  const newlyUnlocked: string[] = [];
  if (await unlock(supabase, memberId, "ein-jahr-sportpark", days, days >= 365)) newlyUnlocked.push("ein-jahr-sportpark");
  if (await unlock(supabase, memberId, "teil-der-familie", days, days >= 1095)) newlyUnlocked.push("teil-der-familie");
  return newlyUnlocked;
}

/** Angekommen — the onboarding questionnaire (Erstanalyse) has been completed. */
export async function runOnboardingAchievementChecks(supabase: Client, memberId: string): Promise<UnlockedAchievement[]> {
  const newlyUnlocked: string[] = [];
  if (await unlock(supabase, memberId, "angekommen", 1, true)) newlyUnlocked.push("angekommen");
  return resolveUnlocked(supabase, newlyUnlocked);
}

/** Planstarter — the member's first training plan (any status) has been created. */
export async function runPlanStartedAchievementCheck(supabase: Client, memberId: string): Promise<UnlockedAchievement[]> {
  const { count } = await supabase.from("training_plans").select("id", { count: "exact", head: true }).eq("member_id", memberId);
  const has = (count ?? 0) > 0;
  const newlyUnlocked: string[] = [];
  if (await unlock(supabase, memberId, "planstarter", has ? 1 : 0, has)) newlyUnlocked.push("planstarter");
  return resolveUnlocked(supabase, newlyUnlocked);
}

/** Fortschritt sichtbar (2.) / Körper im Blick (5.) — count of logged body-composition check-ins. */
export async function runBodyMeasurementAchievementChecks(supabase: Client, memberId: string): Promise<UnlockedAchievement[]> {
  const { count } = await supabase.from("body_measurements").select("id", { count: "exact", head: true }).eq("member_id", memberId);
  const n = count ?? 0;
  const newlyUnlocked: string[] = [];
  if (await unlock(supabase, memberId, "fortschritt-sichtbar", n, n >= 2)) newlyUnlocked.push("fortschritt-sichtbar");
  if (await unlock(supabase, memberId, "koerper-im-blick", n, n >= 5)) newlyUnlocked.push("koerper-im-blick");
  return resolveUnlocked(supabase, newlyUnlocked);
}
