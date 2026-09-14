export const inquiryStatuses = [
  "neu",
  "gelesen",
  "in_bearbeitung",
  "rueckruf_geplant",
  "termin_vereinbart",
  "erledigt",
  "abgesagt",
  "spam",
] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  neu: "Neu",
  gelesen: "Gelesen",
  in_bearbeitung: "In Bearbeitung",
  rueckruf_geplant: "Rückruf geplant",
  termin_vereinbart: "Termin vereinbart",
  erledigt: "Erledigt",
  abgesagt: "Abgesagt",
  spam: "Spam",
};

export const inquiryStatusColors: Record<InquiryStatus, string> = {
  neu: "bg-red/15 text-red border-red/30",
  gelesen: "bg-paper/10 text-paper/70 border-paper/20",
  in_bearbeitung: "bg-sand/15 text-sand border-sand/30",
  rueckruf_geplant: "bg-sand/15 text-sand border-sand/30",
  termin_vereinbart: "bg-moss/15 text-moss border-moss/30",
  erledigt: "bg-moss/15 text-moss border-moss/30",
  abgesagt: "bg-paper/10 text-paper/50 border-paper/20",
  spam: "bg-paper/10 text-paper/40 border-paper/20",
};
