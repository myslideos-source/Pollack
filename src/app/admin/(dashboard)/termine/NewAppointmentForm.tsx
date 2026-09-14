"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { createStandaloneAppointmentAction } from "@/app/admin/actions/appointments";

export function NewAppointmentForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-paper/20 px-4 py-2 text-sm text-paper hover:border-paper/40"
      >
        <Plus size={15} /> Neuer Termin
      </button>
    );
  }

  return (
    <form
      action={(fd) => {
        startTransition(async () => {
          const res = await createStandaloneAppointmentAction(fd);
          if (res.error) setError(res.error);
          else setOpen(false);
        });
      }}
      className="rounded-xl border border-paper/15 bg-anthracite p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-paper">Neuer Termin</p>
        <button type="button" onClick={() => setOpen(false)} className="text-paper/50 hover:text-paper">
          <X size={16} />
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input name="title" placeholder="Titel" required className="rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
        <select name="appointmentType" defaultValue="beratung" className="rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper">
          <option value="probetraining">Probetraining</option>
          <option value="beratung">Beratung</option>
          <option value="rueckruf">Rückruf</option>
          <option value="sonstiges">Sonstiges</option>
        </select>
        <input type="datetime-local" name="startsAt" required className="rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
        <input name="notes" placeholder="Notiz (optional)" className="rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
      </div>
      {error ? <p className="mt-2 text-sm text-red">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="mt-3 rounded-full bg-red px-4 py-2 text-xs font-medium text-paper hover:bg-red-dark disabled:opacity-60"
      >
        {isPending ? "Wird gespeichert …" : "Termin speichern"}
      </button>
    </form>
  );
}
