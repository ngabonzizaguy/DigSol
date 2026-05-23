import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { PricingCard, pricingTiers } from "@/components/marketing/pricing-card";
import { SectionHeading } from "@/components/marketing/section-heading";

export const metadata: Metadata = {
  title: "Engagement models",
  description: "How we structure projects, retainers, and enterprise programs.",
};

export default function EngagementModelsPage() {
  return (
    <>
      <PageHero
        eyebrow="Engagement models"
        title="One company. Three ways to work together."
        subtitle="From fixed-scope projects to multi-year programs, our engagement models match the shape of your business."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How we work", href: "/how-we-work" }, { label: "Engagement models" }]} />
          <SectionHeading eyebrow="Models" title="From Launch to Enterprise." className="mt-12 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {pricingTiers.map((t) => (
              <PricingCard key={t.name} tier={t} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
