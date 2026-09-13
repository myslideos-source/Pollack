import localFont from "next/font/local";

/**
 * Barlow Condensed — self-hosted (Google Fonts, OFL), used for display/headline type.
 * Manrope — self-hosted (Google Fonts, OFL), variable font used for body/UI text.
 * Both are served from /src/fonts so no request ever leaves the site (no Google Fonts CDN calls).
 */
export const barlowCondensed = localFont({
  src: [
    { path: "../fonts/BarlowCondensed-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/BarlowCondensed-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/BarlowCondensed-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/BarlowCondensed-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/BarlowCondensed-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const manrope = localFont({
  src: [{ path: "../fonts/Manrope-variable.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-body",
  display: "swap",
});
