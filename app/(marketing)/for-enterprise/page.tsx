import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/marketing/cta-band";
import { caseStudies } from "@/lib/content/work";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { Shield, Users, Layers, Workflow } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";

export const metadata: Metadata = {
  title: "For enterprise",
  description: "Multi-workstream digital transformation programs with governance, security, and dedicated delivery pods.",
};

const pillars = [
  { icon: Shield, title: "Governed delivery", body: "Steering committees, change advisory, security gates, and audit-ready documentation." },
  { icon: Users, title: "Dedicated squads", body: "Pods of 4–8 specialists per workstream — design, engineering, data, AI, change." },
  { icon: Layers, title: "Multi-workstream", body: "Run brand, product, data, automation, and migration tracks in parallel without losing coherence." },
  { icon: Workflow, title: "Change adoption", body: "Communications, training, and enablement baked in — not bolted on at the end." },
];

export default function EnterprisePage() {
  const entCases = caseStudies.filter((c) => c.segment === "enterprise" || c.segment === "midmarket");
  return (
    <>
      <PageHero
        eyebrow="For enterprise"
        title="Transformation programs that survive contact with the org chart."
        subtitle="We bring the discipline of top-tier consultancies and the velocity of a product team. Multi-workstream, multi-quarter engagements with executive air cover."
      >
        <Button href="/contact?intent=enterprise" size="lg">Request enterprise briefing</Button>
        <Button href="/how-we-work/methodology" variant="outline" size="lg">Read methodology</Button>
      </PageHero>

      <Section>
        <Container>
          <SectionHeading eyebrow="Pillars" title="What enterprise teams get." className="mb-10" />
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map(({ icon: Icon, title, body }) => (
              <StaggerItem key={title}>
                <Card>
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">{title}</CardTitle>
                  <p className="mt-2 text-[15px] text-muted leading-relaxed">{body}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>

      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <SectionHeading eyebrow="Engagement shape" title="A typical 12-month enterprise program." className="mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[
              { phase: "Months 0–3", title: "Diagnose & roadmap", body: "Workshops, audits, current-state architecture, target-state, prioritised roadmap." },
              { phase: "Months 3–9", title: "Build & migrate", body: "Parallel workstreams ship in two-week increments. Shadow infrastructure and phased cutover." },
              { phase: "Months 9–12+", title: "Operate & optimise", body: "Steady-state managed services, experimentation, adoption metrics, executive review cadence." },
            ].map((b) => (
              <Card key={b.phase}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{b.phase}</p>
                <CardTitle className="mt-2">{b.title}</CardTitle>
                <p className="mt-2 text-[15px] text-muted leading-relaxed">{b.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Proof" title="Mid-market and enterprise outcomes." className="mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {entCases.map((c) => (
              <CaseStudyCard key={c.slug} study={c} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Brief our enterprise team."
        subtitle="We respond within one business day with a tailored discussion guide and proposed agenda."
        primaryLabel="Request briefing"
        primaryHref="/contact?intent=enterprise"
        secondaryLabel="Security & compliance"
        secondaryHref="/how-we-work/security-compliance"
      />
    </>
  );
}
