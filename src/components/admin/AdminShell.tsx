"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { manrope, barlowCondensed } from "@/lib/fonts";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import type { Profile } from "@/lib/auth";

/**
 * Owns the mobile sidebar-open state shared between AdminTopbar (the hamburger trigger) and
 * AdminSidebar (the off-canvas drawer below the `lg` breakpoint) — the two are server-rendered
 * siblings otherwise, so this is the one client boundary needed to coordinate them.
 */
export function AdminShell({
  profile,
  inboxCount,
  draftCount,
  children,
}: {
  profile: Profile;
  inboxCount: number;
  draftCount: number;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setSidebarOpen(false);
  }

  return (
    <div className={`${manrope.variable} ${barlowCondensed.variable} sp-scope flex h-screen overflow-hidden bg-sp-bg`}>
      <AdminSidebar profile={profile} inboxCount={inboxCount} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar profile={profile} inboxCount={inboxCount} draftCount={draftCount} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-sp-bg p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
