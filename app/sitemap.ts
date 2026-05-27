import type { MetadataRoute } from "next";
import {
  getServices,
  getIndustries,
  getCaseStudies,
  getInsights,
  getOpenRoles,
} from "@/lib/content/fetchers";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const lastModified = new Date();

  const staticRoutes = [
    "/",
    "/solutions",
    "/for-smb",
    "/for-enterprise",
    "/industries",
    "/work",
    "/insights",
    "/insights/blog",
    "/insights/guides",
    "/insights/events",
    "/about",
    "/about/leadership",
    "/about/careers",
    "/about/partners",
    "/how-we-work",
    "/how-we-work/engagement-models",
    "/how-we-work/methodology",
    "/how-we-work/security-compliance",
    "/contact",
    "/book-consultation",
    "/faq",
    "/legal/privacy",
    "/legal/terms",
    "/legal/cookies",
  ];

  const [services, industries, caseStudies, insights, openRoles] = await Promise.all([
    getServices(),
    getIndustries(),
    getCaseStudies(),
    getInsights(),
    getOpenRoles(),
  ]);

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified })),
    ...services.map((s) => ({ url: `${base}/solutions/${s.slug}`, lastModified })),
    ...industries.map((i) => ({ url: `${base}/industries/${i.slug}`, lastModified })),
    ...caseStudies.map((c) => ({ url: `${base}/work/${c.slug}`, lastModified })),
    ...insights.map((p) => ({ url: `${base}/insights/${p.slug}`, lastModified })),
    ...openRoles.map((r) => ({ url: `${base}/about/careers/${r.slug}`, lastModified })),
  ];
}
