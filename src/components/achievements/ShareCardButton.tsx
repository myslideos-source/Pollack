"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { renderAchievementShareCard, shareOrDownloadCard, type ShareCardInput } from "./share-card";

export function ShareCardButton({ achievement }: { achievement: ShareCardInput }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleShare() {
    setPending(true);
    setError(null);
    try {
      const blob = await renderAchievementShareCard(achievement);
      await shareOrDownloadCard(blob, `sportpark-erfolg-${achievement.title.toLowerCase().replace(/\s+/g, "-")}.png`);
    } catch {
      setError("Bild konnte nicht erstellt werden. Bitte erneut versuchen.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleShare}
        disabled={pending}
        className="flex w-full items-center justify-center gap-1.5 rounded-full border border-paper/20 px-4 py-2.5 text-sm text-paper hover:border-paper/40 disabled:opacity-60"
      >
        <Share2 size={15} /> {pending ? "Bild wird erstellt …" : "Als Bild teilen"}
      </button>
      {error ? <p className="mt-2 text-center text-xs text-red">{error}</p> : null}
    </div>
  );
}
