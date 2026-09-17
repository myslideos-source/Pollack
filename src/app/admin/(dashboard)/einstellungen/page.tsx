import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, CalendarClock, Tag, Clock, Users, Trophy, UserCog, History, ChevronRight, Inbox, Globe, Image as ImageIcon, Handshake } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";
import { StudioCapacityForm } from "./StudioCapacityForm";

export const metadata: Metadata = { title: "Einstellungen" };

const MORE_LINKS = [
  { href: "/admin/anfragen", label: "Anfragen", icon: Inbox },
  { href: "/admin/website", label: "Webseite", icon: Globe },
  { href: "/admin/medien", label: "Medien", icon: ImageIcon },
  { href: "/admin/termine", label: "Termine", icon: CalendarClock },
  { href: "/admin/angebote", label: "Angebote & Preise", icon: Tag },
  { href: "/admin/oeffnungszeiten", label: "Öffnungszeiten", icon: Clock },
  { href: "/admin/partner", label: "Partner & Produkte", icon: Handshake },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/erfolge", label: "Erfolge", icon: Trophy },
  { href: "/admin/benutzer", label: "Benutzer", icon: UserCog },
  { href: "/admin/verlauf", label: "Änderungsverlauf", icon: History },
];

export default async function EinstellungenPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: setting }, { data: capacitySetting }] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "notification_email").maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "studio_capacity").maybeSingle(),
  ]);
  const notificationEmail = typeof setting?.value === "string" ? setting.value : "";
  const studioCapacity = typeof capacitySetting?.value === "number" ? capacitySetting.value : null;
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-paper">Einstellungen</h1>
        <p className="text-sm text-paper/60">Grundeinstellungen für Benachrichtigungen und den Admin-Bereich.</p>
      </div>

      <div>
        <h2 className="font-display text-lg text-paper">Benachrichtigungen</h2>
        <div className="mt-3">
          <SettingsForm notificationEmail={notificationEmail} />
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-paper/50">
          {resendConfigured ? (
            <>
              <CheckCircle2 size={14} className="text-moss" /> E-Mail-Versand ist über Resend konfiguriert.
            </>
          ) : (
            <>
              <XCircle size={14} className="text-sand" /> Kein RESEND_API_KEY gesetzt — E-Mails werden derzeit nicht
              versendet, Anfragen werden aber weiterhin gespeichert.
            </>
          )}
        </p>
      </div>

      <div>
        <h2 className="font-display text-lg text-paper">Studio</h2>
        <div className="mt-3">
          <StudioCapacityForm capacity={studioCapacity} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg text-paper">Weitere Bereiche</h2>
        <p className="mt-1 text-sm text-paper/60">
          Nicht Teil der Hauptnavigation, aber weiterhin voll verfügbar.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {MORE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center justify-between gap-2 rounded-xl border border-paper/10 bg-anthracite px-4 py-3 text-sm text-paper/80 hover:border-paper/25 hover:text-paper"
            >
              <span className="flex items-center gap-2.5">
                <l.icon size={16} className="text-red" />
                {l.label}
              </span>
              <ChevronRight size={15} className="text-paper/30" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
