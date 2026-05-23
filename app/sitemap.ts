import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/work";
import { insights } from "@/lib/content/insights";
import { openRoles } from "@/lib/content/team";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified })),
    ...services.map((s) => ({ url: `${base}/solutions/${s.slug}`, lastModified })),
    ...industries.map((i) => ({ url: `${base}/industries/${i.slug}`, lastModified })),
    ...caseStudies.map((c) => ({ url: `${base}/work/${c.slug}`, lastModified })),
    ...insights.map((p) => ({ url: `${base}/insights/${p.slug}`, lastModified })),
    ...openRoles.map((r) => ({ url: `${base}/about/careers/${r.slug}`, lastModified })),
  ];
}
