import Link from "next/link";
import { Dumbbell, LogIn, UserPlus, ClipboardList, Trophy, MessageSquare, Activity, ArrowRight } from "lucide-react";
import { ACTIVITY_LABEL, type ActivityItem, type ActivityType } from "@/lib/admin/dashboard";
import { EmptyState } from "@/components/admin/EmptyState";

const ACTIVITY_ICON: Record<ActivityType, typeof Activity> = {
  training_beendet: Dumbbell,
  check_in: LogIn,
  neu_angemeldet: UserPlus,
  plan_aktualisiert: ClipboardList,
  erfolg_erreicht: Trophy,
  nachricht_gesendet: MessageSquare,
};

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
        <h2 className="text-base font-semibold text-admin-text">Letzte Aktivitäten</h2>
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
              {activities.map((a) => {
                const Icon = ACTIVITY_ICON[a.type];
                return (
                  <tr key={a.id}>
                    <td className="py-3 pr-4 text-admin-text">
                      <Link href={a.href} className="hover:text-admin-red">
                        {a.memberName}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-admin-text-secondary">
                      <span className="flex items-center gap-2">
                        <Icon size={15} strokeWidth={1.75} className="text-admin-text-muted" aria-hidden="true" />
                        {ACTIVITY_LABEL[a.type]}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs text-admin-text-muted">{relativeTime(a.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile: compact rows, not a squeezed table */}
          <ul className="mt-4 divide-y divide-admin-divider min-[768px]:hidden">
            {activities.map((a) => {
              const Icon = ACTIVITY_ICON[a.type];
              return (
                <li key={a.id}>
                  <Link href={a.href} className="flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-admin-text-secondary">
                      <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-admin-text">{a.memberName}</span>
                      <span className="block truncate text-xs text-admin-text-muted">{ACTIVITY_LABEL[a.type]}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-admin-text-muted">{relativeTime(a.timestamp)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
