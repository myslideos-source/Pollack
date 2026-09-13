import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ProgramGrid } from "@/components/shared/ProgramGrid";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { categoryMeta } from "@/content/categories";
import { programsByCategory } from "@/content/programs";
import { juergenPollack } from "@/content/about";

const meta = categoryMeta.kampfkunst;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.metaDescription,
  alternates: { canonical: "/kampfkunst" },
};

export default function KampfkunstPage() {
  const items = programsByCategory("kampfkunst");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Kampfkunst", href: "/kampfkunst" }])} />
      <PageHero
        eyebrow={meta.eyebrow}
        title={meta.title}
        intro={meta.intro}
        texture={meta.texture}
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Kampfkunst" }]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <ProgramGrid programs={items} />

          <div className="mt-14 rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wide text-paper">
              Qualifikation von {juergenPollack.name}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-paper/70 sm:grid-cols-2">
              {juergenPollack.qualifications.map((q) => (
                <li key={q} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Button href="/kontakt#probetraining">Probetraining starten</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
