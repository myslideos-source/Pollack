import localFont from "next/font/local";

/**
 * Poppins — self-hosted (Google Fonts, OFL), used for both display/headline and body/UI
 * text. Served from /src/fonts so no request ever leaves the site (no Google Fonts CDN
 * calls). Two font instances (mapped to --font-display / --font-body) so existing
 * components using the font-display / font-body Tailwind utilities keep working
 * unchanged — both simply resolve to Poppins now.
 *
 * The `src` array must be a literal inline in each `localFont()` call (next/font's
 * compiler plugin statically analyzes the call and can't resolve a shared variable).
 */
export const poppinsDisplay = localFont({
  src: [
    { path: "../fonts/Poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Poppins-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Poppins-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const poppinsBody = localFont({
  src: [
    { path: "../fonts/Poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Poppins-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Poppins-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

/**
 * Sportpark member + admin portal type system (self-hosted, same no-CDN-request rationale as
 * Poppins above). Manrope is a single variable-weight file (Google serves it that way for
 * modern browsers); Barlow Condensed ships as four static weights for the sporty headlines.
 * Scoped to the /mitglied and /admin route groups via the `.variable` class on their shells —
 * the public marketing site keeps Poppins untouched.
 */
export const manrope = localFont({
  src: [{ path: "../fonts/Manrope-Variable.woff2", weight: "400 800", style: "normal" }],
  variable: "--font-ui",
  display: "swap",
});

export const barlowCondensed = localFont({
  src: [
    { path: "../fonts/BarlowCondensed-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/BarlowCondensed-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/BarlowCondensed-800.woff2", weight: "800", style: "normal" },
    { path: "../fonts/BarlowCondensed-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-headline",
  display: "swap",
});
