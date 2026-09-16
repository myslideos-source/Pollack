"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { manrope, barlowCondensed } from "@/lib/fonts";
import { signOutSharedAction } from "@/app/actions/member-auth";
import { OfflineBanner } from "@/components/member/OfflineBanner";
import { IconButton, MemberAvatar } from "@/components/sportpark/ui";
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
 * a bottom tab bar fixed to the safe area on phones — no large card surface on the header itself,
 * per the mockup. The five-item bottom nav matches the mockup exactly; Erfolge (not in that set)
 * stays reachable from the Profil page instead of being dropped.
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

  return (
    <div className={`${manrope.variable} ${barlowCondensed.variable} sp-scope flex min-h-screen flex-col bg-sp-bg text-sp-text`}>
      <OfflineBanner />
      <header className="sticky top-0 z-40 bg-sp-bg/95 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
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
            <IconButton icon={SpBell} label="Benachrichtigungen" badge={unreadCount > 0} className="text-sp-text-secondary" />
            <Link href="/mitglied/profil" aria-label="Profil">
              <MemberAvatar fullName={fullName} size={34} />
            </Link>
            <form action={signOutSharedAction} className="hidden lg:block">
              <IconButton icon={SpLogout} label="Abmelden" type="submit" />
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 lg:pb-8">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-sp-border bg-sp-sidebar/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Portal-Navigation (mobil)"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/mitglied" ? pathname === "/mitglied" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium ${
                  active ? "text-sp-red" : "text-sp-text-muted hover:text-sp-text-secondary"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={23} strokeWidth={1.8} />
                {item.label}
                <span className={`mt-0.5 h-[2px] w-4 rounded-full ${active ? "bg-sp-red" : "bg-transparent"}`} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
