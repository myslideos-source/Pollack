import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { MediaPanel } from "@/components/shared/MediaPanel";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { juergenPollack, studioStory } from "@/content/about";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Der Sportpark Pollack in Fichtenau: familiengeführt seit 1987, geleitet von Jürgen Pollack – Fitness, Gesundheit und Kampfkunst persönlich begleitet.",
  alternates: { canonical: "/ueber-uns" },
};

export default function UeberUnsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Über uns", href: "/ueber-uns" }])} />
      <PageHero
        eyebrow={`Seit ${siteConfig.foundedYear}`}
        title={studioStory.headline}
        texture="kampfkunst"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Über uns" }]}
      />

      <section className="bg-ink py-14 sm:py-20">
        <Container className="max-w-3xl">
          {studioStory.paragraphs.map((p) => (
            <p key={p} className="mt-4 text-paper/80 first:mt-0">
              {p}
            </p>
          ))}
          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-paper/10 bg-anthracite p-5 sm:grid-cols-4 sm:p-6">
            {studioStory.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs uppercase tracking-wide text-paper/45">{f.label}</dt>
                <dd className="mt-1 font-display text-lg text-paper">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-anthracite py-14 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <MediaPanel
              src={juergenPollack.portraitSrc}
              alt={juergenPollack.portraitAlt}
              variant="kampfkunst"
              className="relative aspect-[4/5] w-full rounded-2xl"
              label={juergenPollack.name}
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-red">
                {juergenPollack.role}
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                {juergenPollack.name}
              </h2>
              <p className="mt-5 max-w-xl text-paper/75">{juergenPollack.intro}</p>
              {juergenPollack.story.map((p) => (
                <p key={p} className="mt-3 max-w-xl text-paper/75">
                  {p}
                </p>
              ))}
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-paper/70 sm:grid-cols-2">
                {juergenPollack.qualifications.map((q) => (
                  <li key={q} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-14 text-center sm:py-20">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
            Lern uns persönlich kennen.
          </h2>
          <div className="mt-6">
            <Button href="/kontakt#probetraining">Probetraining vereinbaren</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
