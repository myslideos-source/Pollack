export type ProgramCategory = "training" | "gesundheit" | "kampfkunst" | "regeneration";

export type Program = {
  slug: string;
  category: ProgramCategory;
  title: string;
  summary: string;
  description: string[];
  bullets: string[];
  legacyPaths: string[];
  texture: "performance" | "health" | "kampfkunst" | "regeneration";
};

export const programs: Program[] = [
  {
    slug: "fitness",
    category: "training",
    title: "Fitness",
    summary: "Freihanteln, Kraftgeräte und Cardio auf 1.200 m² Trainingsfläche.",
    description: [
      "Auf unserer Trainingsfläche findest du alles, was ein modernes Fitnesstraining braucht: freie Gewichte, Kraftgeräte, Cardiozonen und ausreichend Platz, um in Ruhe zu trainieren.",
      "Ob du gerade erst anfängst oder seit Jahren trainierst – unsere Trainer:innen zeigen dir die passende Übungsauswahl und Technik, damit du sicher und effektiv an dein Ziel kommst.",
    ],
    bullets: [
      "Freihantelbereich und Kraftgeräte",
      "Cardiozonen",
      "Trainingsplanerstellung auf Wunsch",
      "Einweisung für Einsteiger:innen",
    ],
    legacyPaths: ["/programm/fitness"],
    texture: "performance",
  },
  {
    slug: "technogym",
    category: "training",
    title: "Technogym",
    summary: "Premium-Geräte für präzises, gelenkschonendes Krafttraining.",
    description: [
      "Unsere Technogym-Geräte gehören zur Premiumklasse im Studiobau: präzise Bewegungsführung, hochwertige Verarbeitung und eine Auswahl, die dich vom Einstieg bis zum ambitionierten Training begleitet.",
    ],
    bullets: ["Geführte Bewegungsbahnen", "Für Einsteiger und Fortgeschrittene", "Teil der 1.200 m² Trainingsfläche"],
    legacyPaths: [],
    texture: "performance",
  },
  {
    slug: "plate-loaded",
    category: "training",
    title: "Plate-Loaded / Hardcore Area",
    summary: "Der Bereich für ambitioniertes, schweres Krafttraining.",
    description: [
      "In unserer Hardcore Area trainierst du mit Plate-Loaded-Maschinen und freien Gewichten dort, wo es auf Substanz statt Schnickschnack ankommt. Mit der Erweiterung 2026 wächst dieser Bereich um zusätzliche Technogym Plate-Loaded Maschinen.",
    ],
    bullets: ["Plate-Loaded-Maschinen", "Freihantelbereich für schweres Training", "Erweiterung um neue Technogym Plate-Loaded Geräte"],
    legacyPaths: [],
    texture: "performance",
  },
  {
    slug: "milon",
    category: "gesundheit",
    title: "Milon-Zirkel",
    summary: "Effizientes, gelenkschonendes Zirkeltraining mit automatischer Gerätesteuerung.",
    description: [
      "Der Milon-Zirkel stellt sich automatisch auf dich ein und führt dich in kurzer Zeit durch ein vollständiges, gelenkschonendes Ganzkörpertraining – ideal, wenn du effizient und mit wenig Zeitaufwand trainieren möchtest.",
      "Besonders geeignet für den (Wieder-)Einstieg ins Training, für gesundheitsorientiertes Training und als Ergänzung zum klassischen Krafttraining.",
    ],
    bullets: ["Automatische Gerätevoreinstellung", "Kurze, effiziente Trainingseinheiten", "Gelenkschonend und einsteigerfreundlich"],
    legacyPaths: ["/programm/milon"],
    texture: "health",
  },
  {
    slug: "five",
    category: "gesundheit",
    title: "FIVE Rücken- und Gelenkzentrum",
    summary: "Gezieltes Training für Rücken, Gelenke und Beweglichkeit.",
    description: [
      "FIVE ist ein medizinisch fundiertes Trainingskonzept speziell für Rücken und Gelenke. In kurzen, klar strukturierten Einheiten kräftigst und mobilisierst du gezielt die Muskulatur, die deinen Rücken im Alltag stützt.",
      "Ideal bei Verspannungen, einseitiger Belastung im Alltag oder wenn du deinem Rücken vorbeugend etwas Gutes tun willst.",
    ],
    bullets: ["Gezieltes Rücken- und Gelenktraining", "Kurze, effiziente Einheiten", "FIVE Basic Coach vor Ort"],
    legacyPaths: [],
    texture: "health",
  },
  {
    slug: "inbody",
    category: "gesundheit",
    title: "InBody 270 Körperanalyse",
    summary: "Körperzusammensetzung statt Waage allein.",
    description: [
      "Die InBody 270 Analyse zeigt dir mehr als eine Waage jemals könnte: Muskelmasse, Körperfettanteil, Wasserhaushalt und die Verteilung im Körper – segmental für Arme, Beine und Rumpf getrennt.",
      "BMI und Körpergewicht allein zeigen nicht, woraus dein Körper wirklich besteht. Die InBody-Analyse macht Fortschritt sichtbar, auch wenn sich die Zahl auf der Waage kaum bewegt.",
    ],
    bullets: ["Muskelmasse und Körperfettanteil", "Segmentale Auswertung", "Verlaufskontrolle über mehrere Termine"],
    legacyPaths: ["/programm/inbody"],
    texture: "health",
  },
  {
    slug: "probetraining",
    category: "training",
    title: "Probetraining",
    summary: "Lerne den Sportpark Pollack unverbindlich kennen.",
    description: [
      "Der beste Weg, den Sportpark Pollack kennenzulernen, ist ein Besuch vor Ort. Beim Probetraining zeigen wir dir die Trainingsfläche, hören uns dein Ziel an und finden gemeinsam heraus, welcher Bereich zu dir passt.",
    ],
    bullets: ["Unverbindlich und persönlich", "Terminvereinbarung per Telefon oder WhatsApp", "Für alle Trainingsbereiche"],
    legacyPaths: ["/Programm/Probetraining", "/programm/probetraining"],
    texture: "performance",
  },
  {
    slug: "karate",
    category: "kampfkunst",
    title: "Karate",
    summary: "Traditionelle Kampfkunst für Technik, Disziplin und Kondition.",
    description: [
      "Karate im Sportpark Pollack verbindet traditionelle Technik mit moderner Trainingsmethodik. Du trainierst Körperbeherrschung, Kondition und Konzentration – angeleitet von Jürgen Pollack, der selbst seit 1987 in der Kampfkunst aktiv ist und den 2. DAN Karate trägt.",
    ],
    bullets: ["Für Einsteiger:innen und Fortgeschrittene", "Traditionelle Technik, moderne Methodik", "Angeleitet von Jürgen Pollack (Karate 2. DAN)"],
    legacyPaths: ["/programm/karate"],
    texture: "kampfkunst",
  },
  {
    slug: "kinderkarate",
    category: "kampfkunst",
    title: "Kinderkarate",
    summary: "Karate für Kinder – Disziplin, Respekt und Selbstvertrauen.",
    description: [
      "Kinderkarate fördert weit mehr als Technik: Disziplin, Respekt, Konzentration und ein gesundes Selbstvertrauen. In altersgerechten Gruppen lernen Kinder spielerisch, aber mit klarer Struktur.",
    ],
    bullets: ["Altersgerechte Gruppen", "Förderung von Disziplin und Selbstvertrauen", "Spielerisches, strukturiertes Training"],
    legacyPaths: ["/programm/kinderkarate"],
    texture: "kampfkunst",
  },
  {
    slug: "selbstverteidigung",
    category: "kampfkunst",
    title: "Selbstverteidigung",
    summary: "Realistische Selbstverteidigung, angeleitet von einem Gewaltschutztrainer.",
    description: [
      "In den Selbstverteidigungskursen lernst du realistische, alltagstaugliche Techniken – angeleitet von Jürgen Pollack, ausgebildeter Selbstverteidigungslehrer und Gewaltschutztrainer mit Weiterbildungen unter anderem in Boxen, Kyusho und Krav Maga.",
    ],
    bullets: ["Alltagstaugliche Techniken", "Angeleitet von einem Gewaltschutztrainer", "Für unterschiedliche Erfahrungsstufen"],
    legacyPaths: ["/programm/selbstverteidigung"],
    texture: "kampfkunst",
  },
  {
    slug: "massage",
    category: "regeneration",
    title: "Massage & brainLight",
    summary: "Gezielte Entspannung für Körper und Kopf.",
    description: [
      "Nach dem Training oder als bewusste Auszeit: Im brainLight-Massagesessel lässt du Verspannungen los und schaltest bewusst ab.",
    ],
    bullets: ["brainLight-Massagesessel", "Entspannung nach dem Training", "Kurze Auszeiten im Alltag"],
    legacyPaths: ["/programm/massage"],
    texture: "regeneration",
  },
  {
    slug: "yoga",
    category: "regeneration",
    title: "Yoga & Kinderyoga",
    summary: "Beweglichkeit, Atmung und innere Ruhe.",
    description: [
      "Yoga bringt Beweglichkeit, bewusste Atmung und Ruhe in deinen Alltag – als Ausgleich zum Krafttraining oder als eigenständiges Training für Körper und Kopf. Auch für Kinder bieten wir eigene Yoga-Einheiten an.",
    ],
    bullets: ["Für Erwachsene und Kinder", "Beweglichkeit und Atmung", "Ausgleich zum Krafttraining"],
    legacyPaths: [],
    texture: "regeneration",
  },
  {
    slug: "solarium",
    category: "regeneration",
    title: "Solarium",
    summary: "Solarium für dazwischen.",
    description: ["Direkt im Sportpark verfügbar, unabhängig vom Training nutzbar."],
    bullets: ["Direkt im Haus"],
    legacyPaths: ["/solarium"],
    texture: "regeneration",
  },
];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}

export function programsByCategory(category: ProgramCategory) {
  return programs.filter((p) => p.category === category);
}
