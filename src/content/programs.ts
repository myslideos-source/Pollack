export type ProgramCategory = "training" | "gesundheit" | "kampfkunst" | "regeneration";

export type ProgramFact = { label: string; value: string };
export type ProgramFaqItem = { question: string; answer: string };

export type Program = {
  slug: string;
  category: ProgramCategory;
  title: string;
  summary: string;
  description: string[];
  bullets: string[];
  /** Short factual key/value strip rendered above the fold on the detail page. */
  facts?: ProgramFact[];
  /** A large pull-quote, used sparingly for editorial weight. */
  quote?: string;
  /** FAQ / safety-notice accordion, e.g. Solarium safety information. */
  faq?: ProgramFaqItem[];
  /** Real photo path, when one has been supplied — falls back to the TexturePanel otherwise. */
  image?: string;
  imageAlt?: string;
  /** Object-position percentages (0–100) for the image's crop, set in the Medienbibliothek. */
  imageFocalX?: number;
  imageFocalY?: number;
  /** Click-to-play video, shown below the description when supplied (see VideoPlayer). */
  video?: { src: string; poster: string; label: string };
  legacyPaths: string[];
  texture: "performance" | "health" | "kampfkunst" | "regeneration";
};

export const programs: Program[] = [
  {
    slug: "fitness",
    category: "training",
    title: "Fitness",
    summary: "Kraftaufbau, Kondition und Vitalität auf 1.200 m² Trainingsfläche.",
    description: [
      "Fitnesstraining im Sportpark Pollack ist mehr als Wiederholungen zählen: Es geht um Kraftaufbau, Muskelaufbau, bessere Kondition, Gewichtsreduktion und spürbar mehr Vitalität im Alltag. Auf unserer Trainingsfläche findest du alles, was modernes, gesundheitsorientiertes Muskeltraining braucht – von hochwertigen Technogym-Geräten bis zum Plate-Loaded-Bereich für schweres Training.",
      "Ob du gerade erst anfängst, wieder einsteigst oder als erfahrener Athlet trainierst – unsere Trainer:innen zeigen dir die passende Übungsauswahl und Technik, damit du sicher und effektiv an dein Ziel kommst. Das Training lässt sich individuell auf deine Ausgangslage und dein Ziel abstimmen.",
    ],
    bullets: [
      "Freihantelbereich und hochwertige Technogym-Kraftgeräte",
      "Plate-Loaded-Bereich für schweres Training",
      "Cardiozonen für Kondition und Ausdauer",
      "Individuelle Trainingsplanerstellung",
      "Einweisung und Betreuung für Einsteiger:innen",
      "Geeignet für Anfänger, Wiedereinsteiger und erfahrene Sportler",
    ],
    facts: [
      { label: "Fläche", value: "1.200 m²" },
      { label: "Zonen", value: "Freihantel, Kraftgeräte, Cardio, Plate-Loaded" },
      { label: "Für", value: "Einsteiger bis erfahrene Athleten" },
    ],
    image: "/media/training/fitness-frau.webp",
    imageAlt: "Frau trainiert am Kabelzug im Sportpark Pollack",
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
    image: "/media/training/fitness-mann.webp",
    imageAlt: "Mann trainiert an einem geführten Kraftgerät im Sportpark Pollack",
    legacyPaths: [],
    texture: "performance",
  },
  {
    slug: "plate-loaded",
    category: "training",
    title: "Plate-Loaded / Hardcore Area",
    summary: "Der Bereich für ambitioniertes, schweres Krafttraining.",
    description: [
      "In unserer Hardcore Area trainierst du mit Plate-Loaded-Maschinen und freien Gewichten dort, wo es auf Substanz statt Schnickschnack ankommt. Mit der Erweiterung 2026 wächst dieser Bereich um zusätzliche Technogym Plate-Loaded Maschinen – mehr Fläche, mehr Ausstattung, mehr Raum für schweres Training.",
    ],
    bullets: ["Plate-Loaded-Maschinen", "Freihantelbereich für schweres Training", "Erweiterung um neue Technogym Plate-Loaded Geräte"],
    image: "/media/training/hardcore-area.webp",
    imageAlt: "Die Hardcore Area mit Plate-Loaded-Maschinen und freien Gewichten im Sportpark Pollack",
    legacyPaths: [],
    texture: "performance",
  },
  {
    slug: "milon",
    category: "gesundheit",
    title: "Milon-Zirkel",
    summary: "Geführtes Zirkeltraining für Kraft und Ausdauer – gelenkschonend und zeitsparend.",
    description: [
      "Der Milon-Zirkel ist ein geführtes Zirkeltraining, das sich automatisch auf dich einstellt und dich in kurzer Zeit durch ein vollständiges Ganzkörpertraining führt. Er verbindet Kraft- und Ausdauertraining in einer Einheit – gelenkschonend, zeitsparend und für unterschiedliche Alters- und Leistungsgruppen gleichermaßen geeignet.",
      "Besonders geeignet für den (Wieder-)Einstieg ins Training, für gesundheitsorientiertes Training und als Ergänzung zum klassischen Krafttraining. Unser Team betreut dich bei der Einweisung und begleitet deinen Fortschritt.",
    ],
    bullets: [
      "Automatische Gerätevoreinstellung",
      "Kraft- und Ausdauertraining in einer Einheit",
      "Kurze, effiziente Trainingseinheiten",
      "Gelenkschonend und einsteigerfreundlich",
      "Für unterschiedliche Alters- und Leistungsgruppen",
      "Persönliche Betreuung und Einweisung",
    ],
    legacyPaths: ["/programm/milon"],
    texture: "health",
  },
  {
    slug: "five",
    category: "gesundheit",
    title: "FIVE Rücken- und Gelenkzentrum",
    summary: "Gezieltes Rücken- und Gelenkkonzept für mehr Beweglichkeit und ein starkes Muskel- und Fasziensystem.",
    description: [
      "FIVE ist ein eigenständiges Trainingskonzept speziell für Rücken und Gelenke. Im Zentrum stehen geführte Rückwärtsbewegungen an speziell dafür entwickelten Geräten – kontrolliert, sicher und gezielt auf die Muskulatur und Faszien ausgerichtet, die deinen Rücken im Alltag stützen.",
      "Mit der Erweiterung 2026 bekommt FIVE einen eigenen, rund 60 m² großen Gesundheitsbereich – bewusst separat vom Kraftraum, für konzentriertes, ruhiges Training.",
      "FIVE ersetzt keine medizinische Behandlung und wir versprechen keine Heilung. Wenn du unter anhaltenden Rückenbeschwerden leidest, sprich zusätzlich mit deiner Ärztin oder deinem Arzt. Für viele Menschen mit alltagsbedingten Verspannungen ist FIVE dagegen ein guter Weg, aktiv etwas für Rücken und Beweglichkeit zu tun.",
    ],
    bullets: [
      "Geführte Rückwärtsbewegungen für Rücken und Gelenke",
      "Kräftigt Muskel- und Fasziensystem",
      "Verbessert Beweglichkeit im Alltag",
      "Eigener, separater Gesundheitsbereich (ca. 60 m², ab Erweiterung 2026)",
      "FIVE Basic Coach vor Ort",
    ],
    facts: [
      { label: "Bereichsgröße", value: "ca. 60 m² (ab Erweiterung 2026)" },
      { label: "Ausrichtung", value: "Rücken, Gelenke, Beweglichkeit" },
    ],
    image: "/media/gesundheit/five-bambus-moos.webp",
    imageAlt: "Der neue FIVE Rücken- und Gelenkbereich mit Bambus- und Mooswänden im Sportpark Pollack",
    legacyPaths: [],
    texture: "health",
  },
  {
    slug: "inbody",
    category: "gesundheit",
    title: "InBody 270 Körperanalyse",
    summary: "Körperzusammensetzung statt Waage allein – Grundlage für Trainings- und Ernährungsberatung.",
    description: [
      "Die InBody 270 Körperzusammensetzungsanalyse zeigt dir deutlich mehr als eine Waage: Körperfettanteil, Muskel-Fett-Analyse, Wasserhaushalt, Viszeralfett sowie Protein- und Mineralgehalt – dazu deinen Grundumsatz als Orientierung für ein realistisches Zielgewicht.",
      "BMI und Körpergewicht allein zeigen nicht, woraus dein Körper wirklich besteht. Die InBody-Analyse macht Fortschritt sichtbar, auch wenn sich die Zahl auf der Waage kaum bewegt – und ist die Grundlage für eine fundierte Trainings- und Ernährungsberatung bei uns im Sportpark.",
    ],
    quote:
      "Ein Online-Rechner kann deinen Bedarf schätzen. InBody zeigt genauer, wie sich dein Körper zusammensetzt.",
    bullets: [
      "Körperfettanteil und Muskel-Fett-Analyse",
      "Wasserhaushalt und Viszeralfett",
      "Protein- und Mineralgehalt",
      "Grundumsatz als Basis für dein Zielgewicht",
      "Trainings- und Ernährungsberatung im Anschluss",
      "Verlaufskontrolle über mehrere Termine",
    ],
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
    summary: "Traditionelle Kampfkunst für Kondition, Kraft, Schnelligkeit und Konzentration.",
    description: [
      "Karate im Sportpark Pollack verbindet traditionelle Technik mit moderner Trainingsmethodik. Du trainierst Kondition, Kraft, Schnelligkeit, Beweglichkeit und Konzentration – in einer Trainingsatmosphäre, die auf Respekt und gegenseitiger Unterstützung aufbaut.",
      "Angeleitet wirst du von Jürgen Pollack, der seit 1987 in der Kampfkunst aktiv ist, den 2. DAN Karate trägt und über 200 Lehrgänge absolviert hat – mit Erfahrungen unter anderem in Boxen, Kickboxen, Krav Maga, Bodenkampf und Kyusho, die in das Training einfließen.",
    ],
    bullets: [
      "Für Einsteiger:innen und Fortgeschrittene",
      "Kondition, Kraft, Schnelligkeit, Beweglichkeit, Konzentration",
      "Respektvolle, faire Trainingsatmosphäre",
      "Angeleitet von Jürgen Pollack (Karate 2. DAN, über 200 Lehrgänge)",
      "Trainingserfahrung u. a. in Boxen, Kickboxen, Krav Maga, Bodenkampf und Kyusho",
    ],
    image: "/media/kampfkunst/karate-portrait.webp",
    imageAlt: "Karate-Trainer in Kampfstellung im Sportpark Pollack",
    video: {
      src: "/media/video/karate.mp4",
      poster: "/media/video/karate-poster.webp",
      label: "Karate-Training im Sportpark Pollack",
    },
    legacyPaths: ["/programm/karate"],
    texture: "kampfkunst",
  },
  {
    slug: "kinderkarate",
    category: "kampfkunst",
    title: "Kinderkarate",
    summary: "Karate für Kinder – Selbstvertrauen, klare Grenzen und Respekt, altersgerecht vermittelt.",
    description: [
      "Kinderkarate fördert weit mehr als Technik: Selbstvertrauen, Selbstbehauptung, das Erkennen und Setzen klarer Grenzen sowie Disziplin und Respekt im Umgang miteinander. In altersgerechten Gruppen lernen Kinder spielerisch, aber mit klarer Struktur.",
      "Dabei geht es uns nicht darum, Kindern Angst zu machen, sondern ihnen Sicherheit zu geben – auch für ganz alltägliche Situationen wie den Schulweg oder den Pausenhof. Ein selbstbewusstes Auftreten ist oft schon die beste Vorbeugung.",
    ],
    bullets: [
      "Altersgerechte Gruppen",
      "Förderung von Selbstvertrauen und Selbstbehauptung",
      "Klare Grenzen setzen und erkennen",
      "Sicherheit für Schulweg und Pausenhof",
      "Disziplin und Respekt, spielerisch vermittelt",
    ],
    image: "/media/kampfkunst/kinderkarate.webp",
    imageAlt: "Kind trainiert Kinderkarate am Kickschild im Sportpark Pollack",
    legacyPaths: ["/programm/kinderkarate"],
    texture: "kampfkunst",
  },
  {
    slug: "selbstverteidigung",
    category: "kampfkunst",
    title: "Selbstverteidigung",
    summary: "Grundlagen- und Aufbaukurs – realistisch, alltagstauglich, angeleitet von einem Gewaltschutztrainer.",
    description: [
      "Unsere Selbstverteidigungskurse sind in einen Grundlagenkurs und einen Aufbaukurs gegliedert. Im Mittelpunkt stehen Gefahrenerkennung, der bewusste Einsatz von Stimme und Körpersprache sowie Selbstbehauptung – denn die wichtigste Selbstverteidigung ist oft die Flucht aus einer gefährlichen Situation, nicht der Kampf.",
      "Ergänzend trainierst du einfache, auch unter Stress abrufbare Techniken in realistischen Stressdrills. Angeleitet wird das Training von Jürgen Pollack, ausgebildeter Selbstverteidigungslehrer und Gewaltschutztrainer. Auf Wunsch ist das Training auch als Personaltraining buchbar.",
      "Wir arbeiten bewusst ohne reißerische Aussagen oder unbelegte Kriminalstatistiken – Selbstverteidigung bei uns bedeutet Sicherheit und Handlungsfähigkeit, nicht Angstmache.",
    ],
    bullets: [
      "Grundlagenkurs und Aufbaukurs",
      "Gefahrenerkennung, Stimme und Körpersprache",
      "Selbstbehauptung – Flucht als wichtigste Option",
      "Einfache Techniken unter Stress (Stressdrills)",
      "Angeleitet von einem ausgebildeten Gewaltschutztrainer",
      "Auch als Personaltraining buchbar",
    ],
    legacyPaths: ["/programm/selbstverteidigung"],
    texture: "kampfkunst",
  },
  {
    slug: "massage",
    category: "regeneration",
    title: "Massage & brainLight",
    summary: "Individuell wählbare Entspannungsprogramme für Körper und Kopf.",
    description: [
      "Nach dem Training oder als bewusste Auszeit: In unserem eigenen Massageraum sorgt das brainLight-Regenerationssystem mit individuell wählbaren Programmen aus Massage, Licht und Ton für gezielte Entspannung.",
      "Wir formulieren hier bewusst zurückhaltend: brainLight ist ein Entspannungsangebot, keine medizinische Behandlung, und wir versprechen keine heilende Wirkung. Es geht darum, nach der Belastung loszulassen und bewusst abzuschalten.",
    ],
    bullets: [
      "brainLight-Massagesessel mit individuell wählbaren Programmen",
      "Kombination aus Massage, Licht und Ton",
      "Eigener, ruhiger Massageraum",
      "Entspannung nach dem Training",
    ],
    legacyPaths: ["/programm/massage"],
    texture: "regeneration",
  },
  {
    slug: "yoga",
    category: "regeneration",
    title: "Yoga & Kinderyoga",
    summary: "NINYASA Yoga mit Trainerin Nina – Atmung, Beweglichkeit und innere Ruhe.",
    description: [
      "Unser Yoga-Angebot läuft unter NINYASA Yoga, angeleitet von unserer Yoga- und Kinderyogalehrerin Nina. Im Mittelpunkt stehen Atemübungen, Meditation und verschiedene Yogastile – als Ausgleich zum Krafttraining oder als eigenständiges Training für Körper und Kopf.",
      "Die Kurse sind sowohl für Einsteiger:innen als auch für Fortgeschrittene geeignet. Für Kinder bieten wir eigene, altersgerechte Kinderyoga-Einheiten an.",
    ],
    bullets: [
      "NINYASA Yoga mit Trainerin Nina",
      "Atemübungen und Meditation",
      "Verschiedene Yogastile",
      "Für Einsteiger:innen und Fortgeschrittene",
      "Eigenes Kinderyoga-Angebot",
    ],
    legacyPaths: [],
    texture: "regeneration",
  },
  {
    slug: "solarium",
    category: "regeneration",
    title: "Solarium",
    summary: "Ergoline-Solarium mit UV- und Rotlicht, inklusive Hauttypenberatung.",
    description: [
      "Unser Ergoline-Solarium kombiniert UV- und Rotlicht und steht dir unabhängig vom Training zur Verfügung. Vor der ersten Nutzung beraten wir dich zu deinem Hauttyp, damit die Bestrahlungszeit zu deiner Haut passt.",
    ],
    bullets: ["Ergoline-Solarium mit UV- und Rotlicht", "Hauttypenanalyse und Beratung", "Direkt im Haus, unabhängig vom Training"],
    faq: [
      {
        question: "Ab welchem Alter darf ich das Solarium nutzen?",
        answer:
          "Die Nutzung ist gesetzlich erst ab 18 Jahren erlaubt. Wir kontrollieren das Alter vor der ersten Nutzung.",
      },
      {
        question: "Brauche ich eine UV-Schutzbrille?",
        answer:
          "Ja. Das Tragen einer geeigneten UV-Schutzbrille ist während der gesamten Anwendung Pflicht – wir stellen sie dir zur Verfügung.",
      },
      {
        question: "Gibt es gesundheitliche Einschränkungen?",
        answer:
          "Bei bestimmten Medikamenten, sehr empfindlicher Haut oder einem erhöhten Hautkrebsrisiko solltest du vor der Nutzung Rücksprache mit uns bzw. deiner Ärztin oder deinem Arzt halten. Bitte sprich uns bei Unsicherheiten vor Ort an.",
      },
    ],
    image: "/media/regeneration/solarium.webp",
    imageAlt: "Das Ergoline-Solarium im Sportpark Pollack",
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
