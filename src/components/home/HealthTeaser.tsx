import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { PulseLine } from "@/components/shared/PulseLine";

const points = [
  {
    title: "Milon",
    copy: "Effizientes, gelenkschonendes Zirkeltraining mit automatischer Gerätevoreinstellung.",
  },
  {
    title: "FIVE",
    copy: "Gezieltes Training für Rücken, Gelenke und Beweglichkeit in kurzen Einheiten.",
  },
  {
    title: "InBody",
    copy: "Umfassende Körperanalyse: Muskelmasse, Körperfett und Verteilung im Körper.",
  },
];

export function HealthTeaser() {
  return (
    <section className="bg-surface py-16 text-ink sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PulseLine zone="health" className="mb-6 max-w-md opacity-80" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Training, das mehr kann als Muskeln.
          </h2>
          <p className="max-w-md text-ink/60">
            BMI und Körpergewicht allein zeigen nicht, woraus dein Körper wirklich besteht.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="rounded-2xl border border-ink/10 bg-paper p-6">
              <h3 className="font-display text-2xl uppercase tracking-wide text-moss-dark">
                {point.title}
              </h3>
              <p className="mt-3 text-sm text-ink/70">{point.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button href="/gesundheit#ziel-kompass" variant="moss">
            Gesundheits-Check starten <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
