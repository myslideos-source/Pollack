import type { Metadata } from "next";
import { requireTrainerOrAdmin } from "@/lib/auth";
import { TrainerShell } from "@/components/trainer/TrainerShell";

export const metadata: Metadata = {
  title: { template: "%s · Trainerbereich", default: "Trainerbereich" },
  robots: { index: false, follow: false },
};

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireTrainerOrAdmin();
  return (
    <TrainerShell fullName={profile.full_name} isAdmin={profile.role === "admin"}>
      {children}
    </TrainerShell>
  );
}
