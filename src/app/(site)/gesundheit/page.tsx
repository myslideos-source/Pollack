import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ProgramGrid } from "@/components/shared/ProgramGrid";
import { Container } from "@/components/shared/Container";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { categoryMeta } from "@/content/categories";
import { programsByCategory } from "@/content/programs";
import { ZielKompass } from "@/components/calculator/ZielKompass";

const meta = categoryMeta.gesundheit;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.metaDescription,
  alternates: { canonical: "/gesundheit" },
};

export default function GesundheitPage() {
  const items = programsByCategory("gesundheit");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Gesundheit", href: "/gesundheit" }])} />
      <PageHero
        eyebrow={meta.eyebrow}
        title={meta.title}
        intro={meta.intro}
        texture={meta.texture}
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Gesundheit" }]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <ProgramGrid programs={items} />
        </Container>
      </section>
      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <ZielKompass />
        </Container>
      </section>
    </>
  );
}
