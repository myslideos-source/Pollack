"use client";

import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/auth";
import { NotificationMenu, type AdminNotification } from "@/components/admin/NotificationMenu";

/** Compact header shown only below 768px — the persistent desktop sidebar and its header
 *  (AdminTopbar) are replaced entirely by this + AdminBottomNavigation on small screens. */
export function AdminMobileHeader({ profile, notifications }: { profile: Profile; notifications: AdminNotification[] }) {
  return (
    <header
      className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-admin-border bg-admin-bg px-4 min-[768px]:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Link href="/admin" className="flex items-center gap-2.5">
        <Image src="/logo/sportpark-pollack-logo-white.webp" alt="Sportpark Pollack" width={120} height={41} className="h-6 w-auto" priority />
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-admin-text-muted">Admin</span>
      </Link>

      <div className="flex items-center gap-1.5">
        <NotificationMenu notifications={notifications} />
        <Link href="/admin/einstellungen" aria-label="Profil" className="flex h-9 w-9 items-center justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-card-elevated text-xs font-semibold text-admin-text">
            {profile.full_name.slice(0, 1).toUpperCase()}
          </span>
        </Link>
      </div>
    </header>
  );
}
