"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ChevronRight, MessageCircle, SkipForward, Dumbbell, Plus, Award } from "lucide-react";
import type { PlanDay } from "@/lib/member/data";
import { finishWorkoutAction, type FinishWorkoutInput, type Achievement } from "@/app/mitglied/actions";

type LoggedSet = {
  planExerciseId: string;
  setNumber: number;
  weightKg: number | null;
  reps: number | null;
  perceivedExertion: number | null;
  note: string | null;
  painFlag: boolean;
};

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ActiveWorkout({
  planId,
  day,
  lastSets,
  otherDays,
}: {
  planId: string;
  day: PlanDay;
  lastSets: Record<string, { weightKg: number | null; reps: number | null }>;
  otherDays: { id: string; label: string }[];
}) {
  const router = useRouter();
  const startedAt = useRef(new Date().toISOString()).current;
  const startedAtMs = useRef(Date.now()).current;

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [logged, setLogged] = useState<LoggedSet[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [repsInput, setRepsInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [rpe, setRpe] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [pain, setPain] = useState(false);
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const [mode, setMode] = useState<"workout" | "summary" | "saved">("workout");
  const [feelingNote, setFeelingNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const exercise = day.exercises[exerciseIndex] ?? null;
  const draftKey = `sportpark-mitglied-workout-draft-${day.id}`;

  // Restores an in-progress workout after a brief connection drop or accidental reload — a
  // genuine one-time read from an external system (localStorage), so it belongs in an effect
  // rather than during render.
  useEffect(() => {
    function restore() {
      try {
        const raw = localStorage.getItem(draftKey);
        if (!raw) return;
        const draft = JSON.parse(raw) as { logged?: LoggedSet[]; exerciseIndex?: number };
        if (draft.logged?.length) setLogged(draft.logged);
        if (typeof draft.exerciseIndex === "number") setExerciseIndex(draft.exerciseIndex);
      } catch {
        // Corrupt or inaccessible draft — safe to ignore, the workout just starts fresh.
      }
    }
    restore();
    // Only ever restore once, right after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({ logged, exerciseIndex }));
    } catch {
      // Private browsing / storage full — the workout still works, it just won't survive a reload.
    }
  }, [draftKey, logged, exerciseIndex]);

  // Pre-fill the weight/reps inputs whenever the current exercise changes — a plain synchronous
  // computation (not a subscription to anything external), so it's resolved during render
  // rather than in an effect, following this codebase's usual pattern for this situation.
  const [lastExerciseId, setLastExerciseId] = useState<string | null>(null);
  if (exercise && exercise.id !== lastExerciseId) {
    setLastExerciseId(exercise.id);
    const last = lastSets[exercise.id];
    setWeightInput(
      exercise.targetWeightKg != null ? String(exercise.targetWeightKg) : last?.weightKg != null ? String(last.weightKg) : "",
    );
    const targetReps = exercise.reps.match(/\d+/)?.[0];
    setRepsInput(last?.reps != null ? String(last.reps) : targetReps ?? "");
    setSetIndex(0);
  }

  useEffect(() => {
    if (restRemaining === null || restRemaining <= 0) return;
    const t = setTimeout(() => setRestRemaining((r) => (r !== null && r > 1 ? r - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [restRemaining]);

  const totalVolumeKg = useMemo(
    () => logged.reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.reps ?? 0), 0),
    [logged],
  );

  if (!exercise) {
    return null;
  }

  function completeSet() {
    if (!exercise) return;
    const entry: LoggedSet = {
      planExerciseId: exercise.id,
      setNumber: setIndex + 1,
      weightKg: weightInput ? Number(weightInput) : null,
      reps: repsInput ? Number(repsInput) : null,
      perceivedExertion: rpe,
      note: note.trim() || null,
      painFlag: pain,
    };
    setLogged((prev) => [...prev, entry]);
    setRpe(null);
    setNote("");
    setPain(false);
    setShowDetails(false);

    const isLastSet = setIndex + 1 >= exercise.sets;
    if (isLastSet) {
      goToNextExercise();
    } else {
      setSetIndex((i) => i + 1);
      setRestRemaining(exercise.restSeconds);
    }
  }

  function goToNextExercise() {
    if (exerciseIndex + 1 < day.exercises.length) {
      setExerciseIndex((i) => i + 1);
      setRestRemaining(null);
    } else {
      setMode("summary");
    }
  }

  function skipExercise() {
    goToNextExercise();
  }

  async function saveWorkout() {
    setSaving(true);
    setSaveError(null);
    const durationMin = Math.max(1, Math.round((Date.now() - startedAtMs) / 60000));
    const input: FinishWorkoutInput = {
      planId,
      planDayId: day.id,
      startedAt,
      durationMin,
      feelingNote: feelingNote.trim() || null,
      sets: logged,
    };
    const res = await finishWorkoutAction(input);
    setSaving(false);
    if (res.error) {
      setSaveError(res.error);
      return;
    }
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // Nothing to clean up if storage isn't available.
    }
    setAchievements(res.achievements ?? []);
    setMode("saved");
  }

  if (mode === "saved") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-moss/15 text-moss">
          <Dumbbell size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-paper">Training gespeichert</h1>
        <p className="mt-2 text-paper/60">Starke Leistung — weiter so!</p>

        {achievements.length > 0 ? (
          <div className="mt-6 flex w-full flex-col gap-2.5">
            {achievements.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-2xl border border-red/25 bg-red/10 p-4 text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red/20 text-red">
                  <Award size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm text-paper">{a.title}</span>
                  <span className="block text-xs text-paper/60">{a.description}</span>
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <Link
          href="/mitglied"
          className="mt-6 rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper hover:bg-red-dark"
        >
          Zurück zum Start
        </Link>
      </div>
    );
  }

  if (mode === "summary") {
    const durationMin = Math.max(1, Math.round((Date.now() - startedAtMs) / 60000));
    const exercisesDone = new Set(logged.map((s) => s.planExerciseId)).size;
    return (
      <div className="mx-auto max-w-md px-4 py-8 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-paper">Training abgeschlossen</h1>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
            <p className="font-display text-xl font-bold text-paper">{durationMin}</p>
            <p className="text-[11px] text-paper/50">Minuten</p>
          </div>
          <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
            <p className="font-display text-xl font-bold text-paper">{exercisesDone}</p>
            <p className="text-[11px] text-paper/50">Übungen</p>
          </div>
          <div className="rounded-2xl border border-paper/10 bg-anthracite p-4 text-center">
            <p className="font-display text-xl font-bold text-paper">{Math.round(totalVolumeKg).toLocaleString("de-DE")}</p>
            <p className="text-[11px] text-paper/50">kg bewegt</p>
          </div>
        </div>
        <label className="mt-6 block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50">
            Persönliche Rückmeldung (optional)
          </span>
          <textarea
            value={feelingNote}
            onChange={(e) => setFeelingNote(e.target.value)}
            rows={3}
            placeholder="Wie hat sich das Training angefühlt?"
            className="w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-paper placeholder:text-paper/30 outline-none focus:border-red focus:ring-1 focus:ring-red"
          />
        </label>
        {saveError ? <p className="mt-3 text-sm text-red">{saveError}</p> : null}
        <button
          type="button"
          onClick={saveWorkout}
          disabled={saving}
          className="mt-5 w-full rounded-full bg-red px-6 py-3.5 font-display text-sm uppercase tracking-wide text-paper hover:bg-red-dark disabled:opacity-60"
        >
          {saving ? "Wird gespeichert …" : "Training speichern"}
        </button>
      </div>
    );
  }

  const nextExercise = day.exercises[exerciseIndex + 1] ?? null;

  return (
    <div className="mx-auto max-w-md pb-10">
      <div className="flex items-center justify-between px-4 pt-4 sm:px-6">
        <button type="button" onClick={() => router.push("/mitglied")} aria-label="Training verlassen" className="text-paper/60 hover:text-paper">
          <X size={22} />
        </button>
        <span className="font-display text-xs uppercase tracking-[0.2em] text-paper/50">Aktives Training</span>
        <div className="relative">
          <button type="button" onClick={() => setMenuOpen((v) => !v)} className="px-1 text-paper/60 hover:text-paper">
            •••
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-8 z-10 w-52 rounded-xl border border-paper/10 bg-anthracite p-1.5 shadow-xl">
              {otherDays.map((d) => (
                <Link
                  key={d.id}
                  href={`/mitglied/training?tag=${d.id}`}
                  className="block rounded-lg px-3 py-2 text-left text-sm text-paper/80 hover:bg-paper/5 hover:text-paper"
                >
                  {d.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setMode("summary")}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-paper/80 hover:bg-paper/5 hover:text-paper"
              >
                Training beenden
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 px-4 sm:px-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper/10">
          <div
            className="h-full rounded-full bg-red transition-all"
            style={{ width: `${((exerciseIndex + (setIndex + 1) / exercise.sets) / day.exercises.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <p className="mt-4 text-xs uppercase tracking-wide text-paper/50">
          Übung {exerciseIndex + 1} von {day.exercises.length}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-paper">{exercise.name}</h1>

        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-paper/10 bg-anthracite">
          <div className="flex h-full w-full items-center justify-center text-paper/25">
            <Dumbbell size={40} />
          </div>
        </div>

        {exercise.description ? <p className="mt-3 text-sm text-paper/60">{exercise.description}</p> : null}
        {exercise.trainerNote ? (
          <p className="mt-2 rounded-xl border border-red/20 bg-red/5 p-3 text-sm text-paper/80">
            <span className="font-medium text-red">Trainerhinweis: </span>
            {exercise.trainerNote}
          </p>
        ) : null}

        <p className="mt-5 text-sm text-paper/60">
          Satz {setIndex + 1} von {exercise.sets}
        </p>

        <div className="mt-2 grid grid-cols-3 gap-3">
          <label className="rounded-xl border border-paper/15 bg-anthracite p-3 text-center">
            <input
              type="number"
              inputMode="decimal"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-transparent text-center font-display text-2xl font-bold text-paper outline-none"
            />
            <span className="mt-1 block text-[11px] uppercase tracking-wide text-paper/50">kg</span>
          </label>
          <label className="rounded-xl border border-paper/15 bg-anthracite p-3 text-center">
            <input
              type="number"
              inputMode="numeric"
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
              className="w-full bg-transparent text-center font-display text-2xl font-bold text-paper outline-none"
            />
            <span className="mt-1 block text-[11px] uppercase tracking-wide text-paper/50">Wdh.</span>
          </label>
          <div className="rounded-xl border border-paper/15 bg-anthracite p-3 text-center">
            <p className="font-display text-2xl font-bold text-paper">{exercise.restSeconds}</p>
            <span className="mt-1 block text-[11px] uppercase tracking-wide text-paper/50">Sek.</span>
          </div>
        </div>

        {lastSets[exercise.id]?.weightKg != null ? (
          <p className="mt-2 text-xs text-paper/40">
            Letzte Einheit: {lastSets[exercise.id].weightKg} kg × {lastSets[exercise.id].reps} Wdh.
          </p>
        ) : null}

        {restRemaining !== null ? (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-sand/30 bg-sand/10 px-4 py-3">
            <span className="text-sm text-sand">Pause</span>
            <span className="font-display text-lg font-bold text-sand">{formatSeconds(restRemaining)}</span>
            <button type="button" onClick={() => setRestRemaining(null)} className="text-xs text-sand underline underline-offset-2">
              überspringen
            </button>
          </div>
        ) : null}

        {showDetails ? (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-paper/10 bg-anthracite p-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50">
                Belastungsgefühl (1–10)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRpe(n)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                      rpe === n ? "bg-red text-paper" : "bg-ink text-paper/60 hover:text-paper"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <label>
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50">Notiz</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-red"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-paper/80">
              <input type="checkbox" checked={pain} onChange={(e) => setPain(e.target.checked)} className="accent-red" />
              Beschwerden bei dieser Übung
            </label>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="mt-3 flex items-center gap-1 text-xs text-paper/40 hover:text-paper/70"
          >
            <Plus size={13} /> Belastungsgefühl / Notiz hinzufügen
          </button>
        )}

        <button
          type="button"
          onClick={completeSet}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-red px-6 py-4 font-display text-sm uppercase tracking-wide text-paper hover:bg-red-dark"
        >
          Satz erledigt <ChevronRight size={16} />
        </button>

        <div className="mt-3 flex items-center justify-between text-sm">
          <button type="button" onClick={skipExercise} className="flex items-center gap-1.5 text-paper/50 hover:text-paper">
            <SkipForward size={14} /> Übung überspringen
          </button>
          <Link href="/mitglied/nachrichten" className="flex items-center gap-1.5 text-paper/50 hover:text-paper">
            <MessageCircle size={14} /> Trainer kontaktieren
          </Link>
        </div>

        {nextExercise ? (
          <p className="mt-6 border-t border-paper/10 pt-4 text-xs text-paper/40">
            Als Nächstes · {nextExercise.name}
          </p>
        ) : null}
      </div>
    </div>
  );
}
