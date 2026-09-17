import type { Metadata } from "next";
import Link from "next/link";
import { Download, ShieldCheck, FileText, Trophy, ChevronRight, CreditCard } from "lucide-react";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { loadMemberProfile } from "@/lib/member/data";
import { signOutSharedAction } from "@/app/actions/member-auth";
import { ProfileActions } from "./ProfileActions";
import { BodyMeasurementForm } from "./BodyMeasurementForm";
import { InstallAppMenuItem } from "@/components/member/InstallAppMenuItem";

export const metadata: Metadata = { title: "Profil" };

const EXPERIENCE_LABEL: Record<string, string> = { einsteiger: "Einsteiger", fortgeschritten: "Fortgeschritten", erfahren: "Erfahren" };
const INTENSITY_LABEL: Record<string, string> = { locker: "Locker", moderat: "Moderat", fordernd: "Fordernd" };

export default async function ProfilPage() {
  const profile = await requireMember();
  const member = await loadMemberProfile(profile.id);
  const supabase = await createClient();

  const [{ data: latestConsent }, { data: measurements }] = await Promise.all([
    supabase
      .from("health_consents")
      .select("event, created_at")
      .eq("member_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("body_measurements")
      .select("id, measured_at, weight_kg, body_fat_pct, notes")
      .eq("member_id", profile.id)
      .order("measured_at", { ascending: false })
      .limit(8),
  ]);

  const consentActive = latestConsent?.event === "granted";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Dein Profil</h1>
      <p className="mt-1 text-sm text-paper/60">{profile.email}</p>

      <Link
        href="/mitglied/mitgliedskarte"
        className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-paper/10 bg-anthracite p-4 hover:border-paper/25"
      >
        <span className="flex items-center gap-3">
          <CreditCard size={18} className="text-red" />
          <span className="text-sm text-paper">Mitgliedskarte</span>
        </span>
        <ChevronRight size={16} className="text-paper/30" />
      </Link>

      <Link
        href="/mitglied/erfolge"
        className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-paper/10 bg-anthracite p-4 hover:border-paper/25"
      >
        <span className="flex items-center gap-3">
          <Trophy size={18} className="text-red" />
          <span className="text-sm text-paper">Meine Erfolge</span>
        </span>
        <ChevronRight size={16} className="text-paper/30" />
      </Link>

      <div className="mt-3">
        <InstallAppMenuItem />
      </div>

      {member ? (
        <section className="mt-6 rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="font-display text-sm uppercase tracking-wide text-paper/60">Stammdaten</h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-paper/40">Ziel</dt>
              <dd className="mt-0.5 text-paper">{member.goal ?? "–"}</dd>
            </div>
            <div>
              <dt className="text-paper/40">Erfahrung</dt>
              <dd className="mt-0.5 text-paper">{member.experienceLevel ? EXPERIENCE_LABEL[member.experienceLevel] : "–"}</dd>
            </div>
            <div>
              <dt className="text-paper/40">Intensität</dt>
              <dd className="mt-0.5 text-paper">{member.intensityPreference ? INTENSITY_LABEL[member.intensityPreference] : "–"}</dd>
            </div>
            <div>
              <dt className="text-paper/40">Größe</dt>
              <dd className="mt-0.5 text-paper">{member.heightCm ? `${member.heightCm} cm` : "–"}</dd>
            </div>
            <div>
              <dt className="text-paper/40">Gewicht</dt>
              <dd className="mt-0.5 text-paper">{member.weightKg ? `${member.weightKg} kg` : "–"}</dd>
            </div>
            <div>
              <dt className="text-paper/40">Trainer</dt>
              <dd className="mt-0.5 text-paper">{member.assignedTrainerName ?? "–"}</dd>
            </div>
          </dl>
          {member.healthNotes ? (
            <p className="mt-3 text-xs text-paper/50">
              <span className="text-paper/70">Beschwerden/Verletzungen:</span> {member.healthNotes}
            </p>
          ) : null}
        </section>
      ) : null}

      <section id="koerperwerte" className="mt-4 scroll-mt-20 rounded-2xl border border-paper/10 bg-anthracite p-5">
        <h2 className="font-display text-sm uppercase tracking-wide text-paper/60">Körperwerte</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {(measurements ?? []).length === 0 ? (
            <li className="text-sm text-paper/40">Noch keine Werte eingetragen.</li>
          ) : (
            (measurements ?? []).map((m) => (
              <li key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-paper/50">{new Date(m.measured_at).toLocaleDateString("de-DE")}</span>
                <span className="text-paper">
                  {m.weight_kg ? `${m.weight_kg} kg` : ""}
                  {m.body_fat_pct ? ` · ${m.body_fat_pct}% KF` : ""}
                </span>
              </li>
            ))
          )}
        </ul>
        <BodyMeasurementForm />
      </section>

      <section className="mt-4 rounded-2xl border border-paper/10 bg-anthracite p-5">
        <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper/60">
          <ShieldCheck size={15} /> Datenschutz
        </h2>
        <p className="mt-2 text-sm text-paper/70">
          Einwilligung zur Verarbeitung deiner Gesundheitsangaben:{" "}
          <span className={consentActive ? "text-moss" : "text-sand"}>{consentActive ? "aktiv" : "widerrufen"}</span>
        </p>
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-paper/10 bg-ink p-3 text-xs text-paper/50">
          Die Inhalte und Trainingspläne ersetzen keine medizinische Beratung. Bei akuten Beschwerden oder
          gesundheitlichen Einschränkungen ist vor dem Training ärztlicher Rat einzuholen.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/mitglied/export"
            className="flex items-center gap-1.5 rounded-full border border-paper/20 px-4 py-2 text-sm text-paper hover:border-paper/40"
          >
            <Download size={14} /> Meine Daten exportieren
          </a>
          <ProfileActions consentActive={consentActive} />
        </div>
        <Link
          href="/datenschutz"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-paper/50 underline underline-offset-2 hover:text-paper"
        >
          <FileText size={14} /> Vollständige Datenschutzerklärung lesen
        </Link>
      </section>

      <form action={signOutSharedAction} className="mt-4">
        <button type="submit" className="w-full rounded-2xl border border-paper/10 bg-anthracite p-4 text-center text-sm text-paper/70 hover:border-paper/25 hover:text-paper">
          Abmelden
        </button>
      </form>
    </div>
  );
}
