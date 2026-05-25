import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { Button } from "@/components/ui/button";
import { getIndustries } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries",
  description: "Vertical expertise across healthcare, financial services, manufacturing, retail, professional services, and public sector.",
};

export default async function IndustriesHubPage() {
  const store = await loadMarketingPageStore();
  const industries = await getIndustries();
  const hero = pageHeroContent(store, "industries");
  const cta = pageCtaContent(store, "industries");

  return (
    <>
      <PageSection pageId="industries" sectionId="hero">
        <CmsPageHero {...hero}>
          <Button href="/book-consultation" size="lg">
            Book consultation
          </Button>
        </CmsPageHero>
      </PageSection>

      <PageSection pageId="industries" sectionId="grid">
        <Section>
          <Container>
            {industries.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {industries.map((i) => (
                  <StaggerItem key={i.slug}>
                    <Link
                      href={`/industries/${i.slug}`}
                      className="group block h-full rounded-2xl border border-hairline bg-surface-card p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-[26px] text-ink">{i.name}</h3>
                        <ArrowUpRight className="h-5 w-5 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                      </div>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted">{i.short}</p>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="industries" sectionId="cta_band">
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
