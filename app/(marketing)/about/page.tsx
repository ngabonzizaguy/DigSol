import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CmsCardGrid, CmsLocationGrid } from "@/components/marketing/cms-blocks";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";

export const metadata: Metadata = {
  title: "About",
  description: "Who we are, what we believe, and how we work.",
};

export default async function AboutPage() {
  const store = await loadMarketingPageStore();
  const hero = pageHeroContent(store, "about");
  const values = getSectionContent(store, "about", "values");
  const locations = getSectionContent(store, "about", "locations");
  const cta = pageCtaContent(store, "about");

  return (
    <>
      <PageSection pageId="about" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="about" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about" sectionId="values">
        <Section className="border-y border-hairline bg-canvas-soft">
          <Container>
            <CmsCardGrid content={values} headingClassName="mb-10" />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about" sectionId="locations">
        <Section>
          <Container>
            <CmsLocationGrid content={locations} headingClassName="mb-8" />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about" sectionId="cta_band">
        <CtaBand
          title={cta.title ?? "Want to know more?"}
          subtitle={cta.subtitle ?? "The fastest way to understand us is to talk to us."}
          primaryLabel={cta.primary_label ?? "Book a call"}
          primaryHref={cta.primary_href}
          secondaryLabel={cta.secondary_label}
          secondaryHref={cta.secondary_href}
        />
      </PageSection>
    </>
  );
}
