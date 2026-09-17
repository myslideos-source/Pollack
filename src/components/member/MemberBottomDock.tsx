"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Dumbbell, LayoutGrid, CreditCard, type LucideIcon } from "lucide-react";

type DockLink = { href: string; label: string; icon: LucideIcon };

const LEFT_ITEMS: DockLink[] = [
  { href: "/mitglied", label: "Start", icon: Home },
  { href: "/mitglied/trainingsplan", label: "Plan", icon: ClipboardList },
];

const RIGHT_ITEMS: DockLink[] = [
  { href: "/mitglied/training", label: "Training", icon: Dumbbell },
  { href: "/mitglied/menu", label: "Mehr", icon: LayoutGrid },
];

function DockItem({ item, active }: { item: DockLink; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[52px] min-w-[52px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
        active ? "text-sp-red" : "text-sp-text-muted hover:text-sp-text-secondary"
      }`}
    >
      <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
      {item.label}
      <span className={`h-[2px] w-3 rounded-full transition-colors ${active ? "bg-sp-red" : "bg-transparent"}`} aria-hidden="true" />
    </Link>
  );
}

/**
 * Floating mobile-only dock — replaces the old full-width bottom bar in MemberShell. Desktop
 * navigation (the header's own <nav>) is untouched; this component only ever renders below the
 * lg breakpoint. The center "Karte" action always opens the existing /mitglied/mitgliedskarte
 * page directly — it is a permanent primary action, not a fifth peer tab, so it stays red
 * regardless of the current route and only gains the extra ring when that route is active.
 */
export function MemberBottomDock() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/mitglied") return pathname === "/mitglied";
    return pathname.startsWith(href);
  }

  const cardOpen = pathname.startsWith("/mitglied/mitgliedskarte");

  return (
    <nav
      className="fixed inset-x-[18px] z-40 lg:hidden"
      style={{ bottom: "calc(10px + env(safe-area-inset-bottom))" }}
      aria-label="Portal-Navigation (mobil)"
    >
      <div className="relative flex min-h-[78px] items-center justify-between rounded-[28px] border border-sp-border bg-[rgba(16,19,18,0.96)] px-2 shadow-[0_20px_45px_rgba(0,0,0,0.42),0_0_28px_rgba(244,58,53,0.07)] backdrop-blur-md">
        {LEFT_ITEMS.map((item) => (
          <DockItem key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <Link
          href="/mitglied/mitgliedskarte"
          aria-label="Mitgliedskarte öffnen"
          aria-current={cardOpen ? "page" : undefined}
          className="relative -mt-9 flex shrink-0 flex-col items-center gap-1.5 motion-reduce:transition-none"
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-sp-red-light to-sp-red-dark text-white shadow-[0_10px_26px_rgba(244,58,53,0.38)] ring-4 ring-[#0a0c0b] transition-transform duration-150 active:scale-[0.96] motion-reduce:transition-none ${
              cardOpen ? "outline outline-2 outline-offset-2 outline-sp-red" : ""
            }`}
          >
            <CreditCard size={26} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className={`text-[11px] font-medium ${cardOpen ? "text-sp-red" : "text-sp-text-muted"}`}>Karte</span>
        </Link>

        {RIGHT_ITEMS.map((item) => (
          <DockItem key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </div>
    </nav>
  );
}
