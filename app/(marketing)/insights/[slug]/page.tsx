import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/marketing/fade-in";
import { GradientOrb } from "@/components/marketing/gradient-orb";
import { getInsight, insights } from "@/lib/content/insights";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = getInsight(slug);
  if (!i) return {};
  return { title: i.title, description: i.excerpt };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) notFound();
  const related = insights.filter((i) => i.slug !== post.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-20">
        <GradientOrb color="lavender" className="-top-40 -left-20" size={520} slow />
        <GradientOrb color="mint" className="top-20 right-0" size={420} />
        <Container className="relative max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Insights", href: "/insights" },
              { label: post.title },
            ]}
          />
          <FadeIn>
            <div className="mt-8 flex items-center gap-2">
              <Badge>{post.category}</Badge>
              <span className="text-[12px] text-muted">{post.readTime}</span>
            </div>
            <h1 className="mt-5 font-display text-display-xl text-ink text-balance">{post.title}</h1>
            <p className="mt-5 text-[18px] text-body text-pretty leading-relaxed">{post.excerpt}</p>
            <div className="mt-8 flex items-center gap-3 border-t border-hairline pt-5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-surface-strong font-display text-ink">
                {post.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="text-[14px]">
                <p className="font-medium text-ink">{post.author}</p>
                <p className="text-muted">{post.role} · {new Date(post.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

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

      <Section className="bg-canvas-soft border-y border-hairline">
        <Container>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-3">Keep reading</p>
          <h2 className="font-display text-display-lg text-ink mb-10">More from the team.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/insights/${p.slug}`}
                className="group block h-full rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift"
              >
                <Badge>{p.category}</Badge>
                <h3 className="mt-4 font-display text-[20px] leading-snug text-ink">{p.title}</h3>
                <p className="mt-2 text-[14px] text-muted leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
