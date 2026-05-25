import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { FadeIn } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about how we work, pricing, and engagement.",
};

export default async function FaqPage() {
  const store = await loadMarketingPageStore();
  const hero = pageHeroContent(store, "faq");
  const cta = pageCtaContent(store, "faq");
  const faqBlock = getSectionContent<{ faqs?: { q?: string; a?: string }[] }>(store, "faq", "faq_list");
  const faqs = (faqBlock.faqs ?? []).filter((f) => f.q?.trim() && f.a?.trim());

  return (
    <>
      <PageSection pageId="faq" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="faq" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container className="max-w-3xl">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="faq" sectionId="faq_list">
        <Section>
          <Container className="max-w-3xl">
            {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <FadeIn key={f.q} delay={i * 0.04}>
                  <details className="group rounded-2xl border border-hairline bg-surface-card p-6 transition-all hover:border-hairline-strong lg:p-7">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-[20px] text-ink">
                      {f.q}
                      <span className="font-sans text-2xl text-muted transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-4 text-[15.5px] leading-relaxed text-body">{f.a}</p>
                  </details>
                </FadeIn>
              ))}
            </div>
            ) : null}
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="faq" sectionId="cta_band">
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
