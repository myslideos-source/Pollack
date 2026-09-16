"use client";

import { useEffect, useRef } from "react";

/** Shared confirm/cancel modal for destructive or consequential admin actions. Traps focus on
 * open and returns it to the trigger on close, per the master prompt's dialog-focus-management
 * requirement. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Bestätigen",
  cancelLabel = "Abbrechen",
  destructive = false,
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sp-bg/80 backdrop-blur-sm px-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sp-confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-sp-lg border border-sp-border bg-sp-surface-1 p-6 shadow-sp-card"
      >
        <h2 id="sp-confirm-title" className="sp-headline text-xl font-bold text-sp-text">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm text-sp-text-secondary">{description}</p> : null}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm text-sp-text-secondary hover:text-sp-text">
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-sp-text disabled:opacity-50 ${
              destructive ? "bg-sp-red hover:bg-sp-red-light" : "bg-sp-surface-3 hover:bg-sp-surface-2"
            }`}
          >
            {pending ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
