import { AlertTriangle } from "lucide-react";
import { WEEKDAYS, type OpeningHour } from "@/lib/opening-hours";
import { loadOpeningHours } from "@/lib/content/opening-hours-data";
import { OpenStatusBadge } from "@/components/shared/OpenStatusBadge";

function formatDay(ranges: OpeningHour[]): string {
  if (ranges.length === 0 || ranges.every((r) => r.closed)) return "geschlossen";
  return ranges
    .filter((r) => !r.closed && r.open_time && r.close_time)
    .map((r) => `${r.open_time?.slice(0, 5)} – ${r.close_time?.slice(0, 5)} Uhr`)
    .join(", ");
}

export async function OpeningHoursTable() {
  const { hours, special } = await loadOpeningHours();
  const hasHours = hours.length > 0;

  return (
    <div className="rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl uppercase tracking-wide text-paper">Öffnungszeiten</h2>
        <OpenStatusBadge hours={hours} special={special} />
      </div>

      {!hasHours ? (
        <p className="mt-4 flex items-start gap-2 text-sm text-paper/70">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-sand" />
          Die genauen Öffnungszeiten bestätigen wir dir gerne telefonisch oder per WhatsApp.
        </p>
      ) : (
        <table className="mt-5 w-full text-sm">
          <tbody>
            {WEEKDAYS.map((day) => (
              <tr key={day.value} className="border-t border-paper/10 first:border-t-0">
                <td className="py-2.5 text-paper/70">{day.label}</td>
                <td className="py-2.5 text-right text-paper">
                  {formatDay(hours.filter((h) => h.weekday === day.value))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {special && special.length > 0 ? (
        <div className="mt-5 space-y-1.5 border-t border-paper/10 pt-4">
          {special.map((s) => (
            <p key={`${s.label}-${s.date_from}`} className="text-xs text-paper/60">
              <span className="text-paper/80">{s.label}:</span>{" "}
              {s.closed ? "geschlossen" : `${s.open_time?.slice(0, 5)} – ${s.close_time?.slice(0, 5)} Uhr`}
              {s.note ? ` · ${s.note}` : ""}
            </p>
          ))}
        </div>
      ) : null}

      <p className="mt-5 text-xs text-paper/40">
        An Feiertagen können abweichende Öffnungszeiten gelten. Bitte vorab kurz nachfragen.
      </p>
    </div>
  );
}
