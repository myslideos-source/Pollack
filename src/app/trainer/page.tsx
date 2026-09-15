import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, MessageCircle, AlertTriangle, Calendar, UserPlus, ChevronRight } from "lucide-react";
import { requireTrainerOrAdmin } from "@/lib/auth";
import { loadTrainerDashboard } from "@/lib/trainer/data";

export const metadata: Metadata = { title: "Übersicht" };

export default async function TrainerDashboardPage() {
  const profile = await requireTrainerOrAdmin();
  const stats = await loadTrainerDashboard(profile.role === "admin" ? {} : { onlyTrainerId: profile.id });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Übersicht</h1>
      <p className="mt-1 text-paper/60">
        {profile.role === "admin" ? "Alle Mitglieder im Überblick." : "Deine zugewiesenen Mitglieder im Überblick."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper/60">
            <ClipboardList size={15} className="text-sand" /> Pläne ohne Freigabe ({stats.pendingPlans.length})
          </h2>
          {stats.pendingPlans.length === 0 ? (
            <p className="mt-3 text-sm text-paper/40">Keine offenen Freigaben.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {stats.pendingPlans.map((p) => (
                <li key={p.id}>
                  <Link href={`/trainer/mitglieder/${p.memberId}`} className="flex items-center justify-between text-sm text-paper/80 hover:text-paper">
                    {p.memberName}
                    <ChevronRight size={14} className="text-paper/30" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper/60">
            <MessageCircle size={15} className="text-sand" /> Offene Änderungsanfragen ({stats.openChangeRequests.length})
          </h2>
          {stats.openChangeRequests.length === 0 ? (
            <p className="mt-3 text-sm text-paper/40">Keine offenen Anfragen.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {stats.openChangeRequests.map((c) => (
                <li key={c.id}>
                  <Link href={`/trainer/mitglieder/${c.memberId}`} className="block text-sm text-paper/80 hover:text-paper">
                    <span className="font-medium">{c.memberName}</span>
                    <span className="block truncate text-paper/50">{c.message}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper/60">
            <AlertTriangle size={15} className="text-sand" /> Inaktiv seit 14+ Tagen ({stats.inactiveMembers.length})
          </h2>
          {stats.inactiveMembers.length === 0 ? (
            <p className="mt-3 text-sm text-paper/40">Alle Mitglieder trainieren regelmäßig.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {stats.inactiveMembers.slice(0, 6).map((m) => (
                <li key={m.id}>
                  <Link href={`/trainer/mitglieder/${m.id}`} className="flex items-center justify-between text-sm text-paper/80 hover:text-paper">
                    {m.fullName}
                    <ChevronRight size={14} className="text-paper/30" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper/60">
            <MessageCircle size={15} className="text-sand" /> Neue Rückmeldungen ({stats.unreadMessages.length})
          </h2>
          {stats.unreadMessages.length === 0 ? (
            <p className="mt-3 text-sm text-paper/40">Keine ungelesenen Nachrichten.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {stats.unreadMessages.slice(0, 6).map((m, i) => (
                <li key={i}>
                  <Link href={`/trainer/mitglieder/${m.memberId}`} className="block text-sm text-paper/80 hover:text-paper">
                    <span className="font-medium">{m.memberName}</span>
                    <span className="block truncate text-paper/50">{m.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper/60">
            <Calendar size={15} className="text-sand" /> Anstehende Körperanalysen ({stats.upcomingAnalyses.length})
          </h2>
          {stats.upcomingAnalyses.length === 0 ? (
            <p className="mt-3 text-sm text-paper/40">Nichts in den nächsten 14 Tagen.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {stats.upcomingAnalyses.map((a) => (
                <li key={a.memberId}>
                  <Link href={`/trainer/mitglieder/${a.memberId}`} className="flex items-center justify-between text-sm text-paper/80 hover:text-paper">
                    {a.memberName}
                    <span className="text-paper/50">{new Date(a.date).toLocaleDateString("de-DE")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-paper/10 bg-anthracite p-5">
          <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper/60">
            <UserPlus size={15} className="text-sand" /> Ohne aktiven Plan ({stats.newMembers.length})
          </h2>
          {stats.newMembers.length === 0 ? (
            <p className="mt-3 text-sm text-paper/40">Alle Mitglieder haben einen aktiven Plan.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {stats.newMembers.map((m) => (
                <li key={m.id}>
                  <Link href={`/trainer/mitglieder/${m.id}`} className="flex items-center justify-between text-sm text-paper/80 hover:text-paper">
                    {m.fullName}
                    <ChevronRight size={14} className="text-paper/30" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
