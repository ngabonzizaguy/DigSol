import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { ContactForm } from "@/components/marketing/contact-form";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/marketing/fade-in";
import { site } from "@/lib/site";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the DigSolutions team.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Tell us what you're trying to build." subtitle="We respond to every message within one business day." />
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
            <FadeIn>
              <div className="rounded-2xl border border-hairline bg-surface-card p-8 lg:p-10 shadow-soft">
                <ContactForm />
                <p className="mt-5 text-[12px] text-muted">
                  By submitting this form you agree to our privacy policy. We never share your details.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.08} className="space-y-6">
              <div className="rounded-2xl border border-hairline bg-canvas-soft p-7">
                <h2 className="font-display text-[24px] text-ink">Other ways to reach us.</h2>
                <ul className="mt-5 space-y-4">
                  <li className="flex items-start gap-3">
                    <Mail className="h-4 w-4 mt-1 text-muted flex-shrink-0" />
                    <a href={`mailto:${site.email}`} className="text-ink hover:underline">{site.email}</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-1 text-muted flex-shrink-0" />
                    <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-ink hover:underline">{site.phone}</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted flex-shrink-0" />
                    <span className="text-body">Kigali · London · Remote</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-hairline bg-surface-card p-7">
                <h2 className="font-display text-[24px] text-ink">Prefer a call?</h2>
                <p className="mt-2 text-[15px] text-muted leading-relaxed">Book a free 30-minute consultation with no pitch deck and three concrete takeaways.</p>
                <Button href="/book-consultation" className="mt-5 w-full">Book consultation</Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </>
  );
}
