import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CmsSectionHeading } from "@/components/marketing/cms-section-heading";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CmsProcessStepper } from "@/components/marketing/cms-blocks";
import { CmsCardGrid } from "@/components/marketing/cms-blocks";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";

export const metadata: Metadata = {
  title: "How we work",
  description: "Methodology, engagement models, and the operating standards we apply to every project.",
};

export default async function HowWeWorkPage() {
  const store = await loadMarketingPageStore();
  const hero = pageHeroContent(store, "how_we_work");
  const processContent = getSectionContent(store, "how_we_work", "process");
  const standards = getSectionContent(store, "how_we_work", "operating_standards");
  const cta = pageCtaContent(store, "how_we_work");

  return (
    <>
      <PageSection pageId="how_we_work" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="how_we_work" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How we work" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work" sectionId="process">
        <Section>
          <Container>
            <CmsSectionHeading content={processContent} className="mb-14" />
            <CmsProcessStepper content={processContent} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work" sectionId="operating_standards">
        <Section className="border-y border-hairline bg-canvas-soft">
          <Container>
            <CmsCardGrid content={standards} columns="md:grid-cols-2 lg:grid-cols-3" headingClassName="mb-10" />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work" sectionId="cta_band">
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
