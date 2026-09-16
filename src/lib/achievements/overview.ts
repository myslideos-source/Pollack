/**
 * Pure aggregation logic for the "Meine Erfolge" header stats — no DB access, so it's testable on
 * its own. Kept separate from data.ts (which is server-only and does the actual Supabase calls)
 * the same way calendar.ts was split out of engine.ts.
 */

export type Tier = "bronze" | "silber" | "gold" | "platin";

const TIER_RANK: Record<Tier, number> = { bronze: 1, silber: 2, gold: 3, platin: 4 };

export type TieredAchievement = { tier: Tier | null; unlockedAt: string | null };

/** The highest tier among unlocked, tiered achievements (e.g. the Trainingsroutine chain).
 *  Achievements without a tier don't participate — this reflects "current tier" only where a
 *  tier concept actually applies in the catalog. */
export function computeCurrentTier(achievements: TieredAchievement[]): Tier | null {
  let current: Tier | null = null;
  for (const a of achievements) {
    if (a.unlockedAt && a.tier && (!current || TIER_RANK[a.tier] > TIER_RANK[current])) current = a.tier;
  }
  return current;
}

/** The most recently unlocked achievement, or null if none are unlocked yet. */
export function computeLastUnlocked<T extends { unlockedAt: string | null }>(achievements: T[]): T | null {
  const unlocked = achievements.filter((a) => a.unlockedAt);
  if (unlocked.length === 0) return null;
  return [...unlocked].sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())[0];
}

export type ProgressableAchievement = {
  unlockedAt: string | null;
  isSecret: boolean;
  isManual: boolean;
  threshold: number | null;
  progress: number;
};

/** The locked, non-secret, automatically-tracked achievement closest to completion — the
 *  "nächster erreichbarer Erfolg" shown in the header. Manual and secret achievements are
 *  excluded: there's no meaningful countdown to show for either (a manual award has no
 *  measurable progress, and a secret achievement shouldn't hint at its own existence). */
export function computeNextUp<T extends ProgressableAchievement>(achievements: T[]): T | null {
  const candidates = achievements.filter(
    (a) => !a.unlockedAt && !a.isSecret && !a.isManual && a.threshold != null && a.threshold > 0,
  );
  const withRatio = candidates
    .map((a) => ({ a, ratio: a.progress / a.threshold! }))
    .sort((x, y) => y.ratio - x.ratio);
  return withRatio[0]?.a ?? null;
}
