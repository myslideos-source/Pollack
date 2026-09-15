import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/components/member/MessageThread";
import { sendCoachMessageAction } from "@/app/mitglied/actions";

export const metadata: Metadata = { title: "Nachrichten" };

export default async function NachrichtenPage() {
  const profile = await requireMember();
  const supabase = await createClient();

  const { data } = await supabase
    .from("coach_messages")
    .select("id, sender_id, sender_role, body, created_at")
    .eq("member_id", profile.id)
    .order("created_at", { ascending: true });

  const senderIds = Array.from(new Set((data ?? []).map((m) => m.sender_id)));
  const { data: senders } = senderIds.length > 0 ? await supabase.from("profiles").select("id, full_name").in("id", senderIds) : { data: [] };
  const nameById = new Map((senders ?? []).map((s) => [s.id, s.full_name]));

  const messages = (data ?? []).map((m) => ({
    id: m.id,
    senderRole: m.sender_role,
    senderName: nameById.get(m.sender_id) ?? (m.sender_role === "trainer" ? "Trainer" : "Du"),
    body: m.body,
    createdAt: m.created_at,
    mine: m.sender_id === profile.id,
  }));

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 py-6 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-paper">Nachrichten</h1>
      <p className="mt-1 text-sm text-paper/60">Direkter Kontakt zu deinem Trainerteam.</p>
      <MessageThread messages={messages} sendAction={sendCoachMessageAction} />
    </div>
  );
}
