import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { ConsultationForm } from "@/components/marketing/consultation-form";
import { FadeIn } from "@/components/marketing/fade-in";
import { Check, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Free 30-minute consultation. No pitch deck. Three concrete takeaways.",
};

export default function BookConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="Free consultation"
        title="Thirty minutes. No pitch deck."
        subtitle="Tell us your situation. We'll respond within one business day with three concrete next steps — whether or not we work together."
      />
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12">
            <FadeIn>
              <div className="rounded-2xl border border-hairline bg-surface-card p-8 lg:p-10 shadow-soft">
                <ConsultationForm />
                <p className="mt-5 text-[12px] text-muted">We respond within one business day.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="rounded-2xl border border-hairline bg-canvas-soft p-7 lg:p-8 sticky top-32">
                <h2 className="font-display text-[24px] text-ink">What to expect.</h2>
                <ul className="mt-5 space-y-3.5">
                  {[
                    { icon: Clock, text: "30-minute video call" },
                    { icon: Calendar, text: "Scheduled within 5 business days" },
                    { icon: Check, text: "Three concrete takeaways — every time" },
                    { icon: Check, text: "No follow-up unless you ask" },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3 text-[14.5px] text-body">
                      <Icon className="h-4 w-4 mt-1 text-success flex-shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[13px] text-muted leading-relaxed">
                  We don't take every call — we screen for fit. If we're not the right partner, we'll say so and point you somewhere better.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </>
  );
}
