import "server-only";
import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { getSectionContent, type PageSectionsStore } from "@/lib/marketing/page-sections-store";
import type { CtaBandContent, SectionHeadingContent } from "@/lib/marketing/home-content";

export type PageHeroContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primary_label?: string;
  primary_href?: string;
  secondary_label?: string;
  secondary_href?: string;
};

export async function loadMarketingPageStore(): Promise<PageSectionsStore> {
  return getPageSectionsStore();
}

export function pageHeroContent(store: PageSectionsStore, pageId: string): PageHeroContent {
  return getSectionContent<PageHeroContent>(store, pageId, "hero");
}

export function pageHeadingContent(store: PageSectionsStore, pageId: string, sectionId: string): SectionHeadingContent {
  return getSectionContent<SectionHeadingContent>(store, pageId, sectionId);
}

export function pageCtaContent(store: PageSectionsStore, pageId: string): CtaBandContent {
  return getSectionContent<CtaBandContent>(store, pageId, "cta_band");
}
