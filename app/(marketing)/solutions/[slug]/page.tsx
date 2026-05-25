import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { ServiceCard } from "@/components/marketing/service-card";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { getCaseStudies, getService, getServices } from "@/lib/content/fetchers";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { loadMarketingPageStore, pageCtaContent } from "@/lib/marketing/marketing-page-content";
import { Check } from "lucide-react";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.short,
  };
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await loadMarketingPageStore();
  const cta = pageCtaContent(store, "solutions_detail");
  const [service, services, caseStudies] = await Promise.all([getService(slug), getServices(), getCaseStudies()]);
  if (!service) notFound();
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const studies = caseStudies.filter((c) => c.services.includes(service.slug)).slice(0, 2);

  return (
    <>
      <PageSection pageId="solutions_detail" sectionId="hero">
        <PageHero eyebrow="Solution" title={service.title} subtitle={service.long}>
          <Button href="/book-consultation" size="lg">
            Discuss this solution
          </Button>
          <Button href="/solutions" variant="outline" size="lg">
            All solutions
          </Button>
        </PageHero>
      </PageSection>

      <PageSection pageId="solutions_detail" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Solutions", href: "/solutions" },
                { label: service.title },
              ]}
            />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="solutions_detail" sectionId="overview">
        <Section>
          <Container>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FadeIn>
                <Card>
                  <CardTitle>Outcomes</CardTitle>
                  <ul className="mt-4 space-y-3">
                    {service.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-3 text-[15px] text-body">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0 text-success" /> {o}
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeIn>
              <FadeIn delay={0.08}>
                <Card>
                  <CardTitle>Deliverables</CardTitle>
                  <ul className="mt-4 space-y-3">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-[15px] text-body">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0 text-success" /> {d}
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeIn>
            </div>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="solutions_detail" sectionId="capabilities">
        <Section>
          <Container>
            <FadeIn>
              <Card>
                <CardTitle>Capabilities</CardTitle>
                <CardDescription className="sr-only">Technical capabilities for this solution</CardDescription>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.capabilities.map((c) => (
                    <Badge key={c} variant="outline">
                      {c}
                    </Badge>
                  ))}
                </div>
              </Card>
            </FadeIn>
            {related.length > 0 ? (
              <div className="mt-16">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Related solutions</p>
                <h2 className="mb-8 font-display text-display-lg text-ink">Continue exploring.</h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {related.map((s) => (
                    <ServiceCard key={s.slug} service={s} />
                  ))}
                </div>
              </div>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="solutions_detail" sectionId="related_work">
        {studies.length > 0 ? (
          <Section className="border-y border-hairline bg-canvas-soft">
            <Container>
              <FadeIn>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Case studies</p>
                <h2 className="mb-10 font-display text-display-xl text-ink">Where this pillar made the difference.</h2>
              </FadeIn>
              <StaggerChildren className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {studies.map((s) => (
                  <StaggerItem key={s.slug}>
                    <CaseStudyCard study={s} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="solutions_detail" sectionId="cta_band">
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
