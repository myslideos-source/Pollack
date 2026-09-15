"use client";

import { useState, useTransition } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { logBodyMeasurementAction } from "@/app/mitglied/actions";

export function BodyMeasurementForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1 text-xs text-paper/40 hover:text-paper/70"
      >
        <Plus size={13} /> Wert eintragen
      </button>
    );
  }

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const res = await logBodyMeasurementAction(fd);
          if (res.error) setError(res.error);
          else {
            setError(null);
            setOpen(false);
          }
        })
      }
      className="mt-3 flex flex-col gap-2 rounded-xl border border-paper/10 bg-ink p-3"
    >
      <div className="grid grid-cols-2 gap-2">
        <input
          name="weightKg"
          type="number"
          step="0.1"
          placeholder="Gewicht (kg)"
          className="rounded-lg border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-red"
        />
        <input
          name="bodyFatPct"
          type="number"
          step="0.1"
          placeholder="Körperfett (%)"
          className="rounded-lg border border-paper/15 bg-anthracite px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-red"
        />
      </div>
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-red">
          <AlertCircle size={13} /> {error}
        </p>
      ) : null}
      <div className="flex items-center gap-2">
        <button type="submit" disabled={isPending} className="rounded-full bg-red px-4 py-1.5 text-xs font-medium text-paper hover:bg-red-dark disabled:opacity-60">
          {isPending ? "Speichert …" : "Speichern"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-paper/50 hover:text-paper">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
