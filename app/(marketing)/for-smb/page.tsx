import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/marketing/cta-band";
import { Card, CardTitle } from "@/components/ui/card";
import { caseStudies } from "@/lib/content/work";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { Check, Clock, DollarSign, Sparkles } from "lucide-react";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";

export const metadata: Metadata = {
  title: "For small businesses",
  description: "Fast, affordable digital transformation engagements for SMBs.",
};

const smbBenefits = [
  { icon: Clock, title: "4–8 week launch", body: "Ship a credible website, brand, and analytics stack within a quarter." },
  { icon: DollarSign, title: "Transparent pricing", body: "Fixed-scope projects starting at $4,900. No hidden hours." },
  { icon: Sparkles, title: "Tech we handle", body: "We host, monitor, and maintain — so you can keep selling." },
];

export default function SmbPage() {
  const smbCases = caseStudies.filter((c) => c.segment === "smb");
  return (
    <>
      <PageHero
        eyebrow="For small businesses"
        title="Credible, fast, affordable — without dropping your standards."
        subtitle="If you have a real business and an outdated website, we can have you live, instrumented, and converting within eight weeks."
      >
        <Button href="/book-consultation?intent=smb" size="lg">Start your project</Button>
        <Button href="/work" variant="outline" size="lg">See SMB case studies</Button>
      </PageHero>

      <Section>
        <Container>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {smbBenefits.map(({ icon: Icon, title, body }) => (
              <StaggerItem key={title}>
                <Card>
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">{title}</CardTitle>
                  <p className="mt-2 text-[15px] text-muted">{body}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </Section>

      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <SectionHeading eyebrow="What you get" title="The SMB Launch package." className="mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[
              "Strategic kickoff and outcome definition",
              "Brand refresh (logo, palette, type)",
              "8-page Next.js marketing site",
              "Stripe payments / commerce setup if needed",
              "GA4 + PostHog analytics and SEO foundations",
              "Hosting on Vercel + ongoing maintenance retainer (optional)",
              "Training, handover, and 30 days of post-launch support",
              "Roadmap for the next two quarters",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-surface-card border border-hairline p-4 text-[15px] text-body">
                <Check className="h-4 w-4 mt-1 text-success flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Proof" title="Recent SMB engagements." className="mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {smbCases.map((c) => (
              <CaseStudyCard key={c.slug} study={c} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Ready to launch in 8 weeks?"
        subtitle="Book a free 30-minute consultation and walk out with a roadmap — whether or not we work together."
        primaryLabel="Start your project"
        primaryHref="/book-consultation?intent=smb"
      />
    </>
  );
}
