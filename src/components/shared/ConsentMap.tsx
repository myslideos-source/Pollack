"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { contact } from "@/content/site";

/**
 * Privacy-friendly by default: no third-party map is loaded until the visitor actively
 * opts in. Before consent we show a static address card and a plain outbound link to
 * Google Maps (a user-initiated navigation, not an embed, so it needs no consent gate).
 */
export function ConsentMap() {
  const [consented, setConsented] = useState(false);
  const query = encodeURIComponent(`${contact.street}, ${contact.zip} ${contact.city}`);

  if (consented) {
    return (
      <div className="overflow-hidden rounded-2xl border border-paper/10">
        <iframe
          title="Karte: Sportpark Pollack"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${contact.lng - 0.01}%2C${contact.lat - 0.008}%2C${contact.lng + 0.01}%2C${contact.lat + 0.008}&layer=mapnik&marker=${contact.lat}%2C${contact.lng}`}
          className="h-80 w-full"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
      <MapPin size={24} className="text-red" />
      <div>
        <p className="text-paper">
          {contact.street}
          <br />
          {contact.zip} {contact.city}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setConsented(true)}
          className="rounded-full border border-paper/30 px-4 py-2 text-sm text-paper hover:border-paper/60"
        >
          Karte laden (OpenStreetMap)
        </button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm text-paper hover:bg-red-dark"
        >
          Route in Google Maps öffnen <ExternalLink size={14} />
        </a>
      </div>
      <p className="text-xs text-paper/40">
        Beim Laden der Karte wird eine Verbindung zu OpenStreetMap hergestellt. Details siehe
        Datenschutzerklärung.
      </p>
    </div>
  );
}
