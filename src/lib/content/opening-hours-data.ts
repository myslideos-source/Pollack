import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OpeningHour, SpecialOpeningHour } from "@/lib/opening-hours";

export async function loadOpeningHours(): Promise<{ hours: OpeningHour[]; special: SpecialOpeningHour[] }> {
  const supabase = await createClient();
  const todayStr = new Date().toISOString().slice(0, 10);
  const [{ data: hours, error: hoursError }, { data: special, error: specialError }] = await Promise.all([
    supabase.from("opening_hours").select("weekday, open_time, close_time, closed, sort_order").order("sort_order"),
    supabase
      .from("special_opening_hours")
      .select("date_from, date_to, closed, open_time, close_time, label, note")
      .or(`date_to.is.null,date_to.gte.${todayStr}`)
      .order("date_from"),
  ]);
  if (hoursError) console.error("[loadOpeningHours]", hoursError);
  if (specialError) console.error("[loadOpeningHours:special]", specialError);
  return { hours: (hours as OpeningHour[]) ?? [], special: (special as SpecialOpeningHour[]) ?? [] };
}
