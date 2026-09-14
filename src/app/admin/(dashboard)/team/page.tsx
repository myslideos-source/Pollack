import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TeamManager } from "./TeamManager";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: members } = await supabase.from("team_members").select("*").order("sort_order");

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Team</h1>
        <p className="text-sm text-paper/60">
          Trainerinnen und Trainer verwalten, inklusive des Inhaber-Profils von Jürgen Pollack.
        </p>
      </div>
      <div className="mt-6">
        <TeamManager members={members ?? []} />
      </div>
    </div>
  );
}
