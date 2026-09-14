import { z } from "zod";

export const inquiryAreas = [
  "fitness",
  "milon",
  "five",
  "koerperanalyse",
  "karate",
  "kinderkarate",
  "selbstverteidigung",
  "yoga",
  "regeneration",
  "hansefit",
  "allgemein",
] as const;

export const inquiryAreaLabels: Record<(typeof inquiryAreas)[number], string> = {
  fitness: "Fitness",
  milon: "Milon",
  five: "FIVE",
  koerperanalyse: "Körperanalyse (InBody)",
  karate: "Karate",
  kinderkarate: "Kinderkarate",
  selbstverteidigung: "Selbstverteidigung",
  yoga: "Yoga",
  regeneration: "Regeneration",
  hansefit: "Hansefit",
  allgemein: "Allgemeine Anfrage",
};

export const inquirySources = ["kontakt", "probetraining"] as const;

export const inquirySchema = z.object({
  firstName: z.string().trim().min(1, "Bitte Vornamen angeben."),
  lastName: z.string().trim().min(1, "Bitte Nachnamen angeben."),
  email: z.string().trim().min(1, "Bitte E-Mail-Adresse angeben.").email("Ungültige E-Mail-Adresse."),
  phone: z.string().trim().max(50).optional(),
  area: z.enum(inquiryAreas),
  preferredDate: z.string().trim().max(200).optional(),
  message: z.string().trim().max(4000).optional(),
  consent: z.literal("on", { message: "Bitte der Datenschutzerklärung zustimmen." }),
  source: z.enum(inquirySources),
  // Honeypot: real visitors never fill this hidden field in; a non-empty value means a bot.
  website: z.string().max(0, "").optional(),
});
