import type { Metadata } from "next";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import { OpeningHoursTable } from "@/components/shared/OpeningHoursTable";
import { ConsentMap } from "@/components/shared/ConsentMap";
import { ContactForm } from "@/components/shared/ContactForm";
import { loadContact } from "@/lib/content/contact";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktiere den Sportpark Pollack in Fichtenau – Telefon, WhatsApp, E-Mail oder direkt zum Probetraining.",
  alternates: { canonical: "/kontakt" },
};

export default async function KontaktPage() {
  const contact = await loadContact();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Start", href: "/" }, { label: "Kontakt", href: "/kontakt" }])} />
      <PageHero
        eyebrow="Sprich uns an"
        title="Kontakt & Probetraining"
        intro="Ob Frage, Terminwunsch oder direkt zum Probetraining – wir sind persönlich für dich erreichbar."
        texture="performance"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Kontakt" }]}
      />

      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href={contact.phoneHref}
              className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-anthracite p-5 text-paper hover:border-red"
            >
              <Phone size={22} className="text-red" />
              <div>
                <div className="font-display uppercase tracking-wide">Anrufen</div>
                <div className="text-sm text-paper/60">{contact.phone}</div>
              </div>
            </a>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-anthracite p-5 text-paper hover:border-moss"
            >
              <MessageCircle size={22} className="text-moss" />
              <div>
                <div className="font-display uppercase tracking-wide">WhatsApp</div>
                <div className="text-sm text-paper/60">{contact.whatsapp}</div>
              </div>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-anthracite p-5 text-paper hover:border-sand"
            >
              <Mail size={22} className="text-sand" />
              <div>
                <div className="font-display uppercase tracking-wide">E-Mail</div>
                <div className="text-sm text-paper/60">{contact.email}</div>
              </div>
            </a>
          </div>

          <div id="probetraining" className="mt-14 grid gap-10 scroll-mt-24 lg:grid-cols-[1.1fr_0.9fr]">
            <div id="anfrage" className="scroll-mt-24 rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
              <h2 className="font-display text-2xl uppercase tracking-wide text-paper">
                Probetraining &amp; Anfrage
              </h2>
              <p className="mt-2 text-sm text-paper/60">
                Erzähl uns kurz, worum es geht – wir melden uns auf deinem bevorzugten Weg zurück.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <OpeningHoursTable />
              <ConsentMap />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
