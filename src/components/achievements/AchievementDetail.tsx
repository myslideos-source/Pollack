"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AchievementIcon } from "./AchievementIcon";
import { CATEGORY_LABELS, TIER_LABELS } from "./category-labels";
import { ShareCardButton } from "./ShareCardButton";
import type { AchievementCard as AchievementCardData } from "@/lib/achievements/data";

export function AchievementDetail({ achievement, onClose }: { achievement: AchievementCardData; onClose: () => void }) {
  const locked = !achievement.unlockedAt;
  const hasProgress = achievement.threshold != null && achievement.threshold > 1;
  const pct = hasProgress ? Math.min(100, Math.round((achievement.progress / achievement.threshold!) * 100)) : locked ? 0 : 100;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={achievement.title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl border border-paper/10 bg-anthracite p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:rounded-3xl sm:pb-6"
      >
        <div className="flex items-start justify-between">
          <span className="text-xs uppercase tracking-wide text-paper/40">{CATEGORY_LABELS[achievement.category] ?? achievement.category}</span>
          <button type="button" onClick={onClose} aria-label="Schließen" className="text-paper/50 hover:text-paper">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center text-center">
          <AchievementIcon iconKey={achievement.iconKey} customIconSrc={achievement.customIconSrc} tier={achievement.tier} locked={locked} size="lg" />
          <h2 className="mt-4 font-display text-xl font-bold text-paper">{achievement.title}</h2>
          {achievement.tier ? (
            <span className="mt-1 text-xs uppercase tracking-wide text-sand">{TIER_LABELS[achievement.tier]}</span>
          ) : null}
          {/* description doubles as the "how it's earned" hint — it's already worded as the condition */}
          <p className="mt-3 text-sm text-paper/70">{achievement.description}</p>
        </div>

        {hasProgress ? (
          <div className="mt-5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper/10">
              <div className={`h-full rounded-full ${locked ? "bg-paper/30" : "bg-red"}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 text-center text-xs text-paper/50">
              {Math.min(achievement.progress, achievement.threshold!)} von {achievement.threshold}
            </p>
          </div>
        ) : null}

        {achievement.unlockedAt ? (
          <p className="mt-4 text-center text-xs text-moss">
            Freigeschaltet am{" "}
            {new Date(achievement.unlockedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </p>
        ) : (
          <p className="mt-4 text-center text-xs text-paper/40">Noch nicht freigeschaltet</p>
        )}

        {achievement.trainerMessage ? (
          <div className="mt-4 rounded-xl border border-red/20 bg-red/5 p-3 text-sm text-paper/80">
            <span className="font-medium text-red">Nachricht vom Trainer: </span>
            {achievement.trainerMessage}
          </div>
        ) : null}

        {achievement.unlockedAt && !achievement.isSecret ? (
          <ShareCardButton
            achievement={{
              title: achievement.title,
              description: achievement.description,
              iconKey: achievement.iconKey,
              customIconSrc: achievement.customIconSrc,
              tier: achievement.tier,
              unlockedAt: achievement.unlockedAt,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
