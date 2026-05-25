import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CmsPartnerGrid } from "@/components/marketing/cms-blocks";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";

export const metadata: Metadata = {
  title: "Partners",
  description: "Our technology and alliance partners.",
};

export default async function PartnersPage() {
  const store = await loadMarketingPageStore();
  const hero = pageHeroContent(store, "about_partners");
  const partners = getSectionContent(store, "about_partners", "partners_grid");
  const cta = pageCtaContent(store, "about_partners");

  return (
    <>
      <PageSection pageId="about_partners" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="about_partners" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Partners" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_partners" sectionId="partners_grid">
        <Section>
          <Container>
            <CmsPartnerGrid content={partners} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_partners" sectionId="cta_band">
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
