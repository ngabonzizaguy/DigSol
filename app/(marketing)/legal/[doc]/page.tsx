import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { FadeIn } from "@/components/marketing/fade-in";

const docs: Record<string, { title: string; description: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy policy",
    description: "How we collect, use, and protect your data.",
    sections: [
      { heading: "Overview", body: "DigSolutions ('we', 'us', 'our') respects your privacy. This policy explains what data we collect and how we use it." },
      { heading: "Data we collect", body: "We collect data you give us directly (form submissions, emails), data from usage of our site (cookies, analytics), and data from our service relationships." },
      { heading: "How we use data", body: "We use data to provide and improve our services, communicate with you, and comply with legal obligations. We never sell your data." },
      { heading: "Your rights", body: "You may request access, correction, or deletion of your personal data at any time by emailing privacy@digsolutions.co." },
      { heading: "Contact", body: "Questions about this policy? Email privacy@digsolutions.co." },
    ],
  },
  terms: {
    title: "Terms of use",
    description: "The legal terms governing use of digsolutions.co.",
    sections: [
      { heading: "Acceptance", body: "By using this site you accept these terms. If you don't accept them, please leave the site." },
      { heading: "Use of content", body: "All content on this site is the property of DigSolutions or its licensors. You may not reproduce or redistribute it without permission." },
      { heading: "Limitation of liability", body: "We provide the site 'as is'. We are not liable for any indirect, incidental, or consequential damages arising from your use of the site." },
      { heading: "Governing law", body: "These terms are governed by the laws of Rwanda. Any disputes will be resolved in the courts of Kigali." },
    ],
  },
  cookies: {
    title: "Cookie policy",
    description: "How and why we use cookies on this site.",
    sections: [
      { heading: "What are cookies?", body: "Cookies are small text files stored on your device. We use them to make the site work, to analyse usage, and to improve your experience." },
      { heading: "Cookies we use", body: "We use first-party analytics (PostHog and GA4) and essential cookies for site functionality. We do not run third-party advertising cookies." },
      { heading: "Your choices", body: "You can disable cookies in your browser. Some site features may not work correctly with cookies disabled." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc: docKey } = await params;
  const d = docs[docKey];
  if (!d) return {};
  return { title: d.title, description: d.description };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc: docKey } = await params;
  const doc = docs[docKey];
  if (!doc) notFound();
  return (
    <>
      <PageHero eyebrow="Legal" title={doc.title} subtitle={doc.description} />
      <Section size="sm">
        <Container className="max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: doc.title }]} />
          <div className="mt-10 space-y-8">
            {doc.sections.map((s, i) => (
              <FadeIn key={s.heading} delay={i * 0.04}>
                <h2 className="font-display text-[26px] text-ink">{s.heading}</h2>
                <p className="mt-3 text-[16px] text-body leading-relaxed">{s.body}</p>
              </FadeIn>
            ))}
            <p className="pt-6 text-[13px] text-muted">Last updated: May 2026</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
