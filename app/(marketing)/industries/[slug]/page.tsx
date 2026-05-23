import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getIndustry, industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/work";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = getIndustry(slug);
  if (!i) return {};
  return { title: i.name, description: i.short };
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();
  const relevant = caseStudies.filter((c) => c.industry.toLowerCase().includes(industry.name.toLowerCase().split(" ")[0]));

  return (
    <>
      <PageHero eyebrow="Industry" title={industry.name} subtitle={industry.short}>
        <Button href="/book-consultation" size="lg">Talk to a {industry.name.toLowerCase()} specialist</Button>
      </PageHero>

      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Industries", href: "/industries" },
              { label: industry.name },
            ]}
          />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <FadeIn>
              <Card>
                <CardTitle>Common challenges</CardTitle>
                <ul className="mt-4 space-y-3">
                  {industry.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-[15px] text-body">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-error flex-shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
            <FadeIn delay={0.08}>
              <Card>
                <CardTitle>How we help</CardTitle>
                <ul className="mt-4 space-y-3">
                  {industry.solutions.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-[15px] text-body">
                      <Check className="h-4 w-4 mt-1 text-success flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {relevant.length > 0 && (
        <Section className="bg-canvas-soft border-y border-hairline">
          <Container>
            <h2 className="font-display text-display-lg text-ink mb-8">Work in {industry.name.toLowerCase()}.</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {relevant.map((c) => (
                <CaseStudyCard key={c.slug} study={c} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
