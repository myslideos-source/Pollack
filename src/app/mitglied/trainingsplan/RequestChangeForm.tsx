"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { requestPlanChangeAction } from "@/app/mitglied/actions";

export function RequestChangeForm({ planId, disabled }: { planId: string; disabled: boolean }) {
  const [state, formAction, pending] = useActionState(requestPlanChangeAction, null);

  if (disabled) {
    return <p className="mt-3 text-sm text-paper/40">Du hast bereits eine offene Anfrage — bitte warte auf Rückmeldung.</p>;
  }

  if (state?.success) {
    return (
      <p className="mt-3 flex items-center gap-2 text-sm text-moss">
        <CheckCircle2 size={16} /> Anfrage gesendet. Dein Trainer meldet sich bei dir.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-3">
      <input type="hidden" name="planId" value={planId} />
      <textarea
        name="message"
        rows={3}
        required
        placeholder="z. B. Kniebeugen bereiten mir Schmerzen, gibt es eine Alternative?"
        className="w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-red focus:ring-1 focus:ring-red"
      />
      {state?.error ? (
        <p className="flex items-center gap-2 text-sm text-red">
          <AlertCircle size={15} /> {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full border border-paper/20 px-5 py-2 text-sm text-paper hover:border-paper/40 disabled:opacity-60"
      >
        {pending ? "Wird gesendet …" : "Anfrage senden"}
      </button>
    </form>
  );
}
