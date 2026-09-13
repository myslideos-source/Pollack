import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";

export const metadata: Metadata = {
  title: "More Nutrition & ESN",
  description: "More Nutrition und ESN Supplements direkt im Sportpark Pollack in Fichtenau erhältlich.",
  alternates: { canonical: "/regeneration/more-nutrition-esn" },
};

export default function MoreNutritionPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Start", href: "/" },
          { label: "Regeneration", href: "/regeneration" },
          { label: "More Nutrition & ESN", href: "/regeneration/more-nutrition-esn" },
        ])}
      />
      <PageHero
        eyebrow="Regeneration"
        title="More Nutrition & ESN"
        intro="Proteinshakes, Riegel und Supplements bekannter Marken – direkt im Sportpark erhältlich, für vor und nach dem Training."
        texture="regeneration"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Regeneration", href: "/regeneration" }, { label: "More Nutrition & ESN" }]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-paper/75">
            Im Sportpark Pollack findest du Produkte von More Nutrition und ESN direkt vor Ort – von
            Proteinshakes bis zu Riegeln für unterwegs. Frag einfach unser Team vor Ort nach dem
            aktuellen Sortiment.
          </p>
          <div className="mt-8">
            <Button href="/kontakt">Kontakt aufnehmen</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
