"use client";

import { AchievementIcon } from "./AchievementIcon";
import { CATEGORY_LABELS } from "./category-labels";
import type { AchievementCard as AchievementCardData } from "@/lib/achievements/data";

export function AchievementCardTile({ achievement, onSelect }: { achievement: AchievementCardData; onSelect: () => void }) {
  const locked = !achievement.unlockedAt;
  const hasProgress = achievement.threshold != null && achievement.threshold > 1;
  const pct = hasProgress ? Math.min(100, Math.round((achievement.progress / achievement.threshold!) * 100)) : locked ? 0 : 100;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center transition-colors ${
        locked ? "border-paper/10 bg-anthracite/50 hover:border-paper/20" : "border-paper/15 bg-anthracite hover:border-red/40"
      }`}
    >
      <AchievementIcon iconKey={achievement.iconKey} customIconSrc={achievement.customIconSrc} tier={achievement.tier} locked={locked} size="md" />
      <div className="min-w-0 w-full">
        <p className={`font-display text-xs uppercase tracking-wide ${locked ? "text-paper/40" : "text-paper"}`}>{achievement.title}</p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-paper/45">{achievement.description}</p>
      </div>
      {hasProgress ? (
        <div className="w-full">
          <div className="h-1 w-full overflow-hidden rounded-full bg-paper/10">
            <div className={`h-full rounded-full ${locked ? "bg-paper/25" : "bg-red"}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-[10px] text-paper/35">
            {Math.min(achievement.progress, achievement.threshold!)} / {achievement.threshold}
          </p>
        </div>
      ) : (
        <span className="text-[10px] uppercase tracking-wide text-paper/30">{CATEGORY_LABELS[achievement.category] ?? achievement.category}</span>
      )}
      {achievement.unlockedAt ? (
        <p className="text-[10px] text-moss">
          {new Date(achievement.unlockedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </p>
      ) : null}
    </button>
  );
}
