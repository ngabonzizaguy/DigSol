import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { FadeIn } from "@/components/marketing/fade-in";

const faqs = [
  {
    q: "What size companies do you work with?",
    a: "Everything from 5-person businesses to 5,000-person enterprises. Our engagement models scale from fixed-scope Launch projects through multi-quarter Enterprise programs.",
  },
  {
    q: "How long does a typical project take?",
    a: "SMB projects run 4–8 weeks. Mid-market engagements are typically 3–6 months. Enterprise programs run 6–24 months in coordinated workstreams.",
  },
  {
    q: "Do you work on retainer?",
    a: "Yes — most clients stay on a retainer after launch for ongoing optimisation, hosting, and net-new work. Retainers start at $4,900/month.",
  },
  {
    q: "Can you sign NDAs and MSAs?",
    a: "Absolutely. We sign mutual NDAs before any technical discussion, and we work under client MSAs as well as our own.",
  },
  {
    q: "Where is your team based?",
    a: "We're a distributed team headquartered in Kigali with operations in London. The team covers four continents.",
  },
  {
    q: "Do you guarantee outcomes?",
    a: "We guarantee process and craft. We can't guarantee market outcomes, but we'll commit to measurable milestones and we share progress weekly.",
  },
  {
    q: "Will senior people actually work on my project?",
    a: "Yes. The people listed on our Leadership page are on every engagement by design. No bait-and-switch.",
  },
  {
    q: "What's your stance on AI?",
    a: "Tasteful and useful. Every engagement ships at least one production AI workflow, monitored like any other piece of software. We're allergic to AI theatre.",
  },
];

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about how we work, pricing, and engagement.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Common questions, plain answers." />
      <Section>
        <Container className="max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
          <div className="mt-10 space-y-4">
            {faqs.map((f, i) => (
              <FadeIn key={f.q} delay={i * 0.04}>
                <details className="group rounded-2xl border border-hairline bg-surface-card p-6 lg:p-7 transition-all hover:border-hairline-strong">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-6 font-display text-[20px] text-ink">
                    {f.q}
                    <span className="font-sans text-2xl text-muted transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-[15.5px] text-body leading-relaxed">{f.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
