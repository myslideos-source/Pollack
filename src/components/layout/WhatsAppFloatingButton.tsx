import { MessageCircle } from "lucide-react";
import { contact } from "@/content/site";

/**
 * Persistent WhatsApp shortcut for larger screens. Hidden below `xl` — MobileCtaBar already
 * puts a WhatsApp action in the fixed bottom bar there, and Header's hamburger/overlay menu
 * (also an `xl:hidden` breakpoint) would otherwise render underneath this fixed button.
 */
export function WhatsAppFloatingButton() {
  return (
    <a
      href={contact.whatsappHref}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-moss text-ink shadow-xl transition-transform hover:scale-105 xl:flex"
      aria-label={`Per WhatsApp schreiben: ${contact.whatsappDisplay}`}
    >
      <MessageCircle size={26} />
    </a>
  );
}
