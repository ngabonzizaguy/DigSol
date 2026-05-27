import type { Metadata } from "next";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { FadeIn } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { getQuickStartConfig } from "@/lib/marketing/quick-start-server";
import { QuickStartPageClient } from "./quick-start-page-client";

export const metadata: Metadata = {
  title: "Quick Start",
  description: "A calm, two-minute path to the right service. Tell us what you need — we'll match it.",
};

export default async function QuickStartPage() {
  const config = await getQuickStartConfig();

  return (
    <>
      <PageSection pageId="start" sectionId="hero">
        <Section className="pt-section-sm md:pt-section">
          <Container>
            <FadeIn>
              <div className="max-w-2xl space-y-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Quick Start</p>
                <h1 className="font-display text-display-xl tracking-tight text-ink">
                  {config.copy.welcome.title}
                </h1>
                <p className="text-[17px] text-body">{config.copy.welcome.body}</p>
              </div>
            </FadeIn>
          </Container>
        </Section>
      </PageSection>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
            <PageSection pageId="start" sectionId="flow">
              <FadeIn>
                <QuickStartPageClient />
              </FadeIn>
            </PageSection>

            <PageSection pageId="start" sectionId="sidebar">
              <FadeIn delay={0.08}>
                <div className="sticky top-32 rounded-2xl border border-hairline bg-canvas-soft p-7">
                  <h2 className="font-display text-[22px] text-ink">What happens next</h2>
                  <ul className="mt-5 space-y-4 text-[14.5px] text-body">
                    <li className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      <span>We reply within one business day.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      <span>Pick email, WhatsApp, or a call — your choice.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      <span>Your details stay private. We never share or sell them.</span>
                    </li>
                  </ul>
                </div>
              </FadeIn>
            </PageSection>
          </div>
        </Container>
      </Section>
    </>
  );
}
