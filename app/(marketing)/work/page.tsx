import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { Button } from "@/components/ui/button";
import { getCaseStudies } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected case studies across SMB, mid-market, and enterprise — with the metrics that actually moved.",
};

export default async function WorkHubPage() {
  const store = await loadMarketingPageStore();
  const caseStudies = await getCaseStudies();
  const hero = pageHeroContent(store, "work");
  const cta = pageCtaContent(store, "work");

  return (
    <>
      <PageSection pageId="work" sectionId="hero">
        <CmsPageHero {...hero}>
          <Button href="/book-consultation" size="lg">
            Book consultation
          </Button>
          <Button href="/solutions" variant="outline" size="lg">
            Our solutions
          </Button>
        </CmsPageHero>
      </PageSection>

      <PageSection pageId="work" sectionId="grid">
        <Section>
          <Container>
            {caseStudies.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {caseStudies.map((c, i) => (
                  <StaggerItem key={c.slug} className={i === 0 ? "lg:col-span-2" : ""}>
                    <CaseStudyCard study={c} featured={i === 0} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="work" sectionId="cta_band">
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
