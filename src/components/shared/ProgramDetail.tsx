import { Check, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { categoryMeta } from "@/content/categories";
import type { Program } from "@/content/programs";

export function ProgramDetail({ program }: { program: Program }) {
  const catMeta = categoryMeta[program.category];
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Start", href: "/" },
          { label: catMeta.title, href: `/${program.category}` },
          { label: program.title, href: `/${program.category}/${program.slug}` },
        ])}
      />
      <PageHero
        eyebrow={catMeta.title}
        title={program.title}
        intro={program.summary}
        texture={program.texture}
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: catMeta.title, href: `/${program.category}` },
          { label: program.title },
        ]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container className="max-w-3xl">
          {program.description.map((p) => (
            <p key={p} className="mt-4 text-paper/80 first:mt-0">
              {p}
            </p>
          ))}
          <ul className="mt-8 space-y-3">
            {program.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-paper/85">
                <Check size={18} className="mt-0.5 shrink-0 text-red" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/kontakt#probetraining">
              Probetraining starten <ArrowRight size={16} />
            </Button>
            <Button href={`/${program.category}`} variant="secondary">
              Alle {catMeta.title}-Angebote
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
