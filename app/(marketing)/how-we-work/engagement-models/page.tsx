import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CmsSectionHeading } from "@/components/marketing/cms-section-heading";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { PricingCard } from "@/components/marketing/pricing-card";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getPricingTiersForMarketing } from "@/lib/marketing/pricing-tiers";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import type { SectionHeadingContent } from "@/lib/marketing/home-content";

export const metadata: Metadata = {
  title: "Engagement models",
  description: "How we structure projects, retainers, and enterprise programs.",
};

export default async function EngagementModelsPage() {
  const [store, tiers] = await Promise.all([
    loadMarketingPageStore(),
    getPricingTiersForMarketing(),
  ]);
  const hero = pageHeroContent(store, "how_we_work_engagement_models");
  const modelsContent = getSectionContent<SectionHeadingContent>(store, "how_we_work_engagement_models", "models");
  const cta = pageCtaContent(store, "how_we_work_engagement_models");

  return (
    <>
      <PageSection pageId="how_we_work_engagement_models" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="how_we_work_engagement_models" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "How we work", href: "/how-we-work" },
                { label: "Engagement models" },
              ]}
            />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work_engagement_models" sectionId="models">
        {tiers.length > 0 ? (
          <Section>
            <Container>
              <CmsSectionHeading content={modelsContent} className="mb-12" />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {tiers.map((t) => (
                  <PricingCard key={t.name} tier={t} />
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="how_we_work_engagement_models" sectionId="cta_band">
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
