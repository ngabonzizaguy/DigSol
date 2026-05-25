import { MarketingSiteHeader } from "@/components/layout/marketing-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";
import { PageViewLogger } from "@/components/marketing/page-view-logger";
import { PageSection } from "@/components/marketing/page-section";
import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import { FooterNewsletter, type FooterNewsletterContent } from "@/components/layout/footer-newsletter";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const store = await getPageSectionsStore();
  const newsletterContent = getSectionContent<FooterNewsletterContent>(store, "global", "footer_newsletter");

  return (
    <SmoothScroll>
      <PageSection pageId="global" sectionId="header">
        <MarketingSiteHeader />
      </PageSection>
      <main className="relative">{children}</main>
      <PageSection pageId="global" sectionId="footer">
        <SiteFooter
          newsletter={
            <PageSection pageId="global" sectionId="footer_newsletter">
              <FooterNewsletter content={newsletterContent} />
            </PageSection>
          }
        />
      </PageSection>
      <PageSection pageId="global" sectionId="page_view_logger">
        <PageViewLogger />
      </PageSection>
    </SmoothScroll>
  );
}
