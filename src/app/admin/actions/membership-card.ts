"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { CARD_STATUSES } from "@/lib/membership-card/status";
import type { TablesInsert } from "@/lib/supabase/database.types";

function revalidateForMember(memberId: string) {
  revalidatePath(`/trainer/mitglieder/${memberId}`);
  revalidatePath("/trainer/mitglieder");
  revalidatePath("/mitglied/mitgliedskarte");
}

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);
const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

const cardFieldsSchema = z.object({
  memberId: z.string().uuid("Ungültiges Mitglied."),
  cardNumber: z.preprocess(emptyToUndefined, z.string().trim().max(40).optional()),
  memberSince: z.string().min(1, "Bitte ein Datum angeben."),
  tariff: z.preprocess(emptyToNull, z.string().trim().max(120).nullable()),
  validFrom: z.preprocess(emptyToNull, z.string().nullable()),
  validUntil: z.preprocess(emptyToNull, z.string().nullable()),
  status: z.enum(CARD_STATUSES as [string, ...string[]]),
  note: z.preprocess(emptyToNull, z.string().trim().max(500).nullable()),
});

function friendlyDbError(error: { code?: string; message: string }): string {
  if (error.code === "23505") return "Diese Mitgliedsnummer ist bereits vergeben.";
  return "Die Mitgliedskarte konnte nicht gespeichert werden.";
}

export type MembershipCardActionState = { error?: string; success?: boolean };

export async function createMembershipCardAction(
  _prev: MembershipCardActionState,
  formData: FormData,
): Promise<MembershipCardActionState> {
  const profile = await requireAdmin();
  const parsed = cardFieldsSchema.safeParse({
    memberId: formData.get("memberId"),
    cardNumber: formData.get("cardNumber"),
    memberSince: formData.get("memberSince"),
    tariff: formData.get("tariff"),
    validFrom: formData.get("validFrom"),
    validUntil: formData.get("validUntil"),
    status: formData.get("status"),
    note: formData.get("note"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const data = parsed.data;

  const supabase = await createClient();

  const { data: memberProfile } = await supabase.from("profiles").select("id, role").eq("id", data.memberId).maybeSingle();
  if (!memberProfile || memberProfile.role !== "mitglied") return { error: "Mitglied nicht gefunden." };

  const { data: existing } = await supabase.from("membership_cards").select("member_id").eq("member_id", data.memberId).maybeSingle();
  if (existing) return { error: "Für dieses Mitglied existiert bereits eine Mitgliedskarte." };

  const insertPayload: TablesInsert<"membership_cards"> = {
    member_id: data.memberId,
    member_since: data.memberSince,
    tariff: data.tariff,
    valid_from: data.validFrom,
    valid_until: data.validUntil,
    status: data.status,
    note: data.note,
    created_by: profile.id,
  };
  if (data.cardNumber) insertPayload.card_number = data.cardNumber;

  const { error } = await supabase.from("membership_cards").insert(insertPayload);
  if (error) return { error: friendlyDbError(error) };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "membership_card.created",
    entity_type: "membership_card",
    entity_id: data.memberId,
    summary: `Mitgliedskarte erstellt für Mitglied ${data.memberId}.`,
  });

  revalidateForMember(data.memberId);
  return { success: true };
}

const updateFieldsSchema = cardFieldsSchema.omit({ cardNumber: true }).extend({
  cardNumber: z.string().trim().min(1, "Mitgliedsnummer erforderlich."),
});

export async function updateMembershipCardAction(
  _prev: MembershipCardActionState,
  formData: FormData,
): Promise<MembershipCardActionState> {
  const profile = await requireAdmin();
  const parsed = updateFieldsSchema.safeParse({
    memberId: formData.get("memberId"),
    cardNumber: formData.get("cardNumber"),
    memberSince: formData.get("memberSince"),
    tariff: formData.get("tariff"),
    validFrom: formData.get("validFrom"),
    validUntil: formData.get("validUntil"),
    status: formData.get("status"),
    note: formData.get("note"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  const data = parsed.data;

  const supabase = await createClient();

  const { data: existingCard } = await supabase.from("membership_cards").select("status, locked_at").eq("member_id", data.memberId).maybeSingle();
  if (!existingCard) return { error: "Mitgliedskarte nicht gefunden." };

  // Only stamp/clear locked_at on an actual transition — an edit that leaves status at
  // "locked" (e.g. just changing the tariff) must not reset when the card was really locked.
  let lockedAt = existingCard.locked_at;
  if (data.status === "locked" && existingCard.status !== "locked") lockedAt = new Date().toISOString();
  if (data.status !== "locked") lockedAt = null;

  const { error } = await supabase
    .from("membership_cards")
    .update({
      card_number: data.cardNumber,
      member_since: data.memberSince,
      tariff: data.tariff,
      valid_from: data.validFrom,
      valid_until: data.validUntil,
      status: data.status,
      note: data.note,
      locked_at: lockedAt,
    })
    .eq("member_id", data.memberId);
  if (error) return { error: friendlyDbError(error) };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "membership_card.updated",
    entity_type: "membership_card",
    entity_id: data.memberId,
    summary: `Mitgliedskarte aktualisiert für Mitglied ${data.memberId}.`,
  });

  revalidateForMember(data.memberId);
  return { success: true };
}

export async function lockMembershipCardAction(memberId: string): Promise<MembershipCardActionState> {
  const profile = await requireAdmin();
  if (!z.string().uuid().safeParse(memberId).success) return { error: "Ungültiges Mitglied." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("membership_cards")
    .update({ status: "locked", locked_at: new Date().toISOString() })
    .eq("member_id", memberId);
  if (error) return { error: "Karte konnte nicht gesperrt werden." };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "membership_card.locked",
    entity_type: "membership_card",
    entity_id: memberId,
    summary: `Mitgliedskarte gesperrt für Mitglied ${memberId}.`,
  });

  revalidateForMember(memberId);
  return { success: true };
}

export async function unlockMembershipCardAction(memberId: string): Promise<MembershipCardActionState> {
  const profile = await requireAdmin();
  if (!z.string().uuid().safeParse(memberId).success) return { error: "Ungültiges Mitglied." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("membership_cards")
    .update({ status: "active", locked_at: null })
    .eq("member_id", memberId);
  if (error) return { error: "Karte konnte nicht freigegeben werden." };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "membership_card.unlocked",
    entity_type: "membership_card",
    entity_id: memberId,
    summary: `Mitgliedskarte freigegeben für Mitglied ${memberId}.`,
  });

  revalidateForMember(memberId);
  return { success: true };
}

export async function regenerateMembershipCardQrAction(memberId: string): Promise<MembershipCardActionState> {
  const profile = await requireAdmin();
  if (!z.string().uuid().safeParse(memberId).success) return { error: "Ungültiges Mitglied." };

  const supabase = await createClient();
  const { data: current } = await supabase.from("membership_cards").select("qr_token_version").eq("member_id", memberId).maybeSingle();
  if (!current) return { error: "Mitgliedskarte nicht gefunden." };

  const { error } = await supabase
    .from("membership_cards")
    .update({ qr_token: randomUUID(), qr_token_version: current.qr_token_version + 1 })
    .eq("member_id", memberId);
  if (error) return { error: "QR-Code konnte nicht neu erzeugt werden." };

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "membership_card.qr_regenerated",
    entity_type: "membership_card",
    entity_id: memberId,
    summary: `QR-Code neu erzeugt für Mitgliedskarte von Mitglied ${memberId}.`,
  });

  revalidateForMember(memberId);
  return { success: true };
}
