import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeHero } from "@/components/marketing/hero";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { StatCounter } from "@/components/marketing/stat-counter";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { ProcessStepper } from "@/components/marketing/process-stepper";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { PricingCard, pricingTiers } from "@/components/marketing/pricing-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { services } from "@/lib/content/services";
import { caseStudies } from "@/lib/content/work";
import { stats } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const featuredCases = caseStudies.slice(0, 3);

  return (
    <>
      <HomeHero />

      {/* Trust */}
      <section className="relative border-y border-hairline bg-canvas-soft py-14 lg:py-16">
        <Container>
          <FadeIn>
            <p className="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-muted mb-10">
              Trusted by teams shipping real digital work
            </p>
          </FadeIn>
          <LogoMarquee />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-12 border-t border-hairline">
            {stats.map((s, i) => (
              <StatCounter key={s.label} value={s.value} label={s.label} delay={i * 0.08} />
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <Section>
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="What we do"
              title="One partner for the entire digital stack."
              subtitle="From strategy and brand to AI, CRM, payments, and cloud — we deliver the complete digital transformation surface for your business."
            />
            <Button href="/solutions" variant="outline" className="self-start lg:self-end">
              View all solutions <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {services.map((s) => (
              <StaggerItem key={s.slug}>
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>

      {/* Features / Differentiators */}
      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <SectionHeading
            eyebrow="Why DigSolutions"
            title="Premium agency breadth with SaaS-grade client experience."
            subtitle="We took the parts of consulting, agencies, and product teams that work — and dropped the parts that don't."
            className="mb-12"
          />
          <FeaturesGrid />
        </Container>
      </Section>

      {/* Process */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="A disciplined five-stage method."
            subtitle="Each stage is short, measurable, and produces a tangible artefact your team can review and act on."
            className="mb-14"
          />
          <ProcessStepper />
          <FadeIn className="mt-10">
            <Button href="/how-we-work" variant="ghost">
              Read the full methodology <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        </Container>
      </Section>

      {/* Portfolio */}
      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="Selected work"
              title="Outcomes, not output."
              subtitle="A taste of recent engagements across SMB, mid-market, and enterprise."
            />
            <Button href="/work" variant="outline" className="self-start lg:self-end">
              View all work <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {featuredCases.map((c, i) => (
              <StaggerItem key={c.slug} className={i === 0 ? "lg:col-span-2" : ""}>
                <CaseStudyCard study={c} featured={i === 0} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Word of mouth"
            title="The kind of partner clients keep on retainer."
            align="center"
            className="mb-12"
          />
          <TestimonialCarousel />
        </Container>
      </Section>

      {/* Pricing */}
      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <SectionHeading
            eyebrow="Engagement models"
            title="From single projects to multi-year platforms."
            subtitle="Clear starting prices. Custom scoping. Every engagement begins with a free 30-minute consultation."
            align="center"
            className="mb-14"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {pricingTiers.map((t) => (
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

      <CtaBand />
    </>
  );
}
