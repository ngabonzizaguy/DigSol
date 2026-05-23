import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Card, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Partners",
  description: "Our technology and alliance partners.",
};

const tiers = [
  { tier: "Platform partners", names: ["Vercel", "AWS", "Stripe", "Supabase", "HubSpot", "Shopify"] },
  { tier: "Technology partners", names: ["OpenAI", "Anthropic", "Cloudflare", "PostHog", "Sanity", "Resend"] },
  { tier: "Ecosystem & alliances", names: ["Local chambers of commerce", "Accounting partner network", "Startup accelerators"] },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="The shoulders we stand on."
        subtitle="Our partner ecosystem accelerates delivery, unlocks pricing, and shortens time to value for clients."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Partners" }]} />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {tiers.map((t) => (
              <Card key={t.tier}>
                <CardTitle>{t.tier}</CardTitle>
                <ul className="mt-4 space-y-2">
                  {t.names.map((n) => (
                    <li key={n} className="text-[15px] text-body">{n}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
