import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/marketing/fade-in";
import { PageSection } from "@/components/marketing/page-section";
import { getOpenRole, getOpenRoles } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent } from "@/lib/marketing/marketing-page-content";

export async function generateStaticParams() {
  const openRoles = await getOpenRoles();
  return openRoles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await getOpenRole(slug);
  if (!r) return {};
  return { title: r.title, description: `${r.team} · ${r.location}` };
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await loadMarketingPageStore();
  const cta = pageCtaContent(store, "about_careers_detail");
  const role = await getOpenRole(slug);
  if (!role) notFound();

  return (
    <>
      <PageSection pageId="about_careers_detail" sectionId="hero">
        <PageHero eyebrow={role.team} title={role.title} subtitle={`${role.type} · ${role.location}`}>
          <Button href={`mailto:hello@digsolutions.co?subject=${encodeURIComponent(role.title)}`} size="lg">
            Apply by email
          </Button>
        </PageHero>
      </PageSection>

      <PageSection pageId="about_careers_detail" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container className="max-w-3xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Careers", href: "/about/careers" },
                { label: role.title },
              ]}
            />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_careers_detail" sectionId="description">
        <Section>
          <Container className="max-w-3xl">
            <FadeIn className="space-y-6 text-[16.5px] leading-relaxed text-body">
              <p>
                We're hiring a {role.title.toLowerCase()} to join our {role.team.toLowerCase()} team. You'll work on real
                client engagements from the start — no sales pitches, no political battles, just craft.
              </p>
              <h2 className="mt-10 font-display text-[28px] text-ink">What you'll do</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Lead day-to-day delivery on 1–2 active engagements at a time.</li>
                <li>Pair closely with senior peers across design, engineering, and strategy.</li>
                <li>Help us improve our internal toolkit and operating standards.</li>
              </ul>
              <h2 className="mt-10 font-display text-[28px] text-ink">What we look for</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>5+ years of relevant experience in similar engagements.</li>
                <li>Clear written communication. We work async first.</li>
                <li>Care about craft. Care about clients. Care about the team.</li>
              </ul>
              <h2 className="mt-10 font-display text-[28px] text-ink">Compensation</h2>
              <p>Competitive market rates plus profit share. We share salary bands openly during the process.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge variant="outline">{role.type}</Badge>
                <Badge variant="outline">{role.location}</Badge>
              </div>
            </FadeIn>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_careers_detail" sectionId="apply_cta">
        <Section className="border-y border-hairline bg-canvas-soft">
          <Container className="max-w-3xl text-center">
            <h2 className="font-display text-display-lg text-ink">Ready to apply?</h2>
            <p className="mt-3 text-[16px] text-muted">Email us a short note and a portfolio or résumé.</p>
            <Button
              href={`mailto:hello@digsolutions.co?subject=${encodeURIComponent(role.title)}`}
              className="mt-6"
              size="lg"
            >
              Apply by email
            </Button>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="about_careers_detail" sectionId="cta_band">
        <CtaBand
          title={cta.title ?? "Ready to apply?"}
          subtitle={cta.subtitle ?? "Email us a short note and a portfolio or résumé."}
          primaryLabel={cta.primary_label ?? "Apply by email"}
          primaryHref={cta.primary_href ?? `mailto:hello@digsolutions.co?subject=${encodeURIComponent(role.title)}`}
          secondaryLabel={cta.secondary_label}
          secondaryHref={cta.secondary_href}
        />
      </PageSection>
    </>
  );
}
