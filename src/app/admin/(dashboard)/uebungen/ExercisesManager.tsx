"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { saveExerciseAction, deleteExerciseAction } from "@/app/admin/actions/exercises";

type Exercise = {
  id: string;
  name: string;
  muscle_group: string | null;
  description: string | null;
  default_sets: number;
  default_reps: string;
  image_media_id: string | null;
};

function ExerciseForm({ exercise, onDone }: { exercise?: Exercise; onDone: () => void }) {
  const [imageMediaId, setImageMediaId] = useState<string | null>(exercise?.image_media_id ?? null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    if (exercise) formData.set("id", exercise.id);
    if (imageMediaId) formData.set("imageMediaId", imageMediaId);
    startTransition(async () => {
      const res = await saveExerciseAction(formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form action={submit} className="space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div>
        <label className="mb-1 block text-xs text-paper/50">Bild</label>
        <MediaPicker value={imageMediaId} onChange={setImageMediaId} fileType="image" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Name</label>
          <input name="name" defaultValue={exercise?.name} required className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Muskelgruppe</label>
          <input name="muscleGroup" defaultValue={exercise?.muscle_group ?? ""} className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Standard-Sätze</label>
          <input name="defaultSets" type="number" min={1} max={10} defaultValue={exercise?.default_sets ?? 3} required className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Standard-Wiederholungen</label>
          <input name="defaultReps" defaultValue={exercise?.default_reps ?? "8-12"} required className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Ausführungserklärung</label>
        <textarea name="description" defaultValue={exercise?.description ?? ""} rows={2} className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper" />
      </div>
      {error ? <p className="text-xs text-red">{error}</p> : null}
      <div className="flex items-center gap-2">
        <button type="submit" disabled={isPending} className="flex items-center gap-1 rounded-full bg-red px-4 py-2 text-xs font-medium text-paper hover:bg-red-dark disabled:opacity-60">
          <Check size={13} /> {isPending ? "Speichert …" : "Speichern"}
        </button>
        <button type="button" onClick={onDone} className="flex items-center gap-1 text-xs text-paper/50 hover:text-paper">
          <X size={13} /> Abbrechen
        </button>
      </div>
    </form>
  );
}

export function ExercisesManager({ exercises }: { exercises: Exercise[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      const res = await deleteExerciseAction(fd);
      if (res.error) setDeleteError(res.error);
      setConfirmDeleteId(null);
    });
  }

  return (
    <div>
      {creating ? (
        <div className="mb-4">
          <ExerciseForm onDone={() => setCreating(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="mb-4 flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-medium text-paper hover:bg-red-dark"
        >
          <Plus size={15} /> Übung anlegen
        </button>
      )}

      {deleteError ? <p className="mb-3 text-sm text-red">{deleteError}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {exercises.map((ex) =>
          editingId === ex.id ? (
            <div key={ex.id} className="sm:col-span-2">
              <ExerciseForm exercise={ex} onDone={() => setEditingId(null)} />
            </div>
          ) : (
            <div key={ex.id} className="rounded-2xl border border-paper/10 bg-anthracite p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-paper">{ex.name}</p>
                  <p className="mt-0.5 text-xs text-paper/40">
                    {ex.muscle_group ?? "–"} · {ex.default_sets} × {ex.default_reps}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingId(ex.id)} className="text-paper/50 hover:text-paper">
                    <Pencil size={14} />
                  </button>
                  {confirmDeleteId === ex.id ? (
                    <button type="button" disabled={isPending} onClick={() => handleDelete(ex.id)} className="text-xs text-red hover:text-red-dark">
                      Wirklich?
                    </button>
                  ) : (
                    <button type="button" onClick={() => setConfirmDeleteId(ex.id)} className="text-paper/50 hover:text-red">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
