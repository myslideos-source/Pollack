import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireMember } from "@/lib/auth";
import { loadMemberProfile } from "@/lib/member/data";
import { OnboardingWizard } from "./OnboardingWizard";

export const metadata: Metadata = { title: "Erstanalyse" };

export default async function OnboardingPage() {
  const profile = await requireMember();
  const member = await loadMemberProfile(profile.id);
  if (member?.onboardingCompletedAt) redirect("/mitglied/training");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Willkommen im Sportpark!</h1>
      <p className="mt-2 text-paper/60">
        Ein paar Fragen, damit dein Trainer dir einen passenden Trainingsplan zusammenstellen kann.
      </p>
      <OnboardingWizard />
    </div>
  );
}
