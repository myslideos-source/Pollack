import type { Metadata } from "next";
import { poppinsDisplay, poppinsBody } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { siteConfig, contact } from "@/content/site";
import { googleReviews } from "@/content/reviews";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.street,
      postalCode: contact.zip,
      addressLocality: contact.city,
      addressCountry: contact.country,
    },
    areaServed: "Fichtenau, Crailsheim, Hohenlohekreis",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: googleReviews.rating,
      reviewCount: googleReviews.reviewCount,
    },
  };

  return (
    <html lang="de" className={`${poppinsDisplay.variable} ${poppinsBody.variable}`}>
      <body className="flex min-h-screen flex-col bg-ink font-body text-paper antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main id="main-content" className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileCtaBar />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
