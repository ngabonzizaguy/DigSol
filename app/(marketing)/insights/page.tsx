import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { insights, guides } from "@/lib/content/insights";
import { ArrowUpRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights",
  description: "Essays, guides, and field notes on digital transformation, AI, and modern product engineering.",
};

export default function InsightsHubPage() {
  const [featured, ...rest] = insights;
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Field notes from real engagements."
        subtitle="Essays, guides, and operating-model frameworks from the team. We publish what we'd want to read."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />

          <div className="mt-10">
            <Link
              href={`/insights/${featured.slug}`}
              className="group block overflow-hidden rounded-2xl border border-hairline bg-surface-card transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
                <div className="relative aspect-[16/10] lg:aspect-auto bg-canvas-soft">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-orb-lavender/60 via-orb-mint/40 to-transparent transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <Badge>{featured.category}</Badge>
                    <span className="text-[12px] text-muted">{featured.readTime}</span>
                  </div>
                  <h2 className="mt-4 font-display text-[36px] leading-tight text-ink text-balance">{featured.title}</h2>
                  <p className="mt-3 text-[15.5px] text-muted leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-6 flex items-center gap-2 text-[14px] text-ink">
                    Read article <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <StaggerChildren className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post) => (
              <StaggerItem key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group block h-full rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-center gap-2">
                    <Badge>{post.category}</Badge>
                    <span className="text-[12px] text-muted">{post.readTime}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[22px] leading-snug text-ink">{post.title}</h3>
                  <p className="mt-2 text-[14.5px] text-muted leading-relaxed">{post.excerpt}</p>
                  <p className="mt-5 text-[12.5px] text-muted">{post.author} · {post.role}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>

      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-3">Guides</p>
              <h2 className="font-display text-display-xl text-ink">Deeper reads.</h2>
            </div>
            <Button href="/insights/guides" variant="outline">View all guides</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/insights/guides/${g.slug}`}
                className="group block rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-sans text-[18px] font-medium text-ink">{g.title}</h3>
                <p className="mt-2 text-[14px] text-muted leading-relaxed">{g.excerpt}</p>
                <p className="mt-4 text-[12px] uppercase tracking-wider text-muted">{g.format} · {g.pages} pages</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
