import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireTrainerOrAdmin } from "@/lib/auth";
import { loadMembers } from "@/lib/trainer/data";
import { MemberListFilter } from "./MemberListFilter";
import { InviteMemberForm } from "./InviteMemberForm";

export const metadata: Metadata = { title: "Mitglieder" };

const STATUS_LABEL: Record<string, string> = {
  active: "Aktiver Plan",
  pending_review: "Wartet auf Freigabe",
  change_requested: "Änderung angefragt",
};

export default async function TrainerMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const profile = await requireTrainerOrAdmin();
  const { q } = await searchParams;
  const members = await loadMembers(profile.role === "admin" ? {} : { onlyTrainerId: profile.id });

  const filtered = q
    ? members.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q.toLowerCase()) || (m.goal ?? "").toLowerCase().includes(q.toLowerCase()),
      )
    : members;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Mitglieder</h1>
      <MemberListFilter initialQuery={q ?? ""} />
      {profile.role === "admin" ? <InviteMemberForm /> : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-paper/10 bg-anthracite">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper/10 text-left text-xs uppercase tracking-wide text-paper/40">
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 sm:table-cell">Ziel</th>
              <th className="hidden px-4 py-3 md:table-cell">Plan</th>
              <th className="hidden px-4 py-3 lg:table-cell">Letztes Training</th>
              {profile.role === "admin" ? <th className="hidden px-4 py-3 lg:table-cell">Trainer</th> : null}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-paper/5 last:border-0 hover:bg-paper/5">
                <td className="px-4 py-3 text-paper">{m.fullName}</td>
                <td className="hidden px-4 py-3 text-paper/60 sm:table-cell">{m.goal ?? "–"}</td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${m.activePlanStatus === "active" ? "bg-moss/10 text-moss" : "bg-sand/10 text-sand"}`}>
                    {m.activePlanStatus ? STATUS_LABEL[m.activePlanStatus] ?? m.activePlanStatus : "Kein Plan"}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-paper/60 lg:table-cell">
                  {m.lastTrainingAt ? new Date(m.lastTrainingAt).toLocaleDateString("de-DE") : "–"}
                </td>
                {profile.role === "admin" ? (
                  <td className="hidden px-4 py-3 text-paper/60 lg:table-cell">{m.trainerName ?? "–"}</td>
                ) : null}
                <td className="px-4 py-3 text-right">
                  <Link href={`/trainer/mitglieder/${m.id}`} className="inline-flex items-center gap-1 text-xs text-red hover:text-red-dark">
                    Öffnen <ChevronRight size={13} />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-paper/40">
                  Keine Mitglieder gefunden.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
