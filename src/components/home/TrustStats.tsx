"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** Parses the admin-editable "1.200 m² · moderne Trainingsfläche" list format back into parts. */
function parseStat(item: string): { value: string; unit: string; label: string } {
  const [valueUnit = "", label = ""] = item.split(" · ");
  const match = valueUnit.match(/^([\d.,]+\+?)\s*(.*)$/);
  return { value: match?.[1] ?? valueUnit, unit: match?.[2] ?? "", label };
}

function StatValue({ value, unit, animate = true }: { value: string; unit: string; animate?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  const isNumeric = animate && !Number.isNaN(numeric) && numeric > 0;
  const [display, setDisplay] = useState(isNumeric && !reduceMotion ? 0 : numeric || 0);

  useEffect(() => {
    if (!inView || !isNumeric || reduceMotion) return;
    const duration = 900;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(numeric * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, isNumeric, numeric, reduceMotion]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
      {isNumeric ? (reduceMotion ? numeric : display).toLocaleString("de-DE") : value}
      {value.includes("+") && isNumeric ? "+" : ""}
      {unit}
    </span>
  );
}

export function TrustStats({ items }: { items: string[] }) {
  const stats = items.map(parseStat);
  return (
    <section className="border-y border-paper/10 bg-anthracite" aria-label="Sportpark Pollack in Zahlen">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:gap-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <StatValue value={stat.value} unit={stat.unit} animate={!stat.label.startsWith("Erfahrung")} />
            <span className="text-sm text-paper/60">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
