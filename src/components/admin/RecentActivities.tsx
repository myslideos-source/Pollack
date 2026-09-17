import Link from "next/link";
import { Dumbbell, LogIn, UserPlus, ClipboardList, Trophy, MessageSquare, Activity, ArrowRight, Clock } from "lucide-react";
import { ACTIVITY_LABEL, type ActivityItem, type ActivityType } from "@/lib/admin/dashboard";
import { EmptyState } from "@/components/admin/EmptyState";
import { MemberAvatar } from "@/components/sportpark/ui";

const ACTIVITY_ICON: Record<ActivityType, typeof Activity> = {
  training_beendet: Dumbbell,
  check_in: LogIn,
  neu_angemeldet: UserPlus,
  plan_aktualisiert: ClipboardList,
  erfolg_erreicht: Trophy,
  nachricht_gesendet: MessageSquare,
};

const ACTIVITY_PILL: Record<ActivityType, string> = {
  training_beendet: "border-admin-green/30 bg-admin-green/10 text-admin-green",
  check_in: "border-admin-border bg-white/[0.04] text-admin-text-secondary",
  neu_angemeldet: "border-admin-blue/30 bg-admin-blue/10 text-admin-blue",
  plan_aktualisiert: "border-admin-border bg-white/[0.04] text-admin-text-secondary",
  erfolg_erreicht: "border-[#f0a524]/30 bg-[#f0a524]/10 text-[#f0a524]",
  nachricht_gesendet: "border-admin-border bg-white/[0.04] text-admin-text-secondary",
};

function ActivityPill({ type }: { type: ActivityType }) {
  const Icon = ACTIVITY_ICON[type];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${ACTIVITY_PILL[type]}`}>
      <Icon size={13} strokeWidth={1.9} aria-hidden="true" />
      {ACTIVITY_LABEL[type]}
    </span>
  );
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  return `vor ${days} Tag${days === 1 ? "" : "en"}`;
}

export function RecentActivities({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="admin-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-base font-semibold text-admin-text">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-admin-red/30 text-admin-red">
            <Clock size={14} strokeWidth={2} aria-hidden="true" />
          </span>
          Letzte Aktivitäten
        </h2>
        <Link href="/admin/verlauf" className="flex items-center gap-1 text-xs font-medium text-admin-text-secondary hover:text-admin-text">
          Alle Aktivitäten <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {activities.length === 0 ? (
        <EmptyState icon={Activity} title="Noch keine Aktivitäten" />
      ) : (
        <>
          {/* Desktop: table */}
          <table className="mt-4 hidden w-full text-sm min-[768px]:table">
            <thead>
              <tr className="border-b border-admin-divider text-left text-xs uppercase tracking-wide text-admin-text-muted">
                <th className="py-2.5 font-medium">Mitglied</th>
                <th className="py-2.5 font-medium">Aktion</th>
                <th className="py-2.5 text-right font-medium">Zeitpunkt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-divider">
              {activities.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 pr-4">
                    <Link href={a.href} className="flex items-center gap-3 text-admin-text hover:text-admin-red">
                      <MemberAvatar fullName={a.memberName} size={36} />
                      {a.memberName}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <ActivityPill type={a.type} />
                  </td>
                  <td className="py-3 text-right text-xs text-admin-text-muted">{relativeTime(a.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: compact rows, not a squeezed table */}
          <ul className="mt-4 divide-y divide-admin-divider min-[768px]:hidden">
            {activities.map((a) => (
              <li key={a.id}>
                <Link href={a.href} className="flex items-center gap-3 py-3">
                  <MemberAvatar fullName={a.memberName} size={36} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-admin-text">{a.memberName}</span>
                    <span className="mt-1 block">
                      <ActivityPill type={a.type} />
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-admin-text-muted">{relativeTime(a.timestamp)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
