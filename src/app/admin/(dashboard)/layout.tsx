import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff();
  const supabase = await createClient();

  const [{ count: inboxCount }, { count: draftCount }] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "neu"),
    supabase.from("website_drafts").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-ink">
      <AdminSidebar profile={profile} inboxCount={inboxCount ?? 0} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar profile={profile} draftCount={draftCount ?? 0} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
