/**
 * A small, dependency-free SVG line chart — deliberately plain (one red line, a light grid,
 * no legend chrome) to match the portal's reduced, high-contrast design rather than pulling in
 * a charting library for a handful of simple trend lines.
 */
export function SparkLineChart({
  points,
  height = 140,
  formatValue,
}: {
  points: { label: string; value: number }[];
  height?: number;
  formatValue?: (v: number) => string;
}) {
  if (points.length === 0) {
    return <p className="py-8 text-center text-sm text-paper/40">Noch keine Daten in diesem Zeitraum.</p>;
  }

  const width = 600;
  const paddingX = 8;
  const paddingY = 16;
  const values = points.map((p) => p.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;

  const stepX = points.length > 1 ? (width - paddingX * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = paddingX + i * stepX;
    const y = paddingY + (1 - (p.value - min) / range) * (height - paddingY * 2);
    return { x, y, ...p };
  });

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[420px]" preserveAspectRatio="none" role="img">
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="currentColor" className="text-paper/10" strokeWidth={1} />
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" className="text-paper/5" strokeWidth={1} />
        <path d={path} fill="none" className="stroke-red" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 3.5 : 2} className="fill-red" />
        ))}
      </svg>
      <div className="mt-1 flex items-center justify-between text-[11px] text-paper/40">
        <span>{points[0]?.label}</span>
        <span className="font-medium text-paper/70">
          {formatValue ? formatValue(last.value) : last.value}
        </span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}
