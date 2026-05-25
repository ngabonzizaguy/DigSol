import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { FileText, Download } from "lucide-react";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { getGuides } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";

export const metadata: Metadata = {
  title: "Guides",
  description: "Long-form playbooks, checklists, and frameworks from the DigSolutions team.",
};

export default async function GuidesIndexPage() {
  const store = await loadMarketingPageStore();
  const guides = await getGuides();
  const hero = pageHeroContent(store, "insights_guides");
  const cta = pageCtaContent(store, "insights_guides");

  return (
    <>
      <PageSection pageId="insights_guides" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="insights_guides" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Guides" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights_guides" sectionId="guides_grid">
        <Section>
          <Container>
            {guides.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {guides.map((g) => (
                  <StaggerItem key={g.slug}>
                    <Link
                      href="/contact?intent=guide"
                      className="group block h-full rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-sans text-[18px] font-medium text-ink">{g.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">{g.excerpt}</p>
                      <div className="mt-5 flex items-center justify-between text-[12px] uppercase tracking-wider text-muted">
                        <span>
                          {g.format} · {g.pages} pages
                        </span>
                        <span className="inline-flex items-center gap-1 text-ink">
                          <Download className="h-3.5 w-3.5" /> Get
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights_guides" sectionId="cta_band">
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
