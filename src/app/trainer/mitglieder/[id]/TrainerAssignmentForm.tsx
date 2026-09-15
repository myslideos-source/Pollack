"use client";

import { useTransition } from "react";
import { assignTrainerAction } from "@/app/trainer/actions";

export function TrainerAssignmentForm({
  memberId,
  currentTrainerId,
  trainers,
}: {
  memberId: string;
  currentTrainerId: string | null;
  trainers: { id: string; full_name: string }[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-paper/10 bg-anthracite p-4">
      <p className="text-xs uppercase tracking-wide text-paper/40">Zuständiger Trainer</p>
      <select
        defaultValue={currentTrainerId ?? ""}
        disabled={isPending}
        onChange={(e) => {
          const fd = new FormData();
          fd.set("memberId", memberId);
          fd.set("trainerId", e.target.value);
          startTransition(async () => {
            await assignTrainerAction(fd);
          });
        }}
        className="mt-1.5 w-full rounded-lg border border-paper/15 bg-ink px-2.5 py-1.5 text-sm text-paper"
      >
        <option value="" disabled>
          Trainer wählen …
        </option>
        {trainers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}
