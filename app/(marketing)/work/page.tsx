import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { caseStudies } from "@/lib/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected case studies across SMB, mid-market, and enterprise — with the metrics that actually moved.",
};

export default function WorkHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Outcomes shipped, not slides."
        subtitle="A growing library of engagements across SMB, mid-market, and enterprise. Each case study is the real story — challenges, approach, and metrics that actually moved."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
          <StaggerChildren className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {caseStudies.map((c, i) => (
              <StaggerItem key={c.slug} className={i === 0 ? "lg:col-span-2" : ""}>
                <CaseStudyCard study={c} featured={i === 0} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
