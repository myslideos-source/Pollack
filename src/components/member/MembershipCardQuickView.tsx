import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { CARD_STATUS_COLOR, CARD_STATUS_SHORT_LABEL, isQrValid, type MembershipCardStatus } from "@/lib/membership-card/status";
import { buildQrPayload } from "@/lib/membership-card/qr";

export type MembershipCardQuickViewProps = {
  fullName: string;
  cardNumber: string;
  memberSince: string;
  status: MembershipCardStatus;
  qrToken: string;
};

function memberSinceYear(iso: string): string {
  return String(new Date(iso).getFullYear());
}

/**
 * The menu page's "hochwertige Schnellansicht" of the member's real card — reuses the exact
 * same card data (loadOwnMembershipCard), status source of truth and QR payload builder as the
 * existing /mitglied/mitgliedskarte page, just laid out differently for this quick-glance
 * placement. Deliberately its own component rather than a MembershipCard.tsx edit: that
 * component is the untouchable "bestehende Mitgliedskarte" used elsewhere (member's full-page
 * view, admin preview) and must keep its exact current layout.
 */
export function MembershipCardQuickView({ fullName, cardNumber, memberSince, status, qrToken }: MembershipCardQuickViewProps) {
  const color = CARD_STATUS_COLOR[status];
  const qrValid = isQrValid(status);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[28px] border p-5 text-white sm:p-6"
      style={{
        aspectRatio: "1.58 / 1",
        borderColor: "rgba(244, 58, 53, 0.35)",
        background:
          "radial-gradient(circle at 78% 76%, rgba(244, 58, 53, 0.25), transparent 35%), linear-gradient(135deg, #151817 0%, #090b0a 58%, #17100f 100%)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <Image
            src="/logo/sportpark-pollack-logo-white.webp"
            alt="Sportpark Pollack"
            width={160}
            height={55}
            className="h-6 w-auto sm:h-7"
            priority
          />
          <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${color.soft} ${color.border} ${color.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${color.bg}`} aria-hidden="true" />
            {CARD_STATUS_SHORT_LABEL[status]}
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 break-words text-[24px] font-bold leading-tight sm:text-[27px]">{fullName}</p>
            <p className="mt-2 text-[13px] text-white/60">Mitglied seit {memberSinceYear(memberSince)}</p>
            <p className="text-[13px] text-white/60">
              Mitglieds-Nr. <span className="font-medium text-white/85">{cardNumber}</span>
            </p>
          </div>

          <Link href="/mitglied/mitgliedskarte" aria-label="QR-Code zum Check-in vorzeigen — vollständige Mitgliedskarte öffnen" className="flex shrink-0 flex-col items-center gap-1.5">
            <span className={`relative rounded-xl bg-white p-1.5 ${qrValid ? "" : "membership-card-qr-invalid"}`}>
              <QRCodeSVG value={buildQrPayload(qrToken)} size={72} level="M" marginSize={1} bgColor="#ffffff" fgColor="#0a0a0a" title="Mitglieds-QR-Code" />
              {!qrValid ? (
                <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/55 text-[9px] font-bold uppercase tracking-wide text-white">
                  Ungültig
                </span>
              ) : null}
            </span>
            <span className="max-w-[92px] text-center text-[10.5px] leading-tight text-white/55">Zum Check-in QR-Code vorzeigen</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
