import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { getLeadership } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet the people behind DigSolutions.",
};

export default async function LeadershipPage() {
  const store = await loadMarketingPageStore();
  const leadership = await getLeadership();
  const hero = pageHeroContent(store, "about_leadership");
  const cta = pageCtaContent(store, "about_leadership");

  return (
    <>
      <PageSection pageId="about_leadership" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="about_leadership" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Leadership" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_leadership" sectionId="team_grid">
        <Section>
          <Container>
            {leadership.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {leadership.map((p) => (
                  <StaggerItem key={p.name}>
                    <div className="h-full rounded-2xl border border-hairline bg-surface-card p-6">
                      <div
                        className="aspect-square w-full rounded-xl bg-gradient-to-br from-orb-lavender/40 via-orb-mint/40 to-orb-peach/40"
                        aria-hidden
                      />
                      <h3 className="mt-5 font-display text-[22px] text-ink">{p.name}</h3>
                      <p className="mt-1 text-[13px] uppercase tracking-wider text-muted">{p.role}</p>
                      <p className="mt-3 text-[14.5px] leading-relaxed text-body">{p.bio}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_leadership" sectionId="cta_band">
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
