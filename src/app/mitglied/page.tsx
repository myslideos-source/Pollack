import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Flame, Dumbbell, Target, Calendar, MessageCircle, ChevronRight } from "lucide-react";
import { requireMember } from "@/lib/auth";
import {
  loadMemberProfile,
  loadActivePlan,
  loadPendingPlan,
  loadDashboardStats,
  loadLatestCoachMessage,
  todayWeekday,
} from "@/lib/member/data";

export const metadata: Metadata = { title: "Start" };

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Hallo";
  return "Guten Abend";
}

export default async function MemberDashboardPage() {
  const profile = await requireMember();
  const member = await loadMemberProfile(profile.id);

  if (!member) redirect("/mitglied/onboarding");
  if (!member.onboardingCompletedAt) redirect("/mitglied/onboarding");

  const [activePlan, pendingPlan] = await Promise.all([loadActivePlan(profile.id), loadPendingPlan(profile.id)]);
  const [stats, latestMessage] = await Promise.all([
    loadDashboardStats(profile.id, activePlan),
    loadLatestCoachMessage(profile.id),
  ]);

  const todayDay = activePlan?.days.find((d) => d.weekday === todayWeekday()) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">
        {greeting()}, {firstName(member.fullName)}
      </h1>
      <p className="mt-1 text-paper/60">Bereit für dein Training?</p>

      {!activePlan ? (
        pendingPlan ? (
          <div className="mt-6 rounded-2xl border border-sand/30 bg-sand/10 p-5">
            <p className="text-sm text-sand">
              Dein Trainingsplan wartet aktuell auf die Freigabe durch dein Trainerteam. Du bekommst eine
              Nachricht, sobald er startklar ist.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-paper/10 bg-anthracite p-5">
            <p className="text-sm text-paper/70">Für dich liegt noch kein Trainingsplan vor.</p>
            <Link
              href="/mitglied/onboarding"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red hover:text-red-dark"
            >
              Erstanalyse starten <ChevronRight size={15} />
            </Link>
          </div>
        )
      ) : (
        <div className="mt-6 rounded-2xl border border-paper/10 bg-anthracite p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-moss/30 bg-moss/10 px-3 py-1 text-xs font-medium text-moss">
            <CheckCircle2 size={13} />
            Von {member.assignedTrainerName ? firstName(member.assignedTrainerName) : "deinem Trainer"} freigegeben
          </span>

          {todayDay ? (
            <>
              <h2 className="mt-4 font-display text-2xl font-bold text-paper">Heute: {todayDay.title}</h2>
              <p className="mt-1 text-sm text-paper/60">
                {member.sessionDurationMin ? `${member.sessionDurationMin} Min. · ` : ""}
                {todayDay.exercises.length} Übungen
              </p>
              <Link
                href="/mitglied/training"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:bg-red-dark"
              >
                Training starten <ChevronRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-4 font-display text-2xl font-bold text-paper">Heute: Ruhetag</h2>
              <p className="mt-1 text-sm text-paper/60">Kein Training nach Plan vorgesehen — gönn dir die Erholung.</p>
              <Link
                href="/mitglied/trainingsplan"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-paper/20 px-5 py-2.5 text-sm text-paper hover:border-paper/40"
              >
                Wochenplan ansehen <ChevronRight size={15} />
              </Link>
            </>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
          <Dumbbell size={18} className="mx-auto text-red" />
          <p className="mt-2 font-display text-xl font-bold text-paper">{stats.sessionsThisWeek}</p>
          <p className="text-[11px] text-paper/50">Trainings diese Woche</p>
        </div>
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
          <Target size={18} className="mx-auto text-red" />
          <p className="mt-2 font-display text-xl font-bold text-paper">{stats.volumeThisWeekKg.toLocaleString("de-DE")} kg</p>
          <p className="text-[11px] text-paper/50">Bewegtes Gewicht</p>
        </div>
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
          <Flame size={18} className="mx-auto text-red" />
          <p className="mt-2 font-display text-xl font-bold text-paper">{stats.streakDays}</p>
          <p className="text-[11px] text-paper/50">Tage Serie</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/mitglied/profil"
          className="flex items-center justify-between rounded-2xl border border-paper/10 bg-anthracite p-4 hover:border-paper/25"
        >
          <span className="flex items-center gap-3">
            <Calendar size={18} className="text-paper/50" />
            <span>
              <span className="block text-sm text-paper">Nächste Körperanalyse</span>
              <span className="block text-xs text-paper/50">
                {member.nextAnalysisDate
                  ? new Date(member.nextAnalysisDate).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
                  : "Noch nicht geplant"}
              </span>
            </span>
          </span>
          <ChevronRight size={16} className="text-paper/30" />
        </Link>

        <Link
          href="/mitglied/nachrichten"
          className="flex items-center justify-between gap-3 rounded-2xl border border-paper/10 bg-anthracite p-4 hover:border-paper/25"
        >
          <span className="flex min-w-0 items-center gap-3">
            <MessageCircle size={18} className="shrink-0 text-paper/50" />
            <span className="min-w-0">
              <span className="block text-sm text-paper">Letzte Nachricht vom Trainer</span>
              <span className="line-clamp-2 break-words text-xs text-paper/50">
                {latestMessage ? latestMessage.body : "Noch keine Nachrichten"}
              </span>
            </span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-paper/30" />
        </Link>
      </div>

      {stats.planCompletionPct !== null ? (
        <Link
          href="/mitglied/fortschritt"
          className="mt-4 flex items-center justify-between rounded-2xl border border-paper/10 bg-anthracite p-4 hover:border-paper/25"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm text-paper">Wochenfortschritt</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper/10">
              <div className="h-full rounded-full bg-red" style={{ width: `${stats.planCompletionPct}%` }} />
            </div>
          </div>
          <span className="ml-4 shrink-0 font-display text-sm text-paper">{stats.planCompletionPct}%</span>
        </Link>
      ) : null}
    </div>
  );
}
