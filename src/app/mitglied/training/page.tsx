import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireMember } from "@/lib/auth";
import { loadActivePlan, loadLastSetsForPlanExercises, todayWeekday, weekdayLabel } from "@/lib/member/data";
import { ActiveWorkout } from "@/components/member/ActiveWorkout";

export const metadata: Metadata = { title: "Training" };

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const profile = await requireMember();
  const plan = await loadActivePlan(profile.id);
  const { tag } = await searchParams;

  if (!plan || plan.days.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-paper">Kein aktiver Trainingsplan</h1>
        <p className="mt-2 text-paper/60">
          Sobald dein Trainer deinen Plan freigegeben hat, kannst du hier direkt loslegen.
        </p>
        <Link href="/mitglied" className="mt-5 inline-flex items-center gap-1.5 text-sm text-red hover:text-red-dark">
          Zurück zum Start <ChevronRight size={15} />
        </Link>
      </div>
    );
  }

  const selectedDay = plan.days.find((d) => d.id === tag) ?? plan.days.find((d) => d.weekday === todayWeekday()) ?? null;

  if (!selectedDay) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-paper">Heute ist kein Trainingstag geplant</h1>
        <p className="mt-2 text-paper/60">Wähle stattdessen einen Tag aus deinem Wochenplan:</p>
        <div className="mt-5 flex flex-col gap-2">
          {plan.days.map((d) => (
            <Link
              key={d.id}
              href={`/mitglied/training?tag=${d.id}`}
              className="flex items-center justify-between rounded-xl border border-paper/15 bg-anthracite px-4 py-3 text-paper hover:border-paper/30"
            >
              <span>
                {weekdayLabel(d.weekday)} — {d.title}
              </span>
              <ChevronRight size={16} className="text-paper/40" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const lastSets = await loadLastSetsForPlanExercises(
    profile.id,
    selectedDay.exercises.map((e) => e.id),
  );

  return (
    <ActiveWorkout
      planId={plan.id}
      day={selectedDay}
      lastSets={Object.fromEntries(lastSets)}
      otherDays={plan.days.filter((d) => d.id !== selectedDay.id).map((d) => ({ id: d.id, label: `${weekdayLabel(d.weekday)} — ${d.title}` }))}
    />
  );
}
