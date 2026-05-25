import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CmsSectionHeading } from "@/components/marketing/cms-section-heading";
import { CtaBand } from "@/components/marketing/cta-band";
import { getCaseStudies } from "@/lib/content/fetchers";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { CmsChecklist, CmsIconCardGrid } from "@/components/marketing/cms-blocks";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeadingContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";

export const metadata: Metadata = {
  title: "For small businesses",
  description: "Fast, affordable digital transformation engagements for SMBs.",
};

export default async function SmbPage() {
  const store = await loadMarketingPageStore();
  const caseStudies = await getCaseStudies();
  const smbCases = caseStudies.filter((c) => c.segment === "smb");
  const hero = pageHeroContent(store, "for_smb");
  const benefits = getSectionContent(store, "for_smb", "benefits");
  const packageContent = getSectionContent(store, "for_smb", "package");
  const proofHead = pageHeadingContent(store, "for_smb", "proof");
  const cta = pageCtaContent(store, "for_smb");

  return (
    <>
      <PageSection pageId="for_smb" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="for_smb" sectionId="benefits">
        <Section>
          <Container>
            <CmsIconCardGrid content={benefits} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="for_smb" sectionId="package">
        <Section className="border-y border-hairline bg-canvas-soft">
          <Container>
            <CmsChecklist content={packageContent} headingClassName="mb-10" />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="for_smb" sectionId="proof">
        {smbCases.length > 0 ? (
          <Section>
            <Container>
              <CmsSectionHeading content={proofHead} className="mb-10" />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {smbCases.map((c) => (
                  <CaseStudyCard key={c.slug} study={c} />
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="for_smb" sectionId="cta_band">
        <CtaBand
          title={cta.title ?? "Ready to launch in 8 weeks?"}
          subtitle={
            cta.subtitle ??
            "Book a free 30-minute consultation and walk out with a roadmap — whether or not we work together."
          }
          primaryLabel={cta.primary_label ?? "Start your project"}
          primaryHref={cta.primary_href ?? "/book-consultation?intent=smb"}
          secondaryLabel={cta.secondary_label}
          secondaryHref={cta.secondary_href}
        />
      </PageSection>
    </>
  );
}
