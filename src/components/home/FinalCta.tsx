import { MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { contact, whatsappLink } from "@/content/site";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-anthracite py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 20% 0%, rgba(228,59,50,0.18), transparent 60%), radial-gradient(50% 60% at 90% 100%, rgba(130,151,101,0.14), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-paper sm:text-6xl">
          Du musst nicht fit sein, um anzufangen.
          <br />
          <span className="text-red">Du musst nur anfangen.</span>
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/kontakt#probetraining" variant="primary">
            Probetraining vereinbaren <ChevronRight size={16} />
          </Button>
          <Button href={whatsappLink("Hallo! Ich möchte gerne ein Probetraining im Sportpark Pollack vereinbaren.")} variant="secondary">
            <MessageCircle size={16} /> Per WhatsApp schreiben
          </Button>
        </div>
        <p className="mt-6 text-sm text-paper/50">{contact.phoneDisplay} · {contact.email}</p>
      </div>
    </section>
  );
}
