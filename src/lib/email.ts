import "server-only";

/**
 * Thin wrapper around Resend's HTTP API (no SDK dependency needed for something this small).
 * Every call is best-effort: without RESEND_API_KEY set, this silently no-ops (logs to the
 * server console only) rather than failing the request that triggered it — email notification
 * is a nice-to-have layered on top of the database write, never a precondition for it.
 */
async function sendEmail(params: { to: string; subject: string; text: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[email] RESEND_API_KEY nicht gesetzt — Versand übersprungen: "${params.subject}" an ${params.to}`);
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "Sportpark Pollack <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [params.to], subject: params.subject, text: params.text }),
    });
    if (!res.ok) {
      console.error(`[email] Resend-Versand fehlgeschlagen (${res.status}): ${await res.text()}`);
    }
  } catch (err) {
    console.error("[email] Resend-Versand fehlgeschlagen:", err);
  }
}

export async function sendInquiryConfirmationEmail(to: string, firstName: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Deine Anfrage beim Sportpark Pollack",
    text: `Hallo ${firstName},\n\nvielen Dank für deine Anfrage beim Sportpark Pollack. Wir melden uns schnellstmöglich bei dir.\n\nSportliche Grüße\nDein Sportpark-Pollack-Team`,
  });
}

export async function sendInquiryNotificationEmail(params: {
  to: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  areaLabel: string;
  source: string;
}): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: `Neue Anfrage: ${params.firstName} ${params.lastName} (${params.areaLabel})`,
    text: [
      `Neue ${params.source === "probetraining" ? "Probetraining-" : ""}Anfrage über die Website.`,
      "",
      `Name: ${params.firstName} ${params.lastName}`,
      `E-Mail: ${params.email}`,
      params.phone ? `Telefon: ${params.phone}` : null,
      `Bereich: ${params.areaLabel}`,
      "",
      "Details im Admin-Bereich unter /admin/anfragen.",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
