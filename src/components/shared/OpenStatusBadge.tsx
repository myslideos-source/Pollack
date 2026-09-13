"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/content/hours";

/**
 * Renders nothing meaningful until mounted on the client: the real open/closed
 * status depends on "now", so computing it during SSR/SSG would bake a stale
 * value into the static HTML. We render a neutral placeholder first, then swap
 * in the live status after mount, and refresh it every minute.
 */
export function OpenStatusBadge({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status || status.kind === "unconfirmed") {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-paper/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-paper/70 ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-sand" aria-hidden="true" />
        Öffnungszeiten prüfen
      </span>
    );
  }

  if (status.kind === "open") {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-moss/40 bg-moss/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-moss ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
        Jetzt geöffnet · bis {status.closesAt}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-paper/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-paper/60 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-paper/40" aria-hidden="true" />
      {status.opensOn
        ? `Geschlossen · öffnet ${status.opensOn} ${status.opensAt}`
        : status.opensAt
          ? `Geschlossen · öffnet ${status.opensAt}`
          : "Aktuell geschlossen"}
    </span>
  );
}
