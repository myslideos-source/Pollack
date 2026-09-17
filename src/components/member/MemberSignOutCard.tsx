"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { ConfirmDialog } from "@/components/sportpark/ConfirmDialog";
import { signOutSharedAction } from "@/app/actions/member-auth";

export function MemberSignOutCard() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-sp-border bg-sp-surface-1 px-4 py-3.5 text-left text-sm text-sp-text-secondary transition-colors hover:border-sp-border-strong hover:text-sp-text"
      >
        <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
        Abmelden
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Wirklich abmelden?"
        description="Möchtest du deine aktuelle Sitzung beenden?"
        confirmLabel="Abmelden"
        cancelLabel="Abbrechen"
        destructive
        pending={isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => startTransition(() => signOutSharedAction())}
      />
    </>
  );
}
