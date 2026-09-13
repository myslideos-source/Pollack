"use client";

import { motion, useReducedMotion } from "motion/react";

export type PulseZone = "performance" | "health" | "kampfkunst" | "regeneration";

const ZONE_COLOR: Record<PulseZone, string> = {
  performance: "var(--color-red)",
  health: "var(--color-moss)",
  kampfkunst: "var(--color-red)",
  regeneration: "var(--color-sand)",
};

/**
 * The recurring "Puls des Sportparks" motif: a single hairline that redraws itself
 * whenever it scrolls into view, shifting color by zone (red → moss → sand) to mark
 * the transition from performance to health to regeneration content.
 */
export function PulseLine({
  zone = "performance",
  className = "",
  dense = false,
}: {
  zone?: PulseZone;
  className?: string;
  dense?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const color = ZONE_COLOR[zone];
  const d = dense
    ? "M0 20 L60 20 L75 4 L92 36 L108 8 L124 20 L200 20 L216 32 L232 8 L248 20 L400 20"
    : "M0 20 L120 20 L145 6 L168 34 L192 6 L216 20 L400 20";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        className="h-6 w-full sm:h-8"
      >
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={prefersReducedMotion ? undefined : { pathLength: 0, opacity: 0.4 }}
          whileInView={prefersReducedMotion ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: prefersReducedMotion ? 0.9 : undefined }}
        />
      </svg>
    </div>
  );
}
