/**
 * Bewertungs-Kennzahlen und echte Rezensionstexte für die Trust-Elemente auf der Website.
 *
 * Anders als bei den Öffnungszeiten (nur über eine Websuche cross-referenziert) ist Rating und
 * Rezensionsanzahl hier direkt vom Auftraggeber per Screenshot aus dem echten Google-Maps-Profil
 * bestätigt: 4,9 von 5 Sternen bei 56 Bewertungen. Alle Zitate unten sind ebenfalls echte, vom
 * Auftraggeber per Screenshot übergebene Google-Rezensionen (Ulrich Vigenschows Text endet im
 * Screenshot mit „…weiterlesen“ und wird deshalb bewusst mit Ellipse zitiert statt frei
 * fortgesetzt; ein Screenshot zeigte eine Rezension ohne sichtbaren Namen — deshalb `author: null`
 * statt eines erfundenen Namens). Es gibt laut Auftraggeber noch mehr Bewertungen als hier gezeigt
 * — sobald weitere Screenshots vorliegen, hier ergänzen; nie Rezensionstexte erfinden.
 *
 * `mapsUrl` ist Googles offiziell dokumentiertes Such-URL-Format (maps/search mit `query`) und
 * funktioniert ohne Place-ID — es öffnet direkt den echten Sportpark-Pollack-Eintrag inkl. der
 * dort aktuell echten Bewertungen, über die Besucher:innen auch selbst eine Bewertung abgeben
 * können.
 */
export const googleReviews = {
  rating: 4.9,
  reviewCount: 56,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sportpark+Pollack+Hohe+Stra%C3%9Fe+12+74579+Fichtenau",
  reviews: [
    {
      author: "Ulrich Vigenschow",
      rating: 5,
      postedLabel: "vor 3 Jahren",
      quote:
        "Ein super Fitnessstudio mit sehr guter Beratung! Die Ausstattung ist erste Klasse – alles neu und gut gepflegt. Die Beratung ist super – man merkt eindeutig, dass hier das erforderliche Know-how …",
    },
    {
      author: "Benjamin Blumenstock",
      rating: 5,
      postedLabel: "vor 2 Jahren",
      quote:
        "Tolles Studio, neue Geräte, alles immer unglaublich sauber und der Besitzer lebt hier die Leidenschaft des Sports voll aus. Betreuung ist unglaublich gut und versiert.",
    },
    {
      author: "Thomas Hercher",
      rating: 5,
      postedLabel: "vor 5 Monaten",
      quote: "Gute Betreuung, sehr gute Atmosphäre.",
    },
    {
      author: null,
      rating: 5,
      postedLabel: "vor 3 Jahren",
      quote:
        "Gutes Preis-Leistungsverhältnis. Kann das Fitnessstudio nur weiterempfehlen. Fühle mich dort sehr wohl.",
    },
    {
      author: "Tobias Müller",
      rating: 5,
      postedLabel: "vor 5 Jahren",
      quote:
        "Super Fitnessstudio. Tolle Atmosphäre. In diesem Fitnessstudio ist der Trainer noch für seine Mitglieder da!!!",
    },
    {
      author: "Danny Müller",
      rating: 5,
      postedLabel: "vor 7 Jahren",
      quote: "Top Geräte und man kümmert sich um einen. Mein Junior ist dort auch im Karate und geht gerne hin.",
    },
    {
      author: "Adrian",
      rating: 5,
      postedLabel: "vor 8 Jahren",
      quote: "Es gibt genug Geräte für alle und die Musik ist auch nicht schlecht 👌💪",
    },
  ],
} as const;
