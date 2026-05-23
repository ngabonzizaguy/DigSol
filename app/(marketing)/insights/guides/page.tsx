import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { FileText, Download } from "lucide-react";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { guides } from "@/lib/content/insights";

export const metadata: Metadata = {
  title: "Guides",
  description: "Long-form playbooks, checklists, and frameworks from the DigSolutions team.",
};

export default function GuidesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="The playbooks we use internally."
        subtitle="Pragmatic frameworks and checklists you can apply this quarter — even if we never work together."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Guides" }]} />
          <StaggerChildren className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guides.map((g) => (
              <StaggerItem key={g.slug}>
                <Link
                  href="/contact?intent=guide"
                  className="group block h-full rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-sans text-[18px] font-medium text-ink">{g.title}</h3>
                  <p className="mt-2 text-[14px] text-muted leading-relaxed">{g.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-[12px] uppercase tracking-wider text-muted">
                    <span>{g.format} · {g.pages} pages</span>
                    <span className="inline-flex items-center gap-1 text-ink"><Download className="h-3.5 w-3.5" /> Get</span>
                  </div>
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
