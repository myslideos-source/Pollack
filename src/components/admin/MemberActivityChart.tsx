"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartNoAxesCombined } from "lucide-react";
import type { DailyActivityPoint } from "@/lib/admin/dashboard";
import { dateKeyBerlin } from "@/lib/admin/dateKey";
import { EmptyState } from "@/components/admin/EmptyState";

const FILTERS = ["week", "last_week", "month", "30d"] as const;
type FilterKey = (typeof FILTERS)[number];

const FILTER_LABEL: Record<FilterKey, string> = {
  week: "Diese Woche",
  last_week: "Letzte Woche",
  month: "Dieser Monat",
  "30d": "Letzte 30 Tage",
};

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function mondayOf(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
  return date;
}

function buildSeries(byDate: Map<string, number>, filter: FilterKey): { label: string; count: number }[] {
  const today = new Date();

  if (filter === "week" || filter === "last_week") {
    const monday = mondayOf(today);
    if (filter === "last_week") monday.setDate(monday.getDate() - 7);
    return WEEKDAY_LABELS.map((label, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return { label, count: byDate.get(dateKeyBerlin(d)) ?? 0 };
    });
  }

  if (filter === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const dayCount = today.getDate();
    return Array.from({ length: dayCount }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return { label: String(d.getDate()), count: byDate.get(dateKeyBerlin(d)) ?? 0 };
    });
  }

  const start = new Date(today);
  start.setDate(start.getDate() - 29);
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return { label: `${d.getDate()}.${d.getMonth() + 1}.`, count: byDate.get(dateKeyBerlin(d)) ?? 0 };
  });
}

export function MemberActivityChart({ points }: { points: DailyActivityPoint[] }) {
  const [filter, setFilter] = useState<FilterKey>("week");
  const byDate = useMemo(() => new Map(points.map((p) => [p.date, p.count])), [points]);
  const series = useMemo(() => buildSeries(byDate, filter), [byDate, filter]);
  const hasAnyData = points.some((p) => p.count > 0);

  return (
    <div id="mitgliederaktivitaet" className="admin-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-admin-text">Mitgliederaktivität</h2>
          <p className="mt-0.5 text-xs text-admin-text-muted">Anzahl der aktiven Mitglieder pro Tag</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-admin-border bg-white/[0.02] p-1" role="group" aria-label="Zeitraum wählen">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "bg-admin-red-soft text-admin-red" : "text-admin-text-muted hover:text-admin-text-secondary"
              }`}
            >
              {FILTER_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      {hasAnyData ? (
        <>
          <div key={filter} className="animate-admin-fade-in mt-5 h-64 motion-reduce:animate-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="admin-activity-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--admin-red)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="var(--admin-red)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--admin-divider)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--admin-text-muted)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--admin-border)" }}
                  tickLine={false}
                  interval={filter === "month" || filter === "30d" ? "preserveStartEnd" : 0}
                />
                <YAxis allowDecimals={false} tick={{ fill: "var(--admin-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  cursor={{ stroke: "var(--admin-border-hover)" }}
                  contentStyle={{ background: "var(--admin-card-elevated)", border: "1px solid var(--admin-border)", borderRadius: 10, color: "var(--admin-text)", fontSize: 12 }}
                  labelStyle={{ color: "var(--admin-text-muted)" }}
                  formatter={(value) => [`${value} Mitglieder`, "Aktiv"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--admin-red)"
                  strokeWidth={2}
                  fill="url(#admin-activity-fill)"
                  dot={{ r: 2.5, fill: "var(--admin-red)", strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">{series.map((s) => `${s.label}: ${s.count} aktive Mitglieder. `).join("")}</p>
        </>
      ) : (
        <div className="mt-5 flex h-64 items-center justify-center">
          <EmptyState icon={ChartNoAxesCombined} title="Noch keine Aktivitätsdaten verfügbar" />
        </div>
      )}
    </div>
  );
}
