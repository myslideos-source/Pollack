"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { whatsappLink } from "@/content/site";
import { recommendPrograms, type FinderAnswers } from "@/lib/training-finder";

const STEPS: {
  key: keyof FinderAnswers;
  question: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "goal",
    question: "Was ist dein wichtigstes Ziel?",
    options: [
      { value: "staerker", label: "Stärker werden" },
      { value: "ruecken", label: "Rücken entlasten" },
      { value: "abnehmen", label: "Gewicht reduzieren" },
      { value: "beweglich", label: "Beweglicher werden" },
      { value: "sicher", label: "Sicherer fühlen" },
    ],
  },
  {
    key: "limitation",
    question: "Gibt es aktuell Einschränkungen?",
    options: [
      { value: "keine", label: "Keine" },
      { value: "ruecken_gelenke", label: "Rücken- oder Gelenkbeschwerden" },
      { value: "bewegung", label: "Eingeschränkte Beweglichkeit" },
      { value: "keine_angabe", label: "Möchte ich nicht angeben" },
    ],
  },
  {
    key: "style",
    question: "Trainierst du lieber frei, geführt oder in einer Gruppe?",
    options: [
      { value: "frei", label: "Frei, in meinem Tempo" },
      { value: "geführt", label: "Geführt, mit klarer Anleitung" },
      { value: "gruppe", label: "Am liebsten in der Gruppe" },
    ],
  },
  {
    key: "time",
    question: "Wie viel Zeit möchtest du investieren?",
    options: [
      { value: "kurz", label: "Kurz & effizient (< 30 Min.)" },
      { value: "klassisch", label: "Klassisch (45–60 Min.)" },
      { value: "viel", label: "Ich nehme mir gerne Zeit" },
    ],
  },
];

export function TrainingFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<FinderAnswers>>({});

  const isDone = step >= STEPS.length;
  const recommendations = useMemo(
    () => (isDone ? recommendPrograms(answers as FinderAnswers) : []),
    [isDone, answers],
  );

  function choose(value: string) {
    const key = STEPS[step].key;
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  }

  function reset() {
    setStep(0);
    setAnswers({});
  }

  const waMessage = isDone
    ? `Hallo! Der Trainingsfinder hat mir ${recommendations.map((r) => r.title).join(" und ")} empfohlen. Ich möchte gerne mehr erfahren / ein Probetraining vereinbaren.`
    : "";

  return (
    <div className="rounded-3xl border border-paper/10 bg-anthracite p-6 text-paper sm:p-10">
      {!isDone ? (
        <>
          <div className="mb-6 flex gap-1.5" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? "bg-red" : "bg-paper/15"}`}
              />
            ))}
          </div>
          <span className="text-xs uppercase tracking-wide text-paper/40">
            Frage {step + 1} von {STEPS.length}
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{STEPS[step].question}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {STEPS[step].options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => choose(opt.value)}
                className="flex items-center justify-between rounded-xl border border-paper/15 px-5 py-4 text-left text-paper/85 transition-colors hover:border-red hover:text-paper"
              >
                {opt.label}
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-6 text-sm text-paper/50 hover:text-paper/80"
            >
              ← Zurück
            </button>
          ) : null}
        </>
      ) : (
        <div>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Das passt zu dir</h2>
          <p className="mt-2 text-sm text-paper/60">
            Kein medizinisches Ergebnis – eine erste Orientierung, die wir im Probetraining gern
            gemeinsam vertiefen.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {recommendations.map((program) => (
              <div key={program!.slug} className="rounded-xl border border-paper/15 p-5">
                <h3 className="font-display text-xl uppercase tracking-wide">{program!.title}</h3>
                <p className="mt-2 text-sm text-paper/65">{program!.summary}</p>
                <Link
                  href="/#trainingswelten"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-red hover:text-red-dark"
                >
                  Mehr erfahren <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={whatsappLink(waMessage)} variant="moss">
              <MessageCircle size={16} /> Ergebnis per WhatsApp senden
            </Button>
            <Button href="/#probetraining" variant="secondary">
              Probetraining vereinbaren
            </Button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-2 text-sm text-paper/50 hover:text-paper/80"
            >
              <RotateCcw size={14} /> Neu starten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
