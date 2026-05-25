import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { ServiceCard } from "@/components/marketing/service-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Eight pillars of digital transformation — from strategy to AI, CRM, payments, and cloud.",
};

export default async function SolutionsHubPage() {
  const store = await loadMarketingPageStore();
  const services = await getServices();
  const hero = pageHeroContent(store, "solutions");
  const cta = pageCtaContent(store, "solutions");

  return (
    <>
      <PageSection pageId="solutions" sectionId="hero">
        <CmsPageHero {...hero}>
          <Button href="/book-consultation" size="lg">
            Book consultation
          </Button>
          <Button href="/work" variant="outline" size="lg">
            See outcomes
          </Button>
        </CmsPageHero>
      </PageSection>

      <PageSection pageId="solutions" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Solutions" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="solutions" sectionId="grid">
        <Section>
          <Container>
            {services.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <StaggerItem key={s.slug} className="h-full">
                    <ServiceCard service={s} className="h-full" />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="solutions" sectionId="cta_band">
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
