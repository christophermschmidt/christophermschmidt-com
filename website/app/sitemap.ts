import type { MetadataRoute } from "next";
import { getAllLocalArticles } from "@/lib/articles";
import { getAllCapabilitySlugs } from "@/lib/darf";
export const dynamic = "force-static";
const base = "https://christophermschmidt.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", "/work/rti", "/work/supplier-risk", "/work/econtrol", "/approach", "/darf", "/darf/example", "/darf/capabilities", "/writing", "/articles", "/speaking", "/about", "/contact", "/products", "/products/data-ai-readiness"];
  const staticRoutes: MetadataRoute.Sitemap = paths.map((path) => ({ url: `${base}${path}`, changeFrequency: path === "/" || path === "/writing" ? "weekly" : "monthly", priority: path === "/" ? 1 : path === "/darf" || path === "/work" ? .9 : .7 }));
  const articleRoutes: MetadataRoute.Sitemap = getAllLocalArticles().map((article) => ({ url: `${base}/articles/${article.slug}`, lastModified: article.date, changeFrequency: "monthly", priority: .6 }));
  const capabilityRoutes: MetadataRoute.Sitemap = getAllCapabilitySlugs().map((slug) => ({ url: `${base}/darf/capabilities/${slug}`, changeFrequency: "monthly", priority: .5 }));
  return [...staticRoutes, ...articleRoutes, ...capabilityRoutes];
}
