"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { primaryNav, contact } from "@/content/site";
import { OpenStatusBadge } from "@/components/shared/OpenStatusBadge";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(247,245,240,0.08)]" : "bg-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only-focusable fixed left-4 top-4 z-[60] rounded bg-red px-4 py-2 font-medium text-paper"
      >
        Zum Inhalt springen
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Sportpark Pollack – Startseite">
          <Image
            src="/logo/sportpark-pollack-logo-white.webp"
            alt="Sportpark Pollack"
            width={220}
            height={76}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Hauptnavigation">
          {primaryNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-2.5 py-2 font-display text-[13px] uppercase tracking-normal transition-colors 2xl:px-3 2xl:text-sm 2xl:tracking-wide ${
                  active ? "text-red" : "text-paper/80 hover:text-paper"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <OpenStatusBadge />
          <Link
            href="/kontakt#probetraining"
            className="rounded-full bg-red px-5 py-2.5 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:bg-red-dark"
          >
            Probetraining
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper xl:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[64px] z-40 flex flex-col bg-ink px-6 py-8 xl:hidden"
        >
          <nav className="flex flex-1 flex-col gap-1" aria-label="Mobile Hauptnavigation">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-paper/10 py-4 font-display text-2xl uppercase tracking-wide text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <OpenStatusBadge className="self-start" />
            <div className="grid grid-cols-2 gap-3">
              <a
                href={contact.phoneHref}
                className="flex items-center justify-center gap-2 rounded-full border border-paper/25 py-3 font-display text-sm uppercase tracking-wide text-paper"
              >
                <Phone size={16} /> Anrufen
              </a>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-moss py-3 font-display text-sm uppercase tracking-wide text-ink"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
            <Link
              href="/kontakt#probetraining"
              className="rounded-full bg-red py-3 text-center font-display text-sm uppercase tracking-wide text-paper"
            >
              Probetraining starten
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
