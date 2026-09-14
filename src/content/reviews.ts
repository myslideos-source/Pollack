/**
 * Bewertungs-Kennzahlen für die Trust-Badges auf der Website.
 *
 * Direkter Zugriff auf das Google-Business-Profil war aus dieser Umgebung nicht möglich
 * (dieselbe Netzwerk-Restriktion wie bei den Öffnungszeiten, siehe TODO_CLIENT.md Punkt 1+4).
 * Rating und Anzahl unten stammen aus einer Websuche, die zwei unabhängige Verzeichnis-Einträge
 * (11880.de, golocal.de) übereinstimmend mit 5,0 von 5 Sternen bei 6 Bewertungen zeigt — beide
 * Plattformen zeigen üblicherweise dieselben Zahlen wie das Google-Profil, das wurde hier aber
 * nicht per Screenshot aus Google selbst verifiziert. Bitte kurz gegenchecken (TODO_CLIENT.md
 * Punkt 18) und bei Abweichung `rating`/`reviewCount` anpassen.
 *
 * `mapsUrl` ist Googles offiziell dokumentiertes Such-URL-Format (maps/search mit `query`) und
 * funktioniert ohne Place-ID — es öffnet direkt den echten Sportpark-Pollack-Eintrag inkl. der
 * dort aktuell echten Bewertungen, über die Besucher:innen auch selbst eine Bewertung abgeben
 * können.
 */
export const googleReviews = {
  rating: 5.0,
  reviewCount: 6,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sportpark+Pollack+Hohe+Stra%C3%9Fe+12+74579+Fichtenau",
} as const;
