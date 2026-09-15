import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ExercisesManager } from "./ExercisesManager";

export const metadata: Metadata = { title: "Übungen" };

export default async function UebungenPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name, muscle_group, description, default_sets, default_reps, image_media_id")
    .order("name");

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-semibold text-paper">Übungen</h1>
      <p className="text-sm text-paper/60">
        Die gemeinsame Übungsbibliothek für Trainingspläne im Mitgliederportal.
      </p>
      <div className="mt-6">
        <ExercisesManager exercises={exercises ?? []} />
      </div>
    </div>
  );
}
