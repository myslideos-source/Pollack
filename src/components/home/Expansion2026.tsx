import { Check } from "lucide-react";
import { MediaPanel } from "@/components/shared/MediaPanel";
import { expansion2026 } from "@/content/expansion";

export function Expansion2026() {
  return (
    <section className="bg-anthracite py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
              {expansion2026.eyebrow}
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
              {expansion2026.headline}
            </h2>
            <p className="mt-4 max-w-lg text-paper/70">{expansion2026.intro}</p>
            <p className="mt-4 max-w-lg text-paper/60">{expansion2026.atmosphereNote}</p>
            <p className="mt-6 text-xs text-paper/40">{expansion2026.statusNote}</p>
          </div>
          <MediaPanel
            src="/media/gesundheit/five-bambus-moos.webp"
            alt="Bambus- und Mooswände mit Kaminfeuer-Atmosphäre im neuen FIVE-Bereich des Sportpark Pollack"
            variant="performance"
            className="relative aspect-[4/5] w-full rounded-2xl lg:aspect-[4/3]"
            label="Erweiterung 2026"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {expansion2026.groups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-paper/10 bg-ink p-5">
              <h3 className="font-display text-sm uppercase tracking-[0.2em] text-red">{group.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-paper/80">
                    <Check size={16} className="mt-0.5 shrink-0 text-red" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
