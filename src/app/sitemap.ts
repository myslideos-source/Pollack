import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [""];

  const anchorRoutes = [
    "/#zielfinder",
    "/#trainingswelten",
    "/#kraft-performance",
    "/#ruecken-beweglichkeit",
    "/#koerperanalyse-fortschritt",
    "/#kampfkunst-selbstvertrauen",
    "/#regeneration-balance",
    "/#gesundheit",
    "/#ueber-uns",
    "/#partner",
    "/#preise",
    "/#kontakt",
  ];

  const legalRoutes = ["/impressum", "/datenschutz"];

  return [...staticRoutes, ...legalRoutes, ...anchorRoutes].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
}
