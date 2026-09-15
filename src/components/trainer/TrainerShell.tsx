"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { signOutSharedAction } from "@/app/actions/member-auth";

const NAV_ITEMS = [
  { href: "/trainer", label: "Übersicht", icon: LayoutDashboard },
  { href: "/trainer/mitglieder", label: "Mitglieder", icon: Users },
];

export function TrainerShell({ fullName, children }: { fullName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const initial = fullName.trim().slice(0, 1).toUpperCase() || "T";

  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <header className="sticky top-0 z-40 border-b border-paper/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/trainer" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red/20 font-display text-sm text-red">
                {initial}
              </span>
              <span className="font-display text-sm uppercase tracking-wide text-paper/80">Trainerbereich</span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Trainer-Navigation">
              {NAV_ITEMS.map((item) => {
                const active = item.href === "/trainer" ? pathname === "/trainer" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm ${
                      active ? "bg-red/15 text-red" : "text-paper/60 hover:text-paper"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-paper/60 sm:block">{fullName}</span>
            <form action={signOutSharedAction}>
              <button type="submit" aria-label="Abmelden" className="flex h-10 w-10 items-center justify-center rounded-full text-paper/50 hover:bg-paper/5 hover:text-paper">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-paper/10 px-4 py-1.5 sm:hidden" aria-label="Trainer-Navigation (mobil)">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/trainer" ? pathname === "/trainer" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                  active ? "bg-red/15 text-red" : "text-paper/60"
                }`}
              >
                <Icon size={13} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
