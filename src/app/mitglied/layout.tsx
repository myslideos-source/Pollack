import type { Metadata, Viewport } from "next";
import { requireMember } from "@/lib/auth";
import { MemberShell } from "@/components/member/MemberShell";
import { loadUnreadMessageCount } from "@/lib/member/data";

export const metadata: Metadata = {
  title: { template: "%s · Mitgliederportal", default: "Mitgliederportal" },
  robots: { index: false, follow: false },
  manifest: "/mitglied/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Sportpark Pollack" },
};

export const viewport: Viewport = {
  themeColor: "#050606",
  viewportFit: "cover",
};

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireMember();
  const unreadCount = await loadUnreadMessageCount(profile.id);
  return (
    <MemberShell fullName={profile.full_name} unreadCount={unreadCount}>
      {children}
    </MemberShell>
  );
}
