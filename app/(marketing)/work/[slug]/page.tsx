import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/marketing/fade-in";
import { GradientOrb } from "@/components/marketing/gradient-orb";
import { PageSection } from "@/components/marketing/page-section";
import { getCaseStudies, getCaseStudy, getService } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent } from "@/lib/marketing/marketing-page-content";
import { ArrowRight } from "lucide-react";

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return {};
  return { title: c.title, description: c.summary };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await loadMarketingPageStore();
  const cta = pageCtaContent(store, "work_detail");
  const study = await getCaseStudy(slug);
  if (!study) notFound();
  const linkedServices = (await Promise.all(study.services.map((s) => getService(s)))).filter(
    (svc): svc is NonNullable<typeof svc> => svc != null,
  );

  return (
    <>
      <PageSection pageId="work_detail" sectionId="hero">
        <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24">
          <GradientOrb color={study.orb} className="-top-40 -right-40" size={700} slow />
          <Container className="relative">
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge>
                {study.segment === "smb" ? "Small business" : study.segment === "midmarket" ? "Mid-market" : "Enterprise"}
              </Badge>
              <Badge variant="outline">{study.industry}</Badge>
            </div>
            <FadeIn>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{study.client}</p>
              <h1 className="mt-3 max-w-4xl text-balance font-display text-display-mega text-ink">{study.title}</h1>
              <p className="mt-6 max-w-2xl text-pretty text-[18px] leading-relaxed text-body">{study.summary}</p>
            </FadeIn>
          </Container>
        </section>
      </PageSection>

      <PageSection pageId="work_detail" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Work", href: "/work" },
                { label: study.client },
              ]}
            />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="work_detail" sectionId="metrics">
        <Section>
          <Container>
            <div className="rounded-2xl border border-hairline bg-surface-card p-8 shadow-soft lg:p-10">
              <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
                {study.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="font-display text-display-lg leading-none text-ink">{m.value}</p>
                    <p className="mt-2 text-[12px] uppercase tracking-wider text-muted">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="work_detail" sectionId="story">
        <Section>
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <FadeIn>
                <h2 className="font-display text-[28px] text-ink">Challenge</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-body">{study.challenge}</p>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h2 className="font-display text-[28px] text-ink">Approach</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-body">{study.approach}</p>
              </FadeIn>
              <FadeIn delay={0.16}>
                <h2 className="font-display text-[28px] text-ink">Outcome</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-body">{study.outcome}</p>
              </FadeIn>
            </div>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="work_detail" sectionId="services_involved">
        {linkedServices.length > 0 ? (
          <Section className="border-y border-hairline bg-canvas-soft">
            <Container>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Services involved</p>
              <div className="flex flex-wrap gap-3">
                {linkedServices.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={`/solutions/${svc.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface-card px-4 py-2 text-[14px] text-ink transition hover:bg-surface-strong"
                  >
                    {svc.title} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="work_detail" sectionId="cta_band">
        <CtaBand
          title={cta.title ?? "Want a similar outcome?"}
          subtitle={cta.subtitle ?? "We'll spend the first 30 minutes diagnosing your situation — for free."}
          primaryLabel={cta.primary_label ?? "Book consultation"}
          primaryHref={cta.primary_href}
          secondaryLabel={cta.secondary_label}
          secondaryHref={cta.secondary_href}
        />
      </PageSection>
    </>
  );
}
