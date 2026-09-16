"use client";

import { useMemo, useState } from "react";
import { AchievementCardTile } from "./AchievementCard";
import { AchievementDetail } from "./AchievementDetail";
import { FILTER_CATEGORIES } from "./category-labels";
import type { AchievementCard as AchievementCardData } from "@/lib/achievements/data";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-sm uppercase tracking-wide text-paper/60">{title}</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
    </section>
  );
}

export function ErfolgeClient({ achievements }: { achievements: AchievementCardData[] }) {
  const [filter, setFilter] = useState("alle");
  const [selected, setSelected] = useState<AchievementCardData | null>(null);

  const unlocked = useMemo(() => achievements.filter((a) => a.unlockedAt), [achievements]);
  const lastUnlocked = useMemo(
    () => [...unlocked].sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()).slice(0, 4),
    [unlocked],
  );

  const almostThere = useMemo(() => {
    return achievements
      .filter((a) => !a.unlockedAt && !a.isSecret && !a.isManual && a.threshold != null && a.threshold > 0)
      .map((a) => ({ a, ratio: a.progress / a.threshold! }))
      .filter(({ ratio }) => ratio > 0)
      .sort((x, y) => y.ratio - x.ratio)
      .slice(0, 4)
      .map(({ a }) => a);
  }, [achievements]);

  const trainerAwards = useMemo(() => achievements.filter((a) => a.category === "trainer"), [achievements]);
  const secretAchievements = useMemo(() => achievements.filter((a) => a.isSecret), [achievements]);

  const filtered = useMemo(() => {
    if (filter === "alle") return achievements;
    if (filter === "geheim") return achievements.filter((a) => a.isSecret);
    return achievements.filter((a) => a.category === filter);
  }, [achievements, filter]);

  return (
    <div className="mt-2">
      {lastUnlocked.length > 0 ? (
        <Section title="Zuletzt erreicht">
          {lastUnlocked.map((a) => (
            <AchievementCardTile key={a.slug} achievement={a} onSelect={() => setSelected(a)} />
          ))}
        </Section>
      ) : null}

      {almostThere.length > 0 ? (
        <Section title="Fast geschafft">
          {almostThere.map((a) => (
            <AchievementCardTile key={a.slug} achievement={a} onSelect={() => setSelected(a)} />
          ))}
        </Section>
      ) : null}

      <section className="mt-8">
        <h2 className="font-display text-sm uppercase tracking-wide text-paper/60">Alle Erfolge</h2>
        <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {FILTER_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === c.value ? "border-red bg-red/15 text-red" : "border-paper/15 text-paper/60 hover:text-paper"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((a) => (
            <AchievementCardTile key={a.slug} achievement={a} onSelect={() => setSelected(a)} />
          ))}
        </div>
      </section>

      {trainerAwards.length > 0 ? (
        <Section title="Trainer-Auszeichnungen">
          {trainerAwards.map((a) => (
            <AchievementCardTile key={a.slug} achievement={a} onSelect={() => setSelected(a)} />
          ))}
        </Section>
      ) : null}

      {secretAchievements.length > 0 ? (
        <Section title="Geheime Erfolge">
          {secretAchievements.map((a) => (
            <AchievementCardTile key={a.slug} achievement={a} onSelect={() => setSelected(a)} />
          ))}
        </Section>
      ) : null}

      {selected ? <AchievementDetail achievement={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
