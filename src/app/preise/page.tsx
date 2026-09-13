import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { pricingTiers, pricingExtras, hansefit } from "@/content/pricing";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Preise",
  description: "Tarife und Preise im Sportpark Pollack in Fichtenau – Monatsbeitrag, Zehnerkarte, InBody-Analyse und mehr.",
  alternates: { canonical: "/preise" },
};

export default function PreisePage() {
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
            {pricingTiers.map((tier) => (
              <div key={tier.id} className="flex flex-col rounded-2xl border border-paper/10 bg-anthracite p-6">
                <h2 className="font-display text-xl uppercase tracking-wide text-paper">{tier.name}</h2>
                <p className="mt-2 flex-1 text-sm text-paper/65">{tier.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-paper/50">
                  {tier.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
                <p className="mt-4 font-display text-lg text-red">{tier.priceNote}</p>
                <Button href="/kontakt#anfrage" variant="secondary" className="mt-4">
                  Unverbindlich anfragen
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {pricingExtras.map((extra) => (
              <div key={extra.id} className="rounded-2xl border border-paper/10 bg-anthracite p-6">
                <h3 className="font-display text-lg uppercase tracking-wide text-paper">{extra.label}</h3>
                <p className="mt-2 text-sm text-red">{extra.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-paper/10 bg-anthracite p-6">
            <h3 className="font-display text-lg uppercase tracking-wide text-paper">{hansefit.name}</h3>
            <p className="mt-2 text-sm text-paper/65">{hansefit.description}</p>
          </div>

          <div className="mt-14 text-center">
            <Button href="/kontakt#probetraining">Probetraining starten</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
