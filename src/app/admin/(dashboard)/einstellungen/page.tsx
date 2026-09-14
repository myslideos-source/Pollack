import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Einstellungen" };

export default async function EinstellungenPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: setting } = await supabase.from("site_settings").select("value").eq("key", "notification_email").maybeSingle();
  const notificationEmail = typeof setting?.value === "string" ? setting.value : "";
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
    </div>
  );
}
