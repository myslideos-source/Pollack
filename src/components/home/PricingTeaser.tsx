import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { pricingTiers } from "@/content/pricing";

export function PricingTeaser() {
  return (
    <section className="bg-surface py-16 text-ink sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Preise</h2>
          <Button href="/preise" variant="secondary" className="!border-ink/20 !text-ink hover:!bg-ink/5">
            Alle Tarife ansehen <ArrowRight size={16} />
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.slice(0, 4).map((tier) => (
            <div key={tier.id} className="flex flex-col rounded-2xl border border-ink/10 bg-paper p-6">
              <h3 className="font-display text-xl uppercase tracking-wide">{tier.name}</h3>
              <p className="mt-2 flex-1 text-sm text-ink/60">{tier.description}</p>
              <p className="mt-4 font-display text-lg text-red">{tier.priceNote}</p>
              <Button href="/kontakt#anfrage" variant="secondary" className="mt-4 !border-ink/20 !text-ink hover:!bg-ink/5">
                Unverbindlich anfragen
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
