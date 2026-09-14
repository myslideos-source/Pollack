import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PartnersManager } from "./PartnersManager";
import { ProductsManager } from "./ProductsManager";

export const metadata: Metadata = { title: "Partner & Produkte" };

export default async function PartnerPage() {
  await requireStaff();
  const supabase = await createClient();
  const [{ data: partners }, { data: products }] = await Promise.all([
    supabase.from("partners").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order"),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Partner & Produkte</h1>
        <p className="text-sm text-paper/60">
          Kooperationspartner und Produkte (z. B. MORE Nutrition, ESN) verwalten. Keine Verkaufs- oder
          Bezahlfunktion — reine Übersicht für Besucher:innen.
        </p>
      </div>

      <div>
        <h2 className="font-display text-xl text-paper">Partner</h2>
        <div className="mt-3">
          <PartnersManager partners={partners ?? []} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-paper">Produkte</h2>
        <div className="mt-3">
          <ProductsManager products={products ?? []} partners={(partners ?? []).map((p) => ({ id: p.id, name: p.name }))} />
        </div>
      </div>
    </div>
  );
}
