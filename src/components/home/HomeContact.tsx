import { Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { ConsentMap } from "@/components/shared/ConsentMap";
import { contact } from "@/content/site";

export function HomeContact() {
  return (
    <section className="bg-ink py-16 sm:py-24" aria-label="Kontakt und Anfahrt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            Kontakt &amp; Anfahrt
          </h2>
          <Button href="/kontakt#anfrage" variant="secondary">
            Zum Kontaktformular <ArrowRight size={16} />
          </Button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <a
              href={contact.phoneHref}
              className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-anthracite p-5 text-paper hover:border-red"
            >
              <Phone size={22} className="text-red" />
              <div>
                <div className="font-display uppercase tracking-wide">Anrufen</div>
                <div className="text-sm text-paper/60">{contact.phoneDisplay}</div>
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
                <div className="text-sm text-paper/60">{contact.whatsappDisplay}</div>
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
          <ConsentMap />
        </div>
      </div>
    </section>
  );
}
