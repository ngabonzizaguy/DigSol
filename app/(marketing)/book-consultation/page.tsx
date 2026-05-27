import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { ConsultationForm } from "@/components/marketing/consultation-form";
import { FadeIn } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import { getQuickStartConfig } from "@/lib/marketing/quick-start-server";
import { Check, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Free 30-minute consultation. No pitch deck. Three concrete takeaways.",
};

const EXPECTATION_ICONS = [Clock, Calendar, Check, Check];

export default async function BookConsultationPage() {
  const [store, qs] = await Promise.all([loadMarketingPageStore(), getQuickStartConfig()]);
  const hero = pageHeroContent(store, "book_consultation");
  const expectations = getSectionContent<{ title?: string; body?: string }>(store, "book_consultation", "expectations");
  const title = expectations.title?.trim() || "What to expect.";
  const lines = (expectations.body ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.slice(0, 4);
  const footerNote = lines.length > 4 ? lines.slice(4).join(" ") : lines.length === 0 ? "" : "";

  return (
    <>
      <PageSection pageId="book_consultation" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <Section>
        <Container>
          <div className="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <PageSection pageId="book_consultation" sectionId="form">
              <FadeIn className="min-w-0">
                <div className="min-w-0 overflow-hidden rounded-2xl border border-hairline bg-surface-card p-5 shadow-soft sm:p-8 lg:p-10">
                  <ConsultationForm
                    whatsappNumber={qs.whatsapp.number_e164 || undefined}
                    defaultCountry={qs.whatsapp.default_country}
                  />
                  <p className="mt-5 text-[12px] text-muted">We respond within one business day.</p>
                </div>
              </FadeIn>
            </PageSection>

            <PageSection pageId="book_consultation" sectionId="expectations">
              {bulletLines.length > 0 || footerNote || title ? (
                <FadeIn delay={0.08}>
                  <div className="sticky top-32 rounded-2xl border border-hairline bg-canvas-soft p-7 lg:p-8">
                    <h2 className="font-display text-[24px] text-ink">{title}</h2>
                    {bulletLines.length > 0 ? (
                      <ul className="mt-5 space-y-3.5">
                        {bulletLines.map((text, i) => {
                          const Icon = EXPECTATION_ICONS[i] ?? Check;
                          return (
                            <li key={text} className="flex items-start gap-3 text-[14.5px] text-body">
                              <Icon className="mt-1 h-4 w-4 flex-shrink-0 text-success" />
                              <span>{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                    {footerNote ? (
                      <p className="mt-6 text-[13px] leading-relaxed text-muted">{footerNote}</p>
                    ) : null}
                  </div>
                </FadeIn>
              ) : null}
            </PageSection>
          </div>
        </Container>
      </Section>
    </>
  );
}
