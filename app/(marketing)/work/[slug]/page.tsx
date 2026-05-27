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
import { ArrowRight, ExternalLink, Quote } from "lucide-react";

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
              {study.show_project_url && study.project_url ? (
                <a
                  href={study.project_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface-card px-4 py-2 text-[14px] text-ink transition hover:bg-surface-strong"
                >
                  Visit the live project
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </FadeIn>
            {study.cover_url ? (
              <FadeIn delay={0.1}>
                <div className="mt-10 overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={study.cover_url} alt={study.title} className="aspect-[16/9] w-full object-cover" />
                </div>
              </FadeIn>
            ) : null}
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

      <PageSection pageId="work_detail" sectionId="gallery">
        {study.media_gallery && study.media_gallery.length > 0 ? (
          <Section>
            <Container>
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Project gallery</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {study.media_gallery.map((m, i) => {
                  const isVideo = (m.mime ?? "").startsWith("video/") || /\.(mp4|webm|mov|ogg)$/i.test(m.url);
                  return (
                    <FadeIn key={`${m.url}-${i}`} delay={Math.min(i * 0.05, 0.3)}>
                      <div className="overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-soft">
                        {isVideo ? (
                          <video
                            src={m.url}
                            controls
                            playsInline
                            preload="metadata"
                            className="aspect-video w-full bg-canvas-soft object-cover"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.url}
                            alt={m.alt ?? `${study.title} gallery image ${i + 1}`}
                            className="aspect-video w-full object-cover"
                          />
                        )}
                        {m.caption ? (
                          <p className="px-5 py-3 text-[13px] text-muted">{m.caption}</p>
                        ) : null}
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="work_detail" sectionId="customer_quote">
        {study.customer_quote ? (
          <Section>
            <Container>
              <FadeIn>
                <figure className="mx-auto max-w-3xl rounded-2xl border border-hairline bg-surface-card p-8 shadow-soft lg:p-12">
                  <Quote className="h-7 w-7 text-muted" aria-hidden />
                  <blockquote className="mt-4 font-display text-[24px] leading-snug text-ink lg:text-[28px]">
                    &ldquo;{study.customer_quote}&rdquo;
                  </blockquote>
                  {study.customer_name || study.customer_role ? (
                    <figcaption className="mt-5 text-[13px] text-muted">
                      {study.customer_name ? (
                        <span className="font-semibold text-ink">{study.customer_name}</span>
                      ) : null}
                      {study.customer_name && study.customer_role ? <span> · </span> : null}
                      {study.customer_role ? <span>{study.customer_role}</span> : null}
                    </figcaption>
                  ) : null}
                </figure>
              </FadeIn>
            </Container>
          </Section>
        ) : null}
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
