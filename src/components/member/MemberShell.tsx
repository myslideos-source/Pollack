"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Dumbbell, TrendingUp, Trophy, User, Bell, LogOut } from "lucide-react";
import { signOutSharedAction } from "@/app/actions/member-auth";
import { OfflineBanner } from "@/components/member/OfflineBanner";

const NAV_ITEMS = [
  { href: "/mitglied", label: "Start", icon: Home },
  { href: "/mitglied/trainingsplan", label: "Plan", icon: ClipboardList },
  { href: "/mitglied/training", label: "Training", icon: Dumbbell },
  { href: "/mitglied/fortschritt", label: "Fortschritt", icon: TrendingUp },
  { href: "/mitglied/erfolge", label: "Erfolge", icon: Trophy },
  { href: "/mitglied/profil", label: "Profil", icon: User },
];

/**
 * App-like shell for the whole /mitglied area: a thin top bar (logo, notifications, sign-out)
 * and a bottom tab bar fixed to the safe area on phones. Deliberately its own shell — not the
 * public site's Header/Footer/MobileCtaBar — so the portal reads as a distinct, focused app
 * rather than a sub-page of the marketing site.
 */
export function MemberShell({ fullName, children }: { fullName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const initial = fullName.trim().slice(0, 1).toUpperCase() || "M";

  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <OfflineBanner />
      <header
        className="sticky top-0 z-40 border-b border-paper/10 bg-ink/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/mitglied" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red/20 font-display text-sm text-red">
              {initial}
            </span>
            <span className="font-display text-sm uppercase tracking-wide text-paper/80">Sportpark Pollack</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Portal-Navigation">
            {NAV_ITEMS.map((item) => {
              const active = item.href === "/mitglied" ? pathname === "/mitglied" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm ${
                    active ? "bg-red/15 text-red" : "text-paper/60 hover:text-paper"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/mitglied/nachrichten"
              aria-label="Nachrichten"
              className="flex h-10 w-10 items-center justify-center rounded-full text-paper/70 hover:bg-paper/5 hover:text-paper"
            >
              <Bell size={19} />
            </Link>
            <form action={signOutSharedAction}>
              <button
                type="submit"
                aria-label="Abmelden"
                className="flex h-10 w-10 items-center justify-center rounded-full text-paper/50 hover:bg-paper/5 hover:text-paper"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 lg:pb-8">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-paper/10 bg-anthracite/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Portal-Navigation (mobil)"
      >
        <div className="mx-auto grid max-w-md grid-cols-6">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/mitglied" ? pathname === "/mitglied" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-1 py-2 text-[11px] ${
                  active ? "text-red" : "text-paper/50 hover:text-paper/80"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
