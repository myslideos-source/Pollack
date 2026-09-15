"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { revokeHealthConsentAction, requestAccountDeletionAction } from "@/app/mitglied/actions";

export function ProfileActions({ consentActive }: { consentActive: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [deletionSent, setDeletionSent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {consentActive ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await revokeHealthConsentAction();
            })
          }
          className="rounded-full border border-paper/20 px-4 py-2 text-sm text-paper hover:border-paper/40 disabled:opacity-60"
        >
          Einwilligung widerrufen
        </button>
      ) : null}

      {deletionSent ? (
        <p className="flex items-center gap-1.5 text-sm text-moss">
          <CheckCircle2 size={15} /> Anfrage an dein Trainerteam gesendet.
        </p>
      ) : confirmDelete ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await requestAccountDeletionAction();
                setDeletionSent(true);
              })
            }
            className="rounded-full bg-red px-4 py-2 text-sm text-paper hover:bg-red-dark disabled:opacity-60"
          >
            Wirklich beantragen
          </button>
          <button type="button" onClick={() => setConfirmDelete(false)} className="text-sm text-paper/50 hover:text-paper">
            Abbrechen
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="text-sm text-paper/50 underline underline-offset-2 hover:text-red"
        >
          Konto- und Datenlöschung beantragen
        </button>
      )}
    </div>
  );
}
