import "server-only";
import { googleReviews as staticReviews } from "@/content/reviews";

export type GoogleRating = { rating: number; reviewCount: number };

/**
 * Fetches the live aggregate rating (star average + review count) from the Places API (New),
 * falling back to the last-confirmed static snapshot in content/reviews.ts whenever the two
 * required env vars aren't set or the request fails — same fail-open pattern as every other
 * external-data loader in this codebase (e.g. the middleware's Supabase session check). The
 * curated review quotes stay static content either way: Google's terms restrict how review text
 * (as opposed to the aggregate rating) may be cached/displayed, and the client-supplied quotes
 * are a fixed, deliberately-chosen set rather than something that should silently rotate.
 *
 * Setup: a Google Cloud project with the "Places API (New)" enabled, an API key restricted to
 * that API, and the business's Place ID — set as the GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID
 * env vars. Until those are set, the site silently keeps using the static numbers, so this is
 * safe to ship ahead of having the credentials.
 */
export async function loadGoogleRating(): Promise<GoogleRating> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  const fallback: GoogleRating = { rating: staticReviews.rating, reviewCount: staticReviews.reviewCount };
  if (!apiKey || !placeId) return fallback;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
      // Cached and revalidated in step with the page itself (see (site)/layout.tsx) — well
      // under the 30-day cache limit Google's Places API terms allow for this kind of data.
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Places API responded ${res.status}`);

    const data = (await res.json()) as { rating?: number; userRatingCount?: number };
    if (typeof data.rating !== "number" || typeof data.userRatingCount !== "number") {
      throw new Error("Unexpected Places API response shape");
    }
    return { rating: data.rating, reviewCount: data.userRatingCount };
  } catch (error) {
    console.error("[loadGoogleRating]", error);
    return fallback;
  }
}
