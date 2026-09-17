"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, LayoutGrid, Users, ClipboardList, Dumbbell, Trophy, MessageSquare, ChartNoAxesCombined, Settings, LogOut } from "lucide-react";
import type { Profile } from "@/lib/auth";
import { signOutAction } from "@/app/admin/actions/auth";

const ROLE_LABEL: Record<string, string> = { admin: "Administrator", redakteur: "Redakteur" };

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  badge?: number;
};

export function AdminSidebar({
  profile,
  unreadMessageCount,
  open,
  onClose,
}: {
  profile: Profile;
  unreadMessageCount: number;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/admin", label: "Übersicht", icon: LayoutGrid },
    { href: "/trainer/mitglieder", label: "Mitglieder", icon: Users },
    { href: "/trainer", label: "Trainingspläne", icon: Dumbbell },
    { href: "/admin/uebungen", label: "Übungen", icon: ClipboardList },
    { href: "/admin/erfolge", label: "Erfolge", icon: Trophy },
    { href: "/trainer", label: "Nachrichten", icon: MessageSquare, badge: unreadMessageCount },
    { href: "/admin#mitgliederaktivitaet", label: "Auswertungen", icon: ChartNoAxesCombined },
    { href: "/admin/einstellungen", label: "Einstellungen", icon: Settings },
  ];

  function isActive(href: string): boolean {
    const path = href.split("#")[0];
    if (path === "/admin") return pathname === "/admin";
    if (path === "/trainer") return pathname === "/trainer";
    return pathname.startsWith(path);
  }

  return (
    <>
      {open ? <div className="fixed inset-0 z-40 bg-admin-bg/70 min-[1200px]:hidden" onClick={onClose} aria-hidden="true" /> : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[260px] max-w-[85vw] shrink-0 flex-col border-r border-admin-border bg-admin-sidebar transition-transform duration-200 ease-out min-[1200px]:static min-[1200px]:z-auto min-[1200px]:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-5 pt-7">
          <Image src="/logo/sportpark-pollack-logo-white.webp" alt="Sportpark Pollack" width={200} height={69} className="h-auto w-[190px]" priority />
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-admin-text-secondary hover:text-admin-text min-[1200px]:hidden"
            aria-label="Menü schließen"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Admin-Navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`relative flex h-[52px] items-center justify-between gap-3.5 rounded-[10px] pl-4 pr-3 text-[14.5px] transition-colors ${
                  active ? "bg-admin-red-soft font-medium text-admin-red" : "text-admin-text-secondary hover:bg-white/[0.03] hover:text-admin-text"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {active ? <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-admin-red" aria-hidden="true" /> : null}
                <span className="flex items-center gap-3.5">
                  <Icon size={21} strokeWidth={1.75} />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-admin-red px-1.5 text-[11px] font-semibold text-admin-text">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-admin-divider px-4 py-4">
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-admin-card-elevated text-sm font-semibold text-admin-text">
              {profile.full_name.trim().slice(0, 1).toUpperCase() || "A"}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm text-admin-text">{profile.full_name}</span>
              <span className="block text-xs text-admin-text-muted">{ROLE_LABEL[profile.role] ?? profile.role}</span>
            </span>
          </div>
          <form action={signOutAction} className="mt-2">
            <button
              type="submit"
              className="flex h-11 w-full items-center gap-3 rounded-[10px] px-2 text-left text-sm text-admin-text-secondary hover:bg-white/[0.03] hover:text-admin-text"
            >
              <LogOut size={19} strokeWidth={1.75} />
              Abmelden
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
