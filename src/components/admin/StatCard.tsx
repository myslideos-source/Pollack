import Link from "next/link";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";

export type StatTrend = { label: string; tone: "positive" | "negative" | "neutral" };

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: StatTrend;
  href?: string;
}) {
  const body = (
    <div className="admin-card admin-card-interactive flex h-[142px] flex-col justify-between p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-admin-small bg-white/[0.04] text-admin-text-secondary">
          <Icon size={19} strokeWidth={1.75} />
        </span>
        {trend ? (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              trend.tone === "positive" ? "text-admin-green" : trend.tone === "negative" ? "text-admin-text-muted" : "text-admin-text-muted"
            }`}
          >
            {trend.tone === "positive" ? <ArrowUp size={12} strokeWidth={2.25} aria-hidden="true" /> : null}
            {trend.tone === "negative" ? <ArrowDown size={12} strokeWidth={2.25} aria-hidden="true" /> : null}
            {trend.label}
          </span>
        ) : null}
      </div>
      <div>
        <p className="font-display text-[28px] font-semibold leading-none text-admin-text">{value}</p>
        <p className="mt-1.5 text-sm text-admin-text-secondary">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={`${label}: ${value}`} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
