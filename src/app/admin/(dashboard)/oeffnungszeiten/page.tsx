import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { OpeningHoursManager } from "./OpeningHoursManager";

export const metadata: Metadata = { title: "Öffnungszeiten" };

export default async function OeffnungszeitenPage() {
  await requireStaff();
  const supabase = await createClient();
  const [{ data: hours }, { data: special }] = await Promise.all([
    supabase.from("opening_hours").select("*").order("sort_order"),
    supabase.from("special_opening_hours").select("*").order("date_from"),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Öffnungszeiten</h1>
        <p className="text-sm text-paper/60">
          Reguläre Wochenzeiten sowie Feiertage und temporäre Sonderöffnungszeiten. Der &bdquo;Jetzt geöffnet&ldquo;-
          Status auf der Website wird automatisch daraus berechnet.
        </p>
      </div>
      <div className="mt-6">
        <OpeningHoursManager hours={hours ?? []} special={special ?? []} />
      </div>
    </div>
  );
}
