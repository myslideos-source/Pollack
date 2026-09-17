export type MembershipCardStatus = "active" | "paused" | "locked" | "expired";

export const CARD_STATUSES: MembershipCardStatus[] = ["active", "paused", "locked", "expired"];

/** Shown on the card itself and in the QR overlay. */
export const CARD_STATUS_LABEL: Record<MembershipCardStatus, string> = {
  active: "Mitgliedschaft aktiv",
  paused: "Mitgliedschaft pausiert",
  locked: "Mitgliedskarte gesperrt",
  expired: "Mitgliedschaft abgelaufen",
};

/** Shown as the compact badge in the admin member list. */
export const CARD_STATUS_BADGE_LABEL: Record<MembershipCardStatus, string> = {
  active: "Karte aktiv",
  paused: "Karte pausiert",
  locked: "Karte gesperrt",
  expired: "Karte abgelaufen",
};

/** Short form for the status <select> in the admin create/edit form. */
export const CARD_STATUS_SHORT_LABEL: Record<MembershipCardStatus, string> = {
  active: "Aktiv",
  paused: "Pausiert",
  locked: "Gesperrt",
  expired: "Abgelaufen",
};

export const CARD_STATUS_COLOR: Record<MembershipCardStatus, { hex: string; text: string; bg: string }> = {
  active: { hex: "#39d98a", text: "text-[#39d98a]", bg: "bg-[#39d98a]" },
  paused: { hex: "#f0a524", text: "text-[#f0a524]", bg: "bg-[#f0a524]" },
  locked: { hex: "#e43b32", text: "text-[#e43b32]", bg: "bg-[#e43b32]" },
  expired: { hex: "#9a9a9a", text: "text-white/50", bg: "bg-white/40" },
};

/** Only an active card's QR is meant to work later for check-in — everything else must render
 *  as visibly invalid rather than silently still scanning fine. */
export function isQrValid(status: MembershipCardStatus): boolean {
  return status === "active";
}
