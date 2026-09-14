import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import type { ContactContent } from "@/lib/content/contact";

/** Fixed bottom action bar for small screens: always-reachable phone, WhatsApp, and trial CTA. */
export function MobileCtaBar({ contact }: { contact: ContactContent }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-paper/10 bg-ink/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={contact.phoneHref}
        className="flex flex-col items-center gap-1 py-2.5 text-paper/80"
      >
        <Phone size={18} />
        <span className="text-[11px] font-medium uppercase tracking-wide">Anrufen</span>
      </a>
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-1 border-x border-paper/10 py-2.5 text-moss"
      >
        <MessageCircle size={18} />
        <span className="text-[11px] font-medium uppercase tracking-wide">WhatsApp</span>
      </a>
      <a href="/kontakt#probetraining" className="flex flex-col items-center gap-1 py-2.5 text-red">
        <CalendarCheck size={18} />
        <span className="text-[11px] font-medium uppercase tracking-wide">Probetraining</span>
      </a>
    </div>
  );
}
