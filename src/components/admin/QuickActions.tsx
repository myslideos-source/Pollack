import Link from "next/link";
import { UserPlus, ClipboardList, MessageSquare, Trophy } from "lucide-react";

const ACTIONS = [
  { href: "/trainer/mitglieder", label: "Mitglied anlegen", icon: UserPlus, primary: true },
  { href: "/trainer", label: "Trainingsplan", icon: ClipboardList, primary: false },
  { href: "/trainer", label: "Nachricht senden", icon: MessageSquare, primary: false },
  { href: "/admin/erfolge", label: "Erfolg erstellen", icon: Trophy, primary: false },
];

export function QuickActions() {
  return (
    <div className="admin-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-admin-text">Schnellaktionen</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`admin-card-interactive flex min-h-[44px] flex-col gap-2.5 rounded-admin border border-admin-border p-4 transition-colors ${
                action.primary ? "bg-admin-red-soft" : "bg-white/[0.02]"
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-admin-small ${action.primary ? "bg-admin-red/15 text-admin-red" : "bg-white/[0.05] text-admin-text-secondary"}`}>
                <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-admin-text">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
