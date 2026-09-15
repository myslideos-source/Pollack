import { ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { loadPublishedOffers } from "@/lib/content/offers-data";

export async function PricingTeaser() {
  const offers = await loadPublishedOffers();
  if (offers.length === 0) return null;
  return (
    <section id="preise" className="scroll-mt-20 bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">Preise</h2>
        <p className="mt-3 max-w-2xl text-paper/70">
          Wähle die Mitgliedschaft, die zu deinem Ziel passt. Für die genauen, aktuellen Konditionen sprich uns
          direkt an.
        </p>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-sand/30 bg-sand/10 p-5 text-sm text-paper/80">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-sand" />
          <p>
            Damit hier keine falschen Zahlen stehen, zeigen wir aktuell „Preis auf Anfrage&ldquo; für alle Tarife. Die
            verbindlichen, aktuellen Konditionen erfährst du telefonisch, per WhatsApp oder direkt vor Ort.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer) => (
            <div key={offer.id} className="flex flex-col rounded-2xl border border-paper/10 bg-anthracite p-6">
              <h3 className="font-display text-xl uppercase tracking-wide text-paper">{offer.title}</h3>
              <p className="mt-2 flex-1 text-sm text-paper/65">{offer.description}</p>
              {offer.features.length > 0 ? (
                <ul className="mt-3 space-y-1 text-xs text-paper/50">
                  {offer.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-4 font-display text-lg text-red">{offer.priceNote ?? "Preis auf Anfrage"}</p>
              <Button href="/#anfrage" variant="secondary" className="mt-4">
                Unverbindlich anfragen
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/#probetraining">
            Probetraining starten <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
