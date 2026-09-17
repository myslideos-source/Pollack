"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Pencil, Lock, Unlock, RefreshCw } from "lucide-react";
import { ConfirmDialog } from "@/components/sportpark/ConfirmDialog";
import { MembershipCard } from "@/components/member/MembershipCard";
import { MembershipCardFormModal } from "./MembershipCardFormModal";
import { lockMembershipCardAction, unlockMembershipCardAction, regenerateMembershipCardQrAction } from "@/app/admin/actions/membership-card";
import { CARD_STATUS_BADGE_LABEL, CARD_STATUS_COLOR } from "@/lib/membership-card/status";
import type { MembershipCardData } from "@/lib/membership-card/data";

export function MembershipCardSection({
  memberId,
  memberFullName,
  canManage,
  card,
  offerTitles,
}: {
  memberId: string;
  memberFullName: string;
  canManage: boolean;
  card: MembershipCardData | null;
  offerTitles: string[];
}) {
  const router = useRouter();
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [confirm, setConfirm] = useState<"lock" | "regenerate" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!canManage) {
    return (
      <section className="mt-8">
        <h2 className="font-display text-lg text-paper">Digitale Mitgliedskarte</h2>
        {card ? (
          <p className={`mt-3 flex items-center gap-2 text-sm ${CARD_STATUS_COLOR[card.status].text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${CARD_STATUS_COLOR[card.status].bg}`} aria-hidden="true" />
            {CARD_STATUS_BADGE_LABEL[card.status]}
          </p>
        ) : (
          <p className="mt-3 text-sm text-paper/40">Keine Mitgliedskarte vorhanden.</p>
        )}
      </section>
    );
  }

  function runAction(action: () => Promise<{ error?: string }>, successMessage: string) {
    setActionError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setActionError(result.error);
      } else {
        setToast(successMessage);
        router.refresh();
      }
      setConfirm(null);
    });
  }

  return (
    <section className="mt-8">
      <h2 className="font-display text-lg text-paper">Digitale Mitgliedskarte</h2>

      {actionError ? <p className="mt-2 text-sm text-red">{actionError}</p> : null}
      {toast ? <p className="mt-2 text-sm text-moss">{toast}</p> : null}

      {card ? (
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="w-full max-w-[400px]">
            <MembershipCard
              fullName={memberFullName}
              cardNumber={card.cardNumber}
              memberSince={card.memberSince}
              tariff={card.tariff}
              validUntil={card.validUntil}
              status={card.status}
              qrToken={card.qrToken}
            />
          </div>
          <div className="flex flex-1 flex-wrap gap-2 sm:flex-col sm:pt-1">
            <button
              type="button"
              onClick={() => setModalMode("edit")}
              className="flex items-center gap-2 rounded-full border border-paper/15 px-4 py-2 text-sm text-paper/80 hover:border-paper/30 hover:text-paper"
            >
              <Pencil size={14} /> Karte bearbeiten
            </button>
            {card.status === "locked" ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => runAction(() => unlockMembershipCardAction(memberId), "Mitgliedskarte wurde freigegeben.")}
                className="flex items-center gap-2 rounded-full border border-moss/30 px-4 py-2 text-sm text-moss hover:border-moss/50 disabled:opacity-50"
              >
                <Unlock size={14} /> Karte freigeben
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirm("lock")}
                className="flex items-center gap-2 rounded-full border border-red/30 px-4 py-2 text-sm text-red hover:border-red/50"
              >
                <Lock size={14} /> Karte sperren
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirm("regenerate")}
              className="flex items-center gap-2 rounded-full border border-paper/15 px-4 py-2 text-sm text-paper/80 hover:border-paper/30 hover:text-paper"
            >
              <RefreshCw size={14} /> QR-Code neu erzeugen
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setModalMode("create")}
          className="mt-3 flex items-center gap-2 rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-paper hover:bg-red-dark"
        >
          <CreditCard size={15} /> Mitgliedskarte erstellen
        </button>
      )}

      {modalMode ? (
        <MembershipCardFormModal
          mode={modalMode}
          memberId={memberId}
          memberFullName={memberFullName}
          initial={modalMode === "edit" ? card : null}
          offerTitles={offerTitles}
          onClose={() => setModalMode(null)}
          onSaved={() => {
            setModalMode(null);
            setToast(modalMode === "create" ? "Mitgliedskarte wurde erfolgreich erstellt." : "Mitgliedskarte wurde aktualisiert.");
            router.refresh();
          }}
        />
      ) : null}

      <ConfirmDialog
        open={confirm === "lock"}
        title="Möchtest du diese Mitgliedskarte wirklich sperren?"
        description="Der QR-Code kann anschließend nicht mehr verwendet werden."
        confirmLabel="Karte sperren"
        destructive
        pending={isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => runAction(() => lockMembershipCardAction(memberId), "Mitgliedskarte wurde gesperrt.")}
      />

      <ConfirmDialog
        open={confirm === "regenerate"}
        title="Neuen QR-Code erzeugen?"
        description="Der bisherige QR-Code wird dadurch dauerhaft ungültig."
        confirmLabel="Neuen QR-Code erzeugen"
        pending={isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => runAction(() => regenerateMembershipCardQrAction(memberId), "QR-Code wurde neu erzeugt.")}
      />
    </section>
  );
}
