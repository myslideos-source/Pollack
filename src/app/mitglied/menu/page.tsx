import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, ArrowRight, Bell } from "lucide-react";
import { requireMember } from "@/lib/auth";
import { loadOwnMembershipCard } from "@/lib/membership-card/data";
import { loadUnreadMessageCount } from "@/lib/member/data";
import { MemberAvatar } from "@/components/sportpark/ui";
import { MembershipCardQuickView } from "@/components/member/MembershipCardQuickView";
import { MemberWalletQuickAccess } from "@/components/member/MemberWalletQuickAccess";
import { MemberMenuTiles } from "@/components/member/MemberMenuTiles";
import { MemberSignOutCard } from "@/components/member/MemberSignOutCard";

export const metadata: Metadata = { title: "Menü" };

export default async function MemberMenuPage() {
  const profile = await requireMember();
  const [card, unreadMessageCount] = await Promise.all([
    loadOwnMembershipCard(profile.id),
    loadUnreadMessageCount(profile.id),
  ]);

  return (
    <div className="mx-auto max-w-md animate-[fade-up_0.35s_ease-out_both] px-5 pt-[max(16px,env(safe-area-inset-top))] motion-reduce:animate-none lg:hidden">
      {/* Page-specific header — mobile only, standing in for MemberShell's shared header while
         on this route (see MemberShell.tsx). Every other member page keeps that header as-is. */}
      <header className="flex items-center justify-between py-3">
        <Link href="/mitglied" aria-label="Zur Startseite">
          <Image src="/logo/sportpark-pollack-logo-white.webp" alt="Sportpark Pollack" width={190} height={65} className="h-auto w-[172px]" priority />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/mitglied/nachrichten"
            aria-label="Benachrichtigungen"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-sp-text-secondary transition-colors hover:text-sp-text"
          >
            <Bell size={22} strokeWidth={1.8} aria-hidden="true" />
            {unreadMessageCount > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sp-red ring-2 ring-sp-bg" aria-hidden="true" /> : null}
          </Link>
          <Link href="/mitglied/profil" aria-label="Profil">
            <MemberAvatar fullName={profile.full_name} size={38} />
          </Link>
        </div>
      </header>

      <div className="mt-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sp-text-muted">Mitgliederbereich</p>
        <h1 className="mt-1 text-[40px] font-extrabold leading-[1.05] tracking-tight text-sp-text">Menü</h1>
        <p className="mt-1.5 text-[17px] text-sp-text-secondary">Alles Wichtige auf einen Blick.</p>
      </div>

      <div className="mt-6">
        {card ? (
          <MembershipCardQuickView fullName={profile.full_name} cardNumber={card.cardNumber} memberSince={card.memberSince} status={card.status} qrToken={card.qrToken} />
        ) : (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-[28px] border border-sp-border bg-sp-surface-1 px-6 text-center">
            <p className="text-sm font-medium text-sp-text">Mitgliedskarte momentan nicht verfügbar</p>
            <p className="text-sm text-sp-text-muted">Bitte wende dich an das Team des Sportpark Pollack.</p>
          </div>
        )}

        <Link
          href="/mitglied/mitgliedskarte"
          className="mt-3 flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-[20px] bg-gradient-to-r from-sp-red-light via-sp-red to-sp-red-dark text-[15px] font-semibold text-white shadow-[0_14px_32px_rgba(244,58,53,0.28)] transition-transform active:scale-[0.98] motion-reduce:transition-none"
        >
          <CreditCard size={19} strokeWidth={1.9} aria-hidden="true" />
          Mitgliedskarte öffnen
          <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
        </Link>

        <div className="mt-3">
          <MemberWalletQuickAccess />
        </div>
      </div>

      <div className="mt-7">
        <MemberMenuTiles unreadMessageCount={unreadMessageCount} />
      </div>

      <div className="mt-7 border-t border-sp-border pt-5">
        <div className="flex flex-col gap-2.5">
          <Link
            href="/#kontakt"
            className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-sp-border bg-sp-surface-1 px-4 py-3.5 text-sm text-sp-text-secondary transition-colors hover:border-sp-border-strong hover:text-sp-text"
          >
            Hilfe &amp; Kontakt
          </Link>
          <MemberSignOutCard />
        </div>
      </div>
    </div>
  );
}
