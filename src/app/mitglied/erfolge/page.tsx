import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { loadMemberAchievements } from "@/lib/achievements/data";
import { ErfolgeClient } from "@/components/achievements/ErfolgeClient";
import { TIER_LABELS } from "@/components/achievements/category-labels";

export const metadata: Metadata = { title: "Meine Erfolge" };

export default async function ErfolgePage() {
  const profile = await requireMember();
  const overview = await loadMemberAchievements(profile.id);
  const { achievements, unlockedCount, totalCount, currentTier, lastUnlocked, nextUp } = overview;

  const nextRemaining = nextUp?.threshold != null ? Math.max(0, nextUp.threshold - nextUp.progress) : null;
  const nextPct = nextUp?.threshold ? Math.min(100, Math.round((nextUp.progress / nextUp.threshold) * 100)) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Meine Erfolge</h1>
      <p className="mt-1 text-sm text-paper/60">Sportpark Milestones — für Regelmäßigkeit, Fortschritt und Technik.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-paper/10 bg-anthracite p-5">
          <p className="font-display text-3xl font-bold text-paper">
            {unlockedCount} <span className="text-lg font-normal text-paper/40">von {totalCount}</span>
          </p>
          <p className="text-sm text-paper/60">Erfolge freigeschaltet</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-paper/40">
            Aktuelle Stufe: <span className="text-sand">{currentTier ? TIER_LABELS[currentTier] : "Noch keine Stufe"}</span>
          </p>
          {lastUnlocked ? (
            <p className="mt-1 text-xs text-paper/40">
              Zuletzt erreicht: <span className="text-paper/70">{lastUnlocked.title}</span>
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-paper/10 bg-anthracite p-5">
          {nextUp ? (
            <>
              <p className="text-xs uppercase tracking-wide text-paper/40">Nächster Meilenstein</p>
              <p className="mt-1 font-display text-lg text-paper">{nextUp.title}</p>
              {nextRemaining != null ? (
                <p className="mt-1 text-sm text-paper/60">
                  Noch {nextRemaining} {nextRemaining === 1 ? "Schritt" : "Schritte"} bis zum Ziel
                </p>
              ) : null}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-paper/10">
                <div className="h-full rounded-full bg-red" style={{ width: `${nextPct}%` }} />
              </div>
            </>
          ) : (
            <p className="text-sm text-paper/60">
              {totalCount > 0 && unlockedCount === totalCount
                ? "Alle verfügbaren Erfolge freigeschaltet — starke Leistung!"
                : "Starte dein erstes Training, um deinen ersten Erfolg freizuschalten."}
            </p>
          )}
        </div>
      </div>

      <ErfolgeClient achievements={achievements} />
    </div>
  );
}
