import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { ProgramGrid } from "@/components/shared/ProgramGrid";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { categoryMeta } from "@/content/categories";
import { programsByCategory } from "@/content/programs";
import { hansefit } from "@/content/pricing";

const meta = categoryMeta.regeneration;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.metaDescription,
  alternates: { canonical: "/regeneration" },
};

export default function RegenerationPage() {
  const items = programsByCategory("regeneration");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Regeneration", href: "/regeneration" }])} />
      <PageHero
        eyebrow={meta.eyebrow}
        title={meta.title}
        intro={meta.intro}
        texture={meta.texture}
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Regeneration" }]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <ProgramGrid programs={items} />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
              <h2 className="font-display text-xl uppercase tracking-wide text-paper">
                More Nutrition &amp; ESN
              </h2>
              <p className="mt-3 text-sm text-paper/65">
                Proteinshakes, Riegel und Supplements direkt im Sportpark – für unterwegs oder nach dem
                Training.
              </p>
              <Link href="/regeneration/more-nutrition-esn" className="mt-4 inline-block text-sm text-red hover:text-red-dark">
                Mehr erfahren →
              </Link>
            </div>
            <div className="rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
              <h2 className="font-display text-xl uppercase tracking-wide text-paper">{hansefit.name}</h2>
              <p className="mt-3 text-sm text-paper/65">{hansefit.description}</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button href="/kontakt#probetraining">Probetraining starten</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
