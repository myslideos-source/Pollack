import { Star, ArrowRight } from "lucide-react";
import { googleReviews } from "@/content/reviews";
import { loadGoogleRating } from "@/lib/content/google-reviews";

function ReviewCard({ review }: { review: (typeof googleReviews.reviews)[number] }) {
  return (
    <div className="flex w-[300px] shrink-0 flex-col gap-3 rounded-2xl border border-paper/10 bg-anthracite p-5 sm:w-[340px]">
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={14} className="fill-sand text-sand" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-paper/80">&bdquo;{review.quote}&ldquo;</p>
      <p className="mt-auto text-xs text-paper/50">
        {review.author ?? "Google-Nutzer"} &middot; {review.postedLabel}
      </p>
    </div>
  );
}

/**
 * Trust section directly below TrustStats: a five-star rating strip (link to the real Google
 * Maps listing, Google's documented maps/search URL format, no Place ID needed) plus a row of
 * real review quotes that scrolls left continuously. The card list is duplicated once for a
 * seamless loop (`translateX(-50%)` on a doubled, `w-max` row); the duplicate copy is
 * `aria-hidden` (screen readers shouldn't hear every quote twice) and `motion-reduce:hidden` (so
 * `prefers-reduced-motion` visitors get one static, wrapped row instead of a frozen half-loop).
 *
 * The star average and review count come from loadGoogleRating() — live from Google once
 * GOOGLE_PLACES_API_KEY/GOOGLE_PLACE_ID are configured, the confirmed static snapshot otherwise.
 * The quotes themselves stay the curated static set (see content/reviews.ts).
 */
export async function GoogleReviewsBadge() {
  const { rating, reviewCount } = await loadGoogleRating();
  return (
    <section className="border-b border-paper/10 bg-ink py-8 sm:py-10" aria-label="Bewertungen">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 text-center sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} className="fill-sand text-sand" />
          ))}
        </div>
        <p className="text-sm text-paper/75">
          <span className="font-display font-semibold text-paper">
            {rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })}
          </span>{" "}
          von 5 &middot; {reviewCount} Bewertungen bei Google
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

      <div className="group mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex gap-4 px-4 motion-safe:w-max motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center sm:px-6">
          {googleReviews.reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
          <div aria-hidden="true" className="contents motion-reduce:hidden">
            {googleReviews.reviews.map((review, i) => (
              <ReviewCard key={`dup-${i}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
