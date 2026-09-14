import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { JsonLd } from "@/components/shared/JsonLd";
import { OpeningHoursTable } from "@/components/shared/OpeningHoursTable";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { loadPublishedOffers } from "@/lib/content/offers-data";
import { loadPartners } from "@/lib/content/partners-data";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Preise",
  description: "Tarife und Preise im Sportpark Pollack in Fichtenau – Monatsbeitrag, Zehnerkarte, InBody-Analyse und mehr.",
  alternates: { canonical: "/preise" },
};

export default async function PreisePage() {
  const [offers, partners] = await Promise.all([loadPublishedOffers(), loadPartners()]);
  const hansefit = partners.find((p) => p.name === "Hansefit");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Preise", href: "/preise" }])} />
      <PageHero
        eyebrow="Transparent & fair"
        title="Preise"
        intro="Wähle die Mitgliedschaft, die zu deinem Ziel passt. Für die genauen, aktuellen Konditionen sprich uns direkt an."
        texture="performance"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Preise" }]}
      />

      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <div className="mb-10 flex items-start gap-3 rounded-2xl border border-sand/30 bg-sand/10 p-5 text-sm text-paper/80">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-sand" />
            <p>
              Damit hier keine falschen Zahlen stehen, zeigen wir aktuell „Preis auf Anfrage“ für alle
              Tarife. Die verbindlichen, aktuellen Konditionen erfährst du telefonisch, per WhatsApp
              oder direkt vor Ort.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <div key={offer.id} className="flex flex-col rounded-2xl border border-paper/10 bg-anthracite p-6">
                <h2 className="font-display text-xl uppercase tracking-wide text-paper">{offer.title}</h2>
                <p className="mt-2 flex-1 text-sm text-paper/65">{offer.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-paper/50">
                  {offer.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
                <p className="mt-4 font-display text-lg text-red">{offer.priceNote}</p>
                <Button href="/kontakt#anfrage" variant="secondary" className="mt-4">
                  Unverbindlich anfragen
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {hansefit ? (
              <div className="rounded-2xl border border-paper/10 bg-anthracite p-6">
                <h3 className="font-display text-lg uppercase tracking-wide text-paper">{hansefit.name}</h3>
                <p className="mt-2 text-sm text-paper/65">{hansefit.description}</p>
                <Link href="/partner-produkte" className="mt-3 inline-block text-sm text-red hover:text-red-dark">
                  Mehr zu unseren Partnern →
                </Link>
              </div>
            ) : null}
            <OpeningHoursTable />
          </div>

          <div className="mt-14 text-center">
            <Button href="/kontakt#probetraining">Probetraining starten</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
