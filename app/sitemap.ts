import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kuran.ersurer.com";
  const currentIsoDate = new Date().toISOString();

  const surahPages = Array.from({ length: 114 }, (_, index) => ({
    url: `${baseUrl}/surah/${index + 1}`,
    lastModified: currentIsoDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentIsoDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentIsoDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...surahPages,
  ];
}
