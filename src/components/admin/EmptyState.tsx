import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  action,
}: {
  icon: LucideIcon;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <Icon size={20} className="text-admin-text-muted" aria-hidden="true" />
      <p className="text-sm text-admin-text-secondary">{title}</p>
      {action ? (
        <a href={action.href} className="mt-1 text-xs font-medium text-admin-red hover:text-admin-red-dark">
          {action.label}
        </a>
      ) : null}
    </div>
  );
}
