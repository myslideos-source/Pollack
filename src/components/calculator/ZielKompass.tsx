"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import {
  runHealthCalculator,
  type ActivityLevel,
  type CalculationBasis,
  type Goal,
  type TrainingFrequency,
} from "@/lib/health-calculator";
import { Button } from "@/components/shared/Button";

const BLOCKED_MESSAGES: Record<string, string> = {
  minor: "Für unter 18-Jährige geben wir keine automatische Kalorienempfehlung aus – sprich uns persönlich an, wir beraten dich individuell und altersgerecht.",
  pregnant: "Während der Schwangerschaft hängt dein Energiebedarf von vielen individuellen Faktoren ab. Bitte besprich das mit deiner Ärztin bzw. deinem Arzt oder einer Ernährungsfachkraft.",
  eating_disorder: "Bei einer Vorgeschichte mit Essstörungen verzichten wir bewusst auf eine automatische Kalorienempfehlung. Wende dich gerne an uns oder eine spezialisierte Beratungsstelle – wir unterstützen dich dabei.",
  medical_condition: "Bei relevanten Erkrankungen sollte dein Energiebedarf individuell mit einer medizinischen oder ernährungsfachlichen Beratung abgestimmt werden.",
};

const inputClass =
  "w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-paper placeholder:text-paper/35 focus-visible:border-red";
const labelClass = "text-sm font-medium text-paper/70";

