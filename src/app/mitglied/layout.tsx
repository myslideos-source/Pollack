import type { Metadata, Viewport } from "next";
import { requireMember } from "@/lib/auth";
import { MemberShell } from "@/components/member/MemberShell";

export const metadata: Metadata = {
  title: { template: "%s · Mitgliederportal", default: "Mitgliederportal" },
  robots: { index: false, follow: false },
  manifest: "/mitglied/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Sportpark Pollack" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  viewportFit: "cover",
};

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireMember();
  return <MemberShell fullName={profile.full_name}>{children}</MemberShell>;
}
