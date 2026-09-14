import { Star, ArrowRight } from "lucide-react";
import { googleReviews } from "@/content/reviews";

/**
 * Slim trust strip directly below TrustStats — a five-star rating plus a direct link to the
 * real Google Maps listing (Google's documented maps/search URL format, no Place ID needed),
 * where visitors see the live review count and can leave their own review.
 */
export function GoogleReviewsBadge() {
  return (
    <section className="border-b border-paper/10 bg-ink py-6" aria-label="Bewertungen">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 text-center sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} className="fill-sand text-sand" />
          ))}
        </div>
        <p className="text-sm text-paper/75">
          <span className="font-display font-semibold text-paper">
            {googleReviews.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })}
          </span>{" "}
          von 5 &middot; {googleReviews.reviewCount} Bewertungen bei Google &amp; Co.
        </p>
        <a
          href={googleReviews.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-red hover:text-red-dark"
        >
          Bewertungen ansehen &amp; abgeben <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}
