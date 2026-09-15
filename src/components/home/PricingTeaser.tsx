import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { loadPublishedOffers } from "@/lib/content/offers-data";

export async function PricingTeaser() {
  const offers = await loadPublishedOffers();
  if (offers.length === 0) return null;
  return (
    <section className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">Preise</h2>
          <Button href="/preise" variant="secondary">
            Alle Tarife ansehen <ArrowRight size={16} />
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offers.slice(0, 4).map((offer) => (
            <div key={offer.id} className="flex flex-col rounded-2xl border border-paper/10 bg-anthracite p-6">
              <h3 className="font-display text-xl uppercase tracking-wide text-paper">{offer.title}</h3>
              <p className="mt-2 flex-1 text-sm text-paper/60">{offer.description}</p>
              <p className="mt-4 font-display text-lg text-red">{offer.priceNote}</p>
              <Button href="/kontakt#anfrage" variant="secondary" className="mt-4">
                Unverbindlich anfragen
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
