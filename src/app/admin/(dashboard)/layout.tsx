import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import type { AdminNotification } from "@/components/admin/NotificationMenu";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff();
  const supabase = await createClient();

  const [{ count: draftCount }, { data: newInquiries }, { data: unreadMessages }, { count: unreadMessageCount }] = await Promise.all([
    supabase.from("website_drafts").select("id", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("id, first_name, last_name, created_at")
      .eq("status", "neu")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("coach_messages")
      .select("id, body, created_at, member:profiles!coach_messages_member_id_fkey(full_name)")
      .eq("sender_role", "member")
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("coach_messages").select("id", { count: "exact", head: true }).eq("sender_role", "member").is("read_at", null),
  ]);

  const notifications: AdminNotification[] = [
    ...(newInquiries ?? []).map((i) => ({
      id: `inquiry-${i.id}`,
      title: `Neue Anfrage von ${i.first_name} ${i.last_name}`,
      subtitle: "Anfragen",
      createdAt: i.created_at,
      href: `/admin/anfragen?open=${i.id}`,
    })),
    ...(unreadMessages ?? []).map((m) => ({
      id: `message-${m.id}`,
      title: `Neue Nachricht von ${(m.member as unknown as { full_name: string } | null)?.full_name ?? "Mitglied"}`,
      subtitle: m.body.length > 60 ? `${m.body.slice(0, 60)}…` : m.body,
      createdAt: m.created_at,
      href: "/trainer",
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <AdminShell profile={profile} draftCount={draftCount ?? 0} notifications={notifications} unreadMessageCount={unreadMessageCount ?? 0}>
      {children}
    </AdminShell>
  );
}
