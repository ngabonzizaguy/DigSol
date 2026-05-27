import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/marketing/fade-in";
import { GradientOrb } from "@/components/marketing/gradient-orb";
import { PageSection } from "@/components/marketing/page-section";
import { getInsight, getInsights } from "@/lib/content/fetchers";
import { loadMarketingPageStore, pageCtaContent } from "@/lib/marketing/marketing-page-content";

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = await getInsight(slug);
  if (!i) return {};
  return { title: i.title, description: i.excerpt };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await loadMarketingPageStore();
  const cta = pageCtaContent(store, "insights_detail");
  const [post, insights] = await Promise.all([getInsight(slug), getInsights()]);
  if (!post) notFound();
  const related = insights.filter((i) => i.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageSection pageId="insights_detail" sectionId="hero">
        <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-20">
          <GradientOrb color="lavender" className="-top-40 -left-20" size={520} slow />
          <GradientOrb color="mint" className="top-20 right-0" size={420} />
          <Container className="relative max-w-3xl">
            <FadeIn>
              <div className="flex items-center gap-2">
                <Badge>{post.category}</Badge>
                <span className="text-[12px] text-muted">{post.readTime}</span>
              </div>
              {post.cover_url ? (
                <div className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-hairline">
                  <Image
                    src={post.cover_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                  />
                </div>
              ) : null}
              <h1 className="mt-5 text-balance font-display text-display-xl text-ink">{post.title}</h1>
              <p className="mt-5 text-pretty text-[18px] leading-relaxed text-body">{post.excerpt}</p>
              <div className="mt-8 flex items-center gap-3 border-t border-hairline pt-5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-surface-strong font-display text-ink">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-[14px]">
                  <p className="font-medium text-ink">{post.author}</p>
                  <p className="text-muted">
                    {post.role} ·{" "}
                    {new Date(post.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            </FadeIn>
          </Container>
        </section>
      </PageSection>

      <PageSection pageId="insights_detail" sectionId="breadcrumbs">
        <Section className="pb-0">
          <Container className="max-w-3xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Insights", href: "/insights" },
                { label: post.title },
              ]}
            />
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights_detail" sectionId="body">
        <Section size="sm">
          <Container className="max-w-3xl">
            <article className="space-y-6 text-[17px] leading-[1.75] text-body">
              {post.body.map((para, i) => (
                <FadeIn key={i} delay={i * 0.04}>
                  <p>{para}</p>
                </FadeIn>
              ))}
            </article>
          </Container>
        </Section>
      </PageSection>

      <PageSection pageId="insights_detail" sectionId="related">
        {related.length > 0 ? (
          <Section className="border-y border-hairline bg-canvas-soft">
            <Container>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Keep reading</p>
              <h2 className="mb-10 font-display text-display-lg text-ink">More from the team.</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/insights/${p.slug}`}
                    className="group block h-full rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
                  >
                    <Badge>{p.category}</Badge>
                    <h3 className="mt-4 font-display text-[20px] leading-snug text-ink">{p.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.excerpt}</p>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </PageSection>

      <PageSection pageId="insights_detail" sectionId="cta_band">
        <CtaBand
          title={cta.title}
          subtitle={cta.subtitle}
          primaryLabel={cta.primary_label}
          primaryHref={cta.primary_href}
          secondaryLabel={cta.secondary_label}
          secondaryHref={cta.secondary_href}
        />
      </PageSection>
    </>
  );
}
