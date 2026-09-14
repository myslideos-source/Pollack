import Image from "next/image";
import { TexturePanel, type TextureVariant } from "@/components/shared/TexturePanel";

/**
 * Drop-in replacement for a bare <TexturePanel>: renders the real photo when one is
 * available, and falls back to the abstract placeholder otherwise. Used everywhere a
 * program/section image slot exists so real assets can be added incrementally without
 * touching the surrounding layout.
 *
 * `className` must include a `position` utility (`relative` for a sized box driven by
 * `aspect-*`/`h-*`, or `absolute inset-0` to fill a positioned parent) — this component
 * intentionally does not inject its own `relative`, since two conflicting position
 * utilities in one class list resolve unpredictably in Tailwind and can collapse the
 * image to 0×0.
 */
export function MediaPanel({
  src,
  alt,
  variant = "performance",
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  label,
  focalX = 50,
  focalY = 50,
}: {
  src?: string | null;
  alt?: string;
  variant?: TextureVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
  label?: string;
  /** Object-position percentages (0–100) set via the Medienbibliothek's Bildausschnitt picker,
   *  so the crop keeps the right part of the photo — e.g. a person's face — in frame. */
  focalX?: number;
  focalY?: number;
}) {
  if (!src) {
    return <TexturePanel variant={variant} className={className} label={label} />;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: `${focalX}% ${focalY}%` }}
      />
    </div>
  );
}
