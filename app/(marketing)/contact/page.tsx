import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { ContactForm } from "@/components/marketing/contact-form";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageHeroContent } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import { getSiteSettings } from "@/lib/marketing/site-settings-server";
import { getQuickStartConfig } from "@/lib/marketing/quick-start-server";
import { getAiSettings } from "@/lib/ai/settings";
import { site } from "@/lib/site";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the DigSolutions team.",
};

export default async function ContactPage() {
  const [store, settings, ai, qs] = await Promise.all([
    loadMarketingPageStore(),
    getSiteSettings(),
    getAiSettings(),
    getQuickStartConfig(),
  ]);
  const hero = pageHeroContent(store, "contact");
  const email = settings.contact.email?.trim() || site.email;
  const phone = settings.contact.phone?.trim() || site.phone;
  const formSection = getSectionContent<{ ai_assist_enabled?: boolean }>(store, "contact", "form");
  const aiAssistEnabled = ai.contact_assist_enabled || formSection.ai_assist_enabled === true;
  const sidebar = getSectionContent<{
    contact_title?: string;
    locations?: string;
    booking_title?: string;
    booking_body?: string;
    booking_cta?: string;
  }>(store, "contact", "sidebar_contact");

  return (
    <>
      <PageSection pageId="contact" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
            <PageSection pageId="contact" sectionId="form">
              <FadeIn>
                <div className="rounded-2xl border border-hairline bg-surface-card p-8 shadow-soft lg:p-10">
                  <ContactForm
                    aiAssistEnabled={aiAssistEnabled}
                    whatsappNumber={qs.whatsapp.number_e164 || undefined}
                    defaultCountry={qs.whatsapp.default_country}
                  />
                  <p className="mt-5 text-[12px] text-muted">
                    By submitting this form you agree to our privacy policy. We never share your details.
                  </p>
                </div>
              </FadeIn>
            </PageSection>

            <div className="space-y-6">
              <PageSection pageId="contact" sectionId="sidebar_contact">
                <FadeIn delay={0.08}>
                  <div className="rounded-2xl border border-hairline bg-canvas-soft p-7">
                    {sidebar.contact_title?.trim() ? (
                      <h2 className="font-display text-[24px] text-ink">{sidebar.contact_title}</h2>
                    ) : null}
                    <ul className="mt-5 space-y-4">
                      <li className="flex items-start gap-3">
                        <Mail className="mt-1 h-4 w-4 flex-shrink-0 text-muted" />
                        <a href={`mailto:${email}`} className="text-ink hover:underline">
                          {email}
                        </a>
                      </li>
                      <li className="flex items-start gap-3">
                        <Phone className="mt-1 h-4 w-4 flex-shrink-0 text-muted" />
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-ink hover:underline">
                          {phone}
                        </a>
                      </li>
                      <li className="flex items-start gap-3">
                        <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-muted" />
                        {sidebar.locations?.trim() ? (
                          <span className="text-body">{sidebar.locations}</span>
                        ) : null}
                      </li>
                    </ul>
                  </div>
                </FadeIn>
              </PageSection>

              <PageSection pageId="contact" sectionId="sidebar_booking">
                <FadeIn delay={0.12}>
                  <div className="rounded-2xl border border-hairline bg-surface-card p-7">
                    {sidebar.booking_title?.trim() ? (
                      <h2 className="font-display text-[24px] text-ink">{sidebar.booking_title}</h2>
                    ) : null}
                    {sidebar.booking_body?.trim() ? (
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{sidebar.booking_body}</p>
                    ) : null}
                    {sidebar.booking_cta?.trim() ? (
                      <Button href="/book-consultation" className="mt-5 w-full">
                        {sidebar.booking_cta}
                      </Button>
                    ) : null}
                  </div>
                </FadeIn>
              </PageSection>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
