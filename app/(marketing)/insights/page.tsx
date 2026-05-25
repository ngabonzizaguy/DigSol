import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CmsSectionHeading } from "@/components/marketing/cms-section-heading";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { getGuides, getInsights } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent, pageHeadingContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { ArrowUpRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights",
  description: "Essays, guides, and field notes on digital transformation, AI, and modern product engineering.",
};

export default async function InsightsHubPage() {
  const store = await loadMarketingPageStore();
  const [insightsList, guides] = await Promise.all([getInsights(), getGuides()]);
  const hero = pageHeroContent(store, "insights");
  const guidesTeaser = pageHeadingContent(store, "insights", "guides_teaser");
  const cta = pageCtaContent(store, "insights");
  const [featured, ...rest] = insightsList;

  return (
    <>
      <PageSection pageId="insights" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="insights" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights" sectionId="featured_post">
        {featured ? (
          <Section>
            <Container>
              <Link
                href={`/insights/${featured.slug}`}
                className="group block overflow-hidden rounded-2xl border border-hairline bg-surface-card transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
                  <div className="relative aspect-[16/10] bg-canvas-soft lg:aspect-auto">
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-br from-orb-lavender/60 via-orb-mint/40 to-transparent transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="flex items-center gap-2">
                      <Badge>{featured.category}</Badge>
                      <span className="text-[12px] text-muted">{featured.readTime}</span>
                    </div>
                    <h2 className="mt-4 font-display text-[36px] leading-tight text-balance text-ink">{featured.title}</h2>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{featured.excerpt}</p>
                    <div className="mt-6 flex items-center gap-2 text-[14px] text-ink">
                      Read article{" "}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="insights" sectionId="posts_grid">
        {rest.length > 0 ? (
          <Section>
            <Container>
              <StaggerChildren className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <StaggerItem key={post.slug}>
                    <Link
                      href={`/insights/${post.slug}`}
                      className="group block h-full rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                    >
                      <div className="flex items-center gap-2">
                        <Badge>{post.category}</Badge>
                        <span className="text-[12px] text-muted">{post.readTime}</span>
                      </div>
                      <h3 className="mt-4 font-display text-[22px] leading-snug text-ink">{post.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{post.excerpt}</p>
                      <p className="mt-5 text-[12.5px] text-muted">
                        {post.author} · {post.role}
                      </p>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="insights" sectionId="guides_teaser">
        {guides.length > 0 ? (
          <Section className="border-y border-hairline bg-canvas-soft">
            <Container>
              <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <CmsSectionHeading content={guidesTeaser} />
                <Button href="/insights/guides" variant="outline" className="self-start lg:self-end">
                  View all guides
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {guides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/insights/guides/${g.slug}`}
                    className="group block rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-sans text-[18px] font-medium text-ink">{g.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{g.excerpt}</p>
                    <p className="mt-4 text-[12px] uppercase tracking-wider text-muted">
                      {g.format} · {g.pages} pages
                    </p>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="insights" sectionId="cta_band">
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
