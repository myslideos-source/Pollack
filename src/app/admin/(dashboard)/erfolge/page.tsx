import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AchievementsManager } from "./AchievementsManager";

export const metadata: Metadata = { title: "Erfolge" };

export default async function AdminErfolgePage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: achievements } = await supabase
    .from("achievements")
    .select(
      "id, slug, title, description, category, icon_key, custom_icon_media_id, metric_type, threshold, tier, parent_achievement_id, is_manual, is_secret, is_active, sort_order, share_text, valid_from, valid_until",
    )
    .order("sort_order");

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-semibold text-paper">Erfolge</h1>
      <p className="text-sm text-paper/60">
        Der Sportpark-Milestones-Katalog. Erfolge werden nie gelöscht, nur deaktiviert — Mitglieder, die einen
        Erfolg bereits erreicht haben, behalten ihn in ihrer Historie.
      </p>
      <div className="mt-6">
        <AchievementsManager achievements={achievements ?? []} />
      </div>
    </div>
  );
}
