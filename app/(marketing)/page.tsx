import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeHeroPreview } from "@/components/marketing/home-hero-preview";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { StatCounter } from "@/components/marketing/stat-counter";
import { CmsSectionHeading } from "@/components/marketing/cms-section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { CmsHomeFeaturesGrid, CmsProcessStepper } from "@/components/marketing/cms-blocks";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { PricingCard } from "@/components/marketing/pricing-card";
import { getPricingTiersForMarketing } from "@/lib/marketing/pricing-tiers";
import { CtaBand } from "@/components/marketing/cta-band";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { getServices, getCaseStudies, getTestimonials } from "@/lib/content/fetchers";
import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import type { CtaBandContent, HomeHeroContent, HomeHeroPreviewContent, HomeTrustContent, SectionHeadingContent } from "@/lib/marketing/home-content";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const store = await getPageSectionsStore();
  const [services, caseStudies, testimonials] = await Promise.all([
    getServices(),
    getCaseStudies(),
    getTestimonials(),
  ]);

  const hero = getSectionContent<HomeHeroContent>(store, "home", "hero");
  const preview = getSectionContent<HomeHeroPreviewContent>(store, "home", "hero_preview_card");
  const trust = getSectionContent<HomeTrustContent>(store, "home", "trust");
  const servicesHead = getSectionContent<SectionHeadingContent>(store, "home", "services");
  const featuresContent = getSectionContent(store, "home", "features");
  const processContent = getSectionContent(store, "home", "process");
  const portfolioHead = getSectionContent<SectionHeadingContent>(store, "home", "portfolio");
  const testimonialsHead = getSectionContent<SectionHeadingContent>(store, "home", "testimonials");
  const pricingContent = getSectionContent<SectionHeadingContent>(store, "home", "pricing");
  const tiers = await getPricingTiersForMarketing();
  const cta = getSectionContent<CtaBandContent>(store, "home", "cta_band");

  const featuredCases = caseStudies.slice(0, 3);
  const stats = (trust.stats ?? []).filter((s) => s.value?.trim() && s.label?.trim());

  return (
    <>
      <PageSection pageId="home" sectionId="hero">
        <HomeHero content={hero} />
      </PageSection>

      <PageSection pageId="home" sectionId="hero_preview_card">
        <HomeHeroPreview content={preview} />
      </PageSection>

      <PageSection pageId="home" sectionId="trust">
        <section className="relative border-y border-hairline bg-canvas-soft py-14 lg:py-16">
          <Container>
            {trust.label?.trim() ? (
              <FadeIn>
                <p className="mb-10 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {trust.label}
                </p>
              </FadeIn>
            ) : null}
            <LogoMarquee />
            {stats.length > 0 ? (
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-hairline pt-12 lg:grid-cols-4 lg:gap-12">
                {stats.map((s, i) => (
                  <StatCounter key={`${s.label}-${i}`} value={s.value!} label={s.label!} delay={i * 0.08} />
                ))}
              </div>
            ) : null}
          </Container>
        </section>
      </PageSection>

      <PageSection pageId="home" sectionId="services">
        <Section>
          <Container>
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <CmsSectionHeading content={servicesHead} />
              {services.length > 0 ? (
                <Button href="/solutions" variant="outline" className="self-start lg:self-end">
                  View all solutions <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
            {services.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                {services.map((s) => (
                  <StaggerItem key={s.slug}>
                    <ServiceCard service={s} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="home" sectionId="features">
        <Section className="border-y border-hairline bg-canvas-soft">
          <Container>
            <CmsSectionHeading content={featuresContent} className="mb-12" />
            <CmsHomeFeaturesGrid content={featuresContent} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="home" sectionId="process">
        <Section>
          <Container>
            <CmsSectionHeading content={processContent} className="mb-14" />
            <CmsProcessStepper content={processContent} showLink />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="home" sectionId="portfolio">
        <Section className="border-y border-hairline bg-canvas-soft">
          <Container>
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <CmsSectionHeading content={portfolioHead} />
              {featuredCases.length > 0 ? (
                <Button href="/work" variant="outline" className="self-start lg:self-end">
                  View all work <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
            {featuredCases.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {featuredCases.map((c, i) => (
                  <StaggerItem key={c.slug} className={i === 0 ? "lg:col-span-2" : ""}>
                    <CaseStudyCard study={c} featured={i === 0} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="home" sectionId="testimonials">
        <Section>
          <Container>
            <CmsSectionHeading content={testimonialsHead} align="center" className="mb-12" />
            {testimonials.length > 0 ? <TestimonialCarousel items={testimonials} /> : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="home" sectionId="pricing">
        {tiers.length > 0 ? (
          <Section className="border-y border-hairline bg-canvas-soft">
            <Container>
              <CmsSectionHeading content={pricingContent} align="center" className="mb-14" />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
                {tiers.map((t) => (
                  <PricingCard key={t.name} tier={t} />
                ))}
              </div>
              <FadeIn className="mt-8 text-center">
                <p className="text-[14px] text-muted">
                  Need something else? <a href="/contact" className="text-ink underline underline-offset-4">Talk to us</a>.
                </p>
              </FadeIn>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="home" sectionId="cta_band">
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
