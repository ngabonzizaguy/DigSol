import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/marketing/fade-in";
import { GradientOrb } from "@/components/marketing/gradient-orb";
import { getCaseStudy, caseStudies } from "@/lib/content/work";
import { getService } from "@/lib/content/services";
import { ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return { title: c.title, description: c.summary };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24">
        <GradientOrb color={study.orb} className="-top-40 -right-40" size={700} slow />
        <Container className="relative">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Work", href: "/work" },
              { label: study.client },
            ]}
          />
          <FadeIn>
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge>{study.segment === "smb" ? "Small business" : study.segment === "midmarket" ? "Mid-market" : "Enterprise"}</Badge>
              <Badge variant="outline">{study.industry}</Badge>
            </div>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{study.client}</p>
            <h1 className="mt-3 font-display text-display-mega text-ink max-w-4xl text-balance">{study.title}</h1>
            <p className="mt-6 max-w-2xl text-[18px] text-body text-pretty leading-relaxed">{study.summary}</p>
          </FadeIn>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="rounded-2xl border border-hairline bg-surface-card p-8 lg:p-10 shadow-soft">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {study.metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-display-lg text-ink leading-none">{m.value}</p>
                  <p className="mt-2 text-[12px] uppercase tracking-wider text-muted">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <FadeIn>
              <h2 className="font-display text-[28px] text-ink">Challenge</h2>
              <p className="mt-3 text-[16px] text-body leading-relaxed">{study.challenge}</p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h2 className="font-display text-[28px] text-ink">Approach</h2>
              <p className="mt-3 text-[16px] text-body leading-relaxed">{study.approach}</p>
            </FadeIn>
            <FadeIn delay={0.16}>
              <h2 className="font-display text-[28px] text-ink">Outcome</h2>
              <p className="mt-3 text-[16px] text-body leading-relaxed">{study.outcome}</p>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-4">Services involved</p>
          <div className="flex flex-wrap gap-3">
            {study.services.map((s) => {
              const svc = getService(s);
              if (!svc) return null;
              return (
                <Link
                  key={s}
                  href={`/solutions/${svc.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface-card px-4 py-2 text-[14px] text-ink hover:bg-surface-strong transition"
                >
                  {svc.title} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Want a similar outcome?"
        subtitle="We'll spend the first 30 minutes diagnosing your situation — for free."
        primaryLabel="Book consultation"
      />
    </>
  );
}
