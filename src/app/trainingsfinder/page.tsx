import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { TrainingFinder } from "@/components/home/TrainingFinder";

export const metadata: Metadata = {
  title: "Trainingsfinder",
  description: "Finde in vier Fragen heraus, welcher Bereich im Sportpark Pollack zu dir passt.",
  alternates: { canonical: "/trainingsfinder" },
};

export default function TrainingsfinderPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Trainingsfinder", href: "/trainingsfinder" }])} />
      <PageHero
        eyebrow="In 4 Fragen"
        title="Meinen Bereich finden"
        intro="Kein Anmeldeformular, keine Diagnose – nur vier kurze Fragen, die dir zeigen, wo du im Sportpark am besten startest."
        texture="performance"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Trainingsfinder" }]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container className="max-w-3xl">
          <TrainingFinder />
        </Container>
      </section>
    </>
  );
}
