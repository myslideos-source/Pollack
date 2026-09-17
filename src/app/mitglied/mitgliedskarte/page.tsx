import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { requireMember } from "@/lib/auth";
import { loadOwnMembershipCard } from "@/lib/membership-card/data";
import { MembershipCard } from "@/components/member/MembershipCard";
import { MembershipCardQrOverlay } from "@/components/member/MembershipCardQrOverlay";

export const metadata: Metadata = { title: "Mitgliedskarte" };

export default async function MitgliedskartePage() {
  const profile = await requireMember();
  const card = await loadOwnMembershipCard(profile.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="self-start font-display text-2xl font-bold text-paper sm:text-3xl">Deine Mitgliedskarte</h1>

      {card ? (
        <div className="mt-6 w-full max-w-[400px]">
          <MembershipCard
            fullName={card.fullName}
            cardNumber={card.cardNumber}
            memberSince={card.memberSince}
            tariff={card.tariff}
            validUntil={card.validUntil}
            status={card.status}
            qrToken={card.qrToken}
          />
          <MembershipCardQrOverlay fullName={card.fullName} cardNumber={card.cardNumber} status={card.status} qrToken={card.qrToken} />
        </div>
      ) : (
        <div className="mt-8 flex w-full flex-col items-center gap-3 rounded-2xl border border-paper/10 bg-anthracite p-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/5 text-paper/40">
            <CreditCard size={22} strokeWidth={1.75} />
          </span>
          <p className="text-base font-medium text-paper">Deine Mitgliedskarte wurde noch nicht freigeschaltet.</p>
          <p className="text-sm text-paper/50">Bitte wende dich bei Fragen an das Sportpark-Pollack-Team.</p>
        </div>
      )}
    </div>
  );
}
