import "server-only";
import { createClient } from "@/lib/supabase/server";
import { resolveMedia } from "@/lib/content/media";

export type AchievementTier = "bronze" | "silber" | "gold" | "platin";

export type AchievementCard = {
  memberAchievementId: string | null;
  slug: string;
  title: string;
  description: string;
  category: string;
  iconKey: string;
  customIconSrc: string | null;
  tier: AchievementTier | null;
  isSecret: boolean;
  isManual: boolean;
  threshold: number | null;
  progress: number;
  unlockedAt: string | null;
  awardedByName: string | null;
  trainerMessage: string | null;
  parentSlug: string | null;
  shareText: string | null;
};

export type AchievementsOverview = {
  achievements: AchievementCard[];
  unlockedCount: number;
  totalCount: number;
  currentTier: AchievementTier | null;
  lastUnlocked: AchievementCard | null;
  nextUp: AchievementCard | null;
};

const TIER_RANK: Record<AchievementTier, number> = { bronze: 1, silber: 2, gold: 3, platin: 4 };

const SECRET_TITLE = "Geheimer Erfolg";
const SECRET_DESCRIPTION = "Diese Auszeichnung bleibt ein Geheimnis, bis du sie erreichst.";

export async function loadMemberAchievements(memberId: string): Promise<AchievementsOverview> {
  const supabase = await createClient();

  const [{ data: catalog }, { data: memberRows }] = await Promise.all([
    supabase
      .from("achievements")
      .select("id, slug, title, description, category, icon_key, custom_icon_media_id, tier, parent_achievement_id, is_secret, is_manual, threshold, share_text, is_active")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("member_achievements")
      .select("id, achievement_id, progress, unlocked_at, awarded_by, trainer_message, revoked_at")
      .eq("member_id", memberId),
  ]);

  const achievementRows = catalog ?? [];
  const memberByAchievementId = new Map((memberRows ?? []).map((r) => [r.achievement_id, r]));
  const idToSlug = new Map(achievementRows.map((a) => [a.id, a.slug]));

  const awardedByIds = Array.from(new Set((memberRows ?? []).map((r) => r.awarded_by).filter((v): v is string => Boolean(v))));
  const { data: awarders } =
    awardedByIds.length > 0 ? await supabase.from("profiles").select("id, full_name").in("id", awardedByIds) : { data: [] as { id: string; full_name: string }[] };
  const nameByAwarderId = new Map((awarders ?? []).map((p) => [p.id, p.full_name]));

  const customIconIds = Array.from(new Set(achievementRows.map((a) => a.custom_icon_media_id).filter((v): v is string => Boolean(v))));
  const customIconById = new Map<string, string>();
  await Promise.all(
    customIconIds.map(async (id) => {
      const resolved = await resolveMedia(id);
      if (resolved) customIconById.set(id, resolved.src);
    }),
  );

  const achievements: AchievementCard[] = achievementRows.map((a) => {
    const memberRow = memberByAchievementId.get(a.id);
    const revoked = Boolean(memberRow?.revoked_at);
    const unlockedAt = !revoked ? (memberRow?.unlocked_at ?? null) : null;
    const isLocked = !unlockedAt;
    const isHiddenSecret = a.is_secret && isLocked;

    return {
      memberAchievementId: memberRow?.id ?? null,
      slug: a.slug,
      title: isHiddenSecret ? SECRET_TITLE : a.title,
      description: isHiddenSecret ? SECRET_DESCRIPTION : a.description,
      category: a.category,
      iconKey: isHiddenSecret ? "secret_mystery" : a.icon_key,
      customIconSrc: isHiddenSecret || !a.custom_icon_media_id ? null : (customIconById.get(a.custom_icon_media_id) ?? null),
      tier: (a.tier as AchievementTier | null) ?? null,
      isSecret: a.is_secret,
      isManual: a.is_manual,
      threshold: a.threshold,
      progress: memberRow?.progress ?? 0,
      unlockedAt,
      awardedByName: memberRow?.awarded_by ? (nameByAwarderId.get(memberRow.awarded_by) ?? null) : null,
      trainerMessage: !isHiddenSecret ? (memberRow?.trainer_message ?? null) : null,
      parentSlug: a.parent_achievement_id ? (idToSlug.get(a.parent_achievement_id) ?? null) : null,
      shareText: isHiddenSecret ? null : a.share_text,
    };
  });

  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);

  let currentTier: AchievementTier | null = null;
  for (const a of unlocked) {
    if (a.tier && (!currentTier || TIER_RANK[a.tier] > TIER_RANK[currentTier])) currentTier = a.tier;
  }

  const lastUnlocked = [...unlocked].sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())[0] ?? null;

  const nextCandidates = locked.filter((a) => !a.isSecret && !a.isManual && a.threshold != null && a.threshold > 0);
  const nextUp = [...nextCandidates].sort((a, b) => b.progress / b.threshold! - a.progress / a.threshold!)[0] ?? null;

  return {
    achievements,
    unlockedCount: unlocked.length,
    totalCount: achievements.length,
    currentTier,
    lastUnlocked,
    nextUp,
  };
}
