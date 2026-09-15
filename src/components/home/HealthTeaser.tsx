import { ArrowRight, Repeat, Move, ScanLine } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { PulseLine } from "@/components/shared/PulseLine";

const points = [
  {
    title: "Milon",
    copy: "Effizientes, gelenkschonendes Zirkeltraining mit automatischer Gerätevoreinstellung.",
    icon: Repeat,
  },
  {
    title: "FIVE",
    copy: "Gezieltes Training für Rücken, Gelenke und Beweglichkeit in kurzen Einheiten.",
    icon: Move,
  },
  {
    title: "InBody",
    copy: "Umfassende Körperanalyse: Muskelmasse, Körperfett und Verteilung im Körper.",
    icon: ScanLine,
  },
];

export function HealthTeaser() {
  return (
    <section className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PulseLine zone="health" className="mb-6 max-w-md opacity-80" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            Training, das mehr kann als Muskeln.
          </h2>
          <p className="max-w-md text-paper/60">
            BMI und Körpergewicht allein zeigen nicht, woraus dein Körper wirklich besteht.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {points.map((point) => (
            <div
              key={point.title}
              className="group rounded-2xl border border-paper/10 bg-anthracite p-6 transition-colors hover:border-moss/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss/15 text-moss transition-colors group-hover:bg-moss group-hover:text-ink">
                <point.icon size={20} />
              </span>
              <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-paper">{point.title}</h3>
              <p className="mt-3 text-sm text-paper/60">{point.copy}</p>
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
