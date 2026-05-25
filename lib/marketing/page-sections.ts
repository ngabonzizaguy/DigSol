import {
  buildDefaultPageSectionVisibility,
  getMarketingPageById,
  MARKETING_PAGE_REGISTRY,
} from "@/lib/marketing/page-section-registry";

export { buildDefaultPageSectionVisibility };

export type PageSectionVisibilityMap = Record<string, Record<string, boolean>>;

export const PAGE_SECTIONS_PREVIEW_STORAGE_KEY = "digsol:page-sections-preview";

export function mergePageSectionVisibility(
  stored: PageSectionVisibilityMap | null | undefined,
): PageSectionVisibilityMap {
  const defaults = buildDefaultPageSectionVisibility();
  if (!stored) return defaults;

  const merged: PageSectionVisibilityMap = { ...defaults };
  for (const page of MARKETING_PAGE_REGISTRY) {
    const pageStored = stored[page.id];
    if (!pageStored) continue;
    merged[page.id] = { ...merged[page.id] };
    for (const section of page.sections) {
      if (typeof pageStored[section.id] === "boolean") {
        merged[page.id][section.id] = pageStored[section.id];
      }
    }
  }
  return merged;
}

export function countHiddenSections(
  visibility: PageSectionVisibilityMap,
  pageId: string,
): number {
  const page = getMarketingPageById(pageId);
  if (!page) return 0;
  const pageVis = visibility[pageId] ?? {};
  return page.sections.filter((s) => pageVis[s.id] === false).length;
}

export function countHiddenSectionsTotal(visibility: PageSectionVisibilityMap): number {
  return MARKETING_PAGE_REGISTRY.reduce((sum, page) => sum + countHiddenSections(visibility, page.id), 0);
}

export function isSectionEnabled(
  visibility: PageSectionVisibilityMap,
  pageId: string,
  sectionId: string,
): boolean {
  return visibility[pageId]?.[sectionId] !== false;
}
