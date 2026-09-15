import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PrintButton } from "@/components/shared/PrintButton";

export type LegalSectionEntry = { id: string; label: string };

/**
 * Shared shell for /impressum and /datenschutz: readable max-width column, a jump-to
 * table of contents built from the same section list the page passes to its <LegalSection>s
 * (so TOC and headings can never drift apart), a print button, and the "last updated" date
 * required by the brief. Kept print-friendly via the `print:hidden` classes on the chrome
 * (also applied to Header/Footer/MobileCtaBar/WhatsAppFloatingButton/CookieBanner) so a
 * printout shows just the legal text, not site navigation.
 */
export function LegalPageShell({
  lastUpdated,
  sections,
  children,
}: {
  lastUpdated: string;
  sections: LegalSectionEntry[];
  children: React.ReactNode;
}) {
  return (
    <section className="bg-ink py-10 sm:py-14">
      <Container className="max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-paper/60 hover:text-paper">
            <ChevronLeft size={16} /> Zurück zur Startseite
          </Link>
          <PrintButton />
        </div>

        <p className="mt-6 text-xs uppercase tracking-wide text-paper/40">Zuletzt aktualisiert: {lastUpdated}</p>

        <nav aria-label="Inhaltsverzeichnis" className="mt-6 rounded-2xl border border-paper/10 bg-anthracite p-5 print:hidden">
          <p className="font-display text-xs uppercase tracking-wide text-paper/50">Inhaltsverzeichnis</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-paper/70 hover:text-red">
                  {i + 1}. {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 max-w-none text-[15px] leading-relaxed text-paper/80 [&_a]:text-red [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-red-dark [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-paper [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-paper [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5">
          {children}
        </div>
      </Container>
    </section>
  );
}

export function LegalSection({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2>{label}</h2>
      {children}
    </section>
  );
}
