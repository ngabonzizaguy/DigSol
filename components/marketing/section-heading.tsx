import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, align = "left", className }: Props) {
  return (
    <FadeIn className={cn(align === "center" && "text-center mx-auto", "max-w-3xl", className)}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-4">{eyebrow}</p>
      )}
      <h2 className="font-display text-display-xl text-ink text-balance">{title}</h2>
      {subtitle && <p className="mt-5 text-body text-pretty text-[17px] leading-relaxed">{subtitle}</p>}
    </FadeIn>
  );
}
