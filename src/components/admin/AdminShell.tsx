"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";
import { AdminBottomNavigation } from "@/components/admin/AdminBottomNavigation";
import type { Profile } from "@/lib/auth";
import type { AdminNotification } from "@/components/admin/NotificationMenu";

/**
 * Owns the sidebar-open state shared between AdminTopbar (the hamburger trigger) and AdminSidebar
 * (the off-canvas drawer below 1200px) — the two are server-rendered siblings otherwise, so this
 * is the one client boundary needed to coordinate them. Below 768px, AdminMobileHeader and
 * AdminBottomNavigation take over entirely and the sidebar/topbar never surface.
 */
export function AdminShell({
  profile,
  draftCount,
  notifications,
  unreadMessageCount,
  children,
}: {
  profile: Profile;
  draftCount: number;
  notifications: AdminNotification[];
  unreadMessageCount: number;
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
    <div className="admin-scope flex h-screen overflow-hidden bg-admin-bg">
      <div className="hidden min-[768px]:block">
        <AdminSidebar profile={profile} unreadMessageCount={unreadMessageCount} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminMobileHeader profile={profile} notifications={notifications} />
        <div className="hidden min-[768px]:block">
          <AdminTopbar profile={profile} draftCount={draftCount} notifications={notifications} onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-admin-bg p-4 pb-24 sm:p-6 min-[768px]:pb-6">{children}</main>
        <AdminBottomNavigation />
      </div>
    </div>
  );
}
