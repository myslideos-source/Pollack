import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff();
  const supabase = await createClient();

  const [{ count: inboxCount }, { count: draftCount }] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "neu"),
    supabase.from("website_drafts").select("id", { count: "exact", head: true }),
  ]);

  return (
    <AdminShell profile={profile} inboxCount={inboxCount ?? 0} draftCount={draftCount ?? 0}>
      {children}
    </AdminShell>
  );
}
