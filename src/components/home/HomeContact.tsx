import { Phone, Mail, MessageCircle } from "lucide-react";
import { ConsentMap } from "@/components/shared/ConsentMap";
import { ContactForm } from "@/components/shared/ContactForm";
import { loadContact } from "@/lib/content/contact";

export async function HomeContact() {
  const contact = await loadContact();
  return (
    <section id="kontakt" className="scroll-mt-20 bg-ink py-16 sm:py-24" aria-label="Kontakt und Anfahrt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">Kontakt &amp; Anfahrt</h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
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

        <div id="probetraining" className="mt-14 grid scroll-mt-20 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div id="anfrage" className="scroll-mt-20 rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
            <h3 className="font-display text-2xl uppercase tracking-wide text-paper">Probetraining &amp; Anfrage</h3>
            <p className="mt-2 text-sm text-paper/60">
              Erzähl uns kurz, worum es geht – wir melden uns auf deinem bevorzugten Weg zurück.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
          <ConsentMap />
        </div>
      </div>
    </section>
  );
}
