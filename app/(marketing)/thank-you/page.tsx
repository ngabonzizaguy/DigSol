import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GradientOrb } from "@/components/marketing/gradient-orb";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore } from "@/lib/marketing/marketing-page-content";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank you",
  description: "We've received your message.",
};

export default async function ThankYouPage() {
  const store = await loadMarketingPageStore();
  const confirmation = getSectionContent<{ title?: string; body?: string }>(store, "thank_you", "confirmation");
  const confirmTitle = confirmation.title?.trim() || "Thanks — we'll be in touch.";
  const confirmBody = confirmation.body?.trim();

  return (
    <Section className="relative grid min-h-[80vh] place-items-center overflow-hidden pt-32 lg:pt-40">
      <GradientOrb color="mint" className="-top-20 -left-20" size={520} slow />
      <GradientOrb color="lavender" className="-bottom-32 right-0" size={480} />
      <Container className="relative max-w-2xl text-center">
        <PageSection pageId="thank_you" sectionId="confirmation">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-hairline-strong bg-surface-card">
            <Check className="h-6 w-6 text-success" />
          </div>
          <h1 className="mt-6 text-balance font-display text-display-xl text-ink">{confirmTitle}</h1>
          {confirmBody ? (
            <p className="mt-5 text-pretty text-[18px] leading-relaxed text-body">{confirmBody}</p>
          ) : null}
        </PageSection>

        <PageSection pageId="thank_you" sectionId="next_steps">
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/insights" size="lg">
              Read insights
            </Button>
            <Button href="/work" variant="outline" size="lg">
              See our work
            </Button>
          </div>
        </PageSection>
      </Container>
    </Section>
  );
}
