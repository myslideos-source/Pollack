"use client";

import { useActionState, useEffect, useState } from "react";
import { X } from "lucide-react";
import { createMembershipCardAction, updateMembershipCardAction, type MembershipCardActionState } from "@/app/admin/actions/membership-card";
import { MembershipCard } from "@/components/member/MembershipCard";
import { CARD_STATUSES, CARD_STATUS_SHORT_LABEL, type MembershipCardStatus } from "@/lib/membership-card/status";
import type { MembershipCardData } from "@/lib/membership-card/data";

const inputClass = "mt-1.5 w-full rounded-lg border border-paper/15 bg-ink px-2.5 py-1.5 text-sm text-paper placeholder:text-paper/30";
const labelClass = "text-xs uppercase tracking-wide text-paper/40";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function MembershipCardFormModal({
  mode,
  memberId,
  memberFullName,
  initial,
  offerTitles,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  memberId: string;
  memberFullName: string;
  initial: MembershipCardData | null;
  offerTitles: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const action = mode === "create" ? createMembershipCardAction : updateMembershipCardAction;
  const [state, formAction, pending] = useActionState<MembershipCardActionState, FormData>(action, {});

  const [preview, setPreview] = useState({
    cardNumber: initial?.cardNumber ?? "",
    memberSince: initial?.memberSince?.slice(0, 10) ?? todayIso(),
    tariff: initial?.tariff ?? "",
    validUntil: initial?.validUntil ?? "",
    status: (initial?.status ?? "active") as MembershipCardStatus,
  });

  useEffect(() => {
    if (state.success) onSaved();
  }, [state.success, onSaved]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "create" ? "Mitgliedskarte erstellen" : "Mitgliedskarte bearbeiten"}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-paper/10 bg-anthracite p-5 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-paper">{mode === "create" ? "Mitgliedskarte erstellen" : "Mitgliedskarte bearbeiten"}</h2>
          <button type="button" onClick={onClose} aria-label="Schließen" className="flex h-9 w-9 items-center justify-center rounded-full text-paper/50 hover:text-paper">
            <X size={18} />
          </button>
        </div>

        <form action={formAction} className="mt-4 grid gap-6 sm:grid-cols-2">
          <input type="hidden" name="memberId" value={memberId} />

          <div className="flex flex-col gap-4">
            <label className="block">
              <span className={labelClass}>Mitgliedsnummer</span>
              <input
                type="text"
                name="cardNumber"
                defaultValue={preview.cardNumber}
                onChange={(e) => setPreview((p) => ({ ...p, cardNumber: e.target.value }))}
                placeholder={mode === "create" ? "wird automatisch vergeben" : undefined}
                required={mode === "edit"}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Mitglied seit</span>
              <input
                type="date"
                name="memberSince"
                defaultValue={preview.memberSince}
                onChange={(e) => setPreview((p) => ({ ...p, memberSince: e.target.value }))}
                required
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Tarif</span>
              <input
                type="text"
                name="tariff"
                list="membership-card-tariff-options"
                defaultValue={preview.tariff}
                onChange={(e) => setPreview((p) => ({ ...p, tariff: e.target.value }))}
                className={inputClass}
              />
              <datalist id="membership-card-tariff-options">
                {offerTitles.map((title) => (
                  <option key={title} value={title} />
                ))}
              </datalist>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelClass}>Gültig ab</span>
                <input type="date" name="validFrom" defaultValue={initial?.validFrom ?? ""} className={inputClass} />
              </label>
              <label className="block">
                <span className={labelClass}>Gültig bis</span>
                <input
                  type="date"
                  name="validUntil"
                  defaultValue={preview.validUntil ?? ""}
                  onChange={(e) => setPreview((p) => ({ ...p, validUntil: e.target.value }))}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Kartenstatus</span>
              <select
                name="status"
                defaultValue={preview.status}
                onChange={(e) => setPreview((p) => ({ ...p, status: e.target.value as MembershipCardStatus }))}
                className={inputClass}
              >
                {CARD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {CARD_STATUS_SHORT_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Interne Notiz (optional)</span>
              <textarea name="note" defaultValue={initial?.note ?? ""} rows={2} className={inputClass} />
            </label>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className={`self-start ${labelClass}`}>Vorschau</p>
            <MembershipCard
              fullName={memberFullName}
              cardNumber={preview.cardNumber || "wird vergeben"}
              memberSince={preview.memberSince}
              tariff={preview.tariff || null}
              validUntil={preview.validUntil || null}
              status={preview.status}
              qrToken={initial?.qrToken ?? "00000000-0000-0000-0000-000000000000"}
            />
          </div>

          {state.error ? <p className="text-sm text-red sm:col-span-2">{state.error}</p> : null}

          <div className="flex items-center justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm text-paper/70 hover:text-paper">
              Abbrechen
            </button>
            <button type="submit" disabled={pending} className="rounded-full bg-red px-5 py-2 text-sm font-semibold text-paper hover:bg-red-dark disabled:opacity-50">
              {pending ? "…" : mode === "create" ? "Mitgliedskarte erstellen" : "Änderungen speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
