import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { OffersManager } from "./OffersManager";

export const metadata: Metadata = { title: "Angebote & Preise" };

export default async function AngebotePage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: offers } = await supabase.from("offers").select("*").order("sort_order");

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Angebote & Preise</h1>
        <p className="text-sm text-paper/60">
          Mitgliedschaften, Probetraining und Aktionen verwalten. Nur veröffentlichte Angebote erscheinen auf der
          Website.
        </p>
      </div>
      <div className="mt-6">
        <OffersManager offers={offers ?? []} />
      </div>
    </div>
  );
}
