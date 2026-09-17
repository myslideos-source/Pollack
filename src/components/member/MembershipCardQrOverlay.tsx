"use client";

import { useEffect, useRef, useState } from "react";
import { X, Maximize2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { CARD_STATUS_COLOR, CARD_STATUS_LABEL, isQrValid, type MembershipCardStatus } from "@/lib/membership-card/status";
import { buildQrPayload } from "@/lib/membership-card/qr";

type WakeLockSentinelLike = { release: () => Promise<void> };
type NavigatorWithWakeLock = Navigator & { wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> } };

export function MembershipCardQrOverlay({
  fullName,
  cardNumber,
  status,
  qrToken,
}: {
  fullName: string;
  cardNumber: string;
  status: MembershipCardStatus;
  qrToken: string;
}) {
  const [open, setOpen] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
  const color = CARD_STATUS_COLOR[status];
  const qrValid = isQrValid(status);

  useEffect(() => {
    if (!open) return;

    async function acquireWakeLock() {
      const nav = navigator as NavigatorWithWakeLock;
      if (!nav.wakeLock) return; // No wake lock support — clean no-op fallback, the overlay still works fine.
      try {
        wakeLockRef.current = await nav.wakeLock.request("screen");
      } catch {
        // Denied or unavailable (e.g. low battery mode) — nothing to do, screen may just dim.
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") acquireWakeLock();
    }

    acquireWakeLock();
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.documentElement.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-paper/15 py-3 text-sm font-medium text-paper/80 hover:border-paper/30 hover:text-paper"
      >
        <Maximize2 size={15} /> QR-Code vergrößern
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 px-6" role="dialog" aria-modal="true" aria-label="QR-Code">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Schließen"
            className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15"
          >
            <X size={20} />
          </button>

          <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
            <div className={`relative rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${qrValid ? "" : "membership-card-qr-invalid"}`}>
              <QRCodeSVG value={buildQrPayload(qrToken)} size={240} level="M" marginSize={0} bgColor="#ffffff" fgColor="#0a0a0a" title="Mitglieds-QR-Code" />
              {!qrValid ? (
                <span className="absolute inset-6 flex items-center justify-center rounded-2xl bg-black/60 text-sm font-bold uppercase tracking-wide text-white">
                  Ungültig
                </span>
              ) : null}
            </div>

            <div>
              <p className="text-lg font-semibold text-white">{fullName}</p>
              <p className="mt-1 text-sm text-white/50">Mitglieds-Nr. {cardNumber}</p>
              <p className={`mt-3 flex items-center justify-center gap-2 text-sm font-medium ${color.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${color.bg}`} aria-hidden="true" />
                {CARD_STATUS_LABEL[status]}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
