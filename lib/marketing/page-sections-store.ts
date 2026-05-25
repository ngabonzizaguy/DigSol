import {
  buildDefaultPageSectionContent,
  type PageSectionContentMap,
  type SectionContentValue,
} from "@/lib/marketing/section-content-defaults";
import { MARKETING_PAGE_REGISTRY, buildDefaultPageSectionVisibility } from "@/lib/marketing/page-section-registry";
import {
  CONTENT_SCHEMAS,
  getContentSchema,
  resolveSectionSchemaId,
  type ContentSchemaId,
} from "@/lib/marketing/section-content-schemas";

export type PageSectionVisibilityMap = Record<string, Record<string, boolean>>;

export type PageSectionsStore = {
  visibility: PageSectionVisibilityMap;
  content: PageSectionContentMap;
};

const STORE_KEY = "page_sections";

export function parsePageSectionsFromIntegrations(integrations: Record<string, unknown> | null | undefined): {
  visibility: PageSectionVisibilityMap | null;
  content: PageSectionContentMap | null;
} {
  const raw = integrations?.[STORE_KEY];
  if (!raw || typeof raw !== "object") {
    return { visibility: null, content: null };
  }
  const block = raw as { visibility?: PageSectionVisibilityMap; content?: PageSectionContentMap };
  return {
    visibility: block.visibility ?? null,
    content: block.content ?? null,
  };
}

export function mergePageSectionVisibility(stored: PageSectionVisibilityMap | null | undefined): PageSectionVisibilityMap {
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

function mergeSectionContent(
  defaults: SectionContentValue,
  stored: SectionContentValue | undefined,
  schemaId: ContentSchemaId,
): SectionContentValue {
  if (schemaId === "none") return { ...defaults };
  if (!stored || typeof stored !== "object") return { ...defaults };

  const schema = CONTENT_SCHEMAS[schemaId];
  const merged: SectionContentValue = { ...defaults };

  for (const field of schema.fields ?? []) {
    const v = stored[field.key];
    if (typeof v === "string" && v.trim()) merged[field.key] = v;
  }

  const lists = schema.lists ?? (schema.list ? [schema.list] : []);
  for (const list of lists) {
    const storedItems = stored[list.key];
    if (!Array.isArray(storedItems) || storedItems.length === 0) continue;

    const defaultItems = defaults[list.key];
    if (!Array.isArray(defaultItems) || defaultItems.length === 0) {
      merged[list.key] = storedItems;
      continue;
    }

    merged[list.key] = storedItems.map((item, index) => {
      const defRow = (defaultItems[index] ?? {}) as Record<string, unknown>;
      const row: Record<string, unknown> = { ...defRow };
      if (item && typeof item === "object") {
        for (const field of list.itemFields) {
          const v = (item as Record<string, unknown>)[field.key];
          if (typeof v === "string" && v.trim()) row[field.key] = v;
        }
      }
      return row;
    });
  }

  return merged;
}

export function mergePageSectionContent(stored: PageSectionContentMap | null | undefined): PageSectionContentMap {
  const defaults = buildDefaultPageSectionContent();
  if (!stored) return defaults;

  const merged: PageSectionContentMap = {};
  for (const page of MARKETING_PAGE_REGISTRY) {
    merged[page.id] = {};
    for (const section of page.sections) {
      const schemaId = resolveSectionSchemaId(page.id, section.id);
      merged[page.id][section.id] = mergeSectionContent(
        defaults[page.id]?.[section.id] ?? {},
        stored[page.id]?.[section.id],
        schemaId,
      );
    }
  }
  return merged;
}

export function buildPageSectionsStore(integrations: Record<string, unknown> | null | undefined): PageSectionsStore {
  const { visibility, content } = parsePageSectionsFromIntegrations(integrations);
  return {
    visibility: mergePageSectionVisibility(visibility),
    content: mergePageSectionContent(content),
  };
}

export function toIntegrationsPageSections(store: PageSectionsStore): Record<string, unknown> {
  return {
    visibility: store.visibility,
    content: store.content,
  };
}

export function isSectionVisible(store: PageSectionsStore, pageId: string, sectionId: string): boolean {
  return store.visibility[pageId]?.[sectionId] !== false;
}

export function getSectionContent<T extends SectionContentValue = SectionContentValue>(
  store: PageSectionsStore,
  pageId: string,
  sectionId: string,
): T {
  return (store.content[pageId]?.[sectionId] ?? {}) as T;
}

/** True when section should render on the public site (toggle on; no empty shell). */
export function shouldRenderSection(store: PageSectionsStore, pageId: string, sectionId: string): boolean {
  return isSectionVisible(store, pageId, sectionId);
}

export function hasEditableContent(pageId: string, sectionId: string): boolean {
  return resolveSectionSchemaId(pageId, sectionId) !== "none";
}

export function getContentSchemaForSection(pageId: string, sectionId: string) {
  return getContentSchema(pageId, sectionId);
}

export function countHiddenSections(visibility: PageSectionVisibilityMap, pageId: string): number {
  const page = MARKETING_PAGE_REGISTRY.find((p) => p.id === pageId);
  if (!page) return 0;
  const pageVis = visibility[pageId] ?? {};
  return page.sections.filter((s) => pageVis[s.id] === false).length;
}

export function countHiddenSectionsTotal(visibility: PageSectionVisibilityMap): number {
  return MARKETING_PAGE_REGISTRY.reduce((sum, page) => sum + countHiddenSections(visibility, page.id), 0);
}
