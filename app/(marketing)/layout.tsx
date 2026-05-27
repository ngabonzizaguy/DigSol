import { MarketingSiteHeader } from "@/components/layout/marketing-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";
import { PageViewLogger } from "@/components/marketing/page-view-logger";
import { PageSection } from "@/components/marketing/page-section";
import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import { FooterNewsletter, type FooterNewsletterContent } from "@/components/layout/footer-newsletter";
import { QuickStartProvider } from "@/components/marketing/quick-start/quick-start-provider";
import { QuickStartTrigger } from "@/components/marketing/quick-start/quick-start-trigger";
import { QuickStartModal } from "@/components/marketing/quick-start/quick-start-modal";
import { getQuickStartConfig, getQuickStartServices } from "@/lib/marketing/quick-start-server";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [store, qsConfig, qsServices] = await Promise.all([
    getPageSectionsStore(),
    getQuickStartConfig(),
    getQuickStartServices(),
  ]);
  const newsletterContent = getSectionContent<FooterNewsletterContent>(store, "global", "footer_newsletter");

  return (
    <SmoothScroll>
      <QuickStartProvider config={qsConfig} services={qsServices}>
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
        <QuickStartTrigger />
        <QuickStartModal />
      </QuickStartProvider>
    </SmoothScroll>
  );
}
