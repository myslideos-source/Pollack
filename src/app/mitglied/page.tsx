import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireMember } from "@/lib/auth";
import {
  loadMemberProfile,
  loadActivePlan,
  loadPendingPlan,
  loadDashboardStats,
  loadLatestCoachMessage,
  todayWeekday,
} from "@/lib/member/data";
import { TrainingHeroCard } from "@/components/member/TrainingHeroCard";
import { WeeklyStatCard } from "@/components/member/WeeklyStatCard";
import { PremiumCard, EmptyState } from "@/components/sportpark/ui";
import { SpCalendar, SpChevronRight, SpMessageCircle, SpDumbbell } from "@/components/icons/sportpark";

export const metadata: Metadata = { title: "Start" };

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function greeting(hour: number): string {
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
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
  const weeklyGoal = member.trainingDaysPerWeek ?? activePlan?.days.length ?? 3;
  const name = firstName(member.fullName);

  return (
    <div className="sp-scope mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sp-text-muted">{greeting(new Date().getHours())}</p>
          <h1 className="sp-headline mt-1 text-[38px] font-extrabold leading-[0.95] text-sp-text sm:text-[42px]">Hallo, {name}</h1>
          <p className="mt-1.5 text-sm text-sp-text-secondary">Bereit für dein Training?</p>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-xs font-semibold uppercase leading-tight tracking-[0.16em] text-sp-text-muted">
            Stärker
            <br />
            als gestern
          </p>
          <span className="mt-2 ml-auto block h-[2px] w-10 bg-sp-red" />
        </div>
      </div>

      <div className="mt-6">
        {activePlan && todayDay ? (
          <TrainingHeroCard
            trainerFirstName={member.assignedTrainerName ? firstName(member.assignedTrainerName) : null}
            dayTitle={todayDay.title}
            durationMin={member.sessionDurationMin}
            exerciseCount={todayDay.exercises.length}
            approved={activePlan.status === "active"}
            imageSrc={todayDay.coverImageSrc}
            imageAlt={todayDay.coverImageAlt}
            focalX={todayDay.coverImageFocalX}
            focalY={todayDay.coverImageFocalY}
            href="/mitglied/training"
          />
        ) : activePlan ? (
          <PremiumCard className="p-6">
            <EmptyState
              icon={SpDumbbell}
              title="Heute: Ruhetag"
              description="Kein Training nach Plan vorgesehen — gönn dir die Erholung."
              action={
                <a href="/mitglied/trainingsplan" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-sp-red">
                  Wochenplan ansehen <SpChevronRight size={15} />
                </a>
              }
            />
          </PremiumCard>
        ) : pendingPlan ? (
          <PremiumCard className="p-6">
            <EmptyState
              icon={SpDumbbell}
              title="Dein Trainingsplan wartet auf Freigabe"
              description="Du bekommst eine Nachricht, sobald er startklar ist."
            />
          </PremiumCard>
        ) : (
          <PremiumCard className="p-6">
            <EmptyState
              icon={SpDumbbell}
              title="Für dich liegt noch kein Trainingsplan vor"
              action={
                <a href="/mitglied/onboarding" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-sp-red">
                  Erstanalyse starten <SpChevronRight size={15} />
                </a>
              }
            />
          </PremiumCard>
        )}
      </div>

      <div className="mt-4">
        <WeeklyStatCard
          sessionsThisWeek={stats.sessionsThisWeek}
          weeklyGoal={weeklyGoal}
          volumeKg={stats.volumeThisWeekKg}
          streakDays={stats.streakDays}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <a
          href="/mitglied/profil"
          className="group flex items-center justify-between gap-3 rounded-sp-lg border border-sp-border bg-sp-surface-1 p-4 shadow-sp-card transition-colors hover:border-sp-border-strong"
        >
          <span className="flex items-center gap-3">
            <SpCalendar size={20} strokeWidth={1.8} className="shrink-0 text-sp-text-secondary" />
            <span>
              <span className="block text-sm text-sp-text">Nächste Körperanalyse</span>
              <span className="block text-xs text-sp-text-muted">
                {member.nextAnalysisDate
                  ? new Date(member.nextAnalysisDate).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
                  : "Noch nicht geplant"}
              </span>
            </span>
          </span>
          <SpChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-sp-text-muted" />
        </a>

        <a
          href="/mitglied/nachrichten"
          className="group flex items-center justify-between gap-3 rounded-sp-lg border border-sp-border bg-sp-surface-1 p-4 shadow-sp-card transition-colors hover:border-sp-border-strong"
        >
          <span className="flex min-w-0 items-center gap-3">
            <SpMessageCircle size={20} strokeWidth={1.8} className="shrink-0 text-sp-text-secondary" />
            <span className="min-w-0">
              <span className="block text-sm text-sp-text">
                {latestMessage ? `Nachricht von ${firstName(latestMessage.senderName)}` : "Nachricht vom Trainer"}
              </span>
              <span className="line-clamp-2 break-words text-xs text-sp-text-muted">
                {latestMessage ? latestMessage.body : "Noch keine Nachrichten"}
              </span>
            </span>
          </span>
          <SpChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-sp-text-muted" />
        </a>
      </div>
    </div>
  );
}
