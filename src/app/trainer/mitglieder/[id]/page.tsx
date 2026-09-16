import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireTrainerOrAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { loadMemberProfile, loadActivePlan, loadPendingPlan } from "@/lib/member/data";
import { loadMemberAchievements } from "@/lib/achievements/data";
import { PlanEditor } from "@/components/trainer/PlanEditor";
import { MessageThread } from "@/components/member/MessageThread";
import { AwardAchievement } from "@/components/trainer/AwardAchievement";
import { ChangeRequestList } from "./ChangeRequestList";
import { TrainerAssignmentForm } from "./TrainerAssignmentForm";
import { sendTrainerMessageAction } from "@/app/mitglied/actions";

export const metadata: Metadata = { title: "Mitglied" };

const EXPERIENCE_LABEL: Record<string, string> = { einsteiger: "Einsteiger", fortgeschritten: "Fortgeschritten", erfahren: "Erfahren" };

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireTrainerOrAdmin();
  const { id } = await params;

  const member = await loadMemberProfile(id);
  if (!member) notFound();

  const supabase = await createClient();
  const [activePlan, pendingPlan, { data: exerciseCatalog }, { data: measurements }, { data: changeRequests }, { data: messagesRaw }, { data: trainers }, achievementsOverview, { data: manualAchievementRows }] =
    await Promise.all([
      loadActivePlan(id),
      loadPendingPlan(id),
      supabase.from("exercises").select("id, name").order("name"),
      supabase.from("body_measurements").select("id, measured_at, weight_kg, body_fat_pct, notes").eq("member_id", id).order("measured_at", { ascending: false }).limit(10),
      supabase.from("plan_change_requests").select("id, message, status, created_at").eq("member_id", id).order("created_at", { ascending: false }),
      supabase.from("coach_messages").select("id, sender_id, sender_role, body, created_at").eq("member_id", id).order("created_at", { ascending: true }),
      profile.role === "admin" ? supabase.from("profiles").select("id, full_name").eq("role", "trainer") : Promise.resolve({ data: [] }),
      loadMemberAchievements(id),
      supabase.from("achievements").select("slug, title, category, icon_key").eq("is_manual", true).eq("is_active", true).order("sort_order"),
    ]);

  const manualAchievements = (manualAchievementRows ?? []).map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    iconKey: a.icon_key,
  }));

  const messages = (messagesRaw ?? []).map((m) => ({
    id: m.id,
    senderRole: m.sender_role,
    senderName: m.sender_role === "trainer" ? "Du" : member.fullName,
    body: m.body,
    createdAt: m.created_at,
    mine: m.sender_role === "trainer",
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/trainer/mitglieder" className="flex items-center gap-1.5 text-sm text-paper/60 hover:text-paper">
        <ArrowLeft size={15} /> Zurück zur Liste
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">{member.fullName}</h1>
          <p className="mt-1 text-sm text-paper/60">{member.goal ?? "Kein Ziel angegeben"}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-paper/10 bg-anthracite p-4">
          <p className="text-xs uppercase tracking-wide text-paper/40">Erfahrung</p>
          <p className="mt-1 text-sm text-paper">{member.experienceLevel ? EXPERIENCE_LABEL[member.experienceLevel] : "–"}</p>
        </div>
        <div className="rounded-xl border border-paper/10 bg-anthracite p-4">
          <p className="text-xs uppercase tracking-wide text-paper/40">Größe / Gewicht</p>
          <p className="mt-1 text-sm text-paper">
            {member.heightCm ? `${member.heightCm} cm` : "–"} · {member.weightKg ? `${member.weightKg} kg` : "–"}
          </p>
        </div>
        <div className="rounded-xl border border-paper/10 bg-anthracite p-4">
          <p className="text-xs uppercase tracking-wide text-paper/40">Nächste Körperanalyse</p>
          <p className="mt-1 text-sm text-paper">
            {member.nextAnalysisDate ? new Date(member.nextAnalysisDate).toLocaleDateString("de-DE") : "–"}
          </p>
        </div>
        {profile.role === "admin" ? (
          <TrainerAssignmentForm memberId={id} currentTrainerId={member.assignedTrainerId} trainers={trainers ?? []} />
        ) : null}
      </div>

      {member.healthNotes ? (
        <div className="mt-4 rounded-xl border border-red/20 bg-red/5 p-4 text-sm text-paper/80">
          <span className="font-medium text-red">Beschwerden/Verletzungen: </span>
          {member.healthNotes}
        </div>
      ) : null}

      <ChangeRequestList memberId={id} requests={changeRequests ?? []} />

      <section className="mt-8">
        <h2 className="font-display text-lg text-paper">Trainingsplan</h2>
        {pendingPlan ? (
          <div className="mt-3">
            <PlanEditor memberId={id} plan={pendingPlan} exerciseCatalog={exerciseCatalog ?? []} />
          </div>
        ) : activePlan ? (
          <div className="mt-3">
            <PlanEditor memberId={id} plan={activePlan} exerciseCatalog={exerciseCatalog ?? []} />
          </div>
        ) : (
          <p className="mt-3 text-sm text-paper/50">Für dieses Mitglied liegt noch kein Trainingsplan vor.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg text-paper">Körperwerte</h2>
        <ul className="mt-3 flex flex-col gap-1.5">
          {(measurements ?? []).length === 0 ? (
            <li className="text-sm text-paper/40">Noch keine Werte erfasst.</li>
          ) : (
            (measurements ?? []).map((m) => (
              <li key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-paper/50">{new Date(m.measured_at).toLocaleDateString("de-DE")}</span>
                <span className="text-paper">
                  {m.weight_kg ? `${m.weight_kg} kg` : ""}
                  {m.body_fat_pct ? ` · ${m.body_fat_pct}% KF` : ""}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg text-paper">
          Erfolge <span className="text-sm font-normal text-paper/40">({achievementsOverview.unlockedCount} von {achievementsOverview.totalCount})</span>
        </h2>
        <AwardAchievement memberId={id} manualAchievements={manualAchievements} memberAchievements={achievementsOverview.achievements} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg text-paper">Nachrichten</h2>
        <MessageThread messages={messages} sendAction={sendTrainerMessageAction.bind(null, id)} />
      </section>
    </div>
  );
}
