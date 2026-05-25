import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { shouldRenderSection } from "@/lib/marketing/page-sections-store";

type PageSectionProps = {
  pageId: string;
  sectionId: string;
  children: React.ReactNode;
};

/**
 * Renders children only when the section is enabled in CMS.
 * When hidden, returns null — no empty Section wrappers or layout gaps.
 */
export async function PageSection({ pageId, sectionId, children }: PageSectionProps) {
  const store = await getPageSectionsStore();
  if (!shouldRenderSection(store, pageId, sectionId)) return null;
  return <>{children}</>;
}
