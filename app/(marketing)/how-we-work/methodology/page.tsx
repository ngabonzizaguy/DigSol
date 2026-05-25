import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CmsProcessStepper } from "@/components/marketing/cms-blocks";
import { FadeIn } from "@/components/marketing/fade-in";
import { CmsSectionHeading } from "@/components/marketing/cms-section-heading";
import { CmsCardGrid, CmsTextBlock } from "@/components/marketing/cms-blocks";
import type { SectionHeadingContent } from "@/lib/marketing/home-content";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";

export const metadata: Metadata = {
  title: "Methodology",
  description: "Our delivery methodology — frameworks, cadence, and quality bars.",
};

export default async function MethodologyPage() {
  const store = await loadMarketingPageStore();
  const hero = pageHeroContent(store, "how_we_work_methodology");
  const cadence = getSectionContent(store, "how_we_work_methodology", "cadence");
  const frameworks = getSectionContent(store, "how_we_work_methodology", "frameworks");
  const decisionSpeed = getSectionContent(store, "how_we_work_methodology", "decision_speed");
  const cta = pageCtaContent(store, "how_we_work_methodology");

  return (
    <>
      <PageSection pageId="how_we_work_methodology" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="how_we_work_methodology" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "How we work", href: "/how-we-work" }, { label: "Methodology" }]}
            />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work_methodology" sectionId="cadence">
        <Section>
          <Container>
            <CmsSectionHeading content={cadence} className="mb-14" />
            <CmsProcessStepper content={cadence} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work_methodology" sectionId="frameworks">
        <Section className="border-y border-hairline bg-canvas-soft">
          <Container>
            <CmsCardGrid content={frameworks} columns="md:grid-cols-2 lg:grid-cols-3" headingClassName="mb-10" />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work_methodology" sectionId="decision_speed">
        <Section>
          <Container>
            <FadeIn>
              <CmsTextBlock content={decisionSpeed} />
            </FadeIn>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work_methodology" sectionId="cta_band">
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
