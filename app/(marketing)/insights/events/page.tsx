import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CmsEventGrid } from "@/components/marketing/cms-blocks";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";

export const metadata: Metadata = {
  title: "Events",
  description: "Webinars, briefings, and meetups hosted by DigSolutions.",
};

export default async function EventsPage() {
  const store = await loadMarketingPageStore();
  const hero = pageHeroContent(store, "insights_events");
  const events = getSectionContent(store, "insights_events", "events_list");
  const cta = pageCtaContent(store, "insights_events");

  return (
    <>
      <PageSection pageId="insights_events" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="insights_events" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Events" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights_events" sectionId="events_list">
        <Section>
          <Container>
            <CmsEventGrid content={events} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights_events" sectionId="cta_band">
        <CtaBand
          title={cta.title}
          subtitle={cta.subtitle}
          primaryLabel={cta.primary_label}
          primaryHref={cta.primary_href}
          secondaryLabel={cta.secondary_label}
          secondaryHref={cta.secondary_href}
        />
      </PageSection>
    </>
  );
}
