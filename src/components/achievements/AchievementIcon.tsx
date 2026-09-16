import { ACHIEVEMENT_ICONS, DEFAULT_ACHIEVEMENT_ICON } from "./icon-map";

export type AchievementTier = "bronze" | "silber" | "gold" | "platin" | null;

/**
 * Tier rings as metallic gradients — the only place bronze/silver/gold/platinum appear as color,
 * per the brief ("Bronze, Silber, Gold und Platin nur als hochwertige metallische Details"). Not
 * CSS custom properties: each is a one-off multi-stop gradient tuned for a metal look, not a
 * reusable design token.
 */
const TIER_GRADIENTS: Record<"bronze" | "silber" | "gold" | "platin", string> = {
  bronze: "linear-gradient(135deg, #5c3a1e 0%, #b87333 42%, #e6ad6a 55%, #7a4f24 100%)",
  silber: "linear-gradient(135deg, #5f5f5f 0%, #c4c4c4 42%, #f5f5f5 55%, #7d7d7d 100%)",
  gold: "linear-gradient(135deg, #6b4e10 0%, #d4af37 42%, #f9dd8f 55%, #8a6717 100%)",
  platin: "linear-gradient(135deg, #6a7078 0%, #d9dfe6 42%, #ffffff 55%, #9aa2ac 100%)",
};

const NEUTRAL_GRADIENT = "linear-gradient(135deg, rgba(247,245,240,0.28) 0%, rgba(247,245,240,0.06) 100%)";

const SIZE_PX = { sm: 48, md: 72, lg: 112 } as const;

/** A regular octagon via clip-path — the medallion shape used throughout the reference design. */
const OCTAGON_CLIP = "polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0% 71%, 0% 29%)";

export function AchievementIcon({
  iconKey,
  customIconSrc = null,
  tier = null,
  locked = false,
  size = "md",
  className = "",
}: {
  iconKey: string;
  /** Admin-uploaded SVG (achievements.custom_icon_media_id), takes priority over iconKey. */
  customIconSrc?: string | null;
  tier?: AchievementTier;
  locked?: boolean;
  size?: keyof typeof SIZE_PX;
  className?: string;
}) {
  const Icon = ACHIEVEMENT_ICONS[iconKey] ?? DEFAULT_ACHIEVEMENT_ICON;
  const px = SIZE_PX[size];
  const gradient = tier ? TIER_GRADIENTS[tier] : NEUTRAL_GRADIENT;
  const glyphPx = Math.round(px * 0.4);
  const inset = Math.max(2, Math.round(px * 0.06));

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: px, height: px }} aria-hidden="true">
      {/* Metallic tier ring */}
      <div
        className="absolute inset-0 transition-[filter] duration-300"
        style={{
          clipPath: OCTAGON_CLIP,
          background: gradient,
          filter: locked ? "grayscale(0.75) brightness(0.5)" : undefined,
        }}
      />
      {/* Engraved dark face */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          inset,
          clipPath: OCTAGON_CLIP,
          background: "linear-gradient(160deg, var(--color-ink) 0%, var(--color-anthracite) 100%)",
          boxShadow: locked
            ? "inset 0 0 0 1px rgba(247,245,240,0.05)"
            : "inset 0 1px 3px rgba(0,0,0,0.65), inset 0 0 14px rgba(228,59,50,0.14)",
        }}
      >
        {customIconSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded SVG, no next/image benefit for a small inline badge glyph
          <img
            src={customIconSrc}
            alt=""
            width={glyphPx}
            height={glyphPx}
            className={locked ? "opacity-20" : "opacity-90"}
            style={locked ? undefined : { filter: "drop-shadow(0 0 3px rgba(228,59,50,0.35))" }}
          />
        ) : (
          <Icon
            size={glyphPx}
            strokeWidth={1.75}
            className={locked ? "text-paper/20" : "text-paper/90"}
            style={locked ? undefined : { filter: "drop-shadow(0 0 3px rgba(228,59,50,0.35))" }}
          />
        )}
      </div>
    </div>
  );
}
