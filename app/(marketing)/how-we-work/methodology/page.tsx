import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { ProcessStepper } from "@/components/marketing/process-stepper";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Card, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/marketing/fade-in";

export const metadata: Metadata = {
  title: "Methodology",
  description: "Our delivery methodology — frameworks, cadence, and quality bars.",
};

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Methodology"
        title="The frameworks behind every engagement."
        subtitle="Equal parts top-tier consulting and modern product engineering. Designed to scale from a four-week SMB project to a four-year enterprise program."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How we work", href: "/how-we-work" }, { label: "Methodology" }]} />
          <SectionHeading eyebrow="Cadence" title="Five stages. Two-week sprints. Friday demos." className="mt-12 mb-14" />
          <ProcessStepper />
        </Container>
      </Section>

      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <SectionHeading eyebrow="Frameworks" title="What lives in our toolkit." className="mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: "Digital maturity audit", b: "A 12-dimension scorecard used in the first week of every engagement." },
              { t: "Outcome trees", b: "We map every initiative to a business outcome and a single accountable owner." },
              { t: "Domain-driven design", b: "Bounded contexts, ubiquitous language, event-storming for enterprise data work." },
              { t: "Evaluation-first AI", b: "Every AI workflow ships with a written eval set and a monitoring plan." },
              { t: "Design tokens & systems", b: "Token-first design libraries that survive engineering handoff." },
              { t: "Friday demos", b: "Every Friday: working software, decisions made, decisions needed." },
            ].map((s) => (
              <Card key={s.t}>
                <CardTitle>{s.t}</CardTitle>
                <p className="mt-2 text-[15px] text-muted leading-relaxed">{s.b}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <FadeIn>
            <h2 className="font-display text-display-xl text-ink text-balance max-w-3xl">A note on velocity.</h2>
            <p className="mt-4 max-w-2xl text-[17px] text-body leading-relaxed">
              The single biggest predictor of engagement success is the speed of the first decision. We aim to make the first material decision within seven business days — not seventy.
            </p>
          </FadeIn>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
