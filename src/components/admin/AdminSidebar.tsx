"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { Profile } from "@/lib/auth";
import { signOutAction } from "@/app/admin/actions/auth";
import {
  SpHome,
  SpMessageCircle,
  SpUsers,
  SpDumbbell,
  SpClipboardList,
  SpBodyAnalysis,
  SpMessageSquare,
  SpMonitor,
  SpImage,
  SpTag,
  SpSettings,
  SpLogout,
} from "@/components/icons/sportpark";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  adminOnly?: boolean;
  badge?: number;
};

export function AdminSidebar({
  profile,
  inboxCount,
  open,
  onClose,
}: {
  profile: Profile;
  inboxCount: number;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const primaryNav: NavItem[] = [
    { href: "/admin", label: "Übersicht", icon: SpHome },
    { href: "/admin/anfragen", label: "Anfragen", icon: SpMessageCircle, badge: inboxCount },
    { href: "/trainer/mitglieder", label: "Mitglieder", icon: SpUsers },
    { href: "/trainer", label: "Trainingspläne", icon: SpDumbbell },
    { href: "/admin/uebungen", label: "Übungen", icon: SpClipboardList },
    { href: "/trainer", label: "Körperanalysen", icon: SpBodyAnalysis },
    { href: "/trainer", label: "Nachrichten", icon: SpMessageSquare },
    { href: "/admin/website", label: "Webseite", icon: SpMonitor },
    { href: "/admin/medien", label: "Medien", icon: SpImage },
    { href: "/admin/partner", label: "Partner & Produkte", icon: SpTag },
  ];

  const secondaryNav: NavItem[] = [{ href: "/admin/einstellungen", label: "Einstellungen", icon: SpSettings, adminOnly: true }];

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/trainer") return pathname === "/trainer";
    return pathname.startsWith(href);
  }

  function renderItem(item: NavItem, key: string) {
    if (item.adminOnly && profile.role !== "admin") return null;
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={key}
        href={item.href}
        onClick={onClose}
        className={`flex items-center justify-between gap-2 rounded-sp-sm px-3 py-2.5 text-sm transition-colors ${
          active
            ? "border border-sp-red-border bg-sp-red-soft font-medium text-sp-red"
            : "border border-transparent text-sp-text-secondary hover:bg-white/[0.03] hover:text-sp-text"
        }`}
        aria-current={active ? "page" : undefined}
      >
        <span className="flex items-center gap-2.5">
          <Icon size={21} strokeWidth={1.8} />
          {item.label}
        </span>
        {item.badge ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sp-red px-1.5 text-xs font-semibold text-sp-text">
            {item.badge}
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <>
      {open ? <div className="fixed inset-0 z-40 bg-sp-bg/70 lg:hidden" onClick={onClose} aria-hidden="true" /> : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] shrink-0 flex-col border-r border-sp-border bg-sp-sidebar transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[260px] lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sp-border px-5">
          <div>
            <Image src="/logo/sportpark-pollack-logo-white.webp" alt="Sportpark Pollack" width={150} height={52} className="h-7 w-auto" />
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sp-text-muted">Adminbereich</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-sp-text-secondary hover:text-sp-text lg:hidden" aria-label="Menü schließen">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Admin-Navigation">
          {primaryNav.map((item, i) => renderItem(item, `${item.href}-${item.label}-${i}`))}
        </nav>

        <div className="space-y-0.5 border-t border-sp-border px-3 py-3">
          {secondaryNav.map((item, i) => renderItem(item, `${item.href}-${item.label}-${i}`))}
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-sp-sm px-3 py-2.5 text-left text-sm text-sp-text-secondary hover:bg-white/[0.03] hover:text-sp-text"
            >
              <SpLogout size={21} strokeWidth={1.8} />
              Abmelden
            </button>
          </form>
        </div>

        <div className="border-t border-sp-border px-5 py-4">
          <p className="text-[11px] font-semibold uppercase leading-tight tracking-[0.16em] text-sp-text-muted">
            Stärker
            <br />
            als gestern
          </p>
          <span className="mt-2 block h-[2px] w-8 bg-sp-red" />
        </div>
      </aside>
    </>
  );
}
