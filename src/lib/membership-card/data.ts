import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MembershipCardStatus } from "@/lib/membership-card/status";

export type MembershipCardData = {
  memberId: string;
  fullName: string;
  cardNumber: string;
  memberSince: string;
  tariff: string | null;
  validFrom: string | null;
  validUntil: string | null;
  status: MembershipCardStatus;
  qrToken: string;
  qrTokenVersion: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  lockedAt: string | null;
};

function mapRow(
  row: {
    member_id: string;
    card_number: string;
    member_since: string;
    tariff: string | null;
    valid_from: string | null;
    valid_until: string | null;
    status: string;
    qr_token: string;
    qr_token_version: number;
    note: string | null;
    created_at: string;
    updated_at: string;
    locked_at: string | null;
  },
  fullName: string,
): MembershipCardData {
  return {
    memberId: row.member_id,
    fullName,
    cardNumber: row.card_number,
    memberSince: row.member_since,
    tariff: row.tariff,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    status: row.status as MembershipCardStatus,
    qrToken: row.qr_token,
    qrTokenVersion: row.qr_token_version,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lockedAt: row.locked_at,
  };
}

/** The signed-in member's own card, or null if none has been created yet. RLS already scopes
 *  this to the caller's own row — the `.eq` here is just so the query is indexed correctly. */
export async function loadOwnMembershipCard(memberId: string): Promise<MembershipCardData | null> {
  const supabase = await createClient();
  const [{ data: card }, { data: profile }] = await Promise.all([
    supabase.from("membership_cards").select("*").eq("member_id", memberId).maybeSingle(),
    supabase.from("profiles").select("full_name").eq("id", memberId).single(),
  ]);
  if (!card || !profile) return null;
  return mapRow(card, profile.full_name);
}

/** For the admin/trainer member-detail page. */
export async function loadMembershipCardForMember(memberId: string): Promise<MembershipCardData | null> {
  const supabase = await createClient();
  const [{ data: card }, { data: profile }] = await Promise.all([
    supabase.from("membership_cards").select("*").eq("member_id", memberId).maybeSingle(),
    supabase.from("profiles").select("full_name").eq("id", memberId).maybeSingle(),
  ]);
  if (!card) return null;
  return mapRow(card, profile?.full_name ?? "Mitglied");
}

/** Card status per member, for the admin member-list badges — one lightweight query, no join
 *  needed since the caller already has member ids + names from loadMembers(). */
export async function loadMembershipCardStatuses(memberIds: string[]): Promise<Map<string, MembershipCardStatus>> {
  const result = new Map<string, MembershipCardStatus>();
  if (memberIds.length === 0) return result;
  const supabase = await createClient();
  const { data } = await supabase.from("membership_cards").select("member_id, status").in("member_id", memberIds);
  for (const row of data ?? []) {
    result.set(row.member_id, row.status as MembershipCardStatus);
  }
  return result;
}
