import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Card, CardTitle } from "@/components/ui/card";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";

export const metadata: Metadata = {
  title: "About",
  description: "Who we are, what we believe, and how we work.",
};

const values = [
  { title: "Outcomes over output", body: "We measure ourselves on what changed in the business, not how many decks shipped." },
  { title: "Quiet craft", body: "We avoid hype. We build calm, durable systems and write down what we learn." },
  { title: "Accountability", body: "One team, one lead, one Slack channel. You always know who owns what." },
  { title: "Plain language", body: "If we can't explain it to your COO in two minutes, we don't ship it." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A small, senior team. A clear way of working."
        subtitle="We started DigSolutions because we wanted the discipline of top-tier consulting and the velocity of a product team, with none of the politics. A few years and a hundred projects later, that's still the company we're trying to build."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        </Container>
      </Section>

      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <SectionHeading eyebrow="Values" title="Four beliefs the team agrees on." className="mb-10" />
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <Card>
                  <CardTitle>{v.title}</CardTitle>
                  <p className="mt-2 text-[15px] text-muted leading-relaxed">{v.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Company" title="Where we are." className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { city: "Kigali", country: "Rwanda" },
              { city: "London", country: "United Kingdom" },
              { city: "Remote", country: "Distributed across 4 continents" },
            ].map((loc) => (
              <Card key={loc.city}>
                <CardTitle>{loc.city}</CardTitle>
                <p className="mt-2 text-[15px] text-muted">{loc.country}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand title="Want to know more?" subtitle="The fastest way to understand us is to talk to us." primaryLabel="Book a call" />
    </>
  );
}
