import type { Metadata } from "next";
import { poppinsDisplay, poppinsBody } from "@/lib/fonts";
import { siteConfig } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – Fitness, Gesundheit & Kampfkunst in Fichtenau`,
    template: `%s – ${siteConfig.name}`,
  },
  description:
    "Fitnessstudio in Fichtenau bei Crailsheim: Krafttraining, Milon, FIVE Rückentraining, InBody Körperanalyse, Karate, Kinderkarate und Selbstverteidigung – persönlich begleitet seit 1987.",
  keywords: [
    "Fitnessstudio Fichtenau",
    "Fitnessstudio bei Crailsheim",
    "Rückentraining Fichtenau",
    "Milon Fichtenau",
    "FIVE Rückentraining",
    "Karate Fichtenau",
    "Kinderkarate Fichtenau",
    "Selbstverteidigung Fichtenau",
    "InBody Körperanalyse",
    "Personal Training Fichtenau",
  ],
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} – Stark. Beweglich. Bereit.`,
    description: siteConfig.tagline,
  },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

/**
 * True root layout — html/body, fonts, and site-wide metadata only. No header/footer/nav here:
 * those belong to the public marketing site alone and live in app/(site)/layout.tsx, a sibling
 * of app/admin/ rather than an ancestor, so the admin area never inherits the public shell.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${poppinsDisplay.variable} ${poppinsBody.variable}`}>
      <body className="flex min-h-screen flex-col bg-ink font-body text-paper antialiased">{children}</body>
    </html>
  );
}
