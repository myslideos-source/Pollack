import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { programs } from "@/content/programs";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/training",
    "/gesundheit",
    "/kampfkunst",
    "/regeneration",
    "/partner-produkte",
    "/preise",
    "/ueber-uns",
    "/kontakt",
    "/trainingsfinder",
    "/impressum",
    "/datenschutz",
  ];

  const programRoutes = programs.map((p) => `/${p.category}/${p.slug}`);

  return [...staticRoutes, ...programRoutes].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
