import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllCapabilitySlugs } from "@/lib/darf";

export const dynamic = "force-static";

const base = "https://christophermschmidt.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/darf`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/darf/capabilities`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/articles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/speaking`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const capabilityRoutes: MetadataRoute.Sitemap = getAllCapabilitySlugs().map(
    (slug) => ({
      url: `${base}/darf/capabilities/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    })
  );

  return [...staticRoutes, ...articleRoutes, ...capabilityRoutes];
}
