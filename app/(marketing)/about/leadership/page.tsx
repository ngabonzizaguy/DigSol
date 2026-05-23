import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import { leadership } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet the people behind DigSolutions.",
};

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="The people you'll actually work with."
        subtitle="No bait-and-switch. The senior team named here is on every engagement, by design."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Leadership" }]} />
          <StaggerChildren className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {leadership.map((p) => (
              <StaggerItem key={p.name}>
                <div className="h-full rounded-2xl border border-hairline bg-surface-card p-6">
                  <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-orb-lavender/40 via-orb-mint/40 to-orb-peach/40" aria-hidden />
                  <h3 className="mt-5 font-display text-[22px] text-ink">{p.name}</h3>
                  <p className="text-[13px] uppercase tracking-wider text-muted mt-1">{p.role}</p>
                  <p className="mt-3 text-[14.5px] text-body leading-relaxed">{p.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
