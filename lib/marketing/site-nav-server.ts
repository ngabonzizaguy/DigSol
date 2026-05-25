import "server-only";
import { cache } from "react";
import { getServices, getIndustries } from "@/lib/content/fetchers";
import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import { site } from "@/lib/site";

export type NavChildLink = {
  label: string;
  href: string;
  description?: string;
};

export type PrimaryNavItem = {
  label: string;
  href: string;
  children?: NavChildLink[];
};

export type FooterNavColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type SiteHeaderContent = {
  brand_name?: string;
  logo_abbr?: string;
  contact_label?: string;
  contact_href?: string;
  book_label?: string;
  book_href?: string;
  nav_items?: { label?: string; href?: string; mega_menu?: string }[];
  company_links?: { label?: string; href?: string; description?: string }[];
};

export type FooterNavContent = {
  solutions_links?: { label?: string; href?: string }[];
  who_we_serve_links?: { label?: string; href?: string }[];
  company_links?: { label?: string; href?: string }[];
  resources_links?: { label?: string; href?: string }[];
  legal_links?: { label?: string; href?: string }[];
};

function normalizeMegaMenu(value?: string): "none" | "services" | "industries" | "company" {
  const key = value?.trim().toLowerCase();
  if (key === "services" || key === "industries" || key === "company") return key;
  return "none";
}

function mapLinks(items: { label?: string; href?: string; description?: string }[] | undefined): NavChildLink[] {
  return (items ?? [])
    .filter((i) => i.label?.trim() && i.href?.trim())
    .map((i) => ({
      label: i.label!.trim(),
      href: i.href!.trim(),
      ...(i.description?.trim() ? { description: i.description.trim() } : {}),
    }));
}

function mapFooterColumn(
  title: string,
  items: { label?: string; href?: string }[] | undefined,
): FooterNavColumn | null {
  const links = (items ?? [])
    .filter((i) => i.label?.trim() && i.href?.trim())
    .map((i) => ({ label: i.label!.trim(), href: i.href!.trim() }));
  if (links.length === 0) return null;
  return { title, links };
}

export const getSiteHeaderContent = cache(async (): Promise<SiteHeaderContent> => {
  const store = await getPageSectionsStore();
  return getSectionContent<SiteHeaderContent>(store, "global", "header");
});

export const getFooterNavContent = cache(async (): Promise<FooterNavContent> => {
  const store = await getPageSectionsStore();
  return getSectionContent<FooterNavContent>(store, "global", "footer");
});

export const buildPrimaryNav = cache(async (): Promise<PrimaryNavItem[]> => {
  const [header, services, industries] = await Promise.all([
    getSiteHeaderContent(),
    getServices(),
    getIndustries(),
  ]);

  const companyChildren = mapLinks(header.company_links);
  const items = (header.nav_items ?? []).filter((i) => i.label?.trim() && i.href?.trim());

  return items.map((item) => {
    const base: PrimaryNavItem = {
      label: item.label!.trim(),
      href: item.href!.trim(),
    };
    const mega = normalizeMegaMenu(item.mega_menu);
    if (mega === "services") {
      const children = services
        .filter((s) => s.slug && s.title)
        .map((s) => ({
          label: s.title,
          href: `/solutions/${s.slug}`,
          description: s.short?.trim() || undefined,
        }));
      return children.length > 0 ? { ...base, children } : base;
    }
    if (mega === "industries") {
      const children = industries
        .filter((i) => i.slug && i.name)
        .map((i) => ({
          label: i.name,
          href: `/industries/${i.slug}`,
          description: i.short?.trim() || undefined,
        }));
      return children.length > 0 ? { ...base, children } : base;
    }
    if (mega === "company" && companyChildren.length > 0) {
      return { ...base, children: companyChildren };
    }
    return base;
  });
});

export const buildFooterNav = cache(async (): Promise<FooterNavColumn[]> => {
  const content = await getFooterNavContent();
  const columns = [
    mapFooterColumn("Solutions", content.solutions_links),
    mapFooterColumn("Who we serve", content.who_we_serve_links),
    mapFooterColumn("Company", content.company_links),
    mapFooterColumn("Resources", content.resources_links),
    mapFooterColumn("Legal", content.legal_links),
  ].filter((c): c is FooterNavColumn => c !== null);
  return columns;
});

export function headerChromeFromContent(
  header: SiteHeaderContent,
  brandNameFallback = site.name,
): {
  brandName: string;
  logoAbbr: string;
  contactLabel: string;
  contactHref: string;
  bookLabel: string;
  bookHref: string;
} {
  return {
    brandName: header.brand_name?.trim() || brandNameFallback,
    logoAbbr: header.logo_abbr?.trim() || "DS",
    contactLabel: header.contact_label?.trim() || "Contact",
    contactHref: header.contact_href?.trim() || "/contact",
    bookLabel: header.book_label?.trim() || "Book consultation",
    bookHref: header.book_href?.trim() || "/book-consultation",
  };
}

/** Build footer columns from stored lists; optional dynamic Solutions column from services. */
export async function buildFooterNavWithServices(): Promise<FooterNavColumn[]> {
  const [content, services] = await Promise.all([getFooterNavContent(), getServices()]);
  const solutionsFromCms = mapFooterColumn("Solutions", content.solutions_links);
  const solutionsFromDb: FooterNavColumn = {
    title: "Solutions",
    links: services
      .filter((s) => s.slug && s.title)
      .map((s) => ({ label: s.title, href: `/solutions/${s.slug}` })),
  };
  const solutions =
    solutionsFromCms && solutionsFromCms.links.length > 0
      ? solutionsFromCms
      : solutionsFromDb.links.length > 0
        ? solutionsFromDb
        : solutionsFromCms;

  const rest = [
    mapFooterColumn("Who we serve", content.who_we_serve_links),
    mapFooterColumn("Company", content.company_links),
    mapFooterColumn("Resources", content.resources_links),
    mapFooterColumn("Legal", content.legal_links),
  ].filter((c): c is FooterNavColumn => c !== null);

  return [...(solutions ? [solutions] : []), ...rest];
}
