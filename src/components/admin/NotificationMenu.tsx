"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Inbox } from "lucide-react";

export type AdminNotification = {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  href: string;
};

const SEEN_AT_KEY = "sportpark_admin_notif_seen_at";

function readSeenAt(): number {
  try {
    const raw = window.localStorage.getItem(SEEN_AT_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function writeSeenNow(): void {
  try {
    window.localStorage.setItem(SEEN_AT_KEY, String(Date.now()));
  } catch {
    // Storage unavailable — the badge just won't remember state across reloads.
  }
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  return `vor ${days} Tag${days === 1 ? "" : "en"}`;
}

export function NotificationMenu({ notifications }: { notifications: AdminNotification[] }) {
  const [open, setOpen] = useState(false);
  const [seenAt, setSeenAt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function loadSeenAt() {
      setSeenAt(readSeenAt());
    }
    loadSeenAt();
  }, []);

  useEffect(() => {
    if (!open) return;
    function markSeenNow() {
      writeSeenNow();
      setSeenAt(Date.now());
    }
    markSeenNow();
    document.documentElement.style.overflow = "hidden";
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const unreadCount = notifications.filter((n) => new Date(n.createdAt).getTime() > seenAt).length;

  const list = (
    <>
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
          <Inbox size={22} className="text-admin-text-muted" />
          <p className="text-sm text-admin-text-secondary">Keine Benachrichtigungen</p>
        </div>
      ) : (
        <ul className="divide-y divide-admin-divider">
          {notifications.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 px-4 py-3 hover:bg-white/[0.03]"
              >
                <span className="text-sm text-admin-text">{n.title}</span>
                <span className="truncate text-xs text-admin-text-muted">{n.subtitle}</span>
                <span className="mt-0.5 text-[11px] text-admin-text-muted">{relativeTime(n.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Benachrichtigungen"
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-admin-text-secondary transition-colors hover:text-admin-text"
      >
        <Bell size={20} strokeWidth={1.8} />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-admin-red ring-2 ring-admin-bg" aria-hidden="true" />
        ) : null}
      </button>

      {open ? (
        <>
          {/* Desktop: small dropdown panel under the bell */}
          <div
            role="dialog"
            aria-label="Benachrichtigungen"
            className="animate-admin-card-in absolute right-0 top-12 z-50 hidden w-80 overflow-hidden rounded-admin border border-admin-border bg-admin-card-elevated shadow-admin lg:block motion-reduce:animate-none"
          >
            <div className="border-b border-admin-divider px-4 py-3">
              <h2 className="text-sm font-medium text-admin-text">Benachrichtigungen</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">{list}</div>
          </div>

          {/* Mobile: bottom sheet */}
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />
            <div
              role="dialog"
              aria-label="Benachrichtigungen"
              className="animate-admin-card-in absolute inset-x-0 bottom-0 max-h-[70vh] overflow-hidden rounded-t-admin-large border-t border-admin-border bg-admin-card-elevated pb-[max(env(safe-area-inset-bottom),16px)] shadow-admin motion-reduce:animate-none"
            >
              <div className="flex items-center justify-between border-b border-admin-divider px-4 py-3.5">
                <h2 className="text-sm font-medium text-admin-text">Benachrichtigungen</h2>
                <button type="button" onClick={() => setOpen(false)} className="text-sm text-admin-text-secondary">
                  Schließen
                </button>
              </div>
              <div className="max-h-[55vh] overflow-y-auto">{list}</div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
