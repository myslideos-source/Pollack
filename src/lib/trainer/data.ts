import "server-only";
import { createClient } from "@/lib/supabase/server";

export type TrainerMemberRow = {
  id: string;
  fullName: string;
  goal: string | null;
  activePlanStatus: string | null;
  lastTrainingAt: string | null;
  trainerId: string | null;
  trainerName: string | null;
};

/**
 * Lists members visible to the caller: an admin sees every member, a trainer only theirs
 * (mirrors the RLS policies — this query would return the same restricted set even for a
 * trainer's own client, this just also works for admins who need the full roster).
 */
export async function loadMembers(opts: { onlyTrainerId?: string } = {}): Promise<TrainerMemberRow[]> {
  const supabase = await createClient();
  let query = supabase.from("member_profiles").select("id, goal, assigned_trainer_id");
  if (opts.onlyTrainerId) query = query.eq("assigned_trainer_id", opts.onlyTrainerId);
  const { data: members } = await query;
  if (!members || members.length === 0) return [];

  const memberIds = members.map((m) => m.id);
  const trainerIds = Array.from(new Set(members.map((m) => m.assigned_trainer_id).filter((v): v is string => Boolean(v))));

  const [{ data: profiles }, { data: trainers }, { data: plans }, { data: lastSessions }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", memberIds),
    trainerIds.length > 0 ? supabase.from("profiles").select("id, full_name").in("id", trainerIds) : Promise.resolve({ data: [] }),
    supabase.from("training_plans").select("member_id, status").in("member_id", memberIds).eq("status", "active"),
    supabase.from("workout_sessions").select("member_id, started_at").in("member_id", memberIds).order("started_at", { ascending: false }),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
  const trainerNameById = new Map((trainers ?? []).map((t) => [t.id, t.full_name]));
  const planStatusByMember = new Map((plans ?? []).map((p) => [p.member_id, p.status]));
  const lastSessionByMember = new Map<string, string>();
  for (const s of lastSessions ?? []) {
    if (!lastSessionByMember.has(s.member_id)) lastSessionByMember.set(s.member_id, s.started_at);
  }

  return members.map((m) => ({
    id: m.id,
    fullName: nameById.get(m.id) ?? "Unbekannt",
    goal: m.goal,
    activePlanStatus: planStatusByMember.get(m.id) ?? null,
    lastTrainingAt: lastSessionByMember.get(m.id) ?? null,
    trainerId: m.assigned_trainer_id,
    trainerName: m.assigned_trainer_id ? (trainerNameById.get(m.assigned_trainer_id) ?? null) : null,
  }));
}

export type TrainerDashboardStats = {
  newMembers: TrainerMemberRow[];
  pendingPlans: { id: string; memberId: string; memberName: string; createdAt: string }[];
  openChangeRequests: { id: string; memberId: string; memberName: string; message: string; createdAt: string }[];
  inactiveMembers: TrainerMemberRow[];
  unreadMessages: { memberId: string; memberName: string; body: string; createdAt: string }[];
  upcomingAnalyses: { memberId: string; memberName: string; date: string }[];
};

export async function loadTrainerDashboard(opts: { onlyTrainerId?: string }): Promise<TrainerDashboardStats> {
  const supabase = await createClient();
  const members = await loadMembers(opts);
  const memberIds = members.map((m) => m.id);
  if (memberIds.length === 0) {
    return { newMembers: [], pendingPlans: [], openChangeRequests: [], inactiveMembers: [], unreadMessages: [], upcomingAnalyses: [] };
  }

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const inTwoWeeks = new Date();
  inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

  const nameById = new Map(members.map((m) => [m.id, m.fullName]));

  const [{ data: pendingPlansRaw }, { data: changeRequestsRaw }, { data: unreadRaw }, { data: analysesRaw }] = await Promise.all([
    supabase.from("training_plans").select("id, member_id, created_at").in("member_id", memberIds).eq("status", "pending_review"),
    supabase
      .from("plan_change_requests")
      .select("id, member_id, message, created_at")
      .in("member_id", memberIds)
      .eq("status", "open"),
    supabase
      .from("coach_messages")
      .select("member_id, body, created_at")
      .in("member_id", memberIds)
      .eq("sender_role", "member")
      .is("read_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("member_profiles")
      .select("id, next_analysis_date")
      .in("id", memberIds)
      .not("next_analysis_date", "is", null)
      .lte("next_analysis_date", inTwoWeeks.toISOString().slice(0, 10))
      .order("next_analysis_date"),
  ]);

  const inactiveMembers = members.filter((m) => !m.lastTrainingAt || new Date(m.lastTrainingAt) < fourteenDaysAgo);
  const newMembers = members.filter((m) => !m.activePlanStatus).slice(0, 8);

  return {
    newMembers,
    pendingPlans: (pendingPlansRaw ?? []).map((p) => ({
      id: p.id,
      memberId: p.member_id,
      memberName: nameById.get(p.member_id) ?? "Unbekannt",
      createdAt: p.created_at,
    })),
    openChangeRequests: (changeRequestsRaw ?? []).map((c) => ({
      id: c.id,
      memberId: c.member_id,
      memberName: nameById.get(c.member_id) ?? "Unbekannt",
      message: c.message,
      createdAt: c.created_at,
    })),
    inactiveMembers,
    unreadMessages: (unreadRaw ?? []).map((m) => ({
      memberId: m.member_id,
      memberName: nameById.get(m.member_id) ?? "Unbekannt",
      body: m.body,
      createdAt: m.created_at,
    })),
    upcomingAnalyses: (analysesRaw ?? [])
      .filter((a) => a.next_analysis_date)
      .map((a) => ({ memberId: a.id, memberName: nameById.get(a.id) ?? "Unbekannt", date: a.next_analysis_date as string })),
  };
}
