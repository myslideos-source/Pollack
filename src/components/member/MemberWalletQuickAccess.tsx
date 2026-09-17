"use client";

import { useState } from "react";
import { Wallet, Info } from "lucide-react";

/**
 * "In Wallet sichern" — intentionally honest, not a real integration: no Apple Wallet / Google
 * Wallet pass generation exists anywhere in this project yet (no certificates, no issuer
 * account, no .pkpass/Google Wallet API backend). Building a button that pretends to succeed
 * would violate the one explicit rule this feature has to follow ("keine erfundenen
 * Wallet-Erfolgsmeldungen", "keine Wallet-Funktion simulieren"), so this shows a plain, true
 * "not available yet" message on every platform instead of a fake save flow. Swap the click
 * handler for a real platform-specific flow once that backend exists.
 */
export function MemberWalletQuickAccess() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowInfo(true)}
        aria-describedby={showInfo ? "wallet-quick-access-info" : undefined}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[20px] border border-sp-border bg-sp-surface-1 text-sm font-medium text-sp-text-secondary transition-colors hover:border-sp-border-strong hover:text-sp-text"
      >
        <Wallet size={17} strokeWidth={1.8} aria-hidden="true" />
        In Wallet sichern
      </button>

      {showInfo ? (
        <p id="wallet-quick-access-info" role="status" className="mt-2.5 flex items-start gap-2 text-xs leading-snug text-sp-text-muted">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          Diese Funktion ist noch nicht verfügbar. Bitte wende dich an das Sportpark-Pollack-Team.
        </p>
      ) : null}
    </div>
  );
}
