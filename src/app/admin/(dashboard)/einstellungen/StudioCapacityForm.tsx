"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { saveStudioCapacityAction } from "@/app/admin/actions/settings";

export function StudioCapacityForm({ capacity }: { capacity: number | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function submit(formData: FormData) {
    startTransition(async () => {
      const res = await saveStudioCapacityAction(formData);
      if (res.error) {
        setError(res.error);
        setSaved(false);
      } else {
        setError(null);
        setSaved(true);
      }
    });
  }

  return (
    <form action={submit} className="max-w-md space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div>
        <label className="mb-1 block text-xs text-paper/50">Maximale Studio-Kapazität</label>
        <input
          name="studioCapacity"
          type="number"
          min={1}
          max={2000}
          defaultValue={capacity ?? ""}
          placeholder="z. B. 120"
          onChange={() => setSaved(false)}
          required
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
        <p className="mt-1 text-xs text-paper/40">Wird im Dashboard für „Live im Studio“ als Auslastung angezeigt.</p>
      </div>
      {error ? <p className="text-sm text-red">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-full bg-red px-5 py-2 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
      >
        {saved ? <Check size={14} /> : null}
        {isPending ? "Speichert …" : saved ? "Gespeichert" : "Speichern"}
      </button>
    </form>
  );
}
