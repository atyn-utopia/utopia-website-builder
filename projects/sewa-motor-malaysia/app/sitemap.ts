import type { MetadataRoute } from "next";
import { locations } from "@/config/locations";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.siteUrl;
const LOCALES = ["en", "ms", "zh"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage variants (2 URLs)
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          zh: `${BASE_URL}/zh`,
        },
      },
    });
  }

  // Location page variants (128 locations x 2 locales = 256 URLs)
  for (const location of locations) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/sewa-motor/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/sewa-motor/${location.slug}`,
            zh: `${BASE_URL}/zh/sewa-motor/${location.slug}`,
          },
        },
      });
    }
  }

  // Total: 2 + 256 = 258 URLs
  return entries;
}
