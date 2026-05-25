import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { PageSection } from "@/components/marketing/page-section";
import { getOpenRoles } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles and what it's like to work at DigSolutions.",
};

export default async function CareersPage() {
  const store = await loadMarketingPageStore();
  const openRoles = await getOpenRoles();
  const hero = pageHeroContent(store, "about_careers");
  const cta = pageCtaContent(store, "about_careers");

  return (
    <>
      <PageSection pageId="about_careers" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="about_careers" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Careers" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_careers" sectionId="roles_list">
        <Section>
          <Container>
            {openRoles.length > 0 ? (
              <div className="divide-y divide-hairline rounded-2xl border border-hairline bg-surface-card">
                {openRoles.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/about/careers/${r.slug}`}
                    className="group flex flex-col gap-3 p-6 transition hover:bg-canvas-soft lg:flex-row lg:items-center lg:justify-between lg:p-7"
                  >
                    <div>
                      <h3 className="font-display text-[22px] text-ink">{r.title}</h3>
                      <p className="mt-1 text-[13px] uppercase tracking-wider text-muted">
                        {r.team} · {r.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{r.type}</Badge>
                      <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_careers" sectionId="cta_band">
        <CtaBand
          title={cta.title ?? "Don't see your role?"}
          subtitle={cta.subtitle ?? "We're always interested in hearing from senior people who like our work."}
          primaryLabel={cta.primary_label ?? "Get in touch"}
          primaryHref={cta.primary_href ?? "/contact?intent=careers"}
          secondaryLabel={cta.secondary_label}
          secondaryHref={cta.secondary_href}
        />
      </PageSection>
    </>
  );
}
