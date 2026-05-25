import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCaseStudies, getIndustries, getIndustry } from "@/lib/content/fetchers";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent } from "@/lib/marketing/marketing-page-content";

export async function generateStaticParams() {
  const industries = await getIndustries();
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = await getIndustry(slug);
  if (!i) return {};
  return { title: i.name, description: i.short };
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await loadMarketingPageStore();
  const cta = pageCtaContent(store, "industries_detail");
  const [industry, caseStudies] = await Promise.all([getIndustry(slug), getCaseStudies()]);
  if (!industry) notFound();
  const relevant = caseStudies.filter((c) =>
    c.industry.toLowerCase().includes(industry.name.toLowerCase().split(" ")[0]),
  );

  return (
    <>
      <PageSection pageId="industries_detail" sectionId="hero">
        <PageHero eyebrow="Industry" title={industry.name} subtitle={industry.short}>
          <Button href="/book-consultation" size="lg">
            Talk to a {industry.name.toLowerCase()} specialist
          </Button>
        </PageHero>
      </PageSection>

      <PageSection pageId="industries_detail" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Industries", href: "/industries" },
                { label: industry.name },
              ]}
            />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="industries_detail" sectionId="challenges">
        <Section>
          <Container>
            <FadeIn>
              <Card>
                <CardTitle>Common challenges</CardTitle>
                <ul className="mt-4 space-y-3">
                  {industry.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-[15px] text-body">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-error" /> {c}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="industries_detail" sectionId="solutions">
        <Section>
          <Container>
            <FadeIn>
              <Card>
                <CardTitle>How we help</CardTitle>
                <ul className="mt-4 space-y-3">
                  {industry.solutions.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-[15px] text-body">
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-success" /> {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="industries_detail" sectionId="related_work">
        {relevant.length > 0 ? (
          <Section className="border-y border-hairline bg-canvas-soft">
            <Container>
              <h2 className="mb-8 font-display text-display-lg text-ink">Work in {industry.name.toLowerCase()}.</h2>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {relevant.map((c) => (
                  <CaseStudyCard key={c.slug} study={c} />
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="industries_detail" sectionId="cta_band">
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
