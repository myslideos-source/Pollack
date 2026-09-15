import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ChevronRight, Trophy } from "lucide-react";
import { requireMember } from "@/lib/auth";
import { loadActivePlan, loadProgressData, loadLatestCoachMessage } from "@/lib/member/data";
import { SparkLineChart } from "@/components/member/SparkLineChart";
import { FilterTabs } from "./FilterTabs";

export const metadata: Metadata = { title: "Fortschritt" };

const WINDOWS: Record<string, number> = { "4w": 28, "3m": 90, "6m": 182, "1y": 365 };

export default async function FortschrittPage({
  searchParams,
}: {
  searchParams: Promise<{ zeitraum?: string }>;
}) {
  const profile = await requireMember();
  const { zeitraum } = await searchParams;
  const windowKey = zeitraum && zeitraum in WINDOWS ? zeitraum : "4w";
  const windowDays = WINDOWS[windowKey];

  const plan = await loadActivePlan(profile.id);
  const [progress, latestMessage] = await Promise.all([
    loadProgressData(profile.id, windowDays, plan),
    loadLatestCoachMessage(profile.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Dein Fortschritt</h1>
        <FilterTabs active={windowKey} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
          <p className="font-display text-xl font-bold text-paper">{progress.sessionCount}</p>
          <p className="text-[11px] text-paper/50">Trainingseinheiten</p>
        </div>
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
          <p className="font-display text-xl font-bold text-paper">
            {progress.strengthDeltaKg != null ? `${progress.strengthDeltaKg > 0 ? "+" : ""}${progress.strengthDeltaKg} kg` : "–"}
          </p>
          <p className="text-[11px] text-paper/50">
            {progress.strengthExerciseName ? `Kraft · ${progress.strengthExerciseName}` : "Kraftentwicklung"}
          </p>
        </div>
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
          <p className="font-display text-xl font-bold text-paper">
            {progress.planCompletionPct != null ? `${progress.planCompletionPct}%` : "–"}
          </p>
          <p className="text-[11px] text-paper/50">Plan erfüllt</p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-paper/10 bg-anthracite p-5">
        <h2 className="font-display text-sm uppercase tracking-wide text-paper/60">Bewegtes Gewicht pro Einheit</h2>
        <div className="mt-4 text-paper">
          <SparkLineChart points={progress.volumeSeries} formatValue={(v) => `${v.toLocaleString("de-DE")} kg`} />
        </div>
      </section>

      {progress.strengthSeries.length > 1 ? (
        <section className="mt-4 rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="font-display text-sm uppercase tracking-wide text-paper/60">
            Kraftentwicklung {progress.strengthExerciseName ? `— ${progress.strengthExerciseName}` : ""}
          </h2>
          <div className="mt-4 text-paper">
            <SparkLineChart points={progress.strengthSeries} formatValue={(v) => `${v} kg`} />
          </div>
        </section>
      ) : null}

      {progress.bodyWeightSeries.length > 1 ? (
        <section className="mt-4 rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="font-display text-sm uppercase tracking-wide text-paper/60">Körpergewicht</h2>
          <div className="mt-4 text-paper">
            <SparkLineChart points={progress.bodyWeightSeries} formatValue={(v) => `${v} kg`} />
          </div>
        </section>
      ) : null}

      {progress.personalBests.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper/60">
            <Trophy size={15} className="text-sand" /> Persönliche Bestleistungen
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {progress.personalBests.map((pb) => (
              <li key={pb.exerciseName} className="flex items-center justify-between text-sm">
                <span className="text-paper/80">{pb.exerciseName}</span>
                <span className="font-medium text-paper">{pb.weightKg} kg</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link
        href="/mitglied/nachrichten"
        className="mt-6 flex items-center justify-between rounded-2xl border border-paper/10 bg-anthracite p-5 hover:border-paper/25"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red/15 font-display text-sm text-red">
            {latestMessage ? latestMessage.senderName.slice(0, 1).toUpperCase() : "T"}
          </span>
          <div>
            <p className="text-sm font-medium text-paper">{latestMessage?.senderName ?? "Dein Trainer"}</p>
            <p className="mt-0.5 max-w-xs text-sm text-paper/60">
              {latestMessage ? latestMessage.body : "Noch kein Feedback vorhanden."}
            </p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-xs text-red">
          <MessageCircle size={13} /> Nachricht öffnen <ChevronRight size={13} />
        </span>
      </Link>
    </div>
  );
}
