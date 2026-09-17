import "server-only";
import { createClient } from "@/lib/supabase/server";
import { dateKeyBerlin } from "@/lib/admin/dateKey";

export type DashboardStats = {
  activeMembers: number;
  activeMembersDelta: number;
  checkInsToday: number;
  checkInsTodayDelta: number;
  newMembersThisMonth: number;
  newMembersDelta: number;
  activityPct: number;
};

/** Four KPI numbers for DashboardStats — all derived from real rows, no placeholders. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    { count: activeMembers },
    { count: checkInsToday },
    { count: checkInsYesterday },
    { count: newMembersThisMonth },
    { count: newMembersLastMonth },
    { data: recentVisits },
    { data: recentWorkouts },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "mitglied"),
    supabase
      .from("studio_visits")
      .select("id", { count: "exact", head: true })
      .gte("checked_in_at", todayStart.toISOString())
      .lt("checked_in_at", todayEnd.toISOString()),
    supabase
      .from("studio_visits")
      .select("id", { count: "exact", head: true })
      .gte("checked_in_at", yesterdayStart.toISOString())
      .lt("checked_in_at", todayStart.toISOString()),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "mitglied")
      .gte("created_at", monthStart.toISOString()),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "mitglied")
      .gte("created_at", lastMonthStart.toISOString())
      .lt("created_at", monthStart.toISOString()),
    supabase.from("studio_visits").select("member_id").gte("checked_in_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("workout_sessions")
      .select("member_id")
      .not("completed_at", "is", null)
      .gte("completed_at", thirtyDaysAgo.toISOString()),
  ]);

  const activeSet = new Set<string>();
  for (const row of recentVisits ?? []) activeSet.add(row.member_id);
  for (const row of recentWorkouts ?? []) activeSet.add(row.member_id);

  const activityPct = activeMembers && activeMembers > 0 ? Math.round((activeSet.size / activeMembers) * 100) : 0;

  return {
    activeMembers: activeMembers ?? 0,
    activeMembersDelta: newMembersThisMonth ?? 0,
    checkInsToday: checkInsToday ?? 0,
    checkInsTodayDelta: (checkInsToday ?? 0) - (checkInsYesterday ?? 0),
    newMembersThisMonth: newMembersThisMonth ?? 0,
    newMembersDelta: (newMembersThisMonth ?? 0) - (newMembersLastMonth ?? 0),
    activityPct,
  };
}

export type DailyActivityPoint = { date: string; count: number };

/**
 * Unique active-member count per day, for the last `lookbackDays` days — a member counts once
 * per day whether they checked in, completed a workout, or both (no double-counting). Covers
 * every period MemberActivityChart's filters need (week/last week/month/30 days) in one query
 * pair, so switching filters client-side never needs another round trip.
 */
export async function getMemberActivitySeries(lookbackDays = 45): Promise<DailyActivityPoint[]> {
  const supabase = await createClient();

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - lookbackDays + 1);
  start.setHours(0, 0, 0, 0);

  const [{ data: visits }, { data: sessions }] = await Promise.all([
    supabase.from("studio_visits").select("member_id, checked_in_at").gte("checked_in_at", start.toISOString()).lte("checked_in_at", end.toISOString()),
    supabase
      .from("workout_sessions")
      .select("member_id, completed_at")
      .not("completed_at", "is", null)
      .gte("completed_at", start.toISOString())
      .lte("completed_at", end.toISOString()),
  ]);

  const byDay = new Map<string, Set<string>>();
  for (const row of visits ?? []) {
    const key = dateKeyBerlin(new Date(row.checked_in_at));
    (byDay.get(key) ?? byDay.set(key, new Set()).get(key)!).add(row.member_id);
  }
  for (const row of sessions ?? []) {
    if (!row.completed_at) continue;
    const key = dateKeyBerlin(new Date(row.completed_at));
    (byDay.get(key) ?? byDay.set(key, new Set()).get(key)!).add(row.member_id);
  }

  const points: DailyActivityPoint[] = [];
  for (let i = 0; i < lookbackDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = dateKeyBerlin(d);
    points.push({ date: key, count: byDay.get(key)?.size ?? 0 });
  }
  return points;
}

export type LiveStudioData = {
  current: number;
  capacity: number | null;
  hasData: boolean;
};

/** Current studio occupancy — open visits (checked in, not checked out, not auto-closed). */
export async function getLiveStudioData(): Promise<LiveStudioData> {
  const supabase = await createClient();

  const [{ count: current }, { data: capacitySetting }, { count: totalVisits }] = await Promise.all([
    supabase.from("studio_visits").select("id", { count: "exact", head: true }).is("checked_out_at", null).eq("auto_closed", false),
    supabase.from("site_settings").select("value").eq("key", "studio_capacity").maybeSingle(),
    supabase.from("studio_visits").select("id", { count: "exact", head: true }),
  ]);

  const capacity = typeof capacitySetting?.value === "number" ? capacitySetting.value : null;
  return { current: current ?? 0, capacity, hasData: (totalVisits ?? 0) > 0 };
}

