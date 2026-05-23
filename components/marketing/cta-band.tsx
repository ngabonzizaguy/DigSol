import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { FadeIn } from "./fade-in";
import { GradientOrb } from "./gradient-orb";

type Props = {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "dark" | "light";
};

export function CtaBand({
  title = "Ready to transform your business?",
  subtitle = "Book a free 30-minute consultation and walk away with three concrete next steps — whether or not we work together.",
  primaryLabel = "Book consultation",
  primaryHref = "/book-consultation",
  secondaryLabel = "See our work",
  secondaryHref = "/work",
  variant = "dark",
}: Props) {
  const isDark = variant === "dark";
  return (
    <section
      className={
        isDark
          ? "relative overflow-hidden bg-surface-dark text-on-dark py-section-sm lg:py-section"
          : "relative overflow-hidden bg-canvas-soft py-section-sm lg:py-section"
      }
    >
      {!isDark && <GradientOrb color="lavender" className="-top-20 right-10" size={520} />}
      {isDark && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(closest-side, #c8b8e0, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(closest-side, #a7e5d3, transparent 70%)" }}
          />
        </>
      )}
      <Container className="relative text-center">
        <FadeIn>
          <h2
            className={
              isDark
                ? "font-display text-display-xl text-on-dark text-balance"
                : "font-display text-display-xl text-ink text-balance"
            }
          >
            {title}
          </h2>
          <p
            className={
              isDark
                ? "mt-5 max-w-2xl mx-auto text-on-dark-soft text-pretty text-[17px]"
                : "mt-5 max-w-2xl mx-auto text-body text-pretty text-[17px]"
            }
          >
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={primaryHref} variant={isDark ? "dark" : "primary"} size="lg">
              {primaryLabel}
            </Button>
            {secondaryLabel && (
              <Button
                href={secondaryHref}
                variant={isDark ? "glass" : "outline"}
                size="lg"
              >
                {secondaryLabel}
              </Button>
            )}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
