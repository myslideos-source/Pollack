"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { completeOnboardingAction, type OnboardingActionState } from "@/app/mitglied/actions";

const GOALS = [
  "Muskeln aufbauen",
  "Körperfett reduzieren",
  "allgemeine Fitness verbessern",
  "Beweglichkeit verbessern",
  "Rücken stärken",
  "nach einer Trainingspause wieder beginnen",
  "Kraft steigern",
];

const FOCUS_AREAS = ["Oberkörper", "Unterkörper", "Ganzkörper", "Rumpf/Core", "Ausdauer", "Beweglichkeit"];

const inputClass =
  "w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-red focus:ring-1 focus:ring-red";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-paper/50";

const STEPS = ["Ziel", "Angaben", "Training", "Gesundheit", "Bestätigen"] as const;

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState<OnboardingActionState, FormData>(
    completeOnboardingAction,
    null,
  );

  function toggleFocusArea(area: string) {
    setFocusAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
  }

  return (
    <form action={formAction} className="mt-8">
      <div className="flex items-center gap-1.5">
        {STEPS.map((label, i) => (
          <div key={label} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-red" : "bg-paper/10"}`} />
        ))}
      </div>
      <p className="mt-2 text-xs uppercase tracking-wide text-paper/40">
        Schritt {step + 1} von {STEPS.length} — {STEPS[step]}
      </p>

      <div className="mt-6 rounded-2xl border border-paper/10 bg-anthracite p-6">
        {/* Step 0: Ziel */}
        <div hidden={step !== 0} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Was ist dein Trainingsziel?</label>
            <div className="grid gap-2">
              {GOALS.map((g) => (
                <label
                  key={g}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-paper/15 bg-ink px-4 py-3 text-sm text-paper has-[:checked]:border-red has-[:checked]:bg-red/10"
                >
                  <input type="radio" name="goal" value={g} required={step === 0} className="accent-red" />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Angaben */}
        <div hidden={step !== 1} className="flex flex-col gap-4">
          <div>
            <label htmlFor="birthYear" className={labelClass}>Geburtsjahr</label>
            <input id="birthYear" name="birthYear" type="number" min={1930} max={2016} className={inputClass} required={step === 1} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="heightCm" className={labelClass}>Größe (cm)</label>
              <input id="heightCm" name="heightCm" type="number" min={120} max={230} className={inputClass} required={step === 1} />
            </div>
            <div>
              <label htmlFor="weightKg" className={labelClass}>Gewicht (kg)</label>
              <input id="weightKg" name="weightKg" type="number" step="0.1" min={30} max={300} className={inputClass} required={step === 1} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Trainingserfahrung</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "einsteiger", label: "Einsteiger" },
                { value: "fortgeschritten", label: "Fortgeschritten" },
                { value: "erfahren", label: "Erfahren" },
              ].map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-paper/15 bg-ink px-3 py-2.5 text-center text-sm text-paper has-[:checked]:border-red has-[:checked]:bg-red/10"
                >
                  <input type="radio" name="experienceLevel" value={o.value} required={step === 1} className="sr-only" />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Training */}
        <div hidden={step !== 2} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="trainingDaysPerWeek" className={labelClass}>Trainingstage / Woche</label>
              <select id="trainingDaysPerWeek" name="trainingDaysPerWeek" className={inputClass} required={step === 2} defaultValue="3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sessionDurationMin" className={labelClass}>Zeit pro Einheit</label>
              <select id="sessionDurationMin" name="sessionDurationMin" className={inputClass} required={step === 2} defaultValue="45">
                {[30, 45, 60, 90].map((n) => (
                  <option key={n} value={n}>{n} Min.</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Bevorzugte Trainingsbereiche</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FOCUS_AREAS.map((area) => (
                <label
                  key={area}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-paper/15 bg-ink px-3 py-2.5 text-sm text-paper has-[:checked]:border-red has-[:checked]:bg-red/10"
                >
                  <input
                    type="checkbox"
                    name="focusAreas"
                    value={area}
                    checked={focusAreas.includes(area)}
                    onChange={() => toggleFocusArea(area)}
                    className="accent-red"
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Trainingsintensität</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "locker", label: "Locker" },
                { value: "moderat", label: "Moderat" },
                { value: "fordernd", label: "Fordernd" },
              ].map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-paper/15 bg-ink px-3 py-2.5 text-center text-sm text-paper has-[:checked]:border-red has-[:checked]:bg-red/10"
                >
                  <input type="radio" name="intensityPreference" value={o.value} required={step === 2} className="sr-only" />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Gesundheit */}
        <div hidden={step !== 3} className="flex flex-col gap-4">
          <p className="rounded-xl border border-paper/15 bg-ink px-4 py-3 text-xs text-paper/60">
            Die Inhalte und Trainingspläne ersetzen keine medizinische Beratung. Bei akuten Beschwerden oder
            gesundheitlichen Einschränkungen ist vor dem Training ärztlicher Rat einzuholen.
          </p>
          <div>
            <label htmlFor="healthNotes" className={labelClass}>Beschwerden oder Verletzungen (optional)</label>
            <textarea id="healthNotes" name="healthNotes" rows={3} className={inputClass} placeholder="z. B. Rückenprobleme, Knie-OP …" />
          </div>
          <div>
            <label htmlFor="excludedExercises" className={labelClass}>Übungen, die du nicht durchführen kannst (optional)</label>
            <input id="excludedExercises" name="excludedExercises" className={inputClass} placeholder="Mit Komma trennen, z. B. Kniebeugen, Klimmzüge" />
          </div>
          <div>
            <label htmlFor="preferences" className={labelClass}>Persönliche Vorlieben (optional)</label>
            <textarea id="preferences" name="preferences" rows={2} className={inputClass} placeholder="z. B. trainiert gerne früh morgens" />
          </div>
        </div>

        {/* Step 4: Bestätigen */}
        <div hidden={step !== 4} className="flex flex-col gap-4">
          <p className="text-sm text-paper/70">
            Deine Angaben werden an dein Trainerteam übermittelt, das daraus einen individuellen Trainingsplan
            erstellt. Bitte bestätige, dass wir deine Angaben — einschließlich gesundheitsbezogener Daten wie
            Beschwerden oder Verletzungen — zu diesem Zweck speichern dürfen.
          </p>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-paper/15 bg-ink px-4 py-3 text-sm text-paper">
            <input type="checkbox" name="consent" required={step === 4} className="mt-0.5 accent-red" />
            <span>
              Ich willige ein, dass meine Angaben — einschließlich gesundheitsbezogener Angaben — zur Erstellung
              meines Trainingsplans gespeichert und verarbeitet werden. Ich kann diese Einwilligung jederzeit in
              meinem Profil widerrufen. Details in der{" "}
              <Link href="/datenschutz" target="_blank" className="underline underline-offset-2 hover:text-red">
                Datenschutzerklärung
              </Link>
              .
            </span>
          </label>
        </div>

        {state?.error ? (
          <p className="mt-4 flex items-start gap-2 text-sm text-red">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {state.error}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-paper/10 pt-5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-paper/50 hover:text-paper disabled:opacity-0"
          >
            <ChevronLeft size={16} /> Zurück
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-1.5 rounded-full bg-red px-6 py-2.5 text-sm font-medium text-paper hover:bg-red-dark"
            >
              Weiter <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-red px-6 py-2.5 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
            >
              {pending ? "Wird gespeichert …" : "Erstanalyse abschließen"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
