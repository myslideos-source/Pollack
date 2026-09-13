import { Check, ArrowRight, Info } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { JsonLd } from "@/components/shared/JsonLd";
import { Accordion } from "@/components/shared/Accordion";
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
        image={program.image}
        imageAlt={program.imageAlt}
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: catMeta.title, href: `/${program.category}` },
          { label: program.title },
        ]}
      />
      <section className="bg-ink py-14 sm:py-20">
        <Container className="max-w-3xl">
          {program.facts ? (
            <dl className="mb-10 grid grid-cols-2 gap-4 rounded-2xl border border-paper/10 bg-anthracite p-5 sm:grid-cols-3 sm:p-6">
              {program.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs uppercase tracking-wide text-paper/45">{f.label}</dt>
                  <dd className="mt-1 font-display text-lg text-paper">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

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

          {program.quote ? (
            <blockquote className="mt-10 border-l-2 border-red pl-5 font-display text-2xl leading-snug text-paper sm:text-3xl">
              „{program.quote}“
            </blockquote>
          ) : null}

          {program.faq ? (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl uppercase tracking-wide text-paper">
                Gut zu wissen
              </h2>
              <Accordion items={program.faq} />
            </div>
          ) : null}

          {program.openQuestion ? (
            <p className="mt-8 flex items-start gap-2 rounded-xl border border-sand/25 bg-sand/10 p-4 text-sm text-paper/70">
              <Info size={16} className="mt-0.5 shrink-0 text-sand" />
              {program.openQuestion}
            </p>
          ) : null}

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
