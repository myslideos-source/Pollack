"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, ClipboardList, Ellipsis, Dumbbell, Trophy, MessageSquare, ChartNoAxesCombined, Settings, LogOut, X } from "lucide-react";
import { signOutAction } from "@/app/admin/actions/auth";

const TABS = [
  { href: "/admin", label: "Übersicht", icon: LayoutGrid },
  { href: "/trainer/mitglieder", label: "Mitglieder", icon: Users },
  { href: "/trainer", label: "Pläne", icon: ClipboardList },
];

const MORE_ITEMS = [
  { href: "/admin/uebungen", label: "Übungen", icon: Dumbbell },
  { href: "/admin/erfolge", label: "Erfolge", icon: Trophy },
  { href: "/trainer", label: "Nachrichten", icon: MessageSquare },
  { href: "/admin#mitgliederaktivitaet", label: "Auswertungen", icon: ChartNoAxesCombined },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: Settings },
];

/** Mobile (<768px) bottom tab bar — replaces the off-canvas sidebar drawer entirely on phones.
 *  "Mehr" opens a bottom sheet with the remaining admin sections + Abmelden. */
export function AdminBottomNavigation() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [moreOpen]);

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/trainer") return pathname === "/trainer";
    return pathname.startsWith(href);
  }

  const moreActive = MORE_ITEMS.some((item) => isActive(item.href.split("#")[0]));

  return (
    <div className="min-[768px]:hidden">
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-admin-border bg-admin-sidebar/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Admin-Navigation (mobil)"
      >
        <div className="grid grid-cols-4">
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex min-h-[68px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium ${
                  active ? "text-admin-red" : "text-admin-text-muted"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {active ? <span className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-admin-red" aria-hidden="true" /> : null}
                <Icon size={22} strokeWidth={1.75} />
                {tab.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`relative flex min-h-[68px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium ${
              moreActive ? "text-admin-red" : "text-admin-text-muted"
            }`}
          >
            {moreActive ? <span className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-admin-red" aria-hidden="true" /> : null}
            <Ellipsis size={22} strokeWidth={1.75} />
            Mehr
          </button>
        </div>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMoreOpen(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Weitere Bereiche"
            className="animate-admin-card-in absolute inset-x-0 bottom-0 overflow-hidden rounded-t-admin-large border-t border-admin-border bg-admin-card-elevated pb-[max(env(safe-area-inset-bottom),16px)] shadow-admin motion-reduce:animate-none"
          >
            <div className="flex items-center justify-between border-b border-admin-divider px-5 py-4">
              <h2 className="text-sm font-medium text-admin-text">Weitere Bereiche</h2>
              <button type="button" onClick={() => setMoreOpen(false)} aria-label="Schließen" className="text-admin-text-secondary hover:text-admin-text">
                <X size={18} />
              </button>
            </div>
            <div className="px-2 py-2">
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex min-h-[52px] items-center gap-3.5 rounded-[10px] px-3 text-[14.5px] text-admin-text-secondary hover:bg-white/[0.03] hover:text-admin-text"
                  >
                    <Icon size={21} strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex min-h-[52px] w-full items-center gap-3.5 rounded-[10px] px-3 text-left text-[14.5px] text-admin-text-secondary hover:bg-white/[0.03] hover:text-admin-text"
                >
                  <LogOut size={21} strokeWidth={1.75} />
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
