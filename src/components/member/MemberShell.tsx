"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutSharedAction } from "@/app/actions/member-auth";
import { OfflineBanner } from "@/components/member/OfflineBanner";
import { InstallPromptProvider } from "@/components/member/InstallPromptProvider";
import { InstallPromptDialog } from "@/components/member/InstallPromptDialog";
import { IconButton, MemberAvatar } from "@/components/sportpark/ui";
import { MemberBottomDock } from "@/components/member/MemberBottomDock";
import {
  SpHome,
  SpClipboardList,
  SpDumbbell,
  SpTrendingUp,
  SpUser,
  SpBell,
  SpLogout,
} from "@/components/icons/sportpark";

const NAV_ITEMS = [
  { href: "/mitglied", label: "Start", icon: SpHome },
  { href: "/mitglied/trainingsplan", label: "Plan", icon: SpClipboardList },
  { href: "/mitglied/training", label: "Training", icon: SpDumbbell },
  { href: "/mitglied/fortschritt", label: "Fortschritt", icon: SpTrendingUp },
  { href: "/mitglied/profil", label: "Profil", icon: SpUser },
];

/**
 * App-like shell for the whole /mitglied area: a slim top bar (logo, notifications, avatar) and
 * a floating bottom dock fixed to the safe area on phones. Desktop keeps the original top nav
 * unchanged. /mitglied/menu supplies its own bespoke mobile header (per its own mockup), so this
 * shell's shared header hides below `lg` only on that one route — every other page keeps the
 * exact header it always had, at every width.
 */
export function MemberShell({
  fullName,
  unreadCount,
  children,
}: {
  fullName: string;
  unreadCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMenuPage = pathname === "/mitglied/menu";

  return (
    <InstallPromptProvider>
      <div className="sp-scope flex min-h-screen min-h-[100dvh] flex-col bg-sp-bg text-sp-text">
        <OfflineBanner />
        <header
          className={`sticky top-0 z-40 bg-sp-bg/95 backdrop-blur ${isMenuPage ? "max-lg:hidden" : ""}`}
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
            <Link href="/mitglied" className="flex items-center">
              <Image src="/logo/sportpark-pollack-logo-white.webp" alt="Sportpark Pollack" width={160} height={55} className="h-7 w-auto" priority />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Portal-Navigation">
              {NAV_ITEMS.map((item) => {
                const active = item.href === "/mitglied" ? pathname === "/mitglied" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ${
                      active ? "bg-sp-red-soft text-sp-red" : "text-sp-text-secondary hover:text-sp-text"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/mitglied/nachrichten"
                aria-label="Benachrichtigungen"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-sp-text-secondary transition-colors hover:text-sp-text"
              >
                <SpBell size={22} strokeWidth={1.8} />
                {unreadCount > 0 ? (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sp-red ring-2 ring-sp-bg" aria-hidden="true" />
                ) : null}
              </Link>
              <Link href="/mitglied/profil" aria-label="Profil">
                <MemberAvatar fullName={fullName} size={34} />
              </Link>
              <form action={signOutSharedAction} className="hidden lg:block">
                <IconButton icon={SpLogout} label="Abmelden" type="submit" />
              </form>
            </div>
          </div>
        </header>

        {/* 120px clears the floating dock (min-height 78px + its own bottom offset + the
           center button's protrusion) on every mobile page, not just /mitglied/menu — the dock
           is global, so every page needs the same clearance. */}
        <main className="flex-1 pb-[calc(120px+env(safe-area-inset-bottom))] lg:pb-8">{children}</main>

        <MemberBottomDock />

        <InstallPromptDialog />
      </div>
    </InstallPromptProvider>
  );
}
