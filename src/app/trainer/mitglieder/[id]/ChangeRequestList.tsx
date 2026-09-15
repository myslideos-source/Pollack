"use client";

import { useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { resolveChangeRequestAction } from "@/app/trainer/actions";

type Request = { id: string; message: string; status: string; created_at: string };

export function ChangeRequestList({ memberId, requests }: { memberId: string; requests: Request[] }) {
  const [isPending, startTransition] = useTransition();
  const open = requests.filter((r) => r.status === "open");

  if (open.length === 0) return null;

  return (
    <section className="mt-6 rounded-2xl border border-sand/30 bg-sand/10 p-4">
      <h2 className="font-display text-sm uppercase tracking-wide text-sand">Offene Änderungsanfrage</h2>
      <ul className="mt-2 flex flex-col gap-3">
        {open.map((r) => (
          <li key={r.id} className="flex items-start justify-between gap-3">
            <p className="text-sm text-paper/80">{r.message}</p>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                const fd = new FormData();
                fd.set("requestId", r.id);
                startTransition(async () => {
                  await resolveChangeRequestAction(memberId, fd);
                });
              }}
              className="flex shrink-0 items-center gap-1 rounded-full border border-paper/20 px-3 py-1.5 text-xs text-paper hover:border-paper/40"
            >
              <CheckCircle2 size={12} /> Erledigt
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
