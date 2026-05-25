import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { getInsights } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";

export const metadata: Metadata = {
  title: "Blog",
  description: "All essays and field notes from the DigSolutions team.",
};

export default async function BlogIndexPage() {
  const store = await loadMarketingPageStore();
  const insights = await getInsights();
  const hero = pageHeroContent(store, "insights_blog");
  const cta = pageCtaContent(store, "insights_blog");

  return (
    <>
      <PageSection pageId="insights_blog" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="insights_blog" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Blog" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights_blog" sectionId="posts_grid">
        <Section>
          <Container>
            {insights.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {insights.map((p) => (
                  <StaggerItem key={p.slug}>
                    <Link
                      href={`/insights/${p.slug}`}
                      className="group block h-full rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                    >
                      <Badge>{p.category}</Badge>
                      <h3 className="mt-4 font-display text-[22px] leading-snug text-ink">{p.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{p.excerpt}</p>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights_blog" sectionId="cta_band">
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
