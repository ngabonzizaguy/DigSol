import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/marketing/fade-in";
import { openRoles } from "@/lib/content/team";

export function generateStaticParams() {
  return openRoles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = openRoles.find((o) => o.slug === slug);
  if (!r) return {};
  return { title: r.title, description: `${r.team} · ${r.location}` };
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = openRoles.find((r) => r.slug === slug);
  if (!role) notFound();
  return (
    <>
      <PageHero eyebrow={role.team} title={role.title} subtitle={`${role.type} · ${role.location}`}>
        <Button href={`mailto:hello@digsolutions.co?subject=${encodeURIComponent(role.title)}`} size="lg">Apply by email</Button>
      </PageHero>
      <Section>
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Careers", href: "/about/careers" },
              { label: role.title },
            ]}
          />
          <FadeIn className="mt-10 space-y-6 text-[16.5px] text-body leading-relaxed">
            <p>
              We're hiring a {role.title.toLowerCase()} to join our {role.team.toLowerCase()} team. You'll work on real client engagements from the start — no sales pitches, no political battles, just craft.
            </p>
            <h2 className="font-display text-[28px] text-ink mt-10">What you'll do</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Lead day-to-day delivery on 1–2 active engagements at a time.</li>
              <li>Pair closely with senior peers across design, engineering, and strategy.</li>
              <li>Help us improve our internal toolkit and operating standards.</li>
            </ul>
            <h2 className="font-display text-[28px] text-ink mt-10">What we look for</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>5+ years of relevant experience in similar engagements.</li>
              <li>Clear written communication. We work async first.</li>
              <li>Care about craft. Care about clients. Care about the team.</li>
            </ul>
            <h2 className="font-display text-[28px] text-ink mt-10">Compensation</h2>
            <p>Competitive market rates plus profit share. We share salary bands openly during the process.</p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Badge variant="outline">{role.type}</Badge>
              <Badge variant="outline">{role.location}</Badge>
            </div>
          </FadeIn>
        </Container>
      </Section>
      <CtaBand title="Ready to apply?" subtitle="Email us a short note and a portfolio or résumé." primaryLabel="Apply by email" primaryHref={`mailto:hello@digsolutions.co?subject=${encodeURIComponent(role.title)}`} secondaryLabel="" secondaryHref="" />
    </>
  );
}
