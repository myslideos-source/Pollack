"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { inquirySchema, inquiryAreaLabels, type inquiryAreas } from "@/lib/validation/inquiry";
import { sendInquiryConfirmationEmail, sendInquiryNotificationEmail } from "@/lib/email";

export type InquiryActionState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

async function hashIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex");
}

async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return h.get("x-real-ip");
}

export async function submitInquiryAction(
  _prev: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  const parsed = inquirySchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    area: formData.get("area"),
    preferredDate: formData.get("preferredDate") || undefined,
    message: formData.get("message") || undefined,
    consent: formData.get("consent"),
    source: formData.get("source"),
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    // The honeypot field failing validation looks identical to any other validation error to
    // the caller — bots get no signal that they were detected.
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Bitte Eingaben prüfen." };
  }

  const data = parsed.data;
  const ip = await getClientIp();
  const ipHash = await hashIp(ip);

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_inquiry", {
    p_first_name: data.firstName,
    p_last_name: data.lastName,
    p_email: data.email,
    p_phone: data.phone ?? null,
    p_area: data.area,
    p_preferred_date: data.preferredDate ?? null,
    p_message: data.message ?? null,
    p_consent: true,
    p_source: data.source,
    p_ip_hash: ipHash,
  });

  if (error) {
    if (error.message.includes("rate_limited")) {
      return {
        status: "error",
        message: "Du hast in letzter Zeit schon mehrere Anfragen gesendet. Bitte ruf uns stattdessen kurz an.",
      };
    }
    return { status: "error", message: "Deine Anfrage konnte nicht gesendet werden. Bitte versuch es erneut." };
  }

  const areaLabel = inquiryAreaLabels[data.area as (typeof inquiryAreas)[number]];

  // Best-effort, never blocks the success response the visitor sees.
  void sendInquiryConfirmationEmail(data.email, data.firstName);
  void (async () => {
    const { data: notifyTo } = await supabase.rpc("get_notification_email");
    if (notifyTo) {
      await sendInquiryNotificationEmail({
        to: notifyTo,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        areaLabel,
        source: data.source,
      });
    }
  })();

  return { status: "success" };
}
