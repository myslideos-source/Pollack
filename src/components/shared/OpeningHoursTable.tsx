import { AlertTriangle } from "lucide-react";
import { dayLabels, openingHours, hoursConfirmed } from "@/content/hours";
import { OpenStatusBadge } from "@/components/shared/OpenStatusBadge";

function formatDay(ranges: { open: string; close: string }[]): string {
  if (ranges.length === 0) return "geschlossen";
  return ranges.map((r) => `${r.open} – ${r.close} Uhr`).join(", ");
}

export function OpeningHoursTable() {
  return (
    <div className="rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl uppercase tracking-wide text-paper">Öffnungszeiten</h2>
        <OpenStatusBadge />
      </div>

      {!hoursConfirmed ? (
        <p className="mt-4 flex items-start gap-2 text-sm text-paper/70">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-sand" />
          Die genauen Öffnungszeiten bestätigen wir dir gerne telefonisch oder per WhatsApp.
        </p>
      ) : (
        <table className="mt-5 w-full text-sm">
          <tbody>
            {(Object.keys(dayLabels) as (keyof typeof dayLabels)[]).map((key) => (
              <tr key={key} className="border-t border-paper/10 first:border-t-0">
                <td className="py-2.5 text-paper/70">{dayLabels[key]}</td>
                <td className="py-2.5 text-right text-paper">{formatDay(openingHours[key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="mt-5 text-xs text-paper/40">
        An Feiertagen können abweichende Öffnungszeiten gelten. Bitte vorab kurz nachfragen.
      </p>
    </div>
  );
}
