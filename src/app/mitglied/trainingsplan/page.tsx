import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Dumbbell } from "lucide-react";
import { requireMember } from "@/lib/auth";
import { loadActivePlan, loadPendingPlan, weekdayLabel } from "@/lib/member/data";
import { RequestChangeForm } from "./RequestChangeForm";

export const metadata: Metadata = { title: "Trainingsplan" };

export default async function TrainingsplanPage() {
  const profile = await requireMember();
  const [plan, pendingPlan] = await Promise.all([loadActivePlan(profile.id), loadPendingPlan(profile.id)]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Dein Trainingsplan</h1>

      {pendingPlan ? (
        <div className="mt-4 rounded-2xl border border-sand/30 bg-sand/10 p-4 text-sm text-sand">
          {pendingPlan.status === "change_requested"
            ? "Deine Änderungsanfrage liegt bei deinem Trainer — dein aktueller Plan gilt bis dahin weiter."
            : "Ein neuer Planentwurf wartet auf die Freigabe durch dein Trainerteam."}
        </div>
      ) : null}

      {!plan ? (
        <p className="mt-6 text-paper/60">Für dich liegt aktuell kein aktiver Trainingsplan vor.</p>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-4">
            {plan.days.map((day) => (
              <div key={day.id} className="rounded-2xl border border-paper/10 bg-anthracite p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg text-paper">
                    {weekdayLabel(day.weekday)} – {day.title}
                  </h2>
                  <Link
                    href={`/mitglied/training?tag=${day.id}`}
                    className="flex items-center gap-1 text-xs font-medium text-red hover:text-red-dark"
                  >
                    Starten <ChevronRight size={13} />
                  </Link>
                </div>
                <ul className="mt-3 divide-y divide-paper/10">
                  {day.exercises.map((ex) => (
                    <li key={ex.id} className="flex items-start gap-3 py-2.5">
                      <Dumbbell size={15} className="mt-0.5 shrink-0 text-paper/30" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-paper">{ex.name}</p>
                        <p className="text-xs text-paper/50">
                          {ex.sets} × {ex.reps}
                          {ex.targetWeightKg ? ` · ${ex.targetWeightKg} kg` : ""} · {ex.restSeconds}s Pause
                        </p>
                        {ex.trainerNote ? <p className="mt-1 text-xs text-paper/40">{ex.trainerNote}</p> : null}
                        {ex.alternativeExerciseName ? (
                          <p className="mt-1 text-xs text-paper/40">Alternative: {ex.alternativeExerciseName}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-paper/10 bg-anthracite p-5">
            <h2 className="font-display text-lg text-paper">Planänderung anfragen</h2>
            <p className="mt-1 text-sm text-paper/60">
              Passt eine Übung nicht mehr oder möchtest du etwas anpassen? Schreib deinem Trainer kurz, was du dir
              wünschst.
            </p>
            <RequestChangeForm planId={plan.id} disabled={Boolean(pendingPlan)} />
          </div>
        </>
      )}

      <p className="mt-8 text-xs text-paper/40">
        Die Inhalte und Trainingspläne ersetzen keine medizinische Beratung. Bei akuten Beschwerden oder
        gesundheitlichen Einschränkungen ist vor dem Training ärztlicher Rat einzuholen.
      </p>
    </div>
  );
}
