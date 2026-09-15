"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, HeartPulse, Flame, PersonStanding, ShieldCheck, ArrowRight } from "lucide-react";
import { goals, type GoalId } from "@/content/goals";
import { getProgram } from "@/content/programs";
import { PulseLine } from "@/components/shared/PulseLine";

const ICONS: Record<GoalId, React.ComponentType<{ size?: number; className?: string }>> = {
  staerker: Dumbbell,
  ruecken: HeartPulse,
  abnehmen: Flame,
  beweglich: PersonStanding,
  sicher: ShieldCheck,
};

const ACCENT_CLASS: Record<string, string> = {
  performance: "border-red/50 bg-red/10 text-red",
  health: "border-moss/50 bg-moss/10 text-moss",
  kampfkunst: "border-red/50 bg-red/10 text-red",
};

export function GoalSelector() {
  const [selected, setSelected] = useState<GoalId>(goals[0].id);
  const activeGoal = goals.find((g) => g.id === selected)!;
  const recommended = activeGoal.programSlugs.map((s) => getProgram(s)).filter(Boolean);

  return (
    <section className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            Was möchtest du verändern?
          </h2>
          <p className="max-w-sm text-sm text-paper/60">Fünf Ziele. Ein stärkeres Du.</p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {goals.map((goal) => {
            const Icon = ICONS[goal.id];
            const active = goal.id === selected;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelected(goal.id)}
                aria-pressed={active}
                className={`group flex flex-col items-start gap-3 rounded-2xl border px-5 py-6 text-left transition-all ${
                  active
                    ? ACCENT_CLASS[goal.accent]
                    : "border-paper/10 bg-anthracite text-paper hover:border-paper/25"
                }`}
              >
                <Icon size={28} />
                <span className="font-display text-lg uppercase tracking-wide">{goal.title}</span>
                <ArrowRight
                  size={16}
                  className={`transition-transform ${active ? "translate-x-1" : "group-hover:translate-x-1"}`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
          <PulseLine zone={activeGoal.accent === "health" ? "health" : "performance"} className="mb-4 -mt-2 opacity-70" />
          <p className="max-w-2xl text-lg text-paper/80">{activeGoal.blurb}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {recommended.map((program) => (
              <Link
                key={program!.slug}
                href={`/${program!.category}/${program!.slug}`}
                className="rounded-full border border-paper/15 px-4 py-2 text-sm font-medium text-paper hover:border-red hover:text-red"
              >
                {program!.title}
              </Link>
            ))}
          </div>
          <Link
            href="/kontakt#probetraining"
            className="mt-6 inline-flex items-center gap-2 font-display text-sm uppercase tracking-wide text-red hover:text-red-dark"
          >
            Probetraining für dieses Ziel vereinbaren <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
