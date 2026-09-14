import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ProgramGrid } from "@/components/shared/ProgramGrid";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { categoryMeta } from "@/content/categories";
import { programsByCategory } from "@/content/programs";

const meta = categoryMeta.training;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.metaDescription,
  alternates: { canonical: "/training" },
};

export default function TrainingPage() {
  const items = programsByCategory("training");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Training", href: "/training" }])} />
      <PageHero
        eyebrow={meta.eyebrow}
        title={meta.title}
        intro={meta.intro}
        texture={meta.texture}
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Training" }]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <ProgramGrid programs={items} />
          <div className="mt-12 text-center">
            <Button href="/kontakt#probetraining">Probetraining starten</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
