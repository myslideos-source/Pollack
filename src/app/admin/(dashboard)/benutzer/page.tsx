import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { UsersManager } from "./UsersManager";

export const metadata: Metadata = { title: "Benutzer" };

export default async function BenutzerPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data: users } = await supabase.from("profiles").select("*").order("created_at");

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Benutzer</h1>
        <p className="text-sm text-paper/60">
          Admin-Zugänge verwalten. Neue Nutzer werden ausschließlich per Einladung angelegt — es gibt keine
          öffentliche Registrierung. Admins haben vollen Zugriff, Redakteure nur auf Inhalte und Anfragen.
        </p>
      </div>
      <div className="mt-6">
        <UsersManager users={users ?? []} currentUserId={profile.id} />
      </div>
    </div>
  );
}
