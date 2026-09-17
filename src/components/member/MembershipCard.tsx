import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { CARD_STATUS_COLOR, CARD_STATUS_LABEL, isQrValid, type MembershipCardStatus } from "@/lib/membership-card/status";
import { buildQrPayload } from "@/lib/membership-card/qr";

export type MembershipCardProps = {
  fullName: string;
  cardNumber: string;
  memberSince: string;
  tariff: string | null;
  validUntil: string | null;
  status: MembershipCardStatus;
  qrToken: string;
};

function memberSinceYear(iso: string): string {
  return String(new Date(iso).getFullYear());
}

/** The card itself — the visual, non-interactive surface shown both in the member area and in
 *  the admin preview. Its size is controlled entirely by the parent (w-full + max-w + aspect
 *  ratio here), so it drops cleanly into a phone-width column or a fixed-width admin panel. */
export function MembershipCard({ fullName, cardNumber, memberSince, tariff, validUntil, status, qrToken }: MembershipCardProps) {
  const color = CARD_STATUS_COLOR[status];
  const qrValid = isQrValid(status);

  return (
    <div className="membership-card aspect-[85.6/54] w-full max-w-[400px] p-5 text-white sm:p-6">
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Image
              src="/logo/sportpark-pollack-logo-white.webp"
              alt="Sportpark Pollack"
              width={160}
              height={55}
              className="h-6 w-auto sm:h-7"
              priority
            />
            <p className="mt-2 text-[10px] font-semibold tracking-[0.32em] text-white/45">MEMBER</p>
          </div>

          <div className={`relative shrink-0 rounded-lg bg-white p-1.5 ${qrValid ? "" : "membership-card-qr-invalid"}`}>
            <QRCodeSVG value={buildQrPayload(qrToken)} size={56} level="M" marginSize={0} bgColor="#ffffff" fgColor="#0a0a0a" title="Mitglieds-QR-Code" />
            {!qrValid ? (
              <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/55 text-[8px] font-bold uppercase tracking-wide text-white">
                Ungültig
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <p className="truncate text-lg font-semibold leading-tight sm:text-xl">{fullName}</p>

          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-white/55 sm:text-xs">
            <div className="flex gap-1.5">
              <dt>Mitglied seit</dt>
              <dd className="text-white/80">{memberSinceYear(memberSince)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Mitglieds-Nr.</dt>
              <dd className="text-white/80">{cardNumber}</dd>
            </div>
            {tariff ? (
              <div className="flex gap-1.5">
                <dt>Tarif</dt>
                <dd className="text-white/80">{tariff}</dd>
              </div>
            ) : null}
            {validUntil ? (
              <div className="flex gap-1.5">
                <dt>Gültig bis</dt>
                <dd className="text-white/80">{new Date(validUntil).toLocaleDateString("de-DE")}</dd>
              </div>
            ) : null}
          </dl>

          <p className={`mt-3 flex items-center gap-2 text-xs font-medium sm:text-sm ${color.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${color.bg}`} aria-hidden="true" />
            {CARD_STATUS_LABEL[status]}
          </p>
        </div>
      </div>
    </div>
  );
}
