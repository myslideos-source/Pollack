import { OpeningHoursTable } from "@/components/shared/OpeningHoursTable";
import { PulseLine } from "@/components/shared/PulseLine";

export function HomeOpeningHours() {
  return (
    <section className="bg-anthracite py-16 sm:py-24" aria-label="Öffnungszeiten">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <PulseLine zone="regeneration" className="mb-6 max-w-xs opacity-70" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            Wann du bei uns trainieren kannst.
          </h2>
          <p className="max-w-sm text-sm text-paper/60">
            Aktueller Status, heutige Zeiten und die ganze Woche auf einen Blick.
          </p>
        </div>
        <div className="mt-8">
          <OpeningHoursTable />
        </div>
      </div>
    </section>
  );
}
