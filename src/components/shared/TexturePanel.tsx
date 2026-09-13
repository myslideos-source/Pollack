export type TextureVariant =
  | "performance"
  | "health"
  | "kampfkunst"
  | "regeneration"
  | "community";

const VARIANT_STYLES: Record<
  TextureVariant,
  { from: string; via: string; to: string; grid: string }
> = {
  performance: {
    from: "#151717",
    via: "#2a1414",
    to: "#090a0a",
    grid: "rgba(228,59,50,0.16)",
  },
  health: {
    from: "#1c2018",
    via: "#252b1f",
    to: "#151717",
    grid: "rgba(130,151,101,0.2)",
  },
  kampfkunst: {
    from: "#151717",
    via: "#241010",
    to: "#090a0a",
    grid: "rgba(228,59,50,0.14)",
  },
  regeneration: {
    from: "#1a1c17",
    via: "#232419",
    to: "#151717",
    grid: "rgba(200,185,149,0.22)",
  },
  community: {
    from: "#171717",
    via: "#201a17",
    to: "#0f0f0f",
    grid: "rgba(200,185,149,0.14)",
  },
};

/**
 * Placeholder visual surface used where the real Sportpark photography/video has not
 * yet been supplied by the client (see MEDIA_AUDIT.md / TODO_CLIENT.md). Deliberately
 * abstract rather than a stock photo — swap for a <MediaImage> once real assets land.
 */
export function TexturePanel({
  variant = "performance",
  className = "",
  label,
}: {
  variant?: TextureVariant;
  className?: string;
  label?: string;
}) {
  const s = VARIANT_STYLES[variant];
  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 140% at 15% 10%, ${s.from} 0%, ${s.via} 45%, ${s.to} 100%)`,
      }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-70 mix-blend-overlay"
      >
        <defs>
          <pattern id={`grid-${variant}`} width="34" height="34" patternUnits="userSpaceOnUse">
            <path
              d="M34 0H0V34"
              fill="none"
              stroke={s.grid}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${variant})`} />
      </svg>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 80% 85%, rgba(255,255,255,0.07), transparent 70%)",
        }}
      />
      {label ? (
        <span className="absolute bottom-3 left-3 font-display text-xs uppercase tracking-[0.25em] text-paper/40">
          {label}
        </span>
      ) : null}
    </div>
  );
}
