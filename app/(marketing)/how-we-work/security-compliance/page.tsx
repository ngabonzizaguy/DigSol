import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Card, CardTitle } from "@/components/ui/card";
import { Shield, Lock, FileCheck, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & compliance",
  description: "How DigSolutions builds, hosts, and operates client systems securely.",
};

const blocks = [
  { icon: Shield, t: "Defence in depth", b: "Layered controls across identity, network, data, and application. Least-privilege by default." },
  { icon: Lock, t: "Encryption everywhere", b: "TLS 1.3 in transit, AES-256 at rest. Customer-managed keys available on enterprise engagements." },
  { icon: FileCheck, t: "Audit-ready", b: "SOC 2 Type II ready posture, GDPR / HIPAA aware practices, documented runbooks for every system." },
  { icon: Eye, t: "Observable systems", b: "Centralised logging, on-call rotations, SLO-based alerting. No silent failures." },
];

export default function SecurityCompliancePage() {
  return (
    <>
      <PageHero
        eyebrow="Security & compliance"
        title="Trust by construction, not by appendix."
        subtitle="We treat security and compliance as engineering work — embedded in the build, not bolted on at the end."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How we work", href: "/how-we-work" }, { label: "Security & compliance" }]} />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            {blocks.map(({ icon: Icon, t, b }) => (
              <Card key={t}>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-4">{t}</CardTitle>
                <p className="mt-2 text-[15px] text-muted leading-relaxed">{b}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand title="Need the security pack?" subtitle="We share our security questionnaire pack with prospective enterprise clients on request." primaryLabel="Request the pack" primaryHref="/contact?intent=security" secondaryLabel="" secondaryHref="" />
    </>
  );
}
