import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "Sportpark Verwaltung", template: "%s – Sportpark Verwaltung" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
