import { Check } from "lucide-react";
import { TexturePanel } from "@/components/shared/TexturePanel";

const items = [
  "Zusätzliche 150 m² Trainingsfläche",
  "Neue Technogym Plate-Loaded Maschinen",
  "FIVE Rücken- und Gelenkzentrum",
  "Größere Kampfsport-Area",
  "Massageraum Deluxe",
  "Chillout-Lounge",
];

export function Expansion2026() {
  return (
    <section className="bg-anthracite py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
            Erweiterung ab Juli 2026
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            Der Sportpark wächst.
          </h2>
          <p className="mt-4 max-w-lg text-paper/70">
            Wir bauen den Sportpark Pollack weiter aus – mehr Fläche, mehr Ausstattung, mehr Raum für
            Training, Gesundheit und Regeneration.
          </p>
          <ul className="mt-6 space-y-3">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-3 text-paper/85">
                <Check size={18} className="shrink-0 text-red" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-paper/40">
            Der genaue Umsetzungsstand der Erweiterung war zum Zeitpunkt dieses Relaunches nicht
            eindeutig zu bestätigen – siehe TODO_CLIENT.md.
          </p>
        </div>
        <TexturePanel variant="performance" className="aspect-[4/5] w-full rounded-2xl" label="Erweiterung 2026" />
      </div>
    </section>
  );
}
