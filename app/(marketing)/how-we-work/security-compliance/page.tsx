import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { CmsPageHero } from "@/components/marketing/cms-page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Card, CardTitle } from "@/components/ui/card";
import { Shield, Lock, FileCheck, Eye } from "lucide-react";
import { PageSection } from "@/components/marketing/page-section";
import { loadMarketingPageStore, pageCtaContent, pageHeroContent } from "@/lib/marketing/marketing-page-content";

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

export default async function SecurityCompliancePage() {
  const store = await loadMarketingPageStore();
  const hero = pageHeroContent(store, "how_we_work_security");
  const cta = pageCtaContent(store, "how_we_work_security");

  return (
    <>
      <PageSection pageId="how_we_work_security" sectionId="hero">
        <CmsPageHero {...hero} />
      </PageSection>

      <PageSection pageId="how_we_work_security" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "How we work", href: "/how-we-work" },
                { label: "Security & compliance" },
              ]}
            />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work_security" sectionId="practices">
        <Section>
          <Container>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {blocks.map(({ icon: Icon, t, b }) => (
                <Card key={t}>
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">{t}</CardTitle>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{b}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="how_we_work_security" sectionId="cta_band">
        <CtaBand
          title={cta.title ?? "Need the security pack?"}
          subtitle={cta.subtitle ?? "We share our security questionnaire pack with prospective enterprise clients on request."}
          primaryLabel={cta.primary_label ?? "Request the pack"}
          primaryHref={cta.primary_href ?? "/contact?intent=security"}
          secondaryLabel={cta.secondary_label}
          secondaryHref={cta.secondary_href}
        />
      </PageSection>
    </>
  );
}
