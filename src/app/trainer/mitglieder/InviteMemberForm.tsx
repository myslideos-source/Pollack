"use client";

import { useActionState, useState } from "react";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { inviteMemberAction } from "@/app/trainer/actions";

export function InviteMemberForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(inviteMemberAction, null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-medium text-paper hover:bg-red-dark"
      >
        <UserPlus size={15} /> Mitglied oder Trainer einladen
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-3 rounded-2xl border border-paper/10 bg-anthracite p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1 block text-xs text-paper/50">Name</label>
        <input name="fullName" required className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-xs text-paper/50">E-Mail-Adresse</label>
        <input name="email" type="email" required className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Rolle</label>
        <select name="role" defaultValue="mitglied" className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper">
          <option value="mitglied">Mitglied</option>
          <option value="trainer">Trainer</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" disabled={pending} className="rounded-full bg-red px-4 py-2 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60">
          {pending ? "…" : "Einladen"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-paper/50 hover:text-paper">
          Abbrechen
        </button>
      </div>
      {state?.error ? (
        <p className="flex items-center gap-1.5 text-xs text-red sm:basis-full">
          <AlertCircle size={13} /> {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="flex items-center gap-1.5 text-xs text-moss sm:basis-full">
          <CheckCircle2 size={13} /> {state.success}
        </p>
      ) : null}
    </form>
  );
}
