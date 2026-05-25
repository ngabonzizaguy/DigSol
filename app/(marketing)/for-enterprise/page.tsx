import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CmsSectionHeading } from "@/components/marketing/cms-section-heading";
import { CtaBand } from "@/components/marketing/cta-band";
import { getCaseStudies } from "@/lib/content/fetchers";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { CmsIconCardGrid, CmsPhaseGrid } from "@/components/marketing/cms-blocks";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeadingContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";

export const metadata: Metadata = {
  title: "For enterprise",
  description: "Multi-workstream digital transformation programs with governance, security, and dedicated delivery pods.",
};

export default async function EnterprisePage() {
  const store = await loadMarketingPageStore();
  const caseStudies = await getCaseStudies();
  const entCases = caseStudies.filter((c) => c.segment === "enterprise" || c.segment === "midmarket");
  const hero = pageHeroContent(store, "for_enterprise");
  const pillars = getSectionContent(store, "for_enterprise", "pillars");
  const governance = getSectionContent(store, "for_enterprise", "governance");
  const proofHead = pageHeadingContent(store, "for_enterprise", "proof");
  const cta = pageCtaContent(store, "for_enterprise");

  return (
    <>
      <PageSection pageId="for_enterprise" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="for_enterprise" sectionId="pillars">
        <Section>
          <Container>
            <CmsIconCardGrid content={pillars} columns="md:grid-cols-2" headingClassName="mb-10" />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="for_enterprise" sectionId="governance">
        <Section className="border-y border-hairline bg-canvas-soft">
          <Container>
            <CmsPhaseGrid content={governance} headingClassName="mb-10" />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="for_enterprise" sectionId="proof">
        {entCases.length > 0 ? (
          <Section>
            <Container>
              <CmsSectionHeading content={proofHead} className="mb-10" />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {entCases.map((c) => (
                  <CaseStudyCard key={c.slug} study={c} />
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="for_enterprise" sectionId="cta_band">
        <CtaBand
          title={cta.title ?? "Brief our enterprise team."}
          subtitle={cta.subtitle ?? "We respond within one business day with a tailored discussion guide and proposed agenda."}
          primaryLabel={cta.primary_label ?? "Request briefing"}
          primaryHref={cta.primary_href ?? "/contact?intent=enterprise"}
          secondaryLabel={cta.secondary_label ?? "Security & compliance"}
          secondaryHref={cta.secondary_href ?? "/how-we-work/security-compliance"}
        />
      </PageSection>
    </>
  );
}
