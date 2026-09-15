import { AlertTriangle } from "lucide-react";
import { openLegalConfirmations } from "@/content/legal-config";

/**
 * Visible, honest stand-in for missing legal data — deliberately not "[PLATZHALTER]" text
 * mixed into the actual legal sections, which could look like a real (if odd) answer to a
 * reader. Instead this renders as its own clearly-labelled callout so it's unmistakable that
 * these points still need the operator's confirmation. Renders nothing once everything is
 * confirmed. See src/content/legal-config.ts for the build-time console warning counterpart.
 */
export function LegalConfirmationNotice() {
  const open = openLegalConfirmations();
  if (open.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-sand/40 bg-sand/10 p-5">
      <p className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-sand">
        <AlertTriangle size={16} /> Noch zu bestätigende Angaben
      </p>
      <p className="mt-2 text-sm text-paper/70">
        Diese Seite ist technisch vollständig, aber inhaltlich noch nicht freigegeben. Die folgenden Punkte
        müssen vom Betreiber bestätigt (oder ergänzt) werden, bevor die Seite live geht:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-paper/70">
        {open.map((item) => (
          <li key={item.key}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
