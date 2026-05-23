import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { insights } from "@/lib/content/insights";

export const metadata: Metadata = {
  title: "Blog",
  description: "All essays and field notes from the DigSolutions team.",
};

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Every essay we've published."
        subtitle="A growing archive of thinking on transformation, AI, design, and engineering."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Blog" }]} />
          <StaggerChildren className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {insights.map((p) => (
              <StaggerItem key={p.slug}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="group block h-full rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                >
                  <Badge>{p.category}</Badge>
                  <h3 className="mt-4 font-display text-[22px] leading-snug text-ink">{p.title}</h3>
                  <p className="mt-2 text-[14.5px] text-muted leading-relaxed">{p.excerpt}</p>
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
