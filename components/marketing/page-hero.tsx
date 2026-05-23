import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";
import { OrbField } from "./gradient-orb";
import { Container } from "../ui/container";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  showOrbs?: boolean;
};

export function PageHero({ eyebrow, title, subtitle, className, children, showOrbs = true }: Props) {
  return (
    <section className={cn("relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24", className)}>
      {showOrbs && <OrbField />}
      <Container className="relative">
        <FadeIn>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-5">{eyebrow}</p>
          )}
          <h1 className="font-display text-display-mega text-ink max-w-4xl text-balance">{title}</h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-body text-pretty text-[18px] leading-relaxed">{subtitle}</p>
          )}
          {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
        </FadeIn>
      </Container>
    </section>
  );
}
