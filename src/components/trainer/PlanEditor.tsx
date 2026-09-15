"use client";

import { useTransition } from "react";
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { ActivePlan } from "@/lib/member/data";
import { updatePlanExerciseAction, swapPlanExerciseAction, approveTrainingPlanAction } from "@/app/trainer/actions";
import { weekdayLabel } from "@/lib/member/weekday";

const inputClass = "w-full rounded-lg border border-paper/15 bg-ink px-2.5 py-1.5 text-sm text-paper outline-none focus:border-red";

function ExerciseRow({
  memberId,
  exercise,
  exerciseCatalog,
}: {
  memberId: string;
  exercise: ActivePlan["days"][number]["exercises"][number];
  exerciseCatalog: { id: string; name: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save(formData: FormData) {
    formData.set("id", exercise.id);
    startTransition(async () => {
      await updatePlanExerciseAction(memberId, formData);
      setSaved(true);
    });
  }

  function swap(exerciseId: string) {
    if (!exerciseId) return;
    const fd = new FormData();
    fd.set("id", exercise.id);
    fd.set("exerciseId", exerciseId);
    startTransition(async () => {
      await swapPlanExerciseAction(memberId, fd);
    });
  }

  return (
    <div className="rounded-xl border border-paper/10 bg-ink p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-paper">{exercise.name}</p>
        <select
          defaultValue=""
          onChange={(e) => swap(e.target.value)}
          className="rounded-lg border border-paper/15 bg-anthracite px-2 py-1 text-xs text-paper/60"
        >
          <option value="">Übung austauschen …</option>
          {exerciseCatalog.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>
      <form action={save} onChange={() => setSaved(false)} className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label className="text-xs text-paper/40">
          Sätze
          <input name="sets" type="number" min={1} max={10} defaultValue={exercise.sets} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-xs text-paper/40">
          Wdh.
          <input name="reps" defaultValue={exercise.reps} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-xs text-paper/40">
          Pause (Sek.)
          <input name="restSeconds" type="number" min={15} max={600} defaultValue={exercise.restSeconds} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-xs text-paper/40">
          Gewicht (kg)
          <input name="targetWeightKg" type="number" step="0.5" defaultValue={exercise.targetWeightKg ?? ""} className={`${inputClass} mt-1`} />
        </label>
        <label className="col-span-2 text-xs text-paper/40 sm:col-span-3">
          Trainerhinweis
          <input name="trainerNote" defaultValue={exercise.trainerNote ?? ""} className={`${inputClass} mt-1`} />
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={isPending} className="rounded-full bg-paper/10 px-3 py-1.5 text-xs text-paper hover:bg-paper/20 disabled:opacity-60">
            {isPending ? "…" : saved ? "Gespeichert" : "Speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function PlanEditor({
  memberId,
  plan,
  exerciseCatalog,
}: {
  memberId: string;
  plan: ActivePlan;
  exerciseCatalog: { id: string; name: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {plan.status !== "active" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sand/30 bg-sand/10 p-3">
          <p className="text-sm text-sand">
            {plan.status === "change_requested" ? "Änderung angefragt" : "Wartet auf Freigabe"} — passe den Plan an und
            gib ihn dann frei.
          </p>
          {approved ? (
            <span className="flex items-center gap-1.5 text-sm text-moss">
              <CheckCircle2 size={15} /> Freigegeben
            </span>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const res = await approveTrainingPlanAction(plan.id, memberId);
                  if (res.error) setError(res.error);
                  else setApproved(true);
                })
              }
              className="rounded-full bg-red px-4 py-2 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
            >
              {isPending ? "…" : "Plan freigeben"}
            </button>
          )}
        </div>
      ) : null}
      {error ? (
        <p className="flex items-center gap-1.5 text-sm text-red">
          <AlertCircle size={14} /> {error}
        </p>
      ) : null}

      {plan.days.map((day) => (
        <div key={day.id} className="rounded-2xl border border-paper/10 bg-anthracite p-4">
          <h3 className="font-display text-sm uppercase tracking-wide text-paper/70">
            {weekdayLabel(day.weekday)} – {day.title}
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {day.exercises.map((ex) => (
              <ExerciseRow key={ex.id} memberId={memberId} exercise={ex} exerciseCatalog={exerciseCatalog} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
