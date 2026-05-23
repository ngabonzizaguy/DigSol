import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { openRoles } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles and what it's like to work at DigSolutions.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Senior people, real engagements, room to think."
        subtitle="Small team. High autonomy. No politics. We hire for taste and curiosity."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Careers" }]} />
          <div className="mt-10 rounded-2xl border border-hairline bg-surface-card divide-y divide-hairline">
            {openRoles.map((r) => (
              <Link
                key={r.slug}
                href={`/about/careers/${r.slug}`}
                className="group flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between p-6 lg:p-7 transition hover:bg-canvas-soft"
              >
                <div>
                  <h3 className="font-display text-[22px] text-ink">{r.title}</h3>
                  <p className="mt-1 text-[13px] uppercase tracking-wider text-muted">{r.team} · {r.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{r.type}</Badge>
                  <ArrowUpRight className="h-5 w-5 text-muted group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand title="Don't see your role?" subtitle="We're always interested in hearing from senior people who like our work." primaryLabel="Get in touch" primaryHref="/contact?intent=careers" secondaryLabel="" secondaryHref="" />
    </>
  );
}