export type ActivityType =
  | "training_beendet"
  | "check_in"
  | "neu_angemeldet"
  | "plan_aktualisiert"
  | "erfolg_erreicht"
  | "nachricht_gesendet";

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  training_beendet: "Training beendet",
  check_in: "Check-in",
  neu_angemeldet: "Neu angemeldet",
  plan_aktualisiert: "Trainingsplan aktualisiert",
  erfolg_erreicht: "Erfolg erreicht",
  nachricht_gesendet: "Nachricht gesendet",
};

export type ActivityItem = {
  id: string;
  type: ActivityType;
  memberName: string;
  timestamp: string;
  href: string;
};

function unwrapMemberName(member: unknown): string {
  const row = Array.isArray(member) ? member[0] : member;
  return (row as { full_name?: string } | null)?.full_name ?? "Mitglied";
}

/**
 * Merges the real, timestamped member-facing events the app already produces (no dedicated
 * activity-log table exists for these) into one feed: workouts, check-ins, signups, plan
 * updates, achievement unlocks, and member-sent messages. audit_logs is deliberately not
 * one of the sources — it only ever records staff-initiated actions, never these.
 */
export async function getRecentActivities(limit = 5): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const perSourceLimit = limit;

  const [{ data: workouts }, { data: visits }, { data: signups }, { data: planUpdates }, { data: achievements }, { data: messages }] =
    await Promise.all([
      supabase
        .from("workout_sessions")
        .select("id, member_id, completed_at, member:profiles!workout_sessions_member_id_fkey(full_name)")
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(perSourceLimit),
      supabase
        .from("studio_visits")
        .select("id, member_id, checked_in_at, member:profiles!studio_visits_member_id_fkey(full_name)")
        .order("checked_in_at", { ascending: false })
        .limit(perSourceLimit),
      supabase
        .from("profiles")
        .select("id, full_name, created_at")
        .eq("role", "mitglied")
        .order("created_at", { ascending: false })
        .limit(perSourceLimit),
      supabase
        .from("training_plans")
        .select("id, member_id, updated_at, member:profiles!training_plans_member_id_fkey(full_name)")
        .order("updated_at", { ascending: false })
        .limit(perSourceLimit),
      supabase
        .from("member_achievements")
        .select("id, member_id, unlocked_at, member:profiles!member_achievements_member_id_fkey(full_name)")
        .not("unlocked_at", "is", null)
        .order("unlocked_at", { ascending: false })
        .limit(perSourceLimit),
      supabase
        .from("coach_messages")
        .select("id, member_id, created_at, member:profiles!coach_messages_member_id_fkey(full_name)")
        .eq("sender_role", "member")
        .order("created_at", { ascending: false })
        .limit(perSourceLimit),
    ]);

  const items: ActivityItem[] = [];

  for (const w of workouts ?? []) {
    if (!w.completed_at) continue;
    items.push({ id: `workout-${w.id}`, type: "training_beendet", memberName: unwrapMemberName(w.member), timestamp: w.completed_at, href: `/trainer/mitglieder/${w.member_id}` });
  }
  for (const v of visits ?? []) {
    items.push({ id: `visit-${v.id}`, type: "check_in", memberName: unwrapMemberName(v.member), timestamp: v.checked_in_at, href: `/trainer/mitglieder/${v.member_id}` });
  }
  for (const s of signups ?? []) {
    items.push({ id: `signup-${s.id}`, type: "neu_angemeldet", memberName: s.full_name, timestamp: s.created_at, href: `/trainer/mitglieder/${s.id}` });
  }
  for (const p of planUpdates ?? []) {
    items.push({ id: `plan-${p.id}`, type: "plan_aktualisiert", memberName: unwrapMemberName(p.member), timestamp: p.updated_at, href: `/trainer/mitglieder/${p.member_id}` });
  }
  for (const a of achievements ?? []) {
    if (!a.unlocked_at) continue;
    items.push({ id: `achievement-${a.id}`, type: "erfolg_erreicht", memberName: unwrapMemberName(a.member), timestamp: a.unlocked_at, href: `/trainer/mitglieder/${a.member_id}` });
  }
  for (const m of messages ?? []) {
    items.push({ id: `message-${m.id}`, type: "nachricht_gesendet", memberName: unwrapMemberName(m.member), timestamp: m.created_at, href: "/trainer" });
  }

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return items.slice(0, limit);
}
