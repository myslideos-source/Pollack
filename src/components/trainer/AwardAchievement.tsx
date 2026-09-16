"use client";

import { useState, useTransition } from "react";
import { Award, Undo2 } from "lucide-react";
import { AchievementIcon, type AchievementTier } from "@/components/achievements/AchievementIcon";
import { CATEGORY_LABELS } from "@/components/achievements/category-labels";
import { awardAchievementAction, revokeAchievementAction } from "@/app/admin/actions/achievements";
import type { AchievementCard } from "@/lib/achievements/data";

type ManualAchievement = { slug: string; title: string; category: string; iconKey: string };

export function AwardAchievement({
  memberId,
  manualAchievements,
  memberAchievements,
}: {
  memberId: string;
  manualAchievements: ManualAchievement[];
  memberAchievements: AchievementCard[];
}) {
  const [selectedSlug, setSelectedSlug] = useState(manualAchievements[0]?.slug ?? "");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");

  const unlocked = memberAchievements.filter((a) => a.unlockedAt && a.memberAchievementId);

  function submitAward() {
    setError(null);
    setSuccess(false);
    const fd = new FormData();
    fd.set("memberId", memberId);
    fd.set("achievementSlug", selectedSlug);
    if (message.trim()) fd.set("trainerMessage", message.trim());
    if (note.trim()) fd.set("internalNote", note.trim());
    startTransition(async () => {
      const res = await awardAchievementAction(fd);
      if (res.error) setError(res.error);
      else {
        setSuccess(true);
        setMessage("");
        setNote("");
      }
    });
  }

  function submitRevoke(memberAchievementId: string) {
    if (!revokeReason.trim()) {
      setError("Bitte einen Grund für die Rücknahme angeben.");
      return;
    }
    const fd = new FormData();
    fd.set("memberAchievementId", memberAchievementId);
    fd.set("memberId", memberId);
    fd.set("reason", revokeReason.trim());
    startTransition(async () => {
      const res = await revokeAchievementAction(fd);
      if (res.error) setError(res.error);
      else {
        setRevokeTarget(null);
        setRevokeReason("");
      }
    });
  }

  return (
    <div className="mt-3 flex flex-col gap-5">
      {manualAchievements.length > 0 ? (
        <div className="rounded-xl border border-paper/10 bg-ink p-4">
          <p className="text-sm font-medium text-paper">Erfolg vergeben</p>
          <div className="mt-3 flex flex-col gap-3">
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full rounded-lg border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper"
            >
              {manualAchievements.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.title} ({CATEGORY_LABELS[a.category] ?? a.category})
                </option>
              ))}
            </select>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Persönliche Nachricht ans Mitglied (optional, im Erfolg sichtbar)"
              className="w-full rounded-lg border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper placeholder:text-paper/30"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Interne Notiz (nicht für das Mitglied sichtbar)"
              className="w-full rounded-lg border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper placeholder:text-paper/30"
            />
            {error ? <p className="text-xs text-red">{error}</p> : null}
            {success ? <p className="text-xs text-moss">Erfolg vergeben.</p> : null}
            <button
              type="button"
              onClick={submitAward}
              disabled={isPending || !selectedSlug}
              className="flex items-center justify-center gap-1.5 self-start rounded-full bg-red px-4 py-2 text-xs font-medium text-paper hover:bg-red-dark disabled:opacity-60"
            >
              <Award size={14} /> {isPending ? "Wird vergeben …" : "Vergeben"}
            </button>
          </div>
        </div>
      ) : null}

      {unlocked.length > 0 ? (
        <div>
          <p className="text-sm font-medium text-paper">Freigeschaltete Erfolge</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {unlocked.map((a) => (
              <div key={a.slug} className="flex items-center gap-3 rounded-xl border border-paper/10 bg-ink p-3">
                <AchievementIcon iconKey={a.iconKey} tier={a.tier as AchievementTier} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-paper">{a.title}</p>
                  <p className="text-xs text-paper/40">
                    {new Date(a.unlockedAt!).toLocaleDateString("de-DE")}
                    {a.awardedByName ? ` · von ${a.awardedByName}` : ""}
                  </p>
                </div>
                {revokeTarget === a.memberAchievementId ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      value={revokeReason}
                      onChange={(e) => setRevokeReason(e.target.value)}
                      placeholder="Grund"
                      className="w-28 rounded-lg border border-paper/15 bg-anthracite px-2 py-1.5 text-xs text-paper placeholder:text-paper/30"
                    />
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => submitRevoke(a.memberAchievementId!)}
                      className="text-xs text-red hover:text-red-dark"
                    >
                      Bestätigen
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevokeTarget(a.memberAchievementId)}
                    aria-label="Zurücknehmen"
                    className="shrink-0 text-paper/40 hover:text-red"
                  >
                    <Undo2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
