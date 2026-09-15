"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  CalendarClock,
  FileEdit,
  Images,
  Tag,
  Clock,
  Handshake,
  Users,
  Settings,
  UserCog,
  History,
  X,
  Dumbbell,
  ClipboardList,
} from "lucide-react";
import type { Profile } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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

  const navItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/anfragen", label: "Anfragen", icon: Inbox, badge: inboxCount },
    { href: "/admin/termine", label: "Termine", icon: CalendarClock },
    { href: "/admin/website", label: "Website bearbeiten", icon: FileEdit },
    { href: "/admin/medien", label: "Bilder & Videos", icon: Images },
    { href: "/admin/angebote", label: "Angebote & Preise", icon: Tag },
    { href: "/admin/oeffnungszeiten", label: "Öffnungszeiten", icon: Clock },
    { href: "/admin/partner", label: "Partner & Produkte", icon: Handshake },
    { href: "/admin/team", label: "Team", icon: Users },
    { href: "/trainer", label: "Mitgliederportal", icon: Dumbbell },
    { href: "/admin/uebungen", label: "Übungen", icon: ClipboardList },
    { href: "/admin/einstellungen", label: "Einstellungen", icon: Settings, adminOnly: true },
    { href: "/admin/benutzer", label: "Benutzer", icon: UserCog, adminOnly: true },
    { href: "/admin/verlauf", label: "Änderungsverlauf", icon: History },
  ];

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-ink/70 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] shrink-0 flex-col border-r border-paper/10 bg-anthracite transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-paper/10 px-5">
          <Image
            src="/logo/sportpark-pollack-logo-white.webp"
            alt="Sportpark Pollack"
            width={180}
            height={62}
            className="h-8 w-auto"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-paper/60 hover:text-paper lg:hidden"
            aria-label="Menü schließen"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Admin-Navigation">
          {navItems.map((item) => {
            if (item.adminOnly && profile.role !== "admin") return null;
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-red/15 text-red" : "text-paper/70 hover:bg-paper/5 hover:text-paper"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={18} />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1.5 text-xs font-semibold text-paper">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-paper/10 px-5 py-4 text-xs text-paper/40">
          <p>Sportpark Pollack</p>
          <p>In Bewegung. Seit 1987.</p>
        </div>
      </aside>
    </>
  );
}
