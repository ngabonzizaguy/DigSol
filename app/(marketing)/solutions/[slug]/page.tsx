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
import { getService, services } from "@/lib/content/services";
import { caseStudies } from "@/lib/content/work";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { Check } from "lucide-react";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.short,
  };
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const studies = caseStudies.filter((c) => c.services.includes(service.slug)).slice(0, 2);

  return (
    <>
      <PageHero eyebrow="Solution" title={service.title} subtitle={service.long}>
        <Button href="/book-consultation" size="lg">Discuss this solution</Button>
        <Button href="/solutions" variant="outline" size="lg">All solutions</Button>
      </PageHero>

      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Solutions", href: "/solutions" },
              { label: service.title },
            ]}
          />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FadeIn>
              <Card>
                <CardTitle>Outcomes</CardTitle>
                <ul className="mt-4 space-y-3">
                  {service.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-[15px] text-body">
                      <Check className="h-4 w-4 mt-1 text-success flex-shrink-0" /> {o}
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
                      <Check className="h-4 w-4 mt-1 text-success flex-shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
            <FadeIn delay={0.16}>
              <Card>
                <CardTitle>Capabilities</CardTitle>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.capabilities.map((c) => (
                    <Badge key={c} variant="outline">{c}</Badge>
                  ))}
                </div>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {studies.length > 0 && (
        <Section className="bg-canvas-soft border-y border-hairline">
          <Container>
            <FadeIn>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-4">Case studies</p>
              <h2 className="font-display text-display-xl text-ink mb-10">Where this pillar made the difference.</h2>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {studies.map((s) => (
                <StaggerItem key={s.slug}>
                  <CaseStudyCard study={s} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-4">Related solutions</p>
            <h2 className="font-display text-display-lg text-ink mb-8">Continue exploring.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
