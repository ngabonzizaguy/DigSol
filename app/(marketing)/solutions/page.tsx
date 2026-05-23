import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { ServiceCard } from "@/components/marketing/service-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Eight pillars of digital transformation — from strategy to AI, CRM, payments, and cloud.",
};

export default function SolutionsHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Eight pillars. One accountable partner."
        subtitle="Pick the pillars that move the needle for your business — or partner with us on the whole transformation. Every engagement is shaped around outcomes, not deliverable lists."
      >
        <Button href="/book-consultation" size="lg">Book consultation</Button>
        <Button href="/work" variant="outline" size="lg">See outcomes</Button>
      </PageHero>

      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Solutions" }]} />
          <StaggerChildren className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <ServiceCard service={s} className="h-full" />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
