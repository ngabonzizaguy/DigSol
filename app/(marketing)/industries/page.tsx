import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { industries } from "@/lib/content/industries";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries",
  description: "Vertical expertise across healthcare, financial services, manufacturing, retail, professional services, and public sector.",
};

export default function IndustriesHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Vertical context. Universal craft."
        subtitle="We bring deep knowledge of six core industries — and apply the same standards of design, engineering, and delivery to all of them."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Industries" }]} />
          <StaggerChildren className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((i) => (
              <StaggerItem key={i.slug}>
                <Link
                  href={`/industries/${i.slug}`}
                  className="group block h-full rounded-2xl border border-hairline bg-surface-card p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-[26px] text-ink">{i.name}</h3>
                    <ArrowUpRight className="h-5 w-5 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                  </div>
                  <p className="mt-3 text-[15px] text-muted leading-relaxed">{i.short}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