export function ZielKompass() {
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);
  const [basis, setBasis] = useState<CalculationBasis>("average");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [trainingFrequency, setTrainingFrequency] = useState<TrainingFrequency>("1-2");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [isMinor, setIsMinor] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [hasEatingDisorderHistory, setHasEatingDisorderHistory] = useState(false);
  const [hasRelevantConditions, setHasRelevantConditions] = useState(false);

  const result = useMemo(
    () =>
      runHealthCalculator({
        age,
        heightCm,
        weightKg,
        basis,
        activityLevel,
        trainingFrequency,
        goal,
        isMinor,
        isPregnant,
        hasEatingDisorderHistory,
        hasRelevantConditions,
      }),
    [age, heightCm, weightKg, basis, activityLevel, trainingFrequency, goal, isMinor, isPregnant, hasEatingDisorderHistory, hasRelevantConditions],
  );

  const ringPercent = result.target
    ? Math.min(100, Math.round((result.target / (result.tdee * 1.3)) * 100))
    : 0;

  return (
    <div id="ziel-kompass" className="scroll-mt-28 rounded-3xl border border-paper/10 bg-anthracite p-6 text-paper sm:p-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">Sportpark Ziel-Kompass</h2>
          <p className="mt-2 text-sm text-paper/60">
            Eine unverbindliche Schätzung deines Energiebedarfs nach der Mifflin-St-Jeor-Formel – alles
            läuft ausschließlich in deinem Browser, nichts wird gespeichert oder übertragen.
          </p>

          <form className="mt-6 grid grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Alter</span>
              <input
                type="number"
                min={10}
                max={100}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Größe (cm)</span>
              <input
                type="number"
                min={100}
                max={230}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Gewicht (kg)</span>
              <input
                type="number"
                min={30}
                max={250}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Berechnungsgrundlage</span>
              <select
                value={basis}
                onChange={(e) => setBasis(e.target.value as CalculationBasis)}
                className={inputClass}
              >
                <option value="average">Neutral (Mittelwert)</option>
                <option value="male">Männliche Formel</option>
                <option value="female">Weibliche Formel</option>
              </select>
            </label>

            <label className="col-span-2 flex flex-col gap-1.5">
              <span className={labelClass}>Alltagsaktivität</span>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className={inputClass}
              >
                <option value="low">Überwiegend sitzend</option>
                <option value="moderate">Teils sitzend, teils in Bewegung</option>
                <option value="high">Überwiegend stehend / gehend</option>
                <option value="very_high">Körperlich fordernd</option>
              </select>
            </label>

            <label className="col-span-2 flex flex-col gap-1.5">
              <span className={labelClass}>Trainingshäufigkeit pro Woche</span>
              <select
                value={trainingFrequency}
                onChange={(e) => setTrainingFrequency(e.target.value as TrainingFrequency)}
                className={inputClass}
              >
                <option value="0">Kein regelmäßiges Training</option>
                <option value="1-2">1–2×</option>
                <option value="3-4">3–4×</option>
                <option value="5-6">5–6×</option>
                <option value="7+">Täglich</option>
              </select>
            </label>

            <fieldset className="col-span-2 flex flex-col gap-1.5">
              <legend className={labelClass}>Ziel</legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "maintain", label: "Gewicht halten" },
                    { id: "lose", label: "Gesund abnehmen" },
                    { id: "build", label: "Muskelaufbau" },
                  ] as { id: Goal; label: string }[]
                ).map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    aria-pressed={goal === g.id}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      goal === g.id ? "border-red bg-red/10 text-red" : "border-paper/15 text-paper/70"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="col-span-2 mt-2 flex flex-col gap-2 border-t border-paper/10 pt-4 text-sm text-paper/70">
              <span className={labelClass}>Bitte gib an, falls zutreffend:</span>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} />
                Ich bin unter 18 Jahre alt
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isPregnant} onChange={(e) => setIsPregnant(e.target.checked)} />
                Ich bin schwanger
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasEatingDisorderHistory}
                  onChange={(e) => setHasEatingDisorderHistory(e.target.checked)}
                />
                Vorgeschichte mit Essstörungen
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasRelevantConditions}
                  onChange={(e) => setHasRelevantConditions(e.target.checked)}
                />
                Relevante Erkrankung, die meine Ernährung beeinflusst
              </label>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl bg-ink p-8 text-center text-paper">
          {result.canRecommendTarget && result.target !== null ? (
            <>
              <div className="relative flex h-48 w-48 items-center justify-center">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(247,245,240,0.12)" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="var(--color-moss)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - ringPercent / 100)}
                  />
                </svg>
                <div className="absolute flex flex-col">
                  <span className="font-display text-4xl font-bold">{result.target}</span>
                  <span className="text-xs uppercase tracking-wide text-paper/50">kcal / Tag</span>
                </div>
              </div>
              <dl className="mt-6 grid w-full grid-cols-2 gap-4 text-left text-sm">
                <div>
                  <dt className="text-paper/50">Grundumsatz</dt>
                  <dd className="font-display text-lg">{result.bmr} kcal</dd>
                </div>
                <div>
                  <dt className="text-paper/50">Gesamtumsatz</dt>
                  <dd className="font-display text-lg">{result.tdee} kcal</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-paper/50">
                {goal === "lose"
                  ? "Moderates, alltagstaugliches Defizit – keine Crash-Diät."
                  : goal === "build"
                    ? "Moderater Überschuss für nachhaltigen Muskelaufbau."
                    : "Kalorienmenge zum Halten deines aktuellen Gewichts."}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-left">
              <Info size={28} className="text-sand" />
              <p className="text-sm text-paper/80">
                {result.blockedReason ? BLOCKED_MESSAGES[result.blockedReason] : ""}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-paper/10 pt-6 text-left">
            <p className="text-sm text-paper/70">
              Ein Rechner kann schätzen. InBody zeigt, woraus dein Körper wirklich besteht.
            </p>
            <Button href="/kontakt#anfrage" variant="moss" className="self-start">
              InBody-Termin anfragen
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-8 border-t border-paper/10 pt-6 text-xs text-paper/50">
        Der Rechner liefert eine unverbindliche Schätzung und ersetzt keine medizinische Beratung. Der
        tatsächliche Bedarf kann individuell abweichen.
      </p>
    </div>
  );
}
