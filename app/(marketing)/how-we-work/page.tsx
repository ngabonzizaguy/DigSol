import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { ProcessStepper } from "@/components/marketing/process-stepper";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How we work",
  description: "Methodology, engagement models, and the operating standards we apply to every project.",
};

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="How we work"
        title="A method you can audit."
        subtitle="Five stages, two-week cadence, weekly demos. Everything we ship is observable, documented, and handed over with care."
      >
        <Button href="/how-we-work/methodology" size="lg">Methodology</Button>
        <Button href="/how-we-work/engagement-models" variant="outline" size="lg">Engagement models</Button>
      </PageHero>

      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How we work" }]} />
          <div className="mt-12">
            <SectionHeading eyebrow="The method" title="Discover → Design → Build → Launch → Optimise." className="mb-14" />
            <ProcessStepper />
          </div>
        </Container>
      </Section>

      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <SectionHeading eyebrow="Operating standards" title="What we hold ourselves to." className="mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: "Weekly demos", b: "Working software every Friday. No slides, no theatre." },
              { t: "Public tracking", b: "Single shared roadmap, daily Slack, real-time progress." },
              { t: "Production-only", b: "We ship behind feature flags, never to a staging-only dead-end." },
              { t: "Owned by humans", b: "Every deliverable has a named senior owner." },
              { t: "Documented", b: "Every system we hand over has a runbook and a diagram." },
              { t: "Audit-ready", b: "Compliance and security are gates, not afterthoughts." },
            ].map((s) => (
              <Card key={s.t}>
                <CardTitle>{s.t}</CardTitle>
                <p className="mt-2 text-[15px] text-muted leading-relaxed">{s.b}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
